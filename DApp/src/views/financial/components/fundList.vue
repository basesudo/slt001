<template>
  <div class="funList" v-if="listArray.length > 0 && !isShow">
    <ItemFund v-for="item in listArray" :key="item.id" :itemObj="item"></ItemFund>
  </div>
  <Nodata v-if="listArray.length === 0 && isShow"></Nodata>
</template>
<script setup>
import ItemFund from './itemFund.vue'
import { onMounted, ref } from 'vue'
import { getFinancial } from '@/api/financial/index'
const listArray = ref([])
const isShow = ref(false)
const getInit = async () => {
  try {
    let data = {
      classify: ''
    }
    const res = await getFinancial(data)
    if (res.code === 200) {
      listArray.value = res.rows
      listArray.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
    }
  } catch (error) {
    console.log(45)
  }
}
onMounted(() => {
  getInit()
})
</script>
<style lang="scss" scoped>
.funList {
  padding: 20px 15px 66px;
}
</style>
