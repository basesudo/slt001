<template>
  <div class="slidebar">
    <div class="close">
      <svg-load name="guanbi" class="closeImg" @click="closeSideBar"></svg-load>
    </div>
    <UserLogin v-if="isSign"></UserLogin>
    <Navigation></Navigation>
    <!-- 未登录按钮隐藏 -->
    <!-- 已登录（所有登录方式） -->
    <div v-if="isSign" class="logged" @click="exit">
      <svg-load name="tuichu" class="loggedImg"></svg-load>
      <!-- 退出登录 -->
      <div>{{ _t18('layout', ['aams']) }}</div>
    </div>

 

    <!-- 退出弹窗 -->
    <!-- 您确定要退出登录吗 -->
    <Dialog
      v-model:value="showDialog"
      :title="``"
      :content="_t18('layout_require')"
      confirm-button-color="#17ac74"
      @cancelBtn="cancelBtn"
      @confirmBtn="confirmBtn"
      :confirmButtonText="_t18('btnConfirm', ['bitmake'])"
      :cancelButtonText="_t18('cancel')"
      z-index="200"
    ></Dialog>
  </div>
</template>
<script setup>
import { _back, _t18, _toView, _toReplace } from '@/utils/public'
import ButtonBar from '@/components/common/ButtonBar/index.vue'
import { signOut } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import UserLogin from '../components/Sidebar/userLogin.vue'
import Navigation from '../components/Sidebar/navigation.vue'
import Dialog from '@/components/Dialog/index.vue'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
// 判断是否登录
const isSign = ref(userStore.isSign)
/**
 * 显示弹窗
 */
const showDialog = ref(false)
// 退出登录
const exit = () => {
  showDialog.value = true
}
const confirmBtn = () => {
  showDialog.value = false
  signOut()
    .then((res) => {
      if (res.code == '200') {
        _toast('layout_success')
        // 清除token
        userStore.signOut()
        _toReplace('/')
        closeSideBar()
        isSign.value = false
        setTimeout(() => location.reload(), 10)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
const cancelBtn = () => {
  showDialog.value = false
}
const emit = defineEmits(['closeSideBar'])
const closeSideBar = () => {
  emit('closeSideBar')
}

// 测试钱包监听器状态
const testWalletListeners = () => {
  // 动态导入钱包监听器状态检查
  import('@/utils/walletMonitor').then(({ getWalletMonitorStatus }) => {
    const status = getWalletMonitorStatus()
    console.log('=== 钱包监听器状态测试 ===')
    console.log('监听器状态:', status)
    console.log('window.ethereum存在:', typeof window.ethereum !== 'undefined')
    console.log('window.tron存在:', typeof window.tron !== 'undefined')
    console.log('当前用户信息:', userStore.userInfo)
    console.log('用户登录状态:', userStore.isSign)
    
    _toast('请查看控制台日志')
  })
}

// 检查当前钱包地址
const checkCurrentAddress = async () => {
  console.log('=== 检查当前钱包地址 ===')
  
  try {
    const addresses = []
    
    // 检查不同钱包的地址
    if (window.ethereum && window.ethereum.request) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        addresses.push({ wallet: 'ethereum', address: accounts[0] || '未连接' })
      } catch (e) {
        addresses.push({ wallet: 'ethereum', error: e.message })
      }
    }
    
    
    if (window.okxwallet && window.okxwallet.ethereum && window.okxwallet.ethereum.request) {
      try {
        const accounts = await window.okxwallet.ethereum.request({ method: 'eth_accounts' })
        addresses.push({ wallet: 'okxwallet', address: accounts[0] || '未连接' })
      } catch (e) {
        addresses.push({ wallet: 'okxwallet', error: e.message })
      }
    }
    
    console.log('当前钱包地址:', addresses)
    console.log('用户登录地址:', userStore.userInfo.user?.address)
    
    _toast('请查看控制台日志')
  } catch (error) {
    console.error('检查地址失败:', error)
    _toast('检查地址失败')
  }
}

// 重新初始化钱包监听器
const reinitWalletMonitor = () => {
  console.log('=== 重新初始化钱包监听器 ===')
  
  import('@/utils/walletMonitor').then(({ reinitWalletMonitor }) => {
    reinitWalletMonitor()
    _toast('钱包监听器已重新初始化')
  })
}


// 模拟地址变化（用于测试）
const simulateAddressChange = () => {
  console.log('=== 模拟钱包地址变化 ===')
  
  // 直接调用退出登录来测试功能
  if (userStore.isSign) {
    console.log('模拟钱包地址变化，执行退出登录')
    userStore.signOut()
    _toast('模拟地址变化，已执行退出登录')
    setTimeout(() => {
      location.reload()
    }, 1000)
  } else {
    console.log('用户未登录，无法测试退出功能')
    _toast('请先登录后再测试')
  }
}
</script>
<style lang="scss" scoped>
.slidebar {
  height: 100vh;
  padding-bottom: 100px;
  overflow: auto;
}
.close {
  padding: 17px 15px 20px;
  display: flex;
  justify-content: flex-end;
  .closeImg {
    width: 24px;
    height: 24px;
  }
}

// 未登录
.notLogged {
  border-top: 1px solid var(--ex-input-boder-bgColor);
  padding: 50px 15px 30px;
  .btnBox {
    margin-bottom: 20px;
  }
}
// 登录
.logged {
  border-top: 1px solid var(--ex-input-boder-bgColor);

  margin-top: 50px;
  padding: 30px 15px;
  font-size: 14px;
  color: var(--ex-font-color9);
  display: flex;
  align-items: center;
  .loggedImg {
    width: 20px;
    height: 20px;
    margin-right: 20px;
  }
  div {
    color: var(--ex-font-color9);
  }
}
</style>
