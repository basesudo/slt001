// DEFI相关
import { defineStore } from 'pinia'

export const useDefiStore = defineStore('defi', {
  state: () => {
    return {
      /**
       * 瓜分总金额
       */
      divideBalance: '10000'
    }
  },
  getters: {},
  actions: {}
})
