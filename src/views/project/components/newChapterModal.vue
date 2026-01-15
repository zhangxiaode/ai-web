<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 800px;" @update:show="onClose">
    <template #header>
      <slot name="header">{{ form.id ? '编辑' : '新增' }}章节</slot>
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
          <n-form-item label="章节序号:" path="index">
            <n-input-number v-model:value="form.index" class="w-100%" :show-button="false" placeholder="请输入章节序号" />
          </n-form-item>
          <n-form-item label="章节名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入章节名称" />
          </n-form-item>
          <n-form-item label="章节内容:" path="content">
            <!-- <Editor :value="form.content" :height="500" placeholder="请输入章节内容" @change="val => form.content = val" /> -->
            <n-input v-model:value="form.content" type="textarea" placeholder="请输入章节内容" :rows="10" show-count :maxlength="5000" />
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
import { getChapterDetail, postChapter, putChapter } from "@/apis/index";
// import Editor from "@/components/editor.vue"

const route = useRoute()
const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
// const uploadRef: any = ref(null)
const form = ref({
  id: null,
  index: null,
  name: '',
  content: ''
});
const rules = {
  index: {required: true, type: 'number', message: "章节序号不能为空", trigger: ['blur', 'change']},
  name: {required: true, message: "章节名称不能为空", trigger: ['blur', 'change']},
  content: {required: true, message: "章节内容不能为空", trigger: ['blur', 'change']}
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        novel_id: route.query.id,
        index: form.value.index,
        name: form.value.name,
        content: form.value.content,
      }
      let f = postChapter
      if(form.value.id) {
        f = putChapter
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
const getChapterInfo = async () => {
  const res: any = await getChapterDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.index = res.data.index
  form.value.name = res.data.name
  form.value.content = res.data.content
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getChapterInfo()
    }
  } else {
    form.value = {
      id: null,
      index: null,
      name: '',
      content: ''
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