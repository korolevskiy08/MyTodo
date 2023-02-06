import {TasksActionsType, tasksReducer} from '../Components/features/TodolistsList/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../Components/features/TodolistsList/todolists-reducer';
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionType, appReducer} from "../Components/App/app-reducer";
import {ActionsAuthType, authReducer} from "../Components/features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

//export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
})

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodolistsActionsType | TasksActionsType | AppActionType | ActionsAuthType

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

type AppDispatchType = typeof store.dispatch

const useAppDispatch = () => useDispatch<AppDispatchType>()

// @ts-ignore
window.store = store;

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch()

    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundActions
}
