<template>
  <div v-if="bundle">
    {{ bundle }}
  </div>
</template>

<script>
export default {
  props: {
    bundle: undefined
  }
}
</script>