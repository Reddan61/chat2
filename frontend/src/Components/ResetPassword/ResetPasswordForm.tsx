import { Field, Form, Formik } from "formik"
import React from "react"
import { renderTextField } from "../Formik/Fields/Fields"
import * as Yup from 'yup';
import { Button, DialogActions } from "@material-ui/core";
import { authApi } from "../API/API";
import { RouteComponentProps, withRouter } from "react-router";

type resetPasswordFormType = {
    password:string,
    password2:string
}
type resetPasswordPropsType = {
    openNotificationWithSettings?: (bool: boolean, msg: string, sev: "success" | "error") => void
}

const ResetPasswordForm:React.FC<RouteComponentProps<{token:string}> & resetPasswordPropsType> = (props) => {
    const submit = async (values: resetPasswordFormType, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        if(props.match.params.token) {
            const resetToken = props.match.params.token;
            const data = Object.assign({},values,{resetToken});
            const response = await authApi.resetPassword(data);
            if(response.status === "success") {
                props.openNotificationWithSettings!(true,response.data.message,"success")
                return
            } else {
                props.openNotificationWithSettings!(true,"Error","error")
            }
            setSubmitting(false);
        }
    }
    function redirect() {
        props.history.push("/auth");
    }
    return <Formik
        initialValues={{ password: '',password2: "" }}
        onSubmit={submit}
        validationSchema={resetPasswordSchema}
    >   
    {({values, isSubmitting,touched,errors}) => <Form>
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
            <Button color="primary" onClick = {redirect}>
                Back
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
                Send
            </Button>
        </DialogActions>
    </Form>
    }

    </Formik>
}

const resetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Too short!")
        .required("Required"),
    password2: Yup.string()
        .oneOf([Yup.ref('password'), null], "Password must match")
        .required("Required")
})

export default withRouter(ResetPasswordForm);