<!-- 充值币种列表 -->
<template>
  <div class="content">
    <p>{{ _t18('coinList') }}</p>
    <div class="list">
      <div class="listCoin" v-for="(item, index) in props.data" :key="index" @click="toClick(item)">
        <div class="left">
          <svg-load :name="item.icon" class="coin"></svg-load>
          <span>{{ item.title }}</span>
        </div>
        <div class="right"><svg-load name="jiantou" class="jiantou"></svg-load></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const router = useRouter()
const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})
const flag = ref(true)
const toClick = (item) => {
  router.push(`/recharge-apply?type=${item.title}&coin=${item.icon}`)
}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
.content {
  padding: 30px 15px 0;
  p {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: left;
  }
  .list {
    .listCoin {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left,
      .right {
        display: flex;
        align-items: center;
        .coin {
          font-size: 20px;
          margin-right: 15px;
        }
        .jiantou {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
