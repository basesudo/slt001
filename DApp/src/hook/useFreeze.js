import { useUserStore } from '@/store/user/index'
import { dispatchCustomEvent } from '@/utils'

export const useFreeze = () => {
  const userStore = useUserStore()
  const isFreeze = userStore.userInfo.user.status

  const _isFreeze = (platform = []) => {
    if (platform.includes(__config._APP_ENV) && isFreeze) {
      dispatchCustomEvent('event_freezePopup')
    } else {
      return true
    }
    return false
  }
  return {
    _isFreeze
  }
}
