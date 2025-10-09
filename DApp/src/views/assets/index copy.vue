<!-- 资产 -->
<script setup>
import { _hide } from '@/utils/public.js'
import { priceFormat, countFormat, currencyFormat } from '@/utils/decimal.js'
import Amount from './components/account/amount.vue'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
// userStore.getUserInfo()
// 用户余额信息
const { asset } = storeToRefs(userStore)
const currencyAbout = computed(() => {
  let list = []
  list = [
    { icon: 'chongbi', title: '充币', url: '/recharge' ,isShow:true},
    { icon: 'tibi', title: '提币', url: '/withdraw' ,isShow:true},
    { icon: 'dui', title: '闪兑', url: '/swap' ,isShow:true},
    { icon: 'daikuai', title: '助力贷', url: '/loan' ,isShow:false},
    { icon: 'huazhuan', title: '划转', url: '/transfer' ,isShow:true},
  ]
  return list
})
const assetDetails = computed(() => {
  let list = []
  //[{icon: 'usdt', title: 'USDT', keyong: 100, zhanyong: 100, zhehe: 100}]
  asset.value.forEach((item, index) => {
    if (item.type == '1') {
      let obj = {}
      obj['keyong'] = priceFormat(item.availableAmount)
      obj['zhanyong'] = priceFormat(item.occupiedAmount)
      obj['zhehe'] = priceFormat(item.exchageAmount)
      if (item.symbol == 'usdt') {
        obj['icon'] = 'usdt'
        obj['title'] = 'USDT'
        list.unshift(obj)
      } else {
        obj['title'] = item.symbol?.replace('usdt', '').trim().toLocaleUpperCase()
        obj['icon'] = item.symbol?.replace('usdt', '').trim()
        list.push(obj)
      }
    }
  })

  return list
})
// 计算账户余额
const amountSum = computed(() => {
  let sum = 0
  for (let i = 0; i < assetDetails.value.length; i++) {
    sum += Number(assetDetails.value[i].zhehe)
  }
  return priceFormat(sum)
})
const showNum = ref(false)
// 点击小眼睛
const handleYanjin = () => {
  showNum.value = !showNum.value
}
</script>
<template>
  <!-- <LogoHeader></LogoHeader> -->
  <Amount :amount="showNum ? amountSum : _hide(amountSum)" @handleYanjin="handleYanjin"></Amount>
  <div class="currencyAbout">
    <div v-for="(item, index) in currencyAbout.filter((items)=>{return items.isShow})" :key="index" @click="$router.push(item.url)">
      <svg-load :name="item.icon" class="currencyIcon"></svg-load>
      <p>{{ item.title }}</p>
    </div>
  </div>
  <div class="assetDetails">
    <div v-for="(item, index) in assetDetails" :key="index">
      <div class="title" v-if="item.icon == 'usdt'">
        <div class="left fw-bold">资产明细</div>
      </div>
      <div class="details">
        <div class="top">
          <svg-load :name="item.icon" class="currencyIcon"></svg-load>
          <p class="fw-bold">{{ item.title }}</p>
        </div>
        <div class="bottom">
          <div>
            <p class="til">可用</p>
            <p class="num ff-num">{{ showNum ? item.keyong : _hide(item.keyong) }}</p>
          </div>
          <div>
            <p class="til">占用</p>
            <p class="num ff-num">{{ showNum ? item.zhanyong : _hide(item.zhanyong) }}</p>
          </div>
          <div>
            <p class="til">折合</p>
            <p class="num ff-num">{{ showNum ? item.zhehe : _hide(item.zhehe) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
* {
  color: var(--ex-default-font-color);
  font-size: 14px;
}
.currencyAbout {
  padding: 20px;
  // border-top: 1px solid var(--ex-border-color);
  display: flex;
  justify-content: space-between;
  text-align: center;
  .currencyIcon {
    font-size: 40px;
    margin-bottom: 10px;
  }
}
.assetDetails {
  padding-bottom: 100px;
  & > div {
    padding: 20px 15px;
    border-top: 1px solid var(--ex-border-color);
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .left {
        font-size: 16px;
      }
      .yanjin {
        font-size: 16px;
      }
    }
    .details {
      .top {
        display: flex;
        align-items: center;
        .currencyIcon {
          font-size: 20px;
          margin-right: 10px;
        }
        P {
          font-weight: bold;
        }
      }
      .bottom {
        display: flex;
        & > div {
          flex: 1;
          text-align: center;
          .til {
            padding: 20px 0;
            color: var(--ex-passive-font-color);
          }
          .num {
            font-weight: 500;
          }
          &:first-child {
            text-align: start;
          }
          &:last-child {
            text-align: end;
          }
        }
      }
    }
  }
}
</style>
