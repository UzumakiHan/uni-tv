import { ref, onMounted, computed } from 'vue'
import { useUserAction } from '@/hooks/use-user-action'

import type { IClassifyList, IClassify, IChannel, IChannelList } from '@/types/channel'
import service from '@/common/service'
import util from '@/common/util'
import { useChannelStore } from '@/store/index'
import constant from '@/common/constant'


export const useChannelAction = () => {
    const channelStore = useChannelStore()
    const { handleInitUser } = useUserAction()
    const channelClassifyList = ref<Array<IClassifyList>>([]);
    const channelTabList = ref<Array<IClassify>>([])
    const isComplete = ref(false)
    const isReview = ref(1)
    const indexTitle = ref('云端电视')
    const currentVal = ref(0)
    const chain = ref(false)
    const handleGetChannelClassifyList = async () => {
        const classifyListRes = await service.handleGetTableData(`${constant.CLASSIFY_TABLE_NAME}`);
        const classifyListResRows = classifyListRes.rows


        if (classifyListResRows.length > 0) {
            channelTabList.value = classifyListResRows
            channelTabList.value = channelTabList.value.sort((a, b) => Number(a.sort) - Number(b.sort))
            channelClassifyList.value = channelTabList.value.map((channel: IClassify) => {
                return {
                    name: channel.classify,
                    childrens: []
                }

            })
            handleInitList(channelClassifyList.value[0].name, currentVal.value)

        }
    }

    const handleInitList = async (classify: string, currentIndex: number) => {

        uni.showLoading({
            title: '加载中',
            mask: true

        });
        const channelSql = `select * from ${constant.CHANNEL_TABLE_NAME} where classify = '${classify}' `;
        const channelSqlRes = await service.handleQueryData(channelSql)
        let channelSqlResLength = channelSqlRes.results.length
        if (channelSqlRes.results.length > 0) {
            const formatList = await Promise.all(channelSqlRes.results.map(async (item: IChannel) => {
                channelSqlResLength--
                if (item.channel_icon) {
                    const channeIconUrl = await util.handleGetPictureUrl(item.channel_icon[0])
                    const fixMode = util.handlePictureMode(channeIconUrl)
                    return {
                        channel_icon_url: channeIconUrl,
                        fixMode,
                        ...item
                    }
                } else {
                    return {
                        channel_icon_url: channelStore.defaultIconUrl,
                        fixMode: 'widthFix',
                        ...item
                    }
                }

            }));
            if (channelSqlResLength === 0) {

                channelClassifyList.value[currentIndex].childrens = formatList
                uni.hideLoading();
                // #ifdef H5 || APP
                isComplete.value = true
                //#endif

            }

        } else {
            uni.hideLoading();
            // #ifdef H5 || APP
            isComplete.value = true
            //#endif
        }




    }
    const handleGetReview = async () => {
        uni.showLoading({
            title: '加载中',
            mask: true
        });
        const result = await service.handleGetTableData(`${constant.REVIEW_TABLE_NAME}`);
        if (result.rows) {
            uni.hideLoading();
            isReview.value = process.env.NODE_ENV === 'production' ? Number(result.rows[0].review) : Number(result.rows[0].dev_review)
          

            isComplete.value = true
            const channeIconUrl = await util.handleGetPictureUrl(result.rows[0].defaul_icon[0]);
            const defaultfeedBackAvatar = await util.handleGetPictureUrl(result.rows[0].default_user_avatar[0]);
            const defaultfeedBackServiceAvatar = await util.handleGetPictureUrl(result.rows[0].default_service_avatar[0]);


            channelStore.defaultIconUrl = channeIconUrl;
            channelStore.defaultfeedBackAvatar = defaultfeedBackAvatar;
            channelStore.defaultfeedBackServiceAvatar = defaultfeedBackServiceAvatar;

            channelStore.isReview = isReview.value
            // channelStore.channelEmptyDesc = isReview.value === 2 ? '暂无收藏频道' : '暂无收藏课程'
        }
        indexTitle.value = isReview.value === 2 ? '在线看电视' : '云端电视'
        if (isReview.value === 2) {
            //#ifdef MP-WEIXIN
            handleInitUser()
            //#endif
            handleGetChannelClassifyList()
            uni.showTabBar()
        }

        uni.setNavigationBarTitle({
            title: indexTitle.value
        });

    }
    const activeList = computed(() => {
        const _list = channelClassifyList.value[currentVal.value]?.childrens.filter(item => Number(item.state) === 1)
        return _list ? _list : [];
    })

    const handleTabChange = (index: number) => {
        currentVal.value = index
        if (channelClassifyList.value[index].childrens.length === 0) {
            handleInitList(channelClassifyList.value[index].name, index)
        }

    }
    const handleGoPlayChannel = (channel: IChannelList | any) => {
        const { channel_id, channel_name, channel_icon_url, fixMode } = channel
        if (channel_id) {
            channelStore.currentChannel = {
                channel_id,
                channel_name,
                channel_icon_url,
                fixMode
            }
            uni.navigateTo({
                url: `/pages/player/player?channelId=${channel.channel_id}`
            })
        } else {
            util.showToast('频道ID无效', 'none')

        }

    }
    const handleAPPAndH5 = () => {
        isReview.value = 2
        channelStore.isReview = isReview.value
        uni.setNavigationBarTitle({
            title: '在线看电视'
        });
        handleGetChannelClassifyList()
        uni.showTabBar()
    }
    onMounted(() => {
        // handleGetChannelClassifyList()
       
    })
    return {
        isReview,
        chain,
        indexTitle,
        isComplete,
        channelClassifyList,
        activeList,
        handleTabChange,
        handleGoPlayChannel,
        handleGetReview,
        handleAPPAndH5,
        handleGetChannelClassifyList
    }
}