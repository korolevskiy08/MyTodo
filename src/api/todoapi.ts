import axios, {AxiosResponse} from "axios";
import {UpdateTaskModelType} from "../state/tasks-reducer";
import {TodolistDomainType} from "../state/todolists-reducer";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '6a186eca-b950-4867-b1d4-cf6c7447fc05'
    }
})


// API
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponceType<{ item: TodolistDomainType }>>>('todo-lists', {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponceType>(`todo-lists/${id}`);
    },
    updateTodolist(id: string, title: string) {
        return instance.put<{ title: string }, AxiosResponse<ResponceType>>(`todo-lists/${id}`, {title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponceType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponceType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks`, {title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<UpdateTaskModelType, AxiosResponse<ResponceType<{ item: TaskType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

export const authAPI = {
    login(data:LoginParamsType) {
        return instance.post('/auth/login', data)
    },
    logout(){
      return instance.delete('/auth/login')
    },
    me(){
        return instance.get('/auth/me')
    }
}


// Types

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponceType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}



