<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 650px;" @update:show="onClose">
    <template #header>
      <slot name="header">创建镜头</slot>
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
            <Upload :accept="suffix_accept" :max="form_rules.input_images_max || 1" :size_max="form_rules.input_image_size_max" :get_file_path="({ file_name }) => `novel/${route.query.id}/scene/${file_name}`" @change="({ resource_path }) => form.images = resource_path.map((item: any) => item.original_url)" />
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
// 基础信息：镜头序号、时长、画幅比例（16:9/2.35:1 电影画幅 / 9:16 竖屏）；
// 视觉核心：景别（近景 / 中景 / 全景）、镜头类型（固定 / 跟拍 / 摇镜）、画面主体 + 动作 + 环境；
// 风格调性：影视风格（院线电影 / 网剧 / 纪录片 / 微电影）、色调（暖调 / 冷调 / 复古胶片）、画质（4K/8K、60 帧、HDR）；
// 细节补充：光影（侧光 / 逆光 / 柔光）、质感（写实 / 唯美 / 赛博朋克）、镜头质感（电影镜头 / 手持抖动 / 航拍）；
// 声画同步：背景音效、环境音、无配乐 / 轻配乐（部分 AI 支持音效生成，需明确）。

// 镜头X，时长X秒，画幅X:X，影视级[风格]，[景别]+[镜头类型]，画面内容：[剧本里的人物/场景/动作，精准描述]，光影：[光影类型]，画质：4K/8K 60帧 HDR，色调：[色调]，环境音：[环境音]，无多余画面，镜头稳定，符合影视镜头语言

