<!--分享委托详情-->
<template>
  <div class="share-commission" id="html-canvas">
    <div class="share-img-box">
      <image-load filePath="defi/share.png" class="img"></image-load>
      <div
        class="fw-num"
        :class="[
          'desc',
          _isRFD(
            historicalData.OpeningPrice,
            historicalData.ClosingPrice,
            historicalData.type == 0 ? 'sell' : 'buy'
          )
        ]"
      >
        {{ historicalData.profitAndLossAmount + historicalData.currencyUnit }}
      </div>
    </div>
    <!-- 下载-->
    <svg-load name="download" class="download" @click="downloadImg"></svg-load>

    <!--交易单详情-->
    <div class="transaction-info">
      <!--交易类型-->
      <div>
        <div class="fw-bold">{{ historicalData.TransactionType }}</div>
        <div>{{ historicalData.CurrencyName }}</div>
      </div>

      <!--开仓价-->
      <div>
        <div class="fw-bold">{{ _t18(`average_opening_price`) }}</div>
        <div class="ff-num">{{ historicalData.OpeningPrice }}</div>
      </div>

      <!--收盘价-->
      <div>
        <div class="fw-bold">{{ _t18(`exchange.close`) }}</div>
        <div class="ff-num">{{ historicalData.ClosingPrice }}</div>
      </div>
    </div>

    <!--底部二维码分享-->
    <div class="transaction-qrcode">
      <div class="number-one-logo">
        <div class="logo-one">
          <Logo></Logo>
        </div>
      </div>
      <div class="introduction">
        <div class="info">
          <div class="title fw-bold">{{ _getConfig('_APP_META_TITLE') }}</div>
          <div class="link">{{ historicalData.QrCode }}</div>
        </div>
      </div>
      <div class="qrcode">
        <QRCode :address="historicalData.QrCode"></QRCode>
      </div>
    </div>
  </div>
</template>
<script setup>
import html2canvas from 'html2canvas'
import { _isRFD, _t18 } from '@/utils/public'
import QRCode from '@/components/common/QRCode/index.vue'

const props = defineProps({
  historicalData: {
    type: Object,
    default: {
      profitAndLossAmount: '0.00', // 盈亏金额
      TransactionType: `BTC/USDT`, // 交易类型
      CurrencyName: `平多`, // 币种名
      OpeningPrice: '0.00', // 开仓价格
      ClosingPrice: '0.00', // 平仓价格
      QrCode: ``, // 二维码
      bgType: `1`, //背景类型，此参数当为用户设置， 暂定1 为默认白色
      currencyUnit: '' // 货币单位
    }
  }
})

// 生成并下载
const downloadImg = () => {
  const divDom = document.getElementById('html-canvas')
  html2canvas(divDom, {
    backgroundColor: null,
    useCORS: true
  }).then((canvas) => {
    // 最终生成图片的 url
    let showImg = canvas.toDataURL('image/png')
    let a = document.createElement('a') // 创建a标签
    a.href = showImg
    a.download = `${+new Date()}.png` // 设置图片名称
    a.click()
  })
}
</script>

<style lang="scss" scoped>
.share-commission {
  position: relative;
  padding: 20px 15px;
  .download {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 20px;
  }
  .share-img-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    :deep(.img) {
      width: 180px;
      height: 180px;
    }
    .desc {
      font-size: 20px;
      margin-top: 5px;
    }
  }
  .transaction-info {
    display: flex;
    padding: 0 15px;
    & > div {
      flex: 1;
      text-align: center;
      & > div:first-child {
        font-size: 14px;
        margin: 20px 0 5px;
      }
    }
    & > div:first-child {
      text-align: left;
    }
    & > div:last-child {
      text-align: right;
    }
  }
  .transaction-qrcode {
    padding-top: 20px;
    display: flex;
    .number-one-logo {
      margin-top: 10px;
    }
    .introduction {
      flex: 1;
      margin-left: 10px;
      .info {
        .title {
          font-size: 16px;
          margin: 10px 0;
        }
        .link {
          word-break: break-all;
        }
      }
    }
    .qrcode {
      :deep(.erweima) {
        border: none;
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
