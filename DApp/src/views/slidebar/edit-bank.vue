<!-- 编辑银行卡 -->
<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar
        :currentName="_t18('Bank_edit')"
        :cuttentRight="cuttentRight"
        :border_bottom="true"
        @del="del"
    ></HeaderBar>
    <!--内容-->
    <div class="content">
      <div class="form">
        <div class="formInput">
          <p class="label">{{ _t18('advanced_name') }}</p>
          <!-- <input
            :placeholder="_t18('login_please')"
            v-model="formData.userName"
            class="form-input"
          /> -->
          <input
              :placeholder="_t18('login_please')"
              v-model="bindUserName"
              class="form-input"
          />
        </div>
        <div class="formInput">
          <p
              class="label"
              v-if="['trustwallet', 'coinmarketcap', 'kabit', 'etfinex', 'ebc'].includes(_getConfig('_APP_ENV'))"
          >
            {{ _t18('bank_account') }}
          </p>
          <p class="label" v-else>{{ _t18('Bank_card_number') }}</p>
          <input
              :placeholder="_t18('login_please')"
              v-model="formData.cardNumber"
              class="form-input"
          />
        </div>
        <div class="formInput">
          <p
              class="label"
              v-if="['trustwallet', 'coinmarketcap', 'kabit', 'etfinex', 'ebc'].includes(_getConfig('_APP_ENV'))"
          >
            {{ _t18('bank_name') }}
          </p>
          <p class="label" v-else>
            {{ _t18('Bank_own') }}
          </p>
          <input
              :placeholder="_t18('login_please')"
              v-model="formData.bankName"
              class="form-input"
          />
        </div>
        <div class="formInput" v-if="formData.bankBranch">
          <p
              class="label"
              v-if="['trustwallet', 'coinmarketcap', 'kabit', 'etfinex', 'ebc'].includes(_getConfig('_APP_ENV'))"
          >
            {{ _t18('branch_namee') }}
          </p>
          <p class="label" v-else>{{ _t18('branch_name') }}</p>
          <input
              :placeholder="_t18('login_please')"
              v-model="formData.bankBranch"
              class="form-input"
          />
        </div>
        <!-- HFM2 币种选择-->
        <div class="formInput" v-if="['HFM2','dev'].includes(_getConfig('_APP_ENV'))">
          <p class="label">
            {{ _t18('recharge_coin') }}
          </p>
          <van-field
              class="form-input"
              is-link
              readonly
              v-model="formData.coin"
              :placeholder="_t18('recharge_coin')"
              @click="showCoinPicker = true"
          />
          <van-action-sheet v-model:show="showCoinPicker" :actions="bankCoinList" @select="onBankCoinConfirm"/>
        </div>

      </div>
      <div class="btnBox" @click="submit">
        <ButtonBar :btnValue="_t18('Bank_save')"/>
      </div>
      <van-dialog v-model:show="show" title="" show-cancel-button></van-dialog>
    </div>
  </div>
</template>
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import {showConfirmDialog, showToast} from 'vant'
import {reactive, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {delBindCard, updateBindCard} from '@/api/account'
import {_toView, _t18} from '@/utils/public'
import {useToast} from '@/hook/useToast'
import {useUserStore} from '@/store/user/index'
import {dict} from '@/api/common/index.js'
import {storeToRefs} from 'pinia'

const userStore = useUserStore()
// userStore.getUserInfo()
// 用户信息
const {userInfo} = storeToRefs(userStore)
const {_toast} = useToast()
const Route = useRoute()
const Router = useRouter()
// const formData = reactive({
//   bankAddress: '美国花旗银行',
//   bankBranch: '华盛顿支行',
//   bankName: '储蓄卡',
//   cardNumber: '78910',
//   id: 6,
//   userName: '张三'
// })
const formData = reactive(JSON.parse(decodeURI(Route.query.data)))
const bindUserName = ref(formData.userName || userInfo.value.user?.loginName)
const cuttentRight = {iconRight: [{iconName: 'sanchu24x24', clickTo: 'del'}]}
const del = () => {
  showConfirmDialog({
    message: _t18('Bank_delete')
  })
      .then(() => {
        delBindCard(formData.id).then((res) => {
          if (res.code == '200') {
            // showToast('删除成功！')
            _toast('Bank_delete_success')
            setTimeout(() => {
              Router.push('/bind-card')
            }, 500)
          } else {
            showToast(msg)
          }
        })
      })
      .catch(() => {
      })
}


// 币种列表
const bankCoinList = ref([])
const showCoinPicker = ref(false)
const getBankCoinList = () => {
  dict('t_bank_coin').then((res) => {
    if (res.code == '200' && res.data.length) {
      bankCoinList.value = res.data.map((item) => {
        return {...item, name: item.dictValue.toUpperCase(),}
      })
    }
  })
}
//币种选择
const onBankCoinConfirm = (item) => {
  formData.coin = item.name
  showCoinPicker.value = false;
}

onMounted(() => {
  getBankCoinList()
})
const submit = () => {
  console.log(formData)
  updateBindCard(formData).then((res) => {
    if (res.code == '200') {
      // showToast('修改成功！')
      _toast('Bank_update_success')
      setTimeout(() => {
        Router.push('/bind-card')
      }, 500)
    } else {
      showToast(msg)
    }
  })
}
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

.content {
  margin-top: 10px;
  padding: 0 15px;

  .tip {
    font-size: 12px;
    color: var(--ex-font-color3);
    margin-bottom: 30px;
  }

  .form {
    padding-top: 5px;

    .formInput {
      margin-top: 20px;

      .label {
        color: var(--ex-default-font-color);
        font-size: 14px;
        margin: 0 0 10px;

        .scl {
          color: var(--ex-font-color11);
          padding-left: 5px;
        }

        .required {
          color: var(--ex-default-font-color);
          padding-left: 2px;
        }
      }

      input {
        width: 100%;
        height: 46px;
        background: var(--ex-default-background-color);
        border-radius: 3px;
        border: 1px solid var(--ex-border-color1);
        padding: 0 15px;
        font-size: 14px;

        &::placeholder {
          color: var(--ex-font-color5);
          font-size: 14px;
        }
      }

      :deep(.van-cell) {
        border: 1px solid var(--ex-bindcard-input-border-color);

        &::placeholder {
          color: var(--ex-bindcard-input-font-color);
          font-size: 14px;
        }
      }
    }
  }

  // .btn {
  //   font-size: 14px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   height: 50px;
  //  background: var(--ex-div-bgColor1)
  //   border-radius: 3px;
  //   color: var(--ex-font-color);
  //   margin: 50px 0;
  // }
  .btnBox {
    margin-top: 50px;
  }
}
</style>
