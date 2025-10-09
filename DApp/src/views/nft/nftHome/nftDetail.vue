<template>
  <HeaderBar>
    <template #titleName>
      <div style="font-weight: bold">{{ `NENO CUTE #126` }}</div>
    </template>
  </HeaderBar>
  <div class="homeImg">
    <img src="https://static.runoob.com/images/demo/demo2.jpg" alt="" />
  </div>
  <div class="nftDetail">
    <!-- 价格 -->
    <Price :title="titlePrice">
      <template #footerPrice>
        <div class="footerPriceUp fw-num">
          <svg-load name="jiantou-sright" class="leftImg"></svg-load>
          <div class="text">0% above the floor price <span>0.015 ETH</span></div>
        </div>
      </template>
    </Price>
    <!-- 截止时间 -->
    <Deadline></Deadline>
    <!-- 详情 -->
    <Details></Details>
    <!-- 描述 -->
    <Describe></Describe>
    <!-- 报价 -->
    <Quotation></Quotation>
    <!-- 交易历史 -->
    <History></History>
  </div>
  <div class="bottomButton">
    <div class="twoList">
      <div class="item" @click="quotationShow = true">报价</div>
      <div class="item immediately" @click="buyNowShow = true">立即购买</div>
    </div>
    <!-- <div class="onList">
      <div class="item" @click="quotationShow = true">报价</div>
    </div> -->
  </div>
  <Service></Service>
  <!-- 报价 -->
  <OverlayPulic :show="quotationShow" :z-index="999">
    <template #contentCustomize>
      <div class="beCurrent">
        <div>报价</div>
        <svg-load class="closeSvg" name="guanbi" @click="quotationShow = false"></svg-load>
      </div>
      <div class="quotationOver">
        <div class="price">
          <div class="title ff-num">上架价格</div>
          <div class="num fw-num">22 USDT &nbsp;<span class="right">≈ 22.00 USD</span></div>
          <slot name="footerPrice"></slot>
        </div>
        <div class="signing">
          <div class="title ff-num">签约</div>
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
          <div class="available">
            <span>可用余额：</span>
            <span>0 USDT</span>
          </div>
          <div class="descriptiveText">
            相关数量的加密货币将冻结，并在您的报价取消或到期 时自动解冻。
          </div>
          <div class="title ff-num marginTop">出价有效期至</div>
          <div class="periodValidity" @click="showDateOverlay = true">
            <div>2023-08-15 16:19</div>
            <svg-load class="dateSvg" name="rili"></svg-load>
          </div>
          <div class="buttonlist">
            <div class="item" @click="quotationShow = false">取消</div>
            <div class="item confirm" @click="quotationSuccess(false)">确认</div>
          </div>
        </div>
      </div>
    </template>
  </OverlayPulic>
  <!-- 立即购买 -->
  <OverlayPulic :show="buyNowShow" :z-index="999">
    <template #contentCustomize>
      <div class="beCurrent">
        <div>购买</div>
        <svg-load class="closeSvg" name="guanbi" @click="buyNowShow = false"></svg-load>
      </div>
      <div class="buyNowPrice">22.00 USDT</div>
      <ItemRow
        :currentImg="buyNowlist.rowUrl"
        :rightList="buyNowlist.rowRight"
        :bottomList="buyNowlist.rowBottom"
      ></ItemRow>
      <div class="quotationOver">
        <div class="signing">
          <div class="title ff-num">签约</div>
          <div class="bottom" :class="showBuyPopover ? 'headerItemHight' : ''">
            <div class="headerItem">
              <van-popover v-model:show="showBuyPopover">
                <div class="rightScondList">
                  <div class="rightScondListItem">
                    {{ '全部' }}
                  </div>
                </div>
                <template #reference>
                  <div class="entrustSelect left">
                    <div>USDT</div>
                    <svg-load v-show="!showBuyPopover" name="jiantou10x5-x" class="img"></svg-load>
                    <svg-load v-show="showBuyPopover" name="jiantou10x5-s" class="img"></svg-load>
                    <div class="line"></div>
                  </div>
                </template>
              </van-popover>
            </div>
            <div class="signingBottom">
              <input type="text" class="signinginput" />
            </div>
          </div>
          <div class="available">
            <span>可用余额：</span>
            <span>0 USDT</span>
          </div>
          <div class="buttonlist">
            <div class="item" @click="buyNowShow = false">取消</div>
            <div class="item confirm" @click="quotationSuccess(true)">确认</div>
          </div>
        </div>
      </div>
    </template>
  </OverlayPulic>
  <!-- 报价成功 -->
  <OverlayPulic :show="successfulQuotation" :z-index="999">
    <template #contentCustomize>
      <div class="beCurrent">
        <div>{{ !showSuccessText ? '报价' : '购买' }}</div>
        <svg-load class="closeSvg" name="guanbi" @click="successfulQuotation = false"></svg-load>
      </div>
      <svg-load class="successImg" name="chenggong"></svg-load>
      <div class="successText">{{ !showSuccessText ? '报价成功' : '购买成功' }}</div>
      <ItemRow
        :currentImg="successList.rowUrl"
        :rightList="successList.rowRight"
        :bottomList="successList.rowBottom"
      ></ItemRow>
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
</template>
<script setup>
import { reactive, computed } from 'vue'
import PublicPopup from '@/components/Popup/public.vue'
import Service from '@/views/nft/components/Service/index.vue' //客服
import Price from '@/views/nft/components/NftDetail/price.vue' // 价格
import Deadline from '@/views/nft/components/NftDetail/deadline.vue' // 截止时间
import Details from '@/views/nft/components/NftDetail/details.vue' // 详情
import Describe from '@/views/nft/components/NftDetail/describe.vue' // 描述
import Quotation from '@/views/nft/components/NftDetail/quotation.vue' // 报价
import History from '@/views/nft/components/NftDetail/history.vue' // 交易历史
import ItemRow from '@/views/nft/components/NftDetail/itemRow.vue' // 弹窗的每一行展示内容
const titlePrice = ref('价格')
const quotationShow = ref(false) // 报价
const buyNowShow = ref(false) // 立即购买
const showPopover = ref(false) // 签约币种报价flag
const showBuyPopover = ref(false) // 签约币种购买flag
const showDateOverlay = ref(false) // 日期flag
const currentDate = ref(['01', '06', '2023']) // 年月日
const currentTime = ref(['12', '00', '01']) // 时分秒
const showSwtich = ref(true)
// 购买的row
const buyNowlist = computed(() => {
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
    rowBottom: []
  }
})
// 报价成功/购买的row
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
const successfulQuotation = ref(false)
const showSuccessText = ref(false)
// 报价/购买确认按钮
const quotationSuccess = (flag) => {
  quotationShow.value = false
  buyNowShow.value = false
  showSuccessText.value = flag
  successfulQuotation.value = true
}
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
</script>
<style lang="scss" scoped>
.homeImg {
  padding: 20px 15px 0;
  img {
    width: 345px;
    height: 345px;
    object-fit: cover;
    border-radius: 10px;
  }
}
.nftDetail {
  padding: 0 15px 120px;
}
.bottomButton {
  max-width: var(--ex-max-width);
  width: 100%;
  height: 110px;
  position: fixed;
  bottom: 0;
  background-color: var(--ex-default-background-color);
  padding: 30px 15px;
  .twoList {
    max-width: var(--ex-max-width);
    display: flex;
    justify-content: space-between;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 167px;
      height: 50px;
      background: var(--ex-div-bgColor10);
      border-radius: 3px 3px 3px 3px;
      font-size: 16px;
      color: var(--ex-font-color6);
    }
    .immediately {
      background: var(--ex-div-bgColor1);
      color: var(--ex-font-color);
    }
  }
  .onList {
    max-width: var(--ex-max-width);
    display: flex;
    justify-content: space-between;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 50px;
      background: var(--ex-div-bgColor10);
      border-radius: 3px 3px 3px 3px;
      font-size: 16px;
      color: var(--ex-font-color6);
    }
  }
}
.footerPriceUp {
  display: flex;
  align-items: center;
  margin-top: 10px;
  .leftImg {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
  .text {
    font-size: 14px;
    font-weight: bold;
    color: var(--ex-passive-font-color);
    span {
      color: var(--ex-font-color6);
    }
  }
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
.buyNowPrice {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: var(--ex-font-color6);
  margin: 30px 0;
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
.quotationOver {
  .price {
    margin-top: 30px;
    .title {
      font-size: 14px;
      color: var(--ex-font-color6);
    }
    .num {
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: bold;
      color: var(--ex-font-color6);
      .right {
        font-size: 14px;
        color: var(--ex-passive-font-color);
      }
    }
  }
  .signing {
    margin-top: 20px;
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
    .available {
      margin-top: 10px;
      text-align: right;
      font-size: 12px;
      color: var(--ex-font-color6);
      .num {
        font-weight: bold;
      }
    }
    .descriptiveText {
      margin-top: 20px;
      padding: 10px;
      background: var(--ex-div-bgColor23);
      border-radius: 3px 3px 3px 3px;
      font-size: 12px;
      color: var(--ex-font-color6);
      line-height: 15px;
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
        background: var(--ex-div-bgColor1);
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
</style>
