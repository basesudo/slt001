/**
 * 未登录 可访问
 */
export const noLoginRouterList = [
  '/',
  '/home', // 首页
  '/sign-in', // 登录
  '/no-wallet', // 非钱包进入
  '/connect-wallet', // 连接钱包独立页
  '/app-download', //下载
  '/quote', //行情
  '/language-selection', //多语言
  '/help', //帮助
  '/term-service', //服务条款
  '/service', //客服
  '/broadcastDetails', // 轮播详情
  // 使用协议
  '/termsOfuse',
  // 隐私政策
  '/privacyPolicy'
]

/**
 * 须登录 可访问
 */
export const hasLoginRouterList = [
  '/recharge', // 充币
  '/withdraw', // 提币
  '/swap', // 兑换
  '/plug', // 推广中心
  '/assets', // 资产
  '/financial', // 理财
  '/loan', // 助力贷
  '/trade', // 交易
  '/certification-primary', //初级认证
  '/certification-advanced', //高级认证
  '/bind-card', //绑定银行卡
  '/fund-password', //设置资金密码
  '/change-password', //修改登录密码
  '/email-authentication', //邮箱认证
  '/defi', //defi挖矿
  '/pledge', //质押挖矿
  '/addAddress' // 新增钱包地址
]
