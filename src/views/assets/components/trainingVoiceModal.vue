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
import { trainingVoice } from "@/apis/index";
import UploadObs from '@/components/uploadObs.vue';

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