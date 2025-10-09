<template>
  <div :class="DIFF_HOME_BANNER.includes(_getConfig('_APP_ENV')) ? 'main mainEbc' : 'main'">
    <div
      class="item"
      v-for="item in menuList"
      :key="item.img"
      @click="routeLink(item.linkUrl, item.flag)"
    >
      <image-load :filePath="item.imgUrl" :name="item.img" class="itemImg" />
      <div class="itemName text-ellipsis2">
        {{ _t18(`${item.key}`, ['robinhood2']) }}
      </div>
    </div>
  </div>
  <!-- 公告 -->
  <div class="notice">
    <div class="itemNo">
      <svg-load name="mengbanzu12" class="noticeImg"></svg-load>
      <van-notice-bar class="currentNotice" :text="currentNotice" />
    </div>
  </div>
  <div class="linkList">
    <div class="linkLeft">
      <!-- 快捷充币 -->
      <div class="item" @click="toRecharge">
        <svg-load name="mengbanzu13" class="leftImg"></svg-load>
        <div class="right">
          <div class="top">{{ _t18(`home_recharge`, ['latcoin', 'aams', 'robinhood2']) }}</div>
          <!-- <div>{{ _t18(`clickto_recharge`) }}</div> -->
        </div>
      </div>
      <!-- 快速提币 -->
      <div class="item rightItem" @click="$router.push('/withdraw')">
        <svg-load name="zu29" class="leftImg"></svg-load>
        <div class="right">
          <div class="top">{{ _t18(`quick_withdrawal`, ['latcoin', 'aams', 'robinhood2']) }}</div>
          <!-- <div>{{ _t18(`Click_withdraw_coins`) }}</div> -->
        </div>
      </div>
    </div>
    <!-- 在线客服 -->
    <div class="linkRight" @click="dispatchCustomEvent('event_serviceChange')">
      <svg-load name="zu447" class="itemImg"></svg-load>
      <div style="scale: 0.8; text-align: center">{{ _t18(`home_service`) }}</div>
    </div>
    <InfoPopup :show="showInfoPopup" :data="infoData" @closeBtn="closeBtn"></InfoPopup>
    <!-- 直播弹窗 -->
    <van-popup v-model:show="showNotice" round closeable>
      <div class="showNoticeContent">
        <p class="showNoticeContent_title fw-bold">
          {{ showNoticeContent?.noticeTitle || '' }}
        </p>
        <div class="showNoticeContent_content">
          <image-load :filePath="showNoticeContent?.imgUrl" v-if="showNoticeContent?.imgUrl" />
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { DIFF_RECHARGE_COSTORM, DIFF_HOME_BANNER } from '@/config/index'
import { publiceNotice } from '@/api/common/index'
import { onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/index.js'
import { useUserStore } from '@/store/user/index'
import { getInfo } from '@/api/info.js'
import { noticeList } from '@/api/common/index'
import { _t18, _toView } from '@/utils/public'
import InfoPopup from '@/views/home/components/InfoPopup.vue'
import { dispatchCustomEvent } from '@/utils'

const mainStroe = useMainStore()
const userStore = useUserStore()
const tokenStatus = ref(userStore.isSign)
const $router = useRouter()
// DeFi挖矿 质押挖矿 助力货 闪兑 下载中心 推广中心 秒合约 理财 申购 直播 福利活动
const menuList = computed(() => {
  let tempData = mainStroe.getJinGangList.filter((item) => {
    return item.isOpen == true
  })
  return tempData
})
const currentNotice = ref('')
const routeLink = (link) => {
  if (link === 'live' && showNoticeContent.value) {
    // showNotice.value=true
    getOpenPopupContent()
  } else if (link === '/trade') {
    mainStroe.setTradeStatus(Number(0))
    $router.push(link)
  } else if (link.includes('http')) {
    location.href = link
  } else {
    $router.push(link)
  }
}
const showInfoPopup = ref(false)
const closeBtn = () => {
  showInfoPopup.value = false
}
const infoData = ref([])
/**
 * 用户信息改变监听回调事件
 * @param {*} e
 */
const event_userInfoChange = (e) => {
  getInfoList()
}

const getInfoList = async () => {
  if (tokenStatus.value) {
    let res = await getInfo()
    if (res.code == '200' && res.rows.length > 0) {
      console.log(res.rows)
      infoData.value = res.rows
      showInfoPopup.value = true
    }
  }

  // getInfo().then((res) => {
  //   if (res.code == 200) {
  //     infoData.value = res.rows
  //     showInfoPopup.value = true
  //   }
  // })
}
getInfoList()
/**直播弹窗内容 */
const showNotice = ref(false)
const showNoticeContent = ref({})
const getOpenPopupContent = async () => {
  const res = await publiceNotice('POP_UPS_NOTICE', 'DEFI_POP_UPS_NOTICE')
  if ((res.code = '200')) {
    if (res.data.length) {
      showNotice.value = true
      showNoticeContent.value = res.data[0]
    }
  }
}
onMounted(async () => {
  try {
    const res = await noticeList('ROLL_NOTICE')
    if (res.code === 200) {
      if (res.data.length > 0 && res.data[0].status == '0')
        currentNotice.value = res.data[0].noticeContent
    }
  } catch (error) {}
  document.addEventListener('event_userInfoChange', event_userInfoChange)
  // getInfoList()
})

onUnmounted(() => {
  document.removeEventListener('event_userInfoChange', event_userInfoChange)
})
/**
 * 点击快捷充币
 */
const toRecharge = () => {
  if (DIFF_RECHARGE_COSTORM.includes(__config._APP_ENV)) {
    if (tokenStatus.value) {
      dispatchCustomEvent('event_serviceChange')
    } else {
      _toView('/sign-in')
    }
  } else {
    _toView('/recharge')
  }
}
</script>
<style lang="scss" scoped>
.main {
  padding: 106px 0px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 22px;

    .itemImg {
      width: 26.5px;
      height: 26.5px;
    }

    .itemName {
      margin-top: 7.5px;
      font-size: 12.5px;
      color: var(--ex-default-font-color);
      text-align: center;
      width: 60px;
      word-break: break-word;
      font-family: 'DINOT-Medium', 'Arial', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      letter-spacing: 0.5px;
    }
  }
}

