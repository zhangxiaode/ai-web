<template>
  <div class="h-100% px-32px overflow-hidden flex flex-col items-normal">
    <n-form
      label-placement="left"
      :inline="true"
      class="max-h-400px flex-wrap text-align-left overflow-auto pt-32px"
    >
      <n-form-item path="name" label="物品名称">
        <n-input v-model:value="searchForm.name" size="small" placeholder="请输入物品名称" @keyup.enter.native="getList" />
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
        <n-button class="btn" type="primary" size="small" @click="onAdd()">
          <template #icon>
            <n-icon>
              <AddSharp />
            </n-icon>
          </template>
          新建物品
        </n-button>
      </n-form-item>
    </n-form>
    <div class="flex-1 flex flex-wrap overflow-auto">
      <div v-for="(item, index) in thing_list" :key="index" class="h-30px m-16px p-12px rounded-8px bg-#252525 flex flex-between items-center">
        <div class="flex-1 flex flex-col justify-center items-normal">
          <div class="flex items-center">
            <div class="text-14px c-#fff mr-12px">{{ item.name }}</div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <n-button class="mx-6px" type="primary" size="tiny"  @click="handleEdit(item)">
            <template #icon>
              <n-icon>
                <CreateOutline />
              </n-icon>
            </template>
            编辑
          </n-button>
          <n-button class="mx-6px" type="error" size="tiny"  @click="handleDelete(item)">
            <template #icon>
              <n-icon>
                <TrashOutline />
              </n-icon>
            </template>
            删除
          </n-button>
          <n-button class="mx-6px" type="error" size="tiny">
            <template #icon>
              <AudioPlayer :src="item.resource_path" />
            </template>
            试听
          </n-button>
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
    <NewThingModal @save="handleNewModalComplete" />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from "@/hooks";
import { Search, Repeat, AddSharp, CreateOutline, TrashOutline } from '@vicons/ionicons5';
import { getThingDetail, getThingList, deleteThing } from '@/apis/index';
import AudioPlayer from '@/components/audioPlayer.vue';
import NewThingModal from './components/newThingModal.vue';

let searchForm: any = ref({
  name: ''
});
const page = ref(1)
const size = ref(10)
const total = ref(0)
const thing_list: any = ref([])
const { showModal: showNewModal } = useModal("new-modal");

const onAdd = () => {
  showNewModal();
};
const handleNewModalComplete = (res: any) => {
  getList();
};
const handleReset = () => {
  searchForm.value = {
    name: ''
  };
  getList()
}
const handleEdit = (item: any) => {
  showNewModal({
    id: item.id
  });
}
const handleDelete = async (item: any) => {
  await deleteThing({
    id: item.id
  })
}
const getList = async () => {
  try {
    const res: any = await getThingList({
      page: page.value,
      size: size.value,
      name: searchForm.value.name
    })
    total.value = res.data.total
    thing_list.value = res.data.rows
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
onMounted(async () => {
  const res = await getThingDetail({ id: 1 })
  console.log(123, res)
  getList()
})
</script>

<style lang="scss" scoped>
</style>
