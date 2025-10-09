<!-- 邮箱修改密码 -->
<script setup>
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { emailCode, updatePwdByEmail } from '@/api/user'
import { ref } from 'vue'
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
const newPwd = ref(false)
const NPwd = ref(false)
const form = ref({
  email: userInfo.value.user?.email,
  code: '',
  newPwd: '',
  NPwd: ''
})
const setKeyVal = (val) => {
  if (val == 'newPwd') {
    newPwd.value = !newPwd.value
  } else {
    NPwd.value = !NPwd.value
  }
}
const showPwdDiff = ref(false)
const pwdDiff = () => {
  showPwdDiff.value = !(form.value.newPwd == form.value.NPwd)
}
/**
 * 倒计时
 */

// 倒计时
const time = ref(0)
const flag = ref(false)
const send = () => {
  // 邮箱发送验证码
  if (form.value.email == '') {
    // showToast('请补充邮箱地址')
    _toast('login_please_emailCode')
    return
  }
  emailCode('UPD_PASSWORD', form.value.email).then((res) => {
    if (res.code == '200') {
      flag.value = true
      time.value = 60 * 1000
    } else {
      showToast(res.msg)
    }
  })
}
// 倒计时结束
const finish = () => {
  flag.value = false
}
const submit = () => {
  if (form.value.code == '') {
    // showToast('验证码')
    _toast('verification_code')
    return
  }
  if (form.value.newPwd == '') {
    // showToast('请补充新密码')
    _toast('Fund_password_pleaseNew')
    return
  }
  if (form.value.newPwd != form.value.NPwd) {
    // showToast('两次密码不一致')
    _toast('register_pwd_diff')
    return
  }
  updatePwdByEmail(form.value.email, form.value.newPwd, form.value.code)
    .then((res) => {
      if (res.code == '200') {
        // showToast('修改成功！')
        _toast('Bank_update_success')
        setTimeout(() => {
          router.push('/homeSidebar')
        }, 500)
      } else {
        showToast(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
<template>
  <div class="content">
    <div class="tip">{{ _t18('login_emailCode') }}</div>
    <div class="input disabled">
      <svg-load name="youxiang-x" class="icon"></svg-load>
      <input type="text" disabled v-model="form.email" />
    </div>
    <div class="tip">{{ _t18('verification_code') }}</div>
    <div class="input">
      <svg-load name="yanzhengma" class="icon"></svg-load>
      <input type="text" v-model="form.code" />
      <div class="code-box">
        <div class="wait-code" v-if="flag">
          <van-count-down :time="time" format="ss" @finish="finish" />
        </div>
        <div class="send-code" v-else @click="send">{{ _t18('login_send') }}</div>
      </div>
    </div>
    <div class="tip">{{ _t18('forgot_newPwd') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon"></svg-load>
      <input :type="newPwd ? 'text' : 'password'" v-model="form.newPwd" />
      <svg-load
        :name="newPwd ? 'openeyes' : 'closeeyse'"
        class="icon"
        @click="setKeyVal('newPwd')"
      ></svg-load>
    </div>
    <div class="tip">{{ _t18('forgot_require_newPwd') }}</div>
    <div class="input">
      <svg-load name="mima" class="icon"></svg-load>
      <input :type="NPwd ? 'text' : 'password'" v-model="form.NPwd" @input="pwdDiff" />
      <svg-load
        :name="NPwd ? 'openeyes' : 'closeeyse'"
        class="icon"
        @click="setKeyVal('NPwd')"
      ></svg-load>
    </div>
    <p class="pwdDiff" v-if="showPwdDiff">*{{ _t18('register_pwd_diff') }}</p>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="_t18('btnConfirm',['bitmake'])" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;
  .tip {
    font-size: 14px;
    color: var(--ex-font-color16);
    margin-bottom: 10px;
    text-align: left;
  }
  
  .input {
    padding: 0 15px;
    width: 100%;
    height: 50px;
    background: var(--ex-default-background-color);
    border-radius: 3px;
    border: 1px solid var(--ex-border-color1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      font-size: 14px;
      color: var(--ex-default-font-color);
    }

    .code-box {
      min-width: 44px;
      height: 30px;
      background: var(--ex-div-bgColor1);
      border-radius: 2px 2px 2px 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--ex-font-color);
    }
    .send-code{
      font-size: 14px;
    }
  }
  .disabled{
    background: #efefef;
  }
  .icon {
    font-size: 16px;
  }

  .btnBox {
    margin-top: 50px;
  }
  .pwdDiff {
    color: var(--ex-font-color14);
  }
}
:deep(.van-count-down) {
  font-size: 14px;
  color: var(--ex-font-color);
  padding: 0;
}
</style>
