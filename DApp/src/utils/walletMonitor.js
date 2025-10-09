// 钱包地址变化监听器
import { useUserStore } from '@/store/user'

let isInitialized = false
let ethListenerAdded = false
let tronListenerAdded = false

/**
 * 检查以太坊钱包是否可用
 */
const checkETHWallet = () => {
  return typeof window.ethereum !== 'undefined' || 
         typeof window.okxwallet !== 'undefined' || // OKX Wallet
         typeof window.bitkeep !== 'undefined' // BitKeep
}

/**
 * 检查波场钱包是否可用
 */
const checkTRONWallet = () => {
  return typeof window.tron !== 'undefined' ||
         typeof window.tronWeb !== 'undefined'
}

/**
 * 获取当前钱包地址
 */
const getCurrentWalletAddress = async () => {
  try {
    if (window.ethereum && window.ethereum.request) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      return accounts.length > 0 ? accounts[0] : null
    }
    if (window.okxwallet && window.okxwallet.ethereum) {
      const accounts = await window.okxwallet.ethereum.request({ method: 'eth_accounts' })
      return accounts.length > 0 ? accounts[0] : null
    }
    if (window.bitkeep && window.bitkeep.ethereum) {
      const accounts = await window.bitkeep.ethereum.request({ method: 'eth_accounts' })
      return accounts.length > 0 ? accounts[0] : null
    }
  } catch (error) {
    console.error('获取钱包地址失败:', error)
  }
  return null
}

/**
 * 初始化以太坊钱包监听器
 */
const initETHListener = () => {
  if (ethListenerAdded) return
  
  try {
    if (checkETHWallet()) {
      console.log('初始化ETH钱包监听器')
      
      // 存储当前地址用于比较
      let lastAddress = null
      
      // 获取初始地址
      getCurrentWalletAddress().then(address => {
        lastAddress = address
        console.log('初始钱包地址:', lastAddress)
      })
      
      // 移除旧的监听器
      if (window.ethereum && window.ethereum.removeAllListeners) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
      
      // 为不同的钱包添加监听器
      const wallets = [
        { name: 'ethereum', obj: window.ethereum },
        { name: 'okxwallet', obj: window.okxwallet?.ethereum },
        { name: 'bitkeep', obj: window.bitkeep?.ethereum }
      ]
      
      wallets.forEach(wallet => {
        if (wallet.obj) {
          console.log(`为${wallet.name}钱包添加监听器`)
          
          // 监听账户变化
          wallet.obj.on('accountsChanged', (accounts) => {
            console.log(`${wallet.name}钱包地址变化:`, accounts)
            if (accounts && accounts.length > 0) {
              handleWalletChange(`${wallet.name}地址变化`, accounts[0])
            }
          })
          
          // 监听网络变化
          wallet.obj.on('chainChanged', (chainId) => {
            console.log(`${wallet.name}网络变化:`, chainId)
            handleWalletChange(`${wallet.name}网络变化`, chainId)
          })
          
          // 监听断开连接
          wallet.obj.on('disconnect', (code, reason) => {
            console.log(`${wallet.name}钱包断开连接:`, code, reason)
          })
        }
      })
      
      // 添加轮询检查作为备用方案
      const pollInterval = setInterval(async () => {
        try {
          const currentAddress = await getCurrentWalletAddress()
          if (currentAddress && currentAddress !== lastAddress) {
            console.log('轮询检测到地址变化:', lastAddress, '->', currentAddress)
            handleWalletChange('轮询检测地址变化', currentAddress)
            lastAddress = currentAddress
          }
        } catch (error) {
          console.error('轮询检查地址失败:', error)
        }
      }, 3000) // 每3秒检查一次
      
      // 清理轮询
      window.walletPollInterval = pollInterval
      
      ethListenerAdded = true
      console.log('ETH钱包监听器初始化完成')
    }
  } catch (error) {
    console.error('ETH钱包监听器初始化失败:', error)
  }
}

/**
 * 初始化波场钱包监听器
 */
