<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">新增项目</slot>
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
          <n-form-item label="项目名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入项目名称" />
          </n-form-item>
          <n-form-item label="项目描述:" path="desc">
            <n-input v-model:value="form.desc" type="textarea" placeholder="请输入项目描述" />
          </n-form-item>
          <n-form-item label="项目封面:" path="poster">
            <div class="flex flex-col">
              <Upload ref="uploadRef" accept="image/*" :max="1" :size_max="10" :get_file_path="({ file_name }) => `novel/poster/${file_name}`" @change="({ resource_path }) => form.poster = resource_path[0].original_url" />
            </div>
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
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getTemporaryUrl, getProjectDetail, postProject, putProject } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const uploadRef: any = ref(null)
const form = ref({
  id: null,
  name: '',
  desc: '',
  poster: ''
});
const rules = {
  name: {required: true, message: "项目名称不能为空", trigger: ['blur', 'change']},
  desc: {required: true, message: "项目描述不能为空", trigger: ['blur', 'change']},
  poster: {required: true, message: "项目封面不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        name: form.value.name,
        desc: form.value.desc,
        poster: form.value.poster
      }
      let f = postProject
      if(form.value.id) {
        f = putProject
        params['id'] = form.value.id
      }
      try {
        const res: any = await f(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save', {
            id: res?.data?.id,
            name: res?.data?.name,
            desc: res?.data?.desc,
            poster: res?.data?.poster
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
  const res: any = await getProjectDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.desc = res.data.desc
  form.value.poster = res.data.poster
  const response: any = await getTemporaryUrl({ video_path: res.data.poster })
  if(response.data) {
    uploadRef.value?.setResource([{
      original_url: res.data.poster,
      sign_path: response.data
    }])
  }
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
      desc: '',
      poster: ''
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