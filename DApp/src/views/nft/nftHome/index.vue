<template>
  <HeaderBar :currentName="`NFT`" />
  <div class="search">
    <Search @click="$router.push('/nftResult')"></Search>
  </div>
  <div class="carousel">
    <van-swipe :autoplay="3000" lazy-render :loop="true" :show-indicators="false">
      <van-swipe-item>
        <img src="https://static.runoob.com/images/demo/demo2.jpg" alt="" class="carouselItem" />
      </van-swipe-item>
    </van-swipe>
  </div>
  <div class="headerChoose">
    <van-tabs
      v-model:active="currentIndex"
      line-width="20"
      line-height="2"
      color="#3CBC8C"
      background="#fff"
      title-active-color="#000000"
      title-inactive-color="#838B9C"
      @click-tab="switchBtn(currentIndex)"
    >
      <van-tab v-for="(item, index) in headerList" :key="index">
        <template #title>
          <div>{{ item.name }}</div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
  <div class="list">
    <div class="header">
      <!-- 第一个下拉 -->
      <div class="headerItem" :class="showFirstPopover ? 'headerItemHight' : ''">
        <van-popover v-model:show="showFirstPopover">
          <div class="rightScondList">
            <div
              class="rightScondListItem"
              :class="showFirstIndex === index ? 'hightBlue' : ''"
              v-for="(item, index) in showFirstList"
              :key="index"
              @click="checkedFirst(index)"
            >
              <image-load :filePath="item.logo" v-if="item.logo" class="imgLogo" />
              <div>{{ item.showSymbol }}</div>
            </div>
          </div>
          <template #reference>
            <div class="entrustSelect left">
              <div class="entrustName text-ellipsis">
                {{ showFirstList[showFirstIndex].showSymbol }}
              </div>
              <svg-load v-show="!showFirstPopover" name="jiantou10x5-x" class="img"></svg-load>
              <svg-load v-show="showFirstPopover" name="jiantou10x5-s" class="img"></svg-load>
            </div>
          </template>
        </van-popover>
      </div>
      <!-- 第2个下拉 -->
      <div class="headerItem" :class="showSecondPopover ? 'headerItemHight' : ''">
        <van-popover v-model:show="showSecondPopover">
          <div class="rightScondList">
            <div class="rightScondListItem">
              {{ '全部' }}
            </div>
          </div>
          <template #reference>
            <div class="entrustSelect left">
              <div>123</div>
              <svg-load v-show="!showSecondPopover" name="jiantou10x5-x" class="img"></svg-load>
              <svg-load v-show="showSecondPopover" name="jiantou10x5-s" class="img"></svg-load>
            </div>
          </template>
        </van-popover>
      </div>
      <!-- 第3个下拉 -->
      <div class="headerItem" :class="showThirdPopover ? 'headerItemHight' : ''">
        <van-popover v-model:show="showThirdPopover">
          <div class="rightScondList">
            <div class="rightScondListItem">
              {{ '全部' }}
            </div>
          </div>
          <template #reference>
            <div class="entrustSelect left">
              <div>123</div>
              <svg-load v-show="!showThirdPopover" name="jiantou10x5-x" class="img"></svg-load>
              <svg-load v-show="showThirdPopover" name="jiantou10x5-s" class="img"></svg-load>
            </div>
          </template>
        </van-popover>
      </div>
    </div>
    <div class="mainTitle">
      <div>合集</div>
      <div>地板价</div>
    </div>
    <div class="contain">
      <div class="item" @click="$router.push('/listDetail')">
        <div class="num fw-num">
          <svg-load name="1" class="num"></svg-load>
        </div>
        <div class="leftImg"></div>
        <div class="right fw-num">
          <div class="right-L">
            <div class="top">frENS</div>
            <div class="bottom">Vol. <span>7.06 ETH</span></div>
          </div>
          <div class="right-R">
            <div class="top fw-bold">&lt; 0.01 ETH</div>
            <div class="bottom ff-num">-42.37%</div>
          </div>
        </div>
      </div>
      <div class="item" @click="$router.push('/listDetail')">
        <div class="num fw-num">
          <svg-load name="1" class="num"></svg-load>
        </div>
        <div class="leftImg"></div>
        <div class="right fw-num">
          <div class="right-L">
            <div class="top">frENS</div>
            <div class="bottom">Vol. <span>7.06 ETH</span></div>
          </div>
          <div class="right-R">
            <div class="top fw-bold">&lt; 0.01 ETH</div>
            <div class="bottom ff-num">-42.37%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Service></Service>
