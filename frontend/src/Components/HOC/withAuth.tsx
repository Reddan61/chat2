import React, { ComponentType, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import Loader from "../Loader/Loader";
import { isLoginnedThunk } from "../Redux/Reducers/authReducer";
import { StateType } from "../Redux/store";




export function WithAuth<WP>(Component:ComponentType<WP>) {
    const WithComponent:React.FC<{}> = (props) => {
        const {isAuth} = useSelector((state:StateType) => state.AuthPage)
        const [isLoading,setLoading] = useState(true);
        const dispatch = useDispatch();

        async function checkAuth() {
            setLoading(true);
            await dispatch(isLoginnedThunk());
            setLoading(false);
        }
        useEffect(() => {
            checkAuth();
        },[])

        if(isLoading){
            return <Loader />
        }

        if(!isAuth) {
            return <Redirect to = "/auth"/>
        }
        
        return <Component {...props as WP}/>
    }

    return WithComponent;
}


