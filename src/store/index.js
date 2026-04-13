import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 'LOAD', 'ANALYZE', 'RESULTS'
    currentStage: 'LOAD',
    
    // Loaded OpenDrive file
    xodrFileName: '',
    xodrContent: '',

    // Pyodide and Analysis status
    analysisProgress: 0,
    analysisStatusText: '',
    
    // Result
    xqarContent: '',
    
    // Terminal Bottom Banner
    pyodideTerminal: [], // array of { id: number, type: 'stdout'|'stderr', text: string }
    terminalFollowOutput: true,
  }),
  actions: {
    setStage(stage) {
      if (['LOAD', 'ANALYZE', 'RESULTS'].includes(stage)) {
        this.currentStage = stage;
      }
    },
    setXodrData(fileName, content) {
      this.xodrFileName = fileName;
      this.xodrContent = content;
    },
    updateAnalysisProgress(progress, text) {
      this.analysisProgress = progress;
      if (text) {
        this.analysisStatusText = text;
      }
    },
    setXqarContent(content) {
      this.xqarContent = content;
    },
    appendTerminalOutput(type, text) {
      this.pyodideTerminal.push({
        id: Date.now() + Math.random(),
        type: type, // 'stdout' | 'stderr'
        text: text
      });
    },
    clearTerminal() {
      this.pyodideTerminal = [];
    },
    resetApp() {
      this.currentStage = 'LOAD';
      this.xodrFileName = '';
      this.xodrContent = '';
      this.analysisProgress = 0;
      this.analysisStatusText = '';
      this.xqarContent = '';
    }
  }
});
