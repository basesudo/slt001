<template>
  <div class="box">
    <div class="menu">
      <image-load
        :filePath="currentLanguage.imgUrl"
        class="lang img"
        @click="$router.push('/language-selection')"
      />
      <svg-load name="guanbi" class="guanbi" @click="$router.push('/')"></svg-load>
    </div>
    <div class="top">
      <!-- <p class="left" v-if="props.type != 2">Hi</p> -->
      <!-- 忘记密码 -->
      <p class="left" v-if="props.type == 2">{{ _t18('forget_pwd', ['bitmake']) }}</p>
    </div>
    <div class="bottom">
      <!-- 欢迎登录 -->
      <p v-if="props.type == 0">{{ _t18('login_title') }} {{ _getConfig('_APP_META_TITLE') }}</p>
      <p v-if="props.type == 1">{{ _t18('register_title') }} {{ _getConfig('_APP_META_TITLE') }}</p>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index'
import { computed } from 'vue'
const mainStore = useMainStore()
/**
 * 当前语言实例
 */
const currentLanguage = computed(() =>
  mainStore.languageList.find((elem) => elem.dictValue == mainStore.language)
)
const props = defineProps({
  type: {
    type: Number
  }
})
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.box {
  padding: 30px 15px 0px;
  .menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .guanbi {
      font-size: 24px;
    }
    .lang {
      width: 24px;
      height: 24px;
    }
  }
  .top {
    padding-top: 30px;
    .right {
      display: flex;
    }
  }
  p {
    font-size: 24px;
    line-height: 1.5;
  }
}
</style>
