<template>
  <div class="h-100% overflow-auto">
    <div class="p-32px flex flex-col justify-center items-center">
      <!-- 音频格式转换 -->
      <Upload accept="audio/mp3, audio/wav, audio/flac, audio/aac, audio/ogg, audio/m4a, audio/opus, audio/wma, audio/ac3" :max="1" :size_max="300" folder="audio" @change="({ resource_path }) => audio_url = resource_path.map((item: any) => item.original_url)[0]" />
      <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
        支持的文件类型：mp3, wav, flac, aac, ogg, m4a, opus, wma, ac3
      </n-text>
      <div class="format my-24px">
        <n-select class="w-200px" v-model:value="format" :options="format_options" placeholder="请选择转换音频格式" />
      </div>
      <div v-if="audio_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleFormat()">格式转换</div>
      <div v-if="audio_url" class="w-150px h-50px leading-50px px-16px rounded-25px bg-#db2777 text-center c-#fff text-14px cursor-pointer" @click="handleDownload()">下载</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { conversionImageFormat } from '@/apis/index';
import { staticUrl } from '@/utils/index';
import Upload from '@/components/upload.vue';

const dialog = useDialog()
const message = useMessage()
const audio_url: any = ref('')
const file_name: any = ref('')
const format = ref(null)
const output_path = computed(() => `audio/${file_name.value}.${format.value}`)
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
const handleFormat = async () => {
  const res: any = await conversionImageFormat({
    input_path: audio_url.value,
    output_path: output_path.value,
  })
  if(res.code === 200) {
    dialog.warning({
      title: '温馨提示',
      content: () => '音频转换成功，是否打开',
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
