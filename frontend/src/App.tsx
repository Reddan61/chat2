import { StateType } from './Components/Redux/store';
import React, { useEffect } from "react";
import './App.css';
import Auth from "./Components/AuthPage/Auth";
import Header from "./Components/Header/Header"
import {Redirect, Route, Switch, withRouter} from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {isLoginnedThunk} from "./Components/Redux/Reducers/authReducer"
import OpenNotification from './Components/openNotification/OpenNotification';
import { compose } from 'redux';
import Profile from './Components/Profile/Profile';
import Friends from './Components/Friends/Friends';
import Messages from './Components/Messages/Messages';
import ResetPassword from './Components/ResetPassword/ResetPassword';




const App = () => {
    const dispatch = useDispatch();
    const {isAuth} = useSelector( (state:StateType) => state.AuthPage );
    useEffect(() => {
         dispatch(isLoginnedThunk());
    },[])
   
    return <React.Fragment>
        {isAuth && <Header />}
            <Switch>
                <Route path = "/auth" exact render={() =>  <OpenNotification><Auth /></OpenNotification>}/>
                <Route path = "/resetpassword/:token" render={() =>  <ResetPassword />}/>
                <Route path = "/profile" exact render={() => <Profile />}/>
                <Route path = "/friends" exact render={() => <Friends />}/>
                <Route path = "/messages" exact render={() => <Messages />}/>

                <Route render={() => <Redirect to={'/profile'}/>}/>
            </Switch>
        </React.Fragment>
}

export default App;
