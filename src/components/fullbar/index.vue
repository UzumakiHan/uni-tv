<template>
    <view class="w-750rpx full-bg fixed top-0 left-0 z-10 " :class="[fullbarH]">
       <navTitleBar :title="title"/>
        <view class="px-33rpx mt-24px" v-if="showSearch">
            <uv-search placeholder="搜索频道" bgColor="#fff" :inputStyle="inputStyle" searchIconSize="40"
                placeholderColor="#777777" height="80rpx" v-model="searchVal" :actionStyle="actionStyle"
                @search="handleSearchAction" @custom="handleSearchAction"></uv-search>
        </view>


    </view>
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue'

import util from '@/common/util'
import { useChannelStore } from '@/store/index'
import navTitleBar from '@/components/nav-title-bar/index.vue'
import uvSearch from '@/components/uvui/uv-search/components/uv-search/uv-search.vue'
const fullbarH = ref('h-418rpx')
const channelStore = useChannelStore();
const searchVal = ref(channelStore.searchKeyWord)
const actionStyle = {
    'background-color': '#206CFF',
    'color': '#fff',
    'border-radius': '36rpx',
    'width': '120rpx',
    'text-align': 'center',
    'height': '72rpx',
    'line-height': '72rpx'


}
const inputStyle = {
    'font-size': '32rpx'
}
const props = defineProps({
    title: {
        type: String,
        default: '在线看电视'
    },
    showSearch:{
        type:Boolean,
        default:true
    },
    pageType:{
        type:String,
        default:'index'
    }
})
const emits = defineEmits(['handleSearchAction'])

const handleSearchAction = () => {
   
    if (searchVal.value.trim() === '') {
        util.showToast('搜索词不能为空', 'none')


        return
    }
    if(searchVal.value === channelStore.searchKeyWord ) return
    channelStore.searchKeyWord = searchVal.value
    
   if(props.pageType === 'index'){
    uni.switchTab({
    url: `/pages/search/search`
  })
   }else{
    emits('handleSearchAction')
   }
}
onMounted(()=>{
    // #ifdef  H5
    fullbarH.value = 'h-200rpx'
    //#endif
})

</script>

<style lang="scss" scoped>
.full-bg {
    background: url('../../assets/img/full-bg.png') no-repeat top center;
    background-size: 100%;
}
</style>