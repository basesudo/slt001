<template>
    <div class="userAmount">
      <p class="userInfo ff-num">{{ priceFormat(amount) }}</p>
      <!-- 可用余额 -->
      <span>{{_t18('swap_available')}}(<i>{{ coin }}</i>)</span>
    </div>
  </template>
  
  <script setup>
  import { _t18 } from '@/utils/public'
  import { priceFormat } from '@/utils/decimal.js'
  const props = defineProps({
    amount: {
      type: Number
    },
    coin: {
      type: String,
      default: 'USDT'
    }
  })
  </script>
  
  <style lang="scss" scoped>
  * {
    font-size: 14px;
    color: var(--ex-default-font-color);
  }
  .userAmount {
    padding: 50px 0;
    border-bottom: 1px solid var(--ex-border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin-bottom: 15px;
      font-size: 50px;
      font-weight: bold;
    }
    span,
    i {
      font-size: 16px;
      color: var(--ex-passive-font-color);
    }
  }
  </style>
  