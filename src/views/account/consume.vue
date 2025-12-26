<template>
	<div v-if="list.length > 0" class="flex flex-wrap">
		<div v-for="(item, index) in list" :key="index" class="h-86px mx-12px my-6px p-12px bg-#fff rounded-8px relative flex-row">
			<img :src="item?.novel?.poster || '/static/poster.png'" lazy-load :draggable="false" mode="scaleToFill" class="w-42px h-62px rounded-4px" alt="" />
			<div class="pl-12px flex-1 flex-column">
				<div class="tit flex-row jc-center ai-center"><span class="font-600 text-16px c-#333 leading-18px w-274px multi-ellipsis--l1">{{ item?.novel?.name }}</span></div>
				<div class="my-6px flex-row jc-center ai-center"><span class="text-14px c-#a5a5a5 leading-16px w-274px multi-ellipsis--l1">第{{ item?.chapter?.index }}章·{{ item?.chapter?.name }}</span></div>
				<div class="amount flex-row jc-between ai-center">
					<span class="text-14px c-#666 leading-16px">消耗{{ item?.amount }}金币</span>
					<span class="txt">{{ item?.create_time }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getConsumeList } from "@/apis/index";

const page = ref(1)
const size = ref(10)
const total = ref(0)
const list: any = ref([])
const getConsume = async () => {
	try {
		const res: any = await getConsumeList({
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
		await getConsume()
	}
})
</script>

<style lang="scss" scoped>
</style>