<template>
  <HeaderBar :currentName="_t18(`home_service`)" />
  <div class="onlineService" v-if="list.length > 0">
    <div class="item" v-for="(item, index) in list" :key="index" @click="linkTo(item.url)">
      <image-load :filePath="item.imgUrl" alt="" class="itemImg" />
      <div class="right"><svg-load name="jiantou" class="jiantou"></svg-load></div>
    </div>
  </div>
  <Nodata v-if="list.length === 0 && isShow"></Nodata>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import { getCustomerService } from '@/api/common/index'
import { _t18 } from '@/utils/public'
import { useMainStore } from '@/store/index.js'
const mainStroe = useMainStore()
const list = ref([])
const isShow = ref(false)
const linkTo = (link) => {
  location.href = link
}
onMounted(async () => {
  list.value = mainStroe.getCustomerServiceList || []
  list.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
})
</script>
<style lang="scss" scoped>
.onlineService {
  padding: 5px 15px 0;
  .item {
    display: flex;
    justify-content: space-between;
    .itemImg {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin: 10px 0;
      object-fit: cover;
    }
    .right {
      display: flex;
      align-items: center;
      .jiantou {
        font-size: 10px;
      }
    }
  }
}
</style>
