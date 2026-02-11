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
        accept="image/png, image/jpg, image/jpeg, image/ico, image/gif, image/bmp, image/tif, image/tga, image/apng, image/pcx"
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
              支持的文件类型：png, jpg, jpeg, ico, gif, bmp, tif, tga, apng, pcx
            </n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换图片格式" />
      </div>
      <div v-if="image_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
      <div v-if="image_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleDownload()">下载</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { uploadFile, conversionImageFormat } from '@/apis/index';
import { staticUrl, filenameWithoutExt } from '@/utils/index';

const dialog = useDialog()
const message = useMessage()
const image_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const output_path = computed(() => `image/${file_name.value}.${format.value}`)
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
    console.log(111, file);
    const formData: any = new FormData();
    file_name.value = filenameWithoutExt(file.name)
    formData.append('file', file.file);
    formData.append('folder', 'image');
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
    input_path: image_url.value.replace('/zxd/data/ai/', ''),
    output_path: output_path.value,
  })
  if(res.code === 200) {
    dialog.warning({
      title: '温馨提示',
      content: () => '图片转换成功，是否打开',
      positiveText: '确定',
      negativeText: '取消',
      positiveButtonProps: {type: "primary"},
      showIcon: false,
      closable: false,
      onPositiveClick: async () => {
        window.open(`${staticUrl}/${output_path.value}`)
      },
      onNegativeClick: () => {
        message.warning('已取消')
      }
    })
  }
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
