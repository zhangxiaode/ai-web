<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 图片格式转换 -->
      <UploadObs ref="uploadRef" accept="image/png, image/jpg, image/jpeg, image/ico, image/gif, image/bmp, image/tif, image/tga, image/apng, image/pcx" :max="1" :size_max="20" :get_file_path="({ file_name }) => `image/${file_name}`" @change="handleUploadChange" />
      <n-text class="my-24px font-500 text-12px c-#666 leading-18px text-center">
        支持的文件类型：png, jpg, jpeg, ico, gif, bmp, tif, tga, apng, pcx
      </n-text>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换图片格式" />
      </div>
      <div v-if="image_url" class="flex items-center justify-center">
        <div class="w-150px h-50px leading-50px mx-12px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
        <div class="w-150px h-50px leading-50px mx-12px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleDownload()">下载</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { conversionImageFormat } from '@/apis/index';
import { filenameWithoutExt } from '@/utils/index';
import UploadObs from '@/components/uploadObs.vue';

const dialog = useDialog()
const message = useMessage()
const image_url: any = ref('')
const signed_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const output_path = computed(() => `image/${file_name.value}_${Date.now()}.${format.value}`)
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
const handleUploadChange = async ({ resource_path }) => {
  if(resource_path.length > 0) {
    image_url.value = resource_path[0].original_url
    signed_url.value = resource_path[0].url
    const file = resource_path[0].file
    file_name.value = filenameWithoutExt(file?.name as string)
  } else {
    image_url.value = ''
    signed_url.value = ''
    file_name.value = ''
  }
}
const handleFormat = async () => {
  const res: any = await conversionImageFormat({
    input_path: image_url.value,
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
      onPositiveClick() {
        window.open(res.data)
      },
      onNegativeClick: () => {
        message.warning('已取消')
      }
    })
  }
}
const handleDownload = () => {
  window.open(signed_url.value)
}
</script>

<style lang="scss" scoped>
:deep(.n-upload-file-list .n-upload-file.n-upload-file--success-status .n-upload-file-info .n-upload-file-info__name) {
  color: #fff;
}
</style>
