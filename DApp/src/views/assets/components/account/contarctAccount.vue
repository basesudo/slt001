<template>
  <div>
    <Amount
      :amount="showNum ? amountSum : _hide(amountSum)"
      @handleYanjin="handleYanjin"
      @handleShuaxin="handleShuaxin"
      :showicon="showNum ? 'yanjin-k' : 'yanjin-g'"
    ></Amount>
    <!-- 合约 -->
    <Detail :assetDetails="assetDetails" :showNum="showNum"></Detail>
  </div>
</template>

<script setup>
import { _hide } from '@/utils/public.js'
import Amount from './amount.vue'
import Detail from './amountDetail.vue'
const props = defineProps({
  assetDetails: {
    type: Object
  },
  amountSum: {
    type: String
  },
  showNum: {
    type: Boolean
  }
})
// 点击小眼睛
const emit = defineEmits(['handleYanjin','handleShuaxin'])
const handleYanjin = () => {
  emit('handleYanjin')
}
const handleShuaxin = () => {
  emit('handleShuaxin')
}
</script>

<style lang="scss" scoped></style>
