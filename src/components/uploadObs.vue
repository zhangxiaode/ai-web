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
    :on-remove="removeUpload"
    :custom-request="(e: any) => customRequest(e)"
  >点击上传</n-upload>
</template>

<script lang="ts" setup>
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { getTemporaryUrl } from "@/apis/index";
import { splitFilename, splitPath, getFileType } from '@/utils/index';
import { getUser } from "@/utils/auth";
import { uploadObs } from "@/utils/obs";

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
const file_list: any = ref([])
  
const getUserInfo = async () => {
  const user: any = await getUser()
  user_info.value = user
}
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(props.size_max && options.file.file && options.file.file.size > props.size_max * 1024 * 1024) {
    message.error(`大小限制${props.size_max}MB以下`)
    return false
  } else {
    return true
  }
}
const removeUpload = async (options: { file: UploadFileInfo, fileList: UploadFileInfo[], index: number }) => {
  file_list.value.splice(options.index, 1);
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
      const res: any = await uploadObs(file_path, file?.file, onProgress)
      if(res.success) {
        const response: any = await getTemporaryUrl({ path: res.data })
        if(response.data) {
          if(file_list.value.every((item: any) => item.id !== file?.id)) {
            file_list.value.push({
              id: file?.id,
              name: name,
              url: response.data,
              original_url: res.data,
              file: file?.file,
              status: 'finished'
            })
          }
          emit('change', {
            resource_path: file_list.value
          })
          file.status = 'finished'
          onFinish()
          console.log(112233, resource_path.value, file_list.value)
        }
      } else {
        file.status = 'error'
        onError()
      }
    }
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const setResource = async (list: Array<any>) => {
  resource_path.value = list.map((item: any) => {
    const { name, ext } = splitPath(item.sign_path)
    const id = Date.now()
    return {
      id,
      name,
      url: item.sign_path,
      original_url: item.original_url,
      status: 'finished',
      file: {},
      percentage: 100,
      thumbnailUrl: null,
      type: getFileType(item.original_url),
      fullPath: item.sign_path,
      batchId: id
    }
  })
  file_list.value = JSON.parse(JSON.stringify(resource_path.value)).map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      original_url: item.original_url,
      status: item.status,
      file: item.file,
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