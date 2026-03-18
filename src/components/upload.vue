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
import { uploadFile } from "@/apis/index";
import { splitFilename, splitPath } from '@/utils/index';

const message = useMessage()
const props = defineProps({
  accept: { type: String, default: '' },
  max: { type: Number, default: 1 },
  size_max: { type: Number, default: 10 },
  folder: { type: String, default: 'demo' },
})
const emit = defineEmits(["change"]);

const resource_path: any = ref([])
const file_list: any = ref([])

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
  emit('change', {
    resource_path: file_list.value
  })
}
const customRequest = async ({
  file,
  onFinish,
  onError,
  onProgress
}: UploadCustomRequestOptions) => {
  try {
    if(file) {
      const { name } = splitFilename(file?.name)
      const formData: any = new FormData();
      formData.append('file', file?.file);
      formData.append('folder', props.folder);
      const res: any = await uploadFile(formData, onProgress)
      if(res.code == 200) {
        if(file_list.value.every((item: any) => item.id !== file?.id)) {
          file_list.value.push({
            id: file?.id,
            name: name,
            url: res.data.signed_url,
            original_url: res.data.original_url,
            file: file?.file,
            status: 'finished'
          })
        }
        emit('change', {
          resource_path: file_list.value
        })
        file.status = 'finished'
        onFinish()
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
    const { name } = splitPath(item.sign_path)
    return {
      id: Date.now(),
      name,
      url: item.sign_path,
      original_url: item.original_url,
      status: 'finished'
    }
  })
  file_list.value = JSON.parse(JSON.stringify(resource_path.value))
}
defineExpose({ setResource });
</script>
  
<style scoped>
</style>