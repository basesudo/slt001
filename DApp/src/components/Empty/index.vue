<script setup>
import { _t18 } from '@/utils/public'
</script>
<template>
    <div>
        <image-load filePath="defi/nodata.png" name="nodata" class="empty"></image-load>
        <!-- 暂无数据 -->
        <p>{{ _t18('no_data') }}</p>
    </div>
</template>
<style lang="scss" scoped>
    div{
        margin:20px auto 50px;
        text-align: center;
        .empty{
            font-size: 200px;
        }
        p{
            margin-top: 10px;
            color: var(--ex-passive-font-color);
            font-size: 16px;
        }
    }
</style>