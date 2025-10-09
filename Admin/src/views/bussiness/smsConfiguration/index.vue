<template>
  <div class="app-container">
    <SearchFormBox :title="$route.meta.title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="短信配置" name="first">
          <el-form
            ref="messageForm"
            :rules="messageRules"
            :model="messageForm"
            label-width="100px"
          >
            <el-form-item label="第三方名称" prop="name">
              <el-input
                v-model="messageForm.name"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="mobileAccount">
              <el-input
                v-model="messageForm.mobileAccount"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="mobilePassword">
              <el-input
                v-model="messageForm.mobilePassword"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="请求路径" prop="mobileUrl">
              <el-input
                v-model="messageForm.mobileUrl"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitMessageForm('messageForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="邮箱配置" name="second">
          <el-form
            ref="emailForm"
            :rules="emailRules"
            :model="emailForm"
            label-width="100px"
          >
            <el-form-item label="模板" prop="mailTemplate">
              <el-input
                v-model="emailForm.mailTemplate"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="mailAppName">
              <el-input
                v-model="emailForm.mailAppName"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="mailUsername">
              <el-input
                v-model="emailForm.mailUsername"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="mailPassword">
              <el-input
                v-model="emailForm.mailPassword"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="mailHost">
              <el-input
                v-model="emailForm.mailHost"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="mailPort">
              <el-input
                v-model="emailForm.mailPort"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEmailForm('emailForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="oss配置" name="third">
          <el-form
            ref="ossForm"
            :rules="ossRules"
            :model="ossForm"
            label-width="150px"
          >
            <el-form-item label="阿里云oss域名" prop="endPoint">
              <el-input
                v-model="ossForm.endPoint"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="阿里云oss账号ID" prop="accessKeyId">
              <el-input
                v-model="ossForm.accessKeyId"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="阿里云oss账号秘钥" prop="accessKeySecret">
              <el-input
                v-model="ossForm.accessKeySecret"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="阿里云oss桶名" prop="bucketName">
              <el-input
                v-model="ossForm.bucketName"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="阿里云oss存储路径" prop="picLocation">
              <el-input
                v-model="ossForm.picLocation"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitOssForm('ossForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="TG机器人" name="four">
          <el-form
            ref="machineForm"
            :model="machineForm"
            label-width="150px"
          >
            <el-form-item label="机器人名称" prop="botName">
              <el-input
                v-model="machineForm.botName"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="机器人token" prop="botToken">
              <el-input
                v-model="machineForm.botToken"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item label="群组ID" prop="chatId">
              <el-input
                v-model="machineForm.chatId"
                disabled
                style="width: 400px"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="submitmachineForm('machineForm')"
                >保存</el-button
              >
              <el-button type="primary" @click="start">重启</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </SearchFormBox>
  </div>
</template>
<script>
import { getSettingConfig, saveSettingConfig, Restart } from "@/api/public.js";
export default {
  components: {},
  data() {
    return {
      activeName: "first",
      messageForm: {
        name: "",
        mobileAccount: "",
        mobilePassword: "",
        mobileUrl: "",
      },
      messageRules: {
        name: [
          { required: true, message: "请输入第三方名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mobileAccount: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mobilePassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mobileUrl: [
          { required: true, message: "请输入请求路径", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      emailForm: {
        mailTemplate: "",
        mailAppName: "",
        mailUsername: "",
        mailPassword: "",
        mailHost: "",
        mailPort: "",
      },
      emailRules: {
        mailTemplate: [
          { required: true, message: "请输入模板", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mailAppName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mailUsername: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mailPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mailHost: [
          { required: true, message: "请输入地址", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        mailPort: [
          { required: true, message: "请输入端口", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      ossForm: {
        endPoint: "",
        accessKeyId: "",
        accessKeySecret: "",
        bucketName: "",
        picLocation: "",
      },
      ossRules: {
        endPoint: [
          { required: true, message: "请输入阿里云oss域名", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        accessKeyId: [
          { required: true, message: "请输入阿里云oss账号ID", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        accessKeySecret: [
          {
            required: true,
            message: "请输入阿里云oss账号秘钥",
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        bucketName: [
          { required: true, message: "请输入阿里云oss桶名", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        picLocation: [
          {
            required: true,
            message: "请输入阿里云oss存储路径",
            trigger: "blur",
          },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      machineForm: {
        botName:"",
        botToken:"",
      },
      machineRules: {
        botName: [
          { required: true, message: "请输入机器人名称", trigger: "blur" },
        ],
        botToken: [
          { required: true, message: "请输入机器人token", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    start() {
      Restart().then((res) => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
      });
    },
    /**
     * 切换
     */
    handleClick() {
      if (this.activeName === "first") {
        this.getMessage();
      } else if (this.activeName === "second") {
        this.getMail();
      } else if (this.activeName === "third") {
        this.getOss();
      } else if (this.activeName === "four") {
        this.getBot();
      }
    },
    /** 短信保存 */
    submitMessageForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "SMS_SETTING",
              JSON.stringify(this.messageForm)
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
    /** 邮箱保存 */
    submitEmailForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "EMAIL_SETTING",
              JSON.stringify(this.emailForm)
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
    /** oss保存 */
    submitOssForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig("OSS_SETTING", JSON.stringify(this.ossForm)).then(
              (res) => {
                if (res.code === 200) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                }
              }
            );
          } catch (error) {}
        } else {
          return false;
        }
      });
    },
    /** 获取短信列表 */
    async getMessage() {
      try {
        const res = await getSettingConfig("SMS_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.messageForm.name = result.name ? result.name : "";
          this.messageForm.mobileAccount = result.mobileAccount
            ? result.mobileAccount
            : "";
          this.messageForm.mobilePassword = result.mobilePassword
            ? result.mobilePassword
            : "";
          this.messageForm.mobileUrl = result.mobileUrl ? result.mobileUrl : "";
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 获取邮箱列表 */
    async getMail() {
      try {
        const res = await getSettingConfig("EMAIL_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.emailForm.mailTemplate = result.mailTemplate
            ? result.mailTemplate
            : "";
          this.emailForm.mailAppName = result.mailAppName
            ? result.mailAppName
            : "";
          this.emailForm.mailUsername = result.mailUsername
            ? result.mailUsername
            : "";
          this.emailForm.mailPassword = result.mailPassword
            ? result.mailPassword
            : "";
          this.emailForm.mailHost = result.mailHost ? result.mailHost : "";
          this.emailForm.mailPort = result.mailPort ? result.mailPort : "";
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 获取oss列表 */
    async getOss() {
      try {
        const res = await getSettingConfig("OSS_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.ossForm.endPoint = result.endPoint ? result.endPoint : "";
          this.ossForm.accessKeyId = result.accessKeyId
            ? result.accessKeyId
            : "";
          this.ossForm.accessKeySecret = result.accessKeySecret
            ? result.accessKeySecret
            : "";
          this.ossForm.bucketName = result.bucketName ? result.bucketName : "";
          this.ossForm.picLocation = result.picLocation
            ? result.picLocation
            : "";
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /** 获取机器人 */
    async getBot() {
      try {
        const res = await getSettingConfig("TG_BOT_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.machineForm.botName = result.botName ? result.botName : "";
          this.machineForm.botToken = result.botToken ? result.botToken : "";
          this.machineForm.chatId = result.chatId ? result.chatId : "";
          if (Object.value(result).length == 0) {
            this.start();
          }
        }
      } catch (e) {
        console.log("请求失败");
      }
    },

    submitmachineForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "TG_BOT_SETTING",
              JSON.stringify(this.machineForm)
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
    this.getMessage();
    this.getBot();
  },
};
</script>
<style lang="scss" scoped></style>
