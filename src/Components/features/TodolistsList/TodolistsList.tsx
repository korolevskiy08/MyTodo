import {useSelector} from "react-redux";
import {AppRootStateType, useActions} from "../../../state/store";
import {TodolistDomainType} from "./todolists-reducer";
import {useCallback, useEffect} from "react";
import {TaskStatuses} from "../../../api/todoapi";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {TasksStateType} from "../../App/App";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Login/auth-selectors";
import {addTaskTC, deleteTaskTC, updateTaskTC} from "./task-actions";
import {taskActions, todolistsActions} from "./index";
import {addTodolistTC, fetchTodolistsTC} from "./todolists-actions";

export const Todolists = () => {

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {deleteTaskTC, updateTaskTC, addTaskTC} = useActions(taskActions)
    const {addTodolistTC, fetchTodolistsTC} = useActions(todolistsActions)

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTaskTC({
            todolistId, taskId,
            model: {
                status
            }
        })
    }, []);

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        updateTaskTC({todolistId, taskId, model: {title: newTitle}})
    }, []);


    useEffect(() => {
        fetchTodolistsTC()
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/Login'}/>
    }

    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolistTC}/>
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
                                    removeTask={deleteTaskTC}
                                    addTask={addTaskTC}
                                    changeTaskStatus={changeStatus}
                                    filter={tl.filter}
                                    changeTaskTitle={changeTaskTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>
        </>
    )
}
