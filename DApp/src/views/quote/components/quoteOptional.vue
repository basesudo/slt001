<!-- 行情——>自选 -->
<template>
  <div>
    <Filter
      :isOptional="isOptional && collectList?.length > 0"
      :list="collectList"
      @toSort="toSort"
    />
    <div v-if="collectList?.length > 0">
      <CollectItem
        v-for="(item, index) in filterKeyCoin(collectList, searchName, 2)"
        :key="index"
        :collectItem="item"
        @click="linkTo(item)"
      >
      </CollectItem>
    </div>
    <div v-else>
      <Nodata></Nodata>
      <div class="addOptional">
        <div class="addOptionalBtn" @click="$router.push('/addOptional')">
          +{{ _t18(`quote_addOwn`) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { filterKeyCoin } from '@/utils/filters'
import Filter from './common/filter.vue'
import CollectItem from './common/collectItem.vue'
import { getCollect } from '@/api/trade'
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'
const props = defineProps({
  searchName: {
    type: String
  }
})
const isOptional = ref(true)
// 自选列表
const collectList = ref()
const getCollectList = async () => {
  const res = await getCollect()
  if (res.code == 200) {
    collectList.value = res.data
  }
}
const userStore = useUserStore()
onMounted(() => {
  if (userStore.isSign) {
    getCollectList()
  }
})
const toSort = (v) => {
  collectList.value = v
}

import { useRouter } from 'vue-router'
const router = useRouter()
const linkTo=(item)=>{
  router.push(`/trade?symbol=${item.coin}`)
}
</script>

<style lang="scss" scoped>
.addOptional {
  padding: 0 15px 81px;

  .addOptionalBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--ex-div-bgColor1);
    border-radius: 3px;
    font-size: 16px;
    font-weight: normal;
    color: var(--ex-font-color);
  }
}
</style>
