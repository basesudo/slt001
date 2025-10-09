<script setup>
import Copy from '@/components/common/Copy/index.vue'

const copyData = ref(location.origin)
</script>
<template>
  <div class="content">
    <div class="box">
      <div class="imgBox">
        <image-load filePath="nowallet.png" class="nowallet" name="nowallet"></image-load>
      </div>
      <div class="bottom-box">
        <div class="tip">{{ _t18('Kind_tips') }}</div>
        <div class="wallet">{{ _t18('Please_access_wallet') }}</div>
        <div class="vistor">{{ _t18('currently_application') }}</div>
        <!-- <div class="btn">{{ _t18('copy_Link') }}</div> -->
        <Copy :data="copyData" :contentFix="'start'" :fontSize="'12px'" :noFlag="false">
          <template #copyMsg>
            <!-- 邀请码 -->
            <div class="btn">{{ _t18('copy_Link') }}</div>
          </template>
        </Copy>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  background: var(--bgColor);

  .box {
    margin: 150px 0;
    background: var(--bgColor);
    .imgBox {
      .nowallet {
        width: 100%;
        height: auto;
        object-fit: cover;
      }
    }
    .bottom-box {
      width: 262px;
      margin: 20px auto;
      text-align: center;
      .tip {
        font-size: 18px;
        font-weight: 800;
        color: var(--ex-font-color24);
      }

      .wallet {
        margin: 30px 0 15px;
        font-size: 15px;
        color: var(--ex-font-color25);
      }

      .vistor {
        margin: 20px 0 15px;
        font-size: 12px;
        color: var(--ex-font-color26);
        line-height: 1.2;
      }
      .btn {
        width: 145px;
        height: 42px;
        padding: 0 15px;
        background: var(--ex-div-bgColor14);
        border-radius: 21px;
        text-align: center;
        line-height: 42px;
        margin: 26px auto;
        font-size: 15px;
        color: var(--ex-font-color);
      }
    }
  }
}
</style>
