<template>
	<view class="min-h-100vh bg-#F8F9FA">
		<view v-if="channelStore.isReview === 2">
			<view class="fixed  left-0 z-10 " ref="videoBoxRef" id="videoBox" :class="[videoBoxTop]">
				<!-- #ifdef H5-->
				<MyVideo :currentPlaySource="currentPlaySource" live :title="channelTitle" v-if="currentPlaySource" />
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN || APP -->

				<video class="w-750rpx h-420rpx" id="videoPlayer" :src="currentPlaySource" initial-time="0"
					:controls="true" :autoplay="true" :show-casting-button="true" :is-live="true"
					@error="handlePlayError" @progress="handleProgress" @waiting="handleWaiting" />

				<!-- #endif -->
				<view class=" pt-28rpx  pb-12rpx bg-#fff -mt-20rpx">
					<view class="text-#262626 text-34rpx font-bold lh-46rpx px-32rpx">{{ platChannelTitle }}</view>
					<view class="mt-20rpx flex flex-wrap pl-32rpx">
						<view class="rounded-32rpx  text-24rpx center w-196rpx h-64rpx mr-20rpx mb-20rpx"
							v-for="(source, index) in sourceList" :key="index" @click="handleChangeSource(index)" :class="[
            index === currentPlayIndex
              ? 'bg-#3177FF bg-opacity-10 text-#3177FF  font-bold'
              : 'bg-#F8F9FB text-#333333'
          ]">源{{ index + 1 }}</view>
					</view>
					<view class="w-full h-16rpx bg-#F8F9FA"></view>
					<view class="pb-32rpx bg-#fff px-32rpx py-32rpx">
						<view class="flex items-center">
							<text class="text-#262626 text-34rpx font-bold">节目表</text>
							<view class="ml-16rpx flex">
								<view class="w-92rpx h-50rpx rounded-21rpx lh-50rpx text-center  text-22rpx mr-12rpx"
									v-for="(item, index) in playListDate" :key="index"
									@click="handleSwitchPlayList(index)" :class="[
		  	     index === currentDateIndex
		  	       ? 'bg-#3177FF  text-#fff'
		  	       : 'bg-#F8F9FB text-#333333'
		  	   ]">{{ item.playDate }}</view>
							</view>

						</view>


					</view>
				</view>



			</view>

			<view class="bg-#fff w-full pb-180rpx" :style="computedPlaybillMt"  v-if="channelPlayList[currentDateIndex] && channelPlayList[currentDateIndex].length >0" >
				<view class=" px-32rpx">
					<view class=" border border-solid border-[#E7EBF1]  rounded-24rpx overflow-hidden">
						<view class="text-#333333 text-28rpx flex play-item"
							v-for="(item, index) in channelPlayList[currentDateIndex]" :key="index">
							<view class="w-156rpx h-80rpx lh-80rpx text-center  play-item-left" :class="[
							  item.isPlay && isCurrentToday
							    ? 'bg-#3F81FF text-#fff '
							    : 'bg-#F5F7FA text-#333'
							]">
								{{ item.start_date }}
							</view>
							<view class="flex-1 lh-80rpx  pl-32rpx pr-32rpx line-clamp-1" :class="[
							  item.isPlay && isCurrentToday
							    ? 'bg-#EAF2FF text-#3177FF'
							    : 'text-#333'
							]">{{ item.title }}</view>
				
						</view>
					</view>
				</view>
			</view>
			<view  v-else class="fixed left-0 right-0" :style="emptyBottom">
			  <unEmpty mode="list" text="暂无节目表" />
			</view>
			
			
			<view class="fixed left-0 right-0 px-88rpx bottom-44rpx flex  items-center justify-center">
				<view class="w-276rpx h-80rpx center  action-btn rounded-44rpx center" @click="handleCollect(channelId)">
					<image class="w-38rpx h-38rpx" :src="
					hasCollected?
					collectActiveIcon
					: 
					collectIcon"
						 />
					<text class="text-#FFFFFF text-30rpx ml-6rpx mb-6rpx">收藏频道</text>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="w-276rpx h-80rpx center action-btn rounded-44rpx ml-20rpx center" @click="maskShow = true">
					<image class="w-38rpx h-38rpx" :src="questionIcon" />
					<text class="text-#FFFFFF text-30rpx ml-6rpx mb-6rpx" >问题反馈</text>
				</view>
				<!-- #endif -->

			</view>
			<feedBackDialog :maskShow="maskShow" :currentPlayIndex="currentPlayIndex" :channelTitle="channelTitle"
				@handleClickOverlay="maskShow = false" />
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue';
	import { onLoad, onReady } from '@dcloudio/uni-app'

	import { usePlayDetailAction } from '@/hooks/use-play-detail-action'
	import { useCollectAction } from '@/hooks/use-collect-action'

	import { useChannelStore } from '@/store/index'
	import util from '@/common/util'
	
	import collectIcon from '@/assets/img/collect.png';
	import collectActiveIcon from '@/assets/img/collect-active.png';
	import questionIcon from '@/assets/img/question.png';
	// #ifdef H5
	import MyVideo from '@/components/myVideo/index.vue'
	//#endif
	import unEmpty from '@/components/uvui/uv-empty/components/uv-empty/uv-empty.vue'


	import feedBackDialog from '@/components/feedback/feedback.vue';

	const channelStore = useChannelStore()

	const { hasCollected,
		handleCollect } = useCollectAction()
	const { channelTitle,
		sourceList,
		currentPlaySource,
		currentPlayIndex,
		videoRef,
		currentDateTime,
		playListDate,
		channelPlayList,
		currentDateIndex,
		isCurrentToday,
		platChannelTitle,
		playActive,
		handleGetChannelInfo, handleChangeSource, handleProgress,
		handleWaiting,
		handlePlayError } = usePlayDetailAction()

	const maskShow = ref(false)
	const videoBoxTop = ref('top-0')
	const playbillMt = ref(750)
	const channelId = ref('')
