<!-- 兑换 -->
<template>
  <!-- 闪兑 -->
  <HeaderBar :currentName="_t18('swap')"></HeaderBar>
  <Amount :amount="availableAmount || 0" :coin="list1Current?.coin?.toLocaleUpperCase()"></Amount>
  <div class="content">
    <div class="from">
      <input type="number" v-model="fromNum" :placeholder="_t18('swap_input')" class="ff-num" />
      <div>
        <!-- 全部 -->
        <div class="left" @click="fromNum = list1Current?.amount || '0'">
          {{ _t18('swap_all') }}
        </div>
        <span>|</span>
        <!-- MIChskt 展示btc -->
        <!-- <div
          v-if="['gmtoin2'].includes(_getConfig('_APP_ENV'))"
          class="right"
          @click="showAction('from')"
        >
          BTC
          <div class="svgImg">
            <img
              :src="list1Current?.icon"
              alt=""
              class="iconImg"
              v-if="list1Current?.icon?.length > 10"
            />
            <svg-load :name="list1Current?.icon" class="icon" v-else></svg-load>
          </div>
        </div> -->
        <!-- <div v-else class="right" @click="showAction('from')"> -->
        <div class="right" @click="showAction('from')">
          {{ list1Current?.coin?.toLocaleUpperCase() }}
          <div class="svgImg">
            <img
              :src="`/resource/svg/light/${list1Current?.coin}.svg`"
              alt=""
              class="iconImg"
              width="20"
              height="20"
              style="margin-right: 5px; border-radius: 100%;"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 交换按钮 -->
    <div class="exchange_btn">
      <svg-load name="duihuan40x40" class="dui" @click="jiaohuan()"></svg-load>
      <!-- <svg-load name="duihuan40x40" class="dui"></svg-load> -->
    </div>
    <div class="to">
      <!-- 兑换数量 -->
      <input
        type="number"
        disabled
        class="ff-num"
        v-model="toNum"
        :placeholder="_t18('swap_number')"
      />
      <div>
        <div class="right" @click="showAction('to')">
          {{ list2Current?.coin?.toLocaleUpperCase() }}
          <div class="svgImg">
            <image-load
              :filePath="list2Current?.icon"
              class="iconImg"
              v-if="list2Current?.icon?.length > 10"
            />
            <svg-load :name="list2Current?.icon" class="icon" v-else></svg-load>
          </div>
        </div>
      </div>
    </div>
    <div class="rate ff-num">
      <!-- 今日汇率 -->
      <p>{{ _t18('swap_rateDay') }}：</p>
      1
      <span>{{ list1Current.coin?.toLocaleUpperCase() }}</span
      >&nbsp;≈&nbsp;<span>{{ curRate }}</span
      ><span>{{ list2Current.coin?.toLocaleUpperCase() }}</span>
    </div>
  </div>
  <!-- 确定 -->
  <div class="btn">
    <p @click="submit">{{ _t18('btnConfirm', ['bitmake']) }}</p>
  </div>
  <!-- sheet币种面板 -->
  <van-action-sheet
    v-model:show="showSheet"
    title=""
    id="sheetPopup"
    style="max-width: var(--ex-max-width); left: 50%; translate: -50%"
  >
    <div class="coinList">
      <div
        v-for="(item, index) in action"
        :key="item.id"
        class="coinItem"
        @click="selectCoin(item, index)"
      >
        <div class="svgImg">
          <!-- 只有 from 容器使用本地图标 -->
          <template v-if="flag === 'from'">
            <img
              :src="`/resource/svg/light/${item.coin}.svg`"
              alt=""
              class="iconImg"
              width="20"
              height="20"
              style="margin-right: 5px; border-radius: 100%;"
            />
          </template>
          <!-- to 容器保持原来的图标加载方式 -->
          <template v-else>
            <image-load :filePath="item.icon" alt="" class="iconImg" v-if="item?.icon?.length > 10" />
            <svg-load :name="item.icon" class="icon" v-else></svg-load>
          </template>
        </div>
        <div>
          <p>{{ item.coin?.toLocaleUpperCase() }}</p>
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { rate, toExchange } from '@/api/account'
import { debounce } from 'lodash'
import { priceFormat } from '@/utils/decimal.js'
import Amount from './../components/applyAmount.vue'
import { ref, computed, onMounted } from 'vue'
import { useAccountStore } from '@/store/account/index'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
const accountStore = useAccountStore()
const userStore = useUserStore()
userStore.getUserInfo()
// 用户余额信息
const { asset } = storeToRefs(userStore)
const { swapCoinList } = storeToRefs(accountStore)
/**
 * 货币兑换
 * 1.用户信息货币asset.value
 * 2.兑换成什么货币swapCoinList.value
 */
