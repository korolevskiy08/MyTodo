import {TasksStateType} from '../Components/App/App';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from "../api/todoapi";
import {AppRootStateType, AppThunk} from "./store";
import {addTodolistAC, removeTodolistAC, setTodolistAC} from "./todolists-reducer";
import {setError, SetErrorActionType, setStatus} from "../Components/App/app-reducer";
import {handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) task.splice(index, 1)
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType, todolistId: string }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        setTaskAC(state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) {
            state[action.payload.todolistId] = action.payload.tasks
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
    }
})

export const {removeTaskAC, addTaskAC, setTaskAC, updateTaskAC} = slice.actions

export const tasksReducer = slice.reducer

// Thunk
export const fetchTaskTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: 'loading'}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTaskAC({todolistId, tasks: res.data.items}))
            dispatch(setStatus({status: 'succeeded'}))
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setStatus({status: 'loading'}))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC({taskId, todolistId}))
            dispatch(setStatus({status: 'succeeded'}))
        }).catch((e) => {
        dispatch(setError(e.message))
        dispatch(setStatus({status: 'failed'}))
    })
}
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
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof setTodolistAC>
    | ReturnType<typeof setTaskAC>
    | ReturnType<typeof updateTaskAC>
    | SetErrorActionType



