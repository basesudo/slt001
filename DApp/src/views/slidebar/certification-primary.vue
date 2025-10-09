<!-- 初级认证 -->
<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import Success from './components/success.vue'
import { uploadKYC } from '@/api/user'
import { reactive } from 'vue'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const userStore = useUserStore()
userStore.getUserInfo()
// 用户信息
const { userInfo } = storeToRefs(userStore)
const formData = reactive({
  userName: '',
  number: ''
})
const cuttentRight = { iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }] }
// 是否初级认证
const primaryAuth = ref(userInfo.value.detail?.auditStatusPrimary)
// 审核状态 0未申请 1通过 3审核中 2拒绝
// 提交认证信息
const submit = () => {
  if (formData.userName == '') {
    // showToast('请填写姓名')
    _toast('advanced_please_name')
    return
  }
  if (formData.number == '') {
    // showToast('请填写身份证号')
    _toast('advanced_please_cardName')
    return
  }
  // realName 姓名 ,idCard 证件号码 ,flag 1 初级 2高级
  let params = `realName=${formData.userName}&idCard=${formData.number}&flag=1`
  uploadKYC(params).then((res) => {
    if (res.code == '200') {
      // showToast('提交成功，请等待...')
      _toast('advanced_please_wait')
      primaryAuth.value = '3'
      userStore.getUserInfo()
    } else {
      showToast(res.msg)
      primaryAuth.value = '2'
    }
  })
}
const reSubmit = () => {
  primaryAuth.value = '0'
}
</script>
<template>
  <!-- 导航条 -->
  <HeaderBar :currentName="_t18('sidebar_primary')" :cuttentRight="cuttentRight"></HeaderBar>
  <div class="content" v-if="primaryAuth == '0' || primaryAuth == null">
    <div class="tip advanced_txt">{{ _t18('advanced_txt', ['aams']) }}</div>
    <div v-if="['coinsexpto'].includes(_getConfig('_APP_ENV'))" class="tip_info">
      {{ _t18('basic_certification_info') }}
    </div>
    <div class="form">
      <div class="formInput">
        <div class="label">{{ _t18('advanced_name') }}：</div>
        <input :placeholder="_t18('login_please')" v-model="formData.userName" class="form-input" />
      </div>
      <div class="formInput">
        <div class="label">{{ _t18('advanced_license_number') }}：</div>
        <input :placeholder="_t18('login_please')" v-model="formData.number" class="form-input" />
      </div>
    </div>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="_t18('advanced_submit')" />
    </div>
  </div>
  <div class="success" v-if="primaryAuth == '3'">
    <Success :text="_t18('under_review')" :imgUrl="'defi/zhong.png'" :color="'#333'"></Success>
  </div>
  <div class="success" v-if="primaryAuth == '2'">
    <Success :text="_t18('Audit_failure')" :imgUrl="'defi/failed.png'" :color="'#333'">
      <template #btn>
        <div class="btnBox" @click="reSubmit">
          <ButtonBar :btnValue="_t18('Resubmit')" />
        </div>
      </template>
    </Success>
  </div>
  <div v-if="primaryAuth == '1'">
    <div class="fromContent">
      <div>{{ _t18('advanced_name') }}：{{ userInfo.detail?.realName }}</div>
      <div>{{ _t18('advanced_license_number') }}：{{ userInfo.detail?.idCard }}</div>
    </div>
    <Success
      :text="_t18('advanced_success')"
      :imgUrl="'defi/success.png'"
      :color="'#333'"
    ></Success>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;
  color: var(--ex-default-font-color);
  .tip {
    font-size: 12px;
    color: var(--ex-tip-font-color);
  }
  .tip_info {
    font-size: 12px;
    text-align: left;
  }
  .advanced_txt {
    margin-bottom: 20px;
    text-align: left;
  }
  .form {
    padding-top: 5px;
    .formInput {
      padding: 0 10px;
      display: flex;
      justify-content: flex-start;
      background: var(--ex-input-background-color);
      border-radius: 3px;
      border: 1px solid var(--ex-border-color1);
      align-items: center;
      margin: 20px 0;
      .label {
        width: 70px;
        font-size: 14px;
        color: var(--ex-input-label-color);
        text-align: left;
      }
      input {
        width: 100%;
        height: 46px;
        font-size: 14px;
        background-color: transparent;
        &::placeholder {
          color: var(--ex-input-font-color);
          font-size: 14px;
        }
      }
    }
  }
  .btnBox {
    width: 100%;
    margin-top: 50px;
  }
}
.fromContent {
  color: var(--ex-default-font-color);
  padding: 30px 15px;
  div {
    margin-bottom: 20px;
    padding: 16px 13px;
    background-color: var(--ex-div-bgColor20);
    border-radius: 3px;
    color: var(--ex-default-font-color);
  }
}
.success {
  color: var(--ex-default-font-color);
  margin-top: 100px;
}
</style>
