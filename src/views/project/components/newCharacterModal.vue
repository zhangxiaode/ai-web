<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">新增角色</slot>
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
          <n-form-item label="角色名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入角色名称" />
          </n-form-item>
          <n-form-item label="角色描述:" path="desc">
            <n-input v-model:value="form.desc" type="textarea" placeholder="请输入角色描述" />
          </n-form-item>
          <n-form-item label="角色类型:" path="type">
            <n-radio-group v-model:value="form.type" name="type">
              <n-space>
                <n-radio v-for="(item, index) in character_type_options" :key="index" :value="item.value">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="性别:" path="gender">
            <n-radio-group v-model:value="form.gender" name="gender" @update:value="changeGender()">
              <n-space>
                <n-radio v-for="(item, index) in character_gender_options" :key="index" :value="item.value">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="音色:" path="voice_id">
            <n-select
              class="flex-1"
              v-model:value="form.voice_id"
              placeholder="请选择关联音色"
              :options="voice_options"
              label-field="label"
              value-field="id"
              clearable
            />
          </n-form-item>
          <n-form-item label="角色图片:" path="resource_path">
            <div class="flex flex-col">
              <n-button class="btn mb-12px" type="primary" size="small" @click="debouncing(onCreate, message, 2000)">AI创作</n-button>
              <Upload ref="uploadRef" accept="image/*" :max="1" :size_max="10" :get_file_path="({ file_name }) => `novel/${route.query.id}/character/${file_name}`" @change="({ resource_path }) => form.resource_path = resource_path[0].original_url" />
            </div>
          </n-form-item>
        </n-form>
        <CreateCharacterModal :detail="form" @save="handleCreateModalComplete" />
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
import { getVoiceList, getTemporaryUrl, getCharacterDetail, postCharacter, putCharacter } from "@/apis/index";
import CreateCharacterModal from './createCharacterModal.vue';
import Upload from '@/components/upload.vue';
import { character_type_options, character_gender_options } from '@/constants/index'

const route = useRoute()
const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()
const { showModal: showCreateModal } = useModal("create-modal");

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const uploadRef: any = ref(null)
const form: any = ref({
  id: null,
  type: null,
  gender: null,
  novel_id: null,
  voice_id: null,
  name: '',
  desc: '',
  resource_path: ''
});
const rules = {
  name: {required: true, message: "角色名称不能为空", trigger: ['blur', 'change']},
  resource_path: {required: true, message: "角色图片不能为空", trigger: ['blur', 'change']}
};
const voice_options = ref([])
const onCreate = async () => {
  showCreateModal();
}
const handleCreateModalComplete = (res: any) => {
  uploadRef.value.setResource([res])
  form.value.resource_path = res.original_url
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        novel_id: route.query.id,
        voice_id: form.value.voice_id,
        type: form.value.type,
        gender: form.value.gender,
        name: form.value.name,
        desc: form.value.desc,
        resource_path: form.value.resource_path
      }
      let f = postCharacter
      if(form.value.id) {
        f = putCharacter
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
const getOptions = async () => {
  const res: any = await getVoiceList({
    gender: form.value.gender
  })
  voice_options.value = res.data.map((item: any) => {
    item.label = `${item.name}(${item.gender === 1 ? '男' : '女'})`
    return item
  })
}
const changeGender = () => {
  form.value.voice_id = null
  getOptions()
}
const getCharacterInfo = async () => {
  const res: any = await getCharacterDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.voice_id = res.data.voice_id
  form.value.type = res.data.type
  form.value.gender = res.data.gender
  form.value.name = res.data.name
  form.value.desc = res.data.desc
  form.value.resource_path = res.data.resource_path

  const response: any = await getTemporaryUrl({ video_path: res.data.resource_path })
  if(response.data) {
    uploadRef.value?.setResource([{
      original_url: res.data.resource_path,
      sign_path: response.data
    }])
  }
}
watch(visible, async (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      await getCharacterInfo()
    }
    getOptions()
  } else {
    form.value = {
      id: null,
      name: '',
      desc: '',
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