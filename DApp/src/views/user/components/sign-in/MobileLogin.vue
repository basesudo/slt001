<template>
  <div>
    <!-- 手机号 验证码 发送 -->
    <div class="formData">
      <p>{{ _t18('login_mobileCode') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_mobileCode')" v-model="formData3.mobile" />
        <div class="right">
          <i>+</i>
          <p>{{ formData3.areaCode }}</p>
          <svg-load name="jiantou10x5-x" class="jiantou" @click="showAreaCode"></svg-load>
        </div>
      </div>
    </div>
    <div class="formData">
      <p>{{ _t18('login_code') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData3.code" />
        <p v-if="!flag" @click="send()">{{ _t18('login_send') }}</p>
        <p v-else><van-count-down :time="time" format="ss" @finish="finish" /></p>
      </div>
    </div>
    <p class="forgotPwd"></p>
    <Footer :type="0" :formDataToLogin="formData3" @refersh="refreshCode"></Footer>
    <AreaCode :show="show" @handelClick="close" @handelSelect="select"></AreaCode>
  </div>
</template>

<script setup>
import Footer from './../signFooter.vue'
import { mobileCode } from '@/api/user'
import AreaCode from './../areaCode.vue'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { _t18 } from '@/utils/public'
/**
 * 表单数据
 */
const formData3 = ref({
  type: 3, //自定义注册类型：1普通2邮箱3手机
  mobile: '',
  password: '', //密码
  code: '', //验证码
  areaCode: '93' //区号
})
if (['bitbyex'].includes(__config._APP_ENV)) {
  formData3.value.areaCode = '1'
}

// 发送||倒计时
const show = ref(false)
// 选择区号面板
const showAreaCode = () => {
  show.value = true
}
// 关闭区号面板
const close = () => {
  show.value = false
}
// 选择区号
const select = (v) => {
  formData3.value.areaCode = v
}
/**
 * 倒计时
 */

// 倒计时
const time = ref(0)
const flag = ref(false)
const send = () => {
  // 手机发送验证码
  if (formData3.value.mobile == '') {
    _toast(`login_please_mobileCode`)
    return
  }
  mobileCode('LOGIN', formData3.value.areaCode + formData3.value.mobile).then((res) => {
    if (res.code == '200') {
      flag.value = true
      time.value = 60 * 1000
    }
  })
}
// 倒计时结束
const finish = () => {
  flag.value = false
}
const refreshCode = () => {}
import './../style.scss'
</script>

<style lang="scss" scoped></style>
