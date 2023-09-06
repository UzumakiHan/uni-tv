<template>
    <view class="  min-h-100vh my-box">
       <navTitleBar title="我的"/>
        <!-- #ifdef MP-WEIXIN -->
        <view class="flex items-center pt-30rpx px-30rpx" v-if="channelStore.isReview === 2">
            <image :src="userStore.userInfo?.avatarUrl" class="w-130rpx h-130rpx rounded-1/2" />
            <text class="ml-16rpx text-36rpx font-bold text-#333">{{ userStore.userInfo?.username }}</text>
        </view>
        <view class="w-686rpx mt-36rpx mx-auto bg-#fff rounded-16rpx service " v-if="channelStore.isReview === 2">
            <view class=" px-30rpx py-30rpx flex-center-between" @click="handleGoFeedBack">
                <view class="flex items-center">
                    <image :src="feedbackIcon" class="w-44rpx h-44rpx" />
                    <text class="text-#262626 text-32rpx ml-20rpx font-500">功能反馈</text>
                </view>
                <image :src="moreIcon" class="w-24rpx h-24rpx" />
            </view>
        </view>

        <!-- #endif -->
        <view class="pt-60rpx" v-if="channelStore.isReview === 2">
            <view class="text-34rpx text-#262626 px-38rpx">
                <text class="font-bold">我的收藏</text>
                <!-- <text>（长按可移动更改频道排序）</text> -->
            </view>
            <view class="mt-36rpx pl-38rpx flex flex-wrap" v-if="channelStore.channelCollectList.length > 0">
                <channelListItem v-for="channel in channelStore.channelCollectList" :channelInfo="channel"
                    :key="channel.channel_id" @handleGoChannelAction="handleGoPlayChannel" />

            </view>
            <view class="mt-50rpx mx-auto w-375rpx h-267rpx collect-empty" v-else>
          
        </view>

        </view>
       

    </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'


import util from '@/common/util'
import service from '@/common/service'

import { useUserStore } from '@/store/index'
import { useChannelStore } from '@/store/index'
import { useChannelAction } from '@/hooks/use-channel-action'
import { useCollectAction } from '@/hooks/use-collect-action'


import type { IFormatChannel } from '@/types/channel'
import constant from '@/common/constant'

import channelListItem from '@/components/channel-list-item/index.vue'
import navTitleBar from '@/components/nav-title-bar/index.vue'

import moreIcon from '@/assets/img/more.svg';
import feedbackIcon from '@/assets/img/feedback.png';



const userStore = useUserStore()
const channelStore = useChannelStore();
const { handleGoPlayChannel } = useChannelAction()
const { handleCollect } = useCollectAction()



//获取收藏列表
async function handleGetCollectList() {
    uni.showLoading({
        title: '加载中',
        mask: true

    });

    const collectChannelIds = userStore.collectChannelIds.reverse();
    let channelSqlResLength = 0
    const collectList: Array<IFormatChannel | any> = await Promise.all(collectChannelIds.map(async (channelId) => {
        const channelSql = `select * from ${constant.CHANNEL_TABLE_NAME} where channel_id = '${channelId}' `
        const channelSqlRes = await service.handleQueryData(channelSql)
        const channelResult = channelSqlRes.results
        channelSqlResLength = channelResult.length

        if (channelResult.length > 0) {
            channelSqlResLength--

            if (channelResult[0].channel_icon) {

                const channeIconUrl = await util.handleGetPictureUrl(channelResult[0].channel_icon[0])
                const fixMode = util.handlePictureMode(channeIconUrl)
                return {
                    channel_icon_url: channeIconUrl,
                    channel_id: channelId,
                    channel_name: channelResult[0].channel_name,
                    fixMode
                }
            } else {
                return {
                    channel_icon_url: channelStore.defaultIconUrl,
                    channel_id: channelId,
                    channel_name: channelResult[0].channel_name,
                    fixMode: 'widthFix'
                }
            }
        }

    }))
    if (channelSqlResLength === 0) {
        uni.hideLoading();
        channelStore.channelCollectList = collectList.filter(collect => collect !== undefined)
    }



}

function handleGetLocalStoreCollectList() {
    const collectList = uni.getStorageSync('live-collect-list') || [];
    channelStore.channelCollectList = collectList


}
function handleGoFeedBack() {
    uni.navigateTo({
        url: `/pages/feedback/feedback?openid=${userStore.userInfo.openid}`
    })
}
function handleClickAction(index: number, channelId: string) {
    channelStore.channelId = channelId
    uni.showModal({
        title: '提示',
        content: '确定取消该频道吗',
        success: function (res) {
            if (res.confirm) {
                // channelStore.channelCollectList.splice(index,1)
                handleCollect(channelId)
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    });
}




onMounted(() => {
    if (channelStore.isReview === 2) {
        //#ifdef MP-WEIXIN
        handleGetCollectList()
        //#endif
        // #ifndef MP-WEIXIN
        handleGetLocalStoreCollectList()
        //#endif
    }


})


</script>

<style lang="scss" scoped>
.my-box {
    background: #FFFFFF url('../../assets/img/full-bg.png') no-repeat top center;
    background-size: 100%;

    .service {
        box-shadow: 0px 0px 16px 0px #EAECED;
    }
    .collect-empty{
        background: url('../../assets/img/search-empty.png') no-repeat top center;
  background-size: 100%;
    }
}
</style>