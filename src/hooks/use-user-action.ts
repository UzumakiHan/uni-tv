
import service from '@/common/service'
import util from '@/common/util'
import type { IWxUser } from '@/types/user'
import {useUserStore} from '@/store/index'
import constant from '@/common/constant'

export const useUserAction=()=>{

    const userStore = useUserStore()
    function handleGetUserInfo(openid: string) {
        return new Promise(async (resolve, reject) => {
            const findSql = `select * from ${constant.USER_TABLE_NAME} where openid = '${openid}' `
            const findUserRes = await service.handleQueryData(findSql)
            if (findUserRes.results.length > 0) {
                userStore.userInfo = findUserRes.results[0]
               let collectChannelIds = findUserRes.results[0].collections;
               if(collectChannelIds){
                userStore.collectChannelIds = collectChannelIds.split(',')
               }else{
                userStore.collectChannelIds = []
               }
              
                resolve(1)
            }else{
                resolve(2)
            }
        })
    
    
    }
    function handleUser() {
        uni.getUserInfo({
            success: async function (res) {
                
                const userInfo = res.userInfo as unknown
                const { nickName, city, country, province, gender, avatarUrl } = userInfo as IWxUser
    
                const openidRes = await util.getWeixinOpenid() as string
                if (openidRes) {
                    const userRes = await handleGetUserInfo(openidRes)
                 
                    if (userRes === 1) {
                        await handleGetUserInfo(openidRes)
                    
                    } else {
                        const rowData = {
                            rows: [
                                {
                                    openid: openidRes,
                                    username: nickName,
                                    city,
                                    country,
                                    province,
                                    gender: gender === 0 ? '男' : '女',
                                    avatarUrl,
                                    collections:''
                                }
                            ],
                            table_name: `${constant.USER_TABLE_NAME}`
    
    
                        }
                        const addRes = await service.handleAddRowData(rowData)
                        if(addRes){
                            await handleGetUserInfo(openidRes)
                        }
                    }
    
                }
    
    
    
            }
        })
    }
    async function handleInitUser() {
        const storeOpenId = uni.getStorageSync('live-openid') || null
    
        if (!storeOpenId) {
            uni.getSetting({
                success: async function (res) {
                    if (!res.authSetting['scope.userInfo']) {
                        uni.authorize({
                            scope: 'scope.userInfo',
                            async success() {
                                // 用户已经同意小程序使用用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                                handleUser()
                            }
                        })
                    } else {
                        handleUser()
    
                    }
                }
            })
        } else {
            const userRes = await handleGetUserInfo(storeOpenId)
            if(userRes === 2){
                uni.removeStorage({
                    key: constant.STORE_LIVE_OPEN_ID,
                    success: function (res) {
                        handleInitUser()
                    }
                });
    
    
            }
    
        }
    }
   
    return{
        handleInitUser,
        
    }
}