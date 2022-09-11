import {TasksActionsType, tasksReducer} from './tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from './todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionType, appReducer} from "../Components/App/app-reducer";
import {ActionsAuthType, authReducer} from "../Components/Login/authReducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodolistsActionsType | TasksActionsType | AppActionType | ActionsAuthType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
