<template>
    <view class="w-140rpx flex flex-col items-center mr-38rpx mb-40rpx"
        :key="channelInfo.channel_id" @click="handleGoChannelAction(channelInfo)">
        <image :src="channelInfo.channel_icon_url" class="w-120rpx h-90rpx" />
        <view class="mt-16rpx text-#333333 text-28rpx w-140rpx line-clamp-1 text-center">{{ channelInfo.channel_name }}
        </view>
    </view>
</template>

<script setup lang="ts">
import type { IChannel } from '@/types/channel'

defineProps({
    channelInfo: {
        type: Object<IChannel>,
        default: () => {
            return {}
        }
    }
})
const emits = defineEmits(['handleGoChannel'])
const handleGoChannelAction = (channel: IChannel) => {
    emits('handleGoChannelAction', channel)
}
</script>

<style scoped></style>