<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar
      :currentName="`绑定银行卡`"
      :cuttentRight="cuttentRight"
      :border_bottom="true"
    ></HeaderBar>
    <!--内容-->
    <div class="content">
      <BankItem :bankList="bankList"></BankItem>
    </div>
  </div>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import BankItem from './components/bank-item.vue'
const bankList = reactive([
  // {
  //   bankAddress: '美国花旗银行',
  //   bankBranch: '华盛顿支行',
  //   bankName: '储蓄卡',
  //   cardNumber: '78910',
  //   id: 6,
  //   userName: '张三'
  // },
  // {
  //   bankAddress: '美国花旗银行',
  //   bankBranch: '华盛顿支行',
  //   bankName: '储蓄卡',
  //   cardNumber: '123456',
  //   id: 8,
  //   userName: '李四'
  // }
])
const cuttentRight = { iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }] }
</script>
<style lang="scss" scoped>
* {
  font-size: 16px;
  color: var(--ex-default-font-color);
}
.header {
  display: flex;
  .title {
    margin-left: 10px;
  }
}
.kefu {
  font-size: 24px !important;
}
</style>
