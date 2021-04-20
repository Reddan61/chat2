import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { renderTextField } from "../ReduxForm/Fields/Fields";
import { useDispatch, useSelector } from "react-redux";
import { registrationThunk, loginThunk, registrationFormDataType, loginFormDataType } from "../Redux/Reducers/authReducer"
import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { StateType } from "../Redux/store";
import { authApi } from "../API/API";
import OpenNotification from "../openNotification/OpenNotification";

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
    openNotificationWithSettings?:(bool:boolean,msg:string,sev:"success" | "error") => void
}
const Auth:React.FC<authPropsType> = (props) => {
    const classes = useStyle();

    const [isOpenedAuth, ChangeOpenAuth] = useState(false);
    const [isOpenedReg, ChangeOpenReg] = useState(false);


    function OpenAuth() {
        ChangeOpenAuth(!isOpenedAuth);
    }

    function OpenReg() {
        ChangeOpenReg(!isOpenedReg);
    }


    return <React.Fragment>
        <Box className={classes.root}>
            {/*Авторизация*/}
            <Dialog open={isOpenedAuth}>
                <DialogTitle>Sign in</DialogTitle>
                <DialogContent>
                    {/* onSubmit={loginSubmit} */}
                    <LoginForm OpenAuth={OpenAuth} openNotificationWithSettings = {props.openNotificationWithSettings!}/>
                </DialogContent>
            </Dialog>

            {/*Регистрация*/}
            <Dialog open={isOpenedReg}>
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent>
                    <RegistrationForm OpenReg={OpenReg} openNotificationWithSettings = {props.openNotificationWithSettings!} />
                </DialogContent>
            </Dialog>
            <Button onClick={OpenAuth} className={classes.button}>Sign in</Button>
            <Button onClick={OpenReg} className={classes.button}>Sign up</Button>
        </Box>
    </React.Fragment>
};
type registrationFormPropsType = {
    OpenReg: () => void,
    openNotificationWithSettings:(bool:boolean,msg:string,sev:"success" | "error") => void
}

const RegistrationForm:React.FC<registrationFormPropsType> = (props) => {
    const dispatch = useDispatch();
    const {openNotificationWithSettings} = props;
    
    const submit = async (values: registrationFormDataType, { setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void }) => {
        let response = await authApi.registration(values);
        if(response.status === "success") {
            dispatch(registrationThunk(response.data))
            openNotificationWithSettings(true,"Success","success");
            props.OpenReg();
        } else {
            openNotificationWithSettings(true,"Error","error");
            setSubmitting(false)
        } 
    }


    return <Formik
        initialValues={{ password: '', username: "",email:"",password2:"" }}
        onSubmit={submit}
        validationSchema={registerSchema}
    >
        {({ values, isSubmitting,errors,touched }) => <Form>
            <Field name="username" autoFocus component={renderTextField}
                label="UserName"
                margin="dense"
                type="text"
                fullWidth
                error={touched.username && Boolean(errors.username)}
                helperText = {touched.username?errors.username:null}
            />
            <Field name="email" component={renderTextField}
                label="Email Address"
                margin="dense"
                type="email"
                fullWidth
                error={touched.email && Boolean(errors.email)}
                helperText = {touched.email?errors.email:null}
            />
            <Field name="password" component={renderTextField}
                label="Password"
                margin="dense"
                type="password"
                fullWidth
                error={touched.password && Boolean(errors.password)}
                helperText = {touched.password?errors.password:null}
            />
            <Field name="password2" component={renderTextField}
                label="Confirm Password"
                margin="dense"
                type="password"
                fullWidth
                error={touched.password2 && Boolean(errors.password2)}
                helperText = {touched.password2?errors.password2:null}
            />
            <DialogActions>
                <Button onClick={props.OpenReg} color="primary">
                    Cancel
                </Button>
                <Button type="submit" color="primary" disabled = {isSubmitting}>
                    Send
                </Button>
            </DialogActions>
        </Form>
        }
    </Formik>
};

type loginFormPropsType = {
    OpenAuth: () => void,
    openNotificationWithSettings:(bool:boolean,msg:string,sev:"success" | "error") => void
}

const LoginForm: React.FC<loginFormPropsType> = (props) => {
    const dispatch = useDispatch();
    const {openNotificationWithSettings} = props;

    const submit = async (values: loginFormDataType, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        let response = await authApi.login(values);
        if(response.status === "success") {
            dispatch(loginThunk(response.data));
            props.OpenAuth();
        } else {
            openNotificationWithSettings(true,"Error","error");
            setSubmitting(false)
        } 
    }
    return <>
        <Formik
            initialValues={{ password: '', username: "" }}
            onSubmit={submit}
            validationSchema={loginSchema}
        >
            {({ values, errors, isSubmitting, touched }) => (
                <Form>
                    <Field
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Username"
                        type="text"
                        name="username"
                        component={renderTextField}
                        error={touched.username && Boolean(errors.username)}
                        helperText = {touched.username?errors.username:null}
                    />
                    <Field
                        fullWidth
                        label="password"
                        margin="dense"
                        type="password"
                        name="password"
                        component={renderTextField}
                        error={touched.password && Boolean(errors.password)}
                        helperText = {touched.password?errors.password:null}
                    />
                    <DialogActions>
                        <Button onClick={props.OpenAuth} color="primary">Cancel</Button>
                        <Button type="submit" color="primary" disabled={isSubmitting} >Send</Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    </>
};

const loginSchema = Yup.object().shape({
    username: Yup.string()
    .min(2,"Too short!")
    .max(20,"Too long!")
    .required("Required"),
    password: Yup.string()
    .min(6,"Too short!")
    .required("Required"),
})

const registerSchema = Yup.object().shape({
    username: Yup.string()
    .min(2,"Too short!")
    .max(20,"Too long!")
    .required("Required"),
    email: Yup.string()
    .email("Invalid email")
    .required("Required"),
    password: Yup.string()
    .min(6,"Too short!")
    .required("Required"),
    password2:Yup.string()
    .oneOf([Yup.ref('password'),null],"Password must match")
    .required("Required")
})


export default Auth;