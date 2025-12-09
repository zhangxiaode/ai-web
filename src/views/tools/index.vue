<template>
  <div class="h-100% flex flex-col justify-between items-normal">
    <div class="px-8px">
      <div class="inline-flex items-center bg-[rgba(147,51,234,0.5)] h-30px p-6px rounded-21px">
        <div v-for="(item, index) in tabs" :key="index" :class="['h-30px leading-30px px-16px c-#ccc text-12px cursor-pointer rounded-15px', { 'c-#fff bg-#9333ea': current === index }]" @click="handleTab(item.path)">{{ item.name }}</div>
      </div>
    </div>
    <div class="flex-1 overflow-hidden">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const route = useRoute()
const tabs = ref([
  {
    name: '音频提取',
    path: '/layout/tools/audio_extraction'
  },
  {
    name: '视频剪辑',
    path: '/layout/tools/video_editing'
  },
  {
    name: '格式工厂',
    path: '/layout/tools/format_factory'
  },
])
const current = computed(() => {
  return tabs.value.findIndex(item => route.path.includes(item.path))
});
const handleTab = (path: string) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
</style>