</template>
<script setup>
import Search from '@/views/nft/components/Search/index.vue'
import Service from '@/views/nft/components/Service/index.vue'
import { useTradeStore } from '@/store/trade/index'
import { ref, onMounted, reactive, computed } from 'vue'
import { _t18 } from '@/utils/public'
const tradeStore = useTradeStore()
const secondContractCoinList = computed(() => {
  return tradeStore.secondContractCoinList.filter((it, inx) => {
    return it.coinType == 2
  })
})
let currentIndex = ref(0)
const headerList = computed(() => {
  return [
    {
      name: '热门'
    },
    {
      name: '最佳'
    }
  ]
})
const showFirstPopover = ref(false) // 第一个下拉
const showFirstIndex = ref(0)
// 第一个列表
const showFirstList = computed(() => {
  return [
    ...[
      {
        showSymbol: '全部'
      }
    ],
    ...secondContractCoinList.value
  ]
})
const checkedFirst = (i) => {
  showFirstIndex.value = i
  showFirstPopover.value = false
}
const showSecondPopover = ref(false) // 第二个下拉
const showThirdPopover = ref(false) // 第三个下拉

// 切换
const switchBtn = () => {}
</script>
<style lang="scss" scoped>
.hightBlue {
  color: var(--ex-font-color2) !important;
}

.search {
  padding: 20px 15px;
}

.carousel {
  padding: 0 15px;
  height: 190px;

  .carouselItem {
    height: 190px;
    width: 100%;
    object-fit: cover;
  }
}

.headerChoose {
  display: flex;
  padding: 10px 15px 0;
  font-weight: 700;
  background: var(--ex-home-list-bgcolor);

  :deep(.van-tab) {
    flex: none;
    font-size: 16px;
    margin-right: 30px;
    background: var(--ex-home-list-bgcolor);
    padding: 0;
  }
}

.rightScondList {
  max-height: 178px;
  overflow-y: auto;
  min-width: 109px;
  margin-top: 3px;
  background-color: var(--ex-default-background-color);
  padding: 5px 0;
  font-size: 12px;
  color: var(--ex-font-color6);

  .rightScondListItem {
    padding: 10px;
    display: flex;
    align-items: center;

    .imgLogo {
      width: 14px;
      height: 14px;
      margin-right: 5px;
    }
  }
}

.list {
  padding: 20px 15px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .headerItem {
      width: 109px;
      height: 35px;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid var(--ex-border-color);

      .entrustSelect {
        width: 109px;
        padding: 0 10px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        font-size: 14px;
        color: var(--ex-font-color6);

        .entrustName {
          width: 80px;
        }

        .img {
          width: 10px;
          height: 5px;
        }
      }
    }

    .headerItemHight {
      border: 1px solid var(--ex-border-color4);
    }
  }

  .mainTitle {
    font-size: 12px;
    color: var(--ex-passive-font-color);
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex-border-color);
  }

  .contain {
    .item {
      margin-top: 20px;
      display: flex;
      align-items: center;

      .num {
        font-size: 16px;
        width: 24px;
        height: 24px;
        text-align: center;
        margin-right: 8px;
      }

      .leftImg {
        width: 40px;
        height: 40px;
        background-color: var(--ex-div-bgColor24);
        border-radius: 5px;
        margin-right: 10px;
        object-fit: cover;
      }

      .right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        .right-L {
          font-size: 12px;

          .top {
            color: var(--ex-font-color6);
          }

          .bottom {
            margin-top: 8px;
            color: var(--ex-passive-font-color);

            span {
              color: var(--ex-font-color6);
            }
          }
        }

        .right-R {
          text-align: right;

          .top {
            color: var(--ex-font-color6);
          }

          .bottom {
            margin-top: 8px;
            color: var(--ex-font-color27);
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
