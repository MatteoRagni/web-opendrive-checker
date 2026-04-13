<template>
  <div class="bottom-banner bg-dark text-light d-flex flex-column" :class="{ 'expanded': isExpanded, 'collapsed': !isExpanded }">
    <div class="banner-header d-flex justify-content-between align-items-center px-3 py-1 bg-secondary text-white cursor-pointer" @click="toggleExpand">
      <div class="d-flex align-items-center">
        <i class="bi bi-terminal-fill me-2"></i>
        <strong>Pyodide Output Console</strong>
        <span class="badge bg-secondary ms-2">{{ appStore.pyodideTerminal.length }} lines</span>
      </div>
      <div class="d-flex align-items-center" @click.stop>
        <div class="form-check form-switch me-3 mb-0">
          <input class="form-check-input" type="checkbox" id="followTail" v-model="appStore.terminalFollowOutput">
          <label class="form-check-label text-white small" for="followTail">Follow</label>
        </div>
        <button class="btn btn-sm btn-outline-light border-0 py-0 px-2 me-1" @click="copyConsole" title="Copy to clipboard">
          <i class="bi bi-clipboard"></i>
        </button>
        <button class="btn btn-sm btn-outline-light border-0 py-0 px-2 me-2" @click="clearConsole" title="Clear console">
          <i class="bi bi-trash"></i>
        </button>
        <i class="bi" :class="isExpanded ? 'bi-chevron-down' : 'bi-chevron-up'" @click="toggleExpand" style="cursor: pointer;"></i>
      </div>
    </div>
    
    <div class="console-body p-2 font-monospace small flex-grow-1 overflow-auto" ref="consoleOutput" v-show="isExpanded">
      <div v-if="appStore.pyodideTerminal.length === 0" class="text-muted fst-italic">No output yet.</div>
      <div v-for="line in appStore.pyodideTerminal" :key="line.id" :class="{'text-danger': line.type === 'stderr', 'text-light': line.type === 'stdout'}">
        {{ line.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useAppStore } from '../store/index.js'

export default {
  name: 'BottomBanner',
  data() {
    return {
      isExpanded: false
    }
  },
  computed: {
    ...mapStores(useAppStore)
  },
  watch: {
    'appStore.pyodideTerminal': {
      deep: true,
      handler() {
        if (this.appStore.terminalFollowOutput && this.isExpanded) {
          this.$nextTick(() => {
            const container = this.$refs.consoleOutput;
            if (container) {
              container.scrollTop = container.scrollHeight;
            }
          });
        }
      }
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded && this.appStore.terminalFollowOutput) {
        this.$nextTick(() => {
          const container = this.$refs.consoleOutput;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      }
    },
    clearConsole() {
      this.appStore.clearTerminal();
    },
    copyConsole() {
      const text = this.appStore.pyodideTerminal.map(l => l.text).join('\n');
      navigator.clipboard.writeText(text).then(() => {
        // Optional: show small toast or feedback
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }
}
</script>

<style scoped>
.bottom-banner {
  transition: height 0.3s ease;
  border-top: 1px solid #444;
}

.bottom-banner.expanded {
  height: 250px;
}

.bottom-banner.collapsed {
  height: 38px;
}

.banner-header {
  height: 38px;
  user-select: none;
}

.cursor-pointer {
  cursor: pointer;
}

.console-body {
  background-color: #1e1e1e;
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
