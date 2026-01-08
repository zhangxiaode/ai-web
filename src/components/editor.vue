<template>
  <div class="border-1px border-color-#ccc border-style-solid">
    <Toolbar
      class="border-b-1px border-b-color-[#ccc] border-b-style-solid"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :class="`h-${height}px overflow-y-hidden`"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="(editor: any) => editorRef = editor"
    />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const emit = defineEmits(["change"]);
const props = defineProps({
  placeholder: { type: String, default: '请输入内容...' },
  height: { type: Number, default: 500 },
  value: { type: String, default: '' },
})
const valueHtml = ref(props.value)
const editorRef = shallowRef()
const mode = ref('default')
const toolbarConfig = {}
const editorConfig = { placeholder: props.placeholder }

watch(() => valueHtml.value, () => {
  emit('change', valueHtml.value)
});
watch(() => props.value, () => {
  valueHtml.value = props.value
});
onBeforeUnmount(() => {
  editorRef.value && editorRef.value.destroy()
})
</script>

<style scoped>
.wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>