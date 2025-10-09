<script setup>
import { _t18 } from '@/utils/public'
let props = defineProps({
  cardData: {
    type: Object
  }
})
const dataValue = ref(props.cardData)
</script>
<template>
  <div class="box">
    <div class="top">
      <div class="top_left">
        <svg-load name="usdt" class="usdt"></svg-load>
        <div class="title fw-bold">{{ dataValue.title }}</div>
      </div>
      <div class="top_right">{{ _t18('pledge_Buy', ['aams']) }}</div>
      <!-- <div class="top_right">
        可购：<span class="ff-num">{{ `${dataValue.kegou}/${dataValue.sum}` }}</span>
      </div> -->
    </div>
    <div class="content">
      <div class="left">
        <div class="content1">
          <!-- 限额 -->
          <p>{{ _t18('pledge_quota') }}</p>
          <span class="fw-num">{{ dataValue.limitMin }}~{{ dataValue.limitMax }}</span>
        </div>
        <div class="content2">
          <!-- 天数 -->
          <p>{{ _t18('pledge_number_days') }}</p>
          <span class="fw-num">{{ dataValue.days }}</span>
        </div>
        <div class="content3">
          <!-- 可购 -->
          <p>{{ _t18('pledge_available_purchase', ['aams']) }}</p>
          <span class="fw-num" v-if="['dev'].includes(_getConfig('_APP_ENV'))">{{ `${dataValue.buyPurchase}/${dataValue.timeLimit}` }}</span>
          <!-- buyPurchase -->
          <span class="fw-num" v-else>{{ `${dataValue.timeLimit}` }}</span>
        </div>
        <div class="content3">
          <!-- 收益率 -->
          <p>{{ _t18('pledge_rate_return') }}</p>
          <span class="fw-num rate">{{ dataValue.minOdds }}%~{{ dataValue.maxOdds }}%</span>
        </div>
      </div>
      <div class="right">
        <image-load
          :filePath="dataValue.icon || dataValue.imgUrl || dataValue.imageUrl || dataValue.image || dataValue.logo || 'zhiyacard.png'"
          name="zhiyacard"
          class="zhiyacard"
        ></image-load>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  margin-top: 15px;
  cursor: pointer;
  // border-top: 1px solid var(--ex-border-color);
  border: 1px solid var(--ex-border-color1);
  border-radius: 10px;
  font-size: 14px;
  color: var(--ex-passive-font-color);
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex-project-border-color);
    padding: 20px 10px;
    .top_left {
      display: flex;
      align-items: center;
      .title {
        font-weight: bold;
        color: var(--ex-default-font-color);
      }
      .usdt {
        font-size: 20px;
        margin-right: 10px;
      }
    }
    .top_right {
      min-width: 104px;
      padding: 8px 10px;
      background-color: var(--ex-div-bgColor1);
      color: var(--ex-font-color);
      text-align: center;
      border-radius: 3px;
    }
  }
  .content {
    display: flex;
    padding: 20px 10px;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: column;
      & > div {
        flex: 1;
        display: flex;
        align-items: center;
        color: var(--ex-passive-font-color);
        font-size: 12px;
        p {
          min-width: 36px;
        }
        span {
          margin-left: 20px;
          color: var(--ex-default-font-color);
          font-size: 18px;
        }
        span.rate {
          color: var(--ex-font-color9);
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      .zhiyacard {
        font-size: 160px; /* 放大整体尺寸 */
        border-radius: 15px; /* 加入圆角 */
        overflow: hidden; /* 防止圆角被内部内容溢出 */
      }
    }
  }
}
</style>
