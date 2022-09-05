import {TasksStateType} from '../Components/App/App';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from "../api/todoapi";
import {AppRootStateType, AppThunk} from "./store";
import {addTodolistAC, removeTodolistAC, setTodolistAC} from "./todolists-reducer";
import {setError, SetErrorActionType, setStatus} from "../Components/App/app-reducer";
import {handleServerAppError} from "../utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case "ADD-TASK":
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(ts => ts.id === action.taskId ? {...action.task} : ts)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TODOLIST": {
            const copyState = {...state}
            action.todolist.forEach(td => {
                copyState[td.id] = []
            })
            return copyState
        }
        case "SET-TASK":
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state;
    }
}

// AC
export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType, todolistId: string) => ({type: 'ADD-TASK', task, todolistId} as const)
export const setTaskAC = (todolistId: string, tasks: TaskType[]) => ({type: 'SET-TASK', todolistId, tasks} as const)
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskType) =>
    ({type: 'UPDATE-TASK', todolistId, taskId, task} as const)

// Thunk
export const fetchTaskTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setStatus('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTaskAC(todolistId, res.data.items))
            dispatch(setStatus('succeeded'))
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    dispatch(setStatus('loading'))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setStatus('succeeded'))
        }).catch((e) => {
            dispatch(setError(e.message))
            dispatch(setStatus('failed'))
    })
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => (dispatch) => {
    dispatch(setStatus('loading'))
    todolistsAPI.createTask(todolistId, title)
        .then((res) => {
            dispatch(setStatus('succeeded'))
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item, todolistId))
            } else {
                if (res.data.messages.length) {
                    dispatch(setError(res.data.messages[0]))
                }
            }
        }).catch((e) => {
        dispatch(setError(e.message))
        dispatch(setStatus('failed'))
    })
}
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        dispatch(setStatus('loading'))
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
                        dispatch(updateTaskAC(todolistId, taskId, res.data.data.item))
                        dispatch(setStatus('succeeded'))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
            }).catch((e) => {
                dispatch(setError(e.message))
                dispatch(setStatus('failed'))
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



