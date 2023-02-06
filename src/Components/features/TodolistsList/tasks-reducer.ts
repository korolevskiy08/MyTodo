import {TasksStateType} from '../../App/App';
import {TaskPriorities, TaskStatuses} from "../../../api/todoapi";
import {SetErrorActionType} from "../../App/app-reducer";
import {createSlice} from "@reduxjs/toolkit";
import {addTaskTC, deleteTaskTC, fetchTaskTC, updateTaskTC} from "./task-actions";
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from "./todolists-actions";

const initialState: TasksStateType = {}

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



