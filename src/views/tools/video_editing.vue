<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 视频剪辑 -->
      <Upload accept="video/*" :max="1" :size_max="1024" folder="video" @change="handleUploadChange" />
      <Xgplayer v-if="video_url" class="welcome-home-bg" src="https://bogeyai-staticdsn.judianwangluo.com/welcome/welcome.m3u8" />
      <div class="my-24px">
        <n-slider v-model:value="range" range :step="0.01" :format-tooltip="(val: number) => formatVideoDuration(duration * val / 100)" />
        <n-space class="my-24px">
          <n-input-number v-model:value="range[0]" size="small" :show-button="false" :format="(val: number) => formatVideoDuration(duration * val / 100)" />
          <n-input-number v-model:value="range[1]" size="small" :show-button="false" :format="(val: number) => formatVideoDuration(duration * val / 100)" />
        </n-space>
      </div>
      <div v-if="video_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleCutVideo()">视频截取</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Xgplayer from '@/components/xgplayer.vue';
import { cutVideo, getVideoDetail } from '@/apis/index';
import { staticUrl, formatVideoDuration } from '@/utils/index';
import Upload from '@/components/upload.vue';

const dialog = useDialog()
const message = useMessage()
const video_url: any = ref('')
const range = ref([50, 60])
const duration = ref(0)
const filename: any = ref('')

const handleUploadChange = async ({ resource_path }) => {
  video_url.value = resource_path.map((item: any) => item.original_url)[0]
  const result: any = await getVideoDetail({ video_path: video_url.value })
  duration.value = result.data.duration
}

const handleCutVideo = async () => {
  const res: any = await cutVideo({
    video_path: video_url.value,
    output_path: `video/${filename.value}.mp4`,
    start: duration.value * range.value[0] / 100,
    duration: duration.value * (range.value[1] - range.value[0]) / 100,
  })
  if(res.code === 200) {
    dialog.warning({
      title: '温馨提示',
      content: () => '视频截取成功，是否打开',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {type: "primary"},
      showIcon: false,
      closable: false,
      onPositiveClick: async () => {
        window.open(`${staticUrl}/video/${filename.value}.mp4`)
      },
      onNegativeClick: () => {
        message.warning('已取消')
      }
    })
  }
}
</script>
