// 用户模块
import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user'
import { storageDict } from '@/config/dict'
import { dispatchCustomEvent } from '@/utils'
import { useAccountStore } from '../account'
import { closeToast } from 'vant'
import { useMainStore } from '../index'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      /**
       * token
       */
      token: '',
      /**
       * 是否登录
       */
      isSign: ref(false),
      /**
       * 用户信息
       */
      userInfo: reactive({}),
      /**
       * 资产列表
       */
      asset: reactive([])
    }
  },
  actions: {
    /**
     * 设置 token
     * @param {*} token
     */
    setToken(token) {
      this.token = token || ''
      localStorage.setItem(storageDict.TOKEN, this.token)
    },
    /**
     * 设置 登录状态
     * @param {*} isSign
     */
    setIsSign(isSign) {
      this.isSign = isSign
    },
    /**
     * 退出登录
     */
    signOut() {
      try {
        let testPlatform = localStorage.getItem(storageDict.TEST_PLATFORM)

        localStorage.clear()
        sessionStorage.clear()
        if (testPlatform) {
          localStorage.setItem(storageDict.TEST_PLATFORM, testPlatform)
        }
        this.$reset()
        const accountStore = useAccountStore()
        accountStore && accountStore.$reset()
      } catch (error) {}
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const res = await getUserInfo()
      if (res.code == 200) {
        Object.assign(this.userInfo, res.data || {})
        Object.assign(this.asset, this.userInfo.asset || [])
        dispatchCustomEvent('event_userInfoChange', this.userInfo)
        // dispatchCustomEvent('event_userInfoChange2', this.userInfo)
        localStorage.setItem(storageDict.USER_INFO, JSON.stringify(this.userInfo))
        closeToast()
        const mainStore = useMainStore()
        mainStore.getUserRechageNew()
        return this.userInfo
      } else {
        closeToast()
      }
    }
  },
  // 开启数据持久化
  persist: true

  // // 持久化存储插件其他配置
  // persist: {
  //   // 修改存储中使用的键名称，默认为当前 Store的 id
  //   key: '',
  //   // 修改为 sessionStorage，默认为 localStorage
  //   storage: sessionStorage,
  //   // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
  //   paths: []
  // }
})
