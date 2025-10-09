<template>
  <div>
    <div class="formData">
      <!-- 邮箱 -->
      <p>{{ _t18('login_emailCode') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_emailCode')" v-model="formData2.email" />
      </div>
    </div>
    <div v-if="['aams'].includes(_getConfig('_APP_ENV'))" class="formData">
      <!-- 手机号 -->
      <p>{{ _t18('login_mobileCode') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_mobileCode')" v-model="formData2.mobile" />
        <div class="right" @click="shouAreaCode">
          <i>+</i>
          <p>{{ formData2.areaCode }}</p>
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
          v-model="formData2.password"
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
          v-model="formData2.password2"
          @input="inputPass"
        /><svg-load
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
        <i v-if="REGISTER_REQUIRED_ACTIVECODE.includes(_getConfig('_APP_ENV'))"
          >({{ _t18('required') }})</i
        >
        <i v-else>({{ _t18('optional') }})</i>
      </p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData2.invitCode" />
      </div>
    </div>
    <div class="formData">
      <!-- 验证码 -->
      <p>{{ _t18('login_code') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData2.code" />
        <p v-if="!flag" @click="send()">{{ _t18('login_send') }}</p>
        <p v-else><van-count-down :time="time" format="ss" @finish="finish" /></p>
      </div>
    </div>

    <Footer :type="1" :formDataToRegister="formData2" @refersh="refreshCode"></Footer>
    <AreaCode :show="show" @handelClick="close" @handelSelect="select"></AreaCode>
  </div>
</template>

<script setup>
import Footer from './../signFooter.vue'
import { _t18 } from '@/utils/public'
import { emailCode } from '@/api/user'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'
import AreaCode from './../areaCode.vue'
import { REGISTER_REQUIRED_ACTIVECODE } from '@/config'
const { _toast } = useToast()
import { useRoute } from 'vue-router'
const route = useRoute()
/**
 * 表单数据
 */
const formData2 = ref({
  type: 2, //自定义注册类型：1普通2邮箱3手机
  email: '',
  password: '', //密码
  password2: '', //二次密码
  invitCode: route.query.invite_code, //邀请码
  code: '', //验证码
  mobile: '', // 手机号
  areaCode: '93' //区号
})
const requirePass = ref(false)
const inputPass = () => {
  requirePass.value = formData2.value.password2 !== formData2.value.password ? true : false
}
// 眼睛
const showk = ref(false)
const requireShowk = ref(false)
/**
 * 倒计时
 */

// 倒计时
const time = ref(0)
const flag = ref(false)
const send = () => {
  // 邮箱发送验证码
  if (formData2.value.email == '') {
    _toast(`login_please_emailCode`)

    return
  }
  emailCode('REGISTER', formData2.value.email).then((res) => {
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
const refreshCode = () => {}

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
  formData2.value.areaCode = val
}
import './../style.scss'
</script>

<style lang="scss" scoped></style>
