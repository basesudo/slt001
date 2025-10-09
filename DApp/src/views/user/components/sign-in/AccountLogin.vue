<template>
  <div>
    <!-- 账号 密码 验证码 -->
    <div class="formData">
      <p>{{ _t18('account', ['bitmake', 'aams']) }}</p>
      <div>
        <input
          type="text"
          :placeholder="_t18('login_name', ['bitmake'])"
          v-model="formData1.username"
        />
      </div>
    </div>
    <div class="formData">
      <p>{{ _t18('login_pwd') }}</p>
      <div>
        <input
          :type="showk ? 'text' : 'password'"
          :placeholder="_t18('login_please')"
          v-model="formData1.password"
        /><svg-load :name="showk ? 'yanjin-k' : 'yanjin-g'" @click="showk = !showk"></svg-load>
      </div>
    </div>
    <div class="formData" v-if="mainStore.getISCode">
      <p>{{ _t18('login_code') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData1.code" /><span
          @click="refreshCode"
        >
          <img :src="codeUrl" />
        </span>
      </div>
    </div>

    <p class="forgotPwd"></p>
    <Footer :type="0" :formDataToLogin="formData1" @refersh="refreshCode"></Footer>
  </div>
</template>

<script setup>
import Footer from './../signFooter.vue'
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index.js'
const mainStore = useMainStore()
const formData1 = ref({
  type: 1, //自定义注册类型：1普通2邮箱3手机
  username: '', //用户名/邮箱/手机号
  password: '', //密码
  code: '' //验证码
})
// ***************刷新验证码**************
// 时间戳
const timestamp = ref(+new Date())
// 图形验证码地址
const codeUrl = computed(
  () => `${mainStore.verificationCodeUrl}?codeType=LOGIN&timestamp=${timestamp.value}`
)

// 刷新验证码
const refreshCode = () => {
  timestamp.value = +new Date()
}
// 眼睛
const showk = ref(false)

import './../style.scss'
</script>

<style lang="scss" scoped></style>
