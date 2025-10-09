import { createI18n } from 'vue-i18n'
import { DEFAULT_LANGUAGE } from '@/config'

/**
 * i18n 实例
 */
let i18nInstance = null

/**
 * 创建i18n实例
 * 当前语言 locale
 * 默认语言 fallback
 * 允许的语言 availableLocales
 */
export const setupI18n = async (locale = DEFAULT_LANGUAGE) => {
  let i18n = createI18n({
    locale: locale,
    fallbackLocale: locale,
    availableLocales: [],
    globalInjection: true,
    silentTranslationWarn: true,
    legacy: false
  })
  i18nInstance = i18n
  await loadLocaleMessages(i18n, locale)
  setI18nLanguage(i18n, locale)
  return i18n
}

/**
 * 设置语言
 */
//  获取语言
import { useMainStore } from '@/store/index.js'

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
  const mainStore = useMainStore()
  const currentLanguage = mainStore.languageList.filter((item) => item.dictValue === locale)
  document.querySelector('html').setAttribute('lang', locale)
  if (currentLanguage.length > 0) {
    document.querySelector('html').setAttribute('language', currentLanguage[0].dictValue)
  } else {
    document.querySelector('html').setAttribute('language', DEFAULT_LANGUAGE)
  }
  mainStore.setLanguage(locale)
}

/**
 * 根据配置获取语言文件
 */
export const loadLocaleMessages = async (i18n, locale = '') => {
  const messages = await import(`./locales/${locale}.json`)
  i18n.global.setLocaleMessage(locale, messages.default)
  return messages
}

/**
 * 切换语言
 */
export const setLanguage = async (locale) => {
  if (!i18nInstance?.global?.availableLocales?.includes(locale)) {
    await loadLocaleMessages(i18nInstance, locale)
  }
  await setI18nLanguage(i18nInstance, locale)
}
