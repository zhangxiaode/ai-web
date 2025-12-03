<template>
  <div class="layout">
    <PageHeader />
    <div class="main">
      <router-view />
      <PageFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageHeader from "./pageHeader.vue";
import PageFooter from "./pageFooter.vue";
</script>
<style lang="scss" scoped>
.main {
  margin-top: 44px;
}
</style>
