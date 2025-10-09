<!-- 理财 -->
<template>
  <HeaderBar v-if="['paxpay'].includes(_getConfig('_APP_ENV'))"
      :currentName="_t18('financial',['paxpay'])"
      :border_bottom="false"
    ></HeaderBar>
  <LogoHeader v-else></LogoHeader>
  <Header></Header>
  <FundList></FundList>
</template>
<script setup>
import LogoHeader from '@/components/LogoHeader/index.vue'
import Header from './components/header.vue'
import FundList from './components/fundList.vue'
</script>
<style lang="scss" scoped></style>
