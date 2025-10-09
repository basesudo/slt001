<script setup>
import { showToast } from 'vant'
import { reactive } from 'vue'
import { storageDict } from '@/config/dict'
import { _back } from '@/utils/public'

/**
 * 表单
 */
const form = reactive({})
/**
 * 平台key 输入失焦
 */
const platformBlur = () => {
  if (form.platform && !form.domain) {
    form.domain = ''
  }
}
/**
 * 清除平台设置
 */
const clear = () => {
  localStorage.removeItem(storageDict.TEST_PLATFORM)
  showToast('操作成功')
}
/**
 * 提交表单
 */
const submit = () => {
  let msg = false
  if (!form.platform) {
    msg = '请输入 平台key'
  }
  // else if (!form.domain) {
  //   msg = '请输入 平台域名'
  // }
  else if (!form.password) {
    msg = '请输入 密码'
  } else if (form.password != '8888') {
    msg = '密码不正确'
  }
  if (msg) {
    showToast(msg)
  } else {
    delete form.password
    localStorage.setItem(storageDict.TEST_PLATFORM, JSON.stringify(form))
    showToast('操作成功')
    _back()
    setTimeout(() => {
      location.reload()
    }, 800)
  }
}
</script>
<template>
  <div class="platform">
    <div class="title">平台切换</div>
    <div class="form">
      <div class="tit">平台key</div>
      <input
        type="text"
        class="input"
        v-model.trim="form.platform"
        placeholder="请输入 平台key"
        @blur="platformBlur"
      />

      <div class="tit">平台域名</div>
      <input type="text" class="input" v-model.trim="form.domain" placeholder="请输入 平台域名" />

      <div class="tit">密码</div>
      <input type="password" class="input" v-model.trim="form.password" placeholder="请输入 密码" />

      <div class="btn" @click="submit">立即切换</div>
      <div class="btn clear" @click="clear">清除</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.platform {
  padding: 15px;
  .title {
    font-size: 24px;
    margin: 30px 0;
  }
  .form {
    .tit {
      font-size: 16px;
      margin-bottom: 15px;
    }
    .input {
      width: 100%;
      height: 50px;
      margin-bottom: 15px;
      padding: 0 10px;
      font-size: 16px;
      border: 1px solid var(--ex-input-border-color);
      &::placeholder {
        font-size: 16px;
      }
    }
    .btn {
      margin-top: 60px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      background-color: var(--ex-rfd-rise);
      &.clear {
        margin-top: 15px;
        background-color: var(--ex-rfd-fall);
      }
    }
  }
}
</style>
