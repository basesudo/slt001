<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import SetForm from './components/change-password/SetForm.vue'
import EmailForm from './components/change-password/EmailForm.vue'
import AccountForm from './components/change-password/AccountForm.vue'
import {useUserStore} from '@/store/user'
import {storeToRefs} from 'pinia'
import {_t18} from '@/utils/public'
import {useToast} from '@/hook/useToast'

const {_toast} = useToast()
const userStore = useUserStore()
const {userInfo} = storeToRefs(userStore)

// 进入路由已请求  ---> 用户数据
// userStore.getUserInfo()
// ??
const notPwd = ref(false)
//修改登录密码的方式(true普通，false邮箱)
const updateLoginPwdMethod = ref(true)
//是否已有登录密码
const loginPassword = ref(userInfo.value.user?.loginPassword || '')
//导航数据
const cuttentRight = {iconRight: [{iconName: 'kefu', clickTo: 'event_serviceChange'}]}

const changeMethod = () => {

  // 是否绑定邮箱
  if (!userInfo.value.user?.email) {
    return _toast('please_bind_email')
  }

  updateLoginPwdMethod.value = !updateLoginPwdMethod.value

}
</script>

<template>
  <div>
    <!-- 导航条 -->
    <HeaderBar
        :currentName="notPwd ? _t18('sidebar_loginPwd',['bitmake']) : _t18('password_set')"
        :cuttentRight="cuttentRight"
        :border_bottom="true"
    ></HeaderBar>
    <!-- 添加登录密码 -->
    <SetForm v-if="!loginPassword && updateLoginPwdMethod"></SetForm>
    <!-- 修改登录密码 -->
    <AccountForm v-if="loginPassword && updateLoginPwdMethod"></AccountForm>
    <EmailForm v-if="loginPassword &&  !updateLoginPwdMethod"></EmailForm>
    <div class="box" v-if="loginPassword">
      <div class="set" @click="changeMethod" v-if="!updateLoginPwdMethod ">{{ _t18('password_update_pwd') }}</div>
      <div class="set" @click="changeMethod" v-else>{{ _t18('password_update_email') }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  padding: 0 15px;

  .set {
    margin-top: 20px;
    text-align: left;
    font-size: 14px;
    color: var(--ex-font-color9);
  }
}
</style>
