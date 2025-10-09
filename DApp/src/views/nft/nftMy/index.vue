<template>
  <HeaderBar :currentName="`NFT`" />
  <div class="header">
    <img src="https://static.runoob.com/images/demo/demo2.jpg" alt="" class="headerImg" />
    <div class="headerRight">
      <div class="top">Anonymous-User-d5863</div>
      <div class="bottom">总成交量<span class="num">0 USD</span></div>
    </div>
  </div>
  <div class="headerChoose">
    <van-tabs
      v-model:active="currentIndex"
      line-width="20"
      line-height="2"
      color="#3CBC8C"
      background="#fff"
      title-active-color="#000000"
      title-inactive-color="#000000"
      @click-tab="switchBtn(currentIndex)"
    >
      <van-tab v-for="(item, index) in headerList" :key="index">
        <template #title>
          <div>{{ item.name }}</div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
  <!-- 三条数据已收集 -->
  <div class="tabsThree" v-show="currentIndex === 0">
    <div
      class="item"
      :class="threeIndex === index ? 'itemHight' : ''"
      v-for="(item, index) in threeList"
      :key="index"
      @click="chooseThree(index)"
    >
      {{ item.name }}
    </div>
  </div>
  <!-- 2条数据报价 -->
  <div class="tabsTwo" v-show="currentIndex === 2">
    <div
      class="item"
      :class="twoIndex === index ? 'itemHight' : ''"
      v-for="(item, index) in twoList"
      :key="index"
      @click="chooseTwo(index)"
    >
      {{ item.name }}
    </div>
  </div>
  <!-- 已收集 -->
  <footer v-show="currentIndex === 0">
    <FooterList @click.stop="$router.push('/nftDetail')">
      <template #footerBottom>
        <div class="bottomItem">
          <div class="left ff-num">价格</div>
          <div class="right ff-num">22.00USDT</div>
        </div>
        <div class="bottomButton bottomButtonHight" @click.stop="grounding(123)">上架</div>
        <div class="bottomButton" @click.stop="cancelListing">取消上架</div>
      </template>
    </FooterList>
  </footer>
  <!-- 已上架 -->
  <footer v-show="currentIndex === 1">
    <FooterList>
      <template #footerBottom>
        <div class="bottomItem">
          <div class="left ff-num">价格</div>
          <div class="right ff-num">22.00USDT</div>
        </div>
        <div class="bottomButton">取消上架</div>
      </template>
    </FooterList>
  </footer>
  <!-- 报价 -->
  <footer v-show="currentIndex === 2">
    <FooterList>
      <template #footerBottom>
        <div class="bottomItem">
          <div class="left ff-num">价格</div>
          <div class="right ff-num">22.00USDT</div>
        </div>
        <div class="bottomItem">
          <div class="left ff-num">报价</div>
          <div class="right ff-num">22.00USDT</div>
        </div>
        <div v-show="!twoIndex" class="bottomButton bottomButtonHight">取消报价</div>
        <div v-show="twoIndex" class="bottomButton">取消上架</div>
      </template>
    </FooterList>
  </footer>
  <!-- 交易历史 -->
  <div class="transactionHistory" v-show="currentIndex === 3">
    <HistoryItem @click="$router.push('/nftDetail')"></HistoryItem>
  </div>
  <!-- 上架 -->
  <OverlayPulic :show="groundingShow" :z-index="999">
    <template #contentCustomize>
      <div class="beCurrent">
        <div>上架</div>
        <svg-load class="closeSvg" name="guanbi" @click="groundingShow = false"></svg-load>
      </div>
      <div class="quotationOver">
        <div class="signing">
          <div class="title ff-num">价格</div>
          <div class="bottom" :class="showPopover ? 'headerItemHight' : ''">
            <div class="headerItem">
              <van-popover v-model:show="showPopover">
                <div class="rightScondList">
                  <div class="rightScondListItem">
                    {{ '全部' }}
                  </div>
                </div>
                <template #reference>
                  <div class="entrustSelect left">
                    <div>USDT</div>
                    <svg-load v-show="!showPopover" name="jiantou10x5-x" class="img"></svg-load>
                    <svg-load v-show="showPopover" name="jiantou10x5-s" class="img"></svg-load>
                    <div class="line"></div>
                  </div>
                </template>
              </van-popover>
            </div>
            <div class="signingBottom">
              <input type="text" class="signinginput" />
            </div>
          </div>
          <div class="title ff-num marginTop">上架有效期至</div>
          <div class="periodValidity" @click="showDateOverlay = true">
            <div>2023-08-15 16:19</div>
            <svg-load class="dateSvg" name="rili"></svg-load>
          </div>
          <div class="buttonlist">
            <div class="item" @click="groundingShow = false">取消</div>
            <div class="item confirm" @click="groundingSuccess()">确认</div>
          </div>
        </div>
      </div>
    </template>
  </OverlayPulic>
  <!-- 日期时间组件 -->
  <PublicPopup :show="showDateOverlay" :direction="`bottom`" :showHeader="false">
    <template #contentCustomize>
      <div class="dateSelect" v-show="showSwtich">
        <van-date-picker
          v-model="currentDate"
          title="选择日期"
          :cancel-button-text="`取消`"
          :confirm-button-text="`确认`"
          @confirm="confirmDate"
          @cancel="cancelDate"
          :columns-type="['day', 'month', 'year']"
        />
      </div>
      <div class="dateSelect" v-show="!showSwtich">
        <van-time-picker
          v-model="currentTime"
          title="选择时间"
          :columns-type="['hour', 'minute', 'second']"
          :cancel-button-text="`取消`"
          :confirm-button-text="`确认`"
          @confirm="confirmTime"
          @cancel="cancelTime"
        />
      </div>
    </template>
  </PublicPopup>
  <!-- 上成功 -->
  <OverlayPulic :show="successfulGrounding" :z-index="999">
    <template #contentCustomize>
      <div class="beCurrent">
        <div>{{ '上架' }}</div>
        <svg-load class="closeSvg" name="guanbi" @click="successfulGrounding = false"></svg-load>
      </div>
      <svg-load class="successImg" name="chenggong"></svg-load>
      <div class="successText">{{ '上架成功' }}</div>
      <ItemRow
        :currentImg="successList.rowUrl"
        :rightList="successList.rowRight"
        :bottomList="successList.rowBottom"
      ></ItemRow>
    </template>
  </OverlayPulic>
  <Dialog
    :show="showCancel"
    :title="``"
    :content="``"
    confirm-button-color="#17ac74"
    @cancelBtn="cancelBtn"
    @confirmBtn="confirmBtn"
    :confirmButtonText="_t18('btnConfirm', ['bitmake'])"
    :cancelButtonText="_t18('cancel')"
    z-index="200"
    :overlayStyle="{ height: '130%' }"
  >
    <template #content>
      <div class="dialogText">
        <div>当前NFT已经有人报价</div>
        <div class="item">取消上架将扣除 <span class="num ff-num">1%</span> 违约金</div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import PublicPopup from '@/components/Popup/public.vue'
