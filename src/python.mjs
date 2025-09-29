import { loadPyodide } from "pyodide"

export default {
  pyodide_: undefined,

  load: async function(callback) {
    const callCallback = (message) => {
      if (callback) callback(message)
    }

    if (this.pyodide_) return;
    let pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"
    })
    callCallback("python: loaded interpreter")

    await pyodide.loadPackage("micropip")   
    const micropip = pyodide.pyimport("micropip")
    callCallback("python: loaded pip")

    for (let dep of ["lxml", "pydantic", "pydantic-xml", "numpy", "scipy", "xmlschema", "semver"]) {
      await micropip.install(dep)
      callCallback(`pip: installed dependency: ${dep}`)
    };

    for (let dep of ["/asam_qc_baselib-1.0.0-py3-none-any.whl", "/asam_qc_opendrive-1.0.0-py3-none-any.whl"]) {
      await pyodide.loadPackage(dep)
      callCallback(`python: loaded local package: ${dep}`)
    }
    this.pyodide_ = pyodide
    window.PYTHON = this
  },
  runChecker({stdout, stderr}) {
    if (!this.pyodide_) return

    if (stdout) {
      this.pyodide_.setStdout({ batched: stdout })
    }
    if (stderr) {
      this.pyodide_.setStderr({ batched: stderr })
    }

    this.pyodide_.runPython(`
      from qc_baselib import Configuration, Result
      from qc_opendrive.main import run_checks
      from qc_opendrive import constants, version
      
      config = Configuration()
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

      result.write_to_file(
          config.get_checker_bundle_param(
            checker_bundle_name=constants.BUNDLE_NAME, param_name="resultFile"
          ),
          generate_summary=True)
    `);
  },
  writeFile: function(filename, content) {
    if (!this.pyodide_) return
    this.pyodide_.FS.writeFile(filename, content, {encoding: "utf8"})
  },
  readFile: function(filename) {
    if (!this.pyodide_) return
    let content = this.pyodide_.FS.readFile(filename, {encoding: "utf8"})
    return content
  }
}