import {AppRootStateType} from "../../state/store";

export const selectStatus = (state: AppRootStateType) => state.app.status
export const selectSelectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
