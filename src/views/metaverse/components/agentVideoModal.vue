<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">生成智能体视频</slot>
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
          <n-form-item label="上传背景图:" path="bg_url">
            <n-upload
              ref="upload"
              multiple
              directory-dnd
              action=""
              :headers="{}"
              :data="{}"
              :max="1"
              method="post"
              accept="images/*"
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
          <n-form-item label="上传音频:" path="audio_url">
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
              :on-before-upload="beforeUploadAudio"
              :custom-request="(e: any) => customRequestAudio(e)"
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
import { uploadFileToOBS, createAgentVideo } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('agent-video-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  audio_url: '',
  bg_url: '',
});
const rules = {
  audio_url: {required: true, message: "音频不能为空", trigger: ['blur', 'change']}
};
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(options.file.file && options.file.file.size > 1024 * 1024 * 1024) {
    message.error('大小限制300MB以下')
    return false
  } else {
    return true
  }
}
const beforeUploadAudio = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(options.file.file && options.file.file.size > 1024 * 1024 * 1024) {
    message.error('大小限制1GB以下')
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
    formData.append('file_path', `agent/${user.id}/${name}_${Date.now()}${ext}`);
    const res: any = await uploadFileToOBS(formData, onProgress)
    form.value.bg_url = res.data
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const customRequestAudio = async ({
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
    formData.append('file_path', `agent/${user.id}/${name}_${Date.now()}${ext}`);
    const res: any = await uploadFileToOBS(formData, onProgress)
    form.value.audio_url = res.data
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
        id: payload.value?.id,
        audio_url: form.value.audio_url,
        bg_url: form.value.bg_url
      }
      try {
        const res: any = await createAgentVideo(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save', res)
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
</script>

<style lang="scss" scoped>
.new-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>