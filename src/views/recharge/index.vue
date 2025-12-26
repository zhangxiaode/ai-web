<template>
  <div class="c-#fff h-100% overflow-auto">
    <div class="p-32px flex flex-wrap">
      <div v-for="(item, index) in list" :key="index" :class="['bg-#1f2937 overflow-hidden rounded-12px w-[calc(50%-32px)] h-80px m-16px p-24px box-border border-2px border-style-solid border-color-#4b5563 relative flex justify-between items-center', { 'border-color-#a855f7': item.id === current } ]" @click="changeProduct(item.id)">
        <div v-if="item.type === 0" class="flex-1 c-#fff px-12px py-8px flex flex-col justify-center">
          <text class="text-16px">{{ item.coin }}尧币</text>
          <text class="text-12px c-#9ca3af" v-if="item.coin_gift > 0">送{{ item.coin_gift }}尧币</text>
        </div>
        <div v-if="item.type === 1" class="flex-1 text-16px px-12px py-8px flex flex-col justify-center">{{ item.timeFormat }}</div>
        <div class="px-12px pt-12px text-20px font-bold c-#a855f7 my-4px flex justify-center items-center">
          <div><text class="text-16px">¥ </text>{{ item.price }}</div>
          <div v-if="item.cost_price > 0" class="ml-4px c-#999 text-14px line-through"><text class="text-12px">¥ </text>{{ item.cost_price }}</div>
        </div>
        <div v-if="item.tag" class="absolute px-12px right-0px top-0px rounded-[0_0_0_24rpx] c-#fff text-12px bg-[linear-gradient(1turn,#ff4320,#ff760e)]">{{ item.tag }}</div>
      </div>
      <div class="p-16px">
        <div class="text-14px c-#999 leading-1.5em mt-4px">1. 订单超时时间为60秒，超时后订单自动取消，请及时完成支付；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">2. 积分为虚拟商品，一经充值，不支持退款；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">3. 购买后的积分有效期为 365 天，到期余量自动清零；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">4. 1元人民币对应100个积分。各项目积分消耗在提交任务处有醒目标注，在积分余额处有消耗流水列表。因服务器原因生成失败的返还积分；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">5. 各项目积分消耗在提交任务处有醒目标注，在积分余额处有消耗流水列表。因服务器原因生成失败的返还积分；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">6. 使用指导，对公支付，开具发票，购买更多积分，咨询节省计划，请联系商务，邮箱 chengyaokeji@126.com</div>
      </div>
      <div class="cursor-pointer rounded-12px bg-[linear-gradient(to_right,#a855f7,#ec4899)] mx-auto my-32px h-60px leading-60px w-380px text-center c-#fff text-18px font-bold" @click="debouncing(goPay, message, 2000)">立即充值 {{ product?.coin }} 尧币</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getUser } from "@/utils/auth";
import { debouncing } from '@/utils/index';
import { getProductList, postOrder } from "@/apis/index";

const message = useMessage()
const user_info: any = ref(null)
const list: any = ref([])
const current: any = ref(4)

const product: any = computed(() => {
  return list.value.find((item: any) => item.id === current.value) || null
})

const getUserInfo = async () => {
  const user: any = await getUser()
  user_info.value = user
}

const getData = async () => {
  const res: any = await getProductList()
  if (res.code == 200) {
    list.value = res.data.map((item: any) => {
      item.price = (item.price / 100).toFixed(2)
      item.cost_price = (item.cost_price / 100).toFixed(2)
      item.timeFormat = item.time === 7 ? '周卡会员' : item.time === 30 ? '月卡会员' : item.time === 92 ? '季卡会员' : '年卡会员'
      
      return item
    })
    // const product: any = list.value.find((item: any) => item.is_default)
    // if(product) {
    //   current.value = product.id
    // }
  }
}
const changeProduct = (id: number) => {
  current.value = id
}
const goPay = async () => {
  // const res: any = await postOrder({
  //   product_id: current.value
  // })
  // if(res.code == 200) {
  //   wx.requestPayment({
  //     timeStamp: res.data.timeStamp,
  //     nonceStr: res.data.nonceStr,
  //     package: res.data.package,
  //     signType: res.data.signType,
  //     paySign: res.data.paySign,
  //     success(res: any){
  //       console.log(res)
  //     },
  //     fail(err: any){
  //       console.log(err)
  //     }
  //   })
  // }
}
onMounted(() => {
  getUserInfo()
  getData()
})
</script>

<style lang="scss" scoped>
</style>
