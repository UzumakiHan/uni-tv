import {ref,onMounted} from 'vue'
import util from '@/common/util';

export const useNavAction=()=>{
    const statusHeight = ref(0);
    const barH = ref(0);
    const tabBarHeightVal = ref(0)
    onMounted( () => {
        const { statusBarHeight, barHeight } = util.handleNavInfo();
        const {tabBarHeight} = util.handleGetSafeArea() as any
        statusHeight.value = statusBarHeight
        barH.value = barHeight
        tabBarHeightVal.value = tabBarHeight
       
      })
    return {
        statusHeight,
        barH,
        tabBarHeightVal
    }
}