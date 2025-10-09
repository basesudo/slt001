<!--
 * @Author: zhangyang
 * @Date: 2025-08-18 10:00:00
 * @LastEditors: zhangyang
 * @LastEditTime: 2025-08-18 10:00:00
 * @Description: 
  power by T@majiaopi6
-->
  
<template>
  <div class="connect-wallet-page">
    <HeaderBar :currentName="_t18('Connect_wallet')" :border_bottom="true" />
    <div class="page-content">
      <div class="connect-header">
        <div class="connect-title fw-bold">{{ _t18('Connect_wallet') }}</div>
        <Copy :data="locationHref" :contentFix="'start'" :fontSize="'12px'" :noFlag="false">
          <template #copyMsg>
            <div class="copy-link-btn">
              <svg class="copy-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z" />
              </svg>
              <span>{{ _t18('copy_Link') }}</span>
            </div>
          </template>
        </Copy>
      </div>

      <div class="connect-content">
        <div class="wallet-item" @click="onSelectWallet('tp')">
          <image-load filePath="tp.png" class="wallet-icon" />
          <div class="wallet-name">TP Wallet</div>
          <span class="tag">{{ _t18('recommend') }}</span>
        </div>
        <div class="wallet-item" @click="onSelectWallet('metamask')">
          <image-load filePath="metamask.png" class="wallet-icon" />
          <div class="wallet-name">MetaMask</div>
        </div>
        <!-- <div class="wallet-item" @click="onSelectWallet('trust')">
          <image-load filePath="trust.png" class="wallet-icon" />
          <div class="wallet-name">Trust Wallet</div>
        </div> -->
        <div class="wallet-item" @click="onSelectWallet('onchain')">
          <image-load filePath="onchain.png" class="wallet-icon" />
          <div class="wallet-name">Crypto Wallet</div>
        </div>

        <div class="connect-bottom">
          <div class="no-wallet">
            {{ _t18('no_wallet') }}
            <a class="start-link" href="https://www.tokenpocket.pro/" target="_blank" rel="noopener">{{ _t18('get_wallet') }}</a>
          </div>
          <div class="cancel">{{ _t18('tip_cancel') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/HeaderBar/index.vue'
import Copy from '@/components/common/Copy/index.vue'
import ImageLoad from '@/components/common/ImageLoad/index.vue'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAcount } from '@/plugin/chain'
import { signUp } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import { dispatchCustomEvent } from '@/utils'
import { storageDict } from '@/config/dict'
const locationHref = location.href
const $router = useRouter()
const $route = useRoute()
const userStore = useUserStore()

// 检测到钱包环境则自动授权并登录
const autoAuthorizeLogin = async () => {
  try {
    const acountRes = await getAcount()
    if (!acountRes || acountRes === 'no-wallet' || acountRes.code !== 200) return
    
    // 从路由获取邀请码并临时存储（路由守卫可能已经处理了）
    const inviteFromRoute = $route.params?.invite_code || $route.query?.invite_code || ''
    if (inviteFromRoute) {
      localStorage.setItem(storageDict.ACTIVE_CODE, inviteFromRoute)
      console.log('页面级别设置邀请码:', inviteFromRoute)
    }
    
    // 透传邀请码（若存在）
    const activeCode = localStorage.getItem(storageDict.ACTIVE_CODE) || ''
    const params = activeCode
      ? { activeCode, signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
      : { signType: 0, address: acountRes.data.address, walletType: acountRes.data.type }
    
    console.log('页面级别钱包登录参数:', params)
    const singUpRes = await signUp(params)
    if (singUpRes.code == 200 && singUpRes.data.satoken) {
      dispatchCustomEvent('event_toastChange', { name: 'login_success' })
      const token = singUpRes.data.satoken
      userStore.setIsSign(true)
      userStore.setToken(token)
      userStore.getUserInfo()
      
      // 成功登录后清除邀请码，避免重复使用
      if (activeCode) {
        localStorage.removeItem(storageDict.ACTIVE_CODE)
        console.log('页面级别清除已使用的邀请码:', activeCode)
      }
      
      $router.replace('/')
    }
  } catch (e) {
    // 静默失败，不打扰用户
    console.log('页面级别钱包登录失败:', e)
  }
}

onMounted(() => {
  // 由于路由守卫已经处理了大部分自动登录逻辑，这里主要作为备用
  // 延迟执行，确保路由守卫先执行
  setTimeout(() => {
    autoAuthorizeLogin()
  }, 100)
})

const onSelectWallet = (key) => {
  openWalletApp(key)
}

const openWalletApp = (key) => {
  const currentUrl = location.href
  const metamaskDappUrl = currentUrl.replace(/^https?:\/\//, '')
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isHttpsPublic = location.protocol === 'https:' && !/^(localhost|127\.0\.0\.1)$/i.test(location.hostname)
  const trustLink = isHttpsPublic
    ? `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(currentUrl)}`
    : ''
  const links = {
    metamask: `https://metamask.app.link/dapp/${metamaskDappUrl}`,
    trust: trustLink || 'https://trustwallet.com/',
    tp: `tpoutside://open?app=browser&url=${encodeURIComponent(currentUrl)}`,
    walletconnect: `https://walletconnect.com/`,
    okx: `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(currentUrl)}`,
    bitget: `bitkeep://bkconnect?action=dapp&url=${encodeURIComponent(currentUrl)}`,
    imtoken: `imtokenv2://navigate/DappView?url=${encodeURIComponent(currentUrl)}`,
    onchain: `https://crypto.com/onchain/`
  }
  const fallback = {
    metamask: 'https://metamask.io/download/',
    trust: 'https://trustwallet.com/',
    tp: 'https://www.tokenpocket.pro/en/download/app',
    walletconnect: 'https://walletconnect.com/',
    okx: 'https://www.okx.com/web3',
    bitget: 'https://web3.bitget.com/en/wallet-download',
    imtoken: 'https://token.im/',
    onchain: 'https://crypto.com/onchain/'
  }
  const target = links[key] || currentUrl
  const isHttp = /^https?:/i.test(target)

  if (!isMobile) {
    if (isHttp) {
      window.open(target, '_blank', 'noopener')
    } else if (key in fallback) {
      window.open(fallback[key], '_blank', 'noopener')
    }
    return
  }

  try {
    if (isHttp) {
      if (key === 'trust' && !isHttpsPublic) {
        showToast('done')
        location.href = fallback.trust
        return
      }
      location.href = target
    } else {
      location.href = target
      setTimeout(() => {
        if (key in fallback && document.visibilityState === 'visible') {
          location.href = fallback[key]
        }
      }, 1200)
    }
  } catch (e) {
    if (key in fallback) location.href = fallback[key]
  }
}
</script>

<style lang="scss" scoped>
.connect-wallet-page {
  min-height: 100vh;
  background: var(--ex-background-color);
}
.page-content {
  padding: 12px 12px 24px;
}
.connect-title {
  font-size: 17px;
  padding: 0 4px;
}
.connect-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
}
.copy-link-btn {
  font-size: 12px;
  color: var(--ex-default-font-color);
  padding: 6px 10px;
  border: 1px solid var(--ex-home-box-border-color);
  border-radius: 14px;
  background: var(--ex-home-box-background-color);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.copy-icon { opacity: 0.6; }
.connect-content {
  padding: 12px 0 12px;
  .wallet-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 16px;
    background: var(--ex-home-box-background-color2);
    border-radius: 25px;
    margin-bottom: 10px;
    .wallet-icon {
      width: 24px;
      height: 24px;
    }
    .wallet-name {
      flex: 1;
      font-size: 15px;
      color: var(--ex-default-font-color);
    }
    .tag {
      font-size: 12px;
      color: #fff;
      background: #17ac74;
      padding: 3px 8px;
      border-radius: 999px;
    }
  }
  .connect-bottom {
    text-align: center;
    color: var(--ex-font-color9);
    margin-top: 16px;
    .no-wallet { margin: 12px 0 6px; }
    .start-link { color: #000; text-decoration: underline; margin-left: 4px; }
    .cancel { margin-top: 12px; color: var(--ex-default-font-color); }
  }
}
</style>


