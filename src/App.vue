<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="darkTheme" :theme-overrides="customTheme.dark" id="container" class="h-100 dark">
    <n-loading-bar-provider>
      <n-message-provider :max="1">
        <n-dialog-provider>
          <n-notification-provider>
            <router-view />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
import { customTheme } from './theme';
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>

