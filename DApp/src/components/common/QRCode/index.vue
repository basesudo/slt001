<!-- 生成二维码 -->
<template>
  <div class="box">
    <div class="erweima">
      <img :src="qrCodeImg" alt="" />
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode'
import { watch } from 'vue'
const props = defineProps({
  address: {
    type: String,
    default: ''
  }
})

const qrCodeImg = ref('')
/**
 * 生成二维码
 * @param {*} address
 */
const createQRImage = (address) => {
  if (address) {
    QRCode.toDataURL(address, {
      version: '', // 二维码版本。如果未指定，将计算更合适的值。
      errorCorrectionLevel: 'H', // 纠错级别。low, medium, quartile, high , L, M, Q, H
      maskPattern: 2, // 二维码内边距，0、1、2、3、4、5、6、7
      margin: 2, // 边距
      scale: 3, // 每一个黑点的宽度
      height: 170, //二维码高度
      width: 170, //二维码宽度
      scal: 200,
      color: {
        dark: '#000', // 二维码背景颜色
        light: '#fff' // 二维码前景颜色
      }
    }).then((url) => {
      qrCodeImg.value = url
    })
  }
}
watch(
  () => props.address,
  (newVal) => {
    createQRImage(newVal)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  // padding: 50px 0;
  .erweima {
    font-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 170px;
    height: 170px;
    border: 1px solid var(--ex-border-color4);
    img {
      width: 100%;
    }
  }
}
</style>
