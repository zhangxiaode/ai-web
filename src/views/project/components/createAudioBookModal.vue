<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 100%;" @update:show="onClose">
    <template #header>
      <slot name="header">生成有声书</slot>
    </template>
    <slot>
      <div class="audio-book flex flex-col items-normal" v-loading="loading">
        <div class="w-100% flex flex-col justify-between items-normal">
          <div class="m-5px h-500px overflow-auto">
            <div v-for="(role, index) in form.audio_script.role_list" :key="index" class="bg-#333 my-5px p-8px">
              <div class="flex items-center justify-between my-5px">
                <div class="text-12px c-#fff mr-12px w-80px text-right">角色: </div>
                <div class="flex-1 text-14px c-#fff">{{ role.role_name }}</div>
              </div>
              <div class="flex items-center justify-between my-5px">
                <div class="text-12px c-#fff mr-12px w-80px text-right">描述: </div>
                <div class="flex-1 text-14px c-#fff">{{ role.role_description }}</div>
              </div>
              <div class="flex items-center justify-between my-5px">
                <div class="text-12px c-#fff mr-12px w-80px text-right">关联角色: </div>
                <div class="flex-1 text-14px c-#fff">
                  <n-select
                    v-model:value="role.role_id"
                    class="w-200px"
                    placeholder="请选择关联角色"
                    :options="role_options"
                    value-field="id"
                    label-field="name"
                    clearable
                    @update:value="handleChangeRole(role)"
                  />
                </div>
              </div>
            </div>
            <div v-for="(scene, index) in form.audio_script.scenes" :key="index" class="bg-#444 my-5px p-8px">
              <div class="flex items-center justify-between my-5px">
                <div class="text-12px c-#fff mr-12px w-80px text-right">场景{{ scene.id }}: </div>
                <div class="flex-1 text-14px c-#fff">{{ scene.scene_title }}</div>
              </div>
              <div class="flex items-center justify-between my-5px">
                <div class="text-12px c-#fff mr-12px w-80px text-right">场景描述: </div>
                <div class="flex-1 text-14px c-#fff">{{ scene.scene_desc }}</div>
              </div>
              <div class="flex items-center justify-between my-5px">
                <div class="text-12px c-#fff mr-12px w-80px text-right">场景剧本: </div>
              </div>
              <div v-for="(ele, idx) in scene.elements" :key="idx" class="bg-555 my-5px p-8px">
                <div class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">{{ ele.element_type === 'sound_effect' ? '音效' : ele.element_type === 'narrator' ? '旁白' : ele.role_name }}: </div>
                  <div class="flex-1 text-14px c-#fff">{{ getEmotion(ele.emotion) }}</div>
                </div>
                <div class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">内容: </div>
                  <div class="flex-1 text-14px c-#fff">{{ ele.content }}</div>
                </div>
                <div v-if="ele.element_type === 'sound_effect'" class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">关联音效: </div>
                  <div class="flex-1 text-14px c-#fff flex items-center">
                    <n-select
                      v-model:value="ele.sound_id"
                      class="w-200px"
                      placeholder="请选择关联角色"
                      :options="sound_options"
                      value-field="id"
                      label-field="name"
                      clearable
                    />
                    <n-button type="primary" class="ml-12px" size="small" @click="onTransformSound(ele)">AI生成音效</n-button>
                    <AudioPlayer v-if="ele.api_key" :src="ele.api_key" class="mx-6px" />
                  </div>
                </div>
                <div v-else class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">关联角色: </div>
                  <div class="flex-1 text-14px c-#fff flex items-center">
                    <n-select
                      v-model:value="ele.role_id"
                      class="w-200px"
                      placeholder="请选择关联角色"
                      :options="role_options"
                      value-field="id"
                      label-field="name"
                      clearable
                    />
                    <n-button type="primary" class="ml-12px" size="small" @click="onTransformAudio(ele)">转换音频</n-button>
                    <AudioPlayer v-if="ele.api_key" :src="ele.api_key" class="mx-6px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="leadings-[1.5em] flex flex-wrap px-12px mt-12px">
            <div class="w-100% text-16px font-bold c-#a5a5a5 my-4px">音频合成定价规则：</div>
            <div class="flex">
              <div class="w-50% flex flex-wrap">
                <div class="w-50% text-14px c-#999 my-4px">白泽知命免费版: 65尧币/千字</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽知命标准版: 56尧币/千字</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽知命专业版: 52尧币/千字</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽知命旗舰版: 48尧币/千字</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽知命企业版: 44尧币/千字</div>
              </div>
              <div class="w-50% flex flex-wrap">
                <div class="w-50% text-14px c-#999 my-4px">白泽冰晶免费版: 55尧币/千字符</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽冰晶标准版: 46尧币/千字符</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽冰晶专业版: 42尧币/千字符</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽冰晶旗舰版: 38尧币/千字符</div>
                <div class="w-50% text-14px c-#999 my-4px">白泽冰晶企业版: 34尧币/千字符</div>
              </div>
            </div>
            <div class="w-100% text-16px font-bold c-#a5a5a5 my-4px">音效合成定价规则：</div>
            <div class="flex w-100% flex flex-wrap">
              <div class="w-20% text-14px c-#999 my-4px">免费版: 9尧币/秒</div>
              <div class="w-20% text-14px c-#999 my-4px">标准版: 8尧币/秒</div>
              <div class="w-20% text-14px c-#999 my-4px">专业版: 7尧币/秒</div>
              <div class="w-20% text-14px c-#999 my-4px">旗舰版: 6尧币/秒</div>
              <div class="w-20% text-14px c-#999 my-4px">企业版: 5尧币/秒</div>
            </div>
            <div class="w-100% text-12px c-#696969 mt-8px">字符数 => 字数计算规则（汉字：2字符、英文字母/数字/标点/空格：1字符、计算文本长度时，SSML标签内容也包含在内）</div>
          </div>
        </div>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="loading" :disabled="loading" @click="debouncing(onTransformAudioAll, message, 2000)">全部转换人声</n-button>
        <n-button class="btn" type="primary" size="small" :loading="loading" :disabled="loading" @click="debouncing(onTransformSoundAll, message, 2000)">全部转换音效</n-button>
        <AudioPlayer v-if="form.signed_audio_path" :src="form.signed_audio_path" class="mx-6px" />
        <n-button class="btn" type="primary" size="small" :loading="loading" :disabled="loading" @click="debouncing(onSave, message, 2000)">保存</n-button>
        <n-button class="btn" type="primary" size="small" :loading="loading" :disabled="loading" @click="debouncing(onMerge, message, 2000)">生成有声书</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getEmotion } from '@/constants/index';
