import {AppThunk} from "../../state/store";
import {authAPI} from "../../api/todoapi";
import {setIsLoggedInAC} from "../Login/authReducer";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as StatusType,
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<{status: StatusType}>){
            state.status = action.payload.status
        },
        setError(state, action: PayloadAction<{error: string | null}>){
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{isInitializedValue: boolean}>){
            state.isInitialized = action.payload.isInitializedValue
        }
    }
})

export const appReducer = slice.reducer

export const {setError, setStatus, setIsInitialized} = slice.actions

export const initializeAppTC = (): AppThunk => async dispatch => {
    dispatch(setIsInitialized({isInitializedValue: false}))
    try {
        const res = await authAPI.me()
        dispatch(setIsLoggedInAC({value: false}))
        if (res.data.resultCode !== 0) {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
    } finally {
        dispatch(setIsInitialized({isInitializedValue: true}))
    }
}

export type SetErrorActionType = ReturnType<typeof setError>;
export type SetStatusActionType = ReturnType<typeof setStatus>;
export type SetIsInitializedActionType = ReturnType<typeof setIsInitialized>

export type AppActionType =
    | SetStatusActionType
    | SetErrorActionType
    | SetIsInitializedActionType


