<template>
  <div class="bg">
    <HeaderBar :currentName="_t18('bind_address')" :border_bottom="true"></HeaderBar>
    <div class="form">
      <div class="form-item">
        <div class="label">
          <!-- 请选择链 -->
          {{ _t18('please_select_a_chain') }}
        </div>
        <div class="input" @click="openCoinSheet">
          <img :src="iconSrcImg" class="coin" />
          <div class="tit">{{ form.type }}</div>
          <div class="tip">
            <van-icon name="arrow-down" />
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="label">
          <!-- 请输入钱包地址 -->
          {{ _t18('withdrawal_Please_enter_address') }}
        </div>
        <div class="input">
          <van-field
            class="input-field"
            type="textarea"
            v-model="form.address"
            :placeholder="_t18('exchange.input')"
          />
          <div class="tip" @click="getPaste">
            <!-- 粘贴 -->
            {{ _t18('pasta') }}
          </div>
        </div>
      </div>
      <van-button block class="submit" :loading="loading" @click="submit">{{
        _t18('confirm')
      }}</van-button>
    </div>
    <van-action-sheet
      v-if="coinList.length"
      v-model:show="coinSheet"
      :actions="coinList"
      @select="onSelect"
      :cancel-text="_t18('cancel')"
    />
  </div>
</template>

<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import { updateUserAddress } from '@/api/account'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from '@/hook/useToast'
import ERCIMG from '/resource/images/defi/ERC.png'
import TRCIMG from '/resource/images/defi/TRC.png'
import { _t18 } from '@/utils/public'

const { _toast } = useToast()
const router = useRouter()
const coinSheet = ref(false)
const currentIndex = ref(0)
const iconSrcImg = computed(() => (currentIndex.value == 1 ? TRCIMG : ERCIMG))
/**
 * 绑定地址
 */
const form = ref({
  type: 'ETH',
  address: ''
})
const loading = ref(false)
const coinList = ref([
  {
    name: 'ERC'
  },
  {
    name: 'TRC'
  }
])

/**
 * 当前选中的
 */
const onSelect = (item, index) => {
  currentIndex.value = index
  form.value.type = item.name
  coinSheet.value = false
}
const openCoinSheet = () => {
  coinSheet.value = true
}
/**
 * 获取粘贴板内容
 */
const getPaste = async () => {
  form.value.address = await navigator.clipboard.readText()
}
/**
 * 提交表单
 */
const submit = () => {
  // 绑定地址
  if (!form.value.address) {
    // 钱包地址不能为空
    return _toast(`wallet_address_cannot_be_empty`)
  }
  loading.value = true
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)
  updateUserAddress({
    type: form.value.type,
    address: form.value.address.toLocaleLowerCase(),
    userId: userInfo.value.user?.userId
  })
    .then(async (res) => {
      // 设置成功
      _toast(`set_success`)
      form.value.address = ''
      // userStore.setToken(res.data)
      setTimeout(() => {
        router.back()
        userStore.getUserInfo()
      }, 1500)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-default-font-color);
  font-size: 14px;
}
:deep(.nav--bar) {
  background: var(--ex-login-tab-background-color) !important;
  .nav--bar--text {
    position: absolute;
    left: 50px;
    top: 0;
  }
}

.bg {
  background: var(--ex-login-tab-background-color) !important;
}
.form {
  min-height: 100vh;

  background: var(--ex-login-tab-background-color) !important;
  border-radius: 15px 15px 0px 0px;
  overflow: hidden;
  padding: 0 15px 15px;
  .img {
    margin-left: 10px;
    width: 25px;
    min-width: 25px;

    height: 25px;
    margin-right: 17px;
  }
  .tit {
    width: 100%;
    font-size: 16px;
    font-family: ArialMT;
    line-height: 18px;
  }
  .form-item {
    .label {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      margin: 20px auto 10px;
      padding-left: 10px;
    }
    .input {
      position: relative;
      background: var(--ex-login-tab-background-color) !important;
      border-radius: 4px;
      height: 40px;
      display: flex;
      align-items: center;
      padding-right: 10px;
      .coin {
        width: 25px;
        height: 25px;
        margin: 0 10px;
      }
      .input-field {
        width: 100%;
        line-height: 40px;

        height: 40px;
        padding: 0;
        background: transparent;
        :deep(.van-field__control) {
          padding-left: 10px;
        }
      }
      .tip {
        min-width: 40px;
        text-align: right;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: var(--primary-color);
        line-height: 40px;
      }
    }
  }
  .submit {
    margin: 50px auto 30px;
    background: var(--ex-div-bgColor1);
    color: var(--ex-font-color);
    border: none;
  }
}
</style>
