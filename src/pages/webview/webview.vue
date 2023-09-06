<template>
    <view class="webview">
        <web-view :src="url" />
    </view>
</template>

<script>
import constant from '@/common/constant'

export default {
    data() {
        return {
            url: ''
        };
    },
    onLoad(options) {
        this.url = decodeURIComponent(options.url || '');
        this.url  = `${constant.PLAY_LIVE_HOST}?vurl=${this.url}`;
        console.log(this.url);
    }
};
</script>
