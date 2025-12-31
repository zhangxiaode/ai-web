<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 650px;" @update:show="onClose">
    <template #header>
      <slot name="header">创建角色</slot>
    </template>
    <slot>
      <div class="create-content">
        <n-form
          class="form max-h-400px overflow-auto"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-placement="left"
          label-width="180"
          require-mark-placement="right-hanging"
          size="medium"
        >
          <n-form-item label="模型:" path="model">
            <n-select
              v-model:value="form.model"
              placeholder="请选择AI模型"
              :options="[
                { label: '豆包seedream-4-0', value: 'doubao-seedream-4-0-250828' },
                { label: '千问image-plus', value: 'qwen-image-plus' },
                { label: '千问image-edit-plus', value: 'qwen-image-edit-plus' },
                { label: '万象2.5-t2i-preview', value: 'wan2.5-t2i-preview' },
                { label: '万象2.5-i2i-preview', value: 'wan2.5-i2i-preview' }
              ]"
              clearable
              @update:value="handleChangeModel()"
            />
          </n-form-item>
          <n-form-item label="提示词:" path="msg">
            <n-input v-model:value="form.msg" type="textarea" placeholder="请输入提示词" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'wan2.5-t2i-preview' || form.model === 'qwen-image-edit-plus' || form.model === 'wan2.5-i2i-preview'" label="期望生成图片数量:" path="output_image_number">
            <n-input-number v-model:value="form.output_image_number" :show-button="false" placeholder="请输入期望生成图片数量" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'wan2.5-t2i-preview' || form.model === 'qwen-image-edit-plus'" label="生成图片宽度(像素):" path="output_image_width">
            <n-input-number v-model:value="form.output_image_width" :show-button="false" placeholder="请输入生成图片宽度" />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'wan2.5-t2i-preview' || form.model === 'qwen-image-edit-plus'" label="生成图片高度(像素):" path="output_image_height">
            <n-input-number v-model:value="form.output_image_height" :show-button="false" placeholder="请输入生成图片高度" />
          </n-form-item>
          <n-form-item v-if="form.model === 'qwen-image-plus'" label="生成图片分辨率:" path="size">
            <n-select
              v-model:value="form.size"
              placeholder="请选择图片分辨率"
              :options="form_rules.output_image_size_options"
              clearable
              @update:value="handleChangeSize()"
            />
          </n-form-item>
          <n-form-item v-if="form.model === 'doubao-seedream-4-0-250828' || form.model === 'qwen-image-edit-plus' || form.model === 'wan2.5-i2i-preview'" label="上传图片:" path="images">
            <Upload :accept="suffix_accept" :max="form_rules.input_images_max || 1" :size_max="form_rules.input_image_size_max" :get_file_path="({ file_name }) => `novel/${route.query.id}/character/${file_name}`" @change="({ resource_path }) => form.images = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
        </n-form>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSubmit, message, 2000)">提交</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { FormInst } from 'naive-ui';
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { createCharacter, getOptions } from "@/apis/index";
import Upload from '@/components/upload.vue';

