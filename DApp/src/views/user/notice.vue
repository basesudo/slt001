<template>
  <div>
    <HeaderBar :currentName="currentName" />
    <div class="itemDetailObj" v-html="currentHtml"></div>
    <Nodata v-if="!currentHtml"></Nodata>
  </div>
</template>

<script setup>
import { publiceNotice } from '@/api/common/index'
import { _t18 } from '@/utils/public'
import { rulesList } from '@/api/common/index'
import { onMounted } from 'vue'
const currentHtml = ref(null)
const currentName =ref(_t18('activity'))
const getList = async (type) => {
  try {
    const res = await publiceNotice('REGISTER_WELFARE','REGISTER_WELFARE_NOTICE')
    if (res.code === 200) {
      currentHtml.value = res.data[0].noticeContent
      currentName.value = res.data[0].noticeTitle
    }
  } catch (error) {}
}
onMounted(()=>{
    getList()
})
</script>

<style lang="scss" scoped></style>
