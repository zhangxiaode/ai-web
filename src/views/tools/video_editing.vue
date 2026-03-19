<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 视频剪辑 -->
      <UploadObs ref="uploadRef" accept="video/*" :max="1" :size_max="1024" :get_file_path="({ file_name }) => `video/${file_name}`" @change="handleUploadChange" />
      <Xgplayer v-if="signed_url" :width="860" :height="540" :src="signed_url" />
      <div class="m-24px w-100%">
        <n-slider v-model:value="range" class="w-100%" range :step="0.01" :marks="marks" :format-tooltip="(val: number) => formatVideoDuration(duration * val / 100)" />
      </div>
      <div v-if="signed_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleCutVideo()">视频截取</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Xgplayer from '@/components/xgplayer.vue';
import { cutVideo, getVideoDetail } from '@/apis/index';
import { filenameWithoutExt, formatVideoDuration } from '@/utils/index';
import UploadObs from '@/components/uploadObs.vue';

const dialog = useDialog()
const message = useMessage()
const video_url: any = ref('')
const signed_url: any = ref('')
const range = ref([0, 60])
const duration = ref(0)
const filename: any = ref('')
const formatDuration = computed(() => formatVideoDuration(duration.value))
const marks = computed(() => ({ 0: '00:00:00', 100: formatDuration.value }))

const handleUploadChange = async ({ resource_path }) => {
  if(resource_path.length > 0) {
    video_url.value = resource_path[0].original_url
    signed_url.value = resource_path[0].url
    const result: any = await getVideoDetail({ video_path: video_url.value })
    duration.value = result.data.duration
    const file = resource_path[0].file
    filename.value = filenameWithoutExt(file?.name as string)
  } else {
    video_url.value = ''
    signed_url.value = ''
    duration.value = 0
    filename.value = ''
  }
}

const handleCutVideo = async () => {
  const res: any = await cutVideo({
    video_path: video_url.value,
    output_path: `video/${filename.value}_${Date.now()}_cut.mp4`,
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
      onPositiveClick() {
        window.open(res.data)
      },
      onNegativeClick: () => {
        message.warning('已取消')
      }
    })
  }
}
</script>
