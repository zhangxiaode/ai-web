<template>
  <div class="header flex justify-between items-normal h-64px c-[rgba(255,255,255,.8)] bg-[rgba(22,22,23,.8)]">
    <div class="headerL flex items-center">
      <img class="w-36px h-36px mx-16px cursor-pointer" src="../assets/logo.png" alt="" @click="goHome()" />
      <div class="title leading-44px text-18px font-500 min-w-72px">丞尧智芯</div>
      <div class="tabs flex items-center ml-32px min-w-456px">
        <div v-for="(item, index) in tabs" :key="index" :class="['tab h-44px leading-44px px-8px mx-8px c-#ccc text-12px cursor-pointer origin-center', { 'actived relative c-#fff': current === index }]" @click="handleTab(item.path)">{{ item.name }}</div>
      </div>
    </div>
    <div class="headerR flex items-center min-w-330px">
      <div class="recharge flex justify-center items-center rounded-4px bg-#ef4444 h-32px px-12px cursor-pointer" @click="router.push('/layout/recharge')">
        <img src="../assets/cash.png" alt="" class="w-16px h-16px">
        <span class="text-14px c-#fff ml-3px">金币充值</span>
      </div>
      <div class="mx-12px c-#ef4444 text-14px">金币余额: {{ formatZhNumber(user_info?.coin || 0) }}</div>
      <div class="userinfo flex justify-center items-center mr-12px">
        <img :src="user_info?.avatarurl" alt="" class="w-32px h-32px rounded-16px">
        <span class="c-#fff text-14px mx-12px">{{ user_info?.nickname }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatZhNumber } from "@/utils/index";
import { getUser } from "@/utils/auth";

const router = useRouter()
const route = useRoute()
const tabs = ref([
  {
    name: '首页',
    path: '/layout/home'
  },
  {
    name: '免费工具',
    path: '/layout/tools'
  },
  {
    name: '素材管理',
    path: '/layout/assets'
  },
  {
    name: '项目管理',
    path: '/layout/project'
  },
  {
    name: '个人中心',
    path: '/layout/account'
  },
  {
    name: '关于我们',
    path: '/layout/about'
  }
])
const current = computed(() => {
  return tabs.value.findIndex(item => route.path.includes(item.path))
});
const user_info: any = ref(null)
const handleTab = (path: string) => {
  router.push(path)
}
const goHome = () => {
  router.push('/')
}
const getUserInfo = async () => {
  const user: any = await getUser()
  user_info.value = user
}
onMounted(() => {
  getUserInfo()
})
</script>

<style lang="scss" scoped>
.header .headerL .tab {
  &.actived {
    transform: scale(1.1);
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 36px;
      height: 4px;
      border-radius: 2px;
      margin-left: -18px;
      background: #fff;
    }
  }
}
</style>