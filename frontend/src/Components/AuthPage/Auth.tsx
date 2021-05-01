import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { renderTextField } from "../Formik/Fields/Fields";
import { useDispatch, useSelector } from "react-redux";
import { registrationThunk, loginThunk, registrationFormDataType, loginFormDataType } from "../Redux/Reducers/authReducer"
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { StateType } from "../Redux/store";
import { authApi } from "../API/API";
import { Redirect } from "react-router";
import LoginForm from "./Login";
import RegistrationForm from "./Register";
import OpenNotification from "../openNotification/OpenNotification";
import ForgotPassword from "./ForgotPassword";

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

    const classes = useStyle();

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
    if (isAuth) {
        return <Redirect to={'/mainPage'} />
    }

    return <React.Fragment>
        <Box className={classes.root}>
            {/*Авторизация*/}
            <Dialog open={isOpenedAuth} fullWidth>
                <DialogTitle>Sign in</DialogTitle>
                <DialogContent>
                    {/* onSubmit={loginSubmit} */}
                     <LoginForm openAuth={openAuth} openNotificationWithSettings={props.openNotificationWithSettings!} 
                        openForgotPassword = {openForgotPassword}
                     />
                </DialogContent>

            </Dialog>

            {/*Регистрация*/}
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