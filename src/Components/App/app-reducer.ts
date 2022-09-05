export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'


type AppInitialStateType = {
    status: StatusType
    error: string | null
}

const initialState: AppInitialStateType = {
    status: 'idle',
    error: null
}

export const appReducer = (state: AppInitialStateType = initialState, action: AppActionType): AppInitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS' :
            return {...state, status: action.status}
        case 'APP/SET-ERROR' :
            return {...state, error: action.error}
        default:
            return {...state}
    }
}

export type SetErrorActionType = ReturnType<typeof setError>;
export type SetStatusActionType = ReturnType<typeof setStatus>;


export type AppActionType =
    | SetStatusActionType
    | SetErrorActionType

export const setStatus = (status: StatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setError = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)

