import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../../../AddItemForm/AddItemForm'
import {EditableSpan} from '../../../EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task/Task'
import {TaskStatuses, TaskType} from "../../../../api/todoapi";
import {FilterValuesType} from "../todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {LinearProgress} from "@mui/material";
import {AppRootStateType, useActions} from "../../../../state/store";
import {StatusType} from "../../../App/app-reducer";
import {fetchTaskTC} from "../task-actions";
import {todolistsActions} from "../index";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    // changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (params: {title: string, todolistId: string}) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (params: {taskId: string, todolistId: string}) => void
    // changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    entityStatus: StatusType
}

export const Todolist = React.memo(function (props: PropsType) {
    const {removeTodolistTC, changeTodolistFilterAC, updateTodolist} = useActions(todolistsActions)

    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        props.addTask({title, todolistId: props.id})
    }, [props.addTask, props.id])

    const removeTodolist = () => {
        removeTodolistTC(props.id)
    }

    const changeTodolistTitle = useCallback((title: string) => {
        updateTodolist({todolistId: props.id, title})
    }, [props.id, updateTodolist])

    const onAllClickHandler = useCallback(() => changeTodolistFilterAC({id: props.id, filter: 'all'}), [props.id])
    const onActiveClickHandler = useCallback(() => changeTodolistFilterAC({id: props.id, filter: 'active'}), [props.id])
    const onCompletedClickHandler = useCallback(() => changeTodolistFilterAC({id: props.id, filter: 'completed'}), [props.id])


    let tasksForTodolist = props.tasks

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    useEffect(() => {
        dispatch(fetchTaskTC(props.id))
    }, [])

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={props.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}
                                                removeTask={props.removeTask}
                                                changeTaskTitle={props.changeTaskTitle}
                                                changeTaskStatus={props.changeTaskStatus}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


