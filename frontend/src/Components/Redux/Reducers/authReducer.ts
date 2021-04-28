import { ActionsTypes, ThunkActionType } from './../store';
import {authApi} from "../../API/API"
import actions from 'redux-form/lib/actions';

const registration = "REGISTRATION";
const login = "LOGIN";
const isLoginned = "ISLOGINNED";
const updateAvatar = "UPDATEAVATAR";
const logout = "LOGOUT";


const initialState = {
    token:null as string | null,
    email:null as string | null,
    username:null as string | null,
    confirmed:false,
    id:null as string | null,
    isAuth:false,
    avatarURL: null as string | null
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
                avatarURL: action.data.avatar,
                isAuth:true
            }
        case isLoginned:
            return {...state,
                confirmed:action.data.confirmed,
                username: action.data.username,
                email:action.data.email,
                isAuth:true,
                id:action.data._id,
                avatarURL: action.data.avatar,
                token:localStorage.getItem('token')
            }
        case 'UPDATEAVATAR':
            return {...state,
                avatarURL: action.data.avatar
            }
        case 'LOGOUT': 
            return {...state,...initialState}
        default:
            return state
    }
}

export default AuthReducer;



const authReducerActions = {
    registrationAC: (data:registrationResponseDataType) => ({type:registration,data}) as const,
    loginAC: (data:loginResponseDataType) => ({type:login,data}) as const,
    me:(data:registrationResponseDataType) => ({type:isLoginned,data}) as const,
    updateAvatarAC:(data:updateUserType) => ({type:updateAvatar,data}) as const,
    logoutAC:() => ({type:logout}) as const
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
                if(response.status === 401 && response.data === "Unauthorized" ) {
                    dispatch(logOutThunk());
                    return
                }
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

export const updateAvatarThunk = (data:any): ThunkActionType<actionType> => {
    return async (dispatch)  => {
        try {
            const token = localStorage.getItem('token')
            if(token) { 
                let response = await authApi.updateAvatar(token,data);
                if(response.status === 401 && response.data === "Unauthorized" ) {
                    dispatch(logOutThunk());
                    return
                }
                dispatch(authReducerActions.updateAvatarAC(response.data));
            } else {
                return
            }
           
        }
        catch(e) {
            console.log(e);
            return    
        }
    }
};


export const logOutThunk = (): ThunkActionType<actionType> => {
    return async(dispatch) => {
        try {
            localStorage.removeItem('token');
            dispatch(authReducerActions.logoutAC());
        }catch(e) {
            console.log(e);
            return  
        }
    }
}


export type updateUserType = {
    confirmed: boolean,
    email:string,
    username:string,
    _id:string,
    avatar : string
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
    _id:string,
    avatar:string
}

export type loginResponseDataType = {
    confirmed: boolean,
    email:string,
    token:string,
    username:string
    _id:string,
    avatar:string
}