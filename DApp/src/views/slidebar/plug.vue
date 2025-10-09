<!-- 推广中心 -->
<template>
  <div v-if="NO_SHOW_MEMBER.includes(_getConfig('_APP_ENV'))">
    <div class="content">
      <image-load filePath="plugbg.png" class="img-bg"></image-load>
      <div class="toBack" @click="$router.push('/')">
        <svg-load name="back" class="back"></svg-load>
        <div class="code_box">
          <p class="code1 fw-bold">{{ _t18('plug_invite') }}</p>
          <p class="code2">{{ _t18('plug_toInvite') }}</p>
          <div class="erweima">
            <QRCode :address="sharkCode"></QRCode>
          </div>
          <div class="sharkCode">
            <Copy :data="sharkCode">
              <template #copyMsg>
                <!-- 邀请码 -->
                <p class="ff-num">{{ _t18('plug_shareCode') }}：{{ sharkCode }}</p>
              </template>
            </Copy>
          </div>
          <div class="shareLink">
            <p class="ff-num">{{ _t18('plug_shareLink') }}：</p>
            <Copy :data="`${shareLink}${sharkCode}`">
              <template #copyMsg>
                <!-- 推广链接 -->
                <p class="ff-num link">{{ shareLink }}{{ sharkCode }}</p>
              </template>
            </Copy>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <HeaderBar
      :currentName="_t18('plug')"
      :cuttentRight="cuttentRight"
      :border_bottom="false"
      @showPopup="showPopup"
    ></HeaderBar>
    <!-- 团队信息 -->
    <div class="banner">
      <div :class="__theme.value == 'dark' ? 'plugbg' : 'plug_bg'">
        <div class="shareContent">
          <!-- 邀请好友一起赚币 -->
          <p class="shareContent_title fw-bold">{{ _t18('plug_invite', ['aams']) }}</p>
          <!-- 邀请好友，充值即刻获取佣金 -->
          <p class="shareContent_info">{{ _t18('plug_toInvite') }}</p>
          <div class="sharkCode">
            <Copy :data="sharkCode" :contentFix="'start'" :fontSize="'12px'">
              <template #copyMsg>
                <!-- 邀请码 -->
                <p class="ff-num">{{ _t18('plug_shareCode') }}：{{ sharkCode }}</p>
              </template>
            </Copy>
          </div>
          <div class="shareLink" :contentFix="'start'">
            <Copy :data="`${shareLink}${sharkCode}`" :fontSize="'12px'">
              <template #copyMsg>
                <!-- 推广链接 -->
                <p class="ff-num">{{ _t18('plug_shareLink') }}：{{ shareLink }}{{ sharkCode }}</p>
              </template>
            </Copy>
          </div>
          <!-- 分享二维码按钮 -->
          <div class="shareQRBtn">
            <van-button plain color="#fff" size="small" @click="showShareQR = true">
              {{ _t18('plug_shareQR1') || '分享二维码' }}
            </van-button>
          </div>
        </div>
      </div>
      <div v-if="!['das'].includes(_getConfig('_APP_ENV'))">
        <div class="teamInfo">
          <!-- 一代人数 -->
          <div>
            <p>{{ _t18('plug_oneNum', ['aams']) }}</p>
            <span class="ff-num">{{ teamInfo.oneCount || 0 }}</span>
          </div>
          <!-- 二代人数 -->
          <div>
            <p>{{ _t18('plug_twoNum', ['aams']) }}</p>
            <span class="ff-num">{{ teamInfo.twoCount || 0 }}</span>
          </div>
          <!-- 三代人数 -->
          <div>
            <p>{{ _t18('plug_threeNum', ['aams']) }}</p>
            <span class="ff-num">{{ teamInfo.threeCount || 0 }}</span>
          </div>
          <!-- 推广总人数 -->
          <div>
            <p>{{ _t18('plug_sum', ['aams']) }}</p>
            <span class="fw-num">{{ teamInfo.sumCount || 0 }}</span>
          </div>
          <!-- 佣金金额 -->
          <div>
            <p>{{ _t18('plug_amount', ['aams']) }}</p>
            <span class="ff-num">{{ teamInfo.sumAmount || 0 }}</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
    <!-- 分享二维码弹窗 -->
    <van-popup v-model:show="showShareQR" round>
      <div class="qrPopup">
        <p class="qrTitle fw-bold">{{ _t18('plug_toInvite') || '截图分享给好友' }}</p>
        <QRCode :address="inviteUrl"></QRCode>
        <div class="qrLink">
          <p class="ff-num">{{ inviteUrl }}</p>
          <Copy :data="inviteUrl">
            <template #copyMsg>
              <p class="ff-num">{{ _t18('copy') || '复制' }}</p>
            </template>
          </Copy>
        </div>
      </div>
    </van-popup>
    <div v-if="!['das'].includes(_getConfig('_APP_ENV'))">
      <!-- 我的推广 -->
      <div class="promotion_my" v-if="!['bitfly'].includes(_getConfig('_APP_ENV'))">
        <div class="title fw-bold">{{ _t18('plug_myShare', ['aams']) }}</div>
        <Tab
          :tabList="tabList"
          :active="curIndex"
          @change="changeIndex"
          lineWidth="0"
          :flexBetween="true"
        >
          <!-- 加载中动画 -->
          <template #tabContent>
            <div class="header">
              <!--用户ID  返佣金额  注册时间 -->
              <p>{{ _t18('plug_userId') }}</p>
              <p>{{ _t18('plug_back') }}</p>
              <p>{{ _t18('plug_registerTime') }}</p>
            </div>

            <van-loading v-if="showLoading" />
            <Nodata v-if="teamList.length <= 0 && !showLoading"></Nodata>
            <div v-else class="contentBox">
              <div class="content" v-for="(item, index) in teamList" :key="index">
                <p class="ff-num">{{ item.fromId || '' }}</p>
                <p class="ff-num">{{ item.sumAmount || 0 }}</p>
                <!-- <p>{{ item.createTime?_timeFormat(item.createTime, 'HH:mm MM/DD', true):'' }}</p> -->
                <p class="ff-num">
                  {{
                    item.createTime
                      ? _timeFormat(item.params?.createTime, 'YY/MM/DD HH:mm', true)
                      : ''
                  }}
                </p>
              </div>
            </div>
          </template>
        </Tab>
      </div>
    </div>

    <!-- 质押挖矿规则弹窗 -->
    <Popup
      :show="showRule"
      @handelClose="closePopup"
      :title="txt"
      :content="popupContent"
      :direction="direction"
    >
    </Popup>
  </div>
