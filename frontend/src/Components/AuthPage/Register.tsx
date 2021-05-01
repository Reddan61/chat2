import { Button, DialogActions } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from 'yup';
import { useDispatch } from "react-redux";
import { authApi } from "../API/API";
import {registrationFormDataType, registrationThunk } from "../Redux/Reducers/authReducer";
import { renderTextField } from "../Formik/Fields/Fields";



type registrationFormPropsType = {
    openReg: () => void,
    openNotificationWithSettings: (bool: boolean, msg: string, sev: "success" | "error") => void
}

const RegistrationForm: React.FC<registrationFormPropsType> = (props) => {
    const dispatch = useDispatch();
    const { openNotificationWithSettings } = props;

    const submit = async (values: registrationFormDataType, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        let response = await authApi.registration(values);
        if (response.status === "success") {
            dispatch(registrationThunk(response.data))
            openNotificationWithSettings(true, "Success", "success");
            props.openReg();
        } else {
            openNotificationWithSettings(true, "Error", "error");
            setSubmitting(false)
        }
    }


    return <Formik
        initialValues={{ password: '', username: "", email: "", password2: "" }}
        onSubmit={submit}
        validationSchema={registerSchema}
    >
        {({ values, isSubmitting, errors, touched }) => <Form>
            <Field name="username" autoFocus component={renderTextField}
                label="UserName"
                margin="dense"
                type="text"
                fullWidth
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username ? errors.username : null}
            />
            <Field name="email" component={renderTextField}
                label="Email Address"
                margin="dense"
                type="email"
                fullWidth
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email ? errors.email : null}
            />
            <Field name="password" component={renderTextField}
                label="Password"
                margin="dense"
                type="password"
                fullWidth
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password ? errors.password : null}
            />
            <Field name="password2" component={renderTextField}
                label="Confirm Password"
                margin="dense"
                type="password"
                fullWidth
                error={touched.password2 && Boolean(errors.password2)}
                helperText={touched.password2 ? errors.password2 : null}
            />
            <DialogActions>
                <Button onClick={props.openReg} color="primary">
                    Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                    Send
                </Button>
            </DialogActions>
        </Form>
        }
    </Formik>
};



const registerSchema = Yup.object().shape({
    username: Yup.string()
        .min(2, "Too short!")
        .max(20, "Too long!")
        .required("Required"),
    email: Yup.string()
        .email("Invalid email")
        .required("Required"),
    password: Yup.string()
        .min(6, "Too short!")
        .required("Required"),
    password2: Yup.string()
        .oneOf([Yup.ref('password'), null], "Password must match")
        .required("Required")
})


export default RegistrationForm;
