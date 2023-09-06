import { useUserStore } from '@/store/index'
import service from '@/common/service';
import util from '@/common/util'
import constant from '@/common/constant'

export const useFeedBackAction = () => {
    const userStore = useUserStore();

    const openid = userStore.userInfo.openid;
    const username = userStore.userInfo.username
    async function handleFeedBack(problem: string, channelName = '自定义反馈') {

        const rowData = {
            rows: [
                {
                    openid,
                    username,
                    channel_name: channelName,
                    problem
                }
            ],
            table_name: `${constant.FEEDBACK_TABLE_NAME}`
        }
        const addRes = await service.handleAddRowData(rowData)
        if (addRes) {
            util.showToast('反馈成功', 'success')
        } else {
            util.showToast('反馈失败', 'error')
        }
    }
    return {
        handleFeedBack
    }
}