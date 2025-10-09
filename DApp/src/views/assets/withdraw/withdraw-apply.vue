<!-- 提现申请 -->
<template>
  <HeaderBar :currentName="currentName" :cuttentRight="cuttentRight"></HeaderBar>
  <Amount :amount="amount" :coin="$route.query.type?.toUpperCase()"></Amount>
  <van-action-sheet
      v-model:show="showSheet"
      @select="onSelect"
      :closeable="false"
      style="max-width: var(--ex-max-width); left: 50%; translate: -50%"
  >
    <div class="sheetBox">
      <!-- 选择银行卡 -->
      <div class="title fw-bold">{{ _t18('withdraw_select_card') }}</div>
      <div
          v-for="(item, index) in bankList"
          :key="index"
          class="sheetContent"
          @click="selectSheet(item)"
      >
        <svg-load :name="$route.query.icon" class="coin"></svg-load>
        <div>
          <p class="bankName">{{ item?.bankName }} <span class="scl" v-if="item?.coin">（{{ item?.coin }}）</span></p>
          <p class="cardNumber fw-num">{{ hideBank(item?.cardNumber) }}</p>
        </div>
      </div>
    </div>
  </van-action-sheet>
  <div class="content">
    <div class="form">
      <div class="coin">
        <!-- 提现币种 -->
        <div class="top coin-top">{{ _t18('withdraw_coin', ['bitmake']) }}
          <span class="scl" v-if="$route.query.icon == 'card' && curBank?.coin">（{{ curBank?.coin }}）</span>
          <span class="scl" v-else>（{{ $route.query.type }}）</span>
        </div>
        <div class="bottom" v-if="$route.query.icon != 'card'">
          <div class="left">
            <svg-load :name="$route.query.icon" class="coin"></svg-load>
            <div class="title">{{ $route.query.type }}</div>
          </div>
        </div>
        <div class="bottom2" v-else @click="showSheet = true">
          <!-- {{ curBank }} -->
          <svg-load :name="$route.query.icon" class="coin"></svg-load>
          <div>
            <p class="bankName">{{ curBank?.bankName }}</p>
            <p class="cardNumber fw-num">
              {{ hideBank(curBank?.cardNumber || '') }}
              <svg-load name="jiantou" class="jiantou"></svg-load>
            </p>
          </div>
        </div>
      </div>
      <div class="num">
        <!-- 提现数量 -->
        <div class="top">{{ _t18('withdraw_num', ['bitmake']) }}</div>
        <div class="bottom">
          <input
              type="number"
              v-model="allAmount"
              :placeholder="_t18('withdraw_input')"
              class="ff-num"
          />
          <p @click="allNum()">{{ _t18('swap_all') }}</p>
        </div>
      </div>
      <div class="address" v-if="$route.query.icon != 'card'">
        <!-- 提现地址 -->
        <div class="top">{{ _t18('withdraw_address') }}</div>
        <div class="bottom">
          <input type="text" v-model="address" :placeholder="_t18('withdraw_input')"/>
        </div>
      </div>
      <div class="password">
        <!-- 提现密码 -->
        <div class="top">{{ _t18('withdraw_pwd', ['rxce']) }}</div>
        <div class="bottom">
          <input
              :type="showk ? 'text' : 'password'"
              v-model="password"
              :placeholder="_t18('withdraw_input')"
          />
          <svg-load
              :name="showk ? 'yanjin-k' : 'yanjin-g'"
              class="yanjing"
              @click="showk = !showk"
          ></svg-load>
        </div>
      </div>
    </div>
    <div class="tip" v-if="!['aams'].includes(_getConfig('_APP_ENV'))">
      <!-- 温馨提示：提现会收取部分手续费，提现后24小时之内 到账，如有疑问请     联系客服-->
      <div>
        {{ _t18('withdraw_tip') }}<span class="customer">{{ _t18('custorm_service') }}</span>
      </div>
      <!-- 手续费 -->
      <div v-if="['coinsexpto'].includes(_getConfig('_APP_ENV'))">
        {{ _t18('withdraw_commission') }}：<span class="ff-num"
      >{{ $route.query.fee || '' }} {{ $route.query.icon.toLocaleUpperCase() }}</span
      >
      </div>
      <div v-else>
        {{ _t18('withdraw_commission') }}：<span class="ff-num">{{ $route.query.ratio }}%</span>
      </div>
    </div>
  </div>
  <div class="btnBox" @click="submit">
    <!-- 确认提现 -->
    <ButtonBar :btnValue="_t18('withdraw_require')"/>
  </div>
