<!--
 * @Autor: Aka
 * @Date: 2023-07-13 16:49:05
 * @Description: 
 * @LastEditTime: 2023-08-08 14:56:41
-->
<template>
  <div class="app-container">
    <el-form
      ref="currencyForm"
      :model="withdrawaChannelForm"
      label-width="100px"
    >
      <el-form-item
        label=""
        v-for="(item, index) in withdrawaChannelForm.channelList"
        :key="index"
      >
        <div style="margin-bottom: 10px">
          提现币种：
          <el-input
            maxlength="100"
            v-model.trim="item.rechargeType"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
          展示名称：
          <el-input
            v-model.trim="item.rechargeName"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
          提现状态：
          <el-select
            v-model="item.status"
            placeholder="请选择提现状态"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          >
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
          提现类型：
          <el-select
            v-model="item.type"
            placeholder="请选择提现类型"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          >
            <el-option label="银行卡" value="1"></el-option>
            <el-option label="数据货币" value="0"></el-option>
          </el-select>
        </div>
        <div style="margin-bottom: 10px">
          最大限制：
          <el-input
            v-model.trim="item.withdrawalMax"
            maxlength="20"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
          最小限制：
          <el-input
            v-model.trim="item.withdrawalMix"
            maxlength="20"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
          手续费率：
          <el-input
            v-model.trim="item.ratio"
            maxlength="20"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
          次数限制(日)：
          <el-input
            v-model.trim="item.dayWithdrawalNum"
            maxlength="5"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
        </div>
        <div style="margin-bottom: 15px">
          免费提现次数：
          <el-input
            v-model.trim="item.freeNum"
            maxlength="5"
            style="width: 150px; margin-right: 10px; margin-bottom: 5px"
          ></el-input>
          <el-button type="danger" @click="delectBtnChanne(index)"
            >删除</el-button
          >
          <el-button
            type="success"
            @click="addChanneBtn"
            v-show="withdrawaChannelForm.channelList.length !== 0"
            >添加</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveChannelBtn">保存</el-button>
        <el-button
          type="success"
          @click="addChanneBtn"
          v-show="withdrawaChannelForm.channelList.length === 0"
          >添加</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
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
    var compareMax = (rule, value, callback) => {
      if (value) {
        if (Number(value) <= Number(this.rechargeForm.rechargeMin)) {
          return callback(new Error("充值最大额不能小于充值最低额"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var compareMin = (rule, value, callback) => {
      if (value) {
        if (Number(value) >= Number(this.rechargeForm.rechargeMax)) {
          return callback(new Error("充值最低额不大于充值最大额"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var rechargeNum = (rule, value, callback) => {
      if (value) {
        if (!/^\+?[1-9][0-9]*$/.test(value)) {
          return callback(new Error("只能输入非零的正整数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      activeName: "fourth",
      rechargeForm: {
        rechargeMax: "",
        rechargeMin: "",
        rechargeBtc: "",
        rechargeEth: "",
        rechargeUsdtTrc: "",
        rechargeUsdtErc: "",
        rechargeNum: "",
      },
      rechargeRules: {
        rechargeMax: [
          { required: true, message: "请输入充值最大额", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkRechargeMax, trigger: "blur" },
          { validator: compareMax, trigger: "blur" },
        ],
        rechargeMin: [
          { required: true, message: "请输入充值最低额", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkRechargeMax, trigger: "blur" },
          { validator: compareMin, trigger: "blur" },
        ],
        rechargeBtc: [
          { required: true, message: "请输入Btc充值地址", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "长度在 3 到 200 个字符",
            trigger: "blur",
          },
        ],
        rechargeEth: [
          { required: true, message: "请输入Eth充值地址", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "长度在 3 到 200 个字符",
            trigger: "blur",
          },
        ],
        rechargeUsdtTrc: [
          { required: true, message: "请输入充值U-TRC", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "长度在 3 到 200 个字符",
            trigger: "blur",
          },
        ],
        rechargeUsdtErc: [
          { required: true, message: "请输入充值U-ERC", trigger: "blur" },
          {
            min: 3,
            max: 200,
            message: "长度在 3 到 200 个字符",
            trigger: "blur",
          },
        ],
        rechargeNum: [
          { required: true, message: "请输入充值次数", trigger: "blur" },
          {
            min: 1,
            max: 5,
            message: "长度在 1 到 5 个字符",
            trigger: "blur",
          },
          { validator: rechargeNum, trigger: "blur" },
        ],
      },
      currencyForm: {
        currencyList: [],
      },
      // 提现设置
      withdrawaForm: {
        ratio: "",
        dayWithdrawalNum: "",
        freeNum: "",
        withdrawalMax: "",
        withdrawalMix: "",
      },
      withdrawaRules: {
        ratio: [
          { required: true, message: "请输入手续费", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkRechargeMax, trigger: "blur" },
        ],
        dayWithdrawalNum: [
          {
            required: true,
            message: "请输入每日提现次数限制",
            trigger: "blur",
          },
          {
            min: 1,
            max: 5,
            message: "长度在 1 到 5 个字符",
            trigger: "blur",
          },
          { validator: rechargeNum, trigger: "blur" },
        ],
        freeNum: [
          {
            required: true,
            message: "请输入系统免费提现次数",
            trigger: "blur",
          },
          {
            min: 1,
            max: 5,
            message: "长度在 1 到 5 个字符",
            trigger: "blur",
          },
          { validator: rechargeNum, trigger: "blur" },
        ],
        withdrawalMax: [
          { required: true, message: "请输入最大限制", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkRechargeMax, trigger: "blur" },
        ],
        withdrawalMix: [
          { required: true, message: "请输入最小限制", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          { validator: checkRechargeMax, trigger: "blur" },
        ],
      },
      // 提现通道
      withdrawaChannelForm: {
        channelList: [],
      },
    };
  },
  methods: {
    /**
     * 切换
     */
    handleClick() {
      if (this.activeName === "first") {
        this.getRecharge();
      } else if (this.activeName === "second") {
        this.getCurrency();
      } else if (this.activeName === "third") {
        this.withdrawa();
      } else if (this.activeName === "fourth") {
        this.getWithdrawaChannel();
      }
    },
    /** 充值保存 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "RECHARGE_SETTING",
              JSON.stringify(this.rechargeForm)
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
    /** 获取充值列表 */
    async getRecharge() {
      try {
        const res = await getSettingConfig("RECHARGE_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.rechargeForm.rechargeMax = result.rechargeMax
            ? result.rechargeMax + ""
            : "";
          this.rechargeForm.rechargeMin = result.rechargeMin
            ? result.rechargeMin + ""
            : "";
          this.rechargeForm.rechargeBtc = result.rechargeBtc
            ? result.rechargeBtc + ""
            : "";
          this.rechargeForm.rechargeEth = result.rechargeEth
            ? result.rechargeEth + ""
            : "";
          this.rechargeForm.rechargeUsdtTrc = result.rechargeUsdtTrc
            ? result.rechargeUsdtTrc + ""
            : "";
          this.rechargeForm.rechargeUsdtErc = result.rechargeUsdtErc
            ? result.rechargeUsdtErc + ""
            : "";
          this.rechargeForm.rechargeNum = result.rechargeNum
            ? result.rechargeNum + ""
            : "";
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /**添加 */
    addBtn() {
      let data = {
        coinName: "",
        coin: "",
      };
      this.currencyForm.currencyList.push(data);
    },
    /**删除 */
    delectBtn(index) {
      this.currencyForm.currencyList.splice(index, 1);
    },
    /** 保存 */
    saveBtn() {
      if (
        this.currencyForm.currencyList.some((val) =>
          val.coinName == "" ||
          val.coin === "" ||
          val.rechargeMax === "" ||
          val.rechargeMin === "" ||
          val.coinAddress === "" ||
          val.rechargeNum === ""
            ? true
            : false
        )
      ) {
        this.$message({
          type: "error",
          message: "请填写完整内容",
        });
        return;
      }
      let flagNum = 0;
      this.currencyForm.currencyList.forEach((element) => {
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(element.rechargeMax) ||
          Number(element.rechargeMax) === 0
        ) {
          return this.$message({
            type: "error",
            message: "充值最大额请输入最多保留6位小数的大于0的数字",
          });
        }
        if (
          Number(element.rechargeMax) <= Number(this.rechargeForm.rechargeMin)
        ) {
          return this.$message({
            type: "error",
            message: "充值最大额不能小于充值最低额",
          });
        }
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(element.rechargeMin) ||
          Number(element.rechargeMin) === 0
        ) {
          return this.$message({
            type: "error",
            message: " 充值最低额请输入最多保留6位小数的大于0的数字",
          });
        }
        if (Number(element.rechargeMin) >= Number(element.rechargeMax)) {
          return this.$message({
            type: "error",
            message: "充值最低额不大于充值最大额",
          });
        }
        if (!/^\+?[1-9][0-9]*$/.test(element.rechargeNum)) {
          return this.$message({
            type: "error",
            message: "充值次数只能输入非零的正整数",
          });
        }
        flagNum = flagNum + 1;
      });
      const newListLength = new Set(
        this.currencyForm.currencyList.map((item) => item.coinName)
      ).size;
      const listLength = this.currencyForm.currencyList.length;
      if (listLength > newListLength) {
        return this.$message({
          type: "error",
          message: "请输入不同名称的的币种",
        });
      }
      if (flagNum === this.currencyForm.currencyList.length) {
        try {
          saveSettingConfig(
            "ASSET_COIN",
            JSON.stringify(this.currencyForm.currencyList)
          ).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
            }
          });
        } catch (error) {}
      }
    },
    /** 获取币种列表 */
    async getCurrency() {
      try {
        const res = await getSettingConfig("ASSET_COIN");
        if (res.code === 200) {
          const result = res.data;
          for (let i = 0; i < result.length; i++) {
            for (let key in result[i]) {
              if (!result[i][key]) {
                result[i][key] = "";
              }
            }
          }
          this.currencyForm.currencyList = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /**提现设置保存 */
    submitWithdrawaForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "WITHDRAWAL_SETTING",
              JSON.stringify(this.withdrawaForm)
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
    /**提现获取 */
    async withdrawa() {
      try {
        const res = await getSettingConfig("WITHDRAWAL_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.withdrawaForm.ratio = result.ratio ? result.ratio + "" : "";
          this.withdrawaForm.dayWithdrawalNum = result.dayWithdrawalNum
            ? result.dayWithdrawalNum + ""
            : "";
          this.withdrawaForm.freeNum = result.freeNum
            ? result.freeNum + ""
            : "";
          this.withdrawaForm.withdrawalMax = result.withdrawalMax
            ? result.withdrawalMax + ""
            : "";
          this.withdrawaForm.withdrawalMix = result.withdrawalMix
            ? result.withdrawalMix + ""
            : "";
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 提现通道  */
    async getWithdrawaChannel() {
      try {
        const res = await getSettingConfig("WITHDRAWAL_CHANNEL_SETTING");
        if (res.code === 200) {
          const result = res.data;
          for (let i = 0; i < result.length; i++) {
            for (let key in result[i]) {
              if (!result[i][key]) {
                result[i][key] = "";
              }
            }
          }
          this.withdrawaChannelForm.channelList = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    delectBtnChanne(index) {
      this.withdrawaChannelForm.channelList.splice(index, 1);
    },
    addChanneBtn() {
      let data = {
        status: "",
        rechargeName: "",
        rechargeType: "",
        type: "",
      };
      this.withdrawaChannelForm.channelList.push(data);
    },
    /** 保存 */
    saveChannelBtn() {
      if (
        this.withdrawaChannelForm.channelList.some((val) =>
          val.rechargeType == "" ||
          val.rechargeName === "" ||
          val.status === "" ||
          val.type === "" ||
          val.ratio === "" ||
          val.dayWithdrawalNum === "" ||
          val.freeNum === "" ||
          val.withdrawalMax === "" ||
          val.withdrawalMix === ""
            ? true
            : false
        )
      ) {
        this.$message({
          type: "error",
          message: "请填写完整内容",
        });
        return;
      }
      let flagNum = 0;
      this.withdrawaChannelForm.channelList.forEach((element) => {
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(element.ratio) ||
          Number(element.ratio) === 0
        ) {
          return this.$message({
            type: "error",
            message: "手续费请输入最多保留6位小数的大于0的数字",
          });
        }
        if (!/^\+?[1-9][0-9]*$/.test(element.dayWithdrawalNum)) {
          return this.$message({
            type: "error",
            message: "每日提现次数限制只能输入非零的正整数",
          });
        }
        if (!/^\+?[1-9][0-9]*$/.test(element.freeNum)) {
          return this.$message({
            type: "error",
            message: "系统免费提现次数只能输入非零的正整数",
          });
        }
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(
            element.withdrawalMax
          ) ||
          Number(element.withdrawalMax) === 0
        ) {
          return this.$message({
            type: "error",
            message: "最大限制请输入最多保留6位小数的大于0的数字",
          });
        }
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(
            element.withdrawalMix
          ) ||
          Number(element.withdrawalMix) === 0
        ) {
          return this.$message({
            type: "error",
            message: "最小限制请输入最多保留6位小数的大于0的数字",
          });
        }
        flagNum = flagNum + 1;
      });
      const newListLength = new Set(
        this.withdrawaChannelForm.channelList.map((item) => item.rechargeName)
      ).size;
      const listLength = this.withdrawaChannelForm.channelList.length;
      if (listLength > newListLength) {
        return this.$message({
          type: "error",
          message: "请输入不同名称的展示名称",
        });
      }
      if (flagNum === this.withdrawaChannelForm.channelList.length) {
        try {
          saveSettingConfig(
            "WITHDRAWAL_CHANNEL_SETTING",
            JSON.stringify(this.withdrawaChannelForm.channelList)
          ).then((res) => {
            if (res.code === 200) {
              this.$message({
                message: "保存成功",
                type: "success",
              });
            }
          });
        } catch (error) {}
      }
    },
  },

  mounted() {
    this.handleClick();
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-input__inner) {
  width: 400px !important;
}
</style>
