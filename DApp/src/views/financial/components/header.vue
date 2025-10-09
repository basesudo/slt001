<template>
  <div class="header">
    <div class="bgImg" v-if="finaImg">
      <image-load :filePath="finaImg" class="img" />
    </div>
    <div class="navigationList">
      <div
        class="item"
        v-for="item in listNav"
        :key="item.icon"
        @click="$router.push(item.clickName)"
      >
        <svg-load :name="item.icon" class="itemImg"></svg-load>
        <div class="itemName">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { _t18 } from '@/utils/public'
import { publiceNotice } from '@/api/common/index'
// 增值收益 会员专区 普通产品 我的投资
const listNav = computed(() => {
  return [
    {
      icon: 'zhenzhi',
      name: _t18(`value_added _income`),
      clickName: '/addIncome'
    },
    {
      icon: 'huiyuan',
      name: _t18(`members_only`),
      clickName: '/membersOnly'
    },
    {
      icon: 'putong',
      name: _t18(`normal_product`),
      clickName: '/generalMerchandise'
    },
    {
      icon: 'touzhi',
      name: _t18(`my_invest`),
      clickName: '/myInvestment'
    }
  ]
})
const finaImg = ref('')
onMounted(async () => {
  try {
    const res = await publiceNotice('ACTIVITY_NOTICE', 'FINANCE_ACTIVITY ')
    if (res.code === 200) {
      finaImg.value = res.data[0].imgUrl
    }
  } catch (error) {}
})
</script>
<style lang="scss" scoped>
.header {
  border-top: 1px solid var(--ex-border-color);
  border-bottom: 1px solid var(--ex-border-color);
  padding: 20px 0;
  .bgImg {
    margin: 0 15px;
    height: 173px;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .navigationList {
    padding: 19px 15px 0;
    display: flex;
    justify-content: space-between;
    .item {
      flex: 1;
      text-align: center;
      align-items: center;
      font-size: 12px;
      color: var(--ex-default-font-color);
      justify-content: center;
      padding: 0 5px;
      .itemImg {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
      .itemName {
        // width: 52px;
        text-align: center;
        word-wrap: break-word;
      }
    }
  }
}
</style>
