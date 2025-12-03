<template>
  <div class="footer flex flex-column jc-center ai-center">
    <div class="tel flex ai-center">
      <img src="../assets/tel.svg" alt="">
      <span>服务热线：13023672647</span>
    </div>
    <div class="company"><a href="https://beian.miit.gov.cn" target="_blank" class="copyright">浙ICP备2024074121号-4</a>杭州丞尧信息科技有限公司</div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  height: 44px; 
  padding: 16px 0;
  color: rgba(255, 255, 255, .8);
  background: rgba(22, 22, 23, .8);
  .tel {
    margin-bottom: 8px;
    img {
      width: 16px; 
      height: 16px;
      margin-right: 5px;
    }
    span {
      font-size: 12px;
    }
  }
  .company {
    margin: 0 auto;
    font-size: 12px;
    .copyright {
      color: rgba(255, 255, 255, .8);
      margin-right: 5px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>