import { getCharacterList, getSoundList, getChapterDetail, postScriptAudio, postScriptSound, postScriptAudioAll, postScriptSoundAll, postChapterLanguage, mergeScriptAudio } from "@/apis/index";
import AudioPlayer from '@/components/audioPlayer.vue';

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('createAudioBook-modal');
const message = useMessage()

const loading: any = ref(false)
const form: any = ref({
  id: null,
  index: null,
  novel_id: null,
  signed_audio_path: null,
  audio_script: {
    role_list: [],
    scenes: []
  },
});
const role_options = ref([])
const sound_options = ref([])
const onTransformAudio = async (ele: any) => {
  loading.value = true
  try {
    const res: any = await postScriptAudio({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      role_id: ele.role_id,
      content: ele.content,
      emotion: ele.emotion, // 设置音色的情感。 ​开心（happy），悲伤（sad），生气（angry），惊讶（surprised），恐惧（fear），厌恶（hate），激动（excited），冷漠（coldness），中性（neutral），沮丧（depressed），撒娇（lovey-dovey），害羞（shy），安慰鼓励（comfort），咆哮/焦急（tension），温柔（tender），讲故事 / 自然讲述（storytelling），情感电台（radio），磁性（magnetic），广告营销（advertising），气泡音（vocal - fry），低语 (ASMR)，新闻播报（news），娱乐八卦（entertainment），方言（dialect）
      emotion_scale: ele.emotion_scale, // 设置情绪值，范围1~5 情绪值越大，情感越明显。
      speech_rate: ele.speech_rate, // 语速，取值范围[-50,100] 100代表2.0倍速，-50代表0.5倍数
      loudness_rate: ele.loudness_rate // 音量，取值范围[-50,100]，100代表2.0倍音量，-50代表0.5倍音量
    })
    ele['api_key'] = res.data.api_key
    ele['signed_url'] = res.data.signed_url
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const onTransformSound = async (ele: any) => {
  loading.value = true
  try {
    const res: any = await postScriptSound({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      content: ele.content,
      duration: ele.duration,
    })
    ele['api_key'] = res.data.api_key
    ele['signed_url'] = res.data.signed_url
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const onTransformAudioAll = async () => {
  loading.value = true
  try {
    const res: any = await postScriptAudioAll({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      scenes: form.value.audio_script.scenes,
    })
    form.value.audio_script.scenes = res.data
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const onTransformSoundAll = async () => {
  loading.value = true
  try {
    const res: any = await postScriptSoundAll({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      scenes: form.value.audio_script.scenes,
    })
    form.value.audio_script.scenes = res.data
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const onSave = async () => {
  loading.value = true
  try {
    await postChapterLanguage({
      chapter_id: form.value.id,
      type: 0,
      script: JSON.stringify(form.value.audio_script),
    })
    message.success('剧本保存成功')
    onClose()
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const onMerge = async () => {
  loading.value = true
  try {
    await mergeScriptAudio({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      scenes: form.value.audio_script.scenes.map((scene: any) => {
        return {
          scene_id: scene.id,
          elements: scene.elements.map((ele: any) => {
            if(ele.element_type === 'sound_effect') {
              return {
                element_type: ele.element_type,
                sound_id: ele.sound_id
              }
            } else {
              return {
                element_type: ele.element_type,
                api_key: ele.api_key,
                signed_url: ele.signed_url
              }
            }
          })
        }
      })
    })
    message.success('有声书合成成功')
    onClose()
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const onClose = () => {
  hideModal();
}
const getCharacterOptions = async () => {
  try {
    const res: any = await getCharacterList({
      novel_id: form.value.novel_id
    })
    role_options.value = res.data
  } catch (error) {
    console.log(error)
  }
}
const getSoundOptions = async () => {
  try {
    const res: any = await getSoundList({})
    sound_options.value = res.data
  } catch (error) {
    console.log(error)
  }
}
const getChapterInfo = async () => {
  loading.value = true
  try {
    const res: any = await getChapterDetail({
      id: payload.value.id
    })
    form.value.id = res.data.id
    form.value.index = res.data.index
    form.value.novel_id = res.data.novel_id
    const chapter_language = res.data.languages.find((item: any) => item.language === 'zh')
    if(chapter_language) {
      try {
        form.value.signed_audio_path = chapter_language.signed_audio_path
        form.value.audio_script = chapter_language.audio_script ? JSON.parse(chapter_language.audio_script) : {
          role_list: [],
          scenes: []
        }
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    console.log(error)
  }
  loading.value = false
}
const handleChangeRole = (role: any) => {
  form.value.audio_script.scenes = form.value.audio_script.scenes.map((scene: any) => {
    scene.elements = scene.elements.map((ele: any) => {
      if(ele.role_name == role.role_name) {
        ele.role_id = role.role_id
      }
      return ele
    })
    return scene
  })
}
watch(visible, async (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      await getChapterInfo()
      getCharacterOptions()
      getSoundOptions()
    }
  } else {
    form.value = {
      id: null,
      index: null,
      audio_script: {
        role_list: [],
        scenes: []
      },
    }
  }
});
</script>

<style lang="scss" scoped>
.audio-book {
  font-weight: 500;
  border-radius: 16px;
  margin: 12px 0;
}
</style>