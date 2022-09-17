import {todolistsAPI, TodolistType} from "../api/todoapi";
import {AppThunk} from "./store";
import {setError, setStatus, StatusType} from "../Components/App/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = [] as TodolistDomainType[]

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) state.splice(index, 1)
            //state.filter(tl => tl.id !== action.payload.id)
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistDomainType }>) {
            state.push({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title

            // state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolistAC(state, action: PayloadAction<{ todolist: TodolistType[] }>) {
            return action.payload.todolist.map(td => ({...td, filter: 'all', entityStatus: "idle"}))
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: StatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }

    }
})

export const todolistsReducer = slice.reducer

export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatus,
    setTodolistAC
} = slice.actions

// thunk
export const fetchTodolistTC = (): AppThunk => async dispatch => {
    dispatch(setStatus({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistAC({todolist: res.data}))
    dispatch(setStatus({status: 'succeeded'}))
}
export const removeTodolistTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: "loading"}))
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
        .then((res) => {
            dispatch(removeTodolistAC({id: todolistId}))
            dispatch(changeTodolistEntityStatus({id: todolistId, status: 'succeeded'}))
        }).catch((e) => {
        dispatch(setError(e.message))
        dispatch(setStatus({status: 'failed'}))
    })
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC({todolist: res.data.data.item}))
                dispatch(setStatus({status: 'succeeded'}))
            }).catch((e) => {
            dispatch(setError(e.message))
            dispatch(setStatus({status: 'failed'}))
        })
    }
}
export const updateTodolist = (todolistId: string, title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setStatus({status: 'loading'}))
        todolistsAPI.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(changeTodolistTitleAC({id: todolistId, title}))
                dispatch(setStatus({status: 'succeeded'}))
            }).catch((e) => {
            dispatch(setError(e.message))
            dispatch(setStatus({status: 'failed'}))
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

