const jiaohuanFlag = ref(true) //交换按钮（true初始状态）
const list1 = ref([]) //币种列表
const list2 = ref([])
const list1Current = ref({}) //显示的币种列表
const list2Current = ref({})
const list1Coin = ref(0) //显示的币种
const list2Coin = ref(0)
// 当前币种的余额（一定取最新的）
const availableAmount = computed(() => {
  let data = ''
  asset.value.forEach((item, index) => {
    if (item.symbol == list1Current.value.coin && item.type == 1) {
      data = item.availableAmount
    }
  })
  return data
})
const init = async () => {
  await accountStore.getSwapCoinList()
  let template1 = []
  asset.value.forEach((item, index) => {
    // console.log(item,888)
    let obj = {}
    if (item.type == '1') {
      obj['id'] == index + 1
      obj['amount'] = item.availableAmount
      // console.log(item.loge,666)
      // obj['icon'] = item.logo

      if (item.symbol == 'usdt') {
        obj['coin'] = 'usdt'
        obj['icon'] = 'usdt'
        template1.unshift(obj)
      }
      if (item.symbol != 'usdt') {
        obj['coin'] = item.symbol?.replace('usdt', '').trim()
        // obj['icon'] = item.symbol?.replace('usdt', '').trim()
        obj['icon'] = item.loge
        template1.push(obj)
      }
    }
  })
  // **************************
  // 兑换成什么列表添加金额
  swapCoinList.value.forEach((item, index) => {
    template1.forEach((items, indexs) => {
      if (items.coin == item.coin) {
        item['amount'] = items.amount
      }
    })
  })
  list1.value = template1
  if (['gmtoin2'].includes(__config._APP_ENV)) {
    list1Current.value = template1.find((item, idx) => {
      return item.coin === 'btc'
    })
  } else {
    list1Current.value = template1[0]
  }
  // list1Current.value = template1[0]
  list1Coin.value = list1Current.value?.coin
  list2.value = swapCoinList.value?.filter((item, index) => {
    return item.coin != list1Current.value?.coin
  })
  list2Current.value = swapCoinList.value?.filter((item, index) => {
    return item.coin != list1Current.value?.coin
  })[0]
  list2Coin.value = list2Current.value?.coin
}
// init()
// onMounted(()=>{
//
// })
/**
 * 汇率
 */
const curRate = ref(0)
// 获取汇率
const getRate = (from, to) => {
  from = filterCoin(from)
  to = filterCoin(to)
  rate(from, to).then((res) => {
    if (res.code == '200') {
      let resFrom = res.data[`${from}`]
      let resTo = res.data[`${to}`]
      if (resFrom == null) {
        resFrom = 1
      }
      if (resTo == null) {
        resTo = 1
      }
      curRate.value = priceFormat(resFrom / resTo, 8)
    }
  })
}
//面板中对上面货币更改
watch([list1Coin], ([newValue], [oldValue]) => {
  if (jiaohuanFlag.value) {
    //上面默认显示的货币
    list1.value.forEach((item, index) => {
      if (item.coin == newValue) {
        list1Current.value = item
      }
    })
    //下面货币列表
    list2.value = swapCoinList.value.filter((item, index) => {
      return item.coin != list1Current.value.coin
    })
    // 下面货币列表排他
    if (newValue == list2Coin.value) {
      list2Current.value = swapCoinList.value.filter((item, index) => {
        return item.coin != list1Current.value.coin
      })[0]
      list2Coin.value = list2Current.value.coin
    }
  } else {
    list1.value.forEach((item, index) => {
      if (item.coin == newValue) {
        list1Current.value = item
      }
    })
  }
})
watch([list2Coin], ([newValue], [oldValue]) => {
  if (jiaohuanFlag.value) {
    // 下面默认显示的货币
    list2.value.forEach((item, index) => {
      if (item.coin == newValue) {
        list2Current.value = item
      }
    })
  } else {
    list2.value.forEach((item, index) => {
      if (item.coin == newValue) {
        list2Current.value = item
      }
    })
    list1.value = swapCoinList.value.filter((item, index) => {
      return item.coin != list2Current.value.coin
    })
    if (newValue == list2Coin.value) {
      list1Current.value = swapCoinList.value.filter((item, index) => {
        return item.coin != list2Current.value.coin
      })[0]
      list1Coin.value = list2Current.value.coin
    }
  }
})
// 监听默认显示货币，修改汇率
watch(
  [list1Current, list2Current],
  (newValue, oldValue) => {
    getRate(newValue[0]?.coin, newValue[1]?.coin)
  },
  {
    deep: true
  }
)
// 点击交换按钮（交换上下货币列表，当前显示）
const jiaohuan = () => {
  jiaohuanFlag.value = !jiaohuanFlag.value
  let tempList = list1.value
  list1.value = list2.value
  list2.value = tempList
  let tempCurrent = list1Current.value
  list1Current.value = list2Current.value
  list2Current.value = tempCurrent
}
/**
 * sheet面板
 */
