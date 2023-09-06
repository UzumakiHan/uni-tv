import dayjs from "dayjs";


import service from "./service";
import type { IDownLinkRes, IPlayList } from '@/types/channel'
import constant from "./constant";

function getLastPath(url: string, slashCount = 3) {
  const parts = url.split('/');
  return '/' + parts.slice(-slashCount).join('/');
}
function extractResolution(str: string) {
  const match = str.match(/_(.*?).m3u8/)
  return match ? match[1] : '720';
}
function getLoginInfo() {
  return new Promise((resolve, reject) => {
    uni.getUserProfile({
      desc: '帮助您成为我们的注册用户',
      success: res => {
        const userInfo = res.userInfo
        resolve(userInfo)
      },
      fail: () => {
        reject('获取用户信息失败');
      }
    })
  })
}

function getWeixinOpenid() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      //成功放回
      success: async (result) => {
        const code = result.code
        const editRes = await service.hanldeGetOpenid(code) as any;
        if (editRes.success_code === 200) {
          const openid = editRes.data.openId
          uni.setStorageSync(constant.STORE_LIVE_OPEN_ID, openid)
          resolve(openid)
        } else {
          resolve('')
        }
      }
    })

  })
}
function showToast(title: string, icon: 'success' | 'error' | 'fail' | 'exception' | 'loading' | 'none'): void {
  uni.showToast({
    title,
    icon,
    mask: true,
    duration: 2000,
  })
}
function handleGetPictureUrl(picPath: string) {
  const sourceIconPath = getLastPath(picPath)
  return new Promise<string>(async (resolve, reject) => {
    const channelIconRes = await service.handleFileDownLink(sourceIconPath) as IDownLinkRes;
    if (channelIconRes && channelIconRes.download_link) {
      resolve(channelIconRes.download_link)
    } else {
      resolve('')
    }
  })


}
function handlePictureMode(picUrl: string) {

  uni.getImageInfo({
    src: picUrl,
    success: (imageRes) => {
      const fixMode = imageRes.width > imageRes.height ? 'widthFix' : 'heightFix'
      return {
        fixMode
      }

    },
    fail: () => {
      console.log('获取图片信息失败');
      return {
        fixMode: 'widthFix'
      }
    }
  })
}
function handleFormatTime(time: string, formatType: string) {
  return dayjs(time).format(formatType);
}
function handleGetSafeArea(){
 
  const systemInfo = uni.getSystemInfoSync() as any
  const tabBarHeight = systemInfo.screenHeight - systemInfo.windowHeight;
  
  return {
    tabBarHeight
  };
}
function handleFormatChannelTime(time: string) {

  const datetime = time.substring(8, 14); // 获取时间部分

  return {
    hour: datetime.substring(0, 2),
    minute: datetime.substring(2, 4)
  }



}



function findTimestamp(list: Array<IPlayList>) {
  const currentTimestamp = handleFormatTime(dayjs().toString(), 'HHmm')
  // 将时间戳数组和当前时间戳转换为数字

  const numTimestamps = list.map(t => Number(t.timeNum));
  const numCurrentTimestamp = Number(currentTimestamp);

  // 遍历时间戳数组
  for (let i = 0; i < numTimestamps.length - 1; i++) {
    // 检查当前时间戳是否在两个连续时间戳之间
    if (numCurrentTimestamp >= numTimestamps[i] && numCurrentTimestamp <= numTimestamps[i + 1]) {
      // 如果是，返回前一个时间戳
      return i
    }
  }

  // 如果没有找到匹配的时间戳，返回null
  return 0;
}
function handlePageScroll(scrollTop: number) {
  uni.pageScrollTo({
    duration: 2000,
    scrollTop
  })
}

function handleNavInfo() {
  let barHeight = 0
  const systemInfo = uni.getSystemInfoSync();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusBarHeight = systemInfo.statusBarHeight as number
  // 获取胶囊按钮位置信息
  //#ifdef MP-WEIXIN
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
  // 获取导航栏高度
   barHeight = menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2 + statusBarHeight;
  //#endif
  // #ifdef H5 || APP
   barHeight = 0
  //#endif
  return {
    statusBarHeight,
    barHeight
  };
}
export default {
  getLastPath,
  extractResolution,
  getWeixinOpenid,
  getLoginInfo,
  showToast,
  handleGetPictureUrl,
  handlePictureMode,
  handleFormatTime,
  handleFormatChannelTime,

  findTimestamp,
  handlePageScroll,
  handleNavInfo,
  handleGetSafeArea
}