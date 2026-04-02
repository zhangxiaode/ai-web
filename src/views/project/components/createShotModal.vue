<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 650px;" @update:show="onClose">
    <template #header>
      <slot name="header">生成镜头</slot>
    </template>
    <slot>
      <div class="create-content" v-loading="loading">
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
                { label: '白泽知命视觉模型专业版', value: 'cyzx-video-d-pro' },
                { label: '白泽知命视觉模型轻量版', value: 'cyzx-video-d-lite' },
                { label: '白泽冰晶图生视频预览版', value: 'cyzx-video-q-i2v-preview' },
                { label: '白泽冰晶图生视频增强版', value: 'cyzx-video-q-i2v-plus' },
                { label: '白泽冰晶图生视频极速版', value: 'cyzx-video-q-i2v-turbo' },
                { label: '白泽冰晶关键帧生视频极速版', value: 'cyzx-video-q-kf2v-flash' },
                { label: '白泽冰晶关键帧生视频增强版', value: 'cyzx-video-q-kf2v-plus' },
                { label: '白泽冰晶文生视频预览版', value: 'cyzx-video-q-t2v-preview' },
                { label: '白泽冰晶视频模型增强版', value: 'cyzx-video-q-vace-plus' },
                { label: '白泽冰晶视频动作生成', value: 'cyzx-video-q-animate-move' },
                { label: '白泽冰晶视频混合动画', value: 'cyzx-video-q-animate-mix' },
                { label: '白泽冰晶音频生视频', value: 'cyzx-video-q-s2v' }
              ]"
              clearable
              @update:value="handleChangeModel()"
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-d-pro',
            'cyzx-video-d-lite',
            'cyzx-video-q-i2v-preview',
            'cyzx-video-q-i2v-plus',
            'cyzx-video-q-i2v-turbo',
            'cyzx-video-q-kf2v-flash',
            'cyzx-video-q-kf2v-plus',
            'cyzx-video-q-t2v-preview',
            'cyzx-video-q-vace-plus',
            ].includes(form.model)" label="提示词:" path="msg">
            <n-input v-model:value="form.msg" :max="form_rules.input_msg_max" type="textarea" placeholder="请输入提示词" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-i2v-turbo',
            'cyzx-video-q-kf2v-plus',
            ].includes(form.model)" label="反向提示词:" path="negative_prompt">
            <n-input v-model:value="form.negative_prompt" :max="form_rules.input_negative_msg_max" type="textarea" placeholder="请输入反向提示词" />
          </n-form-item>
          <n-form-item v-if="[
              'cyzx-video-d-lite',
              'cyzx-video-q-i2v-preview',
              'cyzx-video-q-i2v-plus',
              'cyzx-video-q-i2v-turbo',
              'cyzx-video-q-kf2v-flash',
              'cyzx-video-q-kf2v-plus',
            ].includes(form.model)" label="首帧图片:" path="first_frame">
            <UploadObs ref="uploadRef" :accept="suffix_accept" :max="1" :size_max="form_rules.input_image_size_max" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.first_frame = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
              'cyzx-video-d-lite',
              'cyzx-video-q-kf2v-flash',
              'cyzx-video-q-kf2v-plus',
            ].includes(form.model)" label="尾桢图片:" path="last_frame">
            <UploadObs ref="uploadRef" :accept="suffix_accept" :max="1" :size_max="form_rules.input_image_size_max" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.last_frame = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
              'cyzx-video-d-pro',
            ].includes(form.model)" label="参考图片:" path="reference_image">
            <UploadObs ref="uploadRef" :accept="suffix_accept" :max="form_rules.input_images_max || 3" :size_max="form_rules.input_image_size_max" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.reference_image = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
              'cyzx-video-d-pro',
              'cyzx-video-d-lite',
              'cyzx-video-q-i2v-preview',
              'cyzx-video-q-i2v-plus',
              'cyzx-video-q-i2v-turbo',
              'cyzx-video-q-kf2v-flash',
              'cyzx-video-q-kf2v-plus',
              'cyzx-video-q-s2v',
            ].includes(form.model)" label="生成视频分辨率:" path="resolution">
            <n-select
              v-model:value="form.resolution"
              placeholder="请选择视频分辨率"
              :options="form_rules.output_video_resolution_options"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-d-pro',
            'cyzx-video-d-lite',
            ].includes(form.model)" label="输出视频时长:" path="output_video_duration">
            <n-input-number v-model:value="form.output_video_duration" :min="form_rules.output_video_duration_min" :max="form_rules.output_video_duration_max" :show-button="false" placeholder="请输入输出视频时长" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-i2v-preview',
            'cyzx-video-q-t2v-preview',
            ].includes(form.model)" label="输出视频时长:" path="output_video_duration">
            <n-select
              v-model:value="form.output_video_duration"
              placeholder="请选择输出视频时长"
              :options="form_rules.output_video_duration_options"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-d-pro',
            'cyzx-video-d-lite',
            ].includes(form.model)" label="是否固定摄像头:" path="camerafixed">
            <n-switch v-model:value="form.camerafixed" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-i2v-preview',
            'cyzx-video-q-t2v-preview',
            ].includes(form.model)" label="是否添加音频:" path="audio">
            <n-switch v-model:value="form.audio" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-i2v-preview',
            'cyzx-video-q-t2v-preview',
            'cyzx-video-q-s2v',
            ].includes(form.model)" label="上传音频:" path="audio_url">
            <UploadObs ref="uploadRef" :accept="suffix_audio_accept" :max="1" :size_max="form_rules.input_audio_size_max" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.audio_url = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-i2v-plus',
            'cyzx-video-q-i2v-turbo',
            'cyzx-video-q-kf2v-plus'
          ].includes(form.model)" label="视频特效:" path="template">
            <n-cascader
              v-model:value="form.template"
              placeholder="请选择视频特效"
              :options="form_rules.input_template_options"
              check-strategy="child"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-t2v-preview',
            ].includes(form.model)" label="生成视频宽高比:" path="size">
            <n-select
              v-model:value="form.size"
              placeholder="请选择视频宽高比"
              :options="form_rules.output_video_width_height_options"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-vace-plus'
            ].includes(form.model)" label="生成视频宽高比:" path="size">
            <n-select
              v-model:value="form.size"
              placeholder="请选择视频宽高比"
              :options="form_rules.output_video_resolution_options"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-vace-plus',
            ].includes(form.model)" label="参考图片:" path="ref_images_url">
            <UploadObs ref="uploadRef" :accept="suffix_accept" :max="form_rules.input_images_max || 3" :size_max="form_rules.input_image_size_max" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.ref_images_url = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-vace-plus',
            ].includes(form.model)" label="参考图用途:" path="obj_or_bg">
            <n-select
              v-model:value="form.obj_or_bg"
              placeholder="请选择参考图用途"
              multiple
              :options="form_rules.obj_or_bg_options"
              clearable
            />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-animate-move',
            'cyzx-video-q-animate-mix',
            'cyzx-video-q-s2v'
            ].includes(form.model)" label="参考图片:" path="image_url">
            <UploadObs ref="uploadRef" :accept="suffix_accept" :max="1" :size_max="form_rules.input_image_size_max || 9999" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.image_url = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-animate-move',
            'cyzx-video-q-animate-mix'
            ].includes(form.model)" label="参考视频:" path="video_url">
            <UploadObs ref="uploadRef" accept="video/*" :max="1" :size_max="form_rules.input_video_size_max" :get_file_path="({ file_name }) => `chapter/${route.query.chapter_id}/video_script/shot/zh_${Date.now()}_${file_name}`" @change="({ resource_path }) => form.video_url = resource_path.map((item: any) => item.original_url)" />
          </n-form-item>
          <n-form-item v-if="[
            'cyzx-video-q-animate-move',
            'cyzx-video-q-animate-mix'
            ].includes(form.model)" label="模型类型:" path="mode">
            <n-select
              v-model:value="form.mode"
              placeholder="请选择模型类型"
              :options="form_rules.mode_options"
              clearable
            />
          </n-form-item>
        </n-form>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="loading" :disabled="loading" @click="debouncing(onSubmit, message, 2000)">提交</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { FormInst } from 'naive-ui';
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { createShot, putShotVideo, getOptions } from "@/apis/index";
import UploadObs from '@/components/uploadObs.vue';

