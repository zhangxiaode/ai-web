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
          <n-form-item label="角色类型:" path="type">
            <n-radio-group v-model:value="form.type" name="type">
              <n-space>
                <n-radio v-for="(item, index) in character_type_options" :key="index" :value="item.value">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="性别:" path="gender">
            <n-radio-group v-model:value="form.gender" name="gender">
              <n-space>
                <n-radio v-for="(item, index) in character_gender_options" :key="index" :value="item.value">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="年龄段:" path="people_years_old">
            <n-radio-group v-model:value="form.people_years_old" name="people_years_old">
              <n-space>
                <n-radio v-for="(item, index) in character_people_years_old_options" :key="index" :value="item.value">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="体型:" path="people_body">
            <n-radio-group v-model:value="form.people_body" name="people_body">
              <n-space>
                <n-radio v-for="(item, index) in character_people_body_options" :key="index" :value="item.value">{{ item.label }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="眼睛颜色:" path="eye_color">
            <n-select
              class="flex-1"
              v-model:value="form.eye_color"
              placeholder="请选择眼睛颜色"
              :options="character_eye_color_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="头发颜色:" path="hair_color">
            <n-select
              class="flex-1"
              v-model:value="form.hair_color"
              placeholder="请选择头发颜色"
              :options="character_hair_color_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="头发类型:" path="hair_style">
            <n-select
              class="flex-1"
              v-model:value="form.hair_style"
              placeholder="请选择头发类型"
              :options="character_hair_style_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="衣服颜色:" path="cloth_color">
            <n-select
              class="flex-1"
              v-model:value="form.cloth_color"
              placeholder="请选择衣服颜色"
              :options="character_cloth_color_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="衣服类型:" path="cloth_style">
            <n-select
              class="flex-1"
              v-model:value="form.cloth_style"
              placeholder="请选择衣服类型"
              :options="character_cloth_style_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="动物类型:" path="animal_type">
            <n-select
              class="flex-1"
              v-model:value="form.animal_type"
              placeholder="请选择动物类型"
              :options="character_animal_type_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="体型:" path="animal_body">
            <n-select
              class="flex-1"
              v-model:value="form.animal_body"
              placeholder="请选择体型"
              :options="character_animal_body_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="年龄段:" path="animal_years_old">
            <n-select
              class="flex-1"
              v-model:value="form.animal_years_old"
              placeholder="请选择年龄段"
              :options="character_animal_years_old_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="动物颜色:" path="animal_color">
            <n-select
              class="flex-1"
              v-model:value="form.animal_color"
              placeholder="请选择动物颜色"
              :options="character_animal_color_options"
              clearable
            />
          </n-form-item>
          <n-form-item label="小说ID:" path="novel_id">
            <n-select
              class="flex-1"
              v-model:value="form.novel_id"
              placeholder="请选择小说ID"
              :options="[]"
              clearable
            />
          </n-form-item>
          <n-form-item label="音色:" path="voice_id">
            <n-select
              class="flex-1"
              v-model:value="form.voice_id"
              placeholder="请选择关联音色"
              :options="[]"
              clearable
            />
          </n-form-item>
          <n-form-item label="角色名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入角色名称" />
          </n-form-item>
          <n-form-item label="角色描述:" path="desc">
            <n-input v-model:value="form.desc" placeholder="请输入角色描述" />
          </n-form-item>
          <n-form-item label="角色图片:" path="resource_path">
            <div class="flex flex-col">
              <n-button class="btn mb-12px" type="primary" size="small" @click="debouncing(onCreate, message, 2000)">AI创作</n-button>
              <Upload ref="uploadRef" accept="image/*" :max="1" :size_max="10" :get_file_path="({ file_name }) => `novel/${route.query.id}/character/${file_name}`" @change="({ resource_path }) => form.resource_path = resource_path[0].original_url" />
            </div>
          </n-form-item>
        </n-form>
        <CreateSceneModal @save="handleCreateModalComplete" />
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
import { getTemporaryUrl, getSceneDetail, postScene, putScene } from "@/apis/index";
import CreateSceneModal from './createSceneModal.vue';
import Upload from '@/components/upload.vue';
import { character_type_options, character_gender_options, character_people_years_old_options, character_people_body_options, character_eye_color_options, character_hair_color_options, character_hair_style_options, character_cloth_color_options, character_cloth_style_options, character_animal_type_options, character_animal_body_options, character_animal_years_old_options, character_animal_color_options } from '@/constants/index'

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
  people_years_old: null,
  people_body: null,
  eye_color: '',
  hair_color: '',
  hair_style: null,
  cloth_color: '',
  cloth_style: null,
  animal_type: null,
  animal_body: null,
  animal_years_old: null,
  animal_color: '',
  novel_id: '',
  voice_id: '',
  name: '',
  desc: '',
  resource_path: ''
});
const rules = {
  name: {required: true, message: "角色名称不能为空", trigger: ['blur', 'change']},
  resource_path: {required: true, message: "角色图片不能为空", trigger: ['blur', 'change']}
};
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
        name: form.value.name,
        desc: form.value.desc,
        resource_path: form.value.resource_path
      }
      let f = postScene
      if(form.value.id) {
        f = putScene
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
const getSceneInfo = async () => {
  const res: any = await getSceneDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
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
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getSceneInfo()
    }
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