import React, { ComponentType } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { StateType } from "../Redux/store";




export function WithAuth<WP>(Component:ComponentType<WP>) {
    const WithComponent:React.FC<{}> = (props) => {
        const {isAuth} = useSelector((state:StateType) => state.AuthPage)
        if(!isAuth) {
            return <Redirect to = "/auth"/>
        }
        return <Component {...props as WP}/>
    }

    return WithComponent;
}


