<template>
  <div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        
        <div class="modal-header bg-light">
          <h5 class="modal-title" id="aboutModalLabel">
            <i class="bi bi-info-circle-fill text-primary me-2"></i>About OpenDRIVE Web Checker
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <ul class="nav nav-tabs mb-3" id="aboutTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="project-tab" data-bs-toggle="tab" data-bs-target="#project" type="button" role="tab" aria-controls="project" aria-selected="true">Project</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="licenses-tab" data-bs-toggle="tab" data-bs-target="#licenses" type="button" role="tab" aria-controls="licenses" aria-selected="false">Licenses</button>
            </li>
          </ul>
          
          <div class="tab-content" id="aboutTabContent">
            <!-- Project Tab -->
            <div class="tab-pane fade show active" id="project" role="tabpanel" aria-labelledby="project-tab">
              <div class="p-4">
                <p class="fs-5">
                  The <strong>ASAM OpenDRIVE Web Checker</strong> runs a local ASAM Quality Check for OpenDRIVE files. The file is analyzed within your browser using WebAssembly and Pyodide, ensuring zero server upload requirements.
                </p>
                
                <p class="fs-5">
                  Licensed under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" class="text-decoration-none">Apache License 2.0</a>.
                </p>
                <p class="fs-5">
                  Developed by Matteo Ragni 
                  <a href="https://www.ragni.me" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-globe"></i></a>
                  <a href="https://www.linkedin.com/in/matteoragni" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-linkedin"></i></a>
                  <a href="https://github.com/MatteoRagni" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-github"></i> </a>
                </p>

                <div class="d-flex flex-column align-items-center p-4 rounded text-center mb-4">
                  <span class="text-muted text-uppercase small fw-bold mb-3">Sponsored By:</span>
                  <a href="https://www.antemotion.com/" target="_blank">
                    <img src="/antemotion.png" alt="AnteMotion" style="max-height: 40px; object-fit: contain;">
                  </a>
                </div>
              
              </div>
            </div>
            
            <!-- Licenses Tab -->
            <div class="tab-pane fade" id="licenses" role="tabpanel" aria-labelledby="licenses-tab">
              <p class="text-muted mb-4">This open-source tool leverages the following incredible projects and technologies:</p>
              
              <div class="accordion" id="accordionLicenses">
                
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingAsam">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAsam" aria-expanded="true" aria-controls="collapseAsam">
                      ASAM qc-opendrive
                      <a href="https://github.com/asam-ev/qc-opendrive" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-github"></i></a>
                    </button>
                  </h2>
                  <div id="collapseAsam" class="accordion-collapse collapse show" aria-labelledby="headingAsam" data-bs-parent="#accordionLicenses">
                    <div class="accordion-body small bg-light">
                      <p>Used to run the underlying verification checks. Ported to WebAssembly.</p>
                      <strong>Apache License 2.0</strong><br>
                      Copyright © ASAM e.V.
                    </div>
                  </div>
                </div>

                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingVue">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVue" aria-expanded="false" aria-controls="collapseVue">
                      Vue.js 3
                      <a href="https://vuejs.org/" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-globe"></i></a>
                    </button>
                  </h2>
                  <div id="collapseVue" class="accordion-collapse collapse" aria-labelledby="headingVue" data-bs-parent="#accordionLicenses">
                    <div class="accordion-body small bg-light">
                      <strong>MIT License</strong><br>
                      Copyright © 2013-present, Yuxi (Evan) You
                    </div>
                  </div>
                </div>
                
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingBootstrap">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBootstrap" aria-expanded="false" aria-controls="collapseBootstrap">
                      Bootstrap 5
                      <a href="https://getbootstrap.com/" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-globe"></i></a>
                    </button>
                  </h2>
                  <div id="collapseBootstrap" class="accordion-collapse collapse" aria-labelledby="headingBootstrap" data-bs-parent="#accordionLicenses">
                    <div class="accordion-body small bg-light">
                      <strong>MIT License</strong><br>
                      Copyright © 2011-2024 The Bootstrap Authors
                    </div>
                  </div>
                </div>

                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingPyodide">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePyodide" aria-expanded="false" aria-controls="collapsePyodide">
                      Pyodide
                      <a href="https://github.com/pyodide/pyodide" target="_blank" class="text-decoration-none"><i class="ms-3 bi bi-github"></i></a>
                    </button>
                  </h2>
                  <div id="collapsePyodide" class="accordion-collapse collapse" aria-labelledby="headingPyodide" data-bs-parent="#accordionLicenses">
                    <div class="accordion-body small bg-light">
                      <strong>Mozilla Public License v2.0 (MPL)</strong><br>
                      Copyright © Pyodide contributors
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutModal'
}
</script>
