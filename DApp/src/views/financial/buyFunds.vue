<template>
  <div class="columnFlex">
    <!-- 购买基金 -->
    <HeaderBar :currentName="_t18('buy_funds')" :backwardNum="backwardNum" />
    <div v-if="!isSuccess">
      <DetailHeader :headerObj="headerObj"></DetailHeader>
      <div class="introduction">
        <!-- 买入额度 -->
        <div class="title fw-bold">{{ _t18('buy_limit') }}</div>
        <!-- 请输入 -->
        <input v-model="limit" type="text" :placeholder="_t18('exchange.input')" class="quota" />
      </div>
      <ProductDetail :proDetail="proDetail"></ProductDetail>
      <div class="buyNow">
        <!-- 支付 -->
        <div class="buyBtn" @click="payNow">{{ _t18('to pay') }}</div>
        <div class="protocol">
          <svg-load v-if="!isCheck" name="gou" class="protocolImg" @click="toSwitch"></svg-load>
          <svg-load v-if="isCheck" name="gouH" class="protocolImg" @click="toSwitch"></svg-load>
          <!-- 我已阅读并同意 -->
          <div>{{ _t18('read_and_confirm') }}</div>
          <!-- 理财协议 -->
          <div class="hightName" @click="$router.push('/financialAgreement')">
            {{ _t18('financial agreement') }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="isSuccess" class="success">
      <svg-load name="icon8" class="successImg"></svg-load>
      <!-- 支付成功 -->
      <div>{{ _t18('payment_successful') }}</div>
    </div>
  </div>
</template>
<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useToast } from '@/hook/useToast'
const { _toast, _showName } = useToast()
import HeaderBar from '@/components/HeaderBar/index.vue'
import DetailHeader from './components/detailHeader.vue' //头
import ProductDetail from './components/productDetail.vue' // 详情
import { financialDetail, financialSubmit } from '@/api/financial/index'
import { _t18 } from '@/utils/public'
const Route = useRoute()
// 起投金额 限投金额 锁仓天数
const headerObj = ref({
  leftName: _t18(`starting-amount`),
  centerName: _t18(`Investment_Limit`),
  rightName: _t18(`Lock-up_days`)
})
const limit = ref('') // 额度
const dayNum = ref('') // 额度
const coninName = ref('')
const proDetail = ref({}) // 产品详情
const isCheck = ref(false) // 选择服务协议
const isSuccess = ref(false) // 判断成功
const backwardNum = ref(-1) //
const minNum = ref(0) // 最小输入
const maxNum = ref(0) // 最大输入
const payNowForm = () => {
  // 请先同意理财协议
  if (!isCheck.value) return _toast('please_agree_financial')
  if (Number(limit.value) < minNum.value)
    // 最少可购买
    return showToast(_t18(`Can_buy_down_to`) + ` ${minNum.value} ${coninName.value}`)
  if (Number(limit.value) > maxNum.value)
    // 最多可购买
    return showToast(_showName(`Can_buy_up_to`) + ` ${maxNum.value} ${coninName.value}`)
  let regNum = /^\d+(\.\d{1,4})?$/
  // 最多输入小数点后4位
  if (!regNum.test(limit.value)) return _toast('entet4_point')
  submit()
}
// 支付
const payNow = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      payNowForm()
    }
  } else {
    payNowForm()
  }
}
/**立即购买 */
const submit = async () => {
  const res = await financialSubmit(Route.params.id, limit.value, dayNum.value)
  if (res.code === 200) {
    isSuccess.value = true
    backwardNum.value = -2
  } else {
    showToast(res.msg)
  }
}
// 勾选协议
const toSwitch = () => {
  isCheck.value = !isCheck.value
}
/** 获取详情 */
const getDetail = async () => {
  try {
    const res = await financialDetail(Route.params.id)
    if (res.code === 200) {
      const { title, icon, avgRate, days, limitMin, limitMax, coin } = res.data
      minNum.value = limitMin
      maxNum.value = limitMax
      coninName.value = coin.toUpperCase() // 弹窗使用
      dayNum.value = days
      headerObj.value = {
        title,
        icon,
        leftNum: limitMin + ' ' + coin.toUpperCase(),
        centerNum: limitMax + ' ' + coin.toUpperCase(),
        rightNum: days,
        ...headerObj.value
      }
      /**产品详情 */
      const { process, totalInvestAmount, remainAmount, timeLimit } = res.data
      proDetail.value = {
        title,
        process,
        totalInvestAmount,
        remainAmount,
        timeLimit,
        avgRate,
        coin: coin.toUpperCase()
      }
    }
  } catch (error) {}
}
onMounted(() => {
  getDetail()
})
</script>
<style lang="scss" scoped>
.introduction {
  padding: 20px 17px;
  border-top: 1px solid var(--ex-border-color);
  border-bottom: 1px solid var(--ex-border-color);
  color: var(--ex-passive-font-color);
  font-size: 12px;
  .title {
    font-size: 16px;
    color: var(--ex-default-font-color);
    margin-bottom: 10px;
  }
  .quota {
    width: 100%;
    height: 50px;
    background: var(--ex-default-background-color);
    border-radius: 3px 3px 3px 3px;
    border: 1px solid var(--ex-border-color2);
    padding: 0 10px;
    font-size: 14px;
    color: var(--ex-default-font-color);
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
.buyNow {
  padding: 40px 15px;
  border-top: 1px solid var(--ex-border-color);
  .buyBtn {
    height: 50px;
    background: var(--ex-div-bgColor1);
    border-radius: 3px 3px 3px 3px;
    font-size: 16px;
    color: var(--ex-font-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .protocol {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    padding: 30px 0 0;
    font-size: 14px;
    text-align: center;
    .protocolImg {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
    .hightName {
      color: var(--ex-font-color2);
      text-decoration: underline;
    }
  }
}
.success {
  flex: 1;
  margin: 150px auto;
  font-size: 14px;
  color: var(--ex-passive-font-color);
  text-align: center;
  .successImg {
    width: 114px;
    height: 112px;
    margin-bottom: 30px;
  }
}
</style>
