import { defineStore } from 'pinia';
import type { IUser } from '@/types/user'

export const useUserStore = defineStore({
    id:'user',
    state:()=>({
        userInfo:{} as IUser,
        collectChannelIds:[] as Array<string>
    }),
    
})