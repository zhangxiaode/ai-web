<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog"
    style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">新增角色</slot>
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
          <n-form-item label="角色类型:" path="type">
            <n-radio-group v-model:value="form.type" name="type">
              <n-space>
                <n-radio :value="1">人类</n-radio>
                <n-radio :value="2">动物</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="性别:" path="gender">
            <n-radio-group v-model:value="form.gender" name="gender">
              <n-space>
                <n-radio :value="1">男</n-radio>
                <n-radio :value="2">女</n-radio>
                <n-radio :value="3">未知</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="年龄段:" path="people_years_old">
            <n-radio-group v-model:value="form.people_years_old" name="people_years_old">
              <n-space>
                <n-radio :value="1">幼年</n-radio>
                <n-radio :value="2">青年</n-radio>
                <n-radio :value="3">中年</n-radio>
                <n-radio :value="4">老年</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="体型:" path="people_body">
            <n-radio-group v-model:value="form.people_body" name="people_body">
              <n-space>
                <n-radio :value="1">胖</n-radio>
                <n-radio :value="2">瘦</n-radio>
                <n-radio :value="3">中等</n-radio>
                <n-radio :value="4">肌肉</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="眼睛颜色:" path="eye_color">
            <n-select
              class="flex-1"
              v-model:value="form.eye_color"
              placeholder="请选择眼睛颜色"
              :options="[
                { label: '黑色', value: 'black' },
                { label: '蓝色', value: 'blue' },
                { label: '绿色', value: 'green' },
                { label: '棕色', value: 'brown' },
                { label: '红色', value: 'red' },
                { label: '白色', value: 'white' },
                { label: '紫色', value: 'purple' },
              ]"
              clearable
            />
          </n-form-item>
          <n-form-item label="头发颜色:" path="hair_color">
            <n-select
              class="flex-1"
              v-model:value="form.hair_color"
              placeholder="请选择头发颜色"
              :options="[
                { label: '黑色', value: 'black' },
                { label: '白色', value: 'white' },
                { label: '蓝色', value: 'blue' },
                { label: '棕色', value: 'brown' },
                { label: '金色', value: 'gold' },
                { label: '红色', value: 'red' },
                { label: '黄色', value: 'yellow' },
                { label: '绿色', value: 'green' },
                { label: '紫色', value: 'purple' },
                { label: '粉色', value: 'pink' },
                { label: '灰色', value: 'gray' },
                { label: '铜橙', value: 'orange' },
              ]"
              clearable
            />
          </n-form-item>
          <n-form-item label="头发类型:" path="hair_style">
            <n-select
              class="flex-1"
              v-model:value="form.hair_style"
              placeholder="请选择头发类型"
              :options="[
                { label: '短发', value: 1 },
                { label: '短卷发', value: 2 },
                { label: '经典底翘', value: 3 },
                { label: '底纹淡刻', value: 4 },
                { label: '光头', value: 5 },
                { label: '底纹深刻', value: 6 },
                { label: '长发', value: 7 },
                { label: '马尾辫', value: 8 },
                { label: '盘发', value: 9 },
                { label: '齐刘海', value: 10 },
                { label: '法式辫', value: 11 },
                { label: '双马尾', value: 12 },
                { label: '寸头', value: 13 },
                { label: '中分', value: 14 },
                { label: '超长发', value: 15 },
                { label: '大波浪', value: 16 },
                { label: '侧扫刘海', value: 17 },
                { label: '眼间头发', value: 18 },
                { label: '呆毛收拢', value: 19 },
                { label: '钻头卷', value: 20 },
                { label: '公主卷', value: 21 },
                { label: '露额头', value: 22 },
                { label: '翼状头发', value: 23 },
              ]"
              clearable
            />
          </n-form-item>
          <!-- 
            cloth_color 衣服颜色 黑色 - black, 白色 - white, 蓝色 - blue, 棕色 - brown, 金色 - gold, 红色 - red, 黄色 - yellow, 绿色 - green, 紫色 - purple, 粉色 - pink, 灰色 - gray（英式：grey）, 橙色 - orange
            cloth_style 衣服类型 1 风衣、2 夹克、3 冲锋衣、4 牛仔外套、5 开衫、6 卫衣、7 皮衣、8 短袖、9 T恤、10 衬衣、11 衬衫、12 毛衣、13 背心、14 羽绒服、15 长裤、16 短裤、17 丝袜、18 长裙、19 短裙、20 牛仔裤、21 西装、22 工装、23 校服、24 中山装、25 军装、26 警服、27 护士服、28 白大褂、29 女仆装、30 泳装、31 睡衣、32 旗袍、33 礼服、34 皮鞋、35 运动鞋、36 高跟鞋、37 平底鞋、38 靴子、39 拖鞋、40 布鞋、41 凉鞋、42 棉鞋
            animal_type 动物类型 1狐狸、2狗、3狼、4马、5猫、6鸟、7狮子、8老虎、9鹿、10兔子、11熊、12龙、13独角兽、14凤凰、15海豚
            animal_body 体型 1消瘦 2正常体型 3肥胖
            animal_years_old 年龄段1幼年 2成年
            animal_color 动物颜色 黑色 - black, 白色 - white, 蓝色 - blue, 棕色 - brown, 金色 - gold, 红色 - red, 黄色 - yellow, 绿色 - green, 紫色 - purple, 粉色 - pink, 灰色 - gray, 金黄色 - golden yellow, 橙色 - orange
            novel_id 小说ID
            user_id 创建用户ID
            voice_id 关联音色ID -->
          <n-form-item label="角色名称:" path="name">
            <n-input v-model:value="form.name" placeholder="请输入角色名称" />
          </n-form-item>
          <n-form-item label="角色描述:" path="desc">
            <n-input v-model:value="form.desc" placeholder="请输入角色描述" />
          </n-form-item>
          <n-form-item label="角色图片:" path="resource_path">
            <div class="flex flex-col">
              <n-button class="btn mb-12px" type="primary" size="small" @click="debouncing(onCreate, message, 2000)">AI创作</n-button>
              <Upload ref="uploadRef" accept="image/*" :max="1" :size_max="10" :get_file_path="({ file_name }) => `novel/${route.query.id}/character/${file_name}`" @change="({ resource_path }) => form.resource_path = resource_path[0].original_url" />
            </div>
          </n-form-item>
        </n-form>
        <CreateSceneModal @save="handleCreateModalComplete" />
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
import { getTemporaryUrl, getSceneDetail, postScene, putScene } from "@/apis/index";
import CreateSceneModal from './createSceneModal.vue';
import Upload from '@/components/upload.vue';

