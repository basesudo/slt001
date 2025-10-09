<template>
  <div class="app-container">
    <SearchFormBox :title="$route.meta.title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="侧边栏配置" name="first">
          <SideBar></SideBar>
        </el-tab-pane>
        <el-tab-pane label="白皮书配置" name="sixth">
          <el-form ref="paperForm" :model="paperForm" label-width="80px">
            <el-form-item label="文件" prop="url">
              <FileUpload
                ref="imgg"
                :limit="1"
                v-model="paperForm.url"
              ></FileUpload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPaperForm('paperForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="登录注册配置" name="second">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginFormRules"
            label-width="150px"
          >
            <el-form-item label="邮箱">
              <el-switch v-model="loginForm.emailIsOpen"></el-switch>
            </el-form-item>
            <el-form-item label="手机注册">
              <el-switch v-model="loginForm.phoneIsOpen"></el-switch>
            </el-form-item>
            <el-form-item label="普通">
              <el-switch v-model="loginForm.ordinaryIsOpen"></el-switch>
            </el-form-item>
            <el-form-item label="信誉分">
              <el-input
                v-model.number="loginForm.credits"
                style="width: 200px"
              ></el-input>
            </el-form-item>

            <!-- <el-form-item label="地址">
              <el-switch v-model="loginForm.addressIsOpen"></el-switch>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="submitLoginForm('loginForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="验证码设置" name="third">
          <el-form
            ref="marketForm"
            :rules="marketRules"
            :model="marketForm"
            label-width="150px"
          >
            <el-form-item label="谷歌验证码" prop="url">
              <el-radio-group v-model="marketForm.url">
                <el-radio :label="true">开</el-radio>
                <el-radio :label="false">关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="admin图形验证码" prop="adminCode">
              <el-radio-group v-model="marketForm.adminCode">
                <el-radio :label="true">开</el-radio>
                <el-radio :label="false">关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="H5图形验证码" prop="h5Code">
              <el-radio-group v-model="marketForm.h5Code">
                <el-radio :label="true">开</el-radio>
                <el-radio :label="false">关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitMarketForm('marketForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="时区设置" name="fourth">
          <el-form
            ref="platformForm"
            :rules="platformRules"
            :model="platformForm"
            label-width="210px"
          >
            <el-form-item label="时区" prop="timezone">
              <el-select
                v-model="platformForm.timezone"
                placeholder="请选择时区"
              >
                <el-option
                  v-for="item in timeLists"
                  :key="item.zoneId"
                  :label="item.offSet"
                  :value="item.zoneId"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="后台是否开启谷歌验证码登录" prop="googleAuth">
              <el-switch v-model="platformForm.googleAuth"></el-switch>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                @click="submitPlatformForm('platformForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="后台ip控制" name="fifth">
          <el-form
            ref="iPControlForm"
            :model="iPControlForm"
            label-width="100px"
          >
            <el-form-item
              label=""
              v-for="(item, index) in iPControlForm.ipList"
              :key="index"
            >
              <div style="margin-bottom: 10px">
                IP：
                <el-input
                  maxlength="100"
                  v-model.trim="item.ip"
                  style="width: 150px; margin-right: 10px"
                ></el-input>
                备注：
                <el-input
                  v-model.trim="item.remark"
                  style="width: 150px; margin-right: 10px"
                ></el-input>
                <el-button type="danger" @click="delectBtn(index)"
                  >删除</el-button
                >
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitiPControlForm('iPControlForm')"
                >保存</el-button
              >
              <el-button type="success" @click="addBtn">添加</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="底部栏设置" name="six">
          <TapBar></TapBar>
        </el-tab-pane>
        <el-tab-pane label="金刚区" name="seven">
          <JinGang></JinGang>
        </el-tab-pane>
        <el-tab-pane label="提示音配置" name="eight">
          <MP></MP>
        </el-tab-pane>
        <el-tab-pane label="玩法配置" name="nine">
          <Trade></Trade>
        </el-tab-pane>
        <el-tab-pane label="平台logo设置" name="ten">
          <LOGO></LOGO>
        </el-tab-pane>
        <el-tab-pane label="首页币种设置" name="eleven">
          <Coin></Coin>
        </el-tab-pane>
        <el-tab-pane label="下载地址配置" name="thirteen">
          <DownLoad></DownLoad>
        </el-tab-pane>
        <el-tab-pane label="vip等级设置" name="fourteen">
          <Vip></Vip>
        </el-tab-pane>
        <el-tab-pane label="VIP说明" name="fifteen">
          <VipShow></VipShow>
        </el-tab-pane>
        <el-tab-pane label="打码配置" name="sixteen">
          <el-form ref="mosaicForm" :model="mosaicForm" label-width="150px">
            <el-form-item label="总开关">
              <el-switch
                v-model="mosaicForm.isOpen"
                @change="handleChangeMosaic"
              ></el-switch>
            </el-form-item>
            <el-form-item label="秒合约开关">
              <el-switch
                v-model="mosaicForm.sencordIsOpen"
                :disabled="!mosaicFormIsOpen"
                @change="handleChangeSencordIsOpen"
              ></el-switch>
            </el-form-item>
            <el-form-item label="币币开关">
              <el-switch
                v-model="mosaicForm.currencyIsOpen"
                :disabled="!mosaicFormIsOpen"
                @change="handleChangeCurrencyIsOpen"
              ></el-switch>
            </el-form-item>
            <el-form-item label="u本位开关">
              <el-switch
                v-model="mosaicForm.contractIsOpen"
                :disabled="!mosaicFormIsOpen"
                @change="handleChangeContractIsOpen"
              ></el-switch>
            </el-form-item>
            <el-form-item label="理财开关">
              <el-switch
                v-model="mosaicForm.financialIsOpen"
                :disabled="!mosaicFormIsOpen"
                @change="handleChangeFinancialIsOpen"
              ></el-switch>
            </el-form-item>
            <el-form-item label="质押开关">
              <el-switch
                v-model="mosaicForm.pledgeIsOpen"
                :disabled="!mosaicFormIsOpen"
                @change="handleChangePledgeIsOpen"
              ></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitMosaicForm('mosaicForm')"
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
import SideBar from "./components/sidebar.vue";
import TapBar from "./components/tapbar";
import JinGang from "./components/jingang.vue";
import MP from "./components/mp";
import LOGO from "./components/logo";
import Coin from "./components/coin.vue";
import DownLoad from "./components/downLoad";
import Trade from "./components/trade";
import Vip from "./components/vip";
import VipShow from "./components/vipshow";

import {
  getSettingConfig,
  saveSettingConfig,
  getTimezone,
} from "@/api/public.js";
export default {
  components: {
    SideBar,
    TapBar,
    JinGang,
    MP,
    LOGO,
    Coin,
    DownLoad,
    Trade,
    Vip,
    VipShow,
  },
  data() {
    var checkCredits = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("信用分不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 0) {
            callback(new Error("必须大于0"));
          } else if (value > 100) {
            callback(new Error("必须小于100"));
          } else {
            callback();
          }
        }
      }, 1000);
    };

    return {
      activeName: "first",
      whitepaperUrl: "",
      paperForm: {},
      broadsideForm: {
        advanced: false,
        bank: false,
        tardPwd: false,
        loginPwd: false,
        certified: false,
        termsService: false,
        paper: false,
        language: false,
      },
      loginForm: {
        emailIsOpen: false,
        phoneIsOpen: false,
        ordinaryIsOpen: false,
        addressIsOpen: false,
        credits: "",
      },
      loginFormRules: {
        credits: [{ validator: checkCredits, trigger: "blur" }],
      },
      tradeForm: {
        currencyStatus: false,
        quicklyStatus: false,
        contractStatus: false,
      },
      marketForm: {
        url: "",
        adminCode: "",
        h5Code: "",
      },
      marketRules: {
        url: [{ required: true, message: "请选择开关", trigger: "blur" }],
        adminCode: [{ required: true, message: "请选择开关", trigger: "blur" }],
        h5Code: [{ required: true, message: "请选择开关", trigger: "blur" }],
      },
      platformForm: {
        timezone: "",
      },
      platformRules: {
        timezone: [
          { required: true, message: "请选择时区", trigger: "change" },
        ],
      },
      timeLists: [],
      // 后台ip控制
      iPControlForm: {
        ipList: [],
      },
      mosaicForm: {
        isOpen: false, //总开关
        sencordIsOpen: false, //秒合约开关
        currencyIsOpen: false, //币币开关
        contractIsOpen: false, //u本位开关
        financialIsOpen: false, //理财开关
        pledgeIsOpen: false, //质押开关
      },
      mosaicFormIsOpen: false,
    };
  },
  methods: {
    handleClick() {
      if (this.activeName === "first") {
        this.getBroadside();
      } else if (this.activeName === "second") {
        this.getLogin();
      } else if (this.activeName === "third") {
        this.getMarket();
      } else if (this.activeName === "fourth") {
        this.getPlatform();
        this.getTimeList();
      } else if (this.activeName === "fifth") {
        this.getIPControlform();
      } else if (this.activeName === "sixth") {
        this.getWhitePaper();
        getSettingConfig("WHITE_PAPER_SETTING");
      } else if (this.activeName === "nine") {
        this.getTrade();
      } else if (this.activeName === "sixteen") {
        this.getMosaic();
      }
    },
    /**
     * 打码配置总开关
     */
    handleChangeMosaic(val) {
      if (val) {
        this.mosaicFormIsOpen = true;
        this.mosaicForm = {
          isOpen: true, //总开关
          sencordIsOpen: true, //秒合约开关
          currencyIsOpen: true, //币币开关
          contractIsOpen: true, //u本位开关
          financialIsOpen: true, //理财开关
          pledgeIsOpen: true, //质押开关
        };
      } else {
        this.mosaicFormIsOpen = false;
        this.mosaicForm = {
          isOpen: false, //总开关
          sencordIsOpen: false, //秒合约开关
          currencyIsOpen: false, //币币开关
          contractIsOpen: false, //u本位开关
          financialIsOpen: false, //理财开关
          pledgeIsOpen: false, //质押开关
        };
      }
    },
    /**
     * 打码配置秒合约开关
     */
    handleChangeSencordIsOpen() {
      this.handleJudgeMosaicIsOpen();
    },
    /**
     * 打码配置币币开关
     */
    handleChangeCurrencyIsOpen() {
      this.handleJudgeMosaicIsOpen();
    },
    /**
     * 打码配置u本位开关
     */
    handleChangeContractIsOpen() {
      this.handleJudgeMosaicIsOpen();
    },
    /**
     * 打码配置理财开关
     */
    handleChangeFinancialIsOpen() {
      this.handleJudgeMosaicIsOpen();
    },
    /**
     * 打码配置质押开关
     */
    handleChangePledgeIsOpen() {
      this.handleJudgeMosaicIsOpen();
    },
    /**
     * 判断是否要关闭总开关
     */
    handleJudgeMosaicIsOpen() {
      if (
        !this.mosaicForm.sencordIsOpen &&
        !this.mosaicForm.currencyIsOpen &&
        !this.mosaicForm.contractIsOpen &&
        !this.mosaicForm.financialIsOpen &&
        !this.mosaicForm.pledgeIsOpen
      ) {
        this.mosaicForm.isOpen = false;
      }
      if (
        this.mosaicForm.sencordIsOpen &&
        this.mosaicForm.currencyIsOpen &&
        this.mosaicForm.contractIsOpen &&
        this.mosaicForm.financialIsOpen &&
        this.mosaicForm.pledgeIsOpen
      ) {
        this.mosaicForm.isOpen = true;
      }
    },
    /**
     * 获取白皮书
     */
    async getWhitePaper() {
      try {
        const res = await getSettingConfig("WHITE_PAPER_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.paperForm = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitPaperForm(formName) {
      if (this.paperForm.url == "" || this.paperForm.url == null) {
        this.$message.error("请上传文件");
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "WHITE_PAPER_SETTING",
              JSON.stringify(this.paperForm)
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
    /** 获取侧边栏配置 */
    async getBroadside() {
      try {
        const res = await getSettingConfig("APP_SIDEBAR_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.broadsideForm = result;
          console.log(123, this.broadsideForm);
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitBroadsideForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "APP_SIDEBAR_SETTING",
              JSON.stringify(this.broadsideForm)
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
    /** 获取登录配置 */
    async getLogin() {
      try {
        const res = await getSettingConfig("LOGIN_REGIS_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.loginForm = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitLoginForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "LOGIN_REGIS_SETTING",
              JSON.stringify(this.loginForm)
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
    /** 获取登录配置 */
    async getMosaic() {
      try {
        const res = await getSettingConfig("ADD_MOSAIC_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.mosaicForm = result;
          if (this.mosaicForm.isOpen) {
            this.mosaicFormIsOpen = true;
          } else {
            this.mosaicFormIsOpen = false;
          }
          this.handleJudgeMosaicIsOpen();
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitMosaicForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "ADD_MOSAIC_SETTING",
              JSON.stringify(this.mosaicForm)
            ).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.getMosaic();
              }
            });
          } catch (error) {}
        } else {
          return false;
        }
      });
    },

    /** 获取交易玩法配置 */
    async getTrade() {
      try {
        const res = await getSettingConfig("PLAYING_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.tradeForm = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitTradeForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "PLAYING_SETTING",
              JSON.stringify(this.tradeForm)
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
    /** 获取market配置 */
    async getMarket() {
      try {
        const res = await getSettingConfig("MARKET_URL");
        if (res.code === 200) {
          const result = res.data;
          // this.marketForm.url = result.url ? result.url : "";
          this.marketForm.url = result.url;
          this.marketForm.adminCode = result.adminCode;
          this.marketForm.h5Code = result.h5Code;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitMarketForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "MARKET_URL",
              JSON.stringify(this.marketForm)
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
    /** 平台设置 */
    async getPlatform() {
      try {
        const res = await getSettingConfig("PLATFORM_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.platformForm = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 时区列表 */
    async getTimeList() {
      try {
        const res = await getTimezone();
        if (res.code === 200) {
          const result = res.data;
          this.timeLists = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 平台保存 */
    submitPlatformForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "PLATFORM_SETTING",
              JSON.stringify(this.platformForm)
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
    /** 后台ip设置 */
    async getIPControlform() {
      try {
        const res = await getSettingConfig("WHITE_IP_SETTING");
        if (res.code === 200) {
          const result = res.data;
          for (let i = 0; i < result.length; i++) {
            for (let key in result[i]) {
              if (!result[i][key]) {
                result[i][key] = "";
              }
            }
          }
          this.iPControlForm.ipList = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /**添加 */
    addBtn() {
      let data = {
        ip: "",
        remark: "",
      };
      this.iPControlForm.ipList.push(data);
    },
    /**删除 */
    delectBtn(index) {
      this.iPControlForm.ipList.splice(index, 1);
    },
    submitiPControlForm(formName) {
      if (
        this.iPControlForm.ipList.some((val) =>
          val.ip == "" || val.remark === "" ? true : false
        )
      ) {
        this.$message({
          type: "error",
          message: "请填写完整内容",
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "WHITE_IP_SETTING",
              JSON.stringify(this.iPControlForm.ipList)
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
    this.handleClick();
  },
};
</script>
<style lang="scss" scoped></style>
