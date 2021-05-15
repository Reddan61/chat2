import {combineReducers, applyMiddleware, createStore, Action} from "redux";
import thunk, { ThunkAction } from "redux-thunk";
import AuthReducer from "./Reducers/authReducer"
import MessagesReducer from "./Reducers/messagesReducer";
import UserReducer from "./Reducers/usersReducer";



let reducers =combineReducers({
    AuthPage:AuthReducer,
    UsersPage:UserReducer,
    MessagesPage:MessagesReducer
});


const store = createStore(reducers,applyMiddleware(thunk));

//@ts-ignore
window.store = store;

//thunk
export type ThunkActionType<AT extends Action,R = Promise<void>>
    = ThunkAction<R, ()=>StateType, unknown, AT>;


//action
export type ActionsTypes<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never



//state
type RootReducerType = typeof reducers;
export type StateType = ReturnType<RootReducerType>


export default store;