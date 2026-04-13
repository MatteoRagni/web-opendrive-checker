<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card shadow-sm border-0 mt-5">
        <div class="card-body p-5 text-center">
          <h2 class="mb-4">Load OpenDRIVE File</h2>
          
          <div 
            class="upload-area p-5 mb-4 border border-2 border-dashed rounded bg-light"
            :class="{ 'border-primary bg-primary bg-opacity-10': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <i class="bi bi-cloud-arrow-up display-1 text-secondary mb-3"></i>
            <h5>Drag & Drop your <span class="text-primary fw-bold">.xodr</span> file here</h5>
            <p class="text-muted small mb-0">or click to browse local files</p>
            <input type="file" ref="fileInput" class="d-none" accept=".xodr,application/xml,text/xml" @change="handleFileSelect">
          </div>

          <div class="position-relative mb-4">
            <hr>
            <span class="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">OR</span>
          </div>

          <div class="input-group mb-4">
            <span class="input-group-text"><i class="bi bi-link-45deg"></i></span>
            <input type="url" class="form-control" placeholder="Enter URL to OpenDRIVE file" v-model="urlInput">
            <button class="btn btn-outline-primary" type="button" @click="handleUrlLoad" :disabled="!urlInput || isLoadingUrl">
              <span v-if="isLoadingUrl" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Fetch
            </button>
          </div>

          <div v-if="appStore.xodrFileName" class="alert alert-success d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center text-truncate">
              <i class="bi bi-file-earmark-check fs-4 me-2"></i>
              <div class="text-start text-truncate">
                <div class="fw-bold text-truncate">{{ appStore.xodrFileName }}</div>
                <div class="small">Loaded ready for analysis</div>
              </div>
            </div>
            <button class="btn btn-sm btn-outline-success" @click="startAnalysis">
              Analyze <i class="bi bi-play-fill"></i>
            </button>
          </div>
          
          <div v-if="errorMsg" class="alert alert-danger mb-0">
            {{ errorMsg }}
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from '../store/index.js'

export default {
  name: 'OpenDriveLoader',
  data() {
    return {
      isDragging: false,
      urlInput: '',
      isLoadingUrl: false,
      errorMsg: ''
    }
  },
  computed: {
    ...mapStores(useAppStore)
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.readFile(file);
      }
      this.$refs.fileInput.value = '';
    },
    handleDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.readFile(file);
      }
    },
    readFile(file) {
      this.errorMsg = '';
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        this.appStore.setXodrData(file.name, content);
      };
      reader.onerror = () => {
        this.errorMsg = "Error reading file.";
      };
      reader.readAsText(file);
    },
    async handleUrlLoad() {
      if (!this.urlInput) return;
      this.isLoadingUrl = true;
      this.errorMsg = '';
      try {
        const response = await fetch(this.urlInput);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        const urlParts = this.urlInput.split('/');
        let fileName = urlParts[urlParts.length - 1];
        if (!fileName || !fileName.endsWith('.xodr')) {
          fileName = "downloaded_opendrive.xodr";
        }
        this.appStore.setXodrData(fileName, content);
        this.urlInput = '';
      } catch (err) {
        this.errorMsg = `Failed to fetch from URL: ${err.message}`;
      } finally {
        this.isLoadingUrl = false;
      }
    },
    startAnalysis() {
      this.appStore.setStage('ANALYZE');
    }
  }
}
</script>

<style scoped>
.upload-area {
  cursor: pointer;
  transition: all 0.3s ease;
}
.upload-area:hover {
  background-color: #f8f9fa !important;
  border-color: #0d6efd !important;
}
.border-dashed {
  border-style: dashed !important;
}
</style>
