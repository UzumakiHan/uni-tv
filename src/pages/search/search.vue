<template>
    <view>

        <fullBar title="搜索" @handleSearchAction="handleSearchAction" page-type="search"/>
        <view class="pl-38rpx flex flex-wrap" v-if="searchList.length > 0" :class="[searchListMt]">
            <channelListItem v-for="channel in searchList" :channelInfo="channel" :key="channel.channel_id"
                @handleGoChannelAction="handleGoChannel" />


        </view>
        <view v-else :class="[searchListMt]">
            <view class="mx-auto w-500rpx h-369rpx search-empty" v-if="channelStore.isReview === 2">

            </view>
            <view class="pt-100rpx" v-else>
                <unEmpty mode="list" text="暂无结果" />

            </view>
        </view>

    </view>
</template>

<script setup lang="ts">

import { ref, watch ,onMounted} from 'vue'


import service from '@/common/service'
import { useChannelAction } from '@/hooks/use-channel-action'
import { useChannelStore } from '@/store/index'

import constant from '@/common/constant'
import util from '@/common/util'
import type { IChannel } from '@/types/channel'
import channelListItem from '@/components/channel-list-item/index.vue'

import fullBar from '@/components/fullbar/index.vue'
import unEmpty from '@/components/uvui/uv-empty/components/uv-empty/uv-empty.vue'

const channelStore = useChannelStore();



const { handleGoPlayChannel } = useChannelAction()
const searchListMt = ref('pt-350rpx')

const channelList = ref<Array<IChannel>>([])
const searchList = ref<Array<IChannel>>([])

function handleFuzzySearch(searchTerm: string, dataArray: Array<IChannel>) {
    const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case insensitive
    return dataArray.filter(item => regex.test(item.channel_name));
}
const handleSearch = async () => {
    if (channelStore.isReview === 2) {
        uni.showLoading({
            title: '搜索中',
            mask: true
        });

        if (channelStore.searchKeyWord.trim() === '') {
         
            util.showToast('搜索词不能为空', 'none')

           

            return
        }
     
        const formatList = handleFuzzySearch(channelStore.searchKeyWord, channelList.value)
        let searchListLength = formatList.length

        const allSearchList = await Promise.all(formatList.map(async (channle: IChannel) => {
            searchListLength--;
            if (channle.channel_icon) {
                const channeIconUrl = await util.handleGetPictureUrl(channle.channel_icon[0])

                return {
                    channel_icon_url: channeIconUrl,

                    ...channle
                }
            } else {
                return {
                    channel_icon_url: channelStore.defaultIconUrl,

                    ...channle
                }
            }

        }))
        if (searchListLength === 0) {
            uni.hideLoading();

            searchList.value = allSearchList
        }


    }


}
const handleSearchAction = () => {
   
    handleSearch();
}
const handleGetChannelList = async () => {
    const channelListRes = await service.handleGetTableData(`${constant.CHANNEL_TABLE_NAME}`);
    if (channelListRes.rows.length > 0) {
        channelList.value = channelListRes.rows.map((item: IChannel) => {
            return {
                channel_id: item.channel_id,
                channel_name: item.channel_name || '',
                channel_icon: item.channel_icon
            }
        })

    }
}
async function handleGoChannel(channel: IChannel) {
    const channelSql = `select * from ${constant.CHANNEL_TABLE_NAME} where channel_id = '${channel.channel_id}' `
    const channelSqlRes = await service.handleQueryData(channelSql)
    const channelResult = channelSqlRes.results;

    const channelInfo = {
        channel_icon_url: '',
        ...channel
    }
    if (channelResult.length > 0) {
        if (channelResult[0].channel_icon) {
            const channeIconUrl = await util.handleGetPictureUrl(channelResult[0].channel_icon[0])
            if (channeIconUrl) {
                channelInfo.channel_icon_url = channeIconUrl


            }
        }
        handleGoPlayChannel(channelInfo)
    }
}
watch(
    () => channelStore.searchKeyWord,
    val => {
        if (channelStore.isReview === 2) {
            handleGetChannelList();
        }
        const searchTimeOut = setTimeout(() => {
            clearTimeout(searchTimeOut)
            if (val) {
                handleSearch()
            }
        }, 500);
    },
    { immediate: true }
);
onMounted(() => {
     // #ifdef  H5
     searchListMt.value = 'pt-200rpx'
    //#endif
})


</script>

<style lang="scss" scoped>
.search-result {
    padding-top: 10px;
    padding-bottom: 20px;
    text-align: center;
}

.search-result-text {
    text-align: center;
    font-size: 14px;
    color: #666;
}

.example-body {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    padding: 0px;
}

.uni-mt-10 {
    margin-top: 10px;
}

.search-empty {
    background: url('../../assets/img/search-empty.png') no-repeat top center;
    background-size: 100%;
}
</style>