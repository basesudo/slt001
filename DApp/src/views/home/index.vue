<!-- 首页 -->
<script setup>
import Header from './components/FrontPage/header.vue'
import HeaderDiff from './components/FrontPage/headerDiff.vue'
import Menu from './components/FrontPage/menu.vue'
import Footer from './components/FrontPage/footer.vue'
import { DIFF_HOME_BANNER } from '@/config/index'
import { useMainStore } from '@/store/index.js'

const mainStore = useMainStore()

onMounted(() => {
  mainStore.getSettingConfig()
})
</script>

<template>
  <HeaderDiff v-if="DIFF_HOME_BANNER.includes(_getConfig('_APP_ENV'))"></HeaderDiff>
  <Header v-else></Header>
  <Menu></Menu>
  <Footer></Footer>
</template>

<style lang="scss" scoped>
</style>