</template>

<script setup>
import { NO_SHOW_MEMBER } from '@/config/index'
import { _t18 } from '@/utils/public'
import HeaderBar from '@/components/HeaderBar/index.vue'
import QRCode from '@/components/common/QRCode/index.vue'
import Copy from '@/components/common/Copy/index.vue'
import Tab from '@/components/Tab/index.vue'
import Popup from '@/components/Popup/index.vue'
import { useUserStore } from '@/store/user/index'
import { getAgentInfo, getAgentList } from '@/api/plug.js'
import { onMounted, computed, ref } from 'vue'
import { rulesList } from '@/api/common/index'

// 获取当前主题
const __theme = computed(() => window.__theme || 'light')

const cuttentRight = { iconRight: [{ iconName: 'guize', clickTo: '' }] }
const useStore = useUserStore()
const userInfo = useStore.userInfo
// 响应式邀请码，避免首次为空不生成二维码
const sharkCode = computed(() => useStore.userInfo?.user?.activeCode || '')
// 推广链接前缀改为 connect-wallet 路由，支持路径参数携带邀请码
// const shareLink = `${import.meta.env.VITE_APP_PLANFORM_H5}/#/connect-wallet/`
const shareLink = `${location.origin}/#/connect-wallet/`
// 分享二维码弹窗
const showShareQR = ref(false)
const inviteUrl = computed(() => `${shareLink}${sharkCode.value}`)
// 推广中心数据
const showLoading = ref(true)
const teamInfo = ref({})
const teamList = ref([])
const popupContent = ref({})
const getTeamInfo = async () => {
  const res = await getAgentInfo()
  if ((res.code = '200')) {
    teamInfo.value = res.data
  }
}
const getTeamList = async () => {
  showLoading.value = true
  const res = await getAgentList({ params: { leve: curIndex.value + 1 } })
  if ((res.code = '200')) {
    setTimeout(() => {
      showLoading.value = false
      teamList.value = res.data
    }, 500)
  }
}
const getPopupContent = async () => {
  const res = await rulesList('PROMOTION_CENTER_EXPLAIN')
  if ((res.code = '200')) {
    popupContent.value = res.data
  }
}
onMounted(() => {
  getTeamInfo()
  getTeamList()
  getPopupContent()
})
// const teamInfo = computed(() => {
//   let obj = {}
//   obj = { one: 10, two: 20, three: 30, sum: '60', amount: 10000000 }
//   return obj
// })
const showRule = ref(false)
const txt = _t18('plug_rule') //规则
const direction = ref('bottom')
let showPopup = () => {
  showRule.value = true
}
let closePopup = () => {
  showRule.value = false
}
const manual = computed(() => {
  let list = []
  list = [
    {
      title: '推广规则',
      content: [
        {
          childContent:
            '如果用户使用了您的邀请码注册，即为您的下级。这个用户再次的邀请用户，即为您的二级下级。 of Stake，即权益证明）机制产生的奖励。在这个机制中，用户将数字资产委托给节点，节点在区块链上行使出块、打包交易等权利并获得奖励。用户根据锁仓数量按比例分享节点获得的奖励。'
        }
      ]
    },
    {
      title: '推广奖励',
      content: [
        {
          childContent:
            '如果用户使用了您的邀请码注册，即为您的下级。这个用户再次的邀请用户，即为您的二级下级。'
        },
        {
          childTitle: '1.下级充值奖励。',
          childContent: '您的下级进行充值，您即可获得他充值金额的1%作为奖励。'
        },
        {
          childTitle: '2.下级挖矿奖励。',
          childContent: '您的下级，如果进行了锁仓挖矿。那么你也可以获得对应的收益。'
        }
      ]
    },
    {
      title: '例：A-B-C-D-E..',
      content: [
        {
          childContent: 'A可以获得B收益的3%'
        },
        {
          childContent: 'A可以获得C收益的2%'
        },
        {
          childContent: 'A可以获得D收益的1%'
        },
        {
          childContent: 'B可以获得C收益的3%'
        },
        {
          childContent: 'B可以获得D收益的2%'
        },
        {
          childContent: 'B可以获得E收益的1%'
        }
      ]
    }
  ]
  return list
})
const curIndex = ref(0)
const tabList = computed(() => {
  let list = []
  // list = ['一代', '二代', '三代']
  list = [_t18('plug_one', ['aams']), _t18('plug_two', ['aams']), _t18('plug_three', ['aams'])]
  return list
})
const changeIndex = (v) => {
  curIndex.value = v
  teamList.value = []
  getTeamList()
}
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-default-font-color);
  font-size: 14px;
}

  .content {
    font-size: 0;
    min-height: 6vh;
    position: relative;

  .img-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  .toBack {
    position: absolute;
    margin-top: 30px;
    margin-left: 20px;

    .back {
      font-size: 18px;
    }
  }

  .code_box {
    min-width: 300px;
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;

    p.code1 {
      font-size: 18px;
      text-align: center;
    }

    p.code2 {
      font-size: 12px;
      text-align: center;
      color: #b5b5b5;
      margin-top: 10px;
    }

    .erweima {
      padding: 20px 0;

      p {
        margin-top: -25px;
        font-size: 20px;
        text-align: center;
        font-weight: bold;
      }
    }

    .link {
      word-break: break-all;
    }
  }
}

