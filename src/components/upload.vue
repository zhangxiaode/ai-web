<template>
    <n-upload
        ref="upload"
        v-model:file-list="resource_path"
        multiple
        directory-dnd
        action=""
        :headers="{}"
        :data="{}"
        :max="max || 1"
        method="post"
        :accept="accept"
        list-type="image-card"
        :on-before-upload="beforeUpload"
        :custom-request="(e: any) => customRequest(e)"
    >点击上传</n-upload>
</template>
  
<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { uploadFileToOBS, getTemporaryUrl } from "@/apis/index";
import { splitFilename, splitPath } from '@/utils/index';
import { getUser } from "@/utils/auth";

const message = useMessage()
const props = defineProps({
    accept: { type: String, default: '' },
    max: { type: Number, default: 1 },
    size_max: { type: Number, default: 10 },
    get_file_path: { type: Function, default: () => '' }
})
const emit = defineEmits(["change"]);

const user_info: any = ref(null)
const resource_path: any = ref([])
  
const getUserInfo = async () => {
    const user: any = await getUser()
    user_info.value = user
}
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(!options.file.file?.type.includes('image')) {
    message.error('只能上传图片格式的图片文件，请重新上传')
    return false
  }
  if(props.size_max && options.file.file && options.file.file.size > props.size_max * 1024 * 1024) {
    message.error(`大小限制${props.size_max}MB以下`)
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
    if(file) {
      const { name, ext } = splitFilename(file?.name)
      const formData: any = new FormData();
      formData.append('file', file?.file);
      const file_path = props.get_file_path({
        user_id: user_info.value?.id,
        file_name: `${name}_${Date.now()}${ext}`
      })
      formData.append('file_path', file_path);
      const res: any = await uploadFileToOBS(formData, onProgress)
      if(res.data) {
        const response: any = await getTemporaryUrl({ video_path: res.data })
        if(response.data) {
            resource_path.value = [
              {
                id: file?.id,
                name: name,
                url: response.data,
                original_url: res.data,
                status: 'finished'
              },
            ]
            emit('change', {
              resource_path: resource_path.value
            })
            file.status = 'finished'
            onFinish()
        }
      }
    }
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const setResource = async (list: Array<any>) => {
  resource_path.value = list.map((item: any) => {
    const { name } = splitPath(item.sign_path)
    return {
      id: Date.now(),
      name,
      url: item.sign_path,
      original_url: item.original_url,
      status: 'finished'
    }
  })
}
defineExpose({ setResource });

onMounted(async () => {
  getUserInfo()
})
</script>
  
<style scoped>
</style>