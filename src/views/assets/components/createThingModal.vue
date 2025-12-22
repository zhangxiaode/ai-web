<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">创建物品</slot>
    </template>
    <slot>
      <div class="create-content">
        <n-form
          class="form"
          :ref="formRef"
          :model="form"
          :rules="rules"
          label-placement="left"
          label-width="150"
          require-mark-placement="right-hanging"
          size="medium"
        >
          <n-form-item label="模型:" path="model">
            <n-select
              v-model:value="form.model"
              placeholder="请选择AI模型"
              :options="[
                { label: '豆包seedream-4-0', value: 'doubao-seedream-4-0-250828' },
                { label: '千问image-plus', value: 'qwen-image-plus' },
                { label: '千问image-edit-plus', value: 'qwen-image-edit-plus' },
                { label: '万象2.5-t2i-preview', value: 'wan2.5-t2i-preview' },
                { label: '万象2.5-i2i-preview', value: 'wan2.5-i2i-preview' }
              ]"
              clearable
              @undate:value="handleChangeModel()"
            />
          </n-form-item>
          <n-form-item label="提示词:" path="msg">
            <n-input v-model:value="form.msg" type="textarea" placeholder="请输入提示词" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'wan2.5-t2i-preview' || form.model === 'qwen-image-edit-plus' || form.model === 'wan2.5-i2i-preview'" label="生成图片数量:" path="output_image_number">
            <n-input-number v-model:value="form.output_image_number" placeholder="请输入生成图片数量" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'qwen-image-plus' || form.model === 'wan2.5-t2i-preview' || form.model === 'qwen-image-edit-plus'" label="生成图片宽度(像素):" path="output_image_width">
            <n-input-number v-model:value="form.output_image_width" placeholder="请输入生成图片宽度" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'qwen-image-plus' || form.model === 'wan2.5-t2i-preview' || form.model === 'qwen-image-edit-plus'" label="生成图片高度(像素):" path="output_image_height">
            <n-input-number v-model:value="form.output_image_height" placeholder="请输入生成图片高度" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'qwen-image-edit-plus' || form.model === 'wan2.5-i2i-preview'" label="上传图片:" path="images">
            <n-upload
              ref="upload"
              multiple
              directory-dnd
              action=""
              :headers="{}"
              :data="{}"
              :max="1"
              method="post"
              accept="image/*"
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
import { uploadFileToOBS, createThing, getOptions } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, hideModal } = useModal('create-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form: any = ref({
  model: null,
  msg: '',
  output_image_number: null,
  output_image_width: null,
  output_image_height: null,
  images: []
});
const rules = computed(() => {
  return {
    model: {required: true, message: "模型不能为空", trigger: ['blur', 'change']},
    msg: {required: true, message: "提示词不能为空", trigger: ['blur', 'change']},
    output_image_number: {required: true, message: "提示词不能为空", trigger: ['blur', 'change']},
    output_image_width: {required: true, message: "提示词不能为空", trigger: ['blur', 'change']},
    output_image_height: {required: true, message: "提示词不能为空", trigger: ['blur', 'change']},
    images: {required: true, message: "提示词不能为空", trigger: ['blur', 'change']},
  }
});
const handleChangeModel = async () => {
  const res = await getOptions({ model: form.value.model })
  console.log(form.value, res)
}
const beforeUpload = (options: { file: UploadFileInfo, fileList: UploadFileInfo[] }): (Promise<boolean | void> | boolean | void) => {
  if(!options.file.file?.type.includes('image')) {
    message.error('只能上传图片格式的文件，请重新上传')
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
    formData.append('file_path', `thing/${user.id}/${name}_${Date.now()}${ext}`);
    const res: any = await uploadFileToOBS(formData, onProgress)
    form.value.images.push(res.data)
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const onSubmit = async () => {
  disabled.value = true
  try {
    const res: any = await createThing(form.value)
    if (res.code == 200 || res.code == 0) {
      onClose()
      emit('save', res)
    }
  } catch (error) {
    console.log(error)
  }
  disabled.value = false
}
const onClose = () => {
  hideModal();
}
watch(visible, (newValue: any) => {
  if(newValue) {
  } else {
    form.value = {
      model: null,
      msg: '',
      output_image_number: null,
      output_image_width: null,
      output_image_height: null,
      images: []
    }
  }
});
</script>

<style lang="scss" scoped>
.skip {
  top: 12px;
  right: 12px;
  width: 70px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, .2);
  border-radius: 15px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.create-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>