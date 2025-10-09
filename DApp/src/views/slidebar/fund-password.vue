<script setup>
import Success from './components/success.vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import SetForm from './components/fund-password/SetForm.vue'
import ChangeForm from './components/fund-password/ChangeForm.vue'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const userStore = useUserStore()
userStore.getUserInfo()
// 用户信息
const { userInfo } = storeToRefs(userStore)
const cuttentRight = { iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }] }
// 用户是否设置过资金密码(userInfo.detail?.userTardPwd)

// const notPwd = ref(true)
const notPwd = ref(userInfo.value.detail?.userTardPwd)
const success = ref(true)
const changePwd = () => {
  notPwd.value = true
  success.value = false
  userStore.getUserInfo()
}
const setPwd = (v) => {
  success.value = v
  notPwd.value = v
  userStore.getUserInfo()
}
const toCustorm = () => {
  // showToast('请联系客服')
  _toast('custorm_service')
}
</script>
<template>
  <div>
    <!-- 导航条 -->
    <HeaderBar
      :currentName="notPwd ? _t18('Change_security_password') : _t18('sidebar_tardPwd',['bitmake'])"
      :cuttentRight="cuttentRight"
      :border_bottom="true"
    ></HeaderBar>

    <!-- 没有设置资金密码 -->
    <SetForm v-if="!notPwd && success" @setPwd="setPwd"></SetForm>
    <ChangeForm v-if="notPwd && !success" @setPwd="setPwd"></ChangeForm>
    <Success
      :text="_t18('Fund_password_has_set')"
      :imgUrl="'defi/fund.png'"
      v-if="notPwd && success"
      class="success"
    >
      <template #btn>
        <div class="btnBox" @click="changePwd">
          <ButtonBar :btnValue="_t18('Change_security_password')" />
        </div>
        <div class="forgot" @click="toCustorm">{{_t18('forgot_security_code')}}?</div>
      </template>
    </Success>
  </div>
</template>
<style lang="scss" scoped>
.success {
  padding: 0 15px;
  :deep(img) {
    margin: 140px 0 0 0;
  }
  :deep(.text) {
    font-size: 14px;
    margin: 30px 0 60px 0;
    color: var(--ex-font-color18);
  }
  .btnBox {
    width: 100%;
    font-size: 14px;
  }
  .forgot {
    margin-top: 30px;
    text-align: center;
    font-size: 14px;
    color: var(--ex-font-color9);
  }
}
</style>
