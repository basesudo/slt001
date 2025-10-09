<template>
  <div class="bankItem">
    <ul class="bank-content">
      <li v-for="item in props.bankList" :key="item.id" @click="change(item)">
        <div class="top-content">
          <p class="bank-type">{{ item.bankName }}<span class="scl" v-if="item.coin">（{{ item.coin }}）</span></p>
          <div class="normal" @click="change(item)">
            <svg-load name="bianji" class="bianji"></svg-load>
          </div>
        </div>
        <p class="name">{{ item.userName }}</p>
        <p class="bankNumber">{{ item.cardNumber }}</p>
        <p v-if="item.bankAddress" class="bank">{{ item.bankAddress }}</p>
        <p v-if="item.bankBranch" class="bank">{{ item.bankBranch }}</p>
      </li>
    </ul>
  </div>
</template>
<script setup>
import {useRouter} from 'vue-router'
import {_t18} from "@/utils/public";

const router = useRouter()

const props = defineProps({
  bankList: {
    type: Array,
    default: []
  }
})

const change = (item) => {
  router.push({
    path: '/edit-bank',
    query: {data: encodeURI(JSON.stringify(item))}
  })
}
</script>
<style lang="scss" scoped>
.bank-content {
  margin-top: 13px;

  li {
    display: flex;
    flex-direction: column;
    padding: 0 15px 20px 28px;
    border-bottom: 1px solid var(--ex-border-color);
    margin-top: 20px;

    &:nth-child(1) {
      margin-top: 7px;
    }

    .top-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 15px;
      align-items: center;

      .bank-type {
        font-size: 16px;
        font-weight: bold;
        color: var(--ex-default-font-color);
        position: relative;

        .scl {
          color: var(--ex-font-color8);
          padding-left: 5px;
          font-size: 14px;
        }

        &::before {
          content: '';
          width: 3px;
          height: 100%;
          position: absolute;
          left: -10px;
          background-color: var(--ex-div-bgColor1);
          top: 0;
        }
      }
    }

    .name {
      color: var(--ex-default-font-color);
      font-size: 14px;
      padding-top: 10px;
    }

    .bankNumber {
      font-size: 20px;
      font-weight: bold;
      color: var(--ex-default-font-color);
      padding-top: 10px;
    }

    .bank {
      margin-top: 10px;
      font-size: 14px;
      color: var(--ex-passive-font-color);
    }
  }

  .bianji {
    font-size: 14px;
  }
}
</style>
