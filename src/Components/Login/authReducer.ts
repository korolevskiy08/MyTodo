import {setStatus} from "../App/app-reducer";
import {AppThunk} from "../../state/store";
import {authAPI, LoginParamsType} from "../../api/todoapi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }
})


export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: LoginParamsType):AppThunk => async (dispatch) => {
    dispatch(setStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(data)
        dispatch(setIsLoggedInAC({value: true}))

        if(res.data.resultCode !== 0){
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if(axios.isAxiosError(e))
        handleServerNetworkError(e, dispatch)
    }
}

export const logoutTC = ():AppThunk => async (dispatch) => {
    dispatch(setStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setStatus({status: 'succeeded'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if(axios.isAxiosError(e))
        handleServerNetworkError(e, dispatch)
    }
}

// types
export type ActionsAuthType = ReturnType<typeof setIsLoggedInAC>