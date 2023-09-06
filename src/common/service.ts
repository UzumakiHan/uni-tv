import Service from '@/common/request'
import constant from '@/common/constant'
import type { IAccess } from '@/types/access'
const BASE_URL = process.env.NODE_ENV === 'production' ? `${constant.SERVICE_HOST}` : '/player'
async function handleGetBaseAccessToken() {
    const result = uni.getSystemInfoSync();
    const accessTokenUrl = `${constant.SERVICE_HOST}${constant.ACCESS_TOKEN_API}`
    const url = result.uniPlatform === 'web' ? `${BASE_URL}${constant.ACCESS_TOKEN_API}` : accessTokenUrl
    return new Promise(async (resolve, reject) => {
        uni.request({
            url,
            method: 'GET',
            header: {
                'Authorization': 'Token ' + constant.TABLE_API_TOKEN
            },
            success: function (res) {
                uni.setStorageSync('live-access',res.data)
                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}

//获取表格数据
async function handleGetTableData(tableName: string) {

    const storeAccess = uni.getStorageSync('live-access');
   
    const accessRes = storeAccess ?storeAccess:await handleGetBaseAccessToken() as IAccess
    const { dtable_uuid } = accessRes

    return Service.request(`api/v1/dtables/${dtable_uuid}/rows/`, 'GET', {
        table_name: tableName,
    })

}
//获取上传文件或者图片
async function handleFileDownLink(filePath: string) {
    const result = uni.getSystemInfoSync();
    const linkApi = `${constant.SERVICE_HOST}${constant.DOWNLOAD_LINK_API}?path=${filePath}`
    const url = result.uniPlatform === 'web' ? `${BASE_URL}${constant.DOWNLOAD_LINK_API}?path=${filePath}` :linkApi 
    return new Promise(async (resolve, reject) => {
        uni.request({
            url,
            method: 'GET',
            header: {
                'Authorization': 'Token ' + constant.TABLE_API_TOKEN
            },
            success: function (res) {
              
                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}
//查询query
async function handleQueryData(sql: string) {
    const storeAccess = uni.getStorageSync('live-access');
   
    const accessRes = storeAccess ?storeAccess:await handleGetBaseAccessToken() as IAccess
   
    const { dtable_uuid } = accessRes
   
    return Service.request(`api/v1/query/${dtable_uuid}/`, 'POST', {
        sql,
        convert_keys: true
    }, true)
}
//更新表格数据
async function handleUpdateRowData(rowData:unknown){
    const storeAccess = uni.getStorageSync('live-access');
   
    const accessRes = storeAccess ?storeAccess:await handleGetBaseAccessToken() as IAccess
    const { dtable_uuid } = accessRes
    return Service.request(`api/v1/dtables/${dtable_uuid}/rows/`,'PUT',rowData)

}
//插入数据
async function handleAddRowData(rowData:unknown){
    const storeAccess = uni.getStorageSync('live-access');
   
    const accessRes = storeAccess ?storeAccess:await handleGetBaseAccessToken() as IAccess
    const { dtable_uuid } = accessRes
    return Service.request(`api/v1/dtables/${dtable_uuid}/batch-append-rows/`,'POST',rowData)

}

//获取openid
async function hanldeGetOpenid(code:string){
    return new Promise((resolve, reject) => {
        uni.request({
            url:'https://live.bitleo.cn/getopenid',
            method: 'POST',
            data:{
                code
            },
            success: function (res) {

                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}
//获取节目表
async function hanldeGetPlayList(today:string,channelId:string){
    return new Promise((resolve, reject) => {
        uni.request({
            url:`https://epg.pw/api/epg.json?lang=zh-hans&date=${today}&channel_id=${channelId}&timezone=QXNpYS9TaGFuZ2hhaQ==`,
            method: 'GET',
            success: function (res) {

                resolve(res.data);
            },
            fail: function (err) {
                reject(err);
            }
        });
    })
}
export default {
    handleGetBaseAccessToken,
    handleGetTableData,
    handleFileDownLink,
    handleQueryData,
    handleUpdateRowData,
    hanldeGetOpenid,
    handleAddRowData,
    hanldeGetPlayList
}