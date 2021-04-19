import React from "react"
import TextField from "@material-ui/core/TextField";
import { FieldProps } from "formik";




export const renderTextField:React.SFC<FieldProps<any>> = ({field,form, ...custom}) => (
    <TextField
        {...field}
        {...custom}
    />
);