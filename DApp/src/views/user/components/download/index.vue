<script setup>
import { useMainStore } from '@/store'
import { useRoute } from 'vue-router'
const mainStore = useMainStore()
/**
 * 下载列表
 */
const downLoadList = computed(() => {
  let data = []
  if (mainStore.getDownLoadList.length) {
    data = mainStore.getDownLoadList
      .map((item) => {
        return { icon: `${item.name}.png`, path: item.url, isOpen: item.isOpen }
      })
      .filter((item) => item.isOpen == 'true')
  }
  return data
})
const route = useRoute()
const showFlag = ref(route.query.flag)
const tohref = (url) => {
  window.open(url)
}
</script>
<template>
  <div class="content">
    <image-load filePath="xiazaiimg.png" class="img-bg"></image-load>
    <div class="toBack" v-if="showFlag" @click="$router.push('/')">
      <svg-load name="back" class="back"></svg-load>
    </div>
    <div class="btn-list" v-if="downLoadList.length">
      <image-load
        v-for="item in downLoadList"
        :key="item.path"
        :filePath="item.icon"
        class="btn-img"
        @click="tohref(item.path)"
      ></image-load>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  font-size: 0;
  min-height: 100vh;
  .img-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .toBack {
    position: absolute;
    margin-top: 30px;
    margin-left: 20px;
    .back {
      font-size: 18px;
    }
  }
  .btn-list {
    position: absolute;
    margin-top: 70%;
    margin-left: 200px;
    .btn-img {
      margin-bottom: 15px;
      width: 150px;
      height: 100%;
    }
  }
}
</style>
