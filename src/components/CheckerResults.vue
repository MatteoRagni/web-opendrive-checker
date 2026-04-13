<template>
  <div class="results-container pb-5">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Analysis Results</h2>
      <div>
        <button class="btn btn-outline-primary me-2" @click="exportXqar">
          <i class="bi bi-download me-1"></i> Export .xqar
        </button>
        <button class="btn btn-outline-secondary" @click="exportHtml">
          <i class="bi bi-filetype-html me-1"></i> Export HTML
        </button>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <a class="nav-link active" href="#">Summary & Issues</a>
      </li>
      <li class="nav-item" v-if="false">
        <a class="nav-link" href="#">3D Viewer</a>
      </li>
    </ul>

    <!-- Overall Summary -->
    <div v-for="bundle in result.CheckerBundles" :key="bundle.name" class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Bundle: {{ bundle.name }}</h5>
        <span class="badge bg-light text-primary">Version: {{ bundle.version }}</span>
      </div>
      <div class="card-body">
        <p class="text-muted">{{ bundle.description }}</p>
        <div class="alert alert-info">
          {{ bundle.summary }}
        </div>
        
        <div class="row text-center mb-3">
          <div class="col">
            <div class="fs-3 fw-bold text-dark">{{ bundle.Checkers.length }}</div>
            <div class="small text-muted text-uppercase">Total Checks</div>
          </div>
          <div class="col">
            <div class="fs-3 fw-bold text-success">{{ bundle.getCheckersByStatus(CheckerStatus.Completed).length }}</div>
            <div class="small text-muted text-uppercase">Completed</div>
          </div>
          <div class="col">
            <div class="fs-3 fw-bold text-secondary">{{ bundle.getCheckersByStatus(CheckerStatus.Skipped).length }}</div>
            <div class="small text-muted text-uppercase">Skipped</div>
          </div>
          <div class="col">
            <div class="fs-3 fw-bold text-danger">{{ bundle.hasIssues() ? bundle.countIssues() : 0 }}</div>
            <div class="small text-muted text-uppercase">Total Issues</div>
          </div>
        </div>

        <h5 class="mt-4 border-bottom pb-2">Checks Details</h5>

        <div class="accordion" :id="'accordion-' + bundle.name">
          <div class="accordion-item" v-for="(checker, index) in bundle.Checkers" :key="checker.id">
            <h2 class="accordion-header" :id="'heading-' + checker.id">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-' + checker.id" aria-expanded="false" :aria-controls="'collapse-' + checker.id">
                <i class="bi me-2 fs-5" :class="getCheckerIcon(checker.status)"></i>
                <div class="d-flex flex-column text-start">
                  <strong>{{ checker.id }}</strong>
                  <small class="text-muted">{{ checker.description }}</small>
                </div>
                <span v-if="checker.countIssues() > 0" class="badge bg-danger rounded-pill ms-auto me-3">{{ checker.countIssues() }} issues</span>
              </button>
            </h2>
            <div :id="'collapse-' + checker.id" class="accordion-collapse collapse" :aria-labelledby="'heading-' + checker.id" :data-bs-parent="'#accordion-' + bundle.name">
              <div class="accordion-body bg-light">
                <p><strong>Summary:</strong> {{ checker.summary }}</p>
                <div v-if="checker.AddressedRules && checker.AddressedRules.length > 0">
                  <strong>Addressed Rules:</strong>
                  <ul>
                    <li v-for="rule in checker.AddressedRules" :key="rule.id"><code>{{ rule.id }}</code></li>
                  </ul>
                </div>

                <!-- Issues List -->
                <div v-if="checker.Issues && checker.Issues.length > 0" class="mt-3">
                  <h6>Issues:</h6>
                  <div v-for="(issue, iIndex) in checker.Issues" :key="issue.id" class="card mb-2 border-danger shadow-sm">
                    <div class="card-body py-2 px-3">
                      <div class="d-flex justify-content-between align-items-center">
                        <strong><i class="bi bi-exclamation-triangle-fill text-danger me-2"></i> Issue #{{ issue.id || iIndex }}</strong>
                        <span class="badge bg-secondary">Level {{ issue.level }}</span>
                      </div>
                      <p class="mb-1 mt-2 text-dark">{{ issue.description }}</p>
                      
                      <!-- Locations / Snippet -->
                      <div v-if="issue.Locations && issue.Locations.length > 0">
                        <div v-for="(loc, lIndex) in issue.Locations" :key="lIndex" class="mt-2">
                          <small class="text-muted d-block mb-1">{{ loc.description }}</small>
                          
                          <div v-if="loc.hasFileLocation && loc.row" class="mt-2">
                            <span class="badge bg-dark fw-normal mb-1">Row: {{ loc.row }}, Col: {{ loc.column }}</span>
                            <div class="snippet bg-dark text-light p-2 rounded small overflow-auto font-monospace border">
                              <div v-for="lineObj in getSnippet(loc.row)" :key="lineObj.num" class="d-flex" :class="{'bg-primary bg-opacity-25 fw-bold': lineObj.isTarget}">
                                <span class="text-secondary pe-3" style="min-width: 40px; text-align: right; user-select: none;">{{ lineObj.num }}</span>
                                <span class="text-nowrap">{{ lineObj.text }}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div v-if="loc.hasXmlLocation" class="mt-1">
                            <span class="badge bg-secondary fw-normal">XPath: {{ loc.column }}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from '../store/index.js'
