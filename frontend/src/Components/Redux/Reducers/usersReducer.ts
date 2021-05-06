import { usersAPI } from "../../API/API";
import { ActionsTypes, ThunkActionType } from "../store";

const getUsers = "GETUSERS";

const initialState = {
    users:null as usersType | null,
    totalPages: null as number | null
}
type initialStateType = typeof initialState;
type actionType = ActionsTypes<typeof usersReducerActions>

export interface IUser {
    avatar: string,
    _id: string,
    username: string,
}
type usersType = Array<IUser>

const UserReducer = (state:initialStateType = initialState,action:actionType):initialStateType => {
    switch(action.type) {
        case "GETUSERS": 
            return {...state,
                users: action.payload.users,
                totalPages:action.payload.totalPageCount
            }
        default: return state
    }
}

const usersReducerActions = {
    getUsersAC: (payload: {users:usersType,totalPageCount:number}) => ({type:getUsers,payload}) as const
};

export default UserReducer;


export const getUsersThunk = ({page = "1",search = ""}: IgetUsers): ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
            const response = await usersAPI.getUsers(page,search);
            if(response.status === "success") {
                dispatch(usersReducerActions.getUsersAC(response.data))
            }
            else {
                return
            }
        }
        catch(e) {

        }
    }
}

export interface IgetUsers {
    page?:string,
    search?:string
}