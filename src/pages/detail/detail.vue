<template>
    <view class="w-750rpx min-h-100vh bg-#F7F7F7">
        <!-- <image :src="coverUrlLink" style="width: 100%;" mode="widthFix"/> -->
        <view class="px-30rpx py-30rpx text-36rpx lh-50rpx">{{ detail }}</view>
    </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import constant from '@/common/constant';
import service from '@/common/service';
// const courseID = ref('')
const detail = ref('')
onLoad((options: any) => {
    const courseId = options.CourseID
    handleGetDetail(courseId)

})
async function handleGetDetail(id: string) {
    const findSql = `select * from ${constant.COURSE_SCHEDULE_TABLE_NAME} where CourseID = '${id}' `
    const findUserRes = await service.handleQueryData(findSql)
    if (findUserRes.results.length > 0) {
        uni.setNavigationBarTitle({
            title: findUserRes.results[0].CourseName
        });
        detail.value = findUserRes.results[0].Details

    }

}
</script>

<style scoped></style>