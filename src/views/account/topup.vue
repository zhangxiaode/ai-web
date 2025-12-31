<template>
    <div class="h-100% flex flex-column flex-1 overflow-hidden">
		<div class="text-24px font-bold my-16px font-bold c-#fff">充值记录</div>
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
import { getOrderList } from "@/apis/index";
import { Copy } from '@vicons/ionicons5'
import { copyToClip } from '@/utils/index'

const message = useMessage()
const loading = ref(false)
const page = ref(1)
const size = ref(10)
const total = ref(0)
let columns = ref([
  {
    title: '订单ID',
    key: 'id',
    width: 160,
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
    title: '充值金额(¥)',
    key: 'price',
    width: 120,
    align: 'center',
    render(row: any) {
      return row?.price / 100 || '--'
    }
  },
  {
    title: '尧币/会员',
    key: 'product_coin',
    width: 120,
    align: 'center',
    render(row: any) {
      return row.product_type === 0 ? `${row?.product_coin}${row?.product_coin_gift ? ' + ' + row?.product_coin_gift + ' (赠送)' : ''}` : `${row.product_time}天会员`
    }
  },
  {
    title: '支付状态',
    key: 'contact_person',
    width: 120,
    align: 'center',
    render(row: any) {
      return formatTradeStatus(row.trade_state)
    }
  },
  {
    title: '创建时间',
    key: 'create_time',
    width: 120,
    align: 'center'
  },
  {
    title: '支付时间',
    key: 'success_time',
    width: 120,
    align: 'center'
  },
]);
let tableData: any = ref([]);
const formatTradeStatus = (val: string) => {
	switch (val){
		case 'SUCCESS':
			return '支付成功'
		case 'REFUND':
			return '转入退款'
		case 'NOTPAY':
			return '未支付'
		case 'CLOSED':
			return '已关闭'
		case 'REVOKED':
			return '已撤销（仅付款码支付会返回）'
		case 'USERPAYING':
			return '用户支付中（仅付款码支付会返回）'
		case 'PAYERROR':
			return '支付失败（仅付款码支付会返回）'
		default:
			return '未知'
	}
}
const getOrder = async () => {
	loading.value = true
	try {
		const res: any = await getOrderList({
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
  getOrder();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  getOrder();
};
onMounted(async () => {
	if(total.value === 0 && page.value === 1) {
		await getOrder()
	}
})
</script>

<style lang="scss" scoped>
</style>
