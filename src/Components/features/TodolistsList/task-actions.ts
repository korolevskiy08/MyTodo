import {createAsyncThunk} from "@reduxjs/toolkit";
import {setError, setStatus} from "../../App/app-reducer";
import {todolistsAPI} from "../../../api/todoapi";
import axios from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../../utils/error-utils";
import {AppRootStateType} from "../../../state/store";
import {UpdateTaskModelType} from "./tasks-reducer";

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { title: string, todolistId: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setStatus({status: 'loading'}))
    try {
        const res = await todolistsAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            dispatch(setStatus({status: 'succeeded'}))
            return {task: res.data.data.item, todolistId: param.todolistId}
        } else {
            if (res.data.messages.length) {
                dispatch(setError({error: res.data.messages[0]}))
            }
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError(e))
            handleServerNetworkError(e, dispatch)
        dispatch(setStatus({status: 'failed'}))
        return rejectWithValue(null)
    }
})
export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (params: { todolistId: string, taskId: string, model: UpdateTaskModelType },
                                                                        {dispatch, getState, rejectWithValue}) => {
    dispatch(setStatus({status: 'loading'}))
    const state = getState() as AppRootStateType
    const task = state.tasks[params.todolistId].find(el => el.id === params.taskId)
    if (task) {
        const res = await todolistsAPI.updateTask(params.todolistId, params.taskId, {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...params.model
        })
        try {

            if (res.data.resultCode === 0) {
                dispatch(setStatus({status: 'succeeded'}))
                return {todolistId: params.todolistId, taskId: params.taskId, task: res.data.data.item}
            } else {
                if (res.data.messages.length) {
                    handleServerAppError(res.data, dispatch)
                }
                return rejectWithValue(null)
            }
        } catch (e) {
            if (axios.isAxiosError(e))
                handleServerNetworkError(e, dispatch)
            dispatch(setStatus({status: 'failed'}))
            return rejectWithValue(null)
        }
    } else {
        return rejectWithValue(null)
    }
})

export const fetchTaskTC = createAsyncThunk('tasks/fetchTask', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    thunkAPI.dispatch(setStatus({status: 'succeeded'}))
    return {todolistId, tasks: res.data.items}
})
export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: 'loading'}))
    await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    thunkAPI.dispatch(setStatus({status: 'succeeded'}))
    return {taskId: param.taskId, todolistId: param.todolistId}
})
