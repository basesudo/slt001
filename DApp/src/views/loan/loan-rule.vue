<!-- 质押挖矿 -->
<script setup>
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import { rulesList } from '@/api/common/index'
const cuttentRight = { iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }] }
const currentHtml = ref(null)
onMounted(async () => {
  try {
    const res = await rulesList('LOANS_RULE')
    if (res.code === 200) {
      currentHtml.value = res.data[0].content
    }
  } catch (error) {}
})
</script>
<template>
  <HeaderBar :currentName="_t18('loan_rule')" :cuttentRight="cuttentRight"></HeaderBar>
  <div class="itemDetailObj" v-html="currentHtml"></div>
  <Nodata v-if="!currentHtml"></Nodata>
</template>
<style lang="scss" scoped>
.itemDetailObj {
  font-size: 12px;
  padding: 10px 15px;
  color: var(--ex-default-font-color);
  line-height: 24px;
  word-wrap: break-word;
}
.itemDetailObj img {
  width: 100%;
}
</style>
