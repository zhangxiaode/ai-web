<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">{{ form.id ? '编辑' : '新增' }}智能体</slot>
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
          <n-form-item label="智能体名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入智能体名称" />
          </n-form-item>
          <n-form-item label="智能体描述:" path="desc">
            <n-input v-model:value="form.desc" type="textarea" placeholder="请输入智能体描述" />
          </n-form-item>
          <n-form-item label="上传图片:" path="photo">
            <UploadObs accept="images/*" :max="1" :size_max="300" :get_file_path="({ user_id, file_name }) => `agent/${user_id}/${file_name}`" @change="({ resource_path }) => form.photo = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item label="上传视频:" path="video_url">
            <UploadObs accept="video/*" :max="1" :size_max="1024" :get_file_path="({ user_id, file_name }) => `agent/${user_id}/${file_name}`" @change="({ resource_path }) => form.video_url = resource_path.map((item: any) => item.original_url)" />
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
import { getAgentDetail, postAgent, putAgent } from "@/apis/index";
import UploadObs from '@/components/uploadObs.vue';

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form = ref({
  id: null,
  name: '',
  desc: '',
  photo: '',
  video_url: '',
});
const rules = {
  name: {required: true, message: "智能体名称不能为空", trigger: ['blur', 'change']},
  photo: {required: true, message: "智能体图片不能为空", trigger: ['blur', 'change']},
  video_url: {required: true, message: "智能体视频不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        name: form.value.name,
        desc: form.value.desc,
        photo: form.value.photo,
        video_url: form.value.video_url,
      }
      let f = postAgent
      if(form.value.id) {
        f = putAgent
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
            photo: res?.data?.photo,
            video_url: res?.data?.video_url
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
const getAgentInfo = async () => {
  const res: any = await getAgentDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.desc = res.data.desc
  form.value.photo = res.data.photo
  form.value.video_url = res.data.video_url
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getAgentInfo()
    }
  } else {
    form.value = {
      id: null,
      name: '',
      desc: '',
      photo: '',
      video_url: '',
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