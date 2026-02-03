<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 100%;" @update:show="onClose">
    <template #header>
      <slot name="header">转换剧本</slot>
    </template>
    <slot>
      <div class="transform-script flex flex-col items-normal">
        <div class="flex items-center">
          <n-select
            v-model:value="form.model"
            placeholder="请选择AI模型"
            :options="[
              { label: '豆包seedream-4-0', value: 'doubao-seed-1.6' },
              { label: '千问image-plus', value: 'qwen-plus' },
            ]"
            clearable
          />
          <n-select
            v-model:value="form.type"
            placeholder="请选择转换类型"
            :options="[
              { label: '有声书剧本', value: 0 },
              { label: '影视剧本', value: 1 },
            ]"
            class="ml-8px"
            clearable
          />
        </div>
        <div class="w-100% flex justify-between items-normal">
          <n-input v-model:value="form.content" type="textarea" class="flex-1 m-5px h-500px" placeholder="请输入章节内容" />
          <div v-if="form.type === 0" class="flex-1 m-5px h-500px overflow-auto">
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
                  <div class="flex-1 text-14px c-#fff">
                    <n-select
                      v-model:value="ele.role_id"
                      class="w-100px"
                      placeholder="请选择关联角色"
                      :options="role_options"
                      value-field="id"
                      label-field="name"
                      clearable
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="flex-1 m-5px h-500px overflow-auto">
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
                <div v-else-if="ele.element_type === 'narrator' || ele.element_type === 'role_line'" class="flex items-center justify-between my-5px">
                  <div class="text-12px c-#fff mr-12px w-80px text-right">关联角色: </div>
                  <div class="flex-1 text-14px c-#fff">
                    <n-select
                      v-model:value="ele.role_id"
                      class="w-100px"
                      placeholder="请选择关联角色"
                      :options="role_options"
                      value-field="id"
                      label-field="name"
                      clearable
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <n-input v-model:value="form.audio_script" type="textarea" class="flex-1 m-5px h-500px" placeholder="请输入剧本内容" /> -->
          <!-- <n-input v-else v-model:value="form.movie_script" type="textarea" class="flex-1 m-5px h-500px" placeholder="请输入剧本内容" /> -->
          <!-- <Editor :value="form.content" class="flex-1 m-5px" :height="500" disabled placeholder="请输入章节内容" @change="val => form.content = val" />
          <Editor :value="form.audio_script" class="flex-1 m-5px" :height="500" placeholder="请输入剧本内容" @change="val => form.script = val" /> -->
        </div>
      </div>
    </slot>
    <template #action>
      <slot name="action">
        <n-button class="btn" size="small" @click="onClose()">取消</n-button>
        <n-button class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onTransform, message, 2000)">转换</n-button>
        <n-button v-if="(form.type === 0 && form.audio_script) || (form.type === 1 && form.movie_script)" class="btn" type="primary" size="small" :loading="disabled" :disabled="disabled" @click="debouncing(onSave, message, 2000)">保存</n-button>
      </slot>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useModal } from "@/hooks";
import { debouncing } from '@/utils/index';
import { getCharacterList, getSoundList, getChapterDetail, postScript, postChapterLanguage } from "@/apis/index";
// import Editor from "@/components/editor.vue"

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('transformScript-modal');
const message = useMessage()

const disabled: any = ref(false)
const form: any = ref({
  id: null,
  novel_id: null,
  model: 'doubao-seed-1.6',
  type: 0,
  content: '',
  audio_script: {
    role_list: [],
    scenes: []
  },
  movie_script: {},
});
const role_options = ref([])
const sound_options = ref([])
const onTransform = async () => {
  try {
    disabled.value = true
    const res: any = await postScript({
      model: form.value.model,
      type: form.value.type,
      content: form.value.content
    })
    try {
      if(form.value.type === 0) {
        form.value.audio_script = JSON.parse(res.data)
      } else {
        form.value.movie_script = JSON.parse(res.data)
      }
    } catch (error: any) {
      message.error(error.message)
    }
    disabled.value = false
  } catch (error) {
    disabled.value = false
  }
}
const onSave = async () => {
  try {
    disabled.value = true
    if((form.value.type === 0 && form.value.audio_script) || (form.value.type === 1 && form.value.movie_script)) {
      await postChapterLanguage({
        chapter_id: form.value.id,
        type: form.value.type,
        script: form.value.type === 0 ? JSON.stringify(form.value.audio_script) : JSON.stringify(form.value.movie_script),
      })
      message.success('剧本保存成功')
    } else {
      message.error('剧本内容不能为空')
    }
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
  form.value.novel_id = res.data.novel_id
  form.value.content = res.data.content
  const chapter_language = res.data.languages.find((item: any) => item.language === 'zh')
  if(chapter_language) {
    try {
      form.value.audio_script = chapter_language.audio_script ? JSON.parse(chapter_language.audio_script) : {
        role_list: [],
        scenes: []
      }
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
  if(form.value.type === 0 ) {
    form.value.audio_script.scenes = form.value.audio_script.scenes.map((scene: any) => {
      scene.elements = scene.elements.map((ele: any) => {
        if(ele.role_name == role.role_name) {
          ele.role_id = role.role_id
        }
        return ele
      })
      return scene
    })
  } else {
    console.log(111, role, form.value.movie_script.scenes)
    form.value.movie_script.scenes = form.value.movie_script.scenes.map((scene: any) => {
      scene.elements = scene.elements.map((ele: any) => {
        if(ele.role_name == role.role_name) {
          ele.role_id = role.role_id
        }
        return ele
      })
      return scene
    })
    console.log(222, role, form.value.movie_script.scenes)
  }
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
      model: '',
      type: 0,
      content: '',
      audio_script: {
        role_list: [],
        scenes: []
      },
      movie_script: {
        role_list: [],
        scenes: []
      },
    }
  }
});
</script>

<style lang="scss" scoped>
.transform-script {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>