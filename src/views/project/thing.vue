<template>
  <div class="h-100% px-32px overflow-hidden flex flex-col items-normal">
    <n-form
      label-placement="left"
      :inline="true"
      class="max-h-400px flex-wrap text-align-left overflow-auto pt-32px"
    >
      <n-form-item path="name" label="物品名称">
        <n-input v-model:value="searchForm.name" size="small" placeholder="请输入物品名称" @keyup.enter.native="getList()" />
      </n-form-item>
      <n-form-item>
        <n-button class="btn" type="primary" size="small"  @click="getList()">
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
    <div class="flex-1 overflow-auto thing-wrap">
      <div v-for="(item, index) in thing_list" :key="index" class="h-30px float-left p-12px rounded-8px bg-#252525 flex flex-between items-center">
        <div class="flex-1 flex flex-col justify-center items-normal">
          <div class="flex items-center">
            <img :src="item.resource_path" class="w-30px h-36px" alt="" />
            <div class="text-16px c-#fff ml-12px">{{ item.name }}</div>
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
import { getThingList, deleteThing } from '@/apis/index';
import NewThingModal from './components/newThingModal.vue';

const route = useRoute()
const dialog = useDialog()
const message = useMessage()
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
const handleNewModalComplete = () => {
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
  dialog.warning({
    title: '确定要删除该物品吗？',
    content: () => '删除后不可恢复，请谨慎操作！',
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "primary"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        await deleteThing({
          id: item.id
        })
        getList()
      } catch (error) {
        console.log(error)
      }
    },
    onNegativeClick: () => {
      message.warning('已取消删除')
    }
  })
}
const getList = async () => {
  try {
    const res: any = await getThingList({
      page: page.value,
      size: size.value,
      novel_id: route.query.id,
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
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.thing-wrap {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  align-items: start;
  grid-auto-rows: min-content;
}
</style>
