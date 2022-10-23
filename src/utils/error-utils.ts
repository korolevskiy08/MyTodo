import { Dispatch } from 'redux';
import {AppActionsType} from "../state/store";
import {setError, setStatus} from "../Components/App/app-reducer";
import {ResponceType} from './../api/todoapi'

// generic function
export const handleServerAppError = <T>(data: ResponceType<T>, dispatch: Dispatch<AppActionsType>) => {
    if (data.messages.length) {
        dispatch(setError({error: data.messages[0]}))
    } else {
        dispatch(setError({error: 'Some error occurred'}))
    }
    dispatch(setStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch<AppActionsType>) => {
    dispatch(setError({error: error.message}))
    dispatch(setStatus({status: 'failed'}))
}