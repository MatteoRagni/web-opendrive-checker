<template>
  <div class="container">
    <div ref="content"></div>
  </div>
</template>

<script>
import { marked } from "marked"

export default {
  props: {
    document: {
      typeof: String,
      default: ""
    }
  },
  watch: {
    document() {
      const content = marked.parse(this.document)
      this.$refs.content.innerHTML = content;
    }
  }
}
</script>