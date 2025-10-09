<script setup>
import { onMounted, reactive } from 'vue'

let bannerList = reactive([])
onMounted(() => {
  getBannerList()
})
/**
 * 获取轮播图列表
 */
const getBannerList = async () => {
  //   const { data } = await getBannerListApi()
  const data = [
    { url: 'https://unsplash.it/1600/900?random' },
    { url: 'https://unsplash.it/1600/800?random' }
  ]
  bannerList = data
}
/**
 * 轮播图监听
 * @param {*} index
 */
const onChange = (index) => {
  console.log('轮播图监听', index)
}
</script>
<template>
  <div class="banner-list-box">
    <van-swipe @change="onChange" :autoplay="3000" lazy-render :loop="true">
      <van-swipe-item v-for="item in bannerList" :key="item.url">
        <image-load :filePath="item.url" class="img" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<style lang="scss" scoped>
.banner-list-box {
  .van-swipe {
    height: 200px;
    width: 100%;
    background-color: var(--ex-default-background-color);
    .img {
      background-color: var(--ex-default-background-color);
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
