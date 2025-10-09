# 头部组件 （非必要不动，做好向下兼容）

# 1.import HeaderBar from '@/components/HeaderBar/index.vue'

# 2.可以传两个参数：{

    backwardNum：Number;    //后退层数，默认 -1
    currentName：String;    //左侧文案， 非必填
    cuttentRight：Object{   //右侧文案， 非必填
      name: '112',  //string 文案 默认字体14px  颜色#17AC74
      icon: new URL('@/assets/home/zhiya.svg', import.meta.url).href   //默认图片尺寸 24*24
    },
    bgColor: String  //默认底层色白色  #fff
    isCenter：Boolean  // 默认不居中 false

}

### <HeaderBar :currentName="`添加自选`" :cuttentRight="cuttentRight" @linkTo="linkTo"> </HeaderBar>

# 3.暴露的方法 linkTo 用于进行页面扩展

# 4.扩展 通过插槽进行自定义右侧组件

# 1.<template #footer> xxxxx </template>

# author： lll
