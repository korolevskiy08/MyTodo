import {TasksStateType} from '../Components/App/App';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from "../api/todoapi";
import {AppRootStateType, AppThunk} from "./store";
import {addTodolistAC, removeTodolistAC, setTodolistAC} from "./todolists-reducer";
import {setError, SetErrorActionType, setStatus} from "../Components/App/app-reducer";
import {handleServerAppError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: 'loading'}))
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(setStatus({status: 'succeeded'}))
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item, todolistId}))
            } else {
                if (res.data.messages.length) {
                    dispatch(setError({error: res.data.messages[0]}))
                }
            }
        }).catch((e) => {
        dispatch(setError(e.message))
        dispatch(setStatus({status: 'failed'}))
    })
}
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        dispatch(setStatus({status: 'loading'}))
        const task = getState().tasks[todolistId].find(el => el.id === taskId)
        if (task) {
            todolistsAPI.updateTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...model
            }).then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC({todolistId, taskId, task: res.data.data.item}))
                    dispatch(setStatus({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }).catch((e) => {
                dispatch(setError(e.message))
                dispatch(setStatus({status: 'failed'}))
            })
        }
    }
}

export const fetchTaskTC = createAsyncThunk('tasks/deleteTask', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: 'loading'}))
    const res = await todolistsAPI.getTasks(todolistId)
    thunkAPI.dispatch(setStatus({status: 'succeeded'}))
    return {todolistId, tasks: res.data.items}
})

export const deleteTaskTC = createAsyncThunk('tasks/fetchTasks', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setStatus({status: 'loading'}))
    await todolistsAPI.deleteTask(param.todolistId, param.taskId)
    thunkAPI.dispatch(setStatus({status: 'succeeded'}))
    return {taskId: param.taskId, todolistId: param.todolistId}
})

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTaskAC(state, action: PayloadAction<{ task: TaskType, todolistId: string }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, task: TaskType }>) {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.todolistId)
            if (index > -1) {
                task[index] = {...task[index], ...action.payload.task}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodolistAC, (state, action) => {
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
    }
})

export const {addTaskAC, updateTaskAC} = slice.actions

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
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistAC>
    | ReturnType<typeof updateTaskAC>
    | SetErrorActionType



