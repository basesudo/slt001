<!-- 控输赢 -->

<template>
  <el-dialog
    title="密码设置"
    :visible.sync="visible"
    width="600px"
    append-to-body
    @close="cancel"
    
  >
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录密码" name="first">
        <el-form
          ref="loginPwdForm"
          :rules="fundPwdFormRules"
          :model="loginPwdForm"
          label-width="100px"
        >
          <el-form-item label="用户Id">
            <el-input
              v-model="user.userId"
              style="width: 400px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              v-model="loginPwdForm.loginPassword"
              style="width: 400px"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitPwd">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="资金密码" name="second">
        <el-form
          ref="fundPwdForm"
          :rules="fundPwdRules"
          :model="fundPwdForm"
          label-width="100px"
        >
          <el-form-item label="用户Id">
            <el-input
              v-model="user.userId"
              style="width: 400px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userTardPwd">
            <el-input
              v-model="fundPwdForm.userTardPwd"
              style="width: 400px"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitFund">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { resetPwd, resetFundPwd } from "@/api/bussiness/user.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      activeName: "first",
      loginPwdForm: {
        userId: "",
        loginPassword: "123456",
      },
      fundPwdFormRules: {
        loginPassword: [
          { required: true, message: "登录密码不能为空", trigger: "blur" },
        ],
      },
      fundPwdForm: {
        userId: "",
        userTardPwd: "123456",
      },
      fundPwdRules: {
        userTardPwd: [
          { required: true, message: "交易密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {},
    },
  },

  methods: {
    // 表单重置
    reset() {
      this.loginPwdForm = {
        userId: "",
        loginPassword: "",
      };
      this.fundPwdForm = {
        userId: "",
        userTardPwd: "",
      };
    },
    submitPwd() {
      this.loginPwdForm.userId = this.user.userId;
      let msg = "";
      if (!this.loginPwdForm.loginPassword) {
        msg = "请输入登录密码";
      }

      if (msg) {
        this.$message({
          message: msg,
          type: "error",
        });
      } else {
        resetPwd(this.loginPwdForm).then((res) => {
          if (res.code === 200) {
            this.cancel();
            this.$message({
              message: "保存成功",
              type: "success",
            });
          }
        });
      }
    },

    submitFund() {
      let msg = "";
      if (!this.fundPwdForm.userTardPwd) {
        msg = "请输入交易密码";
      }
      if (msg) {
        this.$message({
          message: msg,
          type: "error",
        });
      } else {
        this.fundPwdForm.userId = this.user.userId;
        resetFundPwd(this.fundPwdForm).then((res) => {
          if (res.code === 200) {
            this.cancel();
            this.$message({
              message: "保存成功",
              type: "success",
            });
          }
        });
      }
    },

    // 取消按钮
    cancel() {
      this.$emit("input", false);
      this.reset();
    },
  },
};
</script>
