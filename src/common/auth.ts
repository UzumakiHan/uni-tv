

/**
 * 微信授权弹出授权请求提示，兼容代码静默调用授权，出现 User TAP Gesture 错误
 * @param notUserTAPGesture 无用户点击行为（即代码静默调用）
 * @param action 微信实际授权逻辑
 */
function handelShowAuthTipsModel(notUserTAPGesture: boolean | undefined, action: () => void) {
    if (notUserTAPGesture) {
        uni.showModal({
            title: '温馨提示',
            content: '为了更好的体验，即将打开授权页面，请您赋予相应的授权',
            confirmText: '去授权',
            cancelText: '取消',
            success: function (_) {
                if (_.confirm) {
                    action();
                } else if (_.cancel) {
                    console.log('用户点击取消');
                    // action();
                }
            }
        });
    } else {
        action();
    }
}

/**
 * 封装微信权限授权
 * @description 微信需要调起权限，支付宝唤起相机自带权限申请弹框，支付宝调用下载图片api也会自动判断权限
 * @param scopeAuthorize  https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/authorize.html
 * @param callBack
 * @param isImmediatelyInvokedAfterAuth   授权后立即执行 callBack
 * @param isNeedShowAuthTipsModel 授权提示弹窗。应用场景：无用户点击行为，代码层面唤起授权时使用。场景举例：未相册授权或上次授权被拒绝，观看完广告视频，用户关闭视频，代码层面自动下载图片
 */
export function handleAuthorize(
    scopeAuthorize: string,
    callBack: () => void,
    isImmediatelyInvokedAfterAuth?: boolean,
    isNeedShowAuthTipsModel?: boolean,
    needShowNotAuth?: () => void
): void {
    uni.getSetting({
        success: res => {
            console.log(res.authSetting[scopeAuthorize])
            if (
                Object.prototype.hasOwnProperty.call(res.authSetting, scopeAuthorize) &&
                !res.authSetting[scopeAuthorize]
            ) {
                if (res.authSetting[scopeAuthorize]) {
                    callBack();
                } else {
                    handelShowAuthTipsModel(isNeedShowAuthTipsModel, () => {
                        if (needShowNotAuth) {
                            // 业务要求，需要走 not-auth 中间页
                            needShowNotAuth();
                        } else {
                            uni.openSetting({
                                success: result => {
                                    if (result.authSetting[scopeAuthorize] && isImmediatelyInvokedAfterAuth) {
                                        callBack();
                                    }
                                }
                            });
                        }
                    });
                }
            } else {
                // 没有用户行为并且没获取过权限才需展示授权提示弹窗： !Object.prototype.hasOwnProperty.call(res.authSetting, scopeAuthorize) && isNeedShowAuthTipsModel
                handelShowAuthTipsModel(
                    !Object.prototype.hasOwnProperty.call(res.authSetting, scopeAuthorize) && isNeedShowAuthTipsModel,
                    () => {
                        try {
                            uni.authorize({
                                scope: scopeAuthorize,
                                success: function () {
                                    callBack();
                                }
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                );
            }
        }
    });
}
