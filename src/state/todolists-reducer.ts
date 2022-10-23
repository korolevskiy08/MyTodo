import {todolistsAPI, TodolistType} from "../api/todoapi";
import {setStatus, StatusType} from "../Components/App/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {handleServerNetworkError} from "../utils/error-utils";

export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (params, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setStatus({status: 'loading'}))
    const res = await todolistsAPI.getTodolists()
    try {
        dispatch(setStatus({status: 'succeeded'}))
        return {todolist: res.data}
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
        dispatch(setStatus({status: 'failed'}))
        return rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setStatus({status: "loading"}))
    dispatch(changeTodolistEntityStatus({id: todolistId, status: 'loading'}))
    const res = await todolistsAPI.deleteTodolist(todolistId)
    try {
        dispatch(changeTodolistEntityStatus({id: todolistId, status: 'succeeded'}))
        dispatch(setStatus({status: "succeeded"}))
        return {id: todolistId}
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
        dispatch(setStatus({status: 'failed'}))
        return rejectWithValue(null)
    }
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setStatus({status: 'loading'}))
    const res = await todolistsAPI.createTodolist(title)
    try {
        dispatch(setStatus({status: 'succeeded'}))
        return {todolist: res.data.data.item}
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
        dispatch(setStatus({status: 'failed'}))
        return rejectWithValue(null)
    }
})

export const updateTodolist = createAsyncThunk('todolists/updateTodolist', async (params: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setStatus({status: 'loading'}))
    const res = await todolistsAPI.updateTodolist(params.todolistId, params.title)
    try {
        dispatch(setStatus({status: 'succeeded'}))
        return {id: params.todolistId, title: params.title}
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
        dispatch(setStatus({status: 'failed'}))
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as TodolistDomainType[],
    reducers: {
        // changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.id)
        //     state[index].title = action.payload.title
        //
        //     // state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
        // },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, status: StatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.status
        }
    }, extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolist.map(td => ({...td, filter: 'all', entityStatus: "idle"}))
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) state.splice(index, 1)
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.push({...action.payload.todolist, filter: 'all', entityStatus: "idle"})
        })
        builder.addCase(updateTodolist.fulfilled, (state, action) => {
            console.log(action.payload.title)
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer

export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatus,
} = slice.actions

// types
export type TodolistsActionsType =
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatus>

export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: StatusType
}

























