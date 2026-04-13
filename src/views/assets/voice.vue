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
      <n-form-item path="platform" label="音色模型">
        <n-select
          v-model:value="searchForm.platform"
          class="w-150"
          size="small"
          placeholder="请选择音色模型"
          :options="[
            { label: '白泽知命', value: 1 },
            { label: '白泽冰晶', value: 2 }
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
    <div class="flex-1 overflow-auto" v-loading="loading">
      <div v-for="(item, index) in voice_list" :key="index" class="h-30px m-16px p-12px rounded-8px bg-#252525 flex flex-between items-center">
        <div class="flex-1 flex flex-col justify-center items-normal">
          <div class="flex items-center">
            <div class="text-14px c-#fff mr-12px">{{ item.name }}</div>
            <div class="text-14px c-#fff mx-12px">({{ item.gender === 1 ? "男" : item.gender === 2 ? "女" : "-" }})</div>
            <div class="text-12px c-#ccc mx-12px">({{ item.platform === 1 ? "白泽知命" : item.platform === 2 ? "白泽冰晶" : "-" }})</div>
            <div class="text-12px c-#666 ml-12px">({{ item.language === 'zh' ? "中文" : item.language === 'en' ? "英文" : "" }})</div>
            <div class="text-12px c-#666 ml-12px">(剩余训练次数：{{ item.training_times }})</div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <n-button class="mx-6px" type="primary" size="small"  @click="handleEdit(item)">
            <template #icon>
              <n-icon>
                <CreateOutline />
              </n-icon>
            </template>
            编辑
          </n-button>
          <n-button v-if="item.voice_id" class="mx-6px" type="primary" size="small"  @click="handleTraining(item)">
            <template #icon>
              <n-icon>
                <HammerOutline />
              </n-icon>
            </template>
            训练
          </n-button>
          <n-button v-if="item.platform === 1 && item.is_payed === 0" class="mx-6px" type="primary" size="small"  @click="handlePay(item)">
            <template #icon>
              <n-icon>
                <LogoUsd />
              </n-icon>
            </template>
            支付
          </n-button>
          <n-button class="mx-6px" type="error" size="small"  @click="handleDelete(item)">
            <template #icon>
              <n-icon>
                <TrashOutline />
              </n-icon>
            </template>
            删除
          </n-button>
          <AudioPlayer v-if="item.resource_path" :src="item.resource_path" class="mx-6px" />
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
import { useModal } from "@/hooks";
import { Search, Repeat, AddSharp, CreateOutline, HammerOutline, LogoUsd, TrashOutline } from '@vicons/ionicons5';
import { getVoiceList, payVoice, deleteVoice } from '@/apis/index';
import AudioPlayer from '@/components/audioPlayer.vue';
import NewVoiceModal from './components/newVoiceModal.vue';
import TrainingVoiceModal from './components/trainingVoiceModal.vue';

const dialog = useDialog()
const message = useMessage()
const loading: any = ref(false)
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
const handleNewModalComplete = () => {
  getList();
};
const handleTraining = (item: any) => {
  showTrainingVoiceModal({
    id: item.id,
    platform: item.platform
  });
};
const handleTrainingModalComplete = () => {
  getList();
};
const handlePay = (item: any) => {
  dialog.warning({
    title: '温馨提示',
    content: () => '确定要支付吗？支付后将扣除15000尧币。',
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "primary"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        await payVoice({
          id: item.id
        })
        message.success('支付完成')
        getList()
      } catch (error) {
        console.log(error)
      }
    },
    onNegativeClick: () => {
      message.warning('已取消支付')
    }
  })
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
  dialog.warning({
    title: '确定要删除该音色吗？',
    content: () => '删除后不可恢复，请谨慎操作！',
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "primary"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      loading.value = true
      try {
        await deleteVoice({
          id: item.id
        })
        getList()
      } catch (error) {
        loading.value = false
        console.log(error)
      }
    },
    onNegativeClick: () => {
      message.warning('已取消删除')
    }
  })
}
const getList = async () => {
  loading.value = true
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
  loading.value = false
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
