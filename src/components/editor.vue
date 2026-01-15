<template>
  <div class="border-1px border-color-#ccc border-style-solid">
    <Toolbar
      class="border-b-1px border-b-color-[#ccc] border-b-style-solid"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="overflow-y-hidden"
      :style="{ height: `${height}px`}"
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
:root, :host {
  /* textarea - 暗色主题适配 */
  --w-e-textarea-bg-color: #1e1e1e; /* 编辑器文本区主背景：深灰（VS Code 暗色同款） */
  --w-e-textarea-color: #e0e0e0; /* 文本颜色：浅灰，保证可读性 */
  --w-e-textarea-border-color: #333333; /* 边框色：深灰，弱化但可见 */
  --w-e-textarea-slight-border-color: #2d2d2d; /* 次要边框色：比主边框稍浅 */
  --w-e-textarea-slight-color: #666666; /* 次要文字/分割色：中灰 */
  --w-e-textarea-slight-bg-color: #252526; /* 次要背景色：比主背景稍浅，区分区块 */
  --w-e-textarea-selected-border-color: #1967d2; /* 选中边框色：深蓝色，暗色下更醒目 */
  --w-e-textarea-handler-bg-color: #3b82f6; /* 手柄背景色：亮蓝色，保留交互辨识度 */

  /* toolbar - 暗色主题适配 */
  --w-e-toolbar-color: #cccccc; /* 工具栏文字/图标色：浅灰 */
  --w-e-toolbar-bg-color: #2d2d2d; /* 工具栏背景：比文本区稍浅的深灰，区分区域 */
  --w-e-toolbar-active-color: #ffffff; /* 激活态文字/图标：纯白，强化对比 */
  --w-e-toolbar-active-bg-color: #3a3a3a; /* 激活态背景：比工具栏背景稍浅 */
  --w-e-toolbar-disabled-color: #777777; /* 禁用态颜色：中灰，弱化 */
  --w-e-toolbar-border-color: #333333; /* 工具栏边框：深灰，和整体风格统一 */

  /* modal - 暗色主题适配 */
  --w-e-modal-button-bg-color: #333333; /* 弹窗按钮背景：深灰 */
  --w-e-modal-button-border-color: #444444; /* 弹窗按钮边框：比背景稍浅的灰 */
}
</style>