<!--
 * @Autor: Aka
 * @Date: 2023-07-14 14:56:12
 * @Description: 
 * @LastEditTime: 2023-07-17 17:16:08
-->
<template>
  <div class="app-container">
    <SearchFormBox :title="$route.meta.title">
      <el-form
        ref="loanForm"
        :rules="loanRules"
        :model="loanForm"
        label-width="110px"
      >
        <el-form-item label="贷款逾期利率" prop="overdueRate">
          <el-input
            v-model="loanForm.overdueRate"
            style="width: 400px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loanForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </SearchFormBox>
  </div>
</template>
<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  components: {},
  data() {
    var checkRechargeMax = (rule, value, callback) => {
      if (value) {
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(value) ||
          Number(value) === 0
        ) {
          return callback(new Error("请输入最多保留6位小数的大于0的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      loanForm: {
        overdueRate: "",
      },
      loanRules: {
        overdueRate: [
          { required: true, message: "请输入贷款逾期利率", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkRechargeMax, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 获取贷款逾期列表 */
    async getLoan() {
      try {
        const res = await getSettingConfig("LOAD_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.loanForm.overdueRate = result.overdueRate;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 贷款逾期保存 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "LOAD_SETTING",
              JSON.stringify(this.loanForm)
            ).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
              }
            });
          } catch (error) {}
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.getLoan();
  },
};
</script>
<style lang="scss" scoped></style>
