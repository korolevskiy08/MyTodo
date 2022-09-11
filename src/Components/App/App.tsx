import React, {useEffect} from 'react'
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
import {CircularProgress, LinearProgress} from "@mui/material";
import CustomizedSnackbars from "../ErrorSnackbar/ErrorSnackbar";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {initializeAppTC, StatusType} from "./app-reducer";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../Login/Login";
import {logoutTC} from "../Login/authReducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {

    const status = useSelector<AppRootStateType, StatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>( state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>( state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <CustomizedSnackbars/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="inherit"/>}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<Todolists/>}/>
                    <Route path={'/Login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1>404. Page not found</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    );
}


export default App;
