<template>
  <!-- 交易对 -->
  <div class="app-container">
    <!-- <SearchFormBox title="充值提现音配置"> -->

    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="100px"
      class="formm"
    >
      <div class="header">
        <h3>提示音配置</h3>
        <el-form-item>
          <el-button type="primary" @click="submitMarketForm()" style=""
            >保存</el-button
          >
        </el-form-item>
      </div>
      <br />
      <el-row :gutter="15">
        <el-col :md="24" :lg="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>充值提醒</span>
            </div>
            <el-form-item label="" prop="rechargeVoiceUrl" style="height:180px">
              <el-upload
                id="audioUpload"
                :on-success="handleSuccess"
                v-model="form.rechargeVoiceUrl"
                class="avatar-uploader"
                :action="uploadImgUrl"
                :on-remove="handleRemove"
                :limit="1"
                :on-change="handleChange"
                :before-upload="beforeAvatarUpload"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >上传</el-button
                >

                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="margin-bottom: 10px"
                >
                  不超过5MB，MP3格式
                </div>
              </el-upload>
              <div>
                <audio ref="audio" controls="" :src="music_path" />
              </div>
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :md="24" :lg="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>提现提醒</span>
            </div>
            <el-form-item label="" prop="withdrawalVoiceUrl" style="height:180px">
              <el-upload
                id="audioUpload"
                :on-success="handleSuccess1"
                v-model="form.withdrawalVoiceUrl"
                class="avatar-uploader"
                :action="uploadImgUrl1"
                :on-remove="handleRemove"
                :limit="1"
                :on-change="handleChange"
                :before-upload="beforeAvatarUpload"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >上传</el-button
                >
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="margin-bottom: 10px"
                >
                  不超过5MB，MP3格式
                </div>
              </el-upload>
              <div>
                <audio ref="audio" controls="" :src="music_path1" />
              </div>
            </el-form-item>
          </el-card>
        </el-col>
        <el-col :md="24" :lg="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>实名认证</span>
            </div>
            <el-form-item label="" prop="verifiedVoiceUrl" style="height:180px">
              <el-upload
                id="audioUpload"
                :on-success="handleSuccess2"
                v-model="form.verifiedVoiceUrl"
                class="avatar-uploader"
                :action="uploadImgUrl2"
                :on-remove="handleRemove"
                :limit="1"
                :on-change="handleChange"
                :before-upload="beforeAvatarUpload"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >上传</el-button
                >
                <div
                  slot="tip"
                  class="el-upload__tip"
                  style="margin-bottom: 10px"
                >
                  不超过5MB，MP3格式
                </div>
              </el-upload>
              <div>
                <audio ref="audio" controls="" :src="music_path2" />
              </div>
            </el-form-item>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
    <!-- </SearchFormBox> -->
  </div>
</template>

<script>
import { saveSettingConfig, getSettingConfig } from "@/api/public.js";
export default {
  name: "Config",
  data() {
    return {
      music_path: "",
      music_path1: "",
      music_path2: "",
      buttonText: "stop",
      is_play: false,

      httpRequestParams: {},
      cates: [],
      form: {
        rechargeVoiceUrl: "",
        withdrawalVoiceUrl: "",
        verifiedVoiceUrl: "",
      },
      rules: {},
      uploadImgUrl: __config._BASE_API + "/common/upload/OSS", // 上传的图片服务器地址
      uploadImgUrl1: __config._BASE_API + "/common/upload/OSS", // 上传的图片服务器地址
      uploadImgUrl2: __config._BASE_API + "/common/upload/OSS", // 上传的图片服务器地址
    };
  },
  mounted() {
    getSettingConfig("WITHDRAWAL_RECHARGE_VOICE").then((res) => {
      if (res.code === 200) {
        const result = res.data;
        this.form = result;
        this.music_path = result.rechargeVoiceUrl;
        this.music_path1 = result.withdrawalVoiceUrl;
        this.music_path2 = result.verifiedVoiceUrl;
      }
    });
  },
  methods: {
    reloadYP() {
      this.$refs.audio.src = this.music_path;
    },
    handleSuccess(response, file) {
      // 在上传成功后执行操作
      this.form.rechargeVoiceUrl = response.url;
    },
    handleSuccess1(response, file) {
      // 在上传成功后执行操作

      this.form.withdrawalVoiceUrl = response.url;
    },
    handleSuccess2(response, file) {
      // 在上传成功后执行操作

      this.form.verifiedVoiceUrl = response.url;
    },
    beforeAvatarUpload(file) {
      console.log("file", file);
      // 文件类型进行判断
      console.log("file", file.name.substring(file.name.length - 3));
      // const isAudio = file.type === 'audio/mp3' || file.type === 'audio/mpeg'
      const isAudio = file.name.substring(file.name.length - 3) === "mp3";
      console.log(isAudio, "isAudio");
      // 限制上传文件大小 5M
      const isLt2M = file.size / 1024 / 1024 < 5;
      // 获取时长
      this.getTimes(file);
      const isTime60S = this.audioDuration >= 60 ? true : "";
      console.log(isTime60S);

      if (!isAudio) {
        this.$message.error("上传文件只能是Mp3格式!");
        this.fileList = [];
      } else {
        if (!isLt2M) {
          this.$message.error("上传文件大小不能超过 2MB!");
          this.fileList = [];
        } else {
          if (isTime60S) {
            this.$message.error("上传文件时长不能超过60秒!");
            this.fileList = [];
          }
        }
      }
      return isAudio && isLt2M && isTime60S;
    },
    getTimes(file) {
      var content = file;
      // 获取录音时长
      var url = URL.createObjectURL(content); // 重点
      console.log(url);
      this.music_path = url;
      this.reloadYP();
      // 经测试，发现audio也可获取视频的时长
      this.audioElement = new Audio(url);
      this.audioElement.addEventListener("loadedmetadata", (_event) => {
        console.log(12312321);
        this.audioDuration = parseInt(this.audioElement.duration);
        console.log(this.audioDuration);
      });
    },

    handleChange(file, fileList) {
      // this.audioForm.fileList = fileList.slice(-3)
    },
    handleRemove(file, fileList) {
      this.form.rechargeVoiceUrl = "";
      this.form.withdrawalVoiceUrl = "";
    },

    submitMarketForm() {
      saveSettingConfig(
        "WITHDRAWAL_RECHARGE_VOICE",
        JSON.stringify(this.form)
      ).then(() => {
        this.$store.commit("rechargeNotice", this.form.rechargeVoiceUrl);
        this.$store.commit("withdrawNotice", this.form.withdrawalVoiceUrl);
        this.$store.commit("verifiedNotice", this.form.verifiedVoiceUrl);
        localStorage.setItem("notice1", this.form.rechargeVoiceUrl);
        localStorage.setItem("notice2", this.form.withdrawalVoiceUrl);
        localStorage.setItem("notice3", this.form.verifiedVoiceUrl);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.box-card {
  margin: 15px 20px;
}
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.formm {
  // display: flex;
  // justify-content: flex-start;
}
</style>
