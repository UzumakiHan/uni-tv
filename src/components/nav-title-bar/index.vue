<template>
    <!-- #ifdef MP-WEIXIN -->
    <view class="text-#000000 text-36rpx font-bold text-center center"
        :style="{ height: barH + 'rpx', paddingTop: statusHeight + 'px' }">{{ title }}</view>
    <!-- #endif -->
    <!-- #ifdef APP -->
    <view class="text-#000000 text-36rpx font-bold text-center center" :style="{ paddingTop: statusHeight + 'px' }">
        {{ title }}
    </view>
    <!-- #endif -->
</template>

<script setup lang="ts">
import { useNavAction } from '@/hooks/use-nav-action'

const { barH, statusHeight } = useNavAction()

defineProps({
    title: {
        type: String,
        default: '在线看电视'
    }
})
</script>

<style scoped></style>