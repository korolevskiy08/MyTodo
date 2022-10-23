import {authAPI} from "../../api/todoapi";
import {setIsLoggedInAC} from "../Login/authReducer";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initializeAppTC = createAsyncThunk('auth/initializeApp', async (param, {dispatch}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as StatusType,
        error: null as string | null,
        isInitialized: false
    },
    reducers: {
        setStatus(state, action: PayloadAction<{ status: StatusType }>) {
            state.status = action.payload.status
        },
        setError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer

export const {setError, setStatus} = slice.actions

export type SetErrorActionType = ReturnType<typeof setError>;
export type SetStatusActionType = ReturnType<typeof setStatus>;

export type AppActionType =
    | SetStatusActionType
    | SetErrorActionType


