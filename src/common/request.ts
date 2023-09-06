// request.ts

import service from '@/common/service'
import type { IAccess } from '@/types/access'

async function request(url: string, method: 'GET' | 'POST' |'PUT', data: any, isQuery = false): Promise<any> {
    const storeAccess = uni.getStorageSync('live-access');
   
    const accessRes = storeAccess ?storeAccess:await service.handleGetBaseAccessToken() as IAccess
    const { access_token, dtable_server, dtable_db } = accessRes
    const BASE_HOST_URL = isQuery ? dtable_db : dtable_server
    const PROXY_HOST_URL = isQuery ? '/player/dtable-db/' : '/player/dtable-server/'
    const result = uni.getSystemInfoSync();
    const BASE_URL = process.env.NODE_ENV === 'production' ? BASE_HOST_URL : PROXY_HOST_URL
    const apiUrl = result.uniPlatform === 'web' ?`${BASE_URL}${url}`: `${BASE_HOST_URL}${url}` 
    return new Promise((resolve, reject) => {
        uni.request({
            url: apiUrl,
            method: method,
            data: data,
            header: {
                Authorization: `Token ${access_token}`
            },
            success: (res) => {
                // 这一步是对服务器端返回的数据进行处理，可以根据你的业务需求进行修改
                resolve(res.data)

            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
export default {
    request
}
