<template>
  <div class="header fixed">
    <div class="header-content flex jc-between ai-normal ">
      <div class="headerL flex ai-center">
        <img class="logo cursor-pointer" src="../assets/logo.png" alt="" @click="goHome()" />
        <!-- <div class="flex flex-column jc-between ai-normal">
          <div class="flex jc-between ai-center">
            <div class="title">丞尧</div>
          </div>
        </div> -->
      </div>
      <div class="headerR">
        <div class="tabs flex ai-center">
          <div v-for="(item, index) in tabs" :key="index" :class="['tab cursor-pointer', { 'actived relative': current === index }]" @click="handleTab(item.path)">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const route = useRoute()
const tabs = ref([
  {
    name: '首页',
    path: '/layout/home'
  },
  {
    name: '企业介绍',
    path: '/layout/introduction'
  },
  {
    name: '产品介绍',
    path: '/layout/product'
  },
  {
    name: '关于我们',
    path: '/layout/about'
  }
])
const current = computed(() => {
  return tabs.value.findIndex(item => item.path === route.path)
});
const handleTab = (path: string) => {
  router.push(path)
}
const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.header {
  left: 0;
  top: 0;
  right: 0;
  height: 44px; 
  z-index: 999;
  color: rgba(255, 255, 255, .8);
  background: rgba(22, 22, 23, .8);
  .header-content {
    width: 1024px;
    margin: 0 auto;
  }
  .headerL {
    .logo {
      width: 36px;
      height: 36px;
      margin-right: 16px;
    }
    .title {
      height: 44px;
      line-height: 44px;
      font-size: 16;
      font-weight: bold;
    }
  }
  .headerR {
    .tab {
      font-size: 12px;
      color: #ccc;
      height: 44px; 
      line-height: 44px;
      padding: 0 8px;
      margin: 0 16px;
      transform-origin: center center;
      &.actived {
        color: #fff;
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
  }
}
</style>