import CheckerResultParser from '../checkerResultParser.mjs'

export default {
  name: 'CheckerResults',
  data() {
    return {
      CheckerStatus: CheckerResultParser.CheckerStatus
    }
  },
  computed: {
    ...mapStores(useAppStore),
    result() {
      if (!this.appStore.xqarContent) {
        return { CheckerBundles: [] };
      }
      return new CheckerResultParser.CheckerResult(this.appStore.xqarContent);
    },
    xodrLines() {
      if (!this.appStore.xodrContent) return [];
      return this.appStore.xodrContent.split('\n');
    }
  },
  methods: {
    getCheckerIcon(status) {
      if (status === this.CheckerStatus.Completed) return 'bi-check-circle-fill text-success';
      if (status === this.CheckerStatus.Skipped) return 'bi-dash-circle-fill text-secondary';
      return 'bi-x-circle-fill text-danger';
    },
    getSnippet(rowStr) {
      const row = parseInt(rowStr, 10);
      if (isNaN(row) || this.xodrLines.length === 0) return [];
      
      const targetIndex = row - 1; // 0-indexed array
      const start = Math.max(0, targetIndex - 5);
      const end = Math.min(this.xodrLines.length - 1, targetIndex + 5);
      
      const snippet = [];
      for (let i = start; i <= end; i++) {
        snippet.push({
          num: i + 1,
          text: this.xodrLines[i],
          isTarget: i === targetIndex
        });
      }
      return snippet;
    },
    downloadBlob(content, fileName, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    exportXqar() {
      if (this.appStore.xqarContent) {
        this.downloadBlob(this.appStore.xqarContent, 'result.xqar', 'application/xml');
      }
    },
    exportHtml() {
      // Basic HTML export utilizing the current DOM structure logically
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OpenDRIVE Check Results</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; background: #f8f9fa; color: #212529; }
    .bundle { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    h1, h2, h3 { margin-top: 0; }
    .summary { background: #e9ecef; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
    .issue { border-left: 4px solid #dc3545; padding-left: 1rem; margin-bottom: 1rem; }
    .snippet { background: #212529; color: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: monospace; }
  </style>
</head>
<body>
  <h1>Analysis Results</h1>
  ${this.result.CheckerBundles.map(b => `
    <div class="bundle">
      <h2>Bundle: ${b.name}</h2>
      <p>Version: ${b.version}</p>
      <div class="summary">${b.summary}</div>
      <p>Checks: ${b.Checkers.length} | Issues: ${b.hasIssues() ? b.countIssues() : 0}</p>
      
      <h3>Checks Details</h3>
      ${b.Checkers.map(c => `
        <div style="margin-bottom: 2rem; border-bottom: 1px solid #dee2e6; padding-bottom: 1rem;">
          <h4>${c.id} (${c.status.toString()})</h4>
          <p>${c.summary}</p>
          ${c.Issues.length > 0 ? c.Issues.map(i => `
            <div class="issue">
              <strong>Issue #${i.id} - Level ${i.level}</strong>
              <p>${i.description}</p>
            </div>
          `).join('') : '<p style="color: #198754;">No issues found.</p>'}
        </div>
      `).join('')}
    </div>
  `).join('')}
</body>
</html>`;
      this.downloadBlob(htmlContent, 'result.html', 'text/html');
    }
  }
}
</script>

<style scoped>
.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: #212529;
  box-shadow: inset 0 -1px 0 rgba(0,0,0,.125);
}
</style>