<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">{{ form.id ? '编辑' : '新增' }}音效</slot>
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
            <UploadObs ref="uploadRef" accept="audio/*" :max="1" :size_max="300" :get_file_path="({ user_id, file_name }) => `sound/${user_id}/${file_name}`" @change="({ resource_path }) => form.resource_path = resource_path.map((item: any) => item.original_url)" />
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
import { getSoundDetail, postSound, putSound, getTemporaryUrl } from "@/apis/index";
import UploadObs from '@/components/uploadObs.vue';

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const uploadRef: any = ref(null)
const form: any = ref({
  id: null,
  name: '',
  resource_path: []
});
const rules = {
  name: {required: true, message: "音效名称不能为空", trigger: ['blur', 'change']},
  resource_path: {required: true, type: 'array', message: "音效不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        name: form.value.name,
        resource_path: form.value.resource_path[0]
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
const getSoundInfo = async () => {
  const res: any = await getSoundDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.resource_path = [ res?.data?.resource_path ]
  const response: any = await getTemporaryUrl({ path: res.data.resource_path })
  if(response.data) {
    uploadRef.value?.setResource([{
      original_url: res.data.resource_path,
      sign_path: response.data
    }])
  }
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getSoundInfo()
    }
  } else {
    form.value = {
      id: null,
      name: '',
      resource_path: []
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