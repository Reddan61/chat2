import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { renderTextField } from "../Formik/Fields/Fields";
import { useDispatch, useSelector } from "react-redux";
import { registrationThunk, loginThunk, registrationFormDataType, loginFormDataType, isLoginnedThunk } from "../Redux/Reducers/authReducer"
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { StateType } from "../Redux/store";
import { authApi } from "../API/API";
import { Redirect } from "react-router";
import LoginForm from "./Login";
import RegistrationForm from "./Register";
import OpenNotification from "../openNotification/OpenNotification";
import ForgotPassword from "./ForgotPassword";
import Loader from "../Loader/Loader";

const useStyle = makeStyles({
    root: {
        minHeight: '100vh',
        Width: "100%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        minWidth: '200px'
    }
});

type authPropsType = {
    openNotificationWithSettings?: (bool: boolean, msg: string, sev: "success" | "error") => void
}
const Auth: React.FC<authPropsType> = (props) => {
    const { isAuth } = useSelector((state: StateType) => state.AuthPage);
    const [isLoading,setLoading] = useState(true);
    const classes = useStyle();
    const dispatch = useDispatch();
    const [isOpenedAuth, changeOpenAuth] = useState(false);
    const [isOpenedReg, changeOpenReg] = useState(false);
    const [isOpenForgotPassword, changeOpenForgotPassword] = useState(false);

    function openForgotPassword() {
        changeOpenForgotPassword(!isOpenForgotPassword)
    }

    function openAuth() {
        changeOpenAuth(!isOpenedAuth);
    }

    function openReg() {
        changeOpenReg(!isOpenedReg);
    }
   
    async function checkAuth() {
        setLoading(true);
        await dispatch(isLoginnedThunk());
        setLoading(false);
    }
    useEffect(() => {
        checkAuth();
    },[])

    if(isLoading) {
        return <Loader />
    }
    if (isAuth) {
        return <Redirect to={'/profile'} />
    }
    return <React.Fragment>
        <Box className={classes.root}>
            {/*??????????????????????*/}
            <Dialog open={isOpenedAuth} fullWidth>
                <DialogTitle>Sign in</DialogTitle>
                <DialogContent>
                    {/* onSubmit={loginSubmit} */}
                     <LoginForm openAuth={openAuth} openNotificationWithSettings={props.openNotificationWithSettings!} 
                        openForgotPassword = {openForgotPassword}
                     />
                </DialogContent>

            </Dialog>

            {/*??????????????????????*/}
            <Dialog open={isOpenedReg} fullWidth>
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent>
                    <RegistrationForm openReg={openReg} openNotificationWithSettings={props.openNotificationWithSettings!} />
                </DialogContent>
            </Dialog>
            <Dialog open = {isOpenForgotPassword} fullWidth>
                <DialogTitle>Forgot password</DialogTitle>
                    <DialogContent>
                        <ForgotPassword openNotificationWithSettings = {props.openNotificationWithSettings!} openForgotPassword = {openForgotPassword}/>
                    </DialogContent>
                </Dialog>
            <Button onClick={openAuth} className={classes.button}>Sign in</Button>
            <Button onClick={openReg} className={classes.button}>Sign up</Button>
        </Box>
    </React.Fragment>
};

export default Auth;