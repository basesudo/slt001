<!-- 弹窗 -->
<template>
  <van-dialog
    v-model:show="show"
    :title="props.title"
    show-cancel-button
    @cancel="cancelBtn"
    @confirm="confirmBtn"
  >
    <div v-if="props.content" class="dialog-content" v-html="props.content"></div>
    <slot name="content"></slot>
  </van-dialog>
</template>

<script setup>
const emits = defineEmits(['update:value', 'confirmBtn', 'cancelBtn'])

const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})

const show = computed(() => props.value)

const confirmBtn = () => {
  emits('update:value', false)
  emits('confirmBtn')
}
const cancelBtn = () => {
  emits('update:value', false)
  emits('cancelBtn')
}
</script>

<style lang="scss">
.dialog-content {
  min-height: 100px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ex-default-background-color);
}
:deep(.van-button:before) {
  background-color: none;
}
.van-dialog {
  width: 80%;
  background: var(--ex-default-background-color);
}
.van-button--default {
  min-height: 45px;
  background: var(--ex-default-background-color);
  color: var(--ex-default-font-color);
}
</style>
