import { loginFormDataType, loginResponseDataType} from './../Redux/Reducers/authReducer';
import axios from "axios";
import { registrationFormDataType } from "../Redux/Reducers/authReducer";
import { AlternateEmailRounded, ErrorOutlineTwoTone } from '@material-ui/icons';


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
        }).catch((e) => {
            console.log(e.response)
            return e.response
        }) 
    },
    updateAvatar: (token:string,data:any) => {
        return instance.put('/usersAvatar',data,{headers:{'token': token}})
        .then((response) => {
            return response.data
        }).catch((e) => {
            return e.response
        })
    },
    forgotPassword: (email:string) => {
        return instance.post('/users/fargotPassword',{email}).then((response) => {
            return response.data
        }).catch(e => {
            return e.response
        })
    },
    resetPassword: ({resetToken,password,password2}:resetPasswordAPIType) => {
        return instance.post('/users/resetPassword',{resetToken,password,password2}).then((response) => {
            return response.data
        }).catch(e => {
            return e.response.data
        })
    }
};


export const usersAPI = {
    getUsers: (page:string,search:string) => {
        return instance.get(`/users?pageNumber=${page}&userNameSearch=${search}`).then((response) => {
            return response.data
        }).catch(e => {
            return e.response.data
        })
    }
}

export const messagesAPI = {
    getRooms: (userId:string,token:string) => {
        return instance.get(`/messages?id=${userId}`,{headers:{'token':token}}).then((response) => {
            return response.data;
        }).catch(e => {
            return e.response.data
        })
    },
    createRoom: (meId:string,userId:string,token:string) => {
        return instance.post(`/messages`,{user1Id:meId,user2Id:userId},{headers:{'token': token}})
        .then(response => response.data)
        .catch( e => e.response.data)
    },
    getRoomById: (roomId:string,token:string) => {
        return instance.post(`/messages/roomId`,{roomId},{headers:{'token': token}})
        .then(response => response.data)
        .catch( e => e.response.data)
    }
}

type resetPasswordAPIType = {
    resetToken:string,
    password:string,
    password2:string
}