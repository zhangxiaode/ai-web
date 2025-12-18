<template>
  <div class="h-100% flex flex-col justify-between items-normal">
    <div class="px-8px my-12px">
      <div class="tabs inline-flex items-center bg-[rgba(147,51,234,0.4)] h-24px p-6px rounded-18px">
        <div v-for="(item, index) in tabs" :key="index" :class="['h-24px leading-24px px-16px c-#ccc text-12px cursor-pointer rounded-12px', { 'c-#fff bg-#9333ea': current === index }]" @click="handleTab(item.path)">{{ item.name }}</div>
      </div>
    </div>
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter()
const route = useRoute()
const tabs = ref([
  {
    name: '图片格式转换',
    path: '/layout/tools/format_factory/format_image'
  },
  {
    name: '音频格式转换',
    path: '/layout/tools/format_factory/format_audio'
  },
  {
    name: '视频格式转换',
    path: '/layout/tools/format_factory/format_video'
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
