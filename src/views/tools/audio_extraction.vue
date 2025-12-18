<template>
  <div class="audio_extraction p-32px">
    <!-- 音频提取 -->
    <n-upload
      ref="upload"
      multiple
      directory-dnd
      action=""
      :headers="{}"
      :data="{}"
      :max="1"
      method="post"
      accept="video/*"
      :on-before-upload="beforeUpload"
      :custom-request="(e: any) => customRequest(e)"
    >
      <!-- image/* audio/* -->
      <n-upload-dragger class="bg-#a5a5a5 rounded-14px border-1px border-color-[transparent] border-style-dashed hover:bg-#494949 hover:border-color-#666">
        <div class="mb-12px">
          <img src="../../assets/upload.png" class="w-120px h-120px" alt="">
        </div>
        <div class="flex flex-column justify-center items-center">
          <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
            将文件拖至此区域,或<span class="c-#53d8fe">点击上传</span>
          </n-text>
        </div>
      </n-upload-dragger>
    </n-upload>
    <div v-if="video_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleGetAudio()">提取音频</div>
  </div>
</template>
<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { uploadFile, getVideoAudio } from '@/apis/index';

const message = useMessage()
const video_url = ref(null)
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(!options.file.file?.type.includes('video')) {
    message.error('只能上传视频格式的视频文件，请重新上传')
    return false
  }
  if(options.file.file && options.file.file.size > 1024 * 1024 * 1024) {
    message.error('大小限制1G以下')
    return false
  } else {
    return true
  }
}
const customRequest = async ({
  file,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) => {
  try {
    const formData: any = new FormData();
    formData.append('file', file.file);
    formData.append('folder', 'demo');
    const res: any = await uploadFile(formData, onProgress)
    video_url.value = res.data
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const handleGetAudio = async () => {
  // const res: any = await getVideoAudio(video_url.value, 'demo/小丑.mp3')
  const res: any = await getVideoAudio({
    video_path: video_url.value,
    audio_path: 'demo/小丑.mp3'
  })
}
</script>

<style lang="scss" scoped>
:deep(.n-upload-file-list .n-upload-file.n-upload-file--success-status .n-upload-file-info .n-upload-file-info__name) {
  color: #fff;
}
</style>
