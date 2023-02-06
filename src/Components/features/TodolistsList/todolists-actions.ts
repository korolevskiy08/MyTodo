import {createAsyncThunk} from "@reduxjs/toolkit";
import {setStatus} from "../../App/app-reducer";
import {todolistsAPI} from "../../../api/todoapi";
import axios from "axios";
import {handleServerNetworkError} from "../../../utils/error-utils";
import {changeTodolistEntityStatus} from "./todolists-reducer";

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
