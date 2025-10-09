<!--
 * @Autor: Aka
 * @Date: 2023-06-28 13:42:58
 * @Description: 
 * @LastEditTime: 2023-07-06 14:44:57
-->
<template>
  <div class="columnFlex">
    <!-- 编辑自选 -->
    <HeaderBar :currentName="_t18('quote_edit')" :cuttentRight="cuttentRight" @linkTo="linkTo" />
    <div class="currencyList">
      <van-checkbox-group v-model="checked" shape="square" @change="change" ref="checkboxGroup">
        <div class="itemEvery" v-for="(item, index) in currentCoinList" :key="index">
          <div class="item">
            <EditLeft :data="item"></EditLeft>
            <CurrentcyNumVue :data="item"></CurrentcyNumVue>
            <!-- <van-checkbox :name="`{id:${item.id},coin:${item.coin},icon:${item.logo}}`"> -->
            <van-checkbox :name="item.coin">
              <template #icon="props">
                <svg-load class="rightImg" :name="props.checked ? 'gou-x' : 'gou-w'" />
              </template>
            </van-checkbox>
          </div>
        </div>
      </van-checkbox-group>
    </div>
    <div class="placeholder"></div>
    <div class="editCon">
      <div class="left" @click="delList">
        <svg-load :name="showDel ? 'sanchu16x18-x' : 'sanchu16x18-w'" class="chooseImg"></svg-load>
        <!-- 删除 -->
        <div :style="{ color: showDel ? '#17ac74' : '#bcbcbc', marginLeft: '10px' }">{{ _t18('quote_del') }}</div>
      </div>
      <div class="right">
        <svg-load
          :name="allFlag ? 'gou-x' : 'gou-w'"
          class="chooseImg"
          @click="checkAll"
        ></svg-load>
        <!-- <svg-load :name="allFlag?'gou-x':'gou-w'" class="chooseImg" @click="toggleAll"></svg-load> -->
        <!-- 全选 -->
        <div>{{ _t18('quote_all') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getCollect, setCollectAdds, removeCollectRemoves } from '@/api/trade'
import HeaderBar from '@/components/HeaderBar/index.vue'
import EditLeft from '@/components/CurrencyList/editLeft.vue'
import CurrentcyNumVue from '../components/optional/currentcyNum.vue'
const cuttentRight = {
  name: _t18('quote_add')//添加
}
// 删除按钮
const showDel = ref(false)
import { useTradeStore } from '@/store/trade'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
import { useMainStore } from '@/store/index.js'
const mainStroe = useMainStore()
mainStroe.setTradeStatus(Number(-1))
const tradeStore = useTradeStore()
const searchValue = ref('') // 搜索
const checked = ref([])
const checkboxGroup = ref(null)
const allFlag = ref(false)
const toggleAll = () => {
  // allFlag.value=!allFlag.value
  checkboxGroup.value.toggleAll()
}
const checkAll = () => {
  allFlag.value = !allFlag.value
  checkboxGroup.value.toggleAll(allFlag.value)
}

const currentCoinList = ref([])
// header 回调
const linkTo = () => {
  setCollectAdds(addList.value).then((res) => {
    if (res.code == '200') {
      _toast('quote_addSuccess')
      getCollectList()
      tradeStore.getCoinList()
    } else {
      showToast(res.msg)
      getCollectList()
    }
  })
}
const delList = () => {
  if (showDel.value) {
    removeCollectRemoves(ids.value).then((res) => {
      if (res.code == '200') {
        _toast('quote_addSuccess')
        getCollectList()
        tradeStore.getCoinList()
      } else {
        showToast(res.msg)
        getCollectList()
      }
    })
  }
}
const handelCollect = () => {
  console.log(444)
}
// 自选列表
const collectList = ref()
const ids = ref()
const getCollectList = async () => {
  const res = await getCollect()
  if (res.code == 200) {
    collectList.value = res.data
    let temp = []

    currentCoinList.value?.forEach((item, index) => {
      collectList.value?.forEach((its, ids) => {
        if (item.coin === its.coin) {
          temp.push(item.coin)
        }
      })
    })
    checked.value = temp
  }
}
onMounted(() => {
  getCollectList()
  currentCoinList.value = tradeStore.secondContractCoinList
})
const change = (e) => {
  console.log(e.length)
  showDel.value = e.length > 0 ? true : false
  let arr = Object.values(e)
  let resultAdd = []
  let resultDel = ''
  arr.forEach((item, index) => {
    currentCoinList.value?.forEach((itm, idx) => {
      if (item === itm.coin) {
        let obj = {}
        obj.coin = itm.coin
        obj.icon = itm.logo
        resultAdd.push(obj)
      }
    })
  })
  addList.value = resultAdd
  let str = ''
  arr.forEach((item, index) => {
    collectList.value?.forEach((itm, idx) => {
      if (item === itm.coin) {
        str = str + itm.id + ','
      }
    })
    ids.value = str
  })
}
const addList = ref([])
</script>
<style lang="scss" scoped>
.currencyList {
  flex: 1;
  padding: 20px 15px 0;
  .itemEvery {
    padding-bottom: 30px;
    .item {
      display: flex;
      align-items: center;
      .van-checkbox {
        padding: 2px 0;
      }
      .rightImg {
        margin-left: 10px;
        width: 18px;
        height: 18px;
      }
    }
  }
}
.search {
  margin: 20px 15px;
  height: 50px;
  background: var(--ex-default-background-color);
  border-radius: 25px;
  border: 1px solid var(--ex-border-color);
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
    color: var(--ex-font-color6);
    .inputSearch {
      flex: 1;
    }
    input::-webkit-input-placeholder {
      color: var(--ex-font-color5);
    }
    input::-moz-input-placeholder {
      color: var(--ex-font-color5);
    }
    input::-ms-input-placeholder {
      color: var(--ex-font-color5);
    }
    .over {
      margin-left: 5px;
      color: var(--ex-font-color9);
    }
  }
}
.placeholder {
  height: 65px;
}
.editCon {
  position: fixed;
  width: 100%;
  background-color: var(--ex-default-background-color);
  bottom: 0;
  z-index: 9;
  border-top: 1px solid var(--ex-border-color);
  height: 64px;
  display: flex;
  padding: 0 15px;
  align-items: center;
  font-size: 14px;
  justify-content: space-between;
  .left {
    display: flex;
    align-items: center;
    color: var(--ex-font-color9);
    .delectImg {
      width: 16px;
      height: 18px;
      margin-right: 10px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    color: var(--ex-default-font-color);
    .chooseImg {
      width: 18px;
      height: 18px;
      margin-right: 12px;
    }
  }
}
</style>