</template>

<script setup>
import {DIFF_ISFREEZE, DIFF_WITHDRAW} from '@/config/index'
import {useFreeze} from '@/hook/useFreeze'

const {_isFreeze} = useFreeze()
import {
  getBindCardList,
  haveCacheAddress,
  getCacheStatus,
  saveCacheAddress
} from '@/api/account.js'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import Amount from '../components/applyAmount.vue'
import {withdrawSubmit} from '@/api/account'
import {_toView} from '@/utils/public'
import {priceFormat} from '@/utils/decimal.js'
import {showToast} from 'vant'
import {useUserStore} from '@/store/user/index'
import {storeToRefs} from 'pinia'
import {_t18} from '@/utils/public'
import {useToast} from '@/hook/useToast'
import {filterCoin2} from '@/utils/public'
import {onMounted} from 'vue'
import {useMainStore} from '@/store/index.js'

const mainStore = useMainStore()
const {_toast} = useToast()
const userStore = useUserStore()
userStore.getUserInfo()
// 用户信息
const {userInfo} = storeToRefs(userStore)
// 用户余额信息
const {asset} = storeToRefs(userStore)
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentName = _t18('withdraw', ['latcoin'])
const cuttentRight = {iconRight: [{iconName: 'jilu', clickTo: '/withdraw-order'}]}
const showk = ref(false)

// 银行卡数据
const curBank = ref({})
const showSheet = ref(false)
const selectSheet = (item) => {
  showSheet.value = false
  curBank.value = item
}

const amount = computed(() => {
  let data = 0
  //银行卡提现--> 显示对应币种资产 无则默认显示 usdt资产
  const index = route.query?.icon == 'card' && asset.value.findIndex(item => filterCoin2(item.symbol) == curBank.value.coin?.toLowerCase())

  //查询余额
  for (let i = 0; i < asset.value.length; i++) {
    // 银行卡提现
    if (route.query?.icon == 'card') {

      if (
          asset.value[i].type == 1 &&
          filterCoin2(asset.value[i].symbol) == (index != -1 ? curBank.value.coin?.toLowerCase() : 'usdt')
      ) {
        data = asset.value[i].availableAmount
        route.query.type = (index != -1 ? curBank.value.coin : 'USDT')
      }

    } else {
      // 币种提现
      if (asset.value[i].type == 1 && filterCoin2(asset.value[i].symbol) == route.query?.icon) {
        data = asset.value[i].availableAmount
      }
    }
  }
  return data
})

// 获取银行卡信息
const hideBank = (item) => {
  let str = ''
  var str1 = item.substring(0, 4)
  var str2 = item.substring(item.length - 4, item.length)
  str = str1 + ' *** *** ' + str2
  return str
}

const bankList = ref([])
const getCardList = async () => {
  const res = await getBindCardList()
  if (res.code == '200') {
    if (res.data.length > 0) {
      bankList.value = res.data
      curBank.value = bankList.value[0]
    } else {
      // showToast('请先绑定银行卡')
      _toast('Unbound_bank_card')
      setTimeout(() => {
        router.push('/bind-card')
      }, 1000)
    }
  }
}
onMounted(() => {
  if (route.query?.icon == 'card') {
    getCardList()
  }
})

const allAmount = ref('')
const address = ref(userInfo.value?.user?.address)
const password = ref('')
let allNum = () => {
  allAmount.value = amount.value
}

