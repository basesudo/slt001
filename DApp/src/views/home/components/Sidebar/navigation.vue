<template>
  <div class="list">
    <div
      class="item"
      v-for="item in listArray.filter((item) => item.isOpen)"
      :key="item.icon"
      @click="toView(item)"
    >
      <image-load :filePath="item.logoUrl" alt="" class="itemImg" />
      <div class="itemRight">
        <!-- <div>{{ item.name }}</div> -->
        <div v-if="item.key == 'language'">{{ _t18(`language_key`) }}</div>
        <div v-else>{{ _t18(`sidebar_${item.key}`, ['bitmake', 'paxpay', 'aams']) }}</div>
        <div class="right_tip">
          <span v-if="item.key == 'primary' && userInfo.detail?.auditStatusPrimary === '1'">{{
            _t18('verified_ok')
          }}</span>
          <span v-if="item.key == 'advanced' && userInfo.detail?.auditStatusAdvanced === '1'">{{
            _t18('verified_ok')
          }}</span>
          <svg-load name="jiantou-y" class="rightImg"></svg-load>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { noticeList, getWhitePaperUrl } from '@/api/common/index'
import { useMainStore } from '@/store/index.js'
// import { getCurrentInstance } from "vue";
import { _t18, _toView } from '@/utils/public'
import { useUserStore } from '@/store/user/index'
import { storeToRefs } from 'pinia'
import { useToast } from '@/hook/useToast'
const { _toast } = useToast()

const userStore = useUserStore()
if (userStore.isSign) {
  userStore.getUserInfo()
}

// 用户信息
const { userInfo } = storeToRefs(userStore)
import { useRouter } from 'vue-router'
const router = useRouter()
// const _this = getCurrentInstance().appContext.config.globalProperties
const mainStore = useMainStore()
// 获取侧边栏列表
// mainStore.setSidebarList()
const paperUrl = ref('')
const listArray = computed(() => {
  let data = mainStore.getSidebarList
  // for (let key in mainStore.getSidebarList) {
  //   if (mainStore.getSidebarList[key]) {
  //     let obj = {}
  //     // 初级认证,实名认证,绑定银行卡,设置资金密码,修改登录密码,邮箱认证,服务条款,白皮书,多语言
  //     if (key == 'primary') {
  //       // obj['name'] = _this.$t('sidebar_primary')
  //       obj['name'] = _t18('sidebar_primary')
  //       obj['path'] = '/certification-primary'
  //       obj['icon'] = 'chuji'
  //     }
  //     if (key == 'advanced') {
  //       obj['name'] = _t18('sidebar_advanced')
  //       obj['path'] = '/certification-advanced'
  //       obj['icon'] = 'gaoji'
  //     }
  //     if (key == 'bank') {
  //       obj['name'] = _t18('sidebar_bindCard')
  //       obj['path'] = '/bind-card'
  //       obj['icon'] = 'yinhangka'
  //     }
  //     if (key == 'tardPwd') {
  //       obj['name'] = _t18('sidebar_fundPwd')
  //       obj['path'] = '/fund-password'
  //       obj['icon'] = 'zhijinmm'
  //     }
  //     if (key == 'loginPwd') {
  //       obj['name'] = _t18('sidebar_loginPwd')
  //       obj['path'] = '/change-password'
  //       obj['icon'] = 'denglumm'
  //     }
  //     if (key == 'certified') {
  //       obj['name'] = _t18('sidebar_email')
  //       obj['path'] = '/email-authentication'
  //       obj['icon'] = 'youxiang'
  //     }
  //     if (key == 'termsService') {
  //       obj['name'] = _t18('sidebar_service')
  //       obj['path'] = '/term-service'
  //       obj['icon'] = 'fuwu'
  //     }
  //     if (key == 'paper') {
  //       obj['name'] = _t18('sidebar_paper')
  //       // obj['path'] = '/whitepaper'
  //       obj['type'] = 'link'
  //       obj['icon'] = 'baipishu'
  //     }
  //     if (key == 'language') {
  //       obj['name'] = _t18('language_key')
  //       obj['path'] = '/language-selection'
  //       obj['icon'] = 'yuyan'
  //     }
  //     data.push(obj)
  //   }
  // }
  return data
})
onMounted(() => {
  getWhitePaper()
})

/**
 * 获取白皮书URL
 */
/* const getWhitePaper = async () => {
  const res = await noticeList('WHITE_PAPER')
  if (res.code == '200' && res.data.length) {
    paperUrl.value = res.data[0]?.imgUrl || ''
  }
} */
const getWhitePaper = async () => {
  const res = await getWhitePaperUrl()
  if (res.code == '200') {
    paperUrl.value = res.data.url
  }
}
const toView = (item) => {
  if (item.jumpType == 'link' && (item.key == 'paper' || item.key == 'aboutUS')) {
    window.open(paperUrl.value)
  } else if (item.jumpType == 'path') {
    // _toView(item.jumpUrl)
    if (item.key == 'advanced') {
      /**
       * 在实名认证的时候 
        1. 先判断初级认证是否打开  如果是false  就不需要初级认证    直接放行
        2.如果初级认证是true  在判断用户的初级认证状态是否等于1  如果是1 放行
       * 
      */
      const target = listArray.value.find((item) => item.key == 'primary')
      // 判断是否经过初级认证
      if (target && target.isOpen) {
        const auditStatusPrimary = userInfo.value.detail.auditStatusPrimary
        if (auditStatusPrimary && auditStatusPrimary == 1) {
          router.push(item.jumpUrl)
        } else {
          _toast('please_primary')
        }
      } else {
        router.push(item.jumpUrl)
      }
    } else {
      router.push(item.jumpUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  padding: 15px 15px;
  .item {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .itemImg {
      width: 20px;
      height: 20px;
      margin-right: 20px;
    }
    .itemRight {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--ex-default-font-color);
      font-size: 14px;
      .rightImg {
        width: 6px;
        height: 10px;
      }
    }
  }
}
.right_tip {
  display: flex;
  align-items: center;
  span {
    // padding:3px 5px;
    margin-right: 10px;
    // border: 1px solid #17ac74;
    font-size: 12px;
    color: #17ac74;
  }
}
</style>
