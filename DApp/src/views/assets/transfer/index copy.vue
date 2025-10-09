<!-- 兑换 -->
<template>
  <HeaderBar :currentName="`划转`"></HeaderBar>

  <div class="content_box">
    <p class="title fw-bold">划转</p>
    <div class="cardOne">
      <div class="left">
        <div class="left_top">
          从
          <p>{{ fromTxt }}</p>
        </div>
        <div class="left_bottom">
          到
          <p>{{ toTxt }}</p>
        </div>
      </div>
      <div class="right" @click="jiaohuanbtn">
        <svg-load name="huazhuanbtn" class="huazhuanbtn"></svg-load>
      </div>
    </div>
    <div class="cardOne">
      <div class="left">
        <div class="left_top">
          从
          <van-dropdown-menu>
            <van-dropdown-item v-model="value1" :options="option1" />
          </van-dropdown-menu>
        </div>
        <div class="left_bottom">
          到
          <van-dropdown-menu>
            <van-dropdown-item v-model="value2" :options="option2" />
          </van-dropdown-menu>
        </div>
      </div>
      <div class="right" @click="jiaohuanbtn2">
        <svg-load name="huazhuanbtn" class="huazhuanbtn"></svg-load>
      </div>
    </div>
    <div class="cardTwo">
      <div class="top">划转金额</div>
      <div class="bottom">
        <input type="text" placeholder="最少1USDT" />
        <p>USDT</p>
      </div>
    </div>
    <div class="keyong">可用余额：<span class="fw-num">0.00000000 USDT</span></div>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="`确认划转`" :btnColor="'#138A5D'" />
    </div>
  </div>
</template>

<script setup>
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { dict } from '@/api/common/index'
import { onMounted } from 'vue'
const flag = ref(false)
const flag2 = ref(false)
const tempList = ref([])
const typeList = async () => {
  let res = await dict('user_asset_type')
  if (res.code == '200') {
    let templ = res.data.filter((item) => {
      return item.status == '0'
    })
    tempList.value = templ
  }
}
const value1 = ref(0)
const value2 = ref(0)
// const option1=computed(()=>{
//     let arr=[]
//     tempList.value.forEach((item,index)=>{
//         let obj={}
//         obj['text']=item.dictLabel
//         obj['value']=index
//         arr.push(obj)
//     })
//     return arr
// })
const option1 = computed({
  get() {
    let arr = []
    tempList.value.forEach((item, index) => {
      let obj = {}
      obj['text'] = item.dictLabel
      obj['value'] = index
      arr.push(obj)
    })
    return arr
  },
  set(value) {
    value = flag2.value
  }
})
const option2 = computed(() => {
  let arr = []
  let temp = []
  temp = tempList.value.filter((item, index) => {
    return index != value1.value
  })
  temp.forEach((item, index) => {
    let obj = {}
    obj['text'] = item.dictLabel
    obj['value'] = index
    arr.push(obj)
  })
  return arr
})
onMounted(() => {
  typeList()
})
const jiaohuan = ref({ from: '平台资产', to: '理财账户' })
const list = ['平台资产', '理财账户', '合约账户']
const fromTxt = ref('')
const toTxt = ref('')
const jiaohuanbtn = () => {
  flag.value = !flag.value
}
const jiaohuanbtn2 = () => {
  flag2.value = !flag2.value
}
watch(
  flag2,
  (newValue) => {
    let temp = value1.value
    value1.value = value2.value
    value2.value = temp
  },
  { immediate: true }
)
watch(
  flag,
  (newValue) => {
    fromTxt.value = newValue ? jiaohuan.value.from : jiaohuan.value.to
    toTxt.value = !newValue ? jiaohuan.value.from : jiaohuan.value.to
  },
  { immediate: true }
)
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
        padding: 15px 0;
        display: flex;
        color: var(--ex-font-color13);
        p {
          margin-left: 20px;
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
      border-bottom: 1px solid #c7c7c7;
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
}
:deep(.van-dropdown-menu__bar) {
  background-color: transparent;
  box-shadow: none;
  height: auto;
}
:deep(.van-dropdown-menu__title) {
  color: var(--ex-default-font-color);
  font-size: 14px;
  padding-left: 20px;
}
</style>
