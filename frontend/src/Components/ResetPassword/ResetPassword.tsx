import { Container, Grid } from "@material-ui/core";
import React from "react";
import OpenNotification from "../openNotification/OpenNotification";
import ResetPasswordForm from "./ResetPasswordForm";


const ResetPassword = () => {
    return <React.Fragment>
        <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <OpenNotification>
                    <ResetPasswordForm />
                </OpenNotification>
            </Grid>
        </Grid>
    </React.Fragment>
}




export default ResetPassword;