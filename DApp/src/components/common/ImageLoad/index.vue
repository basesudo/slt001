<!-- 加载 image-->
<script setup name="img-load">
const props = defineProps({
  /**
   * 路径
   */
  filePath: { type: String, default: '' },
  /**
   * 定制平台
   */
  platform: { type: Array, default: () => [] },
  /**
   * 公共主题资源
   */
  isPublic: { type: Boolean, default: true }
})
/**
 * 是否 平台定制
 */
const isCustomized = computed(() => props.platform.includes(__config._APP_ENV))
/**
 * 资源路径
 */
const path = computed(() => {
  let tempPath = ''
  // 判断是否为公共资源
  let tempTheme = ''
  if (!props.filePath.includes('/')) {
    tempTheme = `${__theme}/`
  }
  if (props.filePath.includes('http')) {
    if (
      ['dev', 'dev_dark', 'spark', 'gatedefi', 'hfm2', 'robinhood2'].includes(__config._APP_ENV) &&
      props.filePath.includes('aliyuncs.com')
    ) {
      tempPath = `${props.filePath.replace(
        'https://echo-res.oss-cn-hongkong.aliyuncs.com',
        __config._STATIC_API
      )}?${_APP_VERSION}`
    } else {
      tempPath = `${props.filePath}?${_APP_VERSION}`
    }
  } else if (props.filePath) {
    if (isCustomized.value) {
      tempPath = `/resource/images/${tempTheme}${__config._APP_ENV}/${props.filePath}?${_APP_VERSION}`
    } else {
      tempPath = `/resource/images/${tempTheme}${props.filePath}?${_APP_VERSION}`
    }
  }
  return tempPath
})
</script>
<template>
  <img :src="path" class="img" />
</template>
<style lang="scss" scoped>
.img {
  width: 1em;
  height: 1em;
}
</style>
