<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8">
      <div class="card shadow-sm border-0 mt-5">
        <div class="card-body p-5 text-center">
          
          <h2 class="mb-4 text-primary">Analyzing OpenDRIVE File</h2>
          <p class="text-muted fw-bold mb-5">{{ currentQuote }}</p>

          <div class="progress mb-4" style="height: 25px;">
            <div class="progress-bar progress-bar-striped progress-bar-animated" 
                 role="progressbar" 
                 :style="{ width: appStore.analysisProgress + '%' }" 
                 :aria-valuenow="appStore.analysisProgress" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
              {{ appStore.analysisProgress }}%
            </div>
          </div>

          <div class="alert alert-secondary d-flex align-items-center justify-content-center">
            <span class="spinner-border spinner-border-sm me-3 text-primary" role="status" aria-hidden="true" v-if="appStore.analysisProgress < 100 && !errorOccurred"></span>
            <i class="bi bi-check-circle-fill text-success me-3 fs-5" v-esle-if="!errorOccurred"></i>
            <i class="bi bi-exclamation-octagon-fill text-danger me-3 fs-5" v-if="errorOccurred"></i>
            <span class="fw-bold">{{ appStore.analysisStatusText }}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from '../store/index.js'

const FUNNY_QUOTES = [
  "Calculating clothoids... they're feeling extra curvy today.",
  "Negotiating with the standard. It's not budging...",
  "Searching for lost lanes...",
  "Almost there! Just making sure the road actually stays on the ground.",
  "Polishing the OpenDRIVE XML tags...",
  "Looking for the lost elevation profile. It was here a minute ago...",
  "Downloading more RAM...",
  "Asking the Python snake nicely...",
  "Trying to convince the schema that a 90-degree turn at 100km/h is 'fine'.",
  "Counting lanes. 1, 2, 42... Wait, let's start over.",
  "Attempting to solve the spiral. The spiral is winning.",
  "Checking if your lanes are actually connected or just social distancing.",
  "The ASAM Checker is currently judging your life choices.",
  "Asking the schema if 'close enough' counts as valid. (It said no.)",
  "Checking for logic... Still checking... Logic not found. Checking again.",
  "Translating 'Human Road Intent' into 'Strict Machine Logic'.",
  "The XML parser is currently taking a deep breath before reading your junctions.",
  "Checking if a car can drive this without entering another dimension.",
  "Asking the elevation profile why it suddenly thinks it's a skyscraper.",
  "Confirming that your road stays on the planet. Most of the time.",
  "Cheering up the reference line. It's having an identity crisis."
]

export default {
  name: 'AnalysisProgress',
  data() {
    return {
      quoteInterval: null,
      currentQuote: FUNNY_QUOTES[Math.floor(Math.random() * FUNNY_QUOTES.length)],
      errorOccurred: false,
      worker: null
    }
  },
  computed: {
    ...mapStores(useAppStore)
  },
  mounted() {
    this.appStore.updateAnalysisProgress(5, "Initializing environment...");
    this.startQuotes();
    this.runAnalysisFlow();
  },
  beforeUnmount() {
    this.stopQuotes();
    if (this.worker) {
      this.worker.terminate();
    }
  },
  methods: {
    startQuotes() {
      this.quoteInterval = setInterval(() => {
        const quote = FUNNY_QUOTES[Math.floor(Math.random() * FUNNY_QUOTES.length)];
        this.currentQuote = quote;
      }, 2000);
    },
    stopQuotes() {
      if (this.quoteInterval) {
        clearInterval(this.quoteInterval);
      }
    },
    async runAnalysisFlow() {
      try {
        // Fetch config
        this.appStore.updateAnalysisProgress(10, "Fetching checker configuration...");
        let configRes = await fetch('/config.xqar');
        let configContent = await configRes.text();

        // Initialize Web Worker using Vite standard way
        this.worker = new Worker(new URL('../pythonWorker.js', import.meta.url), { type: 'module' });
        
        this.worker.onmessage = (event) => {
          const data = event.data;
          
          if (data.type === 'LOG') {
            this.appStore.appendTerminalOutput(data.logType, data.content);
          } 
          else if (data.type === 'PROGRESS') {
            this.appStore.updateAnalysisProgress(data.progress, data.text);
          } 
          else if (data.type === 'RESULT') {
            this.appStore.setXqarContent(data.content);
            this.appStore.updateAnalysisProgress(100, "Done!");
            setTimeout(() => {
              this.appStore.setStage("RESULTS");
            }, 500);
          } 
          else if (data.type === 'ERROR') {
            this.errorOccurred = true;
            this.appStore.updateAnalysisProgress(100, "Failed during execution!");
            alert(data.content);
          }
        };

        this.worker.onerror = (err) => {
          this.errorOccurred = true;
          this.appStore.updateAnalysisProgress(100, "Critical Worker Error!");
          this.appStore.appendTerminalOutput('stderr', err.message || err.toString());
          console.error('Worker error:', err);
        };

        // Command the worker to begin
        this.worker.postMessage({
          type: 'START',
          xodrContent: this.appStore.xodrContent,
          configContent: configContent
        });

      } catch (err) {
        this.errorOccurred = true;
        console.error("Failed during initialization: ", err);
        this.appStore.appendTerminalOutput('stderr', err.toString());
        alert("Failed during initialization: " + err.message);
      }
    }
  }
}
</script>
