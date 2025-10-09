<template>
  <div class="userMess" v-if="userId">
    <!-- vip等级 -->
    <div class="messLeft" v-if="showVip" @click="$router.push('/vip-rule')">
      <image-load filePath="defi/组 249.png" class="userMessImg"></image-load>
      <p class="fw-num">v{{ vipClass }}</p>
    </div>
    <img src="/resource/images/light/avatar.png" alt="avatar" class="userMessImg" v-else />
    <div class="messRight">
      <Copy :data="userId">
        <template #copyMsg>
          <div class="rightTop fw-bold">UID：{{ userId }}</div>
        </template>
      </Copy>
      <!-- 信用分 -->
      <div class="rightBot">
        {{ _t18('credit_score') }}：{{ userStore.userInfo.detail?.credits }}
      </div>
    </div>
  </div>
  <!-- 钱包地址 -->
  <div class="copyName" v-if="address">
    <Copy :data="address">
      <template #copyMsg>
        <p>{{ _hideAddress(address) }}</p>
      </template>
    </Copy>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import Copy from '@/components/common/Copy/index.vue'
import { useUserStore } from '@/store/user/index'
import { useMainStore } from '@/store/index'
import { computed } from 'vue'
import { _hideAddress } from '@/utils/public'
// const vipClass = ref(0) //vip等级
const userStore = useUserStore()
const mainStore = useMainStore()
const userId = computed(() => userStore.userInfo.user?.userId)
const address = computed(() => userStore.userInfo.user?.address)
const userAccount = computed(() => {
  let temp = userStore.userInfo.asset?.filter((item) => {
    return item.symbol == 'usdt' && item.type == 1
  })
  return temp[0]?.availableAmount || 0
})
const showVip = ref(mainStore.getVIPClass?.isOpen)
const vipClass = computed(() => {
  let temp = 0
  let start = ''
  let end = ''
  for (let key in mainStore.getVIPClass) {
    if (userAccount.value > mainStore.getVIPClass[key]) {
      start = key
    }
    if (userAccount.value <= mainStore.getVIPClass[key]) {
      end = key
      break
    }
  }
  if (start.replace('Start', '') === end.replace('End', '')) {
    temp = start.replace('Start', '').replace('vip', '')
  }
  return temp
})
</script>
<style lang="scss" scoped>
.userMess {
  padding: 20px 15px;
  display: flex;
  align-items: center;
  .userMessImg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .messRight {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;
    .rightTop {
      font-size: 16px;
      color: var(--ex-default-font-color);
    }
    .rightBot {
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
  }
}
.copyName {
  margin: 0 15px;
  background-color: var(--ex-home-sidebar-address-bgcolor);
  font-size: 14px;
  border-radius: 3px;
  padding: 5px 10px;
  color: var(--ex-home-sidebar-address-ftcolor) !important;
}

.vipClass {
  font-size: 14px;
  color: var(--ex-passive-font-color);
  .senLeftImg {
    font-size: 20px;
    // margin-left: 15px;
    // margin-right: 10px;
  }
}
.messLeft {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #333;
  }
}
</style>
