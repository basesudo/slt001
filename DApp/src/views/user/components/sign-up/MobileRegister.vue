<template>
  <div>
    <div class="formData">
      <!-- 手机号 -->
      <p>{{ _t18('login_mobileCode') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_mobileCode')" v-model="formData3.mobile" />
        <div class="right" @click="shouAreaCode">
          <i>+</i>
          <p>{{ formData3.areaCode }}</p>
          <svg-load name="jiantou10x5-x" class="jiantou"></svg-load>
        </div>
      </div>
    </div>
    <div class="formData">
      <!-- 密码 -->
      <p>{{ _t18('login_pwd') }}</p>
      <div>
        <input
          :type="showk ? 'text' : 'password'"
          :placeholder="_t18('login_please')"
          v-model="formData3.password"
        />
        <svg-load :name="showk ? 'yanjin-k' : 'yanjin-g'" @click="showk = !showk"></svg-load>
      </div>
    </div>
    <div class="formData">
      <!-- 确认密码 -->
      <p>{{ _t18('register_pwd_require') }}</p>
      <div>
        <input
          :type="requireShowk ? 'text' : 'password'"
          :placeholder="_t18('login_please')"
          v-model="formData3.password2"
          @input="inputPass"
        />
        <svg-load
          :name="requireShowk ? 'yanjin-k' : 'yanjin-g'"
          @click="requireShowk = !requireShowk"
        ></svg-load>
      </div>
    </div>
    <p class="requirePass" v-if="requirePass">*{{ _t18('register_pwd_diff') }}</p>
    <div class="formData">
      <!-- 邀请码 选填 -->
      <p>
        {{ _t18('register_invitation') }}
        <i v-if="REGISTER_REQUIRED_ACTIVECODE_MOBILE.includes(_getConfig('_APP_ENV'))"
          >({{ _t18('required') }})</i
        >
        <i v-else>({{ _t18('optional') }})</i>
      </p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData3.invitCode" />
      </div>
    </div>
    <div class="formData">
      <!-- 验证码 -->
      <p>{{ _t18('login_code') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData3.code" />
        <p v-if="!flag" @click="send()">{{ _t18('login_send') }}</p>
        <p v-else><van-count-down :time="time" format="ss" @finish="finish" /></p>
      </div>
    </div>

    <Footer :type="1" :formDataToRegister="formData3" @refersh="refreshCode"></Footer>
    <AreaCode :show="show" @handelClick="close" @handelSelect="select"></AreaCode>
  </div>
</template>

<script setup>
import Footer from './../signFooter.vue'
import { REGISTER_REQUIRED_ACTIVECODE_MOBILE } from '@/config'
import { _t18 } from '@/utils/public'
import { mobileCode } from '@/api/user'
import AreaCode from './../areaCode.vue'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { useRoute } from 'vue-router'
const route = useRoute()
/**
 * 表单数据
 */
const formData3 = ref({
  type: 3, //自定义注册类型：1普通2邮箱3手机
  mobile: '',
  password: '', //密码
  password2: '', //二次密码
  invitCode: route.query.invite_code, //邀请码
  code: '', //验证码
  areaCode: '93' //区号
})
if (['bitbyex'].includes(__config._APP_ENV)) {
  formData3.value.areaCode = '1'
}
const requirePass = ref(false)
const inputPass = () => {
  requirePass.value = formData3.value.password2 !== formData3.value.password ? true : false
}
// 眼睛
const showk = ref(false)
const requireShowk = ref(false)
// 发送||倒计时
const show = ref(false)
// 选择区号面板
const shouAreaCode = () => {
  show.value = true
}
// 关闭区号面板
const close = () => {
  show.value = false
}
// 选择区号
const select = (val) => {
  formData3.value.areaCode = val
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
  mobileCode('REGISTER', formData3.value.areaCode + formData3.value.mobile).then((res) => {
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
