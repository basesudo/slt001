<script setup>
import { watch } from 'vue'
import { reactive } from 'vue'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { setFundPwd } from '@/api/user'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()
const form = reactive({
  pwd: false
})
const setVal = () => {
  form.pwd = !form.pwd
}
watch(
  () => form.pwd,
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
  }
)
const emit = defineEmits(['setPwd'])
// form.pwd.value = !form.pwd.value
const success = ref(false)
watch(success, (newValue) => {
  emit('setPwd', newValue)
})
const formData = ref({
  password: ''
})

const submit = () => {
  if (formData.value.password == '') {
    // showToast('请输入资金密码')
    _toast('Fund_password_noempty')
    return
  }
  
  setFundPwd(formData.value.password).then(res=>{
    if(res.code=='200'){
      // showToast('设置成功')
    _toast('Fund_password_set_success')
      success.value = true
    }else{
      showToast(res.msg)
    }
  })
}
</script>
<template>
  <div class="content">
    <div class="input">
      <svg-load name="mima" class="icon"></svg-load>
      <input :type="form.pwd ? 'text' : 'password'" v-model="formData.password" />
      <svg-load :name="form.pwd ? 'openeyes' : 'closeeyse'" class="icon" @click="setVal"></svg-load>
    </div>
    <div class="btnBox" @click="submit">
      <ButtonBar :btnValue="_t18('btnConfirm',['bitmake'])" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.content {
  padding: 30px 15px 0 15px;
  .input {
    padding: 0 15px;
    width: 100%;
    height: 50px;
    background: var(--ex-default-background-color);
    border-radius: 3px;
    border: 1px solid var(--ex-border-color1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    input {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      font-size: 14px;
      color: var(--ex-default-font-color);
    }
  }
  .icon {
    font-size: 16px;
  }

  .btnBox {
    margin-top: 50px;
  }
}
</style>
