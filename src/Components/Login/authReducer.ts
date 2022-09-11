import {setStatus} from "../App/app-reducer";
import {AppThunk} from "../../state/store";
import {authAPI, LoginParamsType} from "../../api/todoapi";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios from "axios";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsAuthType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType):AppThunk => async (dispatch) => {
    dispatch(setStatus('loading'))
    try {
        const res = await authAPI.login(data)
        dispatch(setIsLoggedInAC(true))
        if(res.data.resultCode !== 0){
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if(axios.isAxiosError(e))
        handleServerNetworkError(e, dispatch)
    }
}

export const logoutTC = ():AppThunk => async (dispatch) => {
    dispatch(setStatus('loading'))
    try {
        const res = await authAPI.logout()
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setStatus('succeeded'))
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