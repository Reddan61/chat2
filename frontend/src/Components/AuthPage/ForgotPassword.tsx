import { Button, DialogActions } from "@material-ui/core";
import { Field, Form, Formik, FormikHandlers } from "formik";
import React from "react";
import * as Yup from 'yup';
import { authApi } from "../API/API";
import { renderTextField } from "../Formik/Fields/Fields";


type forgotPasswordType = {
    openForgotPassword: () => void,
    openNotificationWithSettings: (bool: boolean, msg: string, sev: "success" | "error") => void
}

const ForgotPassword: React.FC<forgotPasswordType> = (props) => {
    const submit = async (values:{email:string},actions:any) => {
        const response = await authApi.forgotPassword(values.email);
        if(response.status >= 400 && response.status < 500) {
            props.openNotificationWithSettings(true,response.data.message,response.data.status)
        }
        if(response.status === "success") {
            props.openNotificationWithSettings(true,response.data.message,response.status)
            actions.resetForm();
        }
    }
    return <Formik
        initialValues={{ email: "" }}
        onSubmit={submit}
        validationSchema={forgotPasswordSchema}
    >
        {
            ({ values, isSubmitting, errors, touched }) => <Form>
                <Field 
                    name="email" 
                    component={renderTextField}
                    label="Email"
                    margin="dense"
                    type="text"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email ? errors.email : null}
                    fullWidth
                />
                <DialogActions>
                    <Button onClick={props.openForgotPassword} color="primary">
                         Cancel
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                         Send
                    </Button>
                </DialogActions>
            </Form>
        }
    </Formik>
}

const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Required")
})

export default ForgotPassword;