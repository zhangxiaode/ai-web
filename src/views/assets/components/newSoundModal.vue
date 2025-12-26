<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">新增音效</slot>
    </template>
    <slot>
      <div class="new-content">
        <n-form
          class="form"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-placement="left"
          label-width="150"
          require-mark-placement="right-hanging"
          size="medium"
        >
          <n-form-item label="音效名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入音效名称" />
          </n-form-item>
          <n-form-item label="上传音效:" path="resource_path">
            <n-upload
              ref="upload"
              multiple
              directory-dnd
              action=""
              :headers="{}"
              :data="{}"
              :max="1"
              method="post"
              accept="audio/*"
              :on-before-upload="beforeUpload"
              :custom-request="(e: any) => customRequest(e)"
            >
              <n-upload-dragger class="flex flex-col justify-center items-center bg-#a5a5a5 rounded-14px border-1px border-color-[transparent] border-style-dashed hover:bg-#494949 hover:border-color-#666">
                <div class="mb-12px">
                  <img src="../../../assets/upload.png" class="w-120px h-120px" alt="">
                </div>
                <div class="flex flex-column justify-center items-center">
                  <n-text class="font-500 text-12px c-#666 leading-18px text-center my-6px">
                    将文件拖至此区域,或<span class="c-#53d8fe">点击上传</span>
                  </n-text>
                </div>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
        </n-form>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSubmit, message, 2000)">保存</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { FormInst } from 'naive-ui';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { useModal } from "@/hooks";
import { splitFilename, debouncing } from '@/utils/index';
import { getUser } from "@/utils/auth";
import { uploadFileToOBS, getSoundDetail, postSound, putSound } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  name: '',
  resource_path: ''
});
const rules = {
  name: {required: true, message: "音效名称不能为空", trigger: ['blur', 'change']},
  resource_path: {required: true, message: "音效不能为空", trigger: ['blur', 'change']}
};
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
    const { name, ext } = splitFilename(file.name)
    const formData: any = new FormData();
    formData.append('file', file.file);
    const user: any = await getUser()
    formData.append('file_path', `sound/${user.id}/${name}_${Date.now()}${ext}`);
    const res: any = await uploadFileToOBS(formData, onProgress)
    form.value.resource_path = res.data
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        name: form.value.name,
        resource_path: form.value.resource_path
      }
      let f = postSound
      if(form.value.id) {
        f = putSound
        params['id'] = form.value.id
      }
      try {
        const res: any = await f(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save', {
            id: res?.data?.id,
            name: res?.data?.name,
            resource_path: res?.data?.resource_path
          })
        }
      } catch (error) {
        console.log(error)
      }
      disabled.value = false
    }
  })
}
const onClose = () => {
  hideModal();
}
const getVoiceInfo = async () => {
  const res: any = await getSoundDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.resource_path = res.data.resource_path
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getVoiceInfo()
    }
  } else {
    form.value = {
      id: null,
      name: '',
      resource_path: ''
    }
  }
});
</script>

<style lang="scss" scoped>
.new-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>