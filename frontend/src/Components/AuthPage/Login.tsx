import { Box, Button, DialogActions, Link } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { authApi } from "../API/API";
import { loginFormDataType, loginThunk } from "../Redux/Reducers/authReducer";
import { renderTextField } from "../Formik/Fields/Fields";

type loginFormPropsType = {
    openAuth: () => void,
    openNotificationWithSettings: (bool: boolean, msg: string, sev: "success" | "error") => void,
    openForgotPassword: () => void
}

const LoginForm: React.FC<loginFormPropsType> = (props) => {
    const dispatch = useDispatch();
    const { openNotificationWithSettings } = props;

    const submit = async (values: loginFormDataType, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        let response = await authApi.login(values);
        if (response.status === "success") {
            dispatch(loginThunk(response.data));
        } else {
            openNotificationWithSettings(true, "Username or password is incorrect", "error");
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
                        fullWidth
                        margin="dense"
                        label="Username"
                        type="text"
                        name="username"
                        component={renderTextField}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username ? errors.username : null}
                    />
                    <Field
                        fullWidth
                        label="password"
                        margin="dense"
                        type="password"
                        name="password"
                        component={renderTextField}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password ? errors.password : null}
                    />
                    <DialogActions>
                        <Box style={{
                            flex: "1 0 0"
                        }}>
                            <Link
                                component="button"
                                onClick={(e:any) => {
                                    e.preventDefault();
                                    props.openAuth();
                                    props.openForgotPassword();
                                }}
                            >
                                Forgot password
                            </Link>
                        </Box>
                        <Button onClick={props.openAuth} color="primary">Cancel</Button>
                        <Button type="submit" color="primary" disabled={isSubmitting} >Send</Button>
                    </DialogActions>
                </Form>
            )}
        </Formik>
    </>
};

const loginSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, "Too short!")
        .max(20, "Too long!")
        .required("Required"),
    password: Yup.string()
        .min(6, "Too short!")
        .required("Required"),
})

export default LoginForm;