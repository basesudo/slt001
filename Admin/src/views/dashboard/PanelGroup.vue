<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('totalPlatformRevenue')"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="dataSource.totalPlatformRevenue.totalNum"
            :duration="2600"
            class="card-panel-num"
          />
          <div class="card-panel-text">平台总收入</div>
          <img src="@/assets/images/bolang.png" class="img" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('numberOfPlayers')"
      >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="dataSource.numberOfPlayers.totalNum"
            :duration="3000"
            class="card-panel-num"
          />
          <div class="card-panel-text">玩家数量</div>
          <img src="@/assets/images/bolang.png" class="img" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('totalRechargeAmount')"
      >
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="dataSource.totalRechargeAmount.totalNum"
            :duration="3200"
            class="card-panel-num"
          />
          <div class="card-panel-text">总充值金额</div>
          <img src="@/assets/images/bolang.png" class="img" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        class="card-panel"
        @click="handleSetLineChartData('quantityOfOrder')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <count-to
            :start-val="0"
            :end-val="dataSource.quantityOfOrder.totalNum"
            :duration="3600"
            class="card-panel-num"
          />
          <div class="card-panel-text">提现金额</div>
          <img src="@/assets/images/bolang.png" class="img" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  props: {
    dataSource: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    CountTo,
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit("handleSetLineChartData", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin: 0 !important;
  box-sizing: border-box;
  position: relative;
  .card-panel-col {
    height: 200px;
    padding-right: 15px !important;
    .img {
      width: 100%;
      height: 50px;
      object-fit: cover;
      position: absolute;
      bottom: 0;
      left: 0;
    }

    &:nth-child(1) {
      .card-panel {
        background: #7fb1ff;
      }
    }
    &:nth-child(2) {
      .card-panel {
        background: #f48d8b;
      }
    }
    &:nth-child(3) {
      .card-panel {
        background: #f8b931;
      }
    }
    &:nth-child(4) {
      .card-panel {
        background: #4ac19b;
      }
    }
  }
  .card-panel {
    position: relative;
    height: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    .card-panel-icon-wrapper {
      position: absolute;
      font-size: 50px;
      bottom: 0;
      right: 15px;
      display: none;
    }
    .card-panel-num {
      font-size: 50px;
    }
    .card-panel-text {
      margin-top: 10px;
      font-size: 20px;
    }
  }
  // .card-panel {
  //   height: 108px;
  //   cursor: pointer;
  //   font-size: 12px;
  //   position: relative;
  //   overflow: hidden;
  //   color: #666;
  //   box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
  //   border-color: rgba(0, 0, 0, 0.05);

  //   &:hover {
  //     .card-panel-icon-wrapper {
  //       color: #fff;
  //     }

  //     .icon-people {
  //       background: #40c9c6;
  //     }

  //     .icon-message {
  //       background: #36a3f7;
  //     }

  //     .icon-money {
  //       background: #f4516c;
  //     }

  //     .icon-shopping {
  //       background: #34bfa3;
  //     }
  //   }

  //   .icon-people {
  //     color: #40c9c6;
  //   }

  //   .icon-message {
  //     color: #36a3f7;
  //   }

  //   .icon-money {
  //     color: #f4516c;
  //   }

  //   .icon-shopping {
  //     color: #34bfa3;
  //   }

  //   .card-panel-icon-wrapper {
  //     float: left;
  //     margin: 14px 0 0 14px;
  //     padding: 16px;
  //     transition: all 0.38s ease-out;
  //     border-radius: 6px;
  //   }

  //   .card-panel-icon {
  //     float: left;
  //     font-size: 48px;
  //   }

  //   .card-panel-description {
  //     float: right;
  //     font-weight: bold;
  //     margin: 26px;
  //     margin-left: 0px;

  //     .card-panel-text {
  //       line-height: 18px;
  //       color: rgba(0, 0, 0, 0.45);
  //       font-size: 16px;
  //       margin-bottom: 12px;
  //     }

  //     .card-panel-num {
  //       font-size: 20px;
  //     }
  //   }
  // }
}

// @media (max-width: 550px) {
//   .card-panel-description {
//     display: none;
//   }

//   .card-panel-icon-wrapper {
//     float: none !important;
//     width: 100%;
//     height: 100%;
//     margin: 0 !important;

//     .svg-icon {
//       display: block;
//       margin: 14px auto !important;
//       float: none !important;
//     }
//   }
// }
</style>
