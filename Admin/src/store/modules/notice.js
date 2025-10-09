// 充值提现提示音
import { getSettingConfig } from "@/api/public.js";
const notice = {
  state: {
    rechargeNotice: "",
    withdrawNotice: "",
    verifiedNotice: "",
    rechargeNum: 0,
    withdrawNum: 0,
    verifiedNum: 0
  },
  mutations: {
    SET_RECHARGENOTICE: (state, rechargeNotice) => {
      state.rechargeNotice = rechargeNotice;
    },
    SET_WITHDRAWNOTICE: (state, withdrawNotice) => {
      state.withdrawNotice = withdrawNotice;
    },
    SET_VERIFIEDNOTICE: (state, verifiedNotice) => {
      state.verifiedNotice = verifiedNotice;
    },
    SET_RECHARGENUM: (state, rechargeNum) => {
      state.rechargeNum = rechargeNum;
    },
    SET_WITHDRAWNUM: (state, withdrawNum) => {
      state.withdrawNum = withdrawNum;
    },
    SET_VERIFIEDNUM: (state, verifiedNum) => {
      state.verifiedNum = verifiedNum;
    }
  },
  actions: {
    getNotice({ commit }) {
      return new Promise((resolve, reject) => {
        getSettingConfig("WITHDRAWAL_RECHARGE_VOICE")
          .then((res) => {
            if (res.code == "200") {
              commit("SET_RECHARGENOTICE", res.data.rechargeVoiceUrl);
              commit("SET_WITHDRAWNOTICE", res.data.withdrawalVoiceUrl);
              commit("SET_VERIFIEDNOTICE", res.data.verifiedVoiceUrl);
              localStorage.setItem("notice1", res.data.rechargeVoiceUrl);
              localStorage.setItem("notice2", res.data.withdrawalVoiceUrl);
              localStorage.setItem("notice3", res.data.verifiedVoiceUrl);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};

export default notice;