const route = useRoute()
const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('new-modal');
const message = useMessage()
const { showModal: showCreateModal } = useModal("create-modal");

const disabled: any = ref(false)
const formRef = ref<FormInst | null>(null)
const uploadRef: any = ref(null)
const form: any = ref({
  id: null,
  name: '',
  desc: '',
  resource_path: ''
});
const rules = {
  name: {required: true, message: "角色名称不能为空", trigger: ['blur', 'change']},
  resource_path: {required: true, message: "角色图片不能为空", trigger: ['blur', 'change']}
};
const onCreate = async () => {
  showCreateModal();
}
const handleCreateModalComplete = (res: any) => {
  uploadRef.value.setResource([res])
  form.value.resource_path = res.original_url
};
const onSubmit = async () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      disabled.value = true
      let params = {
        novel_id: route.query.id,
        name: form.value.name,
        desc: form.value.desc,
        resource_path: form.value.resource_path
      }
      let f = postScene
      if(form.value.id) {
        f = putScene
        params['id'] = form.value.id
      }
      try {
        const res: any = await f(params)
        if (res.code == 200 || res.code == 0) {
          onClose()
          emit('save', {
            id: res?.data?.id,
            name: res?.data?.name,
            desc: res?.data?.desc,
            resource_path: res?.data?.resource_path
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
const getSceneInfo = async () => {
  const res: any = await getSceneDetail({
    id: payload.value.id
  })
  form.value.id = res.data.id
  form.value.name = res.data.name
  form.value.desc = res.data.desc
  form.value.resource_path = res.data.resource_path
  const response: any = await getTemporaryUrl({ video_path: res.data.resource_path })
  if(response.data) {
    uploadRef.value?.setResource([{
      original_url: res.data.resource_path,
      sign_path: response.data
    }])
  }
}
watch(visible, (newValue: any) => {
  if(newValue) {
    if(payload.value?.id) {
      getSceneInfo()
    }
  } else {
    form.value = {
      id: null,
      name: '',
      desc: '',
      resource_path: ''
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