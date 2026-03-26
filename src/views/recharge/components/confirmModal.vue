<template>
  <n-modal v-model:show="visible" mask-closable preset="dialog" :show-icon="false" class="dialog" style="width: 600px;" @update:show="onClose">
    <template #header>
      <slot name="header">{{ title }}</slot>
    </template>
    <slot>
      <div class="flex flex-column items-center">
        <div class="flex justify-center items-center">
          <span class="text-14px c-#a5a5a5">金额</span>
          <span class="text-28px font-bold c-#ec4899 mx-8px">{{ price }}</span>
          <span class="text-14px c-#a5a5a5">元</span>
        </div>
        <div class="qrcode relative w-190px h-190px my-24px">
          <n-qr-code :value="code_url" color="#18a058" :size="166" />
          <div v-if="show_mask" class="absolute left-0px top-0px z-2 w-190px h-190px bg-[rgba(0,0,0,0.8)] flex flex-column justify-center items-center">
            <div class="text-14px c-#fff">支付前请阅读</div>
            <div class="text-14px c-#fff mt-8px">《丞尧智芯 付费服务协议》</div>
            <div class="cursor-pointer rounded-8px bg-[linear-gradient(to_right,#a855f7,#ec4899)] mx-auto my-12px px-12px h-36px leading-36px text-center c-#fff text-14px font-bold" @click="hideMask()">同意并支付</div>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <img src="../../../assets/wx.png" class="w-32px h-32px mr-8px" />
          <div class="text-14px c-#eee">微信扫码支付</div>
          <div v-if="!show_mask && limit_time > 0" class="w-1px h-16px bg-#293341 rounded-2px mx-12px"></div>
          <div v-if="!show_mask && limit_time > 0" class="text-14px c-#eee">{{ format_limit_time }} 后失效</div>
        </div>
        <div class="w-[100%] h-1px bg-#293341 rounded-2px my-12px"></div>
        <div class="text-12px c-#ccc cursor-pointer my-12px" @click="goPaymentPolicy()">《丞尧智芯 付费服务协议》</div>
      </div>
    </slot>
  </n-modal>
</template>

<script lang="ts" setup>
import { useModal } from "@/hooks";
import { getOrderDetail } from "@/apis/index";
import { formatTradeStatus } from "@/constants/index";

const emit = defineEmits(["save"]);
const { visible, payload, hideModal } = useModal('confirm-modal');
const message = useMessage()
const stl: any = ref(null)
const show_mask = ref(true)

const title: any = computed(() => {
  if(payload.value?.product) {
    if(payload.value?.product.type === 1) {
      return `${payload.value?.product?.name} 按${payload.value?.product?.unit}购买`
    } else {
      return `${payload.value?.product?.coin}尧币${payload.value?.product?.coin_gift > 0 ? '(送' + payload.value?.product?.coin_gift + '尧币)' : ''}`
    }
  } else {
    return '扫码支付'
  }
})
const limit_time: any = ref(0)
const format_limit_time: any = computed(() => {
  return `${Math.floor(limit_time.value / 60)}分${limit_time.value % 60}秒`
})
const price: any = computed(() => payload.value?.product?.price)
const code_url: any = computed(() => payload.value?.code_url)

const hideMask = () => {
  show_mask.value = false
}

const goPaymentPolicy = () => {
  window.open('https://ai.chengyaokj.com/data/ai/h5/payment_policy.html')
}

const onClose = () => {
  hideModal();
  stl.value && clearInterval(stl.value)
}
watch(visible, (newValue: any) => {
	if(newValue) {
    show_mask.value = true
    limit_time.value = 900
    stl.value && clearInterval(stl.value)
    stl.value = setInterval(async () => {
      limit_time.value -= 1
      const order_detail: any = await getOrderDetail({ id: payload.value?.order_id })
      if(order_detail?.data?.trade_state != 'NOTPAY' && order_detail?.data?.trade_state != 'USERPAYING') {
        if(order_detail?.data?.trade_state === 'SUCCESS') {
          message.success(formatTradeStatus(order_detail?.data?.trade_state))
        } else {
          message.error(formatTradeStatus(order_detail?.data?.trade_state))
        }
        clearInterval(stl.value)
      }
    }, 1000)
	} else {
    stl.value && clearInterval(stl.value)
	}
});
</script>

<style lang="scss" scoped>
.pay-content {
  font-weight: 500;
  border-radius: 16px;
  margin: 58px 0;
}
</style>