<template>
    <view class="min-h-100vh w-full bg-#F2F3F5" v-if="channelStore.isReview===2">
        <view class="px-32rpx py-36rpx" v-if="feedBackList.length > 0">
            <view v-for="feedback in feedBackList" :key="feedback._id">
                <view v-if="feedback.problem">
                    <view class="flex items-center justify-start">
                        <image :src="channelStore.defaultfeedBackAvatar" class="w-60rpx h-60rpx rounded-1/2 " />
                        <view
                            class="bg-#FFFFFF px-24rpx py-20rpx rounded-20rpx text-#333 text-32rpx ml-20rpx chatboxleft relative lh-42rpx max-w-500rpx">
                            {{ feedback.problem }}</view>
                    </view>
                    <view
                        class=" bg-dark-50 bg-opacity-20 rounded-12rpx px-10rpx py-6rpx text-#fff text-24rpx w-240rpx mt-20rpx mx-auto mb-20rpx">
                       {{feedback.creatime}}</view>
                </view>


                <view v-if="feedback.answer">
                    <view class="flex items-center mt-20rpx justify-end">
                        <view
                            class="bg-#206CFF px-24rpx py-20rpx rounded-20rpx text-#fff text-32rpx mr-20rpx  chatboxright relative lh-42rpx max-w-500rpx">
                            {{ feedback.answer }}</view>
                        <image :src="channelStore.defaultfeedBackServiceAvatar" class="w-60rpx h-60rpx rounded-1/2" />

                    </view>
                    <view
                        class=" bg-dark-50 bg-opacity-20 rounded-12rpx px-10rpx py-6rpx text-#fff text-24rpx w-240rpx mt-20rpx mx-auto mb-20rpx">
                       {{ feedback.answertime }}</view>
                </view>

            </view>
        </view>
        <view class="pt-100rpx" v-else>
            <unEmpty mode="list" text="你还没有反馈过问题呢" />

        </view>
        <view class="fixed z-40 bottom-400rpx right-60rpx">

            <view class="w-100rpx h-100rpx rounded-1/2 bg-#fff center">
                <image :src="feedbackIcon" class="w-60rpx h-60rpx" @click="maskShow = true" />
            </view>


        </view>
        <uv-overlay :show="maskShow" @click="maskShow = false">
      <view class="center w-full h-full">
        <view class="bg-#fff w-10/12 px-40rpx py-50rpx rounded-16rpx" @tap.stop>
          <view class="text-46rpx text-#333 font-bold text-center">问题反馈</view>
          <view class="mt-20rpx" >
            <uv-textarea v-model="content" placeholder="请输入内容"></uv-textarea>
          </view>
          <view class="mt-40rpx">
            <uv-button text="提交" type="primary" :custom-style="buttonStyle" @click="handleSubmitQuestion"></uv-button>
          </view>
        </view>
      </view>
    </uv-overlay>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app'
import { useChannelStore } from '@/store/index'
import type { IFeedBack } from '@/types/feedback'
import {useFeedBackAction} from '@/hooks/use-feedback-action'
import constant from '@/common/constant'

import service from '@/common/service'
import util from '@/common/util'
import unEmpty from '@/components/uvui/uv-empty/components/uv-empty/uv-empty.vue'
import uvOverlay from '@/components/uvui/uv-overlay/components/uv-overlay/uv-overlay.vue';
import uvTextarea from '@/components/uvui/uv-textarea/components/uv-textarea/uv-textarea.vue';
import uvButton from '@/components/uvui/uv-button/components/uv-button/uv-button.vue';
import feedbackIcon from '@/assets/img/feedback.png';
const buttonStyle = {
  height: '80rpx',
  'background-color': '#206CFF',
  borderRadius: '40rpx',//圆角
  // nvue中必须是下方的写法
  'border-top-right-radius': '40rpx',
  'border-bottom-left-radius': '40rpx',
  'border-bottom-right-radius': '40rpx'
}
const maskShow = ref(false)
const content = ref('')

const feedBackList = ref<Array<IFeedBack>>([]);
const channelStore = useChannelStore();

const {handleFeedBack} =useFeedBackAction()

async function handleInitChatList(openid: string) {
    const feedbackSql = `select * from ${constant.FEEDBACK_TABLE_NAME} where openid = '${openid}' `
    const feedBackRes = await service.handleQueryData(feedbackSql)
    const feedBackResult = feedBackRes.results;
    if (feedBackResult.length > 0) {
        // feedBackList.value = feedBackResult
        // feedBackList.value = feedBackList.value.reverse()
        feedBackList.value =  feedBackResult.map((feedBack:IFeedBack)=>{
            // util.handleFormatTime(feedback.creatime, 'YYYY-MM-DD HH:mm:ss') }}
            const {answer,creatime,answertime,problem} = feedBack;
            return{
                answer,
                creatime:util.handleFormatTime(creatime, 'YYYY-MM-DD HH:mm:ss'),
                answertime:util.handleFormatTime(answertime, 'YYYY-MM-DD HH:mm:ss'),
                problem:problem,
               
                
            }
        })
        feedBackList.value =  feedBackList.value.reverse();
    }
}
async function handleSubmitQuestion(){
    if(!content.value){
    util.showToast('问题不能为空','none')
    return;

    }
    handleFeedBack(content.value);
    maskShow.value = false;
    const feedBackInfo = {
        answer:'',
        creatime:util.handleFormatTime(new Date().toDateString(), 'YYYY-MM-DD HH:mm:ss'),
        problem:content.value,
        answertime:''
    }
    feedBackList.value .unshift(feedBackInfo)
}

onLoad((options: any) => {
    const openid = options.openid
    // const openid = 'oocmH66lfo-O5bzt9eduGwbXEjxk'
    if(channelStore.isReview === 2){
        handleInitChatList(openid)
    }

   
})
</script>

<style lang="scss" scoped>
.chatboxleft {
    &:before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: -28rpx;
        border-width: 16rpx;
        border-style: solid;
        border-color: transparent #fff transparent transparent;
    }
}

.chatboxright {
    &:after {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -28rpx;
        border-width: 16rpx;
        border-style: solid;
        border-color: transparent transparent transparent #206CFF;
    }

}
</style>