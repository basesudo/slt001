<template>
  <div>
    <van-dialog v-model:show="show" title="标题" show-cancel-button @cancel="cancel">
      <p>11111111</p>
      {{ data }}
    </van-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: String
  },
  value: {
    type: Boolean,
    default: false
  },
})
const show = computed(() => props.value)
const emits = defineEmits(['closePopup'])
const cancel=()=>{
    emits('closePopup')
}
</script>

<style lang="scss" scoped></style>
