<template>
  <van-action-sheet
    @click-overlay="handelClick"
    v-model:show="props.show"
    title=""
    style="max-width: var(--ex-max-width); left: 50%; translate: -50%; max-height: 60%"
  >
    <div class="top">
      <div class="title">{{ _t18('areacode') }}</div>
      <div class="right">
        <svg-load name="guanbi" class="guanbi" @click="handelClick"></svg-load>
      </div>
    </div>
    <van-search
      v-model="keywords"
      class="search"
      :placeholder="_t18('enter_search_keywords')"
      @update:model-value="onUpdate"
    />
    <div v-if="areaList.length" class="content">
      <div v-for="(item, index) in areaList" :key="index">
        <div v-if="item.list.length" class="item">
          <div class="title">{{ item.letter }}</div>
          <div
            v-for="(items, indexs) in item.list"
            :key="indexs"
            @click="selectCode(items.phoneCode)"
          >
            <p class="left">{{ current == 'zh' ? items.chineseName : items.englishName }}</p>
            <p class="right">+{{ items.phoneCode }}</p>
          </div>
        </div>
      </div>
    </div>
    <Nodata v-else></Nodata>
  </van-action-sheet>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { getAreaCode } from '@/api/user'
import { storageDict } from '@/config/dict'
import { ref } from 'vue'

const current = ref(localStorage.getItem(storageDict.LANGUAGE))
const keywords = ref('')

// 区号列表
let originAreaList = []
const areaList = ref([])
// 获取区号
const codeList = () => {
  getAreaCode().then((res) => {
    if (res.code == '200') {
      let arr = res.data.map((item) => {
        item.list = item.data
        return item
      })
      areaList.value = arr
      originAreaList = JSON.parse(JSON.stringify(arr))
    }
  })
}
codeList()
const props = defineProps({
  show: {
    type: Boolean
  }
})
const emit = defineEmits(['handelClick', 'handelSelect'])
const handelClick = () => {
  emit('handelClick')
}
const selectCode = (item) => {
  handelClick()
  emit('handelSelect', item)
}
const onUpdate = (val) => {
  areaList.value = originAreaList
    .filter((item) => {
      item.list = item.data.filter((item1) => {
        return (
          item1.englishName.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item1.chineseName.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item1.phoneCode.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          item1.countryCode.toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
      return item
    })
    .filter((item) => item.list.length)
}
</script>

<style lang="scss" scoped>
* {
  font-size: 18px;
  color: var(--ex-default-font-color);
  background: var(--ex-default-background-color);
}
.top {
  padding: 20px 0;
  text-align: center;
  position: relative;
  .right {
    position: absolute;
    top: 20px;
    right: 20px;
    .guanbi {
      font-size: 20px;
    }
  }
}
:deep(.van-search__content) {
  background: var(--ex-default-background-color);
  .van-field__control {
    color: var(--ex-default-font-color);
  }
}
.content {
  .item {
    border-top: 1px solid var(--ex-border-color6);
    padding: 15px 0;
    .title {
      font-size: 18px;
    }
    div {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
    }
    .left {
      font-size: 14px;
      color: var(--ex-font-color8);
    }
    .right {
      font-size: 14px;
    }
  }
}
</style>
