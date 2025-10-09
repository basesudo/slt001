<template>
  <div>
    <!-- 邮箱 验证码 发送 -->
    <div class="formData">
      <p>{{ _t18('login_emailCode') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_emailCode')" v-model="formData2.email" />
      </div>
    </div>
    <div class="formData">
      <p>{{ _t18('login_code') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData2.code" />
        <p v-if="!flag" @click="send()">{{ _t18('login_send') }}</p>
        <p v-else><van-count-down :time="time" format="ss" @finish="finish" /></p>
      </div>
    </div>
    <p class="forgotPwd"></p>
    <Footer :type="0" :formDataToLogin="formData2"></Footer>
  </div>
</template>

<script setup>
import Footer from './../signFooter.vue'
import { _t18 } from '@/utils/public'
import { emailCode } from '@/api/user'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
/**
 * 表单数据
 */
const props = defineProps({
  formData: {
    type: Object
  }
})
const emit = defineEmits(['changeForm'])
const formData2 = ref({
  type: 2, //自定义注册类型：1普通2邮箱3手机
  email: '',
  password: '', //密码
  code: '', //验证码
})
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
  emailCode('LOGIN', formData2.value.email).then((res) => {
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

import './../style.scss'
</script>

<style lang="scss" scoped></style>
