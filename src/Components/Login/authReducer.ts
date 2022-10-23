import {setStatus} from "../App/app-reducer";
import {AppThunk} from "../../state/store";
import {authAPI, LoginParamsType} from "../../api/todoapi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk('auth/login', async (data: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setStatus({status: 'succeeded'}))
            return {value: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({someError: 'some error'})
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, thunkAPI.dispatch)
        return {value: false}
    }
})

// export const logoutTC = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
//     thunkAPI.dispatch(setStatus({status: 'loading'}))
//     try {
//         const res = await authAPI.logout()
//         if (res.data.resultCode === 0) {
//             thunkAPI.dispatch(setStatus({status: 'succeeded'}))
//             return {value: false}
//         } else {
//             handleServerAppError(res.data, thunkAPI.dispatch)
//             return thunkAPI.rejectWithValue({someError: 'some error'})
//         }
//     } catch (e) {
//         if (axios.isAxiosError(e))
//             handleServerNetworkError(e, thunkAPI.dispatch)
//         return {value: false}
//     }
// })

export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(setStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
    }
}

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.value
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// types
export type ActionsAuthType = ReturnType<typeof setIsLoggedInAC>