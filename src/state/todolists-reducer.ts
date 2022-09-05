import {todolistsAPI, TodolistType} from "../api/todoapi";
import {AppThunk} from "./store";
import {setError, setStatus, StatusType} from "../Components/App/app-reducer";

const initialState = [] as TodolistDomainType[]

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(tl => tl.id !== action.id)
        }
        case "ADD-TODOLIST": {
            return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state]
        }
        case "CHANGE-TODOLIST-TITLE": {
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        }
        case "CHANGE-TODOLIST-FILTER": {
            return state.map(tl => tl.id === action.id ? {...tl, filter: 'all'} : tl)
        }
        case "SET-TODOLIST": {
            return action.todolist.map(td => ({...td, filter: 'all', entityStatus: "idle"}))
        }
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(td => td.id === action.id ? {...td, entityStatus: action.status} : td)
        default:
            return state;
    }
}

// AC
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistDomainType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodolistAC = (todolist: TodolistType[]) => ({type: 'SET-TODOLIST', todolist} as const)
export const changeTodolistEntityStatus = (id: string, status: StatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', id,status
}as const)

// thunk
export const fetchTodolistTC = (): AppThunk => async dispatch => {
    dispatch(setStatus('loading'))
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistAC(res.data))
    dispatch(setStatus('succeeded'))
}

export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setStatus("loading"))
    dispatch(changeTodolistEntityStatus(todolistId, 'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(changeTodolistEntityStatus(todolistId, 'succeeded'))
        }).catch((e) => {
        dispatch(setError(e.message))
        dispatch(setStatus('failed'))
    })
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setStatus('loading'))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setStatus('succeeded'))
            }).catch((e) => {
            dispatch(setError(e.message))
            dispatch(setStatus('failed'))
        })
    }
}
export const updateTodolist = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setStatus('loading'))
        todolistsAPI.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setStatus('succeeded'))
            }).catch((e) => {
            dispatch(setError(e.message))
            dispatch(setStatus('failed'))
        })
    }
}

// types
export type TodolistsActionsType =
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistEntityStatus>

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: StatusType
}

























