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
            <UploadObs accept="images/*" :max="1" :size_max="300" :get_file_path="({ user_id, file_name }) => `agent/${user_id}/${file_name}`" @change="({ resource_path }) => form.bg_url = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item label="上传音频:" path="audio_url">
            <UploadObs accept="audio/*" :max="1" :size_max="1024" :get_file_path="({ user_id, file_name }) => `agent/${user_id}/${file_name}`" @change="({ resource_path }) => form.audio_url = resource_path.map((item: any) => item.original_url)" />
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
import { createAgentVideo } from "@/apis/index";
import UploadObs from '@/components/uploadObs.vue';

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