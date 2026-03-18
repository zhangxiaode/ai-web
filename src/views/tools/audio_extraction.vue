<template>
  <div class="audio_extraction p-32px">
    <!-- 音频提取 -->
    <Upload accept="video/*" :max="1" :size_max="1024" folder="video" @change="handleUploadChange" />
    <div v-if="video_url" class="w-150px h-50px my-24px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleGetAudio()">提取音频</div>
  </div>
</template>
<script lang="ts" setup>
import { getVideoAudio } from '@/apis/index';
import { staticUrl, filenameWithoutExt } from '@/utils/index';
import Upload from '@/components/upload.vue';

const dialog = useDialog()
const message = useMessage()
const video_url = ref(null)
const filename: any = ref('')

const handleUploadChange = async ({ resource_path }) => {
  if(resource_path.length > 0) {
    video_url.value = resource_path.map((item: any) => item.original_url)[0]
    const file = resource_path.map((item: any) => item.file)[0]
    filename.value = filenameWithoutExt(file?.name as string)
  } else {
    video_url.value = null
    filename.value = ''
  }
}

const handleGetAudio = async () => {
  const res: any = await getVideoAudio({
    video_path: video_url.value,
    audio_path: `audio/${filename.value}.mp3`
  })
  if(res.code === 200) {
    dialog.warning({
      title: '温馨提示',
      content: () => '音频提取成功，是否打开',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {type: "primary"},
      showIcon: false,
      closable: false,
      onPositiveClick: async () => {
        window.open(`${staticUrl}/audio/${filename.value}.mp3`)
      },
      onNegativeClick: () => {
        message.warning('已取消')
      }
    })
  }
}
</script>
