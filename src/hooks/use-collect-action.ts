import {computed} from 'vue'
import { useUserAction } from '@/hooks/use-user-action'
import { useUserStore } from '@/store/index'

import { useChannelStore } from '@/store/index'

import service from '@/common/service';
import util from '@/common/util';
import constant from '@/common/constant'


export const useCollectAction = ()=>{
    const { handleInitUser } = useUserAction()
    const userStore = useUserStore()
    const channelStore = useChannelStore()
    async function handleCollectAction(collectIds: Array<string>, loadingText: string, toastText: string) {
        const collections = collectIds.join(',');
        const updateInfo = {
          row: {
            collections
          },
          table_name: `${constant.USER_TABLE_NAME}`,
          row_id: userStore.userInfo._id
        }
        uni.showLoading({
          title: loadingText,
          mask: true
        });
        const updateRes = await service.handleUpdateRowData(updateInfo)
        if (updateRes && updateRes.success === true) {
          uni.hideLoading();
          util.showToast(toastText,'none')
         
          handleInitUser();
        }
      }
      async function handleCollect(channelId:string) {
        if (hasCollected.value) {
          let newCollectedIds = [] as Array<string>;
          newCollectedIds = newCollectedIds.concat(userStore.collectChannelIds)
          const cancelIndex = userStore.collectChannelIds.findIndex(item => item === channelId)
          newCollectedIds.splice(cancelIndex, 1);
          userStore.collectChannelIds.splice(cancelIndex,1)
          //#ifdef MP-WEIXIN
          handleCollectAction(newCollectedIds, '取消中', '取消收藏成功')
          //#endif
          channelStore.handleChangeChannelList(1)
      
      
        } else {
          let newCollectedIds = [] as Array<string>;
          newCollectedIds = newCollectedIds.concat(userStore.collectChannelIds)
          newCollectedIds.push(channelId)
          //#ifdef MP-WEIXIN
          handleCollectAction(newCollectedIds, '收藏中', '收藏成功')
          //#endif
          channelStore.handleChangeChannelList(2)
      
      
        }
      }
      const hasCollected = computed(() => {
        let collectChannelIds = userStore.collectChannelIds
        // #ifndef MP-WEIXIN
        collectChannelIds = channelStore.channelCollectList.map(channel=>channel.channel_id)
        //#endif
        const collectResult = collectChannelIds.filter(item => item ===  channelStore.channelId)
        return collectResult.length > 0
      })
      return{
        hasCollected,
        handleCollect
      }
      
}