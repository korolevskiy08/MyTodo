import {AppThunk} from "../../state/store";
import {authAPI} from "../../api/todoapi";
import {setIsLoggedInAC} from "../Login/authReducer";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


type AppInitialStateType = {
    status: StatusType
    error: string | null
    isInitialized: boolean
}

const initialState: AppInitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

export const appReducer = (state: AppInitialStateType = initialState, action: AppActionType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS' :
            return {...state, status: action.status}
        case 'APP/SET-ERROR' :
            return {...state, error: action.error}
        case 'APP/SET-initialized':
            return {...state, isInitialized: action.isInitializedValue}
        default:
            return {...state}
    }
}

export type SetErrorActionType = ReturnType<typeof setError>;
export type SetStatusActionType = ReturnType<typeof setStatus>;
export type SetIsInitializedActionType = ReturnType<typeof setIsInitialized>

export type AppActionType =
    | SetStatusActionType
    | SetErrorActionType
    | SetIsInitializedActionType


export const setStatus = (status: StatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setError = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitialized = (isInitializedValue: boolean) => ({type: 'APP/SET-initialized', isInitializedValue}as const)

export const initializeAppTC = (): AppThunk => async (dispatch) => {
    dispatch(setIsInitialized(false))
    try {
        const res = await authAPI.me()
        dispatch(setIsLoggedInAC(true))
        if (res.data.resultCode !== 0) {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setIsInitialized(true))
    }
}