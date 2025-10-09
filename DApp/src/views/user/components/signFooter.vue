<template>
  <!-- 登录 -->
  <div class="box" v-if="props.type == 0">
    <div class="btnBox" @click="toLogin">
      <ButtonBar :btnValue="_t18('login')" />
    </div>
  </div>
</template>

<script setup>
import { REGISTER_REQUIRED_ACTIVECODE, REGISTER_REQUIRED_ACTIVECODE_MOBILE } from '@/config'
import { _getConfig, _t18 } from '@/utils/public'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { signUp, signIn, backPwdToEmail } from '@/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user/index'
import { useMainStore } from '@/store/index'
import { useToast } from '@/hook/useToast'
import { showToast } from 'vant'
const { _toast } = useToast()
const userStore = useUserStore()
const router = useRouter()
const props = defineProps({
  type: {
    type: Number
  },
  formDataToLogin: {
    type: Object
  },
  formDataToRegister: {
    type: Object
  },
  formDataToForget: {
    type: Object
  }
})
const emit = defineEmits(['refersh'])
const toCustorm = () => {
  // showToast('请联系客服')
  _toast('custorm_service', ['aams'])
}
const refersh = () => {
  // 刷新验证码
  emit('refersh')
}
const mainStore = useMainStore()
/**
 * 登录
 */
