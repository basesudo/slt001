import Home from './module/home'
import Quote from './module/quote'
import Slider from './module/slider'
import Financial from './module/financial'
import Assets from './module/assets'
import Trade from './module/trade'
import Loan from './module/loan'
import Pledge from './module/pledge'
import User from './module/user'
import Help from './module/help'
import Nft from './module/nft'
import other from './module/other'
import subscription from './module/subscription'
export default [
  // 首页
  {
    alias: '/',
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue')
  },
  ...Home,
  ...Quote, // 行情
  ...Financial, // 理财
  ...Trade, // 交易
  ...Slider, //侧边栏
  ...Loan, //助力贷
  ...Pledge, //质押挖矿
  ...Assets, //资产
  ...User, //用户
  ...Help, // 帮助
  ...Nft, // nft
  ...other, // 其他
  ...subscription, //申购
  //行情
  {
    path: '/quote',
    name: 'Quote',
    component: () => import('@/views/quote/index.vue')
  },
  // 交易
  {
    path: '/trade',
    name: 'Trade',
    component: () => import('@/views/trade/index.vue')
  },
  // 交易杠杆
  {
    path: '/tradeU',
    name: 'TradeU',
    component: () => import('@/views/trade/tradeU.vue')
  },
  // 交易BB
  {
    path: '/tradeBB',
    name: 'TradeBB',
    component: () => import('@/views/trade/tradeBB.vue')
  },
  // 挖矿
  {
    path: '/defi',
    name: 'Defi',
    component: () => import('@/views/defi/index.vue')
  },
  {
    path: '/defiDetail',
    name: 'defiDetail',
    component: () => import('@/views/defi/defiDetail.vue')
  },
  // 理财
  {
    path: '/financial',
    name: 'Financial',
    component: () => import('@/views/financial/index.vue')
  },
  // 资产
  {
    path: '/assets',
    name: 'Assets',
    component: () => import('@/views/assets/index.vue')
  },

  // 客服
  {
    path: '/service',
    name: 'Service',
    component: () => import('@/views/service/index.vue')
  },
  // 首页
  {
    path: '/:catchAll(.*)', // 不识别的path自动匹配404
    redirect: '/home'
  }
]
