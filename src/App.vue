<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides" class="h-100">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <router-view/>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { zhCN, dateZhCN } from 'naive-ui'
import themeOverrides from './theme'
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>