/**
镜头X，
时长：X秒，
画幅：16:9，// （4:3 16:9 2:1 1.66:1 1.85:1 2.39:1 9:16） 
影视风格：如：张艺谋式国风电影/诺兰式悬疑电影/日系治愈微电影]，
1. 剧情 / 现实题材
写实纪实风 古典叙事风 极简冷感风 温暖胶片风
2. 悬疑 / 犯罪 / 侦探
黑色电影风 冷峻写实犯罪风 心理惊悚风 复古侦探风
3. 科幻 / 未来 / 赛博朋克
赛博朋克霓虹风 硬核科幻写实风 史诗科幻风 复古未来风
4. 动作 / 警匪 / 战争
硬核动作风 港式警匪风 战争写实风 宽银幕史诗动作风
5. 奇幻 / 古装 / 武侠 / 仙侠
东方水墨古风 武侠写实风 奇幻童话风 暗黑奇幻风
6. 喜剧 / 青春 / 爱情
明亮清新风 复古青春风 黑色幽默风 浪漫唯美风
7. 恐怖 / 惊悚
传统恐怖风 心理恐怖风 复古恐怖风
8. 艺术 / 实验片
极简主义风 超现实梦境风 形式主义风

[景别]_[运镜方式]_[镜头类型]： 大远景+航拍+摇镜， // （近景 / 中景 / 全景）- 固定 / 跟拍 / 摇镜
[ 
  "大远景_固定_空镜", "大远景_固定_俯拍", "大远景_推_俯拍", "大远景_拉_俯拍", "大远景_摇_俯拍", "大远景_移_俯拍", "大远景_跟_俯拍", "大远景_升降_俯拍", "大远景_环绕_俯拍", 
  "大远景_旋转_俯拍", "大远景_甩_俯拍", "大远景_航拍_固定", "大远景_航拍_推", "大远景_航拍_拉", "大远景_航拍_摇", "大远景_航拍_移", "大远景_航拍_跟", "大远景_航拍_升降", 
  "大远景_航拍_环绕", "大远景_航拍_延时", "远景_固定_空镜", "远景_固定_俯拍", "远景_推_俯拍", "远景_拉_俯拍", "远景_摇_俯拍", "远景_移_俯拍", "远景_跟_俯拍", "远景_升降_俯拍",
  "远景_环绕_俯拍", "远景_航拍_固定", "远景_航拍_推", "远景_航拍_拉", "远景_航拍_摇", "远景_航拍_移", "远景_航拍_跟", "远景_航拍_升降", "远景_航拍_环绕", "远景_航拍_延时", 
  "全景_固定_平视", "全景_固定_俯拍", "全景_推_平视", "全景_拉_平视", "全景_摇_平视", "全景_移_平视", "全景_跟_平视", "全景_升降_平视", "全景_环绕_平视", "全景_稳定器_跟", 
  "全景_稳定器_推拉", "全景_稳定器_摇移", "全景_航拍_固定", "全景_航拍_推", "全景_航拍_拉", "全景_航拍_摇", "全景_航拍_环绕", "全景_一镜到底_长镜头", "中景_固定_平视", 
  "中景_推_平视", "中景_拉_平视", "中景_摇_平视", "中景_移_平视", "中景_跟_平视", "中景_稳定器_跟", "中景_稳定器_推拉", "中景_手持_跟", "中景_手持_抖", "中近景_固定_平视", 
  "中近景_推_平视", "中近景_拉_平视", "中近景_跟_平视", "中近景_稳定器_跟", "中近景_手持_跟", "近景_固定_平视", "近景_推_平视", "近景_拉_平视", "近景_跟_平视", "近景_稳定器_跟",
  "近景_手持_跟", "近景_固定_过肩", "近景_固定_正反打", "特写_固定_特写", "特写_推_特写", "特写_拉_特写", "特写_微距_固定", "特写_固定_过肩", "特写_固定_正反打", "大特写_固定_大特写", 
  "大特写_微距_固定", "大特写_推_大特写", "主观_手持_第一人称", "主观_稳定器_第一人称", "空镜_固定_空镜", "空镜_航拍_延时", "空镜_航拍_摇", "慢镜头_固定_慢动作", "慢镜头_跟_慢动作", 
  "慢镜头_稳定器_慢动作", "延时_固定_延时", "延时_航拍_延时", "长镜头_一镜到底_长镜头", "长镜头_稳定器_长镜头", "长镜头_手持_长镜头"
]
画面主体：[人物特征+动作细节+表情]，
场景环境：[场景细节+布景+景深，如：景深较浅/大广角全景]，
光影：[专业光影，如：伦勃朗光/逆光轮廓光/阴天柔光]，
[
  "顺光", "侧光", "逆光", "侧逆光", "顶光", "底光", "斜侧光", "45°侧光", "90°侧光", "高反差光影", "低反差光影", "硬光", "柔光", "自然光", "人工光", "混合光", "冷暖对比光",
  "单色光", "多色光", "霓虹光", "赛博光", "复古胶片光", "胶片颗粒光影", "暗调光影", "亮调光影", "中间调光影", "剪影", "半剪影", "轮廓光", "边缘光", "光斑", "光晕", "丁达尔光",
  "漏光", "光斑散景", "百叶窗光", "窗光", "门廊光", "走廊光", "舞台光", "聚光", "追光", "阴影切割", "局部光", "点光", "面光", "环境光", "反射光", "水面反光", "雨夜反光",
  "霓虹反光", "烟雾光", "雾光", "逆光眩光", "过曝高光", "暗角光影", "悬疑光影", "黑色电影光影", "恐怖光影", "惊悚光影", "浪漫光影", "唯美光影", "清新光影", "温暖光影",
  "冷峻光影", "史诗光影", "赛博朋克光影", "复古光影", "纪实光影", "极简光影", "东方水墨光影"
]
画质：8K RAW 60帧，HDR10+，电影镜头质感，
色彩分级：[具体色调]，
[
  "冷色调", "暖色调", "中性色调", "高饱和", "低饱和", "褪色感", "胶片感", "复古褪色", "高对比", "低对比", "亮调", "暗调", "中间调", "日系清新", "韩系唯美", "欧美胶片", "港风复古", 
  "赛博朋克", "霓虹赛博", "黑金风格", "青橙对比", "蓝橙对比", "莫兰迪色", "马卡龙色", "糖果色", "黑白", "单色", "双色对比", "多色撞色", "水墨国风", "古风淡雅", "电影感调色", "纪实感调色",
  "胶片颗粒", "复古胶片", "柯达胶片", "富士胶片", "宝丽来", "复古港风", "复古80s", "复古90s", "欧美大片", "好莱坞调色", "北欧冷感", "法式浪漫", "意式复古", "德式冷峻", "悬疑冷色",
  "惊悚冷色", "恐怖暗调", "黑色电影", "犯罪冷峻", "科幻冷灰", "史诗暖金", "战争暗黄", "动作高对比", "爱情暖粉", "浪漫唯美", "青春明亮", "清新淡彩", "治愈暖黄", "文艺低饱和", "纪实自然",
  "复古怀旧", "仙侠仙气", "武侠冷硬", "奇幻梦幻", "童话高饱和", "极简冷淡", "艺术实验"
]
环境音：[精准环境音]，轻量[配乐风格]背景乐，
其他：无穿帮，人物动作自然，镜头运镜流畅
 */

// 示例 1：古风仙侠剧本镜头
/**
镜头5，
时长：6秒， // 12 10 5
画幅：2.35:1，
影视风格：仙侠院线电影风格，
[景别]_[运镜方式]_[镜头类型]： 大远景+航拍+摇镜，
画面：云雾缭绕的昆仑山顶，青绿色的松树斜生在悬崖边，白衣女仙手持仙剑，从悬崖边缓缓飞起，衣袂飘飞，身后是漫天霞光，
光影：清晨逆光，霞光勾勒人物轮廓，云雾有丁达尔光效，
画质：8K 60帧 HDR，
色调：仙雾白+霞光金，
环境音：风声、云雾流动声、仙剑的轻鸣音，轻量国风仙侠配乐，
其他：镜头运镜流畅，航拍视角有纵深感








镜头X，
时长：10秒，
画幅：16:9，
影视风格：超现实梦境风，
[景别]_[运镜方式]_[镜头类型]： 大远景_航拍_摇镜，
画面主体：[人物特征+动作细节+表情]，
场景环境：[场景细节+布景+景深，如：景深较浅/大广角全景]，
光影：[专业光影，如：伦勃朗光/逆光轮廓光/阴天柔光]，
画质：8K RAW 60帧，HDR10+，电影镜头质感，
色彩分级：[具体色调]，
环境音：[精准环境音]，轻量[配乐风格]背景乐，
其他：无穿帮，人物动作自然，镜头运镜流畅
 */
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