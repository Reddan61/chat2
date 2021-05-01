import { Snackbar } from "@material-ui/core";
import { PinDropSharp } from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert"
import React, { useEffect, useState } from "react";

type propsType = {
    children:JSX.Element
}

const OpenNotification:React.FC<propsType> = ({children}) => {
    const [open, setOpenNotification] = useState<boolean>(false);
    const [message, setMessageNotification] = useState<string>('');
    const [severity, setSeverityNotification] = useState<"success" | "error">("success");

    const openNotificationWithSettings = (bool:boolean,msg:string,sev:"success" | "error") => {
        setMessageNotification(msg);
        setSeverityNotification(sev);
        setOpenNotification(bool)
    }
    return <>
        {React.Children.map(children, (child) => {
            return React.cloneElement(child as React.ReactElement<any>,{openNotificationWithSettings} as {
                openNotificationWithSettings: (bool:boolean,msg:string,sev:"success" | "error") => void
            })
        })
        } 
        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpenNotification(false)}>
            <Alert onClose={() => setOpenNotification(false)} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    </>
}

export default OpenNotification;