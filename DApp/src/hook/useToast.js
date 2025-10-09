import { useI18n } from 'vue-i18n'
import { showToast } from 'vant'
import { _t18 } from '@/utils/public'

export const useToast = () => {
  const i18n = useI18n()

  const _toast = (name, platform = []) => {
    let translatedText = ''
    if (name) {
      translatedText = _t18(name, platform, i18n)
    }
    showToast(translatedText)
  }

  const _showName = (name, platform = []) => {
    return _t18(name, platform, i18n)
  }

  return {
    _toast,
    _showName
  }
}
