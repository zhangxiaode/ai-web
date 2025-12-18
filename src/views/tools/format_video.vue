<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 视频格式转换 -->
      <n-upload
        ref="upload"
        multiple
        directory-dnd
        action=""
        :headers="{}"
        :data="{}"
        :max="1"
        method="post"
        accept="video/mp4, video/webm, video/mkv, video/avi, video/mov, video/flv, video/wmv, video/m3u8"
        :on-before-upload="beforeUpload"
        :custom-request="(e: any) => customRequest(e)"
      >
        <n-upload-dragger class="flex flex-col justify-center items-center bg-#a5a5a5 rounded-14px border-1px border-color-[transparent] border-style-dashed hover:bg-#494949 hover:border-color-#666">
          <div class="mb-12px">
            <img src="../../assets/upload.png" class="w-120px h-120px" alt="">
          </div>
          <div class="flex flex-column justify-center items-center">
            <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
              将文件拖至此区域,或<span class="c-#53d8fe">点击上传</span>
            </n-text>
            <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
              支持的文件类型：mp4, webm, mkv, avi, mov, flv, wmv, m3u8
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换视频格式" />
      </div>
      <div v-if="video_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
      <div v-if="video_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleDownload()">下载</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { uploadFile, conversionVideoFormat } from '@/apis/index';
import { filenameWithoutExt } from '@/utils/index';

const message = useMessage()
const video_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const output_path = computed(() => format.value === 'm3u8' ? `demo/${file_name.value}/${file_name.value}.${format.value}` : `demo/${file_name.value}.${format.value}`)
const format_options = ref([
  { label: 'mp4', value: 'mp4' },
  { label: 'webm', value: 'webm' },
  { label: 'mkv', value: 'mkv' },
  { label: 'avi', value: 'avi' },
  { label: 'mov', value: 'mov' },
  { label: 'flv', value: 'flv' },
  { label: 'wmv', value: 'wmv' },
  { label: 'm3u8', value: 'm3u8' },
])
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
    file_name.value = filenameWithoutExt(file.name)
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
const handleFormat = async () => {
  const res: any = await conversionVideoFormat({
    input_path: video_url.value.replace('/Users/zxd/ai/', ''),
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
