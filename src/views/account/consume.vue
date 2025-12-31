<template>
    <div class="h-100% flex flex-column flex-1 overflow-hidden">
		<div class="text-24px font-bold my-16px font-bold c-#fff">消费记录</div>
		<div class="flex-1 overflow-hidden" ref="tableRef">
			<n-data-table
			size="small"
			:loading="loading"
			:single-line="false"
			:row-key="(row: any) => row.id"
			:columns="columns"
			:data="tableData"
			scroll-x
			class="table-wrapper"
			/>
		</div>
		<n-pagination
			class="my-20px mx-auto overflow-auto"
			v-model:page="page"
			:page-size="size"
			:page-sizes="[20, 50, 100]"
			:item-count="total"
			show-size-picker
			show-quick-jumper
			:suffix="() => `共${total}条`"
			@update:page="handleCurrentChange"
			@update:page-size="handleSizeChange"
		/>
    </div>
</template>
<script lang="ts" setup>
import { getConsumeList } from "@/apis/index";
import { Copy } from '@vicons/ionicons5'
import { copyToClip } from '@/utils/index'

const message = useMessage()
const loading = ref(false)
const page = ref(1)
const size = ref(10)
const total = ref(0)
let columns = ref([
  {
    title: '消费ID',
    key: 'id',
    width: 120,
    align: 'center',
	render(row: any) {
		return h('div', { class: 'flex items-center justify-center', onClick: () => {
			copyToClip(row.id)
			message.success('拷贝成功')
		}}, { default: () => [
			h('div', {}, { default: () => row.id }),
			h(NIcon, { size: 14, color: '#1668dc', class: 'hover:c-#15417e ml-5px cursor-pointer' }, { default: () => h(Copy, {}, {}) }),
		]})
	}
  },
  {
    title: '模型',
    key: 'model',
    width: 150,
    align: 'center'
  },
  {
    title: '消耗尧币',
    key: 'amount',
    width: 120,
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'create_time',
    width: 160,
    align: 'center'
  },
]);
let tableData: any = ref([]);
const getConsume = async () => {
	loading.value = true
	try {
		const res: any = await getConsumeList({
			page: page.value,
			size: size.value
		})
		if (res.code === 200) {
			tableData.value = page.value === 1 ? res.data.rows : [...tableData.value, ...res.data.rows]
			total.value = res.data.total
		}
	} catch (error: any) {
		console.log(error)
	}
	loading.value = false
}
const handleSizeChange = (val: number) => {
  page.value = 1;
  size.value = val;
  getConsume();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  getConsume();
};
onMounted(async () => {
	if(total.value === 0 && page.value === 1) {
		await getConsume()
	}
})
</script>

<style lang="scss" scoped>
</style>
