<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 100%;" @update:show="onClose">
    <template #header>
      <slot name="header">生成有声书</slot>
    </template>
    <slot>
      <div class="audio-book flex flex-col items-normal">
        <div class="w-100% flex justify-between items-normal">
          <div class="flex-1 m-5px h-500px overflow-auto">
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
                    class="w-100px"
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
                  <div class="flex-1 text-14px c-#fff">{{ ele.tone }}</div>
                </div>
                <div class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">内容: </div>
                  <div class="flex-1 text-14px c-#fff">{{ ele.content }}</div>
                </div>
                <div v-if="ele.element_type === 'sound_effect'" class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">关联音效: </div>
                  <div class="flex-1 text-14px c-#fff">
                    <n-select
                      v-model:value="ele.sound_id"
                      class="w-100px"
                      placeholder="请选择关联角色"
                      :options="sound_options"
                      value-field="id"
                      label-field="name"
                      clearable
                    />
                  </div>
                </div>
                <div v-else class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">关联角色: </div>
                  <div class="flex-1 text-14px c-#fff flex items-center">
                    <n-select
                      v-model:value="ele.role_id"
                      class="w-100px"
                      placeholder="请选择关联角色"
                      :options="role_options"
                      value-field="id"
                      label-field="name"
                      clearable
                    />
                    <n-button type="primary" class="ml-12px" size="small" @click="onTransformAudio(ele)">转换音频</n-button>
                    <AudioPlayer v-if="ele.signed_url" :src="ele.signed_url" class="mx-6px" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onTransformAudioAll, message, 2000)">全部转换</n-button>
        <AudioPlayer v-if="form.signed_audio_path" :src="form.signed_audio_path" class="mx-6px" />
        <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSave, message, 2000)">保存</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getCharacterList, getSoundList, getChapterDetail, postScriptAudio, postScriptAudioAll, postChapterLanguage, mergeScriptAudio } from "@/apis/index";
import AudioPlayer from '@/components/audioPlayer.vue';

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('createAudioBook-modal');
const message = useMessage()

const disabled: any = ref(false)
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
  try {
    const res: any = await postScriptAudio({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      role_id: ele.role_id,
      content: ele.content
    })
    ele['api_key'] = res.data.api_key
    ele['signed_url'] = res.data.signed_url
  } catch (error) {
    console.log(error)
  }
}
const onTransformAudioAll = async () => {
  try {
    disabled.value = true
    const res: any = await postScriptAudioAll({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      scenes: form.value.audio_script.scenes,
    })
    form.value.audio_script.scenes = res.data
    disabled.value = false
  } catch (error) {
    disabled.value = false
  }
}
const onSave = async () => {
  try {
    disabled.value = true
    await postChapterLanguage({
      chapter_id: form.value.id,
      type: 0,
      script: JSON.stringify(form.value.audio_script),
    })
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
    message.success('剧本保存成功')
    disabled.value = false
    onClose()
  } catch (error) {
    disabled.value = false
  }
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
  margin: 58px 0;
}
</style>