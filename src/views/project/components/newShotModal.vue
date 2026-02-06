<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 800px;" @update:show="onClose">
    <template #header>
      <slot name="header">{{ form.id ? '编辑' : '新增' }}镜头</slot>
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
          <n-form-item label="镜头序号:" path="index">
            <n-input-number v-model:value="form.index" class="w-100%" :show-button="false" placeholder="请输入镜头序号" />
          </n-form-item>
          <n-form-item label="镜头名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入镜头名称" />
          </n-form-item>
          <n-form-item label="场景:" path="scene_ids">
            <n-select
              v-model:value="form.scene_ids"
              class="w-100px"
              placeholder="请选择关联场景"
              :options="scene_opts"
              value-field="id"
              label-field="name"
              clearable
              multiple
              filterable
              remote
              :loading="loadingSceneRef"
              @search="getSceneOptions"
            />
          </n-form-item>
          <n-form-item label="物品:" path="thing_ids">
            <n-select
              v-model:value="form.thing_ids"
              class="w-100px"
              placeholder="请选择关联物品"
              :options="thing_opts"
              value-field="id"
              label-field="name"
              clearable
              multiple
              filterable
              remote
              :loading="loadingThingRef"
              @search="getThingOptions"
            />
          </n-form-item>
          <n-form-item label="角色:" path="character_ids">
            <n-select
              v-model:value="form.character_ids"
              class="w-100px"
              placeholder="请选择关联角色"
              :options="role_opts"
              value-field="id"
              label-field="name"
              clearable
              multiple
              filterable
              remote
              :loading="loadingCharacterRef"
              @search="getCharacterOptions"
            />
          </n-form-item>
          <n-form-item label="镜头内容:" path="keyword">
            <n-input v-model:value="form.keyword" type="textarea" placeholder="请输入镜头内容" :rows="10" show-count :maxlength="5000" />
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
import { getSceneList, getCharacterList, getThingList, getShotDetail, postShot, putShot } from "@/apis/index";

const route = useRoute()
const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form: any = ref({
  id: null,
  index: null,
  name: '',
  scene_ids: [],
  thing_ids: [],
  character_ids: [],
  keyword: ''
});
const rules = {
  index: {required: true, type: 'number', message: "镜头序号不能为空", trigger: ['blur', 'change']},
  name: {required: true, message: "镜头名称不能为空", trigger: ['blur', 'change']},
};
const scene_opts = ref([])
const role_opts = ref([])
const thing_opts = ref([])
const loadingSceneRef = ref(false)
const loadingThingRef = ref(false)
const loadingCharacterRef = ref(false)

const getSceneOptions = async (query: string) => {
  loadingSceneRef.value = true
  const res: any = await getSceneList({
    novel_id: Number(route.query.novel_id),
    name: query
  })
  scene_opts.value = res.data
  loadingSceneRef.value = false
}
const getCharacterOptions = async (query: string) => {
  loadingCharacterRef.value = true
  const res: any = await getCharacterList({
    novel_id: Number(route.query.novel_id),
    name: query
  })
  role_opts.value = res.data
  loadingCharacterRef.value = false
}
const getThingOptions = async (query: string) => {
  loadingThingRef.value = true
  const res: any = await getThingList({
    novel_id: Number(route.query.novel_id),
    name: query
  })
  thing_opts.value = res.data
  loadingThingRef.value = false
}
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        chapter_id: Number(route.query.chapter_id),
        index: form.value.index,
        name: form.value.name,
        scene_ids: form.value.scene_ids.join(','),
        thing_ids: form.value.thing_ids.join(','),
        character_ids: form.value.character_ids.join(','),
        keyword: form.value.keyword,
      }
      let f = postShot
      if(form.value.id) {
        f = putShot
        params['id'] = form.value.id
      }
      try {
        const res: any = await f(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save')
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
const getShotInfo = async () => {
  const res: any = await getShotDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.index = res.data.index
  form.value.name = res.data.name
  form.value.scene_ids = res.data.scene_ids.split(',').map((id: string) => Number(id))
  form.value.thing_ids = res.data.thing_ids.split(',').map((id: string) => Number(id))
  form.value.character_ids = res.data.character_ids.split(',').map((id: string) => Number(id))
  form.value.keyword = res.data.keyword
}
watch(visible, (newValue: any) => {
  if(newValue) {
    getSceneOptions('')
    getCharacterOptions('')
    getThingOptions('')
    if(payload.value?.id) {
      getShotInfo()
    }
  } else {
    form.value = {
      id: null,
      index: null,
      name: '',
      scene_ids: [],
      thing_ids: [],
      character_ids: [],
      keyword: ''
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