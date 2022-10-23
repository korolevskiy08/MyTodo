import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../state/store";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    fetchTodolistTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    updateTodolist
} from "../../../state/todolists-reducer";
import {useCallback, useEffect} from "react";
import {addTaskTC, deleteTaskTC, updateTaskTC} from "../../../state/tasks-reducer";
import {TaskStatuses} from "../../../api/todoapi";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../App/App";
import {Navigate} from "react-router-dom";

export const Todolists = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    console.log(isLoggedIn)
    const dispatch = useDispatch();

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        dispatch(deleteTaskTC({todolistId, taskId}))
    }, []);
    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(addTaskTC({title, todolistId}))
    }, []);

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(updateTaskTC({
            todolistId, taskId,
            model: {
                status
            }
        }))
    }, []);
    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        dispatch(updateTaskTC({todolistId, taskId, model: {title: newTitle} }))
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC({id: todolistId, filter: value});
        dispatch(action);
    }, []);
    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, []);
    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(updateTodolist(id, title))
    }, []);
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchTodolistTC())
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/Login'}/>

    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    entityStatus={tl.entityStatus}
                                    id={tl.id}
                                    title={tl.title}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}