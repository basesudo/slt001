<script setup>
import { useTradeStore } from '@/store/trade/index'
const tradeStore = useTradeStore()
// 显示数组 []
</script>
<template>
  <div class="list" v-if="tradeStore.secondContractCoinList.length">
    <div class="listItem" v-for="(item, index) in tradeStore.secondContractCoinList" :key="index">
      <div class="left">
        <image-load :filePath="item.logo" class="leftImg" />
        <div class="itemTitle">
          <div class="itemTitleTop fw-bold">{{ item.showSymbol }}</div>
          <!-- <div class="itemTitleBottom">BTC</div> -->
        </div>
      </div>
      <div class="center fw-num">
        <div>{{ tradeStore.allCoinPriceInfo[item.coin].close }}</div>
        <!-- <div class="centetBottom">-1.45%</div> -->
      </div>
      <div class="right">
        <div
          :class="[
            _isRFD(
              tradeStore.allCoinPriceInfo[item.coin].openPrice,
              tradeStore.allCoinPriceInfo[item.coin].close
            ),
            'rfd-bg rfd-sign rightNum fw-num'
          ]"
        >
          {{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%
        </div>
      </div>
    </div>
  </div>
  <Nodata v-else></Nodata>
</template>

<style lang="scss" scoped>
.list {
  padding: 4px 15px;
  .listItem {
    padding: 14px 0;
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      width: 110px;
      .leftImg {
        width: 30px;
        height: 30px;
      }
      .itemTitle {
        display: flex;
        align-items: center;
        margin-left: 10px;
        font-size: 12px;
        color: #798cae;
        .itemTitleTop {
          font-size: 14px;
          color: var(--ex-default-font-color);
        }
        .itemTitleBottom {
          margin-top: 6px;
        }
      }
    }
    .center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 155px;
      font-size: 14px;
      color: var(--ex-default-font-color);
      font-weight: 550;
      .centetBottom {
        margin-top: 6px;
        font-size: 12px;
        color: var(--ex-font-color4);
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: right;
      .rightNum {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 74px;
        height: 28px;
        font-size: 14px;
        font-weight: 500;
        color: var(--ex-font-color);
        background: var(--ex-div-bgColor7);
        border-radius: 2px;
      }
    }
  }
}
</style>
