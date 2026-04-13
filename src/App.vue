<template>
  <div class="h-100 d-flex flex-column">
    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1 d-flex align-items-center">
          <i class="bi bi-car-front-fill me-2 text-primary"></i>
          ASAM OpenDRIVE Quality Checker
        </span>
        <div class="d-flex" v-if="appStore.currentStage !== 'LOAD'">
          <button class="btn btn-outline-danger btn-sm" @click="confirmReturn">
            <i class="bi bi-arrow-return-left me-1"></i> Start Over
          </button>
        </div>
      </div>
    </nav>

    <div class="flex-grow-1 overflow-auto bg-body-tertiary">
      <div class="container py-4">
        <OpenDriveLoader v-if="appStore.currentStage === 'LOAD'" />
        <AnalysisProgress v-else-if="appStore.currentStage === 'ANALYZE'" />
        <CheckerResults v-else-if="appStore.currentStage === 'RESULTS'" />
      </div>
    </div>

    <BottomBanner />
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from './store/index.js'

import OpenDriveLoader from './components/OpenDriveLoader.vue'
import AnalysisProgress from './components/AnalysisProgress.vue'
import CheckerResults from './components/CheckerResults.vue'
import BottomBanner from './components/BottomBanner.vue'

export default {
  name: 'App',
  components: {
    OpenDriveLoader,
    AnalysisProgress,
    CheckerResults,
    BottomBanner
  },
  computed: {
    ...mapStores(useAppStore),
  },
  methods: {
    confirmReturn() {
      if (confirm('Are you sure you want to return to the start? Any unsaved results will be lost.')) {
        this.appStore.resetApp()
      }
    }
  }
}
</script>

<style>
html, body, #app {
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
