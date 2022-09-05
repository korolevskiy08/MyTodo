import { Dispatch } from 'redux';
import {AppActionsType} from "../state/store";
import {setError, setStatus} from "../Components/App/app-reducer";
import {ResponceType} from './../api/todoapi'

// generic function
export const handleServerAppError = <T>(data: ResponceType<T>, dispatch: Dispatch<AppActionsType>) => {
    if (data.messages.length) {
        dispatch(setError(data.messages[0]))
    } else {
        dispatch(setError('Some error occurred'))
    }
    dispatch(setStatus('failed'))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch<AppActionsType>) => {
    dispatch(setError(error.message))
    dispatch(setStatus('failed'))
}