<!-- 钱包登录 -->
<template>
  <Header :type="0"></Header>
  <div class="wallet-login">
    <div class="title">{{ _t18('login') }}</div>
    <div class="desc">{{ _t18('Please_access_wallet') }}</div>
    <div class="btnBox">
      <ButtonBar :btnValue="_t18('login')" @click="connectWallet" />
    </div>
    <div class="tip">{{ _t18('currently_application') }}</div>
  </div>
  <van-divider />
  <div class="wallet-types">
    <div class="sub">{{ _t18('Kind_tips') }}</div>
  </div>
  <van-divider />
  <div class="invite" v-if="invite_code">
    {{ _t18('plug_shareCode') }}: <span>{{ invite_code }}</span>
  </div>
  <van-divider />
  <div class="no-wallet">
    <router-link to="/no-wallet">{{ _t18('Please_access_wallet') }}</router-link>
  </div>
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  </template>

<script setup>
import Header from './components/signHeader.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { _t18 } from '@/utils/public'
import { useRoute } from 'vue-router'
import { getAcount } from '@/plugin/chain'
import { signUp } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import { dispatchCustomEvent } from '@/utils'
import { showToast } from 'vant'

const route = useRoute()
const invite_code = route.query.invite_code
const userStore = useUserStore()

const connectWallet = async () => {
  const acountRes = await getAcount()
  if (acountRes === 'no-wallet') {
    return showToast(_t18('Please_access_wallet'))
  }
  let params = {}
  if (invite_code) {
    params = {
      activeCode: invite_code,
      signType: 0,
      address: acountRes.data.address,
      walletType: acountRes.data.type
    }
  } else {
    params = { signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
  }
  try {
    const singUpRes = await signUp(params)
    if (singUpRes.code == 200 && singUpRes.data.satoken) {
      dispatchCustomEvent('event_toastChange', { name: 'login_success' })
      let token = singUpRes.data.satoken
      userStore.setIsSign(true)
      userStore.setToken(token)
      userStore.getUserInfo()
    } else {
      showToast(singUpRes.msg)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="scss" scoped>
.wallet-login {
  padding: 30px 15px 0;
  .title {
    font-size: 18px;
    color: var(--ex-default-font-color);
  }
  .desc {
    margin-top: 10px;
    color: var(--ex-font-color25);
  }
  .btnBox {
    margin-top: 30px;
  }
  .tip {
    margin-top: 10px;
    font-size: 12px;
    color: var(--ex-font-color26);
  }
}
.invite {
  padding: 0 15px;
  color: var(--ex-font-color);
}
.no-wallet {
  padding: 0 15px 30px;
}
</style>
