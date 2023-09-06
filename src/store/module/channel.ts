import { defineStore } from 'pinia';

import type { IFormatChannel } from '@/types/channel'
import util from '@/common/util';


export const useChannelStore = defineStore({
    id: 'channel',
    state: () => ({
        channelId: '',
        channelCollectList: [] as Array<IFormatChannel>,
        currentChannel: {} as IFormatChannel,
        defaultIconUrl: '',
        isReview: 1,
        defaultfeedBackAvatar:'',
        defaultfeedBackServiceAvatar:'',
        channelEmptyDesc:'暂无收藏频道',
        searchKeyWord:''
    }),
    actions: {
        handleChangeChannelList(type: number) {

            if (type === 1) {
                // #ifndef MP-WEIXIN
                uni.showLoading({
                    title: '取消中',
                    mask: true
                });
                //#endif
                //取消
                const cancelIndex = this.channelCollectList.findIndex(item => item.channel_id === this.channelId)
                if (cancelIndex !== -1) {
                    this.channelCollectList.splice(cancelIndex, 1);
                }
                // #ifndef MP-WEIXIN
                util.showToast('取消收藏成功', 'none')
                //#endif

            } else {
                // #ifndef MP-WEIXIN
                uni.showLoading({
                    title: '收藏中',
                    mask: true
                });
                //#endif
                //新增
                this.channelCollectList.unshift(this.currentChannel)
                // #ifndef MP-WEIXIN
                util.showToast('收藏成功', 'none')

                //#endif
            }
            // #ifndef MP-WEIXIN
            uni.setStorageSync('live-collect-list', this.channelCollectList)

            //#endif
        }
    }

})