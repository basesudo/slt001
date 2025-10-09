<!-- 币币历史 -->
<template>
  <!-- 当前持仓 -->
  <div class="hisToryList" v-if="currentEntruset === 0">
    <div class="header">
      <div class="headerLeft">
        <!-- !recordListItem.type ? '做多' : '开空'  -->
        <div class="name" :class="!recordListItem?.type ? 'bgcBlue' : 'bgcRed'">
          {{ !recordListItem?.type ? _t18(`going_long`) : _t18(`open_short`) }}
        </div>
        <div class="fw-bold">
          {{
            recordListItem?.showCoin
              ? recordListItem?.showCoin
              : recordListItem?.symbol.toUpperCase() + '/USDT'
          }}
        </div>
        <div class="ff-num headerLeftIcon">{{ recordListItem.leverage }}x</div>
      </div>
    </div>
    <div class="list">
      <!-- 持仓量 -->
      <div class="item">
        <div>{{ _t18(`open_interest`) }}</div>
        <div class="fw-num numItem">
          {{ recordListItem.openNum }}
          {{
            recordListItem.showCoin
              ? matchText(recordListItem?.showCoin, '/USDT')
              : recordListItem?.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!-- 持仓担保资产 -->
      <div class="item">
        <div>{{ _t18(`position_collateral_assets`, ['rxce']) }}</div>
        <div class="fw-num numItem">{{ adjustAmountPrice }} USDT</div>
      </div>
      <!-- 持仓保证金 -->
      <div class="item" v-if="['rxce'].includes(_getConfig('_APP_ENV'))">
        <div>{{ _t18(`Position_margin`) }}</div>
        <div class="fw-num numItem">{{ recordListItem.remainMargin }} USDT</div>
      </div>
      <!-- 担保资产率 -->
      <div class="item">
        <div>{{ _t18(`guaranteed_asset_ratio`) }}</div>
        <div class="fw-num numItem">{{ guaranteePrice }}%</div>
      </div>
      <!-- 开仓均价 -->
      <div class="item">
        <div>{{ _t18(`average_opening_price`) }}</div>
        <div class="fw-num numItem">{{ recordListItem.openPrice }} USDT</div>
      </div>
      <!-- 最新价 -->
      <div class="item">
        <div>{{ _t18(`home_newPrice`) }}</div>
        <div class="fw-num numItem">{{ coinPriceInfo.close }} USDT</div>
      </div>
      <!-- 预计强平价 -->
      <div class="item" v-if="!['rxce'].includes(_getConfig('_APP_ENV'))">
        <div>{{ _t18(`expected_strong_parity`) }}</div>
        <div class="fw-num numItem">
          {{ recordListItem.closePrice <= 0 ? '--' : recordListItem.closePrice }} USDT
        </div>
      </div>
      <!-- 收益率 -->
      <div class="item">
        <div>{{ _t18(`yield_rate`, ['rxce']) }}</div>
        <div :class="[_isRFDE(yieldValue), 'fw-num numItem ']">{{ yieldValue }}%</div>
      </div>
      <!-- 收益 -->
      <div class="item">
        <div>{{ _t18(`income`) }}</div>
        <div :class="[_isRFDE(incomeValue), 'fw-num numItem ']">{{ incomeValue }} USDT</div>
      </div>

      <!-- 倒计时subTime -->
      <div
        class="item"
        v-if="
          ['rxce', 'dev'].includes(_getConfig('_APP_ENV')) && recordListItem.params.deliveryDays > 0
        "
      >
        <div>{{ _t18(`option_countdown`) }}</div>
        <van-count-down
          class="fw-num numItem count_down"
          :format="`DD ${_t18('day')} HH ${_t18('hour')} mm ${_t18('minute', ['rxce'])}`"
          :time="recordListItem.params.deliveryDays"
        />
      </div>
    </div>
    <div class="bottomList" v-if="!['rxce'].includes(_getConfig('_APP_ENV'))">
      <div
        class="itemBotton"
        v-for="(item, index) in bottomList"
        :key="index"
        @click="showDetail(index, recordListItem.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="bottomList" v-else>
      <div
        class="itemBotton"
        v-for="(item, index) in bottomList1"
        :key="index"
        @click="showPopup(index, recordListItem.id)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>

  <!-- 当前委托列表 -->
  <div class="hisToryList" v-if="currentEntruset === 1">
    <div class="header">
      <div class="headerLeft">
        <!-- !recordListItem.type ? '做多' : '开空'  -->
        <div class="name" :class="!recordListItem.type ? 'bgcBlue' : 'bgcRed'">
          {{ !recordListItem.type ? _t18(`going_long`) : _t18(`open_short`) }}
        </div>
        <div class="fw-bold">
          {{
            recordListItem.showCoin
              ? recordListItem.showCoin
              : recordListItem.symbol.toUpperCase() + '/USDT'
          }}
        </div>
        <div class="ff-num headerLeftIcon">{{ recordListItem.leverage }}x</div>
      </div>
      <!-- 撤单 -->
      <div class="headerRight" @click="currentDelegation(recordListItem.id)">
        {{ _t18(`bb_Cancellation`) }}
      </div>
    </div>
    <div class="list">
      <!-- 时间 -->
      <div class="item">
        <div>{{ _t18(`k_time`) }}</div>
        <div class="fw-num numItem">
          {{
            _timeFormat(
              recordListItem.params?.delegateTime || recordListItem.delegateTime,
              'DD/MM/YYYY HH:mm',
              true
            )
          }}
        </div>
      </div>
      <!-- 委托总量 -->
      <div class="item">
        <div>{{ _t18(`total_entrustment`) }}</div>
        <div class="fw-num numItem">
          {{ recordListItem.delegateTotal }}
          {{
            recordListItem.showCoin
              ? matchText(recordListItem.showCoin, '/USDT')
              : recordListItem.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!-- 委托价格 -->
      <div class="item">
        <div>{{ _t18(`order_price`) }}</div>
        <div class="fw-num numItem">{{ recordListItem.delegatePrice }} USDT</div>
      </div>
      <!-- 已成交量 -->
      <div class="item">
        <div>{{ _t18(`volume`) }}</div>
        <div class="fw-num numItem">
          {{ recordListItem.dealNum ? recordListItem.dealNum : '0' }}
          {{
            recordListItem.showCoin
              ? matchText(recordListItem.showCoin, '/USDT')
              : recordListItem.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!-- 成交均价 -->
      <div class="item">
        <div>{{ _t18(`bb_Average_transaction_price`) }}</div>
        <div class="fw-num numItem">
          {{ recordListItem.dealPrice ? recordListItem.dealPrice : '---' }}
        </div>
      </div>
    </div>
  </div>
  <!-- 止盈止损 -->
  <div
    class="hisToryList"
    v-if="currentEntruset === 2"
    v-show="!['rxce'].includes(_getConfig('_APP_ENV'))"
  >
    <div class="header">
      <div class="headerLeft">
        <!-- !recordListItem.type ? '做多' : '开空'  -->
        <div class="name" :class="!recordListItem.type ? 'bgcBlue' : 'bgcRed'">
          {{ !recordListItem.type ? _t18(`going_long`) : _t18(`open_short`) }}
        </div>
        <div class="fw-bold">
          {{
            recordListItem.showCoin
              ? recordListItem.showCoin
              : recordListItem.symbol.toUpperCase() + '/USDT'
          }}
        </div>
        <div class="ff-num headerLeftIcon">{{ recordListItem.leverage }}x</div>
      </div>
      <!-- 撤单 -->
      <div class="headerRight" @click="stoplossBullshit(recordListItem.id)">
        {{ _t18(`bb_Cancellation`) }}
      </div>
    </div>
    <div class="list">
      <!-- 委托时间 -->
      <div class="item">
        <div>{{ _t18(`commission_time`) }}</div>
        <div class="fw-num numItem">
          {{
            _timeFormat(
              recordListItem.params?.createTime || recordListItem.createTime,
              'DD/MM/YYYY HH:mm',
              true
            )
          }}
        </div>
      </div>
      <!-- 委托类型 -->
      <div class="item">
        <div>
          {{ _t18('trade_delegate_type') }}
        </div>
        <div class="fw-num numItem">
          <!-- 止盈止损  0 止盈    1止损-->
          {{ recordListItem.lossType ? _t18(`stop_loss`) : _t18(`stop_profit`) }}
        </div>
      </div>
      <!-- 委托总量 -->
      <div class="item">
        <div>{{ _t18(`total_entrustment`) }}</div>
        <!-- lossType 0 止盈 1止损 -->
        <div class="fw-num numItem">
          {{ recordListItem.lossType ? recordListItem.loseNumber : recordListItem.earnNumber }}
          {{
            recordListItem.showCoin ? recordListItem.showCoin : recordListItem.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!-- 委托价格 -->
      <div class="item">
        <div>{{ _t18(`order_price`) }}</div>
        <!-- delegateType 委托类型（0 限价 1 市价） -->
        <!-- recordListItem.delegateType ? '市价委托' : recordListItem.loseDelegatePrice + ' USDT' -->
        <div class="fw-num numItem" :class="recordListItem.delegateType ? 'colorBlue' : ''">
          {{
            recordListItem.delegateType
              ? _t18(`bb_market_order`)
              : recordListItem.loseDelegatePrice + ' USDT'
          }}
        </div>
      </div>
      <!-- 触发价格 -->
      <div class="item">
        <div>{{ _t18(`trigger_price`) }}</div>
        <!-- lossType 0 止盈 1止损 -->
        <div class="fw-num numItem">
          {{ recordListItem.lossType ? recordListItem.losePrice : recordListItem.earnPrice }}
          USDT
        </div>
      </div>
    </div>
  </div>
  <!-- 历史委托   -->
  <div class="hisToryList" v-if="currentEntruset === 3">
    <div class="header">
      <div class="headerLeft">
        <!-- !recordListItem.type ? '做多' : '开空'  -->
        <div class="name" :class="!recordListItem.type ? 'bgcBlue' : 'bgcRed'">
          {{ !recordListItem.type ? _t18(`going_long`) : _t18(`open_short`) }}
        </div>
        <div class="fw-bold">
          {{
            recordListItem.showCoin
              ? recordListItem.showCoin
              : recordListItem.symbol.toUpperCase() + '/USDT'
          }}
        </div>
        <div class="ff-num headerLeftIcon">{{ recordListItem.leverage }}x</div>
      </div>
      <!-- {{ recordListItem.status ? '完全成交' : '等待成交' }} -->
      <div class="headerRightNobgc fw-bold">
        {{ recordListItem.status ? _t18(`completely_sold`) : _t18(`waitingfora_deal`) }}
      </div>
    </div>
    <div class="list">
      <!-- 委托总量 -->
      <div class="item">
        <div>{{ _t18(`total_entrustment`) }}</div>
        <div class="fw-num numItem">
          {{ recordListItem.openNum }}
          {{
            recordListItem.showCoin
              ? matchText(recordListItem.showCoin, '/USDT')
              : recordListItem.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!--委托价值 -->
      <div class="item">
        <div>{{ _t18(`delegate_value`) }}</div>
        <div class="fw-num numItem">{{ recordListItem.entrustmentValue }} USDT</div>
      </div>
      <!-- 委托价格 -->
      <div class="item">
        <div>{{ _t18(`order_price`, ['aams']) }}</div>
        <div class="fw-num numItem">{{ recordListItem.openPrice }} USDT</div>
      </div>
      <!-- 平仓价格 -->
      <div class="item">
        <div>{{ _t18(`closing_price`) }}</div>
        <div class="fw-num numItem">{{ recordListItem.dealPrice }} USDT</div>
      </div>
      <!-- 手续费   -->
      <div class="item" v-if="['das'].includes(_getConfig('_APP_ENV'))">
        <div>{{ _t18(`withdraw_commission`) }}</div>
        <div class="fw-num numItem">{{ recordListItem.sellFee }} USDT</div>
      </div>
      <!-- 收益率   -->
      <div class="item">
        <div>{{ _t18(`yield_rate`) }}</div>
        <div :class="[_isRFDE(yieldHisValue), 'fw-num numItem ']">{{ yieldHisValue }}%</div>
      </div>
      <!-- 收益 -->
      <div class="item">
        <div>{{ _t18(`income`) }}</div>
        <div :class="[_isRFDE(recordListItem.earn), 'fw-num numItem ']">
          {{ _toFixed(recordListItem.earn, 4) }} USDT
        </div>
      </div>

      <!-- 分享按钮 -->
      <div class="item" v-if="HISTORY_SNIPASTE.includes(_getConfig('_APP_ENV'))">
        <div></div>
        <div class="fw-num numItem">
          <div class="btn" @click="sharedImg(recordListItem, yieldHisValue)">
            {{ _t18('trade_share') }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ************************************************************************************** -->
  <!-- 调整保证金 -->
  <PublicPopup :show="showMargin" :direction="`bottom`" @handelClose="showMarginClose">
    <template #titleCustomize>
      <div></div>
      <!-- 调整保证金 -->
      <div class="popupTitle">{{ _t18(`adjustment_margin`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupSelect">
        <!-- 追加保证金 -->
        <div class="selectItem" :class="margin ? '' : 'selectHight'" @click="selcetItem">
          {{ _t18(`margin_call`) }}
        </div>
        <!-- 减少保证金 -->
        <div class="selectItem" :class="margin ? 'selectHight' : ''" @click="selcetItem">
          {{ _t18(`margin_reduction`) }}
        </div>
      </div>
      <div class="popupInput">
        <!-- 请输入 -->
        <input
          type="number"
          class="input"
          v-model.trim="money"
          :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <div class="rightFourth">
        <div class="lineBg">
          <div
            :class="sliderValue === 0 ? 'node' : index * 25 > sliderValue ? 'node' : 'node active'"
            v-for="(item, index) in 5"
            :key="index"
          ></div>
        </div>
        <div class="numList">
          <div v-for="(item, index) in 5" :key="index" class="nodeNuber fw-num">
            {{ index * 25 }}%
          </div>
        </div>
        <van-slider v-model="sliderValue" active-color="#515151" inactive-color="#d9d9d9">
          <template #button>
            <div class="init">
              <div class="initimg"></div>
            </div>
          </template>
        </van-slider>
      </div>
      <!-- 最多增加 最多减少 -->
      <div class="popupLr">
        <div>{{ !margin ? _t18(`increase_most`) : _t18(`reduce_most`) }}：</div>
        <div class="fw-num popupLrNum">{{ atMostValue }} USDT</div>
      </div>
      <div class="popupLr popMargin">
        <!-- 追加/减少的后强平价格： -->
        <div>{{ !margin ? _t18(`after_price`) : _t18(`sub_price`) }}：</div>
        <div class="fw-num popupLrNum">{{ qiangpingPrice }} USDT</div>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="adjustMargin">{{ _t18(`btnConfirm`, ['bitmake']) }}</div>
      </div>
    </template>
  </PublicPopup>

  <!-- 止赢止损 -->
  <PublicPopup :show="showTermination" :direction="`bottom`" @handelClose="showTerminationClose">
    <template #titleCustomize>
      <div></div>
      <!-- !stopName ? '止盈' : '止损' -->
      <div class="popupTitle">{{ !stopName ? _t18(`stop_profit`) : _t18(`stop_loss`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupSelect">
        <!-- 市价 -->
        <div class="selectItem" :class="margin ? '' : 'selectHight'" @click="selcetItem">
          {{ _t18(`market_price`) }}
        </div>
        <!-- 限价 -->
        <div class="selectItem" :class="margin ? 'selectHight' : ''" @click="selcetItem">
          {{ _t18(`limit_price`) }}
        </div>
      </div>
      <!-- 止盈触发价格/止损出发价格 -->
      <div class="popupName">{{ !stopName ? _t18(`profit_price`) : _t18(`loss_price`) }}</div>
      <div class="popupInput marginStop">
        <!-- 止盈触发价格 -->
        <!-- 请输入 -->
        <input
          type="number"
          class="input"
          v-model.trim="earnPriceValue"
          :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <!-- 止盈委托/止损委托 -->
      <div class="popupName">{{ !stopName ? _t18(`profit_order`) : _t18(`loss_order`) }}</div>
      <!-- 止盈 -->
      <div v-if="!margin" class="popupInput marginStop disableStop">
        <!-- 以当前最优价格交易 -->
        <div class="disableName">{{ _t18(`bb_current_best_price`) }}</div>
        <div>USDT</div>
      </div>
      <!-- 止盈委托价 -->
      <div v-if="margin" class="popupInput marginStop">
        <!-- 请输入 -->
        <input
          v-model.trim="earnDelegatePriceValue"
          type="number"
          class="input"
          :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <!-- 持仓量 -->
      <div class="stopText">
        <div>{{ _t18(`open_interest`) }}：</div>
        <div class="fw-num popupLrNum">
          {{ recordListItem.openNum }}
          {{
            recordListItem.showCoin
              ? matchText(recordListItem.showCoin, '/USDT')
              : recordListItem.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!-- 平仓均价： -->
      <div class="stopText">
        <div>{{ _t18(`average_closing_price`) }}：</div>
        <div class="fw-num popupLrNum">{{ recordListItem.openPrice }} USDT</div>
      </div>
      <!-- 最新成交价： -->
      <div class="stopText">
        <div>{{ _t18(`latest_price`) }}：</div>
        <div class="fw-num popupLrNum">{{ coinPriceInfo.close }} USDT</div>
      </div>
      <!-- 止盈 -->
      <div class="stopBottom" v-if="!margin">
        <!-- 市场价格至 -->
        {{ _t18(`profit_tips_1`) }}
        <span class="stopBottomSpan fw-num">{{ coinPriceInfo.close }} USDT</span>
        <!-- 时将触发止盈委托，成交后预计盈利 -->
        {{ _t18(`profit_tips_2`) }}
        <span class="stopBottomSpan fw-num">{{ incomeValue }} USDT</span>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="stopWinAndLosing">
          {{ _t18(`btnConfirm`, ['bitmake']) }}
        </div>
      </div>
    </template>
  </PublicPopup>

  <!-- 追加合约保证金 -->
  <PublicPopup :show="showContractOne" :direction="`bottom`" @handelClose="showContractOneClose">
    <template #titleCustomize>
      <div></div>
      <!-- 追加合约保证金 -->
      <div class="popupTitle">{{ _t18(`Additional_margin`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupInput marginStop">
        <!-- 请输入 -->
        <input
          type="number"
          class="input"
          v-model.trim="PositionMargn"
          :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="adjustMargn">
          {{ _t18(`btnConfirm`, ['bitmake']) }}
        </div>
      </div>
    </template>
  </PublicPopup>

  <!-- 追加合约本金 -->
  <PublicPopup :show="showContractTwo" :direction="`bottom`" @handelClose="showContractTwoClose">
    <template #titleCustomize>
      <div></div>
      <!-- 追加合约保证金 -->
      <div class="popupTitle">{{ _t18(`Add_principal`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupInput marginStop">
        <!-- 请输入 -->
        <input
          type="number"
          class="input"
          v-model.trim="PositionAmout"
          :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="adjustAmout">
          {{ _t18(`btnConfirm`, ['bitmake']) }}
        </div>
      </div>
    </template>
  </PublicPopup>

  <!-- 分享收益 -->
  <div>
    <van-overlay :show="shareShow" class="share-revenue-box" @click="shareShow = false">
      <div class="share-revenue" @click.stop="">
        <ShareCommissionDetail :historical-data="revenueDetails" />
      </div>
    </van-overlay>
  </div>
</template>
<script setup>
import { formatTime, matchText, profitAndloss } from '@/utils/filters'
import { ref, computed, watch } from 'vue'
import PublicPopup from '@/components/Popup/public.vue'
import { useTradeStore } from '@/store/trade'
import { priceFormat } from '@/utils/decimal.js'
import { _add, _sub, _mul, _div, _toFixed } from '@/utils/decimal'
import {
  stopOrder,
  adjustAmount,
  settLoss,
  cancelLoss,
  canCelOrder,
  stopPosition,
  adjustPositionMargn,
  adjustPositionAmout
} from '@/api/trade/index'
import { showToast, closeToast, showLoadingToast } from 'vant'
import { useToast } from '@/hook/useToast'

const { _toast } = useToast()
import { _t18, _timeFormat } from '@/utils/public'
import { useUserStore } from '@/store/user'
// import ShareCommissionDetail from './ShareCommissionDetail.vue'

import ShareCommissionDetail from '../../common/ShareCommissionDetail.vue'
import { HISTORY_SNIPASTE } from '@/config'

const emit = defineEmits(['updateList', 'updateUser'])
const props = defineProps({
  recordListItem: {
    type: Object,
    default: () => {}
  },
  currentEntruset: {
    type: Number,
    default: () => 0
  },
  /**可用余额 */
  availableBalance: {
    type: Number,
    default: () => 0
  }
})
// 选择框通用
const margin = ref(false)
const tradeStore = useTradeStore()
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[props.recordListItem.symbol] || {}
})
// 极速平仓 调整保证金 止盈 止损
const bottomList = computed(() => {
  let tempList = [
    {
      name: _t18(`quick_close`, ['latcoin', 'aams'])
    },
    {
      name: _t18(`adjustment_margin`)
    },
    {
      name: _t18(`stop_profit`, ['aams'])
    },
    {
      name: _t18(`stop_loss`)
    }
  ]
  return tempList
})
// 平仓 增加持仓担保资产
const bottomList1 = [
  {
    name: _t18(`Close_position`, ['rxce'])
  },
  {
    name: _t18(`Additional_margin2`)
  }
]
/**
 * 持仓资产
 */
const adjustAmountPrice = computed(() => {
  let tempPrice = props.recordListItem.adjustAmount
  if (['rxce'].includes(__config._APP_ENV)) {
    // 持仓资产=持仓资产*杠杆
    tempPrice = priceFormat(_mul(props.recordListItem.adjustAmount, props.recordListItem.leverage))
  }
  return tempPrice
})
/**
 * 收益
 */
const incomeValue = computed(() => {
  if (coinPriceInfo.value.close) {
    // 最新价 当买多时 最新价-开仓价均价（openPrice） * 持仓数量（openNum）
    if (!props.recordListItem.type) {
      var price = _mul(
        _sub(coinPriceInfo.value.close, props.recordListItem.openPrice),
        props.recordListItem.openNum
      )
      return _toFixed(price, 4)
    } else {
      // 卖出  开仓-最新 * 持仓
      var price = _mul(
        _sub(props.recordListItem.openPrice, coinPriceInfo.value.close),
        props.recordListItem.openNum
      )
      return _toFixed(price, 4)
    }
  }
})
/**
 * 历史收益率
 * earn / adjustAmount * 100
 */
const yieldHisValue = computed(() => {
  let price = _mul(_div(props.recordListItem.earn, props.recordListItem.adjustAmount), 100)
  // rxce 收益率=收益/保证金/杠杆
  if (['rxce'].includes(__config._APP_ENV)) {
    price = _div(price, props.recordListItem.leverage)
  } else if (['das1'].includes(__config._APP_ENV)) {
    // 收益率=收益/委托价值/杠杆
    price = _mul(
      _div(
        _div(props.recordListItem.earn, props.recordListItem.entrustmentValue),
        props.recordListItem.leverage
      ),
      100
    )
  }
  return _toFixed(price, 4)
})
/**
 * 收益率
 */
const yieldValue = computed(() => {
  if (coinPriceInfo.value.close) {
    //之前的 收益率：最新价 当买多时 最新价-开仓价均价（openPrice） /开仓价（openPrice） *100
    /**新改的
     * 收益率=(最新价-开仓价)*杠杆倍数/开仓价
     * 最新价coinPriceInfo.value.close
     * 开仓价props.recordListItem.openPrice
     * 杠杆倍数props.recordListItem.leverage
     */
    if (!props.recordListItem.type) {
      let price = _mul(
        _mul(
          _div(
            _sub(coinPriceInfo.value.close, props.recordListItem.openPrice),
            props.recordListItem.openPrice
          ),
          100
        ),
        props.recordListItem.leverage
      )
      // rxce 收益率 = ((开盘价-关盘价)*数量)/保证金/杠杆倍数
      if (['rxce'].includes(__config._APP_ENV)) {
        price = _div(
          _div(
            _mul(
              _mul(
                _sub(coinPriceInfo.value.close, props.recordListItem.openPrice),
                props.recordListItem.openNum
              ),
              100
            ),
            props.recordListItem.entrustmentValue
          ),
          props.recordListItem.leverage
        )
      }
      return _toFixed(price, 4)
    } else {
      var price = _mul(
        _mul(
          _div(
            _sub(props.recordListItem.openPrice, coinPriceInfo.value.close),
            props.recordListItem.openPrice
          ),
          100
        ),
        props.recordListItem.leverage
      )
      /* if (['rxce'].includes(__config._APP_ENV)) {
        price = _div(price, props.recordListItem.leverage)
      } */
      return _toFixed(price, 4)
    }
  }
})
// (现金+信用账户内证券市值)/(融资买入金额+融券卖出证券数量*市价+利息及费用)
// （账户余额+ （当前价*数量openNum） ） / （购买金额（adjustAmount）+ 数量openNum*当前+  利息openFee  ）
const guaranteePrice = computed(() => {
  if (coinPriceInfo.value.close) {
    let price = _div(
      _add(props.availableBalance, _mul(coinPriceInfo.value.close, props.recordListItem.openNum)),
      _add(
        _add(
          props.recordListItem.adjustAmount,
          _mul(props.recordListItem.openNum, coinPriceInfo.value.close)
        ),
        props.recordListItem.openFee
      )
    )
    return _toFixed(price)
  }
})
// 当前持仓
const showDetail = (index, curId) => {
  margin.value = false
  sliderValue.value = 0
  switch (index) {
    case 0:
      // 极速平仓
      try {
        showLoadingToast({
          forbidClick: true,
          duration: 0
        })
        stopOrder({
          id: curId
        }).then((res) => {
          if (res.code === 200) {
            // 平仓成功
            // _toast('successfully_closed')
            showToast(res.msg)
            emit('updateList', 1)
            emit('updateUser')
          } else {
            closeToast()
            showToast(res.msg)
          }
        })
      } catch (error) {
        closeToast()
      }
      return
    case 1:
      // 调整保证金
      showMargin.value = true
      money.value = ''
      return
    case 2:
      // 止盈
      stopName.value = 0
      showTermination.value = true
      earnPriceValue.value = ''
      earnDelegatePriceValue.value = ''
      return
    case 3:
      // 止损
      stopName.value = 1
      showTermination.value = true
      earnPriceValue.value = ''
      earnDelegatePriceValue.value = ''
      return
    default:
      break
  }
}
const showContractOne = ref(false)
const showContractTwo = ref(false)
const PositionMargn = ref('') //追加保证金
const PositionAmout = ref('') //追加金额
const showPopup = (index, curId) => {
  margin.value = false
  sliderValue.value = 0
  switch (index) {
    case 0:
      // 极速平仓
      try {
        showLoadingToast({
          forbidClick: true,
          duration: 0
        })
        stopPosition({
          id: curId
        }).then((res) => {
          if (res.code === 200) {
            // 平仓成功
            _toast('successfully_closed')
            emit('updateList')
            emit('updateUser')
          } else {
            closeToast()
            showToast(res.msg)
          }
        })
      } catch (error) {
        closeToast()
      }
      return
    case 1:
      showContractOne.value = true
      PositionMargn.value = ''
      return
    case 2:
      showContractTwo.value = true
      PositionAmout.value = ''
      return
    default:
      break
  }
}
const showContractOneClose = () => {
  showContractOne.value = false
}
const showContractTwoClose = () => {
  showContractTwo.value = false
}
//合约保证金
const adjustMargn = () => {
  let data = {
    id: props.recordListItem.id,
    money: PositionMargn.value
  }
  adjustPositionMargn(data).then((res) => {
    if (res.code == 200) {
      showToast(res.msg)
      showContractOne.value = false
      showToast(res.msg)
      emit('updateList')
      emit('updateUser')
    } else {
      // _toast('Insufficient_balance')
      showToast(res.msg)
      showContractOne.value = false
    }
  })
}

//合约金额
const adjustAmout = () => {
  let data = {
    id: props.recordListItem.id,
    money: PositionAmout.value
  }
  adjustPositionAmout(data).then((res) => {
    if (res.code == 200) {
      showToast(res.msg)
      showContractTwo.value = false
      emit('updateList')
      emit('updateUser')
    } else {
      _toast('Insufficient_balance')
      showContractTwo.value = false
    }
  })
}
// 调整保证金
const showMargin = ref(false)
const showMarginClose = () => {
  showMargin.value = false
}
const selcetItem = () => {
  margin.value = !margin.value
  sliderValue.value = 0
  money.value = ''
  earnPriceValue.value = ''
  earnDelegatePriceValue.value = ''
}
const sliderValue = ref(0)
const money = ref('') // 调整金额
// 最多/最少增加
const atMostValue = computed(() => {
  let price
  // 最多增加
  if (!margin.value) {
    // type  0 买入 1 卖出
    if (props.recordListItem.type) {
      // openPrice   + adjustAmount / openNum  卖出
      price = _add(
        props.recordListItem.openPrice,
        _div(props.recordListItem.adjustAmount, props.recordListItem.openNum)
      )
      price = price > 0 ? price : 0
    } else {
      price = _sub(
        props.recordListItem.openPrice,
        _div(props.recordListItem.adjustAmount, props.recordListItem.openNum)
      )
      price = price > 0 ? price : 0
    }
  } else {
    // 最多减少
    // adjustAmount -amount   >  adjustAmount -amount  : 0
    price = _sub(props.recordListItem.adjustAmount, props.recordListItem.amount)
    price = price > 0 ? price : 0
  }

  return price
})
// 强平价格
const qiangpingPrice = computed(() => {
  var price
  var closeFee = 0
  if (tradeStore.contractCoinList.length > 0) {
    tradeStore.contractCoinList.forEach((element) => {
      if (element.coin === props.recordListItem.symbol) {
        closeFee = element.closeFee
      }
    })
  }
  // adjustAmount + 当前输入的值   ） / 持仓数量（openNum）
  let position
  if (!margin.value) {
    position = _div(
      _add(props.recordListItem.adjustAmount, money.value ? money.value : 0),
      props.recordListItem.openNum
    )
  } else {
    position = _div(
      _sub(props.recordListItem.adjustAmount, money.value ? money.value : 0),
      props.recordListItem.openNum
    )
  }
  // 手续费（（adjustAmount + 当前输入的值   ） * closeFee ）
  let commission = _mul(
    _add(props.recordListItem.adjustAmount, money.value ? money.value : 0),
    closeFee
  )
  // 判断type 0  1
  if (props.recordListItem.type === 0) {
    // 开盘价（openPrice） - （adjustAmount + 当前输入的值   ） / 持仓数量（openNum） + 手续费（（adjustAmount + 当前输入的值   ） * closeFee ）
    price = _add(_sub(props.recordListItem.openPrice, position), commission)
  } else if (props.recordListItem.type === 1) {
    // （adjustAmount + 当前输入的值   ） / 持仓数量（openNum）  +   开盘价（openPrice）   -  手续费（（adjustAmount + 当前输入的值   ） * closeFee ）
    price = _sub(_add(position, props.recordListItem.openPrice), commission)
  }
  price = price <= 0 ? 0 : price
  return _toFixed(price, 2)
})
/** 监听输入框赋最大值 */
watch(
  () => money.value,
  (n) => {
    if (n) {
      if (n >= props.availableBalance) {
        money.value = props.availableBalance
      }
    } else {
      money.value = ''
    }
  }
)
watch(
  () => sliderValue.value,
  (n) => {
    if (n) {
      let rate = _div(n, 100)
      money.value = _mul(props.availableBalance, rate)
    } else {
      money.value = ''
    }
  }
)
// 调整保证金确认

const adjustMargin = () => {
  let data = {
    id: props.recordListItem.id,
    money: money.value,
    // 0 增加保证金 1 减少保证金
    flag: margin.value ? 1 : 0
  }
  if (Number(money.value)) {
    adjustAmount(data).then((res) => {
      if (res.code === 200) {
        // data.flag 追加成功 : 减少成功
        // showToast(`${!data.flag ? _showName(`additional_success`) : _showName(`reduce_success`)}`)
        showToast(res.msg)
        showMargin.value = false
        emit('updateList')
        emit('updateUser')
      } else {
        showToast(res.msg)
      }
    })
  }
}
// 止赢止损
const earnPriceValue = ref('') // 止盈/止损触发价
const earnDelegatePriceValue = ref('') // 止盈/止损委托价
const showTermination = ref(false)
const stopName = ref(0) //0 止盈 1止损
const showTerminationClose = () => {
  showTermination.value = false
}
const stopWinAndLosing = () => {
  var data = {}
  if (!stopName.value) {
    data = {
      positionId: props.recordListItem.id,
      earnPrice: earnPriceValue.value,
      earnNumber: props.recordListItem.openNum,
      // 0 止盈 1止损
      lossType: 0,
      // 委托类型（0 限价 1 市价）
      delegateType: margin.value ? 0 : 1
    }
    if (!data.delegateType) {
      data.earnDelegatePrice = earnDelegatePriceValue.value
    }
  } else {
    data = {
      positionId: props.recordListItem.id,
      losePrice: earnPriceValue.value,
      loseNumber: props.recordListItem.openNum,
      // 0 止盈 1止损
      lossType: 1,
      // 委托类型（0 限价 1 市价）
      delegateType: margin.value ? 0 : 1
    }
    if (!data.delegateType) {
      data.loseDelegatePrice = earnDelegatePriceValue.value
    }
  }
  if (!data.delegateType) {
    if (earnPriceValue.value && earnDelegatePriceValue.value) {
      settLoss(data).then((res) => {
        if (res.code === 200) {
          showTerminationClose()
          // showToast(`${data.lossType ? '止损' : '止盈'}成功`)
          // showToast(
          //   `${
          //     data.lossType
          //       ? _showName('successful_stop_loss')
          //       : _showName('stopProfitSuccessfully')
          //   }`
          // )
          showToast(res.msg)
          emit('updateList', 2)
          emit('updateUser')
        } else {
          showToast(res.msg)
        }
      })
    }
  } else {
    if (earnPriceValue.value) {
      settLoss(data).then((res) => {
        if (res.code === 200) {
          showTerminationClose()
          // showToast(`${data.lossType ? '止损' : '止盈'}成功`)
          // showToast(
          //   `${
          //     data.lossType
          //       ? _showName('successful_stop_loss')
          //       : _showName('stopProfitSuccessfully')
          //   }`
          // )
          showToast(res.msg)
          emit('updateList', 2)
          emit('updateUser')
        } else {
          showToast(res.msg)
        }
      })
    }
  }
}
/** 止盈止损撤单*/
const stoplossBullshit = async (id) => {
  try {
    const res = await cancelLoss(id)
    if (res.code === 200) {
      _toast(`cancellation_successful`)
      emit('updateList')
      emit('updateUser')
    } else {
      showToast(res.msg)
    }
  } catch (error) {}
}
// 当前委托
const currentDelegation = async (id) => {
  try {
    const res = await canCelOrder(id)
    if (res.code === 200) {
      // showToast(`撤单成功`)
      _toast(`cancellation_successful`)
      emit('updateList')
      emit('updateUser')
    } else {
      showToast(res.msg)
    }
  } catch (error) {}
}

// 分享收益
const shareShow = ref(false)
const revenueDetails = ref({}) // 收益详情

// 做多
const opneMore = _t18(`going_long`)

// 开孔
const openNull = _t18(`open_short`)

const sharedImg = (model, yieldHisValue) => {
  console.log(model)
  // 二维码链接
  const shareLink = `${location.origin}/#/i&`
  const useStore = useUserStore()
  const userInfo = useStore.userInfo
  const sharkCode = userInfo?.user?.activeCode

  // 组件赋值
  revenueDetails.value = {
    profitAndLossAmount: yieldHisValue > 0 ? yieldHisValue.toString() : yieldHisValue, // 盈亏金额
    TransactionType: model.symbol.toUpperCase() + '/' + 'USDT', // 交易类型
    CurrencyName: model.type ? openNull : opneMore, // 币种名
    OpeningPrice: model.openPrice.toString(), // 开仓价格
    ClosingPrice: model.dealPrice.toString(), // 平仓价格
    type: model.type,
    // QrCode: shareLink + sharkCode, // 二维码
    QrCode: location.origin,
    bgType: `1`, //背景类型，此参数当为用户设置， 暂定1 为默认白色
    currencyUnit: '%' // 盈利单位
  }
  console.log(revenueDetails)
  shareShow.value = !shareShow.value
  // emit("shareRevenue", model)
}
</script>
<style lang="scss" scoped>
// 分享弹出层
.share-revenue-box {
  z-index: 99;

  .share-revenue {
    :deep(.share-commission) {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: var(--ex-default-background-color);
      min-width: 300px;
      border-radius: 30px;
    }
  }
}

.btn {
  font-size: 12px;
  padding: 2px 10px;
  border: 1px solid var(--ex-primary-color);
  border-radius: 5px;
}

.colorBlue {
  color: var(--ex-font-color2) !important;
}

.colorRed {
  color: var(--ex-font-color15) !important;
}

.bgcBlue {
  background-color: var(--ex-rfd-rise) !important;
}

.bgcRed {
  background-color: var(--ex-rfd-fall) !important;
}

.hisToryList {
  padding: 20px 15px 0;
  // border-bottom: 1px solid var(--ex-border-color);

  .header {
    padding-bottom: 10px;
    font-size: 14px;
    color: var(--ex-default-font-color);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .headerLeft {
      display: flex;
      align-items: center;

      .name {
        padding: 2px 5px;
        font-size: 12px;
        border-radius: 2px 2px 2px 2px;
        margin-right: 10px;
        color: var(--ex-font-color);
      }

      .headerLeftIcon {
        margin-left: 10px;
        font-size: 12px;
        padding: 0 5px;
        border: 1px solid var(--ex-primary-color);
        border-radius: 5px;
      }
    }

    .headerRight {
      padding: 0 6px;
      background: var(--ex-default-background-color);
      border-radius: 2px 2px 2px 2px;
      opacity: 1;
      border: 1px solid var(--ex-border-color3);
      font-size: 12px;
      color: var(--ex-font-color2);
    }

    .headerRightNobgc {
      font-size: 14px;
      color: var(--ex-font-color9);
    }
  }

  .list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--ex-passive-font-color);
      // padding-bottom: 20px;
      padding: 8px 0;

      .numItem {
        color: var(--ex-default-font-color);
      }
    }
  }

  .bottomList {
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .itemBotton {
      flex: 1;
      margin-right: 5px;
      padding: 8px 0;
      background: var(--ex-div-bgColor17);
      border-radius: 2px 2px 2px 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ex-default-font-color);
      font-size: 12px;
    }

    .itemBotton:last-child {
      margin-right: 0;
    }
  }
}

.popupTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: var(--ex-default-font-color);
}

.popupSelect {
  height: 36px;
  border-radius: 3px 3px 3px 3px;
  background: var(--ex-div-bgColor);
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .selectItem {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .selectHight {
    color: var(--ex-font-color);
    background: var(--ex-div-bgColor1);
    border-radius: 3px 3px 3px 3px;
  }
}

.popupInput {
  margin-top: 20px;
  height: 50px;
  background: var(--ex-default-background-color);
  border-radius: 3px 3px 3px 3px;
  border: 1px solid var(--ex-border-color2);
  color: var(--ex-default-font-color);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .input {
    width: 100%;
    color: var(--ex-default-font-color);
    margin-right: 10px;
    background: var(--ex-default-background-color);
  }

  input::-webkit-input-placeholder {
    color: var(--ex-font-color1);
  }

  input::-moz-input-placeholder {
    color: var(--ex-font-color1);
  }

  input::-ms-input-placeholder {
    color: var(--ex-font-color1);
  }
}

.rightFourth {
  margin-top: 20px;
  width: 100%;
  position: relative;

  .lineBg {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .node {
      width: 11px;
      height: 11px;
      background: var(--ex-div-bgColor3);
      margin-top: -5px;
      transform: rotate(45deg);
      position: relative;
    }

    .active {
      background: var(--ex-div-bgColor4);
    }
  }

  .numList {
    position: absolute;
    width: 100%;
    top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nodeNuber {
      display: flex;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 500;
      color: var(--ex-default-font-color);
    }

    .nodeNuber:nth-child(2) {
      margin-left: 15px;
    }

    .nodeNuber:nth-child(3) {
      margin-left: 15px;
    }

    .nodeNuber:nth-child(4) {
      margin-left: 15px;
    }
  }

  .init {
    .initimg {
      width: 12px;
      height: 12px;
      background: var(--ex-div-bgColor4);
      transform: scaleY(0.5) rotate(45deg) !important;
      position: relative;
    }
  }
}

.popupLr {
  margin-top: 45px;
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .popupLrNum {
    margin-left: 10px;
    color: var(--ex-default-font-color);
  }
}

.popMargin {
  margin-top: 20px;
}

.determine {
  margin: 50px 0 30px;

  .determinebtn {
    height: 50px;
    background: var(--ex-div-bgColor1);
    border-radius: 3px 3px 3px 3px;
    font-size: 16px;
    color: var(--ex-font-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.popupName {
  margin-top: 20px;
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.marginStop {
  margin-top: 10px !important;
}

.disableStop {
  background: var(--ex-div-bgColor5);
  border: none;

  .disableName {
    font-size: 14px;
    color: var(--ex-passive-font-color);
  }
}

.stopText {
  margin-top: 10px;
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .popupLrNum {
    margin-left: 10px;
    color: var(--ex-default-font-color);
  }
}

.stopBottom {
  margin-top: 20px;
  font-size: 12px;
  color: var(--ex-passive-font-color);
  line-height: 20px;

  .stopBottomSpan {
    color: var(--ex-default-font-color);
  }
}
.count_down {
  font-size: 12px;
}
</style>
