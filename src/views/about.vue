<template>
  <div class="about overflow-hidden flex jc-center ai-center">
    <!-- <div class="map flex-1" id="map"></div> -->
    <div class="wrap">
      <div class="title text-align-center">联系我们</div>
      <div class="place">地址：浙江省杭州市拱墅区康桥路296号南楼1398室</div>
      <div class="wx">微信：jinfengningxiang 张先生</div>
      <div class="email">官方邮箱：chengyaokeji@126.com</div>
      <div class="title text-align-center">微信小程序/公众号</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import AMapLoader from '@amap/amap-jsapi-loader'

const initAMap = () => {
  AMapLoader.load({
    key: 'c091dcdda347f0c55366e2d2e2f22efc',
    version: '2.0'
  }).then(() => {
    const map: any = new AMap.Map('map', {
      level: 16,
      center: new AMap.LngLat(120.140684, 30.366672),
      resizeEnable: true
    });
    const marker: any = new AMap.Marker({
      position: new AMap.LngLat(120.140684, 30.366672),
      offset: new AMap.Pixel(-10, -10),
      icon: new AMap.Icon({
        size: new AMap.Size(25, 34), //图标尺寸 144 48
        image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png", //Icon 的图像
        imageOffset: new AMap.Pixel(-97, -3), //图像相对展示区域的偏移量，适于雪碧图等
        imageSize: new AMap.Size(135, 40), //根据所设置的大小拉伸或压缩图片
      }),
      title: "杭州丞尧信息科技有限公司",
      zooms: [1, 20]
    });
    map.add(marker);
  }).catch((error) => {
      console.log(error);
  });
}
onMounted(() => {
  // initAMap()
})
</script>

<style lang="scss" scoped>
.about {
  width: 1024px;
  padding: 36px 0;
  margin: 0 auto;
  .title {
    font-size: 36px;
    font-weight: bold;
    margin: 36px 0;
  }
  .map {
    width: 474px; // 1024-650 
    height: 600px;
    margin-right: 36px;
    border-radius: 8px;
  }
  .place, .wx, .email  {
    font-size: 18px;
    font-weight: bold;
    margin: 16px auto;
  }
  .qrcode {
    .item {
      margin: 0 24px;
      .code {
        width: 150px;
        height: 150px;
      }
      .name {
        font-size: 18px;
        margin: 24px 0;
      }
    }
  }
}
</style>
