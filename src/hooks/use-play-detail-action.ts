import { ref } from 'vue'
import service from '@/common/service'
import type { ISource, IChannelFile, IDownLinkRes, IPlayList } from '@/types/channel'
import util from '@/common/util'
import constant from '@/common/constant'

interface IPlayListDate {
    playDate: string;
    playTime: string
}
function handlePlayList(playList: Array<IPlayList>) {
    const lastList = playList.map((item) => {
        const formatTime = util.handleFormatChannelTime(item.start_date)
        return {
            start_date: `${formatTime.hour}:${formatTime.minute}`,
            title: item.title,
            timeNum: `${formatTime.hour}${formatTime.minute}`,
            isPlay: false
        }
    })
    const resultIndex = util.findTimestamp(lastList)
    if (lastList.length > 0) {
        lastList[resultIndex].isPlay = true

    }


    return {
        lastList,
        activeIndex: resultIndex
    }
}
export const usePlayDetailAction = () => {
    const channelTitle = ref('')
    const isCanPlay = ref(0)

    const channelInfo = ref()
    const sourceList = ref<Array<ISource>>([])
    const currentPlaySource = ref('');//当前播放的源；
    const currentPlayIndex = ref(0)
    const videoRef = ref()
    const videoErrorNum = ref(0)
    const waiting = ref(0)
    const channelPlayList = ref<Array<Array<IPlayList>>>([])
    const playListDate = ref<Array<IPlayListDate>>([])
    const currentDateIndex = ref(0)
    const currentDateTime = ref('')
    const isCurrentToday = ref(false)
    const playActive = ref(0)
    const platChannelTitle = ref('')
    const handleChannelPlayList = function (playList: Array<IPlayList>) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayStr = today.toISOString().slice(0, 10).replace(/-/g, "");
        const tomorrowStr = tomorrow.toISOString().slice(0, 10).replace(/-/g, "");
        const todayEpgList = playList.filter(epg => epg.start_date.slice(0, 8) === todayStr);
        const tomorrowEpgList = playList.filter(epg => epg.start_date.slice(0, 8) === tomorrowStr);
        const todayResult = handlePlayList(todayEpgList)
        const tomorrowResult = handlePlayList(tomorrowEpgList)
        playActive.value = todayResult.activeIndex
        const returnPlayList = [todayResult.lastList, tomorrowResult.lastList]
		if(todayResult.lastList.length>0){
            platChannelTitle.value = todayResult.lastList[playActive.value].title
          
			const  timeOut= setTimeout(() => {
			      clearTimeout(timeOut)
			      util.handlePageScroll(playActive.value * 40)
			
			  }, 1000);
		}
     
        return returnPlayList
    }
    const handleGetChannelInfo = async (channelId: string) => {
        const channelSql = `select * from ${constant.CHANNEL_TABLE_NAME} where channel_id = '${channelId}' `
        const channelSqlRes = await service.handleQueryData(channelSql)
        const channelResult = channelSqlRes.results
        channelTitle.value = channelResult[0].channel_name
        uni.setNavigationBarTitle({
            title: channelTitle.value
        });
        isCanPlay.value = channelResult[0].player || 0
        if (channelResult[0].epg) {
            try {
                const epgList = JSON.parse(channelResult[0].epg)
              
                handleGetPlayList(channelId,epgList.epg_list)
              
            } catch (error) {

            }

        }

        if (channelResult.length > 0 && channelResult[0].channel_file) {
            channelInfo.value = channelResult[0]
            sourceList.value = await Promise.all(channelResult[0].channel_file.map(async (item: IChannelFile) => {
                const sourceFilePath = util.getLastPath(item.url)
                const radioType = util.extractResolution(item.name)
                const sourceFileRes = await service.handleFileDownLink(sourceFilePath) as IDownLinkRes;

                return {
                    radio: radioType,
                    url: sourceFileRes.download_link
                }
            }));
            currentPlaySource.value = sourceList.value[currentPlayIndex.value].url
          
        } else {
            uni.showModal({
                title: '提示',
                content: '当前频道无播放源',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        uni.navigateBack({

                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            });
        }
    }
    const handleChangeSource = (sourceIndex: number) => {
        if (currentPlayIndex.value === sourceIndex) return
        currentPlayIndex.value = sourceIndex
        videoErrorNum.value = 0
        if (!videoRef.value.paused) {
            videoRef.value.pause();
        }
        setTimeout(() => {
            currentPlaySource.value = sourceList.value[currentPlayIndex.value].url
            videoRef.value.play();
        }, 500)

    }

    const handlePlayError = async () => {
        videoErrorNum.value += 1;

        if (videoErrorNum.value === 2) {
            if (!videoRef.value.paused) {
                videoRef.value.pause();
            }
            if (channelInfo.value.channel_file.length > 1) {
                console.log('要切换源了')
                if (!videoRef.value.paused) {
                    videoRef.value.pause();
                }
                channelInfo.value.channel_file.splice(currentPlayIndex.value, 1);
                const updateInfo = {
                    row: {
                        channel_file: channelInfo.value.channel_file,
                    },
                    table_name: `${constant.CHANNEL_TABLE_NAME}`,
                    row_id: channelInfo.value._id
                }
                uni.showLoading({
                    title: '源切换中',
                    mask: true
                });
                const updateRes = await service.handleUpdateRowData(updateInfo)
                if (updateRes && updateRes.success === true) {
                    uni.hideLoading();
                    currentPlayIndex.value += 1;
                    currentPlaySource.value = sourceList.value[currentPlayIndex.value].url
                    videoRef.value.play();
                }
            }

        }
    }
    const handleProgress = () => {
        videoErrorNum.value = 0;
        waiting.value = 0
    }
    const handleWaiting = () => {
        waiting.value += 1;
        if (waiting.value >= 10) {
            waiting.value = 0
            util.showToast('请切换播放源', 'none')


        }
    }
    const handleGetPlayList = async (channelId:string,epgList:Array<IPlayList>) => {
        const today = new Date();
        const todayDate = new Date().toDateString()
        const tomorrow = new Date(today)

        const todayTime = util.handleFormatTime(todayDate, 'YYYYMMDD')
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowTime = util.handleFormatTime(tomorrow.toDateString(), 'YYYYMMDD')
        playListDate.value = [
            {
                playDate: '今天',
                playTime: todayTime
            },
            {
                playDate: '明天',
                playTime: tomorrowTime
            },
        ]
        currentDateTime.value = todayTime
        isCurrentToday.value = currentDateTime.value === todayTime
        // const playListRes = await service.hanldeGetPlayList(todayTime, channelId) as any

        // if (playListRes.epg_list.length > 0) {
        //     channelPlayList.value = handleChannelPlayList(playListRes.epg_list)
        // }
        channelPlayList.value = handleChannelPlayList(epgList)
        
    }
    return {
        channelTitle,
        sourceList,
        playActive,
        platChannelTitle,
        currentDateIndex,
        currentPlaySource,
        currentPlayIndex,
        playListDate,
        channelPlayList,
        videoRef,
        currentDateTime,
        isCurrentToday,
        handleGetChannelInfo,
        handleChangeSource,
        handleProgress,
        handleWaiting,
        handlePlayError
    }
}