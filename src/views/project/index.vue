<template>
  <div class="h-100% px-32px overflow-hidden flex flex-col items-normal">
    <n-form
      label-placement="left"
      :inline="true"
      class="max-h-400px flex-wrap text-align-left overflow-auto pt-32px"
    >
      <n-form-item path="name" label="项目名称">
        <n-input v-model:value="searchForm.name" size="small" placeholder="请输入项目名称" @keyup.enter.native="getList" />
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
          新建项目
        </n-button>
      </n-form-item>
    </n-form>
    <div class="flex-1 overflow-auto">
      <div v-for="(item, index) in list" :key="index" class="h-114px m-16px p-12px rounded-8px bg-#252525 flex flex-between items-center">
        <div class="flex-1 flex justify-center items-normal">
          <img :src="item.poster" class="w-100px h-114px" alt="" />
          <div class="flex-1 flex flex-col justify-center ml-16px">
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <div class="text-16px font-bold c-#fff">{{ item.name }}</div>
                <div class="text-12px c-#f2f2f2 mt-12px">{{ item.desc }}</div>
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
            <div class="flex items-center mt-16px">
              <n-button class="mx-6px" type="error" size="tiny"  @click="goChapter(item)">
                <template #icon>
                  <n-icon>
                    <DocumentTextOutline />
                  </n-icon>
                </template>
                章节管理
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="goThing(item)">
                <template #icon>
                  <n-icon>
                    <DiceOutline />
                  </n-icon>
                </template>
                物品管理
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="goCharacter(item)">
                <template #icon>
                  <n-icon>
                    <PeopleOutline />
                  </n-icon>
                </template>
                角色管理
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="goScene(item)">
                <template #icon>
                  <n-icon>
                    <ApertureSharp />
                  </n-icon>
                </template>
                场景管理
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="goShot(item)">
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                镜头管理
              </n-button>
            </div>
          </div>
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
    <NewProjectModal @save="handleNewModalComplete" />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from "@/hooks";
import { Search, Repeat, AddSharp, CreateOutline, TrashOutline, DocumentTextOutline, DiceOutline, PeopleOutline, ApertureSharp } from '@vicons/ionicons5';
import { getProjectList, deleteProject } from '@/apis/index';
import NewProjectModal from './components/newProjectModal.vue';

const router = useRouter()
const dialog = useDialog()
const message = useMessage()
let searchForm: any = ref({
  name: ''
});
const page = ref(1)
const size = ref(10)
const total = ref(0)
const list: any = ref([])
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
    title: '确定要删除该项目吗？',
    content: () => '删除后不可恢复，请谨慎操作！',
    positiveText: '确定',
    negativeText: '取消',
    positiveButtonProps: {type: "primary"},
    showIcon: false,
    closable: false,
    onPositiveClick: async () => {
      try {
        await deleteProject({
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
    const res: any = await getProjectList({
      page: page.value,
      size: size.value,
      name: searchForm.value.name
    })
    total.value = res.data.total
    list.value = res.data.rows
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
const goChapter = (item: any) => {
  router.push(`/layout/project/chapter?id=${item.id}`)
};
const goThing = (item: any) => {
  router.push(`/layout/project/thing?id=${item.id}`)
};
const goCharacter = (item: any) => {
  router.push(`/layout/project/character?id=${item.id}`)
};
const goScene = (item: any) => {
  router.push(`/layout/project/scene?id=${item.id}`)
};
const goShot = (item: any) => {
  router.push(`/layout/project/shot?id=${item.id}`)
};
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
</style>