.banner {
  .plug_bg {
    background: url('../../../public/resource/images/dark/plugbg.png') no-repeat center;
    background-size: cover;
    padding: 45px 15px 20px;

      .shareContent {
        width: 60%;

      .shareContent_title {
        font-size: 20px;
        color: var(--ex-font-color8);
      }

      .shareContent_info {
        font-size: 14px;
        color: var(--ex-font-color8);
        padding: 10px 0 30px;
      }

      .sharkCode,
      .shareLink {
        p {
          line-height: 1.2;
          font-size: 12px;
          word-break: break-all;
          color: var(--ex-font-color8);
          // word-wrap:break-word;
          // word-break:normal;
        }
      }

        .shareQRBtn {
          margin-top: 8px;
          :deep(.van-button) {
            background: transparent !important;
            border: 1px solid #fff !important;
            color: #fff !important;
            border-radius: 10px !important;
          }
        }
    }
  }

  .plugbg {
    background: url('../../../public/resource/images/dark/plugbg.png') no-repeat center;
    background-size: cover;
    padding: 45px 15px 20px;

      .shareContent {
        width: 60%;

      .shareContent_title {
        font-size: 20px;
        color: var(--ex-font-color6);
      }

      .shareContent_info {
        font-size: 14px;

        padding: 10px 0 30px;
      }

      .sharkCode,
      .shareLink {
        p {
          line-height: 1.2;
          font-size: 12px;
          word-break: break-all;
          // word-wrap:break-word;
          // word-break:normal;
        }
      }

        .shareQRBtn {
          margin-top: 10px;
          :deep(.van-button) {
            background: transparent !important;
            border: 1px solid #fff !important;
            color: #fff !important;
          }
        }
    }
  }

  img {
    width: 100%;
    height: auto;
  }

  .teamInfo {
    padding: 15px 0 0;
    display: flex;
    flex-wrap: wrap;

    & > div {
      width: 33.33%;
      padding: 15px 5px;
      text-align: center;
      // flex: 1;
      p {
        height: 30px;
        color: var(--ex-passive-font-color);
        margin-bottom: 15px;
        word-wrap: break-word;
      }

      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}

.qrPopup {
  padding: 20px;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .qrTitle {
    font-size: 14px;
    margin-bottom: 12px;
    color: var(--ex-font-color6);
    text-align: center;
  }
  .qrLink {
    margin-top: 10px;
    word-break: break-all;
    text-align: center;
    p {
      font-size: 12px;
      color: var(--ex-passive-font-color);
      margin-bottom: 8px;
    }
  }
}

.promotion_my {
  .title {
    padding: 25px 15px 20px;
    color: var(--ex-font-color6);
    font-weight: bold;
    font-size: 16px;
  }

  .header {
    padding: 15px 15px 10px;
    display: flex;

    & > p:first-child {
      text-align: left;
    }

    & > p:last-child {
      text-align: right;
    }

    p {
      font-size: 12px;
      flex: 1;
      color: var(--ex-passive-font-color);
      text-align: center;
    }
  }

  .contentBox {
    max-height: 400px;
    overflow: auto;
  }

  .content {
    padding: 5px 0;
    display: flex;
    border-bottom: 1px solid var(--ex-border-color);

    & > p:first-child {
      text-align: left;
    }

    & > p:last-child {
      text-align: right;
    }

    p {
      padding: 8px 15px;
      font-size: 12px;
      flex: 1;
      text-align: center;
      font-weight: 400;
      margin: 0;
    }
  }
}

.van-loading {
  text-align: center;
  padding: 30px;
}

:deep(.van-tab) {
  color: var(--ex-home-list-ftcolor) !important;
}

:deep(.van-tab--active) {
  color: var(--ex-home-list-ftcolor3) !important;
}

/* 覆盖 Tab 组件中 tabContent p 的默认 padding */
:deep(.tabContent p) {
  padding: 0 !important;
}
</style>