// 特殊平台，提现需要初级认证（初级）
const advancedAuth = ref(userInfo.value.detail?.auditStatusAdvanced)
// 提交
const submitForm = () => {
  userStore.getUserInfo()
  let flag = true
  // 非空判断
  if (allAmount.value == '' || allAmount.value > amount.value || allAmount.value <= 0) {
    // showToast('请输入正确的提现数量')
    _toast('withdraw_please_num')
    return
  }
  if (route.query?.icon != 'card') {
    if (address.value == '') {
      // showToast('请输入提现地址')
      _toast('withdraw_please_address')
      return
    }
  }
  if (password.value == '') {
    // showToast('请输入提现密码')
    _toast('withdraw_please_pwd')
    return
  }
  if (userInfo.value.detail?.userTardPwd == null) {
    // showToast('请设置资金密码')
    flag = false
    _toast('withdraw_please_fundPwd')
    setTimeout(() => {
      router.push('/fund-password')
    }, 800)
    // return
  }

  if (['paxpay'].includes(__config._APP_ENV) && allAmount.value > 500) {
    flag = false
    if (advancedAuth.value !== '1') {
      _toast('please_advanced')
      setTimeout(() => {
        router.push('/certification-advanced')
      }, 1000)
      // return
    } else {
      flag = true
    }
  }
  let params = ``
  if (route.query?.icon == 'card') {
    params = `amount=${priceFormat(allAmount.value)}&coinType=BANK&pwd=${password.value}&adress=${
        curBank.value.cardNumber
    }&coin=${route.query?.type.toLowerCase()}&bankName=${curBank.value.bankName}&bankUserName=${
        curBank.value.userName
    }&bankBranch=${curBank.value.bankBranch}`
  } else {
    params = `amount=${priceFormat(allAmount.value)}&coinType=${route.query?.type}&pwd=${
        password.value
    }&adress=${address.value}&coin=${route.query?.icon}`
  }
  if (flag) {
    if (DIFF_WITHDRAW.includes(__config._APP_ENV)) {
      getCacheStatus().then((res) => {
        if (!res.data) {
          setAddress(params)
        } else {
          _toast('last_order_info')
        }
      })
    } else {
      submitApi(params)
    }
  }
}
const setAddress = (params) => {
  let data = {coin: route.query?.type, address: address.value}
  saveCacheAddress(data).then((res) => {
    if (res.code == '200') {
      submitApi(params)
    }
  })
}
const submitApi = (params) => {
  withdrawSubmit(params).then((res) => {
    if (res.code == '200') {
      // showToast('提现成功')
      _toast('withdraw_success')
      // 提交成功
      setTimeout(() => {
        router.push('/withdraw')
      }, 500)
    } else {
      showToast(res.msg)
    }
  })
}
const submit = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      submitForm()
    }
  } else {
    submitForm()
  }
}

/**
 * 查询提现地址
 */
const getAddress = async () => {
  let params = {coin: route.query?.type}
  const res = await saveCacheAddress(params)
  if (res.code == '200') {
    if (res.msg) {
      address.value = res.msg
    }
  }
}
onMounted(() => {
  if (DIFF_WITHDRAW.includes(__config._APP_ENV) && route.query?.icon != 'card') {
    getAddress()
  }
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.content {
  padding: 30px 15px;

  .form {
    & > div {
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .right {
          font-size: 10px;
          color: var(--ex-font-color9);
          text-decoration: underline;
        }
      }

      .coin-top {
        justify-content: left;
      }

      .bottom {
        margin: 10px 0 20px;
        padding: 15px 10px;
        border: 1px solid var(--ex-border-color1);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;
        }

        input {
          flex: 1;
          background: var(--ex-default-background-color);
        }

        input::placeholder {
          color: var(--ex-font-color5);
        }

        p {
          color: var(--ex-font-color9);
        }

        .yanjing {
          font-size: 16px;
        }
      }

      .bottom2 {
        margin: 10px 0 20px;
        padding: 15px 10px;
        border: 1px solid var(--ex-border-color1);
        border-radius: 3px;
        display: flex;
        align-items: center;

        & > div {
          flex: 1;
        }

        .coin {
          margin-right: 15px;
          font-size: 20px;
        }

        .bankName {
          margin-bottom: 10px;
        }

        .cardNumber {
          font-size: 18px;
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;

          .jiantou {
            font-size: 10px;
          }
        }
      }
    }

    & > div:first-child {
      .bottom {
        border: 0;
        background-color: var(--ex-div-bgColor);
        padding: 13px 10px;

        .coin {
          font-size: 20px;
          margin-right: 15px;
        }
      }
    }
  }

  .tip {
    div {
      color: var(--ex-passive-font-color);
      line-height: 1.4;

      span.customer {
        color: var(--ex-font-color9);
        text-decoration: underline;
      }
    }

    & > div:first-child {
      margin-bottom: 10px;
    }
  }
}

.btnBox {
  padding: 20px 15px 50px;
}

.sheetBox {
  padding: 0 15px 30px;
  max-height: 300px;
  overflow: auto;

  .title {
    font-size: 18px;
    padding: 30px 0 30px;
    text-align: center;
  }

  .sheetContent {
    background-color: var(--ex-div-bgColor8);
    padding: 15px 10px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .coin {
      font-size: 20px;
      margin-right: 15px;
    }

    p {
      color: var(--ex-default-font-color);
      font-size: 14px;
    }

    .bankName {
      margin-bottom: 10px;

      .scl {

      }
    }

    .cardNumber {
      font-size: 18px;
    }
  }
}
</style>
