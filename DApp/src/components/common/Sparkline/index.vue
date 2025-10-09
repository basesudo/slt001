<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useTradeStore } from '@/store/trade'
import { getKlineHistory } from '@/api/common/kline'

const props = defineProps({
  symbol: { type: String, required: true },
  height: { type: Number, default: 36 },
  pointsLimit: { type: Number, default: 120 },
  // 是否启用入场动画（缓出）
  animate: { type: Boolean, default: true },
  durationMs: { type: Number, default: 800 },
  // 阴影透明度（0-1），越大越深（调亮默认值）
  shadowAlpha: { type: Number, default: 0.28 }
})

const tradeStore = useTradeStore()
const canvasRef = ref(null)
const prices = ref([])
let resizeObserver = null
let rafId = null
let animationStart = 0
let lastProgress = 0

const pushPrice = (val) => {
  if (typeof val !== 'number' || !isFinite(val)) return
  prices.value.push(val)
  if (prices.value.length > props.pointsLimit) {
    prices.value.splice(0, prices.value.length - props.pointsLimit)
  }
  draw()
}

const fetchHistory = async () => {
  try {
    // 使用更长周期的数据，静态渲染
    let res = await getKlineHistory({ symbol: props.symbol, interval: '5m', size: props.pointsLimit })
    let list = (res && (res.data || res.rows || res.list)) || res || []
    const closes = []
    for (const item of list) {
      // 常见结构: [ts, open, high, low, close, volume]
      let closeV = Array.isArray(item) ? Number(item[4]) : Number(item?.close ?? item?.c)
      if (!isNaN(closeV)) closes.push(closeV)
    }
    // 如果 5m 没数据，尝试 1m
    if (!closes.length) {
      res = await getKlineHistory({ symbol: props.symbol, interval: '1m', size: props.pointsLimit })
      list = (res && (res.data || res.rows || res.list)) || res || []
      for (const item of list) {
        let closeV = Array.isArray(item) ? Number(item[4]) : Number(item?.close ?? item?.c)
        if (!isNaN(closeV)) closes.push(closeV)
      }
    }
    if (closes.length) {
      prices.value = closes.slice(-props.pointsLimit)
      startAnimation()
      return
    }
  } catch (e) {
    // 忽略，等待实时数据逐步填充
  }
  // 回退：本地合成简易序列，确保有静态图
  const base = Number(tradeStore.allCoinPriceInfo[props.symbol]?.close) || 1
  const series = []
  let v = base
  for (let i = 0; i < Math.max(40, Math.min(120, props.pointsLimit)); i++) {
    // 轻微抖动
    const noise = (Math.random() - 0.5) * base * 0.002
    v = Math.max(0.0000001, v + noise)
    series.push(v)
  }
  prices.value = series
  startAnimation()
}

const getColor = () => {
  const info = tradeStore.allCoinPriceInfo[props.symbol] || {}
  const open = Number(info.openPrice || info.open)
  const close = Number(info.close)
  if (isFinite(open) && isFinite(close) && close >= open) {
    return { stroke: '#17ac74', fill: 'rgba(23,172,116,0.18)' }
  }
  return { stroke: '#f6465d', fill: 'rgba(246,70,93,0.18)' }
}

const draw = (progress = 1) => {
  const canvas = canvasRef.value
  if (!canvas || !prices.value.length) return

  const parent = canvas.parentElement
  const dpr = window.devicePixelRatio || 1
  const width = Math.max(1, parent.clientWidth)
  const height = props.height
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const { stroke, fill } = getColor()
  const data = prices.value
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const paddingX = 2
  const paddingTop = 2
  const paddingBottom = 6
  const usableW = width - paddingX * 2
  const usableH = height - paddingTop - paddingBottom
  const stepX = usableW / Math.max(1, data.length - 1)

  // 进度（缓出）
  const p = Math.max(0, Math.min(1, progress))
  lastProgress = p
  const totalSegments = Math.max(1, data.length - 1)
  const exactIndex = p * totalSegments
  const whole = Math.floor(exactIndex)
  const frac = exactIndex - whole

  // 路径
  ctx.lineWidth = 1.5
  ctx.strokeStyle = stroke
  ctx.beginPath()
  const getY = (v) => paddingTop + (1 - (v - min) / range) * usableH
  for (let i = 0; i <= whole && i < data.length; i++) {
    const x = paddingX + i * stepX
    const y = getY(data[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  let lastX = paddingX + whole * stepX
  let lastY = getY(data[Math.min(whole, data.length - 1)])
  if (frac > 0 && whole < data.length - 1) {
    const nextY = getY(data[whole + 1])
    lastX = paddingX + (whole + frac) * stepX
    lastY = lastY + (nextY - lastY) * frac
    ctx.lineTo(lastX, lastY)
  }
  ctx.stroke()

  // 填充渐变阴影
  ctx.lineTo(lastX, height - paddingBottom)
  ctx.lineTo(paddingX, height - paddingBottom)
  ctx.closePath()
  const gradient = ctx.createLinearGradient(0, paddingTop, 0, height)
  // 阴影强度（按方向配色，透明度可调，涨→绿、跌→红）并避免黑色偏色
  const alpha = Math.max(0, Math.min(1, props.shadowAlpha))
  const deepFill = fill.replace(/rgba\((\d+),(\d+),(\d+),(.*?)\)/, `rgba($1,$2,$3,${alpha})`)
  const transparentFill = fill.replace(/rgba\((\d+),(\d+),(\d+),(.*?)\)/, 'rgba($1,$2,$3,0)')
  gradient.addColorStop(0, deepFill)
  gradient.addColorStop(1, transparentFill)
  ctx.fillStyle = gradient
  ctx.fill()
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const startAnimation = () => {
  if (!props.animate) {
    draw(1)
    return
  }
  animationStart = performance.now()
  cancelAnimationFrame(rafId)
  const step = (ts) => {
    const t = Math.min(1, (ts - animationStart) / Math.max(1, props.durationMs))
    const eased = easeOutCubic(t)
    draw(eased)
    if (t < 1) rafId = requestAnimationFrame(step)
  }
  rafId = requestAnimationFrame(step)
}

onMounted(async () => {
  await nextTick()
  fetchHistory()

  // 响应尺寸
  const parent = canvasRef.value?.parentElement
  if (parent && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => draw(lastProgress || 1))
    resizeObserver.observe(parent)
  }
})

onUnmounted(() => {
  resizeObserver && resizeObserver.disconnect()
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
  
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
}
</style>


