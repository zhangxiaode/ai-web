<template>
  <div class="c-#fff h-100% overflow-auto">
    <div class="p-32px flex flex-column">
      <div class="flex justify-center items-center">
        <n-radio-group v-model:value="vip_time_type" name="radiobuttongroup1">
          <n-radio-button
            v-for="item in vip_time_type_options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </n-radio-group>
      </div>
      <div class="flex flex-wrap justify-center items-center my-32px">
        <div v-for="(item, index) in list" :key="index" class="bg-#1f2937 overflow-hidden rounded-12px w-[calc(25%-32px)] h-250px min-w-256px m-16px p-32px box-border border-2px border-style-solid border-color-#4b5563 relative flex flex-column justify-between items-between cursor-pointer">
          <div class="flex-1 text-18px font-bold px-12px py-8px flex flex-col justify-center">{{ item.name }}</div>
          <div class="px-12px pt-12px text-20px font-bold my-4px flex justify-center items-center">
            <div class="flex justify-center items-center"><text class="text-16px c-#a5a5a5">¥ </text><text class="text-32px font-bold c-#a855f7 mx-8px">{{ item.price }}</text><text class="text-16px c-#a5a5a5">/{{ item.unit }}</text></div>
            <div v-if="item.old_price > 0" class="ml-4px c-#999 text-14px line-through"><text class="text-12px">¥ </text>{{ item.old_price }}/{{ item.unit }}</div>
          </div>
          <div v-if="item.tag" class="absolute px-12px right-0px top-0px rounded-[0_0_0_24rpx] c-#fff text-12px bg-[linear-gradient(1turn,#ff4320,#ff760e)]">{{ item.tag }}</div>
          <div class="flex justify-center items-center">
            <div class="cursor-pointer rounded-8px bg-[linear-gradient(to_right,#a855f7,#ec4899)] mx-auto my-32px px-12px h-36px leading-36px text-center c-#fff text-14px font-bold mr-8px" @click="debouncing(handlePay, message, 2000, { product: item, platform: 'wx' })">微信支付</div>
            <div class="cursor-pointer rounded-8px bg-[linear-gradient(to_right,#a855f7,#ec4899)] mx-auto my-32px px-12px h-36px leading-36px text-center c-#fff text-14px font-bold" @click="debouncing(handlePay, message, 2000, { product: item, platform: 'alipay' })">支付宝支付</div>
          </div>
        </div>
      </div>
      <div class="w-[100%] h-1px bg-#293341 rounded-2px my-16px"></div>
      <div class="flex flex-wrap items-center my-32px">
        <div v-for="(item, index) in coin_list" :key="index" class="bg-#1f2937 overflow-hidden rounded-12px w-[calc(25%-32px)] h-250px min-w-256px m-16px p-32px box-border border-2px border-style-solid border-color-#4b5563 relative flex flex-column justify-between items-between cursor-pointer">
          <div class="c-#fff font-bold px-12px py-4px flex justify-center items-center">
            <text class="text-18px">{{ item.coin }}尧币</text>
            <text class="text-14px c-#9ca3af ml-8px" v-if="item.coin_gift > 0">(送{{ item.coin_gift }}尧币)</text>
          </div>
          <div class="px-12px pt-12px text-20px font-bold c-#a855f7 my-4px flex justify-center items-center">
            <div class="flex justify-center items-center"><text class="text-16px c-#a5a5a5">¥ </text><text class="text-32px font-bold c-#a855f7 mx-8px">{{ item.price }}</text><text class="text-16px c-#a5a5a5"></text></div>
            <div v-if="item.old_price > 0" class="ml-4px c-#999 text-14px line-through"><text class="text-12px">¥ </text>{{ item.old_price }}</div>
          </div>
          <div v-if="item.tag" class="absolute px-12px right-0px top-0px rounded-[0_0_0_24rpx] c-#fff text-12px bg-[linear-gradient(1turn,#ff4320,#ff760e)]">{{ item.tag }}</div>
          <div class="flex justify-center items-center">
            <div class="cursor-pointer rounded-8px bg-[linear-gradient(to_right,#a855f7,#ec4899)] mx-auto my-32px px-12px h-36px leading-36px text-center c-#fff text-14px font-bold mr-8px" @click="debouncing(handlePay, message, 2000, { product: item, platform: 'wx' })">微信支付</div>
            <div class="cursor-pointer rounded-8px bg-[linear-gradient(to_right,#a855f7,#ec4899)] mx-auto my-32px px-12px h-36px leading-36px text-center c-#fff text-14px font-bold" @click="debouncing(handlePay, message, 2000, { product: item, platform: 'alipay' })">支付宝支付</div>
          </div>
        </div>
      </div>
      <div class="p-16px">
        <div class="text-14px c-#999 leading-1.5em mt-4px">1. 订单超时时间为15分，超时后订单自动取消，请及时完成支付；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">2. 尧币为虚拟商品，一经充值，不支持退款；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">3. 1元人民币对应100个尧币。各项目尧币消耗在提交任务处有醒目标注，在个人中心有消耗流水列表。因服务器原因生成失败的返还尧币；</div>
        <div class="text-14px c-#999 leading-1.5em mt-4px">4. 使用指导，对公支付，开具发票，购买更多尧币，咨询节省计划，请联系商务，邮箱 chengyaokeji@126.com</div>
      </div>
    </div>
    <ConfirmModal />
  </div>
