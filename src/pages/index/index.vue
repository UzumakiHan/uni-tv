<template>
  <view class="index min-h-100vh">
    <view v-if="isReview === 2" class="flex flex-col">
      <fullBar />
      <view :class=[channelMt] class="flex-1 overflow-y-scroll">


        <uv-vtabs :chain="chain" :list="channelClassifyList" @change="handleTabChange" v-if="isReview === 2">
          <uv-vtabs-item v-if="activeList.length > 0">
            <view class="pl-20rpx pt-20rpx pb-30rpx" v-for="(item2, index2) in activeList" :key="index2">
              <view class="flex items-center py-30rpx pl-30rpx">

                <view class="text-26rpx text-#000 font-500 text-center center" @click="handleGoPlayChannel(item2)">
                  <view class="w-100rpx h-60rpx center mr-16rpx">
                    <image :src="item2.channel_icon_url" class="w-full h-full" :mode="item2.fixMode" />
                  </view>
                  <text>{{ item2.channel_name }}</text>

                </view>
              </view>

            </view>

          </uv-vtabs-item>
          <view class="pt-500rpx center" v-else>

            <!-- <unEmpty mode="list" text="频道暂未开放" /> -->
            <view class="channel-empty w-375rpx h-277rpx"></view>
          </view>
        </uv-vtabs>
      </view>
    </view>
    <xueTang v-else />

  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useChannelAction } from '@/hooks/use-channel-action'


import service from '@/common/service'


import uvVtabs from '@/components/uvui/uv-vtabs/components/uv-vtabs/uv-vtabs.vue'
import uvVtabsItem from '@/components/uvui/uv-vtabs/components/uv-vtabs-item/uv-vtabs-item.vue'

import xueTang from '@/components/xueTang/index.vue'

import fullBar from '@/components/fullbar/index.vue'



const channelMt = ref('mt-0rpx')

const { indexTitle, chain, isReview, channelClassifyList, activeList, handleTabChange, handleGoPlayChannel, handleGetReview, handleAPPAndH5 } = useChannelAction()
//#ifdef MP-WEIXIN
onShareAppMessage(() => {
  return {
    title: indexTitle.value,
    path: '/pages/index/index'
  }
})

//#endif
onMounted(async () => {
  await service.handleGetBaseAccessToken()
  //#ifdef MP-WEIXIN
  handleGetReview();
  //#endif
  // #ifdef H5 || APP
  handleAPPAndH5()
  //#endif

  // #ifdef H5
  channelMt.value = 'mt-200rpx'
  //#endif

})
watch(activeList, (val) => {
  if (val.length === 0) {
    channelMt.value = 'mt-0'

  } else {
    // #ifdef H5
    channelMt.value = 'mt-200rpx'
    //#endif
    //#ifdef MP-WEIXIN || APP
    channelMt.value = 'mt-380rpx'
    //#endif
  }
})

</script>

<style lang="scss" scoped>
.channel-empty {
  background: url('../../assets/img/search-empty.png') no-repeat top center;
  background-size: 100%;
}
</style>