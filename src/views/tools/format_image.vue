<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 图片格式转换 -->
      <n-upload
        ref="upload"
        multiple
        directory-dnd
        action=""
        :headers="{}"
        :data="{}"
        :max="1"
        method="post"
        accept="image/*"
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
          </div>
        </n-upload-dragger>
      </n-upload>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换图片格式" />
      </div>
      <div v-if="image_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { uploadFile, conversionImageFormat } from '@/apis/index';
import { filenameWithoutExt } from '@/utils/index';

const message = useMessage()
const image_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const format_options = ref([
  { label: 'png', value: 'png' },
  { label: 'jpg', value: 'jpg' },
  { label: 'jpeg', value: 'jpeg' },
  { label: 'ico', value: 'ico' },
  { label: 'gif', value: 'gif' },
  { label: 'bmp', value: 'bmp' },
  { label: 'tif', value: 'tif' },
  { label: 'tga', value: 'tga' },
  { label: 'apng', value: 'apng' },
  { label: 'pcx', value: 'pcx' },
])
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(!options.file.file?.type.includes('image')) {
    message.error('只能上传图片格式的图片文件，请重新上传')
    return false
  }
  if(options.file.file && options.file.file.size > 20 * 1024 * 1024) {
    message.error('大小限制20MB以下')
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
    image_url.value = res.data
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const handleFormat = async () => {
  const res: any = await conversionImageFormat({
    input_path: image_url.value.replace('/Users/zxd/ai/', ''),
    output_path: `demo/${file_name.value}.${format.value}`,
  })
  console.log(123, res)
}
</script>

<style lang="scss" scoped>
:deep(.n-upload-file-list .n-upload-file.n-upload-file--success-status .n-upload-file-info .n-upload-file-info__name) {
  color: #fff;
}
</style>
