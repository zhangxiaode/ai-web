<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">新增物品</slot>
    </template>
    <slot>
      <div class="new-content">
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
          <n-form-item label="物品类型:" path="type">
            <n-radio-group v-model:value="form.type" name="form_type">
              <n-radio-button :value="0" label="AI生成" />
              <n-radio-button :value="1" label="自定义" />
            </n-radio-group>
          </n-form-item>
          <n-form-item label="物品名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入物品名称" />
          </n-form-item>
          <n-form-item label="物品描述:" path="desc">
            <n-input v-model:value="form.desc" placeholder="请输入物品描述" />
          </n-form-item>
          <n-form-item v-if="form.type === 0" label="AI创建:" path="resource_path">
            <n-button class="btn" type="primary" size="small" @click="debouncing(onCreate, message, 2000)">AI创作</n-button>
          </n-form-item>
          <n-form-item v-else label="上传物品:" path="resource_path">
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
        <CreateThingModal @save="handleCreateModalComplete" />
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
import { uploadFileToOBS, getThingDetail, postThing, putThing } from "@/apis/index";
import CreateThingModal from './createThingModal.vue';

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()
const { showModal: showCreateModal } = useModal("create-modal");

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  type: 0,
  name: '',
  desc: '',
  resource_path: ''
});
const rules = {
  name: {required: true, message: "物品名称不能为空", trigger: ['blur', 'change']},
  resource_path: {required: true, message: "物品不能为空", trigger: ['blur', 'change']}
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
    formData.append('file_path', `thing/${user.id}/${name}_${Date.now()}${ext}`);
    const res: any = await uploadFileToOBS(formData, onProgress)
    form.value.resource_path = res.data
    file.status = 'finished'
    onFinish()
  } catch (error: any) {
    file.status = 'error'
    onError()
  }
}
const onCreate = async () => {
  showCreateModal();
}
const handleCreateModalComplete = (res: any) => {
  console.log(123, res)
};
const onSubmit = async () => {
  disabled.value = true
  let params = {
    name: form.value.name,
    resource_path: form.value.resource_path
  }
  let f = postThing
  if(form.value.id) {
    f = putThing
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
const onClose = () => {
  hideModal();
}
const getThingInfo = async () => {
  const res: any = await getThingDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.resource_path = res.data.resource_path
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getThingInfo()
    }
  } else {
    form.value = {
      id: null,
      type: 0,
      name: '',
      desc: '',
      resource_path: ''
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

.new-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>