.mainEbc {
  padding-top: 0;
}

.notice {
  padding: 0;
  width: 100%;

  .itemNo {
    display: flex;
    height: 35px;
    align-items: center;
    background: transparent;
    border-radius: 0;
    width: 100%;

    .noticeImg {
      margin-left: 15px;
      width: 18.5px;
      height: 18.5px;
    }

    :deep(.van-notice-bar) {
      height: 35px;
      padding: 0 15px 0 10px;
      width: 100%;
    }

    .currentNotice {
      flex: 1;
      border-radius: 0;
      font-size: 14px;
      color: var(--ex-home-notice-color);
      background: transparent;
    }
  }
}

.linkList {
  padding: 20px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .linkLeft {
    min-height: 55px;
    flex: 1;
    display: flex;

    .item {
      flex: 1;
      display: flex;
      align-items: center;
      border-radius: 5px 5px 5px 5px;
      padding: 10px 12px;
      background: var(--ex-home-box-background-color2);

      .leftImg {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }

      .right {
        font-size: 12px;
        color: #888888;

        .top {
          font-size: 14px;
          color: var(--ex-home-font-color);
        }
      }
    }

    .rightItem {
      margin-left: 14px;
      background-color: var(--ex-home-box-background-color);
      border: 1px solid var(--ex-home-box-border-color);

      .right {
        .top {
          color: var(--ex-default-font-color);
        }
      }
    }
  }

  .linkRight {
    max-width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: var(--ex-default-font-color);
    margin-left: 10px;

    .itemImg {
      width: 22px;
      height: 22px;
      margin-bottom: 5px;
    }
  }
}
.showNoticeContent {
  min-width: 300px;
  text-align: center;
  .showNoticeContent_title {
    font-size: 18px;
    padding: 15px 0;
    border-bottom: 1px solid #e1e1e1;
    font-weight: normal;
  }
  .showNoticeContent_content {
    padding: 20px 15px 30px;
    max-height: 400px;
  }
}
</style>