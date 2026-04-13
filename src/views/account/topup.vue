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
				:max-height="tableHeight"
				scroll-x
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
import { FormInst } from 'naive-ui';
import { getOrderList, getOrderDetail } from "@/apis/index";
import { Copy } from "@vicons/ionicons5";
import { copyToClip } from "@/utils/index";
import { formatTradeStatus } from "@/constants/index";

const tableRef = ref<FormInst | null>(null)
const tableHeight = computed(() => {
  const dom: any = tableRef.value;
  const orderHeight: number = dom ? dom.clientHeight : 500
  const header = document.getElementsByClassName('n-data-table-base-table-header')[0]
  const headerHeight: number = header ? header.clientHeight + 2 : 42
  return orderHeight - headerHeight
});
const message = useMessage()
const dialog = useDialog()
const loading = ref(false)
const page = ref(1)
const size = ref(10)
const total = ref(0)
const stl: any = ref(null)
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
    key: 'trade_state_desc',
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
  {
    title: '操作',
    key: 'actions',
    width: 80,
    fixed: 'right',
    align: 'center',
    render(row: any) {
      return (row.trade_state === 'NOTPAY' || row.trade_state === 'USERPAYING') && row.code_url ? [
        h(NButton, {
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onPay(row)
        }, {default: () => '支付'})
      ] : []
    }
  }
]);
let tableData: any = ref([]);
const getOrder = async () => {
	loading.value = true
	try {
		const res: any = await getOrderList({
			page: page.value,
			size: size.value
		})
		if (res.code === 200) {
			tableData.value = res.data.rows
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
const onPay = async (row: any) => {
  const payDialog: any = dialog.warning({
    title: '扫码支付',
    content: () => h(NQrCode, {
      value: row.code_url,
      color: '#18a058',
      size: 166
    }, {}),
    style: {
      width: '246px',
    },
    negativeText: '关闭',
    positiveButtonProps: {type: "primary"},
    showIcon: false,
    closable: false,
    onNegativeClick: () => {
      stl.value && clearInterval(stl.value)
    }
  })
  stl.value && clearInterval(stl.value)
  stl.value = setInterval(async () => {
    const order_detail: any = await getOrderDetail({ id: row.id })
    if(order_detail.data.trade_state != 'NOTPAY' && order_detail.data.trade_state != 'USERPAYING') {
      if(order_detail.data.trade_state === 'SUCCESS') {
        message.success(formatTradeStatus(order_detail.data.trade_state))
      } else {
        message.error(formatTradeStatus(order_detail.data.trade_state))
      }
      payDialog.destroy()
      clearInterval(stl.value)
    }
  }, 1000)
}
onMounted(async () => {
	if(total.value === 0 && page.value === 1) {
		await getOrder()
	}
})
</script>

<style lang="scss" scoped>
</style>