const route = useRoute()
const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('create-modal');
const message = useMessage()
const dialog = useDialog()

const loading: any = ref(false)
const formRef = ref<FormInst | null>(null)
const form: any = ref({
  model: null,
  msg: '',
  negative_prompt: '',
  first_frame: [],
  last_frame: [],
  reference_image: [],
  resolution: '',
  output_video_duration: null,
  camerafixed: '',
  audio: false,
  audio_url: [],
  template: '',
  size: null,
  ref_images_url: [],
  obj_or_bg: '',
  image_url: [],
  video_url: [],
  mode: '',
  input_seed: 123
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
    negative_prompt: form_rules.value.input_negative_msg_max ? [
      {required: true, message: "反向提示词不能为空", trigger: ['blur', 'change']},
      {max: form_rules.value.input_negative_msg_max, message: `反向提示词长度限制${form_rules.value.input_negative_msg_max}`, trigger: ['blur', 'change']}
    ] : [
      {required: true, message: "反向提示词不能为空", trigger: ['blur', 'change']}
    ],
    // first_frame: '',
    // last_frame: '',
    // reference_image: [],
    // resolution: '',
    // output_video_duration: '',
    // camerafixed: '',
    // audio: false,
    // audio_url: '',
    // template: '',
    // size: null,
    // ref_images_url: [],
    // obj_or_bg: '',
    // image_url: '',
    // video_url: '',
    // mode: '',
  }
});
const default_rules = ref({
  input_msg_max: null, // 提示词最大长度
  input_negative_msg_max: null, // 反向提示词最大长度
  input_image_suffix_options: [], // 图片后缀列表
  input_audio_suffix_options: [], // 音频后缀列表
  input_image_size_max: 10, // 图片最大值
  input_audio_size_max: 10, // 音频最大值
  input_video_size_max: 1000, // 音频最大值
  output_video_duration_min: 2, // 视频时长最小值
  output_video_duration_max: 10, // 视频时长最大值
  input_images_max: null,  // 限制图片上传数量
  input_template_options: [], // 视频特效
  output_video_resolution_options: [], // 输出视频的分辨率
  output_video_duration_options: [], // 输出视频时长
  output_video_width_height_options: [], // 输出视频的宽高比
  obj_or_bg_options: [], // 参考图用途
  mode_options: [], // 模型类型
})
const form_rules = ref(default_rules.value)
const suffix_accept = computed(() => form_rules.value.input_image_suffix_options?.length > 0 ? form_rules.value.input_image_suffix_options.map((item: any) => `image/${item.value}`).join(', ') : 'image/*')
const suffix_audio_accept = computed(() => form_rules.value.input_audio_suffix_options?.length > 0 ? form_rules.value.input_audio_suffix_options.map((item: any) => `audio/${item.value}`).join(', ') : 'audio/*')

