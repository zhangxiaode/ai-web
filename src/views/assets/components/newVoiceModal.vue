<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">新增音色</slot>
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
          <n-form-item label="音色性别:" path="gender">
            <n-select
              v-model:value="form.gender"
              placeholder="请选择音色性别"
              :options="gender_opts"
              clearable
            />
          </n-form-item>
          <n-form-item label="三方配音音色ID:" path="voice_id">
            <n-input v-model:value="form.voice_id" placeholder="请输入三方配音音色ID" />
          </n-form-item>
          <n-form-item label="配音语言:" path="language">
            <n-select
              v-model:value="form.language"
              placeholder="请选择配音语言"
              :options="language_opts"
              clearable
            />
          </n-form-item>
          <n-form-item label="资源地址:" path="resource_path">
            <n-input v-model:value="form.resource_path" placeholder="请输入资源地址" />
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
import { ref, watch } from 'vue'
import { FormInst, useMessage } from 'naive-ui';
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { language_opts, gender_opts, platform_opts } from '@/constants/index';
import { getVoiceDetail, postThirdVoice, postVoice, putVoice } from "@/apis/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  name: '',
  platform: null,
  gender: null,
  voice_id: '',
  language: null,
  resource_path: ''
});
const rules = {
  name: {required: true, message: "音色名称不能为空", trigger: ['blur', 'change']},
  platform: {required: true, message: "音色平台不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
  disabled.value = true
  let params = {
    name: form.value.name,
    platform: form.value.platform,
    gender: form.value.gender,
    voice_id: form.value.voice_id,
    language: form.value.language,
    resource_path: form.value.resource_path
  }
  let f = postThirdVoice
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
        gender: res?.data?.gender,
        voice_id: res?.data?.voice_id,
        language: res?.data?.language,
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
const getVoiceInfo = async () => {
  const res: any = await getVoiceDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.platform = res.data.platform
  form.value.gender = res.data.gender
  form.value.voice_id = res.data.voice_id
  form.value.language = res.data.language
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
      gender: null,
      voice_id: '',
      language: null,
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