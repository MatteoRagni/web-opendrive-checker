<template>
  <div>
    <h1 class="mb-4">
      Checker Results 
    </h1>
    <small class="text-secondary">
      {{  result.version }}
    </small>
    
    <hr class="mb-4"/>
    
    <div v-for="bundle in result.CheckerBundles">
    </div>
      
  </div>
</template>

<script>
import CheckerResult from '../checkerResultParser.mjs';
import CheckerBundle from './CheckerBundle.vue';

const DEFAULT = `<?xml version='1.0' encoding='UTF-8' standalone='no'?> <CheckerResults version="v0" />` 

export default {
  components: {CheckerBundle},
  props: {
    xmlString: {
      type: String,
      default: DEFAULT
    }
  },
  computed: {
    result() {
      return new CheckerResult.CheckerResult(this.xmlString)
    }
  }
}

</script>