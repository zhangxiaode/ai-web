<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 音频格式转换 -->
      <n-upload
        ref="upload"
        multiple
        directory-dnd
        action=""
        :headers="{}"
        :data="{}"
        :max="1"
        method="post"
        accept="audio/mp3, audio/wav, audio/flac, audio/aac, audio/ogg, audio/m4a, audio/opus, audio/wma, audio/ac3"
        :on-before-upload="beforeUpload"
        :custom-request="(e: any) => customRequest(e)"
      >
        <n-upload-dragger class="flex flex-col justify-center items-center bg-#a5a5a5 rounded-14px border-1px border-color-[transparent] border-style-dashed hover:bg-#494949 hover:border-color-#666">
          <div style="margin-bottom: 12px">
            <img src="../../assets/upload.png" class="w-120px h-120px" alt="">
          </div>
          <div class="flex flex-column justify-center items-center">
            <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
              将文件拖至此区域,或<span class="c-#53d8fe">点击上传</span>
            </n-text>
            <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
              支持的文件类型：mp3, wav, flac, aac, ogg, m4a, opus, wma, ac3
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换音频格式" />
      </div>
      <div v-if="audio_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
      <div v-if="audio_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleDownload()">下载</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { uploadFile, conversionImageFormat } from '@/apis/index';
import { filenameWithoutExt } from '@/utils/index';

const message = useMessage()
const audio_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const output_path = computed(() => `demo/${file_name.value}.${format.value}`)
const format_options = ref([
  { label: 'mp3', value: 'mp3' },
  { label: 'wav', value: 'wav' },
  { label: 'flac', value: 'flac' },
  { label: 'aac', value: 'aac' },
  { label: 'ogg', value: 'ogg' },
  { label: 'm4a', value: 'm4a' },
  { label: 'opus', value: 'opus' },
  { label: 'wma', value: 'wma' },
  { label: 'ac3', value: 'ac3' },
])
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(!options.file.file?.type.includes('audio')) {
    message.error('只能上传音频格式的音频文件，请重新上传')
    return false
  }
  if(options.file.file && options.file.file.size > 300 * 1024 * 1024) {
    message.error('大小限制300MB以下')
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
    file_name.value = filenameWithoutExt(file.name)
    formData.append('file', file.file);
    formData.append('folder', 'demo');
    const res: any = await uploadFile(formData, onProgress)
    audio_url.value = res.data
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const handleFormat = async () => {
  const res: any = await conversionImageFormat({
    input_path: audio_url.value.replace('/Users/zxd/ai/', ''),
    output_path: output_path.value,
  })
  console.log(123, res)
}
const handleDownload = () => {
  window.open(`/ai/apis/file/download?file_url=${output_path.value}`)
}
</script>

<style lang="scss" scoped>
:deep(.n-upload-file-list .n-upload-file.n-upload-file--success-status .n-upload-file-info .n-upload-file-info__name) {
  color: #fff;
}
</style>
