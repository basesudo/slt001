<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="navIndex" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in actionList"
          :label="item.value"
          :name="item.key"
          :key="item.key"
        >
        </el-tab-pane>
      </el-tabs>
      <informationNotice
        v-if="tabsArr.INFORMATION_NOTICE"
        :selectList="selectList"
      ></informationNotice>
      <activityNotice
        v-if="tabsArr.ACTIVITY_NOTICE"
        :selectList="selectList"
      ></activityNotice>

      <rollNotice v-if="tabsArr.ROLL_NOTICE"></rollNotice>
      <whitePaper
        v-if="tabsArr.WHITE_PAPER"
        :selectList="selectList"
      ></whitePaper>
      <popupNotice
        v-if="tabsArr.POP_UPS_NOTICE"
        :selectList="selectList"
      ></popupNotice>
      <registerGift
        v-if="tabsArr.REGISTER_WELFARE"
        :selectList="selectList"
      ></registerGift>
    </el-card>
  </div>
</template>

<script>
import informationNotice from "./components/informationNotice.vue";
import activityNotice from "./components/activityNotice.vue";
import rollNotice from "./components/rollNotice.vue";
import whitePaper from "./components/whitePaper.vue";
import popupNotice from "./components/popupNotice";
import registerGift from "./components/registerGift.vue";
import { getTabList } from "@/api/bussiness/notice";

export default {
  name: "Notice",
  dicts: ["t_app_language"],
  components: {
    informationNotice,
    activityNotice,
    rollNotice,
    whitePaper,
    popupNotice,
    registerGift,
  },
  data() {
    return {
      // 当前选中
      navIndex: "",
      navId: "",
      activeName: 1,
      actionList: [],
      tabsArr: {},
    };
  },
  created() {
    // 获取tab标签
    getTabList().then((res) => {
      this.actionList = res.rows;
      for (let i = 0; i < this.actionList.length; i++) {
        if (i == 0) {
          this.tabsArr[`${this.actionList[i].key}`] = true;
          this.navIndex = this.actionList[i].key;
        } else {
          this.tabsArr[`${this.actionList[i].key}`] = false;
        }
      }
    });
  },
  computed: {
    // 新增弹窗下拉框
    selectList() {
      let tempList = [];
      tempList = this.actionList.filter((item) => {
        if (this.navIndex == item.key) {
          return item;
        }
      });

      return tempList[0]?.obj || [];
    },
  },

  methods: {
    handleClick(e) {
      for (var key in this.tabsArr) {
        if (e.name != key) {
          this.tabsArr[key] = false;
        } else {
          this.tabsArr[key] = true;
        }
      }
    },
  },
};
</script>

<style scoped>
.item {
  width: 163px;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bgColor1);
}
</style>
