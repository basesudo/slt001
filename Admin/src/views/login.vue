<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <div class="title">后台管理系统</div><br>
      <div class="form-row">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <img
              slot="prefix"
              src="@/assets/images/login/username.png"
              class="icon-img"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <img
              slot="prefix"
              src="@/assets/images/login/password.png"
              class="icon-img"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="authCode">
          <el-input
            v-model="loginForm.authCode"
            type="password"
            auto-complete="off"
            placeholder="谷歌验证码"
            @keyup.enter.native="handleLogin"
          >
            <img
              slot="prefix"
              src="@/assets/images/login/password.png"
              class="icon-img"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaEnabled && adminCode">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            @keyup.enter.native="handleLogin"
          >
            <img
              slot="prefix"
              src="@/assets/images/login/code.png"
              class="icon-img"
            />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" />
          </div>
        </el-form-item>
        <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px"
          >记住密码</el-checkbox
        >
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            class="btn"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <!-- <div style="float: right" v-if="register">
            <router-link class="link-type" :to="'/register'"
              >立即注册</router-link
            >
          </div> -->
        </el-form-item>
      </div>
    </el-form>
    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>
        Copyright © 2018-{{ new Date().getFullYear() }} echo All Rights
        Reserved.
      </span>
    </div> -->
  </div>
</template>

<script>
import { getCodeImg, getAllSetting } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";


export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        authCode: "",
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
      adminCode: true,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
    adminCode: {
      handler(val) {
        if (val) {
          // this.getAllSetting();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getAllSetting();
    this.getCode();
    this.getCookie();
  },
  methods: {
    getAllSetting() {
      getAllSetting().then((res) => {
        let temObj = res.data?.MARKET_URL;
        console.log(temObj, "temObjtemObjtemObjtemObjtemObj");
        this.adminCode = temObj?.adminCode;
      });
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        authCode: this.loginForm?.authCode || "",
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
            // Cookies.set("rememberMe", this.loginForm.authCode, {
            //   expires: 30,
            // });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
            Cookies.remove("authCode");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$store.dispatch("getNotice");
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
              if (this.code == 500) {
                this.getCode();
                this.loginForm.code = "";
              }
              // 发送数据
              // var sendData = {
              //   operate: "singleChannelSwitch",
              //   index: index + 1,
              //   opera: row.button_relay,
              // };
              // sendSock(JSON.stringify(sendData));
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaEnabled) {
                this.getCode();
                this.loginForm.code = "";
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-size: cover;

  .title {
    display: flex;
    align-items: center;  
    justify-content: center;
    height: 120px;
    text-align: center;
    color: #46c71f;
    font-weight: bold;
    font-size: 28px;
    border-bottom: 1px solid #ececec;
  }
 
  .h2{
    display: flex;
    align-items: center;  
    justify-content: center;
    height: 30px;
    text-align: center;
    color: #df2d27;
    font-weight: bold;
    font-size: 15px;
    background-color: #ececec;
  }

  .login-form {
    background: #ffffff;
    width: 480px;
    border-radius: 4px;
    .form-row {
      padding: 30px 30px 15px;

      .el-input {
        height: 50px;
        font-size: 14px;
        input {
          padding-left: 50px;
          height: 50px;
        }
        .el-input__prefix {
          display: flex;
          align-items: center;
          padding-left: 5px;

          .icon-img {
            width: 30px;
            object-fit: contain;
          }
        }
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }
      .btn {
        margin-top: 15px;
        width: 100%;
        height: 50px;
      }
    }

    .login-tip {
      font-size: 14px;
      text-align: center;
      color: #bfbfbf;
    }

    .login-code {
      min-width: 140px;
      margin-left: 15px;
      height: 50px;
      float: right;
      img {
        width: 100%;
        object-fit: contain;
        cursor: pointer;
        vertical-align: middle;
      }
    }
    .el-login-footer {
      height: 40px;
      line-height: 40px;
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      color: #fff;
      font-family: Arial;
      font-size: 12px;
      letter-spacing: 1px;
    }
    .login-code-img {
      height: 50px;
    }
    .el-checkbox {
      .el-checkbox__inner {
        width: 14px;
        height: 14px;
      }
      .el-checkbox__label {
        font-size: 14px;
      }
    }

    .el-form-item {
      font-size: 14px;
      width: 100%;
      margin-bottom: 30px;
      .el-form-item__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
