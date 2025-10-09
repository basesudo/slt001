<template>
  <div class="content">
    <!-- 币种列表 -->
    <p>{{ _t18('coinList') }}</p>
    <div class="list">
      <div class="listCoin" v-for="(item, index) in data" :key="index" @click="toClick(item)">
        <div class="left">
          <svg-load :name="item.icon" class="coin"></svg-load>
          <span>{{ item.title }}</span>
        </div>
        <div class="right"><svg-load name="jiantou" class="jiantou"></svg-load></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const router = useRouter()
const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})
const flag = ref(true)
const toClick = (item) => {
  if (item.type == 1) {
    // 货币提现
    if (['paxpay'].includes(__config._APP_ENV)) {
      flag.value = false
      needPrimary(item)
    } else {
      flag.value = true
    }
    if (flag.value) {
      // fee手续费，ratio手续费率
      let params=``
      if(item.fee&&item.fee>0){
        params=`type=${item.card || item.title}&icon=${item.icon}&ratio=${item.ratio}&fee=${item.fee}`
      }else{
        params=`type=${item.card || item.title}&icon=${item.icon}&ratio=${item.ratio}`
      }
      setTimeout(() => {
        router.push(
          `/withdraw-apply?${params}`
        )
      }, 200)
    }
  } else if (item.type == 2) {
    // 银行卡提现
    if (['paxpay'].includes(__config._APP_ENV)) {
      needPrimary(item)
    } else {
      flag.value = true
    }
    if (flag.value) {
      router.push(`/withdraw-apply?type=银行卡&icon=${item.icon}`)
    }
  }
}
// 特殊平台，提现需要初级认证（初级）
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
userStore.getUserInfo()
const { userInfo } = storeToRefs(userStore)
const primaryAuth = ref(userInfo.value.detail?.auditStatusPrimary)
const needPrimary = (item) => {
  // console.log(primaryAuth.value)
  if (primaryAuth.value !== '1') {
    _toast('please_primary')
    setTimeout(() => {
      router.push('/certification-primary')
    }, 800)
  } else {
    flag.value = true
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.content {
  padding: 30px 15px 0;
  p {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: left;
  }
  .list {
    .listCoin {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left,
      .right {
        display: flex;
        align-items: center;
        .coin {
          font-size: 20px;
          margin-right: 15px;
        }
        .jiantou {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
