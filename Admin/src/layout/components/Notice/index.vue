<template>
  <div>
    <span class="videoTipBtn" @click="setIsNotice"
      ><i
        class="el-icon-message-solid"
        :style="{ color: isNotice ? '#333' : '#ccc' }"
      ></i>
      <!-- <i v-else class="el-icon-bell"></i> -->
    </span>
    <span class="videoTip">待处理消息：</span>
    <span class="handelTo" @click="toView('/bussiness/certified')"
      >{{ ["rxce"].includes(this.VUE_APP_ENV) ? "注册提醒" : "实名"
      }}<i :class="{ colorGreen: verifiedNum == 0 }">( {{ verifiedNum }} )</i
      >，</span
    >
    <span class="handelTo" @click="toView('/deposit/rechargelist')"
      >充值<i :class="{ colorGreen: rechargeNum == 0 }">( {{ rechargeNum }} )</i
      >，</span
    >
    <span class="handelTo" @click="toView('/deposit/withdrawlist')"
      >提现<i :class="{ colorGreen: withdrawNum == 0 }"
        >( {{ withdrawNum }} )</i
      ></span
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { _playAudio } from "@/plugins/audio/index.js";
import { getIsNotice } from "@/utils/index";

export default {
  data() {
    return {
      // 是否通知
      isNotice: getIsNotice(),
    };
  },
  computed: {
    ...mapGetters(["verifiedNum", "rechargeNum", "withdrawNum"]),
  },
  methods: {
    /**
     * 设置是否通知
     */
    setIsNotice() {
      this.isNotice = !this.isNotice;
      localStorage.setItem("isNotice", this.isNotice);
      if (this.isNotice) {
        _playAudio.audio.pause();
        _playAudio.playList.length = 0;
      }
    },
    toView(item){
      this.$router.push(item)
    }
  },
};
</script>

<style lang="scss" scoped>
.videoTipBtn {
  font-size: 18px;
  padding-right: 10px;
}
.videoTip,
.handelTo {
  cursor: pointer;
  font-size: 14px;
  i {
    color: red;
    font-style: normal;
  }
  i.colorGreen {
    color: #4ac19b;
  }
}
</style>
