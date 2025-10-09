<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar
      :currentName="_t18('sidebar_language')"
      :cuttentRight="cuttentRight"
      :border_bottom="true"
    ></HeaderBar>
    <!--内容-->
    <div class="content">
      <!-- 选择语言 -->
      <!-- <div>{{$t('sidebar_language_title')}}</div> -->
      <div>{{ _t18('sidebar_language') }}</div>
      <van-radio-group v-model="checked">
        <van-radio
          :name="index"
          shape="square"
          v-for="(item, index) in languageList"
          :key="index"
          label-position="left"
          :checked-color="'#17AC74'"
          @click="setLanguage(item)"
        >
          <image-load :filePath="item.imgUrl" alt="" width="20" class="nation" v-if="item.imgUrl" />
          <svg-load v-else :name="item.dictValue" class="nation"></svg-load>
          {{ item.remark }}
          <template #icon="props">
            <svg-load :name="props.checked ? `gou-yuyan` : `gou-yuyanno`"></svg-load>
          </template>
        </van-radio>
      </van-radio-group>
    </div>
  </div>
</template>
<script setup>
import { storageDict } from '@/config/dict'
import { useMainStore } from '@/store/index.js'
import { computed } from 'vue'
const mainStore = useMainStore()
const current = ref(localStorage.getItem(storageDict.LANGUAGE))
/**
 * 设置语言
 */
const setLanguage = (item) => {
  mainStore.setLanguage(item.dictValue)
  current.value = item.dictValue
}

// const checked = ref(5)
const checked = computed(() => {
  let temp = 0
  mainStore.languageList.forEach((item, index) => {
    if (item.dictValue == current.value) {
      temp = index
    }
  })
  return temp
})
// const languageList = reactive([
//   { i18n: 'zh', index: '1', name: '中文', icon: 'zhongguo' },
//   { i18n: 'ko', index: '2', name: '한국인', icon: 'hanguo' },
//   { i18n: 'ja', index: '3', name: '日本語', icon: 'riben' },
//   { i18n: 'en', index: '4', name: 'English', icon: 'meiguo' },
//   { i18n: 'vi', index: '5', name: 'Tiếng Việt', icon: 'yuenan' },
//   { i18n: 'th', index: '6', name: 'ไทย', icon: 'taiguo' }
// ])
const languageList = mainStore.languageList
const cuttentRight = { iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }] }
</script>
<style lang="scss" scoped>
* {
  color: var(--ex-default-font-color);
}
.content {
  padding: 30px 15px;
  text-align: left;
  & > div {
    font-size: 16px;
  }
  .van-radio {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 10px 0;
    :deep(.van-radio__label) {
      font-size: 14px;
      color: var(--ex-default-font-color);
    }
  }
  .nation {
    font-size: 24px;
    margin-right: 20px;
  }
}
</style>
