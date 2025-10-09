<template>
  <!-- <HeaderBar :currentName="`添加自选`" :cuttentRight="$route.query.flag=='edit'?cuttentRight:{}" /> -->
  <HeaderBar :currentName=" _t18(`quote_addOwn`) " />
  <div class="search">
    <svg-load name="sousuo-h" class="searchImg"></svg-load>
    <div class="contain">
      <input
        type="text"
        v-model.trim="searchValue"
        class="inputSearch"
        :placeholder="_t18(`quote_search`)"
        @input="overBtn"
      />
      <!-- 完成 -->
      <div class="over" @click="overBtn">{{_t18(`quote_finish`)}}</div>
    </div>
  </div>
  <div class="currencyList">
    <div class="itemEvery" v-for="(item, index) in currentCoinList" :key="index" @click="linkTo(item)">
      <div class="item">
        <LeftItem :data="item"></LeftItem>
        <CurrentcyNumVue :data="item"></CurrentcyNumVue>
        <svg-load @click.stop="handelCollect(item)"
          :name="item.isCollect===1 ? 'tianjia18x16-x' : 'tianjia18x16-w'"
          class="rightImg"
        ></svg-load>
      </div>
    </div>
  </div>
  
  <van-overlay
      :show="show"
      z-index="100"
      :custom-style="{ background: 'rgba(0, 0, 0, .6)' }"
    >
      <div style="position: fixed; top: 30%; left: 50%; transform: translate(-50%, -50%)">
        <van-loading vertical color="#17AC74">{{ _t18('loading') }}...</van-loading>
      </div>
    </van-overlay>
</template>
<script setup>
import { ref } from 'vue'
import { showLoadingToast, closeToast, showToast,Loading  } from 'vant'
import { setCollect, removeCollect,getCollect } from '@/api/trade'
import HeaderBar from '@/components/HeaderBar/index.vue'
import LeftItem from '@/components/CurrencyList/left.vue'
import CurrentcyNumVue from '../components/optional/currentcyNum.vue'
import { filterKeyWord } from '@/utils/filters'
import { useTradeStore } from '@/store/trade'
import { _t18 } from '@/utils/public'
const show=ref(false)
const cuttentRight = { name: '保存' }
const tradeStore = useTradeStore()

const searchValue = ref('') // 搜索
/** 搜索 */
const currentCoinList = ref([])
const overBtn = () => {
  currentCoinList.value = filterKeyWord(tradeStore.secondContractCoinList, searchValue.value)
}
const collectList = ref()
onMounted(() => {
  currentCoinList.value = tradeStore.secondContractCoinList
  
})
/**跳转秒合约 */
import { useMainStore } from '@/store/index.js'
import { useRouter,useRoute } from 'vue-router'
const mainStroe = useMainStore()
mainStroe.setTradeStatus(Number(-1))
const $router = useRouter()
const $route = useRoute()
const emit = defineEmits(['linkTo'])
const linkTo = (item) => {
  $router.push(`/trade?symbol=${item.coin}`)
  emit('linkTo', item.coin, Number(0))
}
const handelCollect=(item)=>{
  show.value=true
  // isCollect    1  收藏   2 未收藏
  let params = { coin: item?.coin }
  if(item.isCollect===2){
    params['icon']=item?.logo
    setCollect(params).then((res) => {
      if (res.code == '200') {
        // showToast(res.msg)
        tradeStore.getCoinList()
        setTimeout(()=>{
          show.value=false
        },500)
      } else {
        show.value=false
        showToast(res.msg)
      }
    })
  }else{
    removeCollect(params).then((res) => {
      if (res.code == '200') {
        // showToast(res.msg)
        tradeStore.getCoinList() 
        setTimeout(()=>{
          show.value=false
        },500)
      } else {
        show.value=false
        showToast(res.msg)
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.currencyList {
  padding: 0 15px;
  .itemEvery {
    padding-bottom: 30px;
    .item {
      display: flex;
      align-items: center;
      .rightImg {
        margin-left: 10px;
        width: 16px;
        height: 16px;
      }
    }
  }
}
.search {
  margin: 20px 15px;
  height: 40px;
  background: var(--ex-default-background-color);
  border-radius: 25px;
  border: 1px solid var( --ex-border-color);
  display: flex;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  .searchImg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .contain {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--ex-default-font-color);
    .inputSearch {
      flex: 1;
    }
    input::-webkit-input-placeholder {
      color: var(--ex-font-color5) 
    }
    input::-moz-input-placeholder {
      color: var(--ex-font-color5) 
    }
    input::-ms-input-placeholder {
      color: var(--ex-font-color5) 
    }
    .over {
      margin-left: 5px;
      color: var(--ex-font-color9);
    }
  }
}
</style>
