import { StateType } from './Components/Redux/store';
import React, { useEffect } from "react";
import './App.css';
import Auth from "./Components/AuthPage/Auth";
import MainPage from "./Components/MainPage/MainPage"
import {Redirect, Route, Switch} from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {isLoginnedThunk} from "./Components/Redux/Reducers/authReducer"
import OpenNotification from './Components/openNotification/OpenNotification';




const App = () => {
    const {isAuth} = useSelector((state:StateType) => state.AuthPage);
    const dispatch = useDispatch();

    useEffect(() => {
         dispatch(isLoginnedThunk());
    },[])
   
    if(isAuth) {
        return <Redirect to = {'/mainPage'} />
    }

    return <React.Fragment>
            <Switch>
                <Route path = "/auth" render={() =>  <OpenNotification><Auth /></OpenNotification>}/>
                <Route path = "/mainPage" render={() => <MainPage />}/>

                <Route render={() => <Redirect to={'/auth'}/>}/>
            </Switch>
        </React.Fragment>
}

export default App;
