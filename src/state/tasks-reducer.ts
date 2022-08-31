import {
    AddTodolistActionType,
    RemoveTodolistActionType,
    setTodolistAC,
    SetTodolistActionType
} from './todolists-reducer';
import {TasksStateType} from '../App';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from "../api/todoapi";
import {Dispatch} from "redux";
import {AppActionsType, AppRootStateType, AppThunk} from "./store";

export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type SetTasksActionType = ReturnType<typeof setTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

export type TasksActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | SetTasksActionType
    | UpdateTaskActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: AppActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.todolistId]: [action.task, ...state[action.todolistId]]
            }
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(ts => ts.id === action.taskId ? {...action.task} : ts)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
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
        case "SET-TASK": {
            return {
                ...state,
                [action.todolistId]: action.tasks
            }
        }
        default:
            return state;
    }
}


// AC
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId
    } as const
}
export const addTaskAC = (task: TaskType, todolistId: string) => {
    return {type: 'ADD-TASK', task, todolistId} as const
}
export const setTaskAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASK',
        todolistId,
        tasks
    } as const
}
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskType) => {
    return {
        type: 'UPDATE-TASK',
        todolistId,
        taskId,
        task
    } as const
}


// thank
export const fetchTaskTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTaskAC(todolistId, res.data.items))
            })
    }
}
export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                dispatch(removeTaskAC(taskId, todolistId))
            })
    }
}
export const addTaskTC = (title: string, todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.createTask(todolistId, title)
            .then((res) => {
                console.log(res)
                dispatch(addTaskAC(res.data.data.item, todolistId))
            })
    }
}
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
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
                dispatch(updateTaskAC(todolistId, taskId, res.data.data.item))
            })
        }
    }
}


export type UpdateTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}





