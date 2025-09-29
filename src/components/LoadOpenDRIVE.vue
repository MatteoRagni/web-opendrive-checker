<template>
  <div>
    <div class="container">
      <form>
        <label for="opendriveInput" class="form-label text-primary">Load ASAM OpenDRIVE file</label>  
        <div class="input-group">
          <input type="file" class="form-control" ref="input" id="opendriveInput" accept=".xodr,.xml" @change="newFile" >
        </div>
        <div class="form-text">File remains local</div> 
      </form>
    </div>
    <div class="container p-3">
      <div class="container">
        <h3>Result File</h3>
        <div v-if="checkerResult" class="text-monospace" v-html="checkerResult"></div>
        <p class="text-monospace text-warning" v-else>
          Load an OpenDRIVE and run the checker to see results
        </p>
      </div>
      <div class="container">
        <h3>Python Output</h3>
        <table class="table table-borderless">
          <thead>
            <tr>
              <th>When</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs">
              <td>{{ log.when }}</td>
              <td>
                <i class="bi bi-exclamation-triangle text-danger" v-if="log.isError"></i>
                <i class="bi bi-info-circle text-info" v-else></i>
              </td>
              <td>
                <span class="text-monospace text-danger" v-if="log.isError">{{ log.message }}</span>
                <span class="text-monospace" v-else>{{ log.message }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import python from '../python.mjs';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';

export default {
  data() {
    return {
      checkerResult: undefined,
      logs: []
    }
  },
  methods: {
    async newFile(event) {
      if (event.target.files[0]) {
        const file = event.target.files.item(0)
        this.newLogMessage(`Loading file ${file.name} into Browser memory`)
        const text = await file.text();
        python.writeFile("/opendrive.xodr", text)
        this.newLogMessage(`File loading complete`)
      }
      this.runChecker()
    },
    newLogMessage(message, isError = false) {
      this.logs.push({
          when: (new Date()).toISOString(),
          error: isError,
          message: message
        })
    },
    async runChecker() {
      this.newLogMessage(`Fetching default configuration in browser memory`)
      const response = await fetch("/config.xqar")
      const text = await response.text()
      python.writeFile("/config.xqar", text)
      this.newLogMessage(`Configuration loaded`)
      this.newLogMessage(`Starting Python interpreter and qc_opendrive`)
      python.runChecker({
        stdout: (message) => { this.newLogMessage(message, false) },
        stderr: (message) => { this.newLogMessage(message, true) },
      })
      this.newLogMessage(`Python process completed, loading result file`)
      const result = python.readFile("/result.xqar")
      hljs.registerLanguage('xml', xml)
      const highlightedCode = hljs.highlight(
        result,
        { language: 'xml' }
      ).value
      this.checkerResult = highlightedCode
      this.newLogMessage(`Result fetched`)
    }
  }
}
</script>