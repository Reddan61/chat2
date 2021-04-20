import { ActionsTypes, ThunkActionType } from './../store';
import {authApi} from "../../API/API"

const registration = "REGISTRATION";
const login = "LOGIN";
const isLoginned = "ISLOGINNED";


const initialState = {
    token:null as string | null,
    email:null as string | null,
    username:null as string | null,
    confirmed:false,
    id:null as string | null,
    isAuth:false
}

type initialStateType = typeof initialState;
type actionType = ActionsTypes<typeof authReducerActions>

const AuthReducer = (state = initialState,action:actionType): initialStateType => {
    switch(action.type) {
        case registration :
            return {...state}
        case login :
            localStorage.setItem('token',action.data.token)
            return {...state,
                email:action.data.email,
                id:action.data._id,
                username:action.data.username,
                token:action.data.token,
                isAuth:true
            }
        case isLoginned:
            return {...state,
                confirmed:action.data.confirmed,
                username: action.data.username,
                email:action.data.email,
                isAuth:true,
                id:action.data._id,
                token:localStorage.getItem('token')
            }
        default:
            return state
    }
}

export default AuthReducer;


const authReducerActions = {
    registrationAC: (data:registrationResponseDataType) => ({type:registration,data}) as const,
    loginAC: (data:loginResponseDataType) => ({type:login,data}) as const,
    me:(data:registrationResponseDataType) => ({type:isLoginned,data}) as const
}



export const registrationThunk = (data: registrationResponseDataType): ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
             dispatch(authReducerActions.registrationAC(data))
        } 
        catch(e) {
            return ;
        }
    }
};


export const loginThunk = (data:loginResponseDataType): ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
             dispatch(authReducerActions.loginAC(data))
        } 
        catch(e) {
            console.log(e);
            return
        }
    }
}


export const isLoginnedThunk = (): ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
            if(localStorage.getItem('token')) {
                let response = await authApi.me(localStorage.getItem('token')!);
                dispatch(authReducerActions.me(response.data));
            } else {
                return
            }
        }
        catch(e) {
            console.log(e);
            return
        }
        
    }
}



export type registrationFormDataType = {
    username:string,
    email:string,
    password: string,
    password2:string
}
export type loginFormDataType = {
    username: string,
    password:string
}

export type registrationResponseDataType = {
    confirmed: boolean,
    email:string,
    username:string
    _id:string
}

export type loginResponseDataType = {
    confirmed: boolean,
    email:string,
    token:string,
    username:string
    _id:string
}