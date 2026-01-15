<template>
  <div class="h-100% px-32px overflow-hidden flex flex-col items-normal">
    <n-form
      label-placement="left"
      :inline="true"
      class="max-h-400px flex-wrap text-align-left overflow-auto pt-32px"
    >
      <n-form-item path="name" label="章节序号">
        <n-input-number v-model:value="searchForm.index" size="small" :show-button="false" placeholder="请输入章节序号" @keyup.enter.native="getList" />
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
          新增章节
        </n-button>
      </n-form-item>
    </n-form>
    <div class="flex-1 overflow-auto">
      <div v-for="(item, index) in list" :key="index" class="h-114px m-16px p-12px rounded-8px bg-#252525 flex flex-between items-center">
        <div class="flex-1 flex justify-center items-normal">
          <div class="flex-1 flex flex-col justify-center ml-16px">
            <div class="flex justify-between items-center">
              <div class="flex flex-col">
                <div class="text-16px font-bold c-#fff">第{{ item.index }}章. {{ item.name }}</div>
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
              <n-button class="mx-6px" type="error" size="tiny"  @click="transformScript(item)">
                <template #icon>
                  <n-icon>
                    <PeopleOutline />
                  </n-icon>
                </template>
                转换剧本
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="bindCharacter(item)">
                <template #icon>
                  <n-icon>
                    <ApertureSharp />
                  </n-icon>
                </template>
                角色绑定
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="createAudiobook(item)">
                <template #icon>
                  <n-icon>
                    <ApertureSharp />
                  </n-icon>
                </template>
                生成有声书
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="goShot(item)">
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                镜头管理
              </n-button>
              <n-button class="mx-6px" type="error" size="tiny"  @click="mergeVideo(item)">
                <template #icon>
                  <n-icon>
                    <TrashOutline />
                  </n-icon>
                </template>
                合成剧集
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
    <NewChapterModal @save="handleNewModalComplete" />
    <TransformScriptModal @save="handleTransformAudioScriptModalComplete" />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from "@/hooks";
import { Search, Repeat, AddSharp, CreateOutline, TrashOutline, PeopleOutline, ApertureSharp } from '@vicons/ionicons5';
import { getChapterList, deleteChapter } from '@/apis/index';
import NewChapterModal from './components/newChapterModal.vue';
import TransformScriptModal from './components/transformScriptModal.vue';

const router = useRouter()
const dialog = useDialog()
const message = useMessage()
let searchForm: any = ref({
  index: null
});
const page = ref(1)
const size = ref(10)
const total = ref(0)
const list: any = ref([])
const { showModal: showNewModal } = useModal("new-modal");
const { showModal: showTransformScriptModal } = useModal("transformScript-modal");

const onAdd = () => {
  showNewModal();
};
const handleNewModalComplete = () => {
  getList();
};
const handleTransformAudioScriptModalComplete = () => {
  getList();
};
const handleReset = () => {
  searchForm.value = {
    index: null
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
        await deleteChapter({
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
    const res: any = await getChapterList({
      page: page.value,
      size: size.value,
      index: searchForm.value.index
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
const transformScript = (item: any) => {
  showTransformScriptModal({
    id: item.id,
    novel_id: item.novel_id
  })
};
const bindCharacter = (item: any) => {
  showTransformScriptModal({
    id: item.id,
    novel_id: item.novel_id
  })
};
const createAudiobook = (item: any) => {
  router.push(`/layout/project/scene?id=${item.id}`)
};
const goShot = (item: any) => {
  router.push(`/layout/project/shot?id=${item.id}`)
};
const mergeVideo = (item: any) => {
  router.push(`/layout/project/shot?id=${item.id}`)
};
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
</style>
