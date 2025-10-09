<!-- 划转 -->
<template>
  <HeaderBar :currentName="_t18('transfer')"></HeaderBar>

  <div class="content_box">
    <p class="title fw-bold">{{ _t18('transfer') }}</p>
    <div class="cardOne">
      <div class="left">
        <!-- 从   到 -->
        <div class="left_top">
          <span>{{ _t18('transfer_from') }}</span>
          <van-dropdown-menu active-color="#17ac74">
            <van-dropdown-item
              v-model="params.transferOutAccount"
              :options="transferOutAccountList"
            />
          </van-dropdown-menu>
        </div>
        <div class="left_bottom">
          <span>{{ _t18('transfer_to', ['aams']) }}</span>
          <van-dropdown-menu active-color="#17ac74">
            <van-dropdown-item
              v-model="params.transferInAccount"
              :options="transferInAccountList"
            />
          </van-dropdown-menu>
        </div>
      </div>
      <div class="right" @click="jiaohuanbtn2">
        <svg-load name="huazhuanbtn" class="huazhuanbtn"></svg-load>
      </div>
    </div>
    <div class="cardTwo">
      <!-- 划转金额 -->
      <div class="top">{{ _t18('transfer_amount') }}</div>
      <div class="bottom">
        <input
          type="number"
          :placeholder="`${_t18('transfer_less', ['aams'])}1${params.coin?.toUpperCase()}`"
          v-model="params.amount"
        />
        <span @click="amountAll">
          {{ _t18('swap_all') }}
        </span>
        <i>|</i>
        <p>{{ params.coin?.toUpperCase() }}</p>
      </div>
    </div>
    <!-- 可用余额 -->
    <div class="keyong">
      {{ _t18('transfer_available') }}：<span class="fw-num"
        >{{ availableAmount }} {{ params.coin?.toUpperCase() }}</span
      >
    </div>
    <div class="btnBox" @click="submit">
      <!-- 确认划转 -->
      <ButtonBar :btnValue="_t18('transfer_require')" :btnColor="'#138A5D'" />
    </div>
  </div>
</template>

<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'

const { _isFreeze } = useFreeze()
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { getTransferList, getUserBalance } from '@/api/account'
import { onMounted, ref, computed } from 'vue'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store'
import { useUserStore } from '@/store/user'

const mainStore = useMainStore()
const userStore = useUserStore()
import { useToast } from '@/hook/useToast'

const { _toast } = useToast()

//数据
const params = ref({
  coin: 'usdt',
  transferOutAccount: '',
  transferInAccount: '',
  amount: ''
})

//获取余额
const availableList = ref([])
const getBalance = async () => {
  let res = await getUserBalance()
  if (res.code == '200') {
    availableList.value = res.data
  }
}
// 计算余额   -->1 平台资产 2理财资产 3合约账户
const availableAmount = computed(() => {
  let amountTemp = ''
  availableList.value.forEach((item, index) => {
    if (item?.type == params.value.transferOutAccount) {
      amountTemp = item.availableAmount
    }
  })

  return amountTemp
})

// 选择器数据
const tempList = computed(() => {
  const list = mainStore.getAssetsTabList.filter((item) => {
    // 对应参数key值 -->1 平台资产 2理财资产 3合约账户
    const key = { 平台资产: 1, 理财资产: 2, 合约资产: 3 }
    if (!item.isOpen) return false
    item.name == '平台资产' && (item.keyStr = _t18(item.keyStr, ['latcoin']))
    item.name == '理财资产' && (item.keyStr = _t18(item.keyStr, ['paxpay', 'latcoin']))
    item.name == '合约资产' && (item.keyStr = _t18(item.keyStr, ['paxpay', 'latcoin']))

    item['text'] = item.keyStr
    item['value'] = key[item.name]
    return true
  })
  return list.sort((a, b) => a.sort - b.sort)
  // return list || []
})
//默认值
params.value.transferOutAccount = tempList.value[0]?.value || ''
params.value.transferInAccount = tempList.value[1]?.value || ''
const transferOutAccountList = computed(() =>
  tempList.value.filter((item) => item.value != params.value.transferInAccount)
)
const transferInAccountList = computed(() =>
  tempList.value.filter((item) => item.value != params.value.transferOutAccount)
)

//提交
const submit = () => {
  if (DIFF_ISFREEZE.includes(__config._APP_ENV)) {
    if (_isFreeze(DIFF_ISFREEZE)) {
      submitForm()
    }
  } else {
    submitForm()
  }
}
const submitForm = () => {
  if (params.value.amount == '' || params.value.amount <= 0) {
    // showToast('请输入划转金额')
    return _toast('transfer_please_amount')
  }

  getTransferList(params.value).then((res) => {
    if (res.code == '200') {
      // showToast('操作成功，请稍后...')
      _toast('transfer_success')
      getBalance()
    } else {
      showToast(res.msg || '')
    }
  })
}

const amountAll = () => {
  params.value.amount = availableAmount.value
}

//交换
const jiaohuanbtn2 = () => {
  [params.value.transferOutAccount, params.value.transferInAccount] = [
    params.value.transferInAccount,
    params.value.transferOutAccount
  ]
}

onMounted(() => {
  getBalance()
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.content_box {
  padding: 0 15px;

  .title {
    font-size: 30px;
    margin: 30px 0;
  }

  .cardOne,
  .cardTwo {
    padding: 0 20px;
    background-color: var(--ex-div-bgColor26);
    margin-top: 20px;
    border-radius: 5px;
  }

  .cardOne {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      margin-right: 20px;
      flex: 1;

      & > div {
        // padding: 15px 0;
        display: flex;
        color: var(--ex-font-color13);

        p {
          margin-left: 20px;
        }

        span {
          display: inline-block;
          width: 40px;
        }
      }

      .left_top {
        border-bottom: 1px dashed var(--ex-border-color9);
        display: flex;
        align-items: center;
      }

      .left_bottom {
        display: flex;
        align-items: center;
      }
    }

    .huazhuanbtn {
      font-size: 30px;
    }
  }

  .cardTwo {
    padding: 15px 15px;

    .top {
      margin-bottom: 15px;
      color: var(--ex-font-color13);
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--ex-border-color8);

      i {
        padding: 0 10px;
      }

      span {
        color: var(--ex-font-color2);
      }

      input {
        flex: 1;
        margin-right: 20px;
        padding-bottom: 12px;

        background-color: transparent;
      }

      input::placeholder {
        color: var(--ex-font-color5);
      }
    }
  }

  .keyong {
    margin-top: 15px;
    color: var(--ex-font-color13);
    font-size: 12px;
  }

  .btnBox {
    margin-top: 50px;
  }
}

.van-dropdown-menu {
  flex: 1;
  display: flex;

  :deep(.van-popup--top) {
    max-width: var(--ex-max-width);
    left: 50%;
    translate: -50%;
  }
}

:deep(.van-cell) {
  background: var(--ex-default-background-color) !important;
  color: var(--ex-default-font-color);
}

:deep(.van-dropdown-menu__bar) {
  background-color: transparent;
  box-shadow: none;
  // height: auto;
}

:deep(.van-dropdown-menu__title) {
  color: var(--ex-default-font-color);
  font-size: 14px;
  padding-left: 20px;
}

:deep(.van-dropdown-menu__title:after) {
  border-color: transparent transparent var(--ex-border-color9) var(--ex-border-color9);
}
</style>
