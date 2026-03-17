<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">{{ form.id ? '编辑' : '新增' }}音色</slot>
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
          <n-form-item label="音色名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入音色名称" />
          </n-form-item>
          <n-form-item label="音色平台:" path="platform">
            <n-select
              v-model:value="form.platform"
              placeholder="请选择音色平台"
              :options="platform_opts"
              clearable
            />
          </n-form-item>
          <n-form-item label="是否公共音色:" path="is_public">
            <n-switch v-model:value="form.is_public" :checked-value="1" :unchecked-value="0" />
          </n-form-item>
          <n-form-item label="音色性别:" path="gender">
            <n-select
              v-model:value="form.gender"
              placeholder="请选择音色性别"
              :options="gender_opts"
              clearable
            />
          </n-form-item>
          <n-form-item label="配音语言:" path="language">
            <n-select
              v-model:value="form.language"
              placeholder="请选择配音语言"
              :options="language_opts"
              clearable
            />
          </n-form-item>
          <n-form-item label="训练音频:" path="training_path">
            <UploadObs accept="audio/*" :max="1" :size_max="300" :get_file_path="({ user_id, file_name }) => `invoice/${form.platform === 1 ? 'doubao' : 'qwen'}/${user_id}/${file_name}`" @change="({ resource_path }) => form.training_path = resource_path.map((item: any) => item.original_url)" />
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
import { language_opts, gender_opts, platform_opts } from '@/constants/index';
import { getVoiceDetail, postVoice, putVoice } from "@/apis/index";
import UploadObs from '@/components/uploadObs.vue';

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-voice-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  name: '',
  platform: null,
  is_public: 0,
  gender: null,
  voice_id: '',
  language: null,
  training_path: '',
  resource_path: ''
});
const rules = {
  name: {required: true, message: "音色名称不能为空", trigger: ['blur', 'change']},
  platform: {required: true, type: "number", message: "音色平台不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        name: form.value.name,
        platform: form.value.platform,
        is_public: form.value.is_public,
        gender: form.value.gender,
        voice_id: form.value.voice_id,
        language: form.value.language,
        training_path: form.value.training_path,
        resource_path: form.value.resource_path
      }
      let f = postVoice
      if(form.value.id) {
        f = putVoice
        params['id'] = form.value.id
      }
      try {
        const res: any = await f(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save', {
            id: res?.data?.id,
            name: res?.data?.name,
            platform: res?.data?.platform,
            is_public: res?.data?.is_public,
            gender: res?.data?.gender,
            voice_id: res?.data?.voice_id,
            language: res?.data?.language,
            training_path: res?.data?.training_path,
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
  const res: any = await getVoiceDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.platform = res.data.platform
  form.value.is_public = res.data.is_public || 0
  form.value.gender = res.data.gender
  form.value.voice_id = res.data.voice_id
  form.value.language = res.data.language
  form.value.training_path = res.data.training_path
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
      platform: null,
      is_public: 0,
      gender: null,
      voice_id: '',
      language: null,
      training_path: '',
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