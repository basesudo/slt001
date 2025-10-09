// nft 路由模块
export default [
  // 搜索
  {
    path: '/nft',
    name: 'Nft',
    component: () => import('@/views/nft/nftHome/index.vue')
  },
  // nft列表
  {
    path: '/listDetail',
    name: 'ListDetail',
    component: () => import('@/views/nft/nftHome/listDetail.vue')
  },
  // nft结果页
  {
    path: '/nftResult',
    name: 'NftResult',
    component: () => import('@/views/nft/nftHome/nftResult.vue')
  },
  // nft详情
  {
    path: '/nftDetail',
    name: 'NftDetail',
    component: () => import('@/views/nft/nftHome/nftDetail.vue')
  },
  // nft我的
  {
    path: '/nftMy',
    name: 'NftMy',
    component: () => import('@/views/nft/nftMy/index.vue')
  }
]
