<!-- 首页 -->
<template>
  <div>
    <van-popup v-model:show="show" position="left" class="sidebar" @close="closeSideBar">
      <SideBar @closeSideBar="closeSideBar"></SideBar>
    </van-popup>
    <div class="carousel">
      <van-swipe :autoplay="3000" lazy-render :loop="true" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in carouselList" :key="index">
          <image-load :filePath="item.imgUrl" alt="" class="carouselItem" @click="linkto(item)" />
        </van-swipe-item>
      </van-swipe>
      <div class="top">
        <div @click="$router.push('/home')">
          <Logo></Logo>
        </div>
        <div class="rightBox" v-if="walletAddress" @click="openSideBar">
          <div class="walletAddr fw-num">{{ _hideAddress(walletAddress) }}</div>
          <img src="/resource/images/light/avatar.png" alt="avatar" class="rightImg" />
        </div>
        <div v-else class="rightConnect" @click="$router.push('/connect-wallet')">{{ _t18('Connect_wallet') }}</div>
    </div>
  </div>
  <div class="currentList">
    <div
      class="item centerItem"
      v-for="(item, index) in dataList"
      :key="index"
      @click="linkTo(item)"
    >
        <div class="itemTop fw-num">{{ item.showSymbol }}</div>
      <div
        :class="[
          _isRFD(
            tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
            tradeStore.allCoinPriceInfo[item.coin]?.close
          ),
            'rfd-sign itemMain fw-num'
        ]"
      >
        {{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%
      </div>
      <div
        :class="[
          _isRFD(
            tradeStore.allCoinPriceInfo[item.coin]?.open,
            tradeStore.allCoinPriceInfo[item.coin]?.close
          ),
          'itemFooter fw-num'
        ]"
      >
        {{ tradeStore.allCoinPriceInfo[item.coin]?.close }}
        <Sparkline :symbol="item.coin" :height="24" />
        </div>
      </div>
    </div>
  </div>
 
</template>
<script setup>
import { useTradeStore } from '@/store/trade/index'
import { useMainStore } from '@/store/index.js'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { publiceNotice } from '@/api/common/index'
import { computed } from 'vue'
import SideBar from '@/views/home/sidebar/index.vue'
import Sparkline from '@/components/common/Sparkline/index.vue'
import { useUserStore } from '@/store/user/index'
import { _hideAddress, _t18 } from '@/utils/public'
import { getAcount } from '@/plugin/chain'
import { signUp } from '@/api/user'
import { dispatchCustomEvent } from '@/utils'
import { showToast } from 'vant'
// 移除连接钱包弹窗改为独立页面
const show = ref(false)
const openSideBar = () => {
  show.value = true
}
const closeSideBar = () => {
  show.value = false
}
const tradeStore = useTradeStore()
const mainStroe = useMainStore()
const $router = useRouter()
const userStore = useUserStore()
const walletAddress = computed(() => userStore.userInfo.user?.address)

// 顶部连接钱包
const connectWalletTop = async () => {
  const acountRes = await getAcount()
  if (acountRes === 'no-wallet') {
    showToast(_t18('Please_access_wallet'))
    return
  }
  let params = { signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
  try {
    const singUpRes = await signUp(params)
    if (singUpRes.code == 200 && singUpRes.data.satoken) {
      dispatchCustomEvent('event_toastChange', { name: 'login_success' })
      let token = singUpRes.data.satoken
      userStore.setIsSign(true)
      userStore.setToken(token)
      userStore.getUserInfo()
    } else {
      showToast(singUpRes.msg)
    }
  } catch (error) {
    console.log(error)
  }
}

const dataList = computed(() => {
  // let tempFilterKey = Object.keys(tradeStore.allCoinPriceInfo)
  //   .filter((key) => tradeStore.allCoinPriceInfo[key]?.priceChangePercent > 0)
  //   .slice(0, 3)
  let tempData = []
  let tempFilterKey = mainStroe.getHomeCoinList.map((item) => {
    if (item.isOpen == 'true') {
      return item.coin
    }
  })
  // let tempData = tradeStore.secondContractCoinList.filter((elem) =>
  //   tempFilterKey.includes(elem.coin)
  // )
  tempFilterKey.forEach((elem) => {
    tradeStore.secondContractCoinList.forEach((elem2) => {
      if (elem2.coin == elem) {
        tempData.push(elem2)
      }
    })
  })
  return tempData
})

const linkTo = (item) => {
  mainStroe.setTradeStatus(Number(0))
  $router.push(`/trade?symbol=${item.coin}`)
}
const carouselList = ref([])
// 轮播图跳转
const linkto = (detail) => {
  if (detail.noticeContent && detail.noticeContent !== '<p><br></p>') {
    $router.push(`/broadcastDetails?id=${detail.noticeId}`)
  } else {
    $router.push(`${detail.detailUrl}`)
  }
}

onMounted(async () => {
  try {
    const res = await publiceNotice('ACTIVITY_NOTICE', 'HOME_ACTIVITY ')
    if (res.code === 200) {
      carouselList.value = res.data.filter((item) => {
        return item.status != '1'
      })
    }
  } catch (error) {}
})
</script>
<style lang="scss" scoped>
.connect-title {
  font-size: 17px;
  padding: 0 16px;
}
.connect-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
}
.copy-link-btn {
  font-size: 12px;
  color: var(--ex-default-font-color);
  padding: 6px 10px;
  border: 1px solid var(--ex-home-box-border-color);
  border-radius: 14px;
  background: var(--ex-home-box-background-color);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.copy-icon { opacity: 0.6; }
.connect-content {
  padding: 0 0 12px;
  .wallet-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 16px;
    background: var(--ex-home-box-background-color2);
    border-radius: 25px;
    margin-bottom: 10px;
    .wallet-icon {
      width: 24px;
      height: 24px;
    }
    .wallet-name {
      flex: 1;
      font-size: 15px;
      color: var(--ex-default-font-color);
    }
    .tag {
      font-size: 12px;
      color: #fff;
      background: #17ac74;
      padding: 3px 8px;
      border-radius: 999px;
    }
  }
  .connect-bottom {
    text-align: center;
    color: var(--ex-font-color9);
    margin-top: 16px; /* 整体下移 */
    .no-wallet { margin: 12px 0 6px; }
    .start-link { color: #000; text-decoration: underline; margin-left: 4px; }
    .cancel { margin-top: 12px; color: var(--ex-default-font-color); }
  }
}
:deep(.sidebar) {
  margin-top: -1px;
  max-width: var(--ex-max-width);
  width: 100%;
  left: auto;
  height: 100%;
}

.carousel {
  height: 200px;

  .carouselItem {
    height: 200px;
    width: 100%;
    object-fit: cover;
}

.top {
  height: 52px;
  background: var(--ex-home-box-background-color3);
  padding: 15px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  box-sizing: border-box;
  /* 减去两侧的间距 */
  .leftImg {
    width: 25px;
    height: 25px;
  }

  .centerImg {
    width: 56px;
    height: 14px;
    margin-left: 5px;
  }

  .rightImg {
    width: 33px;
    height: 33px;
  }
  .rightBox {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .walletAddr {
    font-size: 12px;
    color: var(--ex-default-font-color);
    font-family: Inter, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Helvetica, Arial,
      system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
    letter-spacing: 0.2px;
    font-weight: 500;
  }
  .rightConnect {
    font-size: 14px;
    color: var(--ex-default-font-color);
    padding: 6px 14px;
    border: 1px solid var(--ex-home-box-border-color);
    border-radius: 18px;
    background: var(--ex-home-box-background-color);
  }
}
}

// 添加轮播图容器样式
:deep(.van-swipe) {
  margin-top: 52px;  // 为顶部导航栏留出空间
}

.currentList {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  top: 249px;
  /* 背景已移除 */
  display: flex;
  padding: 10px 12px;
  overflow-x: auto;
  overflow-y: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
  /* 圆角*/
  background-color: var(--ex-home-box-background-color);
  border: 1px solid var(--ex-home-box-border-color);
  // border-radius: 5px; 

  .item {
    flex: 0 0 25%;
    min-width: 25%;
    display: flex;
    flex-direction: column;

    .itemTop {
      font-size: 13px;
      color: var(--ex-default-font-color);
      font-weight: 400;
    }

    .itemMain {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 400;
      width: 100%;
      text-align: center;

      .itemMainImg {
        width: 24px;
        height: 24px;
        margin-right: 5px;
      }
    }

    .itemFooter {
      display: flex;
      font-size: 13px;
      margin-top: 4px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      text-align: center;
    }
  }

  .centerItem {
    justify-content: center;
    align-items: center;
  }
}
</style>
