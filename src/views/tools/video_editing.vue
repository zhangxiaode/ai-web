<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 视频剪辑 -->
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
          <div style="margin-bottom: 12px">
            <img src="../../assets/upload.png" class="w-120px h-120px" alt="">
          </div>
          <div class="flex flex-column justify-center items-center">
            <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
              将文件拖至此区域,或<span class="c-#53d8fe">点击上传</span>
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
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
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import Xgplayer from '@/components/xgplayer.vue';
import { uploadFile, cutVideo, getVideoDetail } from '@/apis/index';
import { formatVideoDuration } from '@/utils/index';

const message = useMessage()
const video_url: any = ref('')
const range = ref([50, 60])
const duration = ref(0)
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(!options.file.file?.type.includes('video')) {
    message.error('只能上传视频格式的视频文件，请重新上传')
    return false
  }
  console.log(123, options.file)
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
    const result: any = await getVideoDetail({ video_path: video_url.value })
    duration.value = result.data.duration
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const handleCutVideo = async () => {
  const res: any = await cutVideo({
    video_path: video_url.value.replace('/Users/zxd/ai/', ''),
    output_path: 'demo/demo.mp4',
    start: duration.value * range.value[0] / 100,
    duration: duration.value * (range.value[1] - range.value[0]) / 100,
  })
  console.log(123, res)
}
</script>

<style lang="scss" scoped>
:deep(.n-upload-file-list .n-upload-file.n-upload-file--success-status .n-upload-file-info .n-upload-file-info__name) {
  color: #fff;
}
</style>
