<template>
  <div class="h-100% px-32px overflow-hidden flex flex-col items-normal">
    <n-form
      label-placement="left"
      :inline="true"
      class="max-h-400px flex-wrap text-align-left overflow-auto pt-32px"
    >
      <n-form-item path="name" label="音色名称">
        <n-input v-model:value="searchForm.name" size="small" placeholder="请输入音色名称" @keyup.enter.native="getList" />
      </n-form-item>
      <n-form-item path="platform" label="音色平台">
        <n-select
          v-model:value="searchForm.platform"
          class="w-150"
          size="small"
          placeholder="请选择音色平台"
          :options="[
            { label: '豆包', value: 1 },
            { label: '千问', value: 2 }
          ]"
          clearable
        />
      </n-form-item>
      <n-form-item>
        <n-button class="btn" type="primary" size="small"  @click="getList">
          <template #icon>
            <n-icon>
              <Search />
            </n-icon>
          </template>
          查询
        </n-button>
      </n-form-item>
      <n-form-item>
        <n-button class="btn" type="primary" size="small"  @click="handleReset()">
          <template #icon>
            <n-icon>
              <Repeat />
            </n-icon>
          </template>
          重置
        </n-button>
      </n-form-item>
      <n-form-item>
        <n-button class="btn" type="primary" size="small" @click="handleAdd()">
          <template #icon>
            <n-icon>
              <AddSharp />
            </n-icon>
          </template>
          新建音色
        </n-button>
      </n-form-item>
    </n-form>
    <div class="flex-1 flex flex-wrap overflow-auto">
      <div v-for="(item, index) in voice_list" :key="index" class="w-200px h-60px m-16px px-12px py-24px rounded-8px bg-#252525 flex flex-col items-normal">
        <div class="flex justify-between items-center">
          <div class="flex-1 text-14px c-#fff">{{ item.name }} ({{ item.gender === 1 ? "男" : item.gender === 2 ? "女" : "-" }})</div>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="18" class="c-#fff cursor-pointer ml-24px">
                <EllipsisVertical />
              </n-icon>
            </template>
            <div class="flex justify-between items-center">
              <n-button class="mx-6px" type="primary" size="tiny"  @click="handleEdit(item)">
                <template #icon>
                  <n-icon>
                    <CreateOutline />
                  </n-icon>
                </template>
                编辑
              </n-button>
              <n-button class="mx-6px" type="primary" size="tiny"  @click="handleTraining(item)">
                <template #icon>
                  <n-icon>
                    <CreateOutline />
                  </n-icon>
                </template>
                训练
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="handleDelete(item)">
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                删除
              </n-button>
            </div>
          </n-popover>
        </div>
        <div class="flex justify-between items-center mt-16px">
          <div class="text-12px c-#ccc">{{ item.platform === 1 ? "豆包" : item.platform === 2 ? "千问" : "-" }}</div>
          <div class="text-12px c-#666">{{ item.language === 'zh' ? "中文" : item.language === 'en' ? "英文" : "" }}</div>
        </div>
      </div>
    </div>
    <n-pagination
      class="my-20px mx-auto justify-center overflow-auto"
      v-model:page="page"
      :page-size="size"
      :page-sizes="[10, 20, 50, 100]"
      :item-count="total"
      show-size-picker
      show-quick-jumper
      :suffix="() => `共${total}条`"
      @update:page="handleCurrentChange"
      @update:page-size="handleSizeChange"
    />
    <NewVoiceModal @save="handleNewModalComplete" />
    <TrainingVoiceModal @save="handleTrainingModalComplete" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useModal } from "@/hooks";
import { Search, Repeat, AddSharp, EllipsisVertical, CreateOutline, TrashOutline } from '@vicons/ionicons5';
import { getVoiceList, deleteVoice } from '@/apis/index';
import NewVoiceModal from './components/newVoiceModal.vue';
import TrainingVoiceModal from './components/trainingVoiceModal.vue';

let searchForm: any = ref({
  platform: null,
  name: ''
});
const page = ref(1)
const size = ref(10)
const total = ref(0)
const voice_list: any = ref([])
const { showModal: showNewVoiceModal } = useModal("new-voice-modal");
const { showModal: showTrainingVoiceModal } = useModal("training-voice-modal");

const handleAdd = () => {
  showNewVoiceModal();
};
const handleNewModalComplete = (res: any) => {
  getList();
};
const handleTraining = (item: any) => {
  showTrainingVoiceModal({
    id: item.id,
    platform: item.platform
  });
};
const handleTrainingModalComplete = (res: any) => {
  getList();
};
const handleReset = () => {
  searchForm.value = {
    platform: null,
    name: ''
  };
  getList()
}
const handleEdit = (item: any) => {
  showNewVoiceModal({
    id: item.id
  });
}
const handleDelete = async (item: any) => {
  await deleteVoice({
    id: item.id
  })
}
const getList = async () => {
  try {
    const res: any = await getVoiceList({
      page: page.value,
      size: size.value,
      platform: searchForm.value.platform,
      name: searchForm.value.name
    })
    total.value = res.data.total
    voice_list.value = res.data.rows
  } catch (error) {
    console.log(error)
  }
}
const handleSizeChange = (val: number) => {
  page.value = 1;
  size.value = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  getList();
};
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
</style>