// const emptyBottom = ref('bottom-400rpx')
	onLoad((options : any) => {
		currentPlaySource.value = ''
		if (options.channelId) {
		 
		  channelId.value = options.channelId
		  channelStore.channelId = channelId.value

		  if (channelStore.isReview === 2) {
		    handleGetChannelInfo(channelId.value)

		  }
		} else {
		  uni.navigateBack({

		  })
		}
		// channelId.value = '13893'
	
		//   channelStore.channelId = channelId.value
		//   handleGetChannelInfo(channelId.value)
		

	})
	onReady(() => {
		// #ifdef H5
		videoBoxTop.value = 'top-88rpx'
		playbillMt.value = 590
		//#endif
		videoRef.value = uni.createVideoContext('myVideo')

	})

	const computedPlaybillMt = computed(() => {
		
		const playbillNum = Math.ceil(sourceList.value.length / 3);
		const mtTop = playbillMt.value + (playbillNum - 1) * 80
		return `padding-top: ${mtTop}rpx`
	})
	const emptyBottom = computed(() => {
		
		const playbillNum = Math.ceil(sourceList.value.length / 3);
		
		const bottom = 400 - (playbillNum - 1) * 70
	
		return `bottom: ${bottom}rpx`
	})



	function handleSwitchPlayList(index : number) {
		currentDateIndex.value = index
		isCurrentToday.value = currentDateTime.value === playListDate.value[index].playTime
		if (index === 0) {
			util.handlePageScroll(playActive.value * 70)
		} else {
			util.handlePageScroll(0)
		}

	}
</script>

<style lang="scss" scoped>
	.play-item {
		border-bottom: 1px solid #E7EBF1;

		&-left {
			border-right: 1px solid #E7EBF1;
		}

		&:last-child {
			border: none;
		}
	}

	.action-btn {
		background: linear-gradient(131deg, #3F81FF 0%, #206CFF 100%);
	}
</style>