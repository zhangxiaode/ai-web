<template>
	<div v-if="list.length > 0" class="flex flex-wrap">
		<div v-for="(item, index) in list" :key="index" class="mx-12px my-6px p-12px bg-#fff rounded-8px flex-col justify-center items-center">
			<div class="justify-between items-center">
				<div class="justify-center items-center"><span class="txt font-600 text-16px c-#333 leading-18px">+{{ item?.product_coin }}尧币</span></div>
				<div class="my-6px justify-center items-center"><span class="text-14px c-#a5a5a5 leading-16px">¥{{ item?.product_price / 100 }}</span></div>
			</div>
			<div class="justify-between items-center">
				<div class="time justify-center items-center"><span class="text-14px c-#a5a5a5 leading-16px">{{ item?.success_time }}</span></div>
				<div class="status justify-center items-center"><span :class="['text-14px c-#F03A5F leading-16px', item?.trade_status === 0 ? 'c-#a5a5a5' : item?.trade_status === 2 ? 'c-#67c23a' : '' ]">{{ formatTradeStatus(item?.trade_status) }}</span></div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getOrderList } from "@/apis/index";
const page = ref(1)
const size = ref(10)
const total = ref(0)
const list: any = ref([])
const formatTradeStatus = (val: number) => {
	switch (val){
		case 0:
			return '已关闭'
		case 1:
			return '待支付'
		case 2:
			return '支付成功'
		case 3:
			return '转入退款'
		case 4:
			return '已退款'
		case 5:
			return '拒绝退款'
		case 6:
			return '退款失败'
		default:
			return '未知'
	}
}
const getOrder = async () => {
	try {
		const res: any = await getOrderList({
			page: page.value,
			size: size.value
		})
		if (res.code === 200) {
			list.value = page.value === 1 ? res.data.rows : [...list.value, ...res.data.rows]
			total.value = res.data.total
		}
	} catch (error: any) {
		console.log(error)
	}
}
onMounted(async () => {
	if(total.value === 0 && page.value === 1) {
		await getOrder()
	}
})
</script>

<style lang="scss" scoped>
</style>
