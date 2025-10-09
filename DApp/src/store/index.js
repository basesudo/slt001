import { defineStore } from 'pinia'
import { setLanguage } from '../plugin/i18n'
import { storageDict } from '@/config/dict'
import { dict, getPlatFormConfigApi, getSettingConfigApi } from '@/api/common/index.js'
import { TIMEZONE_DICT } from '@/config/index'
import { useUserStore } from './user'
import { getUserRechageNewApi } from '@/api/account'
import { debounce } from 'lodash'
import { getCollect } from '@/api/trade/index'

import { _t18 } from '@/utils/public'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      /**
       * 交易（秒合约/币币交易/U本位合约）
       */
      tradeStatus: 0,
      tradeFlag: '',
      isOption: 0,
      hasOption: false,
      hasCollectCoin: [], //币种收藏列表

      /**
       * 当前语言
       */
      language: localStorage.getItem(storageDict.LANGUAGE),
      /**
       * 语言列表
       */
      languageList: [],

      /**
       * 客服邮箱
       */
      customerEmail: '',
      /**
       * 时区
       */
      timezone: 'Asia/Hong_Kong',
      /**
       * 时区
       */
      timezoneOffset: 8,
      /**
       * 格式化
       */
      timeFormat: 'MM/DD/YYYY',
      /**
       * 验证码地址
       */
      verificationCodeUrl: `${__config._BASE_API}/api/user/easyGenerateCode`,
      /**
       * 平台配置文件
       */
      platFormConfig: {},
      /**
       * 系统配置文件
       */
      settingConfig: {},
      /**
       * 自定义充值列表
       */
      userRechageMap: {}
    }
  },
  getters: {
    // 获取侧边栏
    getSidebarList: (state) => {
      return state.settingConfig.APP_SIDEBAR_SETTING || []
    },
    // 获取充值列表
    getRechargeList: (state) => {
      let tempList = state.settingConfig.ASSET_COIN || []

      return tempList
    },
    // 获取提现列表
    getWithdrawList: (state) => {
      return state.settingConfig.WITHDRAWAL_CHANNEL_SETTING || []
    },
    // 获取defi列表
    getDefiList: (state) => {
      return state.settingConfig.DEFI_INCOME_SETTING || ''
    },
    // 获取首页默认展示币种
    getHomeCoinList: (state) => {
      return state.settingConfig.HOME_COIN_SETTING || []
    },
    // 获取登录注册方式
    getLoginMethodList: (state) => {
      return state.settingConfig.LOGIN_REGIS_SETTING || ''
    },
    // 获取金刚区列表
    getJinGangList: (state) => {
      return state.settingConfig.MIDDLE_MENU_SETTING || []
    },
    // 获取资产tab项配置
    getAssetsTabList: (state) => {
      return state.settingConfig.TAB_SETTING || []
    },
    // 获取玩法配置
    getPlayingList: (state) => {
      return state.settingConfig.PLAYING_SETTING || []
    },
    // 获取底部栏配置
    getTabbarList: (state) => {
      return state.settingConfig.BOTTOM_MENU_SETTING || []
    },
    // 获取下载配置
    getDownLoadList: (state) => {
      return state.settingConfig.DOWNLOAD_SETTING || []
    },
    // 获取交易玩法配置
    getTradeHeaderList: (state) => {
      let tradeList =
        state.settingConfig.PLAYING_SETTING ||
        [
          // { name: '自选', isOpen: true, sort: 0 },
          // { name: '秒合约', isOpen: true, sort: 1 },
          // { name: '币币交易', isOpen: true, sort: 2 },
          // { name: 'U本位', isOpen: true, sort: 3 }
        ]
      let tempList = []
      tradeList.forEach((item, index) => {
        if (item.name == '自选' && item.isOpen) {
          state.isOption = 1
          let obj = {}
          obj['title'] = _t18('quote_optional')
          obj['componentName'] = 'Optional'
          tempList.unshift(obj)
        }
        if (item.name == '秒合约' && item.isOpen) {
          let obj = {}
          obj['title'] = _t18('trade_tab6')
          obj['componentName'] = 'SecondContract'
          obj['currentTab'] = 'secondContract'
          tempList.push(obj)
        }
        if (item.name == '币币交易' && item.isOpen) {
          let obj = {}
          obj['title'] = _t18('trade_tab3')
          obj['componentName'] = 'BBTrading'
          obj['currentTab'] = 'spot'
          tempList.push(obj)
        }
        if (item.name == 'U本位' && item.isOpen) {
          let obj = {}
          obj['title'] = _t18('trade_tab5')
          obj['componentName'] = 'Ustandard'
          obj['currentTab'] = 'contract'
          tempList.push(obj)
        }
      })
      return tempList
    },
    // 获取平台Logo配置
    getLogoList: (state) => {
      return state.settingConfig.LOGO_SETTING || {}
    },
    //登录注册图形验证码
    getISCode: (state) => {
      if (state.settingConfig.MARKET_URL == undefined) {
        return true
      } else {
        return state.settingConfig.MARKET_URL.h5Code
      }
    },
    //vip等级配置
    getVIPClass: (state) => {
      return state.settingConfig.VIP_LEVEL_SETTING || {}
    },
    //vip等级说明
    getVIPRule: (state) => {
      return state.settingConfig.VIP_DIRECTIONS_SETTING || {}
    },
    // 获取客服配置
    getCustomerServiceList: (state) => {
      if (
        [
          'trustwallet',
          'coinmarketcap',
          'kabit',
          'etfinex',
          'ebc',
          'fx',
          'rxce',
          'gmtoin2',
          'math',
          'gatedefi'
        ].includes(__config._APP_ENV)
      ) {
        // 自定义消息弹窗
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `/platform/${__config._APP_ENV}/customer.min.js?${+new Date()}`
        document.body.append(script)
        let tempObj = { ...state.settingConfig.SUPPORT_STAFF_SETTING[0] }
        if (['rxce'].includes(__config._APP_ENV)) {
          // SaleSmartly
          tempObj.callback = () => {
            const userStore = useUserStore()
            ssq.push('setLoginInfo', {
              user_id: userStore.userInfo.user?.userId || '',
              user_name: userStore.userInfo.user?.userId || ''
              // language: '', // 插件语言
              // phone: '', // 手机（注意！带上手机区号）
              // email: '', // 邮箱
              // description: '' // 描述
            })
            ssq.push('chatOpen')
          }
        } else {
          // LiveChatWidget
          tempObj.callback = () => {
            const userStore = useUserStore()
            let userId = userStore.userInfo.user?.userId || ''
            if (userId) {
              LiveChatWidget.call('set_customer_name', `UID_${userId}`)
            }
            LiveChatWidget.call('maximize')
          }
        }
        return [tempObj]
      } else if (
        ['bitfly', 'gmdoin', 'gmmoin', 'gmtoin', 'coinang', 'bkfcoin', 'hfm2'].includes(
          __config._APP_ENV
        )
      ) {
        // 美洽
        let tempObj = { ...state.settingConfig.SUPPORT_STAFF_SETTING[0] }
        tempObj.getUrl = () => {
          const userStore = useUserStore()
          let userId = userStore.userInfo.user?.userId || ''
          return `${tempObj.url}&metadata={"name":"UID_${userId || 'temporary_' + +new Date()}"}`
        }
        return [tempObj]
      }
      return state.settingConfig.SUPPORT_STAFF_SETTING || []
    }
  },
  actions: {
    /**
     * 获取平台配置
     */
    async getSettingConfig() {
      const res = await getSettingConfigApi()
      if (res.code == 200) {
        this.settingConfig = res.data
        this.setTimeZone()
        this.getLanguageList()
        // if (res.data.PLAYING_SETTING[0].name == '自选') {
        //   this.hasOption = res.data.PLAYING_SETTING[0].isOpen
        // }
        this.hasOption = true
      }
    },
    /**
     * 获取用户收藏列表
     */
    async getCollectCoinList() {
      const res = await getCollect()
      if(res.code == 200){
        let list=[]
        res.data.forEach((item,index)=>{
          list.push(item.coin)
        })
        this.hasCollectCoin=list
      }
    },
    /**
     * 获取用户定制地址 防抖执行
     */
    getUserRechageNewDebounce: debounce(
      async function (self) {
        let promiseList = []
        self.settingConfig.ASSET_COIN.map((elem) => {
          if (self.userRechageMap[elem.coinName] == undefined) {
            promiseList.push(getUserRechageNewApi(elem.coin, elem.coinName))
          }
        })
        if (promiseList.length) {
          Promise.all(promiseList).then((res) => {
            self.settingConfig.ASSET_COIN.forEach((elem, index) => {
              self.userRechageMap[elem.coinName] = res[index]['data'][elem.coinName] || ''
            })
          })
        }
      },
      5000,
      { leading: true, trailing: false }
    ),
    /**
     * 获取用户定制地址
     */
    getUserRechageNew() {
      this.getUserRechageNewDebounce(this)
    },

    // 设置 时区配置
    setTimeZone() {
      const data = this.settingConfig.timeZone || ''
      const result = TIMEZONE_DICT.find((elem) => elem.offset == data.offSetValue) || null
      if (!result) {
        this.timezone = data.zoneId
        this.timezoneOffset = data.offSetValue
      } else {
        this.timezone = result.timezone
        this.timezoneOffset = data.offset
      }
    },
    /**
     * 获取 平台配置文件
     */
    async getPlatFormConfig() {
      try {
        const res = await getPlatFormConfigApi()
        const dynamicCode = res.data
        const dynamicFunction = new Function(dynamicCode)
        this.platFormConfig = dynamicFunction()
      } catch (error) {}
    },

    /**
     * 设置 语言
     * @param {*} language
     */
    setLanguage(language) {
      if (this.language != language) {
        this.language = language
        localStorage.setItem(storageDict.LANGUAGE, language)
        setLanguage(language)
        // let tempObj = this.languageList.find((elem) => elem.language == this.language)
        // 触发事件
      }
    },
    /**
     * 获取 语言列表
     */
    getLanguageList() {
      this.languageList = this.settingConfig.t_app_language||[]
    },
    /**
     * 设置交易tabbar状态
     * @param {*} tradeStatus
     */
    setTradeStatus(tradeStatus) {
      this.tradeStatus = tradeStatus
    },
    setTradeFlag(tradeFlag) {
      this.tradeFlag = tradeFlag
    }
  },
  // 开启数据持久化
  // persist: true
  // 持久化存储插件其他配置
  persist: {
    //   // 修改存储中使用的键名称，默认为当前 Store的 id
    //   key: '',
    //   // 修改为 sessionStorage，默认为 localStorage
    //   storage: sessionStorage,
    //   // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
    paths: ['settingConfig']
  }
})
