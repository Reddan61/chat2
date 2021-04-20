import { loginFormDataType, loginResponseDataType} from './../Redux/Reducers/authReducer';
import axios from "axios";
import { registrationFormDataType } from "../Redux/Reducers/authReducer";
import { ErrorOutlineTwoTone } from '@material-ui/icons';


let instance = axios.create({
    withCredentials:true,
    baseURL:`http://localhost:8888/`
})



export const authApi = {
    registration: ({username,password,email,password2}:registrationFormDataType) => {
        return instance.post<{status:"success" | "error", data:loginResponseDataType}>(`/auth/register`,{username,password,email,password2})
        .then((response) => {
            return response.data
        })
        .catch(error => {
            return error.response.data
        })
    },
    login: ({username,password} : loginFormDataType) => {
        return instance.post<{status:"success" | "error", data:loginResponseDataType}>('/auth/login', {username,password})
        .then((response) => {
            return response.data
        })
        .catch(error => {
            return error.response.data
        })
    },
    me: (token:string) => {
        return instance.get<{status:"success" | "error", data:loginResponseDataType}>('/users/me',{headers:{'token':token}})
        .then((response) => {
            return response.data
        })
    }
};