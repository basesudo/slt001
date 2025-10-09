<template>
  <div>
    <div class="formData">
      <!-- 账号 -->
      <p>{{ _t18('account', ['bitmake']) }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData1.username" />
      </div>
    </div>
    <div class="formData">
      <!-- 密码 -->
      <p>{{ _t18('login_pwd') }}</p>
      <div>
        <input
          :type="showk ? 'text' : 'password'"
          :placeholder="_t18('login_please')"
          v-model="formData1.password"
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
          v-model="formData1.password2"
          @input="inputPass"
        /><svg-load
          :name="requireShowk ? 'yanjin-k' : 'yanjin-g'"
          @click="requireShowk = !requireShowk"
        ></svg-load>
      </div>
    </div>
    <p class="requirePass" v-if="requirePass">*{{ _t18('register_pwd_diff') }}</p>
    <div class="formData">
      <!-- 邀请码 选填-->
      <p>
        {{ _t18('register_invitation') }}
        <!-- <i v-if="REGISTER_REQUIRED_ACTIVECODE.includes(platform_setting)">({{ _t18('required')}})</i> -->
        <i v-if="REGISTER_REQUIRED_ACTIVECODE.includes(_getConfig('_APP_ENV'))"
          >({{ _t18('required') }})</i
        >
        <i v-else
          >({{
            _t18(['tokencan'].includes(_getConfig('_APP_ENV')) ? 'register_optional' : 'optional')
          }})</i
        >
      </p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData1.invitCode" />
      </div>
    </div>
    <div class="formData" v-if="mainStore.getISCode">
      <!-- 验证码 -->
      <p>{{ _t18('login_code') }}</p>
      <div>
        <input type="text" :placeholder="_t18('login_please')" v-model="formData1.code" /><span
          @click="refreshCode"
        >
          <img :src="codeUrl" />
        </span>
      </div>
    </div>

    <Footer :type="1" :formDataToRegister="formData1" @refersh="refreshCode"></Footer>
  </div>
</template>

<script setup>
import Footer from './../signFooter.vue'
import { _t18 } from '@/utils/public'
import { REGISTER_REQUIRED_ACTIVECODE } from '@/config'
import { useMainStore } from '@/store/index.js'
import { useRoute } from 'vue-router'
const route = useRoute()
const mainStore = useMainStore()
/**
 * 表单数据
 */
const formData1 = ref({
  type: 1, //自定义注册类型：1普通2邮箱3手机
  username: '', //用户名/邮箱/手机号
  password: '', //密码
  password2: '', //二次密码
  invitCode: route.query.invite_code, //邀请码
  code: '' //验证码
})
/**
 * 图形验证码
 */
// 时间戳
const timestamp = ref(+new Date())
// 图形验证码地址
const codeUrl = computed(
  () => `${mainStore.verificationCodeUrl}?codeType=REGISTER&timestamp=${timestamp.value}`
)
// 刷新验证码
const refreshCode = () => {
  timestamp.value = +new Date()
}
const requirePass = ref(false)
const inputPass = () => {
  requirePass.value = formData1.value.password2 !== formData1.value.password ? true : false
}
// 眼睛
const showk = ref(false)
const requireShowk = ref(false)
import './../style.scss'
</script>

<style lang="scss" scoped></style>