const toLogin = () => {
  let formData = {}
  formData.code = props.formDataToLogin.code //验证码
  if (props.formDataToLogin.type == 1) {
    // 账号登录
    formData.loginName = props.formDataToLogin.username //用户名
    formData.loginPassword = props.formDataToLogin.password // 密码
    formData.signType = 3
    if (formData.loginName == '') {
      _toast('please_user')
      return
    } else if (formData.loginPassword == '') {
      _toast('please_pwd')
      return
    }
  } else if (props.formDataToLogin.type == 2) {
    // 邮箱登录
    formData.email = props.formDataToLogin.email //邮箱
    formData.signType = 1
    if (formData.email == '') {
      _toast('please_email')
      return
    }
  } else if (props.formDataToLogin.type == 3) {
    // 手机登录
    formData.phone = props.formDataToLogin.areaCode + props.formDataToLogin.mobile //区号+手机号
    formData.signType = 2
    if (props.formDataToLogin.mobile == '') {
      //手机号
      _toast('please_mobile')
      return
    }
  }
  // 验证码
  if (props.formDataToLogin.type == 2 || props.formDataToLogin.type == 3) {
    if (formData.code == '') {
      // _toast('请填写验证码')
      // msg = 'please_code'
      _toast('please_code')
      return
    }
  } else {
    if (formData.code == '' && mainStore.getISCode) {
      // _toast('请填写验证码')
      // msg = 'please_code'
      _toast('please_code')
      return
    }
  }
  loginSubmit(formData)
  // if (!msg) {
  //   loginSubmit(formData)
  // } else {
  //   _toast(msg)
  // }
}
// 登录接口
const loginSubmit = (params) => {
  signIn(params)
    .then((res) => {
      if (res.code == '200' && res.data.satoken) {
        // _toast('登录成功！')
        _toast('login_success')
        let token = res.data.satoken
        userStore.setIsSign(true)
        userStore.setToken(token)
        setTimeout(() => {
          router.replace('/')
          userStore.getUserInfo()
        }, 500)
      } else {
        _toast(res.msg)
        if (props.formDataToLogin.type == 1) {
          refersh()
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * 注册
 */
const toResgister = () => {
  let formData = {}
  formData.loginPassword = props.formDataToRegister.password // 密码
  formData.activeCode = props.formDataToRegister.invitCode // 邀请码
  formData.code = props.formDataToRegister.code //验证码
  let msg = false
  // 普通注册
  if (props.formDataToRegister.type == 1) {
    formData.loginName = props.formDataToRegister.username //用户名
    formData.signType = 3
    if (formData.loginName == '') {
      //用户名
      _toast('please_user')
      return
    }
  } else if (props.formDataToRegister.type == 2) {
    formData.email = props.formDataToRegister.email //邮箱
    if (['aams'].includes(__config._APP_ENV)) {
      formData.phone = props.formDataToRegister.areaCode + props.formDataToRegister.mobile //区号+手机号
      if (props.formDataToRegister.mobile == '') {
        _toast('please_mobile')
        return
      }
    }
    // 邮箱注册
    formData.signType = 1
    if (formData.email == '') {
      _toast('please_email')
      return
    }
  } else if (props.formDataToRegister.type == 3) {
    // 手机注册
    formData.phone = props.formDataToRegister.areaCode + props.formDataToRegister.mobile //区号+手机号
    formData.signType = 2
    if (props.formDataToRegister.mobile == '') {
      _toast('please_mobile')
      return
    }
  }
  if (formData.loginPassword == '') {
    // msg = 'please_pwd'
    _toast('please_pwd')
    return
  } else if (props.formDataToRegister.password !== props.formDataToRegister.password2) {
    // msg = 'register_pwd_diff'
    _toast('register_pwd_diff')
    return
  } else if (REGISTER_REQUIRED_ACTIVECODE.includes(__config._APP_ENV) && formData.signType != 2) {
    // 邀请码必填
    if (formData.activeCode == '' || formData.activeCode == undefined) {
      // msg = 'plug_shareCode'
      _toast('plug_shareCode')
      return
    }
  } else if (
    REGISTER_REQUIRED_ACTIVECODE_MOBILE.includes(__config._APP_ENV) &&
    formData.signType == 2
  ) {
    // 邀请码必填
    if (formData.activeCode == '' || formData.activeCode == undefined) {
      // msg = 'plug_shareCode'
      _toast('plug_shareCode')
      return
    }
  }
  // 验证码
  if (props.formDataToRegister.type == 2 || props.formDataToRegister.type == 3) {
    if (formData.code == '') {
      // _toast('请填写验证码')
      // msg = 'please_code'
      _toast('please_code')
      return
    }
  } else {
    if (formData.code == '' && mainStore.getISCode) {
      // _toast('请填写验证码')
      // msg = 'please_code'
      _toast('please_code')
      return
    }
  }
  registerSubmit(formData)
  // if (!msg) {
  //   // 注册
  //   registerSubmit(formData)
  // } else {
  //   _toast(msg)
  // }
}
// 注册接口
const registerSubmit = (params) => {
  signUp(params)
    .then((res) => {
      // 刷新验证码
      if (res.code == '200') {
        // _toast('注册成功！')
        _toast('register_success')
        setTimeout(() => {
          router.push('/sign-in')
        }, 500)
      } else {
        _toast(res.msg)
        // 刷新验证码
        if (props.formDataToRegister.type == 1) {
          refersh()
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 忘记密码
const toForget = () => {
  let formData = {}
  formData.email = props.formDataToForget.email //邮箱
  formData.newPwd = props.formDataToForget.password //密码
  formData.emailCode = props.formDataToForget.code //验证码
  let msg = false
  if (formData.email == '') {
    // _toast('请填写邮箱')
    // msg = 'please_email'
    _toast('please_email')
    return
  } else if (formData.newPwd == '') {
    // _toast('请填写密码')
    // msg = 'please_pwd'
    _toast('please_pwd')
    return
  } else if (formData.emailCode == '') {
    // _toast('验证码')
    // msg = 'please_code'
    _toast('please_code')
    return
  } else if (props.formDataToForget.password !== props.formDataToForget.password2) {
    // _toast('两次密码不一致')
    // msg = 'register_pwd_diff'
    _toast('register_pwd_diff')
    return
  }
  forgerPasswordSubmit(formData)
  // if (!msg) {
  //   // 忘记密码
  //   forgerPasswordSubmit(formData)
  // } else {
  //   _toast(msg)
  // }
}
const forgerPasswordSubmit = (params) => {
  backPwdToEmail(params.email, params.newPwd, params.emailCode)
    .then((res) => {
      if (res.code == '200') {
        // _toast('重置成功！')
        _toast('reset_success')
        setTimeout(() => {
          router.push('/sign-in')
        }, 500)
      } else {
        _toast(res.msg)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.box {
  padding: 0 15px 50px;
  .btnBox {
    margin-top: 50px;
  }
  .account {
    padding: 50px 0 50px;
    font-size: 16px;
    text-align: center;
    span {
      font-size: 16px;
      color: var(--ex-font-color9);
      text-decoration: underline;
    }
  }
  .info {
    margin-top: 50px;
    text-align: center;
    span {
      color: var(--ex-font-color9);
      text-decoration: underline;
    }
  }
}
</style>
