<!-- 质押挖矿 -->
<script setup>
import { priceFormat } from '@/utils/decimal.js'
import { useRouter } from 'vue-router'
import Popup from '@/components/Popup/index.vue'
import Card from './components/card.vue'
const router = useRouter()
const showRule = ref(false)
const txt = '说明'
const direction = ref('bottom')
let showPopup = () => {
  showRule.value = true
}
let closePopup = () => {
  showRule.value = false
}
const cuttentRight = reactive({
  iconRight: [
    { iconName: 'guize', clickTo: '' },
    { iconName: 'jilu', clickTo: '/pledge/pledgeOrder' }
  ]
})
const toView = (data) => {
  router.push({
    path: '/pledge/pledgeDetail',
    query: { data: encodeURI(JSON.stringify(data)) }
  })
}
const projectList = computed(() => {
  let list = []
  list = [
    {
      id: 1,
      title: '项目一',
      kegou: '5',
      sum: '50',
      xiane: '200-500',
      rate: '0%-10%',
      period: '15'
    },
    {
      id: 2,
      title: '项目二',
      kegou: '10',
      sum: '50',
      xiane: '200-500',
      rate: '0%-10%',
      period: '20'
    },
    {
      id: 3,
      title: '项目三',
      kegou: '15',
      sum: '50',
      xiane: '200-500',
      rate: '0%-10%',
      period: '25'
    }
  ]
  return list
})
const manual = computed(() => {
  let list = []
  list = [
    {
      title: '什么是质押挖矿？',
      content: [
        {
          childContent:
            '质押挖矿是本公司打造的一款帮助用户快捷进行链上质押获取奖励的工具产品。通过将数字资产质押在区块链网络，并获得基于POS（Proof of Stake，即权益证明）机制产生的奖励。在这个机制中，用户将数字资产委托给节点，节点在区块链上行使出块、打包交易等权利并获得奖励。用户根据锁仓数量按比例分享节点获得的奖励。'
        }
      ],
      notes: [
        ' 注：(非出借)每6小时一个阶段每天发送4次收益详情，您可以通过收益详情查看详细收益情况。 ',
        ' 注：(本产品属福利项引流产品目前名额有限，后续将对用户增设数字资产评估，只对达标用户开启该产品，所以先到先得)。 '
      ]
    },
    {
      title: '产品优势',
      content: [
        {
          childTitle: '稳健型',
          childContent: '质押挖矿可以获得第三方相对稳定的奖励，产品期限多样。'
        }
      ]
    },
    {
      title: '投向生息资产说明',
      content: [
        {
          childContent:
            '质押挖矿是将您的数字资产质押在区块链上，以支持该区块链网络的运营，并获得相应的奖励。'
        }
      ]
    },
    {
      title: '收益说明',
      content: [
        {
          childContent: 'T日申购成功后，T+1日00:00开始起息，02:00利息结算。'
        }
      ]
    },
    {
      title: '交易说明',
      content: [
        {
          childTitle: '买入规则',
          childContent: '支持随时申购。'
        }
      ]
    },
    {
      title: '风险提示',
      content: [
        {
          childContent: '提前赎回定期产品，系统将扣除该笔订单已经获得的部分收益。'
        }
      ]
    }
  ]
  return list
})
</script>
<template>
  <!-- 质押挖矿规则弹窗 -->
  <Popup
    :show="showRule"
    :direction="direction"
    @handelClose="closePopup"
    :title="txt"
    :content="manual"
  >
  </Popup>
  <HeaderBar
    :currentName="`质押挖矿`"
    :cuttentRight="cuttentRight"
    @showPopup="showPopup"
  ></HeaderBar>
  <!-- 收益信息（资金、收益） -->
  <div class="userAccount">
    <div class="fund">
      <div class="title">正在托管的资金<span>(USDT)</span></div>
      <div class="amount fw-num">{{ priceFormat(27326) }}</div>
    </div>
    <div class="profit">
      <div>
        <p class="profit_til">今日收益</p>
        <p class="profit_txt ff-num">{{ priceFormat(27326) }}</p>
      </div>
      <div>
        <p class="profit_til">累计收益</p>
        <p class="profit_txt ff-num">{{ priceFormat(27326) }}</p>
      </div>
      <div>
        <p class="profit_til">委托订单</p>
        <p class="profit_txt ff-num">{{ priceFormat(27326) }}</p>
      </div>
    </div>
  </div>
  <!-- 项目信息 -->
  <div class="project">
    <div class="projectList" v-if="projectList?.length > 0">
      <Card
        v-for="(item, index) in projectList"
        @click="toView(item)"
        :key="index"
        :cardData="item"
      ></Card>
    </div>
    <Nodata v-else></Nodata>
  </div>
</template>
<style lang="scss" scoped>
.userAccount {
  font-size: 14px;
  padding: 20px 15px 30px;
  color: var(--ex-default-font-color);
  .fund {
    .title {
      margin-bottom: 14px;
      span {
        color: var(--ex-passive-font-color);
      }
    }
    .amount {
      font-size: 28px;
    }
  }
  .profit {
    & > div {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      & > p:first-child {
        color: var(--ex-passive-font-color);
      }
      & > p:last-child {
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
}
</style>
