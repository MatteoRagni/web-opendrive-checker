<template>
  <div>
    <h1 class="mb-4">
      Checker Results 
      <small class="float-end text-secondary">
        {{  result.version }}
      </small>
    </h1>
    <hr class="mb-4"/>

    <div v-for="bundle in result.CheckerBundles">
          
      <h2 class="mb-4">
        <i class="me-3 bi bi-exclamation-circle text-danger" v-if="bundle.hasIssues()"></i>
        <i class="me-3 bi bi-info-circle text-primary" v-else></i>
        {{ bundle.description }}
        <small class="text-secondary float-end">{{ bundle.name }} {{ bundle.version }} ({{ bundle.buildDate }})</small>
      </h2>
      <blockquote class="blockquote">
        <p :class=" bundle.hasIssues() ? 'text-danger' : '' ">
          {{ bundle.summary }}
        </p>
      </blockquote>

      <div class="list-group">
        <a href="#" :class="`list-group-item list-group-item-action ${checker.hasIssues() ? 'list-group-item-danger' : ''}`" v-for="checker in bundle.Checkers">
          <div class="d-flex w-100 justify-content-between py-2">
            <h5 class="mb-1">
              <span class="me-2 badge text-bg-danger" v-if="checker.status=='completed' && checker.hasIssues()">Ok</span> 
              <span class="me-2 badge text-bg-primary" v-else-if="checker.status=='completed'">Ok</span> 
              <span class="me-2 badge text-bg-warning" v-else-if="checker.status=='skipped'">Skip</span>
              <span class="me-2 badge text-bg-secondary" v-else>{{ checker.status }}</span>
              {{ checker.description }}
            </h5>
            
          </div>
          <hr/>
          
          <p class="mb-1">{{  checker.summary }}</p>
          <small>{{ checker.id }}</small>
        </a>
      </div>


    </div>
    <hr class="mb-4"/>
      
  </div>
</template>

<script>
import { CheckerResult as CheckerResultObject } from '../checkerResultParser.mjs';

const DEFAULT = `<?xml version='1.0' encoding='UTF-8' standalone='no'?> <CheckerResults version="v0" />` 

export default {
  props: {
    xmlString: {
      type: String,
      default: DEFAULT
    }
  },
  computed: {
    result() {
      return new CheckerResultObject(this.xmlString)
    }
  }
}

</script>