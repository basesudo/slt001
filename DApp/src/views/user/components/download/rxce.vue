<script setup>
import { onMounted } from 'vue'
import QRCode from '@/components/common/QRCode/index.vue'
import { useMainStore } from '@/store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPlatform } from '@/utils/index'
import { _t18 } from '@/utils/public'

const mainStore = useMainStore()
/**
 * 下载列表
 */
const downLoadList = computed(() => {
  let data = []
  if (mainStore.getDownLoadList.length) {
    data = mainStore.getDownLoadList
      .map((item) => {
        return {
          icon: `${item.name}.png`,
          path: item.url,
          isOpen: item.isOpen,
          name: item.name,
          label: item.name === 'android' ? `${_t18('android_download')}` : `${_t18('ios_download')}`
        }
      })
      .filter((item) => item.isOpen == 'true')
  }
  return data
})
const route = useRoute()
const showFlag = ref(route.query.flag)

/**
 * 下载地址
 */
const address = ref('')
const handleClick = (url) => {
  address.value = url
  window.open(url)
}

onMounted(() => {
  const platform = getPlatform()
  let downloadUrl = downLoadList.value?.find((item) => item.name === 'android')?.path
  if (platform === 'IOS') {
    downloadUrl = downLoadList.value?.find((item) => item.name === 'apple')?.path
  }
  address.value = downloadUrl
})
</script>
<template>
  <div class="container">
    <image-load filePath="xiazaiimg.png" :platform="['rxce']" class="img-bg"></image-load>
    <div class="content">
      <div class="toBack" v-if="showFlag" @click="$router.push('/')">
        <svg-load name="back-white" class="back"></svg-load>
      </div>
      <div class="title mt30">{{ _t18('multi_platform_terminal') }}</div>
      <div class="title">{{ _t18('trade_anytime_anywhere') }}</div>
      <div class="sub-title">{{ _t18('covering_ios_android') }}</div>
      <div class="sub-title_bottom">{{ _t18('supports_full_business') }}</div>
      <div class="btn-list" v-if="downLoadList.length">
        <div
          class="item"
          v-for="item in downLoadList"
          :key="item.path"
          @click="handleClick(item.path)"
        >
          <div class="btn-img-box">
            <image-load :filePath="item.icon" :platform="['rxce']" class="btn-img"></image-load>
          </div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
      <!-- 二维码 -->
      <div class="erweima">
        <QRCode :address="address"></QRCode>
      </div>
      <div class="info">{{ _t18('scan_qrcode_download') }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  .img-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    .toBack {
      margin-top: 30px;
      margin-left: 20px;
      .back {
        font-size: 18px;
      }
    }
    .mt30 {
      margin-top: 30px;
    }
    .title {
      margin: 0 auto;
      text-align: center;
      font-size: 28px;
      padding: 0 20px;
    }
    .sub-title {
      font-size: 15px;
      padding: 0 20px;
      text-align: center;
      margin: 30px auto 0;
    }
    .sub-title_bottom {
      font-size: 15px;
      padding: 0 20px;
      text-align: center;
      margin: 0 auto;
    }
    .btn-list {
      margin-top: 50px;
      .item {
        display: flex;
        align-items: center;
        padding: 0 51px;
        margin-bottom: 30px;
        .btn-img-box {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          .btn-img {
            width: 22px;
            height: 24px;
          }
        }
        .label {
          font-size: 20px;
          margin-left: 30px;
        }
      }
    }
    .erweima {
      display: inline-block;
      padding: 10px;
      background: transparent;
      border: 1px solid #3e68c4;
      margin-left: 51px;
    }
    .info {
      font-size: 14px;
      margin: 20px 51px;
    }
  }
}
</style>
