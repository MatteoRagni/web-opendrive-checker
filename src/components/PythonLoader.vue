<template>
  <div>
    <div ref="loadModal" class="modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Loading Engine</h5>
          </div>
          <div class="modal-body">
            <p>Please hang tight while we load the OpenDRIVE checker engine in your browser</p>
            <p class="font-monospace">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { default as python } from '../python.mjs'
import { Modal } from 'bootstrap'

export default {
  data() {
    return {
      message: "Loading Python..."
    }
  },
  methods: {
    newEvent(message) {
      this.message = message;
    }
  },
  mounted() {
    const modal = new Modal(this.$refs.loadModal)
    modal.show()
    python.load(this.newEvent).then((result) => {
      modal.hide()
    })
  }
}
</script>

