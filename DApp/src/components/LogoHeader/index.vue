<template>
  <van-popup
    v-model:show="show"
    position="left"
    @close="closeSideBar"
    style="
      width: var(--ex-max-width);
      height: 100%;
      background: var(--ex-default-background-color);
      left: auto;
      margin-top: -1px;
    "
  >
    <SideBar @closeSideBar="closeSideBar"></SideBar>
  </van-popup>
  <div class="header">
    <Logo />
    <div class="right">
      <svg-load
        name="kefu"
        class="rightImg"
        @click="dispatchCustomEvent('event_serviceChange')"
      ></svg-load>
      <svg-load name="sousuo" class="rightImg" @click="$router.push('/quote')"></svg-load>
      <svg-load name="cebian" class="rightImg" @click="openCebian"></svg-load>
    </div>
  </div>
</template>
<script setup>
import { dispatchCustomEvent } from '@/utils/index'
import Logo from '@/components/common/Logo/index.vue'
import SideBar from '@/views/home/sidebar/index.vue'
const show = ref(false)
const openCebian = () => {
  show.value = true
}
const closeSideBar = () => {
  show.value = false
}
</script>
<style lang="scss" scoped>
.header {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .leftImg {
    width: 28px;
    height: 28px;
  }
  .right {
    .rightImg {
      width: 24px;
      height: 24px;
      margin-left: 20px;
    }
  }
}
</style>
