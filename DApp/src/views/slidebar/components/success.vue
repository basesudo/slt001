<script setup>
const props = defineProps({
  imgUrl: { type: String, default: '' },
  text: { type: String, default: '' },
  color: { type: String, default: '#838B9C' }
})
</script>

<template>
  <div class="content">
    <image-load :filePath="props.imgUrl" name="defi"></image-load>
    <div class="text">{{ props.text }}</div>
    <slot name="btn"></slot>
  </div>
</template>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 120px;
    height: 110px;
    margin-bottom: 35px;
  }
  .text {
    font-size: 18px;
  }
}
</style>
