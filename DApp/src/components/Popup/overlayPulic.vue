<template>
  <van-overlay :show="props.show" :z-index="99">
    <div class="countdown">
      <slot name="contentCustomize"></slot>
    </div>
  </van-overlay>
</template>
<script setup>
let props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
let emit = defineEmits(['handelClose'])
const handelClose = () => {
  emit('handelClose', false)
}
</script>
<style lang="scss" scoped>
.countdown {
  max-width: var(--ex-max-width);
  border-radius: 10px 10px 10px 10px;
  background-color:var(--ex-default-background-color);
  position: absolute;
  top: 50%;
  width: 92%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 20px;
}
</style>