const route = useRoute()
const emit = defineEmits(["save"]);
const { visible, hideModal } = useModal('create-modal');
const message = useMessage()
const dialog = useDialog()

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form: any = ref({
  model: null,
  msg: '星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，抢视觉冲击力，电影大片，末日既视感，动感，对比色，oc渲染，光线追踪，动态模糊，景深，超现实主义，深蓝，画面通过细腻的丰富的色彩层次塑造主体与场景，质感真实，暗黑风背景的光影效果营造出氛围，整体兼具艺术幻想感，夸张的广角透视效果，耀光，反射，极致的光影，强引力，吞噬',
  output_image_number: 2,
  output_image_width: 1920,
  output_image_height: 1080,
  images: [],
  size: null
});
const rules = computed(() => {
  return {
    model: {required: true, message: "模型不能为空", trigger: ['blur', 'change']},
    msg: form_rules.value.input_msg_max ? [
      {required: true, message: "提示词不能为空", trigger: ['blur', 'change']},
      {max: form_rules.value.input_msg_max, message: `提示词长度限制${form_rules.value.input_msg_max}`, trigger: ['blur', 'change']}
    ] : [
      {required: true, message: "提示词不能为空", trigger: ['blur', 'change']}
    ],
    output_image_number: form_rules.value.input_output_images_max ? [
      {required: true, type: "number", message: "生成图片数量不能为空", trigger: ['blur', 'change']},
      {max: form_rules.value.input_output_images_max - form.value.images.length, type: "number", message: `生成图片数量最大为${form_rules.value.input_output_images_max - form.value.images.length}`, trigger: ['blur', 'change']}
    ] : form_rules.value.output_images_max ? [
      {required: true, type: "number", message: "生成图片数量不能为空", trigger: ['blur', 'change']},
      {max: form_rules.value.output_images_max, type: "number", message: `生成图片数量最大为${form_rules.value.output_images_max}`, trigger: ['blur', 'change']}
    ] : [],
    output_image_width: form_rules.value.output_image_width_min && form_rules.value.output_image_width_max ? [
      {required: true, type: "number", message: "生成图片宽度不能为空", trigger: ['blur', 'change']},
      {min: form_rules.value.output_image_width_min, type: "number", message: `生成图片宽度不能小于${form_rules.value.output_image_width_min}`, trigger: ['blur', 'change']},
      {max: form_rules.value.output_image_width_max, type: "number", message: `生成图片宽度不能大于${form_rules.value.output_image_width_max}`, trigger: ['blur', 'change']}
    ] : [],
    output_image_height: form_rules.value.output_image_height_min && form_rules.value.output_image_height_max ? [
      {required: true, message: "生成图片高度不能为空", type: "number", trigger: ['blur', 'change']},
      {min: form_rules.value.output_image_height_min, type: "number", message: `生成图片高度不能小于${form_rules.value.output_image_height_min}`, trigger: ['blur', 'change']},
      {max: form_rules.value.output_image_height_max, type: "number", message: `生成图片高度不能大于${form_rules.value.output_image_height_max}`, trigger: ['blur', 'change']}
    ] : [],
    images: form.value.model === 'qwen-image-edit-plus' || form.value.model === 'wan2.5-i2i-preview' ? [
      {required: true, type: 'array', message: "参考图不能为空", trigger: ['blur', 'change']}
    ] : [],
  }
});
const default_rules = ref({
  input_msg_max: null, // 提示词最大长度
  input_image_suffix_options: [], // 图片后缀列表
  input_image_size_max: 10, // 图片最大值
  input_images_max: null,  // 限制图片上传数量
  input_output_images_max: null,  // 上传图片+输出图片最大值
  output_images_max: null, // 输出图片数量限制
  output_image_width_min: null, // 输出图片宽度最小值
  output_image_width_max: null, // 输出图片宽度最大值
  output_image_height_min: null, // 输出图片高度最小值
  output_image_height_max: null, // 输出图片高度最大值
  output_image_size_options: null, // 输出图片尺寸下拉列表
})
const form_rules = ref(default_rules.value)
const suffix_accept = computed(() => form_rules.value.input_image_suffix_options?.length > 0 ? form_rules.value.input_image_suffix_options.map((item: any) => `image/${item.value}`).join(', ') : 'image/*')

const handleChangeModel = async () => {
  const res: any = await getOptions({ model: form.value.model })
  if(res.data.output_image_size_options && res.data.output_image_size_options.length > 0) {
    res.data.output_image_size_options = res.data.output_image_size_options.map((item: any) => ({
      label: item.resolution,
      value: item.resolution
    }))
  }
  form_rules.value = {...default_rules, ...res.data }
}
const handleChangeSize = async () => {
  const width_height = form.value.size.split('*')
  form.value.output_image_width = Number(width_height[0]) || 1328
  form.value.output_image_height = Number(width_height[1]) || 1328
}
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      try {
        const params: any = JSON.parse(JSON.stringify(form.value))
        params['novel_id'] = route.query.id
        delete params['size'];
        const res: any = await createCharacter(params)
        if(res.code == 200 && res?.data && res?.data.length > 0) {
          let current = ref(0)
          dialog.warning({
            title: '选择心仪图片',
            content: () => h('div', { class: 'overflow-auto max-h-300px' }, {
              default: () => res?.data?.map((item: any, index: number) => h('img', { 
                width: '100px', 
                height: '100px', 
                class: `cursor-pointer rounded-5px border-1px border-style-solid ${current.value === index ? 'border-color-#f44' : 'border-color-transparent'}`, 
                src: item.sign_path,
                onClick() {
                  current.value = index
                }
              }, {}))
            }),
            positiveText: '确定',
            positiveButtonProps: {type: "primary"},
            showIcon: false,
            closable: false,
            onPositiveClick() {
              emit('save', {
                original_url: res.data[current.value].original_url,
                sign_path: res.data[current.value].sign_path
              })
              onClose()
            }
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
  } else {
    // form.value = {
    //   model: null,
    //   msg: '',
    //   output_image_number: null,
    //   output_image_width: null,
    //   output_image_height: null,
    //   images: [],
    //   size: null
    // }
  }
});
</script>

<style lang="scss" scoped>
.create-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>