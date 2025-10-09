<!-- 提现 -->
<template>
  <HeaderBar :currentName="_t18('withdraw', ['latcoin'])"></HeaderBar>
  <List :data="coinList"> </List>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import List from './withdraw-list.vue'
import { filterCoin2 } from '@/utils/public'
import { useMainStore } from '@/store/index.js'
const mainStore = useMainStore()
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user/index'
import { onMounted } from 'vue'
const userStore = useUserStore()
// 用户余额信息
const { asset } = storeToRefs(userStore)
// 提现方式列表
const coinList = computed(() => {
  let list = []
  mainStore.getWithdrawList.forEach((item, index) => {
    // status:0关闭，1开启
    if (item.status == '1') {
      let obj = {}
      obj['type'] = 1 //提现
      obj['ratio'] = item.ratio || '' //手续费
      obj['fee'] = item.fee //固定手续费
      // type:0数据货币，1银行卡
      if (item.type == 0) {
        obj['icon'] = item.rechargeType
        obj['title'] = item.rechargeName
      } else {
        obj['icon'] = 'card'
        // 银行卡提现
        obj['title'] = _t18('withdraw_card')
        obj['card'] = filterCoin2(item.rechargeType).toLocaleUpperCase()
      }

      list.push(obj)
    }
  })
  return list
})
// const coinList = computed(() => {
//   let list = []
//   list = [
//     { icon: 'usdt', type: '1', title: 'USDT - TRC' },
//     { icon: 'usdt', type: '1', title: 'USDT - ERC' },
//     { icon: 'btc', type: '1', title: 'BTC' },
//     { icon: 'eth', type: '1', title: 'ETH - ERC' },
//     { icon: 'usdc', type: '1', title: 'USDC' },
//     { icon: 'card', type: '2', title: '银行卡提现' }
//   ]
//   return list
// })
</script>

<style lang="scss" scoped></style>