const showSheet = ref(false) //sheet面板隐显
const action = ref({}) //面板数据(flag:from上，to下)
const flag = ref('from') //面板展示数据from/to

/**
 * 数据处理
 * usdt->usdt
 * btc->btcusdt
 */
const filterCoin = (item) => {
  return item
  // if (item == 'usdt') {
  //   return item
  // } else {
  //   return item + 'usdt'
  // }
}

/**
 * 兑换金额
 */
const fromNum = ref('')
const toNum = ref()
watch([fromNum, curRate], () => {
  toNum.value = priceFormat(fromNum.value * curRate.value, 8)
})


onMounted(() => {
  init()
  // getRate(list1Coin.value, list2Coin.value) //挂载完数据先执行一次
  // console.log(list1Coin.value,list2Coin.value)
})
// 触发sheet面板事件(item=from/to,面板数据不同)
const showAction = (item) => {
  if (item == 'from') {
    action.value = list1.value
  } else if (item == 'to') {
    action.value = list2.value
  }
  flag.value = item
  showSheet.value = true
}
// sheet面板内容选择（根据flag标识，修改当前货币）
const selectCoin = (item, index) => {
  showSheet.value = false
  if (flag.value == 'from') {
    list1Coin.value = item.coin
  } else if (flag.value == 'to') {
    list2Coin.value = item.coin
  }
}
const submitForm = debounce(() => {
  if (fromNum.value <= 0) {
    // 兑换金额不能小于0
    _toast('swap_minNum')
    return
  }
  // 兑换金额不能超过可用金
  // if (fromNum.value > list1Current.value.amount) {
  if (fromNum.value > availableAmount.value) {
    // console.log(fromNum.value,list1Current.value.amount,availableAmount.value)
    _toast('swap_maxNum')
    return
  }
  let params = {
    fromSymbol: filterCoin(list1Current.value?.coin),
    toSymbol: filterCoin(list2Current.value?.coin),
    total: fromNum.value
  }
  toExchange(params).then((res) => {
    if (res.code == '200') {
      // 兑换成功，请稍后查看
      _toast('swap_success', ['aams'])
      setTimeout(() => {
        userStore.getUserInfo()
        // init()
      }, 1000)
    } else {
      showToast(res.msg)
    }
  })
  // console.log('兑换操作',params)
}, 500)
// 兑换按钮
const submit = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      submitForm()
    }
  } else {
    submitForm()
  }
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.content {
  padding: 30px 15px;
  .from,
  .to {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    border: 1px solid var(--ex-border-color1);
    border-radius: 3px;
    & > div {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .left {
        color: var(--ex-font-color9);
      }
      span {
        margin: 0 15px;
        font-size: 12px;
        color: var(--ex-passive-font-color);
      }
      .right {
        display: flex;
        align-items: center;
        .svgImg {
          margin-left: 10px;
          width: 20px;
          height: 20px;
          .icon {
            font-size: 20px;
          }
          .iconImg {
            width: 100%;
          }
        }
      }
    }
    input {
      flex: 1;
      color: var(--ex-font-color20);
      background: var(--ex-default-background-color);
    }
    input::placeholder {
      color: var(--ex-font-color20);
    }
  }
  .exchange_btn {
    padding: 40px 0;
    text-align: center;
    .dui {
      font-size: 40px;
    }
  }
  .rate {
    display: flex;
    margin-top: 20px;
    p {
      color: var(--ex-passive-font-color);
    }
  }
}
.btn {
  padding: 20px 15px 50px;
  p {
    padding: 14px 0;
    font-size: 16px;
    color: var(--ex-font-color);
    background-color: var(--ex-div-bgColor1);
    border-radius: 3px;
    text-align: center;
  }
}
.coinList {
  max-height: 250px;
}
.coinItem {
  display: flex;
  align-items: center;
  padding: 15px 0;
  flex: 1;
  background: var(--ex-default-background-color);

  div {
    flex: 1;
  }
  .svgImg {
    text-align: right;
    // width: 30px;
    // height: 30px;
    .icon {
      text-align: right;
      font-size: 30px;
    }
    .iconImg {
      width: 30px;
    }
  }
  p {
    font-size: 16px;
    color: var(--ex-passive-font-color);
  }
  & > div:first-child {
    text-align: end;
    margin-right: 5px;
  }
  & > div:last-child {
    text-align: start;
    margin-left: 5px;
  }
}
input:disabled {
  background-color: var(--ex-default-background-color);
}
</style>
