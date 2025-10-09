<template>
  <div class="userAmount">
    <div>
      <!-- 账户余额 -->
      <p>{{ _t18('asset_account', ['ebc']) }}(USDT)</p>
      <svg-load :name="showicon" class="yanjin" @click="handleYanjin"></svg-load>
      <svg-load name="refresh" class="shuaxin" @click="handleShuaxin"></svg-load>
    </div>
    <p class="userInfo fw-num">{{ _numberWithCommas(amount) }}</p>
  </div>
  <div class="currencyAbout">
    <div
      v-for="(item, index) in currencyAbout.filter((items) => {
        return items.isShow
      })"
      :key="index"
      @click="toRecharge(item.url)"
    >
      <svg-load :name="item.icon" class="currencyIcon"></svg-load>
      <p>{{ item.title }}</p>
    </div>
  </div>
</template>

<script setup>
import { dispatchCustomEvent } from '@/utils'
import { _t18, _toView } from '@/utils/public'
import { DIFF_RECHARGE_COSTORM } from '@/config/index'
const props = defineProps({
  data: {
    type: Object
  },
  amount: {
    type: String
  },
  coin: {
    type: String,
    default: 'USDT'
  },
  type: {
    type: String
  },
  showicon: {
    type: String
  }
})

const emit = defineEmits(['handleYanjin', 'handleShuaxin'])
const handleYanjin = () => {
  emit('handleYanjin')
}
const handleShuaxin = () => {
  emit('handleShuaxin')
}

const currencyAbout = computed(() => {
  let list = []
  // {
  //         icon: 'asset_ganggan',
  //         title: _t18('trade_tab5', ['paxpay']),
  //         url: '/tradeU',
  //         isShow: true
  //       }
  if (props.type == '平台资产') {
    if (['paxpay', 'aams'].includes(__config._APP_ENV)) {
      list = [
        {
          icon: 'chongbi',
          title: _t18('asset_recharge', ['aams']),
          url: '/recharge',
          isShow: true
        }, //充币 //杠杆
        { icon: 'tibi', title: _t18('asset_withdraw', ['aams']), url: '/withdraw', isShow: true }, //提币 ,
        { icon: 'dui', title: _t18('asset_swap'), url: '/swap', isShow: true }, //闪兑
        // {icon: 'asset_licai',title: _t18('financial', ['paxpay']),url: '/financial',isShow: true}, //理财
        { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: false }, //助力贷
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true } //划转
      ]
    } else if (['coinmarketcap'].includes(__config._APP_ENV)) {
      list = [
        {
          icon: 'chongbi',
          title: _t18('asset_recharge', ['coinmarketcap']),
          url: '/recharge',
          isShow: true
        },
        {
          icon: 'tibi',
          title: _t18('asset_withdraw', ['coinmarketcap']),
          url: '/withdraw',
          isShow: true
        },
        { icon: 'dui', title: _t18('asset_swap'), url: '/swap', isShow: true },
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/loan', isShow: true }
      ]
    } else {
      list = [
        {
          icon: 'chongbi',
          title: _t18('asset_recharge', ['latcoin']),
          url: '/recharge',
          isShow: true
        }, //充币
        {
          icon: 'tibi',
          title: _t18('asset_withdraw', ['latcoin']),
          url: '/withdraw',
          isShow: true
        }, //提币
        { icon: 'dui', title: _t18('asset_swap'), url: '/swap', isShow: true }, //闪兑
        { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: false }, //助力贷
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true } //划转
      ]
    }
  } else {
    if (['paxpay'].includes(__config._APP_ENV)) {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true }
        // { icon: 'chongbi', title: '充币', url: '/recharge', isShow: true },
        // { icon: 'tibi', title: '提币', url: '/withdraw', isShow: true },
        // { icon: 'dui', title: '闪兑', url: '/swap', isShow: true },
        // { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: true },
      ]
    } else {
      list = [
        { icon: 'huazhuan', title: _t18('asset_transfer'), url: '/transfer', isShow: true },
        // { icon: 'chongbi', title: '充币', url: '/recharge', isShow: true },
        // { icon: 'tibi', title: '提币', url: '/withdraw', isShow: true },
        // { icon: 'dui', title: '闪兑', url: '/swap', isShow: true },
        { icon: 'daikuai', title: _t18('asset_loan'), url: '/loan', isShow: true }
      ]
    }
  }

  return list
})
/**
 * 点击快捷充币
 */
const toRecharge = (url) => {
  _toView(url)
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.userAmount {
  // margin-top: 61px;
  padding: 30px 15px;
  // border-bottom: 1px solid var(--ex-border-color);
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
    .yanjin {
      font-size: 14px;
      margin-left: 15px;
      margin-right: 15px;
    }
    .shuaxin {
      font-size: 12px;
    }
    p {
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
  }
  & > p {
    font-size: 30px;
  }
}
.currencyAbout {
  padding: 0 5px 20px;
  display: flex;
  text-align: center;
  & > div {
    width: 25%;
  }
  .currencyIcon {
    font-size: 40px;
    margin-bottom: 10px;
  }
}
</style>
