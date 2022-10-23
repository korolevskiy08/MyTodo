import {TasksStateType} from '../Components/App/App';
import {TaskPriorities, TaskStatuses, todolistsAPI} from "../api/todoapi";
import {AppRootStateType} from "./store";
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from "./todolists-reducer";
import {setError, SetErrorActionType, setStatus} from "../Components/App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const initialState: TasksStateType = {}

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

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolist.forEach(td => {
                state[td.id] = []
            })
        })
        builder.addCase(fetchTaskTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) task.splice(index, 1)
        })
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.todolistId)
            if (index > -1) {
                task[index] = {...task[index], ...action.payload.task}
            }
        })
    }
})

export const tasksReducer = slice.reducer

// Types
export type UpdateTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksActionsType =
    | SetErrorActionType



