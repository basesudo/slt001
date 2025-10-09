import Web3 from 'web3'
import { getGasPriceApi } from '@/api/common/chain'
import { contractAddress, contractABI } from './config'
import { useUserStore } from '@/store/user'

/**
 * web3 实例
 */
let web3Client = null
/**
 * 合约实例
 */
let tokenContract = null
/**
 * 当前钱包地址
 */
let currentAddress = ''
/**
 * 检验eth
 */
export const check = async () => {
  return typeof window.ethereum !== 'undefined'
}

/**
 * 请求连接钱包
 */
export const connect = async () => {
  let result = { code: 200 }
  let isChecked = await check()
  if (isChecked) {
    web3Client = new Web3(window.ethereum)
    //连接钱包
    try {
      const requestAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (requestAccounts.length) {
        currentAddress = requestAccounts[0]
        result.data = { type: 'ETH', address: currentAddress }
      }
    } catch (error) {
      // 连接账户出错
      console.log(error)
      result.code = 500
      result.msg = error.message
    }
  }
  return result
}
/**
 * 初始化 钱包切换监听
 */
export const initSwitchWalletEvent = async () => {
  let checked = await check()
  console.log('ETH钱包检查结果:', checked)
  if (checked) {
    console.log('开始初始化ETH钱包监听器')
    const userStore = useUserStore()
    
    // 移除旧的监听器避免重复绑定
    if (window.ethereum.removeAllListeners) {
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.removeAllListeners('chainChanged')
      window.ethereum.removeAllListeners('disconnect')
    }
    
    window.ethereum.on('accountsChanged', async (accounts) => {
      // 钱包切换
      console.log('ETH钱包地址变化:', accounts)
      if (accounts && accounts.length > 0) {
        currentAddress = accounts[0]
        console.log('执行退出登录，新地址:', currentAddress)
        userStore.signOut()
        setTimeout(() => location.reload(), 10)
      }
    })
    window.ethereum.on('chainChanged', async (e) => {
      //监听链网络改变
      console.log('ETH网络变化:', e)
      userStore.signOut()
      setTimeout(() => location.reload(), 10)
    })

    window.ethereum.on('disconnect', (code, reason) => {
      // 断开连接
      console.log('ETH钱包断开连接:', code, reason)
    })
    console.log('ETH钱包监听器初始化完成')
  }
}
/**
 * 获取 GasPrice
 */
export const getGasPrice = async () => {
  let tempGasPrice = 7e4
  // 获取当前 Gas 价格
  const gasPrice = await web3Client.eth.getGasPrice()
  if (gasPrice) {
    tempGasPrice = parseInt(gasPrice) * 2
  }

  console.log('gasPrice', gasPrice)
  // try {
  //   const res = await getGasPriceApi()
  //   if (res && res.code == 0) {
  //     let tempData = JSON.parse(res.data)
  //     if (tempData && tempData.FastGasPrice) {
  // web3Client.utils.toWei(tempData.FastGasPrice.toString(), 'gwei')
  //       sendParams.gasPrice = parseInt(tempData.FastGasPrice * 1e9)
  //     }
  //   }
  // } catch (error) {
  //   console.log('getGasPrice——error', error)
  // }
  return tempGasPrice
}

/**
 * 合约授权
 */
export const approve = async (spenderAddress, type = 'USDT') => {
  await connect()

  if (!tokenContract) {
    tokenContract = new web3Client.eth.Contract(contractABI, contractAddress[type])
  }
  // 代币的小数位数
  const tokenDecimals = BigInt(18)
  // 希望授权的代币数量
  const tokenAmountToApprove = BigInt(999000000000)
  // 授权数量
  const amountToAuthorize = web3Client.utils.toHex(
    tokenAmountToApprove * BigInt(10) ** tokenDecimals
  )

  let sendParams = {
    from: currentAddress, //当前钱包地址
    gas: 7e4
  }
  // sendParams.gasPrice = parseInt(tempData.FastGasPrice * 1e9)
  sendParams.gasPrice = await getGasPrice()
  // 调用合约的 approve 方法进行授权
  return {
    approveMethod: tokenContract.methods.approve(spenderAddress, amountToAuthorize).send(sendParams)
  }
}
