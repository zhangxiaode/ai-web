<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 视频格式转换 -->
      <Upload accept="video/mp4, video/webm, video/mkv, video/avi, video/mov, video/flv, video/wmv, video/m3u8" :max="1" :size_max="1024" folder="video" @change="({ resource_path }) => video_url = resource_path.map((item: any) => item.original_url)[0]" />
      <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
        支持的文件类型：mp4, webm, mkv, avi, mov, flv, wmv, m3u8
      </n-text>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换视频格式" />
      </div>
      <div v-if="video_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
      <div v-if="video_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleDownload()">下载</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { conversionVideoFormat } from '@/apis/index';
import { staticUrl } from '@/utils/index';
import Upload from '@/components/upload.vue';

const dialog = useDialog()
const message = useMessage()
const video_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const output_path = computed(() => format.value === 'm3u8' ? `video/${file_name.value}/${file_name.value}.${format.value}` : `video/${file_name.value}.${format.value}`)
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
const handleFormat = async () => {
  const res: any = await conversionVideoFormat({
    input_path: video_url.value,
    output_path: output_path.value,
  })
  if(res.code === 200) {
    dialog.warning({
      title: '温馨提示',
      content: () => '视频转换成功，是否打开',
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
