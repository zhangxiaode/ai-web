<template>
  <div class="h-100% font-bold overflow-auto">
    <div v-for="(role, index) in form.movie_script.role_list" :key="index" class="bg-#333 my-5px p-8px">
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
    <div v-for="(scene, index) in form.movie_script.scenes" :key="index" class="bg-#444 my-5px p-8px">
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
        <n-button type="primary" class="ml-12px" size="small" @click="onCreateShot(scene)">创建镜头</n-button>
      </div>
      <div v-for="(ele, idx) in scene.elements" :key="idx" class="bg-555 my-5px p-8px">
        <div v-if="ele.element_type === 'narrator' || ele.element_type === 'role_line'" class="flex items-center justify-between my-5px">
          <div class="text-12px c-#fff mr-12px w-80px text-right">{{ ele.element_type === 'narrator' ? '旁白' : ele.role_name }}: </div>
          <div class="flex-1 text-14px c-#fff">{{ ele.tone }}</div>
        </div>
        <div v-if="ele.element_type === 'narrator' || ele.element_type === 'role_line'" class="flex items-center justify-between my-5px">
          <div class="text-12px c-#fff mr-12px w-80px text-right">内容: </div>
          <div class="flex-1 text-14px c-#fff">{{ ele.content }}</div>
        </div>
        <div v-else class="flex items-center justify-between my-5px">
          <div class="text-12px c-#fff mr-12px w-80px text-right">{{ ele.element_type === 'sound_effect' ? '音效' : ele.element_type === 'action' ? '动作' : '镜头切换' }}: </div>
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
        <div v-else-if="ele.element_type === 'narrator' || ele.element_type === 'role_line'" class="flex items-center justify-between my-5px">
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
    <div class="flex justify-center items-center my-24px">
      <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onTransformAudioAll, message, 2000)">全部转换</n-button>
      <AudioPlayer v-if="form.signed_audio_path" :src="form.signed_audio_path" class="mx-12px" />
      <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSave, message, 2000)">保存</n-button>
    </div>
    <CreateShotModal @save="handleCreateShotModalComplete" />
  </div>
</template>

<script lang="ts" setup>
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getCharacterList, getSoundList, getChapterDetail, postScriptAudio, postScriptAudioAll, postChapterLanguage, mergeScriptAudio } from "@/apis/index";
import AudioPlayer from '@/components/audioPlayer.vue';
import CreateShotModal from './components/createShotModal.vue';

const route = useRoute()
const message = useMessage()

const { showModal: showCreateShotModal } = useModal("createAudioBook-modal");

const disabled: any = ref(false)
const form: any = ref({
  id: null,
  index: null,
  novel_id: null,
  signed_audio_path: null,
  movie_script: {
    role_list: [],
    scenes: []
  },
});
const role_options = ref([])
const sound_options = ref([])

const handleCreateShotModalComplete = () => {
  getChapterInfo();
};

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
      scenes: form.value.movie_script.scenes,
    })
    form.value.movie_script.scenes = res.data
    disabled.value = false
  } catch (error) {
    disabled.value = false
  }
}

const onCreateShot = async (scene: any) => {
  try {
    showCreateShotModal({
      id: scene.id,
      novel_id: scene.novel_id
    })
  } catch (error) {
    console.log(error)
  }
}

const onSave = async () => {
  try {
    disabled.value = true
    await postChapterLanguage({
      chapter_id: form.value.id,
      type: 0,
      script: JSON.stringify(form.value.movie_script),
    })
    await mergeScriptAudio({
      chapter_id: form.value.id,
      chapter_index: form.value.index,
      scenes: form.value.movie_script.scenes.map((scene: any) => {
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
  } catch (error) {
    disabled.value = false
  }
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
    id: route.query.id
  })
  form.value.id = res.data.id
  form.value.index = res.data.index
  form.value.novel_id = res.data.novel_id
  const chapter_language = res.data.languages.find((item: any) => item.language === 'zh')
  if(chapter_language) {
    try {
      form.value.signed_audio_path = chapter_language.signed_audio_path
      form.value.movie_script = chapter_language.movie_script ? JSON.parse(chapter_language.movie_script) : {
        role_list: [],
        scenes: []
      }
    } catch (error) {
      console.log(error)
    }
  }
}
const handleChangeRole = (role: any) => {
  form.value.movie_script.scenes = form.value.movie_script.scenes.map((scene: any) => {
    scene.elements = scene.elements.map((ele: any) => {
      if(ele.role_name == role.role_name) {
        ele.role_id = role.role_id
      }
      return ele
    })
    return scene
  })
}
onMounted(async () => {
  await getChapterInfo()
  getCharacterOptions()
  getSoundOptions()
})
</script>