</template>
<script lang="ts" setup>
import { useModal } from "@/hooks";
import { getUser } from "@/utils/auth";
import { debouncing } from '@/utils/index';
import { getProductList, postOrder } from "@/apis/index";
import ConfirmModal from './components/confirmModal.vue';

const message = useMessage()
const { showModal: showConfirmModal } = useModal("confirm-modal");

const user_info: any = ref(null)
const month_vip_list: any = ref([])
const quarter_vip_list: any = ref([])
const year_vip_list: any = ref([])
const coin_list: any = ref([])
const vip_time_type: any = ref(30)
const vip_time_type_options: any = ref([
  { label: '月卡会员', value: 30 },
  { label: '季卡会员', value: 90 },
  { label: '年卡会员', value: 365 },
])

const list: any = computed(() => {
  switch (vip_time_type.value) {
    case 30:
      return month_vip_list.value
    case 90:
      return quarter_vip_list.value
    case 365:
      return year_vip_list.value
    default:
      break;
  }
})

const getUserInfo = async () => {
  const user: any = await getUser()
  user_info.value = user
}

const formatData = (list: Array<any>) => {
  return list.map((item: any) => {
    item.price = (item.price / 100).toFixed(2)
    item.old_price = (item.old_price / 100).toFixed(2)
    item.name = item.vip_type === 1 ? '标准版' : item.vip_type === 2 ? '专业版' : item.vip_type === 3 ? '旗舰版' :  item.vip_type === 4 ? '企业版' : '免费版'
    item.unit = item.time === 30 ? '月' : item.time === 90 ? '季' : item.time === 365 ? '年' : '周'
    return item
  })
}

const getData = async () => {
  const res: any = await getProductList()
  if (res.code == 200) {
    month_vip_list.value = formatData(res.data.month_vip_list)
    quarter_vip_list.value = formatData(res.data.quarter_vip_list)
    year_vip_list.value = formatData(res.data.year_vip_list)
    coin_list.value = formatData(res.data.coin_list)
  }
}
const handlePay = async (params: any) => {
  const res: any = await postOrder({
    product_id: params.product.id,
    platform: params.platform
  })
  if(res.code == 200) {
    let code_url: any;
    if(params.platform === 'wx') {
      code_url = res.data.code_url
    } else {
      const parser: any = new DOMParser();
      const doc: any = parser.parseFromString(res.data.pay_form, 'text/html');
      const form: any = doc.querySelector('form');
      const actionUrl: any = form.action;
      const formData: any = new FormData(form);
      const query: any = new URLSearchParams(formData);
      code_url = `${actionUrl}?${query.toString()}`;
    }
    showConfirmModal({
      code_url,
      order_id: res.data.id,
      product: params.product,
      platform: params.platform
    });
  }
}
onMounted(() => {
  getUserInfo()
  getData()
})
</script>

<style lang="scss" scoped>
</style>