const handleChangeModel = async () => {
  const res: any = await getOptions({ model: form.value.model })
  form_rules.value = {...default_rules, ...res.data }
}
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const params: any = JSON.parse(JSON.stringify(form.value))
        params['novel_id'] = route.query.novel_id
        params.first_frame = params.first_frame[0]
        params.last_frame = params.last_frame[0]
        params.image_url = params.image_url[0]
        params.audio_url = params.audio_url[0]
        params.video_url = params.video_url[0]
        const res: any = await createShot(params)
        if(res.code == 200 && res?.data?.video_url) {
          dialog.warning({
            title: '选择心仪视频',
            content: () => h('div', { class: 'overflow-auto max-h-300px' }, {
              default: () => [
                h('video', { 
                  width: '100px', 
                  height: '100px', 
                  class: `cursor-pointer rounded-5px border-1px border-style-solid border-color-#f44`, 
                  src: res?.data?.video_url,
                  onClick() {
                    window.open(res?.data?.video_url)
                  }
                }, {})
              ]
            }),
            positiveText: '确定',
            negativeText: '取消',
            positiveButtonProps: {type: "primary"},
            showIcon: false,
            closable: false,
            async onPositiveClick() {
              const response: any = await putShotVideo({
                chapter_id: route.query.chapter_id,
                shot_id: payload.value.shot_id,
                video_url: res?.data?.video_url
              })
              emit('save', response)
              onClose()
            },
            onNegativeClick: () => {}
          })
        }
      } catch (error) {
        console.log(error)
      }
      loading.value = false
    }
  })
}
const onClose = () => {
  hideModal();
}
</script>

<style lang="scss" scoped>
.create-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>