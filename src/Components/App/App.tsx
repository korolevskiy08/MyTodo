import React from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {TaskType} from "../../api/todoapi";
import {Todolists} from "../features/TodolistsList/TodolistsList";
import {LinearProgress} from "@mui/material";
import CustomizedSnackbars from "../ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {StatusType} from "./app-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const status = useSelector<AppRootStateType, StatusType>( state => state.app.status )
    console.log(status)
    return (
        <div className="App">
            <CustomizedSnackbars />
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="inherit" />}
            <Container fixed>
                <Todolists />
            </Container>
        </div>
    );
}


export default App;
