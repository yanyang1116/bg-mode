// 导出所有 store
export { useGlobalStore } from './global';
export { useUserStore, USER_STORE_KEY } from './user';

// 导出类型
export type { GlobalState, LoadingState } from './global/types';
export type { UserState } from './user/types';
