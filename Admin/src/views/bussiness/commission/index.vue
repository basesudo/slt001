<template>
  <div class="app-container">
    <SearchFormBox :title="$route.meta.title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="充值返佣" name="first">
          <el-form
            ref="rechargeForm1"
            :rules="rechargeRules1"
            :model="rechargeForm1"
            label-width="100px"
          >
            <el-form-item label="充值返点比例" prop="ratio">
              <el-input
                v-model="rechargeForm1.ratio"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="充值返点最大值" prop="rebateMaxAmount">
              <el-input
                v-model="rechargeForm1.rebateMaxAmount"
                style="width: 400px"
              ></el-input>
            </el-form-item>

            <el-form-item label="开关" prop="isOpen">
              <el-radio-group v-model="rechargeForm1.isOpen">
                <el-radio :label="true">开</el-radio>
                <el-radio :label="false">关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitRecharge1('rechargeForm1')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="理财返佣" name="second">
          <el-form
            ref="rechargeForm2"
            :rules="rechargeRules2"
            :model="rechargeForm2"
            label-width="100px"
          >
            <el-form-item label="一级返点比例" prop="oneRatio">
              <el-input
                v-model="rechargeForm2.oneRatio"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="二级返点比例" prop="twoRatio">
              <el-input
                v-model="rechargeForm2.twoRatio"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="三级返点比例" prop="threeRatio">
              <el-input
                v-model="rechargeForm2.threeRatio"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="开关" prop="isOpen">
              <el-radio-group v-model="rechargeForm2.isOpen">
                <el-radio :label="true">开</el-radio>
                <el-radio :label="false">关</el-radio>
              </el-radio-group>
              <!-- <template slot-scope="scope">
                <el-select
                  v-model="scope.row.isOpen"
                  style="width: 400px; margin-right: 10px"
                >
                  <el-option label="开" value="true"></el-option>
                  <el-option label="关" value="false"></el-option>
                </el-select>
              </template> -->
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitRecharge2('rechargeForm2')"
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
import {
  getRechargeConfig,
  saveRecharge,
} from "@/api/bussiness/rechargeRebate";
export default {
  components: {},
  data() {
    return {
      activeName: "first",
      rechargeForm1: {
        ratio: "",
        rebateMaxAmount: "",
        isOpen: "",
      },
      rechargeRules1: {
        ratio: [
          { required: true, message: "请输入充值返点比例", trigger: "blur" },
        ],
        rebateMaxAmount: [
          { required: true, message: "请输入最大值", trigger: "blur" },
        ],
        isOpen: [{ required: true, message: "请选择开关", trigger: "blur" }],
      },
      rechargeForm2: {
        oneRatio: "",
        twoRatio: "",
        threeRatio: "",
        isOpen: "",
      },
      rechargeRules2: {
        oneRatio: [
          { required: true, message: "请输入充值返点比例", trigger: "blur" },
        ],
        twoRatio: [
          { required: true, message: "请输入充值返点比例", trigger: "blur" },
        ],
        threeRatio: [
          { required: true, message: "请输入充值返点比例", trigger: "blur" },
        ],
        isOpen: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  methods: {
    /**
     * 切换
     */
    handleClick() {
      if (this.activeName === "first") {
        this.getRechargeRebate1();
      } else if (this.activeName === "second") {
        this.getRechargeRebate2();
      }
    },
    /** 充值返利保存  */
    submitRecharge1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveRecharge(
              "RECHARGE_REBATE_SETTING",
              JSON.stringify(this.rechargeForm1)
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
    /** 挖矿返利1保存  */
    submitRecharge2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveRecharge(
              "FINANCIAL_REBATE_SETTING",
              JSON.stringify(this.rechargeForm2)
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

    /** 获取充值返佣 */
    async getRechargeRebate1() {
      try {
        const res = await getRechargeConfig("RECHARGE_REBATE_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.rechargeForm1.ratio = result.ratio ? result.ratio : "";
          this.rechargeForm1.rebateMaxAmount = result.rebateMaxAmount
            ? result.rebateMaxAmount
            : "";
          this.rechargeForm1.isOpen = result.isOpen;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 获取理财返佣 */
    async getRechargeRebate2() {
      try {
        const res = await getRechargeConfig("FINANCIAL_REBATE_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.rechargeForm2.oneRatio = result.oneRatio ? result.oneRatio : "";
          this.rechargeForm2.twoRatio = result.twoRatio ? result.twoRatio : "";
          this.rechargeForm2.threeRatio = result.threeRatio
            ? result.threeRatio
            : "";
          this.rechargeForm2.isOpen = result.isOpen;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
  },
  mounted() {
    this.getRechargeRebate1();
  },
};
</script>
<style lang="scss" scoped></style>