import { _t18 } from '@/utils/public'
import FooterList from '@/views/nft/components/NftList/index.vue' // 作品列表
import HistoryItem from '@/views/nft/components/NftList/historyItem.vue' // 交易历史
import ItemRow from '@/views/nft/components/NftDetail/itemRow.vue' // 弹窗的每一行展示内容
import { ref, onMounted, reactive, computed } from 'vue'
let currentIndex = ref(0)
const showPopover = ref(false) // 签约币种报价flag
const headerList = computed(() => {
  return [
    {
      name: '已收集'
    },
    {
      name: '已上架'
    },
    {
      name: '报价'
    },
    {
      name: '交易历史'
    }
  ]
})
const threeIndex = ref(0)
const threeList = computed(() => {
  return [
    {
      name: '全部'
    },
    {
      name: '已上架'
    },
    {
      name: '未上架'
    }
  ]
})
const twoIndex = ref(0)
const twoList = computed(() => {
  return [
    {
      name: '已出报价'
    },
    {
      name: '收到报价'
    }
  ]
})
// 全部/已上架/未上架切换
const chooseThree = (index) => {
  threeIndex.value = index
}
//  已出报价/收到报价切换
const chooseTwo = (index) => {
  twoIndex.value = index
}
// 切换
const switchBtn = () => {}
// 上架
const grounding = (event) => {
  console.log(event)
  groundingShow.value = true
}
const showCancel = ref(false) // 取消上架状态flag
// 取消上架弹窗打开
const cancelListing = () => {
  showCancel.value = true
}
// 取消上架弹窗关闭
const cancelBtn = () => {
  showCancel.value = false
}
// 取消上架弹窗确认
const confirmBtn = () => {
  console.log(12312)
  showCancel.value = false
}
const groundingShow = ref(false) // 上架flag
const showDateOverlay = ref(false) // 日期flag
const currentDate = ref(['01', '06', '2023']) // 年月日
const currentTime = ref(['12', '00', '01']) // 时分秒
const showSwtich = ref(true)
// 选择日期
const confirmDate = () => {
  showSwtich.value = false
  console.log(currentDate.value)
}
// 关闭弹窗
const cancelDate = () => {
  showDateOverlay.value = false
}
// 选择时间完成
const confirmTime = () => {
  showSwtich.value = true
  showDateOverlay.value = false
  console.log(currentTime.value)
}
// 取消选择时间，返回上一次层
const cancelTime = () => {
  showSwtich.value = true
}
// 上架成功按钮
const groundingSuccess = () => {
  groundingShow.value = false
  successfulGrounding.value = true
}
// 上架成功flag
const successfulGrounding = ref(false)
// 上架成功数据
const successList = computed(() => {
  return {
    rowUrl: 'https://static.runoob.com/images/demo/demo2.jpg',
    rowRight: [
      {
        leftName: '分类',
        rightName: 'Art'
      },
      {
        leftName: '创作者',
        rightName: 'Art'
      },
      {
        leftName: '截止时间',
        rightName: 'Art'
      },
      {
        leftName: '报价价格',
        rightName: 'Art'
      }
    ],
    rowBottom: [{ name: '123' }, { name: 456 }]
  }
})
</script>
<style lang="scss" scoped>
.header {
  padding: 20px 15px 10px;
  display: flex;
  .headerImg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }
  .headerRight {
    flex: 1;
    .top {
      margin-top: 4px;
      font-size: 16px;
      font-weight: bold;
      color: var(--ex-font-color6);
    }
    .bottom {
      margin-top: 4px;
      font-size: 12px;
      font-weight: 400;
      color: var(--ex-passive-font-color);
      .num {
        margin-left: 10px;
        font-weight: bold;
        color: var(--ex-font-color6);
      }
    }
  }
}
.headerChoose {
  display: flex;
  padding: 10px 0px 0;
  :deep(.van-tabs) {
    width: 100%;
  }
  :deep(.van-tab) {
    flex: none;
    width: calc(25%);
    font-size: 12px;
    padding: 0;
    color: var(--ex-font-color6);
  }
  :deep(.van-tab:nth-child(1)) {
    width: 20%;
  }
  :deep(.van-tab:nth-child(2)) {
    width: 30%;
  }
  :deep(.van-tab:nth-child(3)) {
    width: 30%;
  }
  :deep(.van-tab:nth-child(4)) {
    width: 20%;
  }
}
.tabsThree {
  display: flex;
  padding: 20px 15px 0;
  .item {
    flex: 1;
    height: 35px;
    border: 1px solid var(--ex-border-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: var(--ex-font-color6);
  }
  .item:nth-child(2) {
    margin: 0 10px;
  }
}
.tabsTwo {
  display: flex;
  padding: 20px 15px 0;
  justify-content: space-between;
  .item {
    width: 166px;
    height: 35px;
    border: 1px solid var(--ex-border-color);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: var(--ex-font-color6);
  }
}
.itemHight {
  color: var(--ex-font-color) !important;
  border: none !important;
  background-color: var(--ex-primary-color) !important;
}
footer {
  margin-top: 20px;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  .bottomItem {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    .left {
      color: var(--ex-passive-font-color);
    }
    .right {
      font-weight: bold;
      color: var(--ex-font-color6);
    }
  }
  .bottomButton {
    display: inline-block;
    margin-top: 20px;
    padding: 6px 20px;
    border-radius: 3px 3px 3px 3px;
    font-size: 12px;
    color: var(--ex-font-color6);
    background: var(--ex-div-bgColor10);
  }
  .bottomButtonHight {
    background-color: var(--ex-div-bgColor1)!important;
    color: var(--ex-font-color) !important;
  }
}
.transactionHistory {
  padding: 20px 15px 0;
}
.beCurrent {
  padding-top: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--ex-font-color6);
  position: relative;
  .closeSvg {
    position: absolute;
    right: 0;
    top: 25%;
    width: 24px;
    height: 24px;
  }
}
.quotationOver {
  .signing {
    margin-top: 30px;
    .title {
      font-size: 14px;
      color: var(--ex-font-color6);
    }
    .marginTop {
      margin-top: 20px;
    }
    .bottom {
      margin-top: 10px;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid var(--ex-border-color);
      display: flex;
      align-items: center;
      .headerItem {
        width: 120px;
        .entrustSelect {
          width: 120px;
          padding: 15px 15px 15px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          font-size: 16px;
          font-weight: bold;
          color: var(--ex-font-color6);
          position: relative;
          .img {
            width: 10px;
            height: 5px;
          }
          .line {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 1px;
            height: 21px;
            background-color: var(--ex-div-bgColor10);
          }
        }
      }
      .signingBottom {
        padding: 0 10px;
        flex: 1;
        .signinginput {
          width: 100%;
          font-size: 16px;
          color: var(--ex-font-color6);
        }
      }
    }
    .headerItemHight {
      border: 1px solid var(--ex-border-color4);
    }
    .periodValidity {
      margin-top: 10px;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid var(--ex-border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 10px;
      font-weight: bold;
      color: var(--ex-font-color6);
      font-size: 16px;
      .dateSvg {
        width: 13px;
        height: 13px;
      }
    }
    .buttonlist {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .item {
        width: 145px;
        height: 50px;
        background: var(--ex-div-bgColor10);
        border-radius: 3px 3px 3px 3px;
        font-size: 16px;
        color: var(--ex-font-color6);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .confirm {
        background: var(--ex-primary-color);
        color: var(--ex-font-color);
      }
    }
  }
}
.rightScondList {
  width: 120px;
  margin-top: 3px;
  background-color: var(--ex-default-background-color);
  padding: 5px 0;
  font-size: 12px;
  color: var(--ex-font-color6);
  .rightScondListItem {
    padding: 10px;
    font-weight: bold;
  }
}
.dateSelect {
  :deep(.van-picker__confirm) {
    color: var(--ex-font-color9);
  }
}
.successImg {
  display: block;
  margin: 30px auto 10px;
  width: 70px;
  height: 70px;
}
.successText {
  font-size: 14px;
  text-align: center;
  margin-bottom: 30px;
  color: var(--ex-passive-font-color);
}
.dialogText {
  padding: 50px 0;
  text-align: center;
  font-size: 16px;
  color: var(--ex-font-color6);
  .item {
    margin-top: 10px;
    .num {
      font-weight: bold;
      color: var(--ex-font-color3);
    }
  }
}
</style>
