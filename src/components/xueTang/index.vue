<template>
    <view class="index w-750rpx m-h-100vh">
       <navTitleBar title="云端电视"/>
        <view class="px-32rpx mt-30rpx box-border">

            <view class="text-36rpx text-#333 font-bold">频道介绍</view>
            <view class="mt-20rpx flex box-border items-center flex-wrap">
                <view class="flex-center-between w-full mb-45rpx" v-for="(hotCourse, hotCourseIndex) in hotCourseList"
                    :key="hotCourseIndex">
                    <view class="w-336rpx" v-for="(course, courseIndex) in hotCourse" :key="courseIndex"
                        @click="handleGoDetail(course.CourseID)">
                        <view class="w-full relative">
                            <image :src="course.CoverURL" mode="widthFix" class="w-full h-336rpx rounded-16rpx" />
                            <view
                                class="box-border py-8rpx px-16rpx text-22rpx text-#fff center bg-#FF587E rounded-22rpx absolute top-15rpx left-16rpx"
                                :style="{ backgroundColor: course.TagsColor }">{{
                                    course.CourseTags }}</view>
                        </view>
                        <view class="mt-16rpx">
                            <view class="text-#333 text-32rpx font-500 line-clamp-1">{{ course.CourseName }}</view>
                            <view class="mt-4rpx text-#999 text-26rpx line-clamp-1">{{ course.Introduction }}</view>

                        </view>

                    </view>


                </view>

            </view>
        </view>
    </view>
</template>
  
<script setup lang="ts">
import { ref ,onMounted} from 'vue'
import util from '@/common/util';
import service from '@/common/service';
import navTitleBar from '@/components/nav-title-bar/index.vue'

import _ from 'lodash'

const hotCourseList = ref([])

async function handleGetList(){
    const result = await service.handleGetTableData('CourseSchedule');
    hotCourseList.value = _.chunk(result.rows, 2)
}
const handleGoDetail = (CourseID: string) => {
    util.showToast('暂无介绍', 'none')
//     uni.navigateTo({
//     url: `/pages/detail/detail?CourseID=${CourseID}`
//   })
}
onMounted(()=>{
    handleGetList();
})

</script>