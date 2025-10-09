<!-- 充值详情 -->
<template>
  <HeaderBar :currentName="_t18('recharge_detail')" :cuttentRight="cuttentRight"></HeaderBar>
  <Amount :data="data"></Amount>
  <Info :data="data"></Info>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { getRechargeDetail } from '@/api/account'
import Amount from '../components/detailAmount.vue'
import Info from '../components/orderInfo.vue'
const route = useRoute()
const cuttentRight = reactive({
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
})
const data = ref({})
const id = route.query.id
const getDetail = () => {
  getRechargeDetail(id).then((res) => {
    if (res.code == '200') {
      data.value = res.data
    }
  })
}
getDetail()
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
</style>
