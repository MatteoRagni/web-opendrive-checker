import { loadPyodide } from 'pyodide';

/**
 * Web Worker for running OpenDRIVE Pyodide checkers asynchronously.
 * This ensures the main UI thread remains unblocked during heavy Python processing.
 */

let pyodide = null;

const localConf = {
  pyodideRelease: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
  deps: ["lxml", "pydantic", "pydantic-xml", "numpy", "scipy", "xmlschema", "semver"],
  localDeps: [
    "/asam_qc_baselib-1.0.0-py3-none-any.whl",
    "/asam_qc_opendrive-1.0.0-py3-none-any.whl"
  ],
  pythonCode: `
      import traceback
      try:
          from qc_baselib import Configuration, Result
          from qc_opendrive.main import run_checks
          from qc_opendrive import constants, version
          
          config = Configuration()
          # Load configuration from our virtual filesystem
          config.load_from_file(xml_file_path="/config.xqar")

          result = Result()
          result.register_checker_bundle(
              name=constants.BUNDLE_NAME,
              description="OpenDrive checker bundle",
              version=constants.BUNDLE_VERSION,
              summary="",
          )
          result.set_result_version(version=constants.BUNDLE_VERSION)

          run_checks(config, result)
          result.copy_param_from_config(config)

          # Write out the final results
          result_file = config.get_checker_bundle_param(
              checker_bundle_name=constants.BUNDLE_NAME, param_name="resultFile"
          )
          result.write_to_file(result_file, generate_summary=True)
      except Exception as e:
          print("Python Execution Error: ", traceback.format_exc())
          raise e
    `
}

// Helper to send logs to main thread
const sendLog = (type, message) => {
  self.postMessage({ type: 'LOG', logType: type, content: message });
};

// Helper to send progress updates to main thread
const updateProgress = (progress, text) => {
  self.postMessage({ type: 'PROGRESS', progress, text });
};

async function initPyodide() {
  if (pyodide) return;

  try {
    updateProgress(10, "Loading Python (Pyodide core)...");

    // In a Vite environment or normal web environment, pointing to CDN is safe.
    pyodide = await loadPyodide({
      indexURL: localConf.pyodideRelease,
      // Redirect Pyodide's internal stdout/stderr directly
      stdout: (msg) => sendLog('stdout', msg),
      stderr: (msg) => sendLog('stderr', msg)
    });
    sendLog('stdout', "python: loaded interpreter");

    updateProgress(15, "Installing base Python modules...");
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    sendLog('stdout', "python: loaded micropip");

    updateProgress(20, "Installing specific dependencies (numpy, scipy, lxml)...");
    for (let dep of localConf.deps) {
      await micropip.install(dep);
      sendLog('stdout', `pip: installed dependency: ${dep}`);
    }

    updateProgress(30, "Installing local checker packages...");
    // Local wheels must be reachable from where the worker runs. 
    // Usually fetching from root / works for assets inside public dir.
    for (let dep of localConf.localDeps) {
      // In a production build, these relative paths resolve against the domain root.
      await pyodide.loadPackage(location.origin + dep);
      sendLog('stdout', `python: loaded local package: ${dep}`);
    }

    updateProgress(50, "Pyodide initialization complete.");
  } catch (err) {
    sendLog('stderr', err.toString());
    self.postMessage({ type: 'ERROR', content: "Failed to initialize Pyodide: " + err.message });
    throw err;
  }
}

async function runAnalysis(xodrContent, configContent) {
  try {
    updateProgress(55, "Writing files to virtual filesystem...");

    // Write necessary files to the emscripten virtual file system
    pyodide.FS.writeFile("/config.xqar", configContent, { encoding: "utf8" });
    pyodide.FS.writeFile("/opendrive.xodr", xodrContent, { encoding: "utf8" });

    updateProgress(75, "Running OpenDRIVE Checks...");

    // Run the python execution
    await pyodide.runPythonAsync(localConf.pythonCode);

    updateProgress(99, "Reading final results...");
    const resultXml = pyodide.FS.readFile("/result.xqar", { encoding: "utf8" });

    // Return to main thread
    self.postMessage({ type: 'RESULT', content: resultXml });

  } catch (err) {
    sendLog('stderr', err.toString());
    self.postMessage({ type: 'ERROR', content: "Analysis execution failed: " + err.message });
  }
}

// Listen to messages from the main thread
self.addEventListener('message', async (event) => {
  const data = event.data;

  if (data.type === 'START') {
    try {
      await initPyodide();
      await runAnalysis(data.xodrContent, data.configContent);
    } catch (e) {
      console.error("Worker process failed.", e);
    }
  }
});
