import { StateType } from './Components/Redux/store';
import React, { Suspense } from "react";
import Auth from "./Components/AuthPage/Auth";
import Header from "./Components/Header/Header"
import { Redirect, Route, Switch } from "react-router";
import { useSelector } from "react-redux";
import OpenNotification from './Components/openNotification/OpenNotification';
import Profile from './Components/Profile/Profile';
import Users from './Components/Users/Users';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Loader from './Components/Loader/Loader';


const Messages = React.lazy(() => import('./Components/Messages/Messages'));

const App = () => {
    const { isAuth } = useSelector((state: StateType) => state.AuthPage);

    return <React.Fragment>
        {isAuth && <Header />}
        <Suspense fallback={<Loader />}>
            <Switch>
                <Route path="/auth" exact render={() => <OpenNotification><Auth /></OpenNotification>} />
                <Route path="/resetpassword/:token" render={() => <ResetPassword />} />

                <Route path="/profile" exact render={() => <Profile />} />
                <Route path="/users" exact render={() => <Users />} />
                <Route path="/messages" exact render={() => <Messages />} />


                <Route render={() => <Redirect to={'/profile'} />} />
            </Switch>
        </Suspense>
    </React.Fragment>
}

export default App;
