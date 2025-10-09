<!--分享委托详情-->
<template>
  <div class="share-commission" id="html-canvas">
    <div class="share-img-box">
      <image-load filePath="share.png" class="img"></image-load>
      <div
        :class="[
          'desc',
          _isRFD(
            historicalData.OpeningPrice,
            historicalData.ClosingPrice,
            historicalData.type == 0 ? 'buy' : 'sell'
          )
        ]"
      >
        {{ historicalData.profitAndLossAmount + historicalData.currencyUnit }}
      </div>
    </div>
    <!-- 下载-->
    <svg-load name="download" class="download" @click="downloadImg"></svg-load>

    <!--交易单详情-->
    <van-grid :column-num="3" :border="false" class="transaction-details">
      <!--交易类型-->
      <van-grid-item>
        <div style="text-align: right">{{ historicalData.TransactionType }}</div>
        <div>{{ historicalData.CurrencyName }}</div>
      </van-grid-item>

      <!--开仓价-->
      <van-grid-item>
        <div>{{ _t18(`average_opening_price`) }}</div>
        <div>{{ historicalData.OpeningPrice }}</div>
      </van-grid-item>

      <!--收盘价-->
      <van-grid-item>
        <div>{{ _t18(`exchange.close`) }}</div>
        <div>{{ historicalData.ClosingPrice }}</div>
      </van-grid-item>
    </van-grid>

    <!--底部二维码分享-->
    <van-row class="transaction-details">
      <van-col span="5" class="number-one-logo">
        <div class="logo-one">
          <Logo></Logo>
        </div>
      </van-col>
      <van-col span="10" class="introduction">
        <div class="ccc">
          <div style="text-align: left">{{ _getConfig('_APP_META_TITLE') }}</div>
          <div style="text-align: left" class="ccc_link">{{ historicalData.QrCode }}</div>
        </div>
      </van-col>
      <van-col span="8" class="qrcode">
        <QRCode :address="historicalData.QrCode"></QRCode>
      </van-col>
    </van-row>
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
      font-size: 18px;
      margin-top: 5px;
      font-weight: bold;
    }
  }

  .transaction-details {
    margin-top: 15px;
    :deep(.van-grid-item__content) {
      background-color: var(--ex-default-background-color);
    }
    :deep(.van-grid-item__content--center) {
      padding: 0;
    }

    .number-one-logo {
      position: relative;

      .logo-one {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    div {
      font-size: 14px;
      padding: 0 0 5px 0;
      text-align: center;
      width: 100%;
    }

    .introduction {
      position: relative;

      div {
        font-size: 14px;
      }

      .ccc {
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .ccc_link {
          word-break: break-all;
        }
      }
    }
  }

  .download {
    position: absolute;
    font-size: 16px;
    top: 15px;
    right: 15px;
    color: #fff;
  }

  .qrcode {
    :deep(.erweima) {
      height: 2rem;
      width: 2rem;
      border: none;
    }
  }
}
</style>