const initTRONListener = () => {
  if (tronListenerAdded) return
  
  try {
    if (checkTRONWallet()) {
      console.log('初始化TRON钱包监听器')
      
      // 移除旧的监听器
      if (window.tronWalletMessageHandler) {
        window.removeEventListener('message', window.tronWalletMessageHandler)
      }
      
      // 添加新的监听器
      window.tronWalletMessageHandler = (event) => {
        if (event.data && event.data.message && event.data.message.action === 'accountsChanged') {
          console.log('TRON钱包地址变化:', event.data.message.data.address)
          handleWalletChange('TRON地址变化', event.data.message.data.address)
        }
      }
      
      window.addEventListener('message', window.tronWalletMessageHandler)
      tronListenerAdded = true
      console.log('TRON钱包监听器初始化完成')
    }
  } catch (error) {
    console.error('TRON钱包监听器初始化失败:', error)
  }
}

/**
 * 处理钱包变化
 */
const handleWalletChange = (type, newValue) => {
  console.log(`钱包变化检测: ${type} -> ${newValue}`)
  
  const userStore = useUserStore()
  
  // 只有在用户已登录时才执行退出
  if (userStore.isSign) {
    console.log('用户已登录，执行退出登录')
    userStore.signOut()
    
    // 显示提示
    if (window.dispatchCustomEvent) {
      window.dispatchCustomEvent('event_toastChange', { name: 'wallet_address_changed' })
    } else {
      console.log('钱包地址变化，已自动退出登录')
    }
    
    // 延迟刷新页面
    setTimeout(() => {
      location.reload()
    }, 1000)
  } else {
    console.log('用户未登录，跳过退出操作')
  }
}

/**
 * 初始化钱包监听器
 */
export const initWalletMonitor = () => {
  if (isInitialized) {
    console.log('钱包监听器已初始化，跳过')
    return
  }
  
  console.log('开始初始化钱包监听器')
  
  // 延迟初始化，确保钱包准备就绪
  setTimeout(() => {
    initETHListener()
    initTRONListener()
    
    
    isInitialized = true
    console.log('钱包监听器初始化完成')
  }, 2000)
}

/**
 * 重新初始化钱包监听器
 */
export const reinitWalletMonitor = () => {
  console.log('重新初始化钱包监听器')
  
  // 清理轮询
  if (window.walletPollInterval) {
    clearInterval(window.walletPollInterval)
    window.walletPollInterval = null
  }
  
  
  isInitialized = false
  ethListenerAdded = false
  tronListenerAdded = false
  initWalletMonitor()
}

/**
 * 清理钱包监听器
 */
export const cleanupWalletMonitor = () => {
  console.log('清理钱包监听器')
  
  // 清理轮询
  if (window.walletPollInterval) {
    clearInterval(window.walletPollInterval)
    window.walletPollInterval = null
  }
  
  // 清理事件监听器
  if (window.ethereum && window.ethereum.removeAllListeners) {
    window.ethereum.removeAllListeners('accountsChanged')
    window.ethereum.removeAllListeners('chainChanged')
    window.ethereum.removeAllListeners('disconnect')
  }
  
  if (window.tronWalletMessageHandler) {
    window.removeEventListener('message', window.tronWalletMessageHandler)
    window.tronWalletMessageHandler = null
  }
  
  isInitialized = false
  ethListenerAdded = false
  tronListenerAdded = false
}

/**
 * 获取监听器状态
 */
export const getWalletMonitorStatus = () => {
  return {
    isInitialized,
    ethListenerAdded,
    tronListenerAdded,
    ethWalletAvailable: checkETHWallet(),
    tronWalletAvailable: checkTRONWallet(),
    availableWallets: {
      ethereum: typeof window.ethereum !== 'undefined',
      okxwallet: typeof window.okxwallet !== 'undefined',
      bitkeep: typeof window.bitkeep !== 'undefined',
      tron: typeof window.tron !== 'undefined',
      tronWeb: typeof window.tronWeb !== 'undefined'
    },
    pollInterval: !!window.walletPollInterval
  }
}
