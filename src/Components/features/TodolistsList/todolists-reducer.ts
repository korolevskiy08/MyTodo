import {TodolistType} from "../../../api/todoapi";
import {StatusType} from "../../App/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistTC, fetchTodolistsTC, removeTodolistTC, updateTodolist} from "./todolists-actions";

export const slice = createSlice({
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

























