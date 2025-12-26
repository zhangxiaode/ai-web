<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">训练音色</slot>
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
          <n-form-item label="训练音频:" path="training_path">
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
import { uploadFileToOBS, trainingVoice } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('training-voice-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  platform: null,
  training_path: ''
});
const rules = {
  training_path: {required: true, message: "训练音频不能为空", trigger: ['blur', 'change']}
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
    formData.append('file_path', `${form.value.platform === 1 ? 'invoice/doubao' : 'invoice/qwen'}/${name}_${Date.now()}${ext}`);
    const res: any = await uploadFileToOBS(formData, onProgress)
    form.value.training_path = res.data
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
        id: form.value.id,
        training_path: form.value.training_path
      }
      try {
        const res: any = await trainingVoice(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save', {
            id: res?.data?.id,
            training_path: res?.data?.training_path
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
watch(visible, (newValue: any) => {
  if(newValue) {
    form.value.id = payload.value.id
    form.value.platform = payload.value.platform
  } else {
    form.value = {
      id: null,
      platform: null,
      training_path: '',
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