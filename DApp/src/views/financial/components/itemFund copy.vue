<template>
  <div class="item">
    <div class="top">
      <div class="fw-bold">{{ itemObj.title }}</div>
      <!-- 普通和增值没有 -->
      <div class="grade fw-num" v-if="itemObj.classify !== '0' && itemObj.classify !== '2'">
        VIP{{ itemObj.level }}
      </div>
    </div>
    <div class="dataList">
      <div class="left">
        <div class="leftTop">
          <div v-if="!itemObj.icon" class="leftTopImg"></div>
          <image-load :filePath="itemObj.icon" v-if="itemObj.icon" class="itemImg" />
          <div class="fw-num">{{ itemObj.avgRate }} %</div>
        </div>
        <!-- 起投金额 -->
        <div class="centerNum">
          <svg-load name="lingxing" class="starImg"></svg-load>
          <div>{{ _t18(`starting-amount`) }}：</div>
          <div class="money fw-num">
            {{ itemObj.limitMin }} {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
          </div>
        </div>
        <!-- 限投金额： -->
        <div class="centerNum">
          <svg-load name="lingxing" class="starImg"></svg-load>
          <div>{{ _t18(`Investment_Limit`) }}：</div>
          <div class="money fw-num">
            {{ itemObj.limitMax }} {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
          </div>
        </div>
        <!-- 锁仓天数： -->
        <div class="centerNum">
          <svg-load name="lingxing" class="starImg"></svg-load>
          <div>{{ _t18(`Lock-up_days`) }}：</div>
          <div class="money fw-num">{{ itemObj.days }}</div>
        </div>
      </div>
      <div class="right">
        <img src="@/assets/financial/shangshen.png" alt="" class="rightImg" />
      </div>
    </div>
    <div class="line">
      <div class="hight" :style="{ width: `${itemObj.process}%` }"></div>
    </div>
    <div class="footer">
      <!-- 项目进度：   -->
      <div class="footerL">
        <div>{{ _t18(`project_progress`) }}：</div>
        <div class="num fw-num">{{ itemObj.process }}%</div>
      </div>
      <!-- 立即参投  -->
      <div class="footerR" @click="$router.push(`/financialDetails/${itemObj.id}`)">
        {{ _t18(`vote_now`) }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.item {
  height: 233px;
  box-shadow: 0px 3px 6px 1px rgba(19, 138, 93, 0.15);
  border-radius: 5px;
  background: var(--ex-default-background-color);
  margin-bottom: 20px;
  padding: 15px 10px;
  box-sizing: border-box;
  .top {
    display: flex;
    font-size: 16px;
    color: var(--ex-default-font-color);
    align-items: center;
    .grade {
      padding: 3px;
      background: var(--ex-div-bgColor6);
      border-radius: 1px 1px 1px 1px;
      font-size: 12px;
      color: var(--ex-font-color2);
      margin-left: 13px;
    }
  }
  .dataList {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .left {
      .leftTop {
        display: flex;
        font-size: 36px;
        color: var(--ex-font-color3);
        align-items: center;
        margin-bottom: 15px;
        .leftTopImg {
          width: 50px;
          height: 50px;
          background: var(--ex-div-bgColor3);
          border-radius: 5px 5px 5px 5px;
          margin-right: 10px;
        }
        .itemImg {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px 5px 5px 5px;
          margin-right: 10px;
        }
      }
      .centerNum {
        font-size: 12px;
        color: var(--ex-passive-font-color);
        display: flex;
        align-items: center;
        margin-bottom: 7px;
        .starImg {
          width: 7px;
          height: 7px;
          margin-right: 5px;
        }
        .money {
          font-size: 12px;
          color: var(--ex-default-font-color);
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .rightImg {
        width: 158px;
        height: 97px;
      }
    }
  }
  .line {
    margin-top: 5px;
    height: 6px;
    background: var(--ex-div-bgColor3);
    border-radius: 5px 5px 5px 5px;
    .hight {
      height: 6px;
      background: var(--ex-font-color2);
      border-radius: 5px 5px 5px 5px;
    }
  }
  .footer {
    margin-top: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .footerL {
      display: flex;
      font-size: 14px;
      color: var(--ex-passive-font-color);
      .num {
        color: var(--ex-default-font-color);
      }
    }
    .footerR {
      padding: 8px 10px;
      background: var(--ex-div-bgColor1);
      border-radius: 3px 3px 3px 3px;
      color: var(--ex-font-color);
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
  }
}
</style>
