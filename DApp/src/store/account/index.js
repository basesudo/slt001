// 充值 、提现、兑换模块
import { defineStore } from 'pinia'
import { getAppCurrencyList, getWithDrawSetting, getSwapSetting } from '@/api/account.js'

export const useAccountStore = defineStore('account', () => {
  /**
   * 充值
   */
  //充值的币种列表
  const rechangeCoinList = ref([])
  const getRechangeCoinList = async () => {
    const data = await getAppCurrencyList()
    rechangeCoinList.value = data.data
    console.log(1111, rechangeCoinList.value)
  }
  /**
   * 提现
   */
  //提现的币种列表
  const withdrawCoinList = ref([])
  const getWithDrawCoinList = async () => {
    const data = await getWithDrawSetting()
    withdrawCoinList.value = data.data
  }
  /**
   * 兑换
   */
  // 兑换成什么币种列表
  const swapCoinList = ref([])
  const getSwapCoinList = async () => {
    const data = await getSwapSetting({
      isAsc: 'asc',
      orderByColumn: 'sort'
    })
    let list = []
    localStorage.setItem('coinImgs', JSON.stringify(data))
    data.rows.forEach((item, index) => {
      let obj = {}
      if (item.symbol == 'usdt') {
        obj['coin'] = 'usdt'
        obj['icon'] = 'usdt'
        list.unshift(obj)
      } else {
        obj['coin'] = item.symbol?.replace('usdt', '').trim()
        // obj['icon'] = item.symbol?.replace('usdt', '').trim()
        obj['icon'] = item.logo
        list.push(obj)
      }
    })
    console.log('兑换成什么币种列表', list)
    swapCoinList.value = list
  }
  return {
    rechangeCoinList,
    getRechangeCoinList,
    withdrawCoinList,
    getWithDrawCoinList,
    swapCoinList,
    getSwapCoinList
  }
})
