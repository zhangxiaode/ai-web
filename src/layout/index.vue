<template>
  <div class="h-100% flex flex-col justify-between items-normal bg-#141414">
    <!-- <PageHeader /> -->
    <div class="flex-1 p-24px overflow-hidden">
      <router-view />
    </div>
    <!-- <PageFooter /> -->
  </div>
</template>

<script lang="ts" setup>
import PageHeader from "./pageHeader.vue";
import PageFooter from "./pageFooter.vue";
</script>
<style lang="scss" scoped></style>
