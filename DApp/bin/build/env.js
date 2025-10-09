const envList = {
  dev: {
    // 当前平台
    VITE_APP_ENV: 'dev',
    // 默认主题 light dark
    VITE_APP_PLEATFORM_THEME: 'light',

    // API
    VITE_APP_BASE_API: 'https://api2.ok6.cc',
    // STATIC API
    VITE_APP_STATIC_API: 'https://static.ok6.cc',
    // WSS
    VITE_APP_BASE_WSS: 'wss://api2.ok6.cc',

    // 完整标题
    VITE_APP_META_TITLE: 'DEV_TITLE',
    // 交易所名称
    VITE_APP_EXCHANGE_NAME: 'DEV',
    // 缩写标题
    VITE_APP_META_TITLE_SUB: 'DEV_TITLE_SUB',
    // 关键字
    VITE_APP_META_KEYWORDS: 'DEV_KEYWORDS',
    // 描述
    VITE_APP_META_DESCRIPTION: 'DEV_DESCRIPTION'

    // H5 URL
    // VITE_APP_PLANFORM_H5: '',
    // PC URL
    // VITE_APP_PLANFORM_PC: ''
  },
  dev_dark: {
    VITE_APP_ENV: 'dev_dark',
    VITE_APP_PLEATFORM_THEME: 'dark',

    VITE_APP_BASE_API: 'https://api2.ok6.cc',
    VITE_APP_BASE_WSS: 'wss://api2.ok6.cc',

    VITE_APP_META_TITLE: 'DEV_Dark',
    VITE_APP_EXCHANGE_NAME: 'DEV_Dark',
    VITE_APP_META_TITLE_SUB: 'DEV_Dark',
    VITE_APP_META_KEYWORDS: 'DEV_Dark_KEYWORDS',
    VITE_APP_META_DESCRIPTION: 'DEV_Dark_DESCRIPTION'
  },
  prd: {
    VITE_APP_ENV: 'prd',
    VITE_APP_PLEATFORM_THEME: 'light',
    VITE_APP_BASE_API: 'https://api2.ok6.cc',
    VITE_APP_BASE_WSS: 'wss://api2.ok6.cc',
    VITE_APP_META_TITLE: 'trustdefi',
    VITE_APP_EXCHANGE_NAME: 'trustdefi',
    VITE_APP_META_TITLE_SUB: 'trustdefi',
    VITE_APP_META_KEYWORDS: 'trustdefi',
    VITE_APP_META_DESCRIPTION: 'trustdefi'
  }
}

module.exports = { envList }
