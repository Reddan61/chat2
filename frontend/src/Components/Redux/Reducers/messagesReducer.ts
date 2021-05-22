import { IUser } from './usersReducer';
import { messagesAPI } from "../../API/API";
import { ActionsTypes, ThunkActionType } from "../store";
import { RoomService } from '@material-ui/icons';

const GETROOMS = "GETROOMS";
const CHOOSEROOM = "CHOOSEROOM";
const CREATEROOM = "CREATEROOM";
const ADDMESSAGE = "ADDMESSAGE";
const ADDNEWROOM = "ADDNEWROOM" ;

const initialState = {
    changedRoomId: null as string | null,
    rooms: null as Array<IRoom> | null 
}

export interface IRoom {
    _id: string,
    users: Array<IUser>,
    messages: Array<IMessage>
}
export interface IMessage {
    userBy:{
        _id:string,
        username:string,
        avatar:string
    },
    imagesSrc: Array<string>,
    text:string | null,
    audioSrc:string | null,
    date:string
}

type initialStateType = typeof initialState;
type actionType = ActionsTypes<typeof messagesReducerActions>

const MessagesReducer = (state:initialStateType = initialState,action:actionType) => {
    switch(action.type) {
        case "GETROOMS": 
            return {...state,rooms: action.payload}
        case 'CHOOSEROOM': 
            return {...state,changedRoomId: action.id}
        case 'CREATEROOM': 
            return {...state, rooms: [...state.rooms!,action.room],changedRoomId:action.room._id}
        case 'ADDMESSAGE': 
                const rooms = state.rooms!.map(el => {
                    if(el._id === action.payload.roomId) {
                        return {...el,messages:[...el.messages,action.payload.message ]}
                    }
                    return el
                })
            return {...state,rooms}
        case 'ADDNEWROOM':
            return {...state, rooms: [...state.rooms!,action.payload]}
        default: 
            return state 
    }
};


export const messagesReducerActions = {
    getRoomsAC: (payload: Array<IRoom>) => ({type:GETROOMS,payload}) as const,
    chooseRoomAC: (id: string | null) => ({type:CHOOSEROOM,id}) as const,
    createRoomAC: (room:IRoom) => ({type:CREATEROOM,room}) as const,
    addMessageAC: (payload:{roomId:string,message:IMessage}) => ({type:ADDMESSAGE,payload}) as const,
    addNewRoomAC: (payload:IRoom) => ({type:ADDNEWROOM,payload}) as const
}

export default MessagesReducer;

export const getRoomsThunk = (userId:string,token:string):ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
            const response = await messagesAPI.getRooms(userId,token);
            if(response.status === "success") {
                dispatch(messagesReducerActions.getRoomsAC(response.data))
            }
        }
        catch(e) {
            console.log(e)
        }
    }
}

export const chooseRoomThunk = (id:string | null):ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
            dispatch(messagesReducerActions.chooseRoomAC(id));
        }
        catch(e) {
            console.log(e)
        }
    }
}

export const createRoomThunk = (meId:string,userId:string,token:string):ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
            const response = await messagesAPI.createRoom(meId,userId,token);
            if(response.status === "success") {
                dispatch(messagesReducerActions.createRoomAC(response.data));
            }
        }
        catch(e) {
            console.log(e)
        }
    }
}

export const addNewRoomThunk = (roomId:string,token:string):ThunkActionType<actionType> => {
    return async (dispatch) => {
        try {
            const response = await messagesAPI.getRoomById(roomId,token);
            if(response.status === "success") {
                dispatch(messagesReducerActions.addNewRoomAC(response.data));
            }
        }
        catch(e) {
            console.log(e)
        }
    }
}

