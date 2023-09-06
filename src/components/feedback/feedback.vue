<template>
    <view>
        <uv-overlay :show="maskShow" @click="handleClickOverlay">
            <view class="center w-full h-full">
                <view class="bg-#fff w-10/12 px-40rpx py-50rpx rounded-16rpx" @tap.stop>
                    <view class="text-46rpx text-#333 font-bold text-center">问题反馈</view>
                    <view class="mt-20rpx">
                        <uv-radio-group v-model="radiovalue" placement="column">
                            <uv-radio :customStyle="{ margin: '8px' }" v-for="(item, index) in radiolist" :key="index"
                                :label="item.name" :name="item.name">
                            </uv-radio>
                        </uv-radio-group>
                    </view>
                    <view class="mt-20rpx" v-show="showContent">
                        <uv-textarea v-model="content" placeholder="请输入内容"></uv-textarea>
                    </view>
                    <view class="mt-40rpx">
                        <uv-button text="提交" type="primary" :custom-style="buttonStyle"
                            @click="handleSubmitQuestion"></uv-button>
                    </view>
                </view>
            </view>
        </uv-overlay>
    </view>
</template>

<script setup lang="ts">
import { ref ,watch} from 'vue'
import util from '@/common/util'
import { useFeedBackAction } from '@/hooks/use-feedback-action'

import uvOverlay from '@/components/uvui/uv-overlay/components/uv-overlay/uv-overlay.vue';
import uvRadioGroup from '@/components/uvui/uv-radio/components/uv-radio-group/uv-radio-group.vue';
import uvRadio from '@/components/uvui/uv-radio/components/uv-radio/uv-radio.vue';
import uvTextarea from '@/components/uvui/uv-textarea/components/uv-textarea/uv-textarea.vue';
import uvButton from '@/components/uvui/uv-button/components/uv-button/uv-button.vue';
const props = defineProps({
    maskShow: {
        type: Boolean,
        default: false
    },
    currentPlayIndex: {
        type: Number,
        default: 0
    },
    channelTitle: {
        type: String,
        default: ''
    }
})
const emits = defineEmits(['handleClickOverlay']);
const { handleFeedBack } = useFeedBackAction()

const radiolist = [{
    name: '频道无法播放',
    disabled: false
}, {
    name: '频道没有声音',
    disabled: false
}, {
    name: '节目表不正确',
    disabled: false
}, {
    name: '其它',
    disabled: false
}]

const buttonStyle = {
    height: '80rpx',

    borderRadius: '40rpx',//圆角
    // nvue中必须是下方的写法
    'border-top-right-radius': '40rpx',
    'border-bottom-left-radius': '40rpx',
    'border-bottom-right-radius': '40rpx'
}
const radiovalue = ref('')
const showContent = ref(false)
const content = ref('')

function handleClickOverlay() {
    emits('handleClickOverlay')
}
async function handleSubmitQuestion() {
    const submitContent = showContent.value ? content.value : radiovalue.value
    if (!submitContent) {
        util.showToast('问题不能为空', 'none')

    } else {

        const problem = submitContent === '频道没有声音' ? `频道${props.currentPlayIndex + 1}没有声音` : submitContent
        handleFeedBack(problem, props.channelTitle)
        radiovalue.value = '';
        content.value = '';
        handleClickOverlay()
    }
}
watch(radiovalue, (val) => {

    showContent.value = val === '其它' ? true : false
})

</script>

<style scoped></style>