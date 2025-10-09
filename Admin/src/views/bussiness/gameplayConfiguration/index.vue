<!--
 * @Autor: Aka
 * @Date: 2023-07-21 11:57:55
 * @Description: 
 * @LastEditTime: 2023-07-21 13:17:29
-->
<template>
  <div class="app-container">
    <SearchFormBox :title="$route.meta.title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="质押挖矿" name="first">
          <el-form
            ref="gameplayForm1"
            :rules="gameplayRules1"
            :model="gameplayForm1"
            label-width="100px"
          >
            <el-form-item label="结算类型" prop="settlementType">
              <el-select
                v-model="gameplayForm1.settlementType"
                placeholder="请选择结算类型类型"
                style="width: 200px"
              >
                <el-option label="每日" :value="1"></el-option>
                <el-option label="到期结算" :value="2"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitGameplayForm1('gameplayForm1')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="理财" name="second">
          <el-form
            ref="gameplayForm"
            :rules="gameplayRules"
            :model="gameplayForm"
            label-width="100px"
          >
            <el-form-item label="结算类型" prop="settlementType">
              <el-select
                v-model="gameplayForm.settlementType"
                placeholder="请选择结算类型类型"
                style="width: 200px"
              >
                <el-option label="指定天数" :value="1"></el-option>
                <el-option label="每日" :value="2"></el-option>
                <el-option label="产品到期结算" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="结算日期"
              prop="settlementDay"
              v-if="gameplayForm.settlementType == '1'"
            >
              <el-input
                v-model="gameplayForm.settlementDay"
                placeholder="请输入结算日期"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitGameplayForm('gameplayForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="defi挖矿" name="thired">
          <el-form
            ref="gameplayDefiForm"
            :rules="gameplayDefiRules"
            :model="gameplayDefiForm"
            label-width="100px"
          >
          <el-form-item label="总产出" prop="totalOutput">
            <el-input type="number" v-model="gameplayDefiForm.totalOutput" placeholder="请输入总产出" style="width: 400px"/>
          </el-form-item>
          <el-form-item label="用户收益" prop="userBenefits">
            <el-input type="number" v-model="gameplayDefiForm.userBenefits" placeholder="请输入用户收益" style="width: 400px"/>
          </el-form-item>
          <el-form-item label="参与者" prop="participant">
            <el-input type="number" v-model="gameplayDefiForm.participant" placeholder="请输入参与者" style="width: 400px"/>
          </el-form-item>
          <el-form-item label="有效节点" prop="validNode">
            <el-input type="number" v-model="gameplayDefiForm.validNode" placeholder="请输入有效节点" style="width: 400px"/>
          </el-form-item>
          <el-form-item>
              <el-button
                type="primary"
                @click="submitGameplayDefiForm('gameplayDefiForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </SearchFormBox>
  </div>
</template>
<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  components: {},
  data() {
    var limitDate = (rule, value, callback) => {
      if (value) {
        if (!/^([1-9]|[1-2][0-8])$/.test(value)) {
          return callback(new Error("只能输入1-28的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      activeName: "first",
      gameplayForm1: {
        settlementType: "",
        settlementDay: "",
      },
      gameplayRules1: {
        settlementType: [
          { required: true, message: "请选择结算类型", trigger: "change" },
        ],
      },
      gameplayForm: {
        settlementType: "",
        settlementDay: "",
      },
      gameplayRules: {
        settlementType: [
          { required: true, message: "请选择结算类型", trigger: "change" },
        ],
        settlementDay: [
          { required: true, message: "请输入结算日期", trigger: "change" },
          { validator: limitDate, trigger: "blur" },
        ],
      },
      gameplayDefiForm: {
        totalOutput: "",
        userBenefits: "",
        participant: "",
        validNode: "",
      },
      gameplayDefiRules: {
        totalOutput: [
          { required: true, message: "请输入总产出", trigger: "blur" },
        ],
        userBenefits: [
          { required: true, message: "请输入用户收益", trigger: "blur" },
        ],
        participant: [
          { required: true, message: "请输入参与者", trigger: "blur" },
        ],
        validNode: [
          { required: true, message: "请输入有效节点", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /**
     * 切换
     */
    handleClick() {
      if (this.activeName === "first") {
        this.getGameplay1();
      } else if (this.activeName === "second") {
        this.getGameplay();
      } else if (this.activeName === "thired") {
        this.getGameplayDefi();
      }
    },
    /**提现设置保存 */
    submitGameplayForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "MING_SETTLEMENT_SETTING",
              JSON.stringify(this.gameplayForm1)
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
    /** 获取玩法配置 */
    async getGameplay1() {
      try {
        const res = await getSettingConfig("MING_SETTLEMENT_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.gameplayForm1 = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /**提现设置保存 */
    submitGameplayForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.gameplayForm.settlementType != "1") {
            delete this.gameplayForm.settlementDay;
          }
          try {
            saveSettingConfig(
              "FINANCIAL_SETTLEMENT_SETTING",
              JSON.stringify(this.gameplayForm)
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
    /** 获取玩法配置 */
    async getGameplay() {
      try {
        const res = await getSettingConfig("FINANCIAL_SETTLEMENT_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.gameplayForm = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /**
     *
     */
     submitGameplayDefiForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "DEFI_INCOME_SETTING",
              JSON.stringify(this.gameplayDefiForm)
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
    /**
     * 获取defi挖矿玩法配置
     */
    async getGameplayDefi() {
      try {
        const res = await getSettingConfig("DEFI_INCOME_SETTING");
        if (res.code === 200) {
          const result = res.data;
          // this.gameplayForm = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
  },
  mounted() {
    this.getGameplay1();
  },
};
</script>
<style lang="scss" scoped></style>
