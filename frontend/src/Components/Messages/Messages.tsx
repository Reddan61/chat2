import {Container, Grid} from "@material-ui/core";
import React, { MutableRefObject, Ref, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { WithAuth } from "../HOC/withAuth";
import { addNewRoomThunk, getRoomsThunk, IMessage, IRoom, messagesReducerActions } from "../Redux/Reducers/messagesReducer";
import store, { StateType } from "../Redux/store";
import RoomCard from "./RoomCard";
import Loader from "../Loader/Loader";
import ChatWindow from "./ChatWindow";
import { io } from "socket.io-client";
import socket from "../../Utils/socket"



const Messages = () => {
    const [isLoading,setLoading] = useState(true);
    const {id,token} = useSelector((state:StateType) => state.AuthPage)
    const {rooms,changedRoomId} = useSelector((state:StateType) => state.MessagesPage)
    const dispatch = useDispatch();

    async function getRooms() {
        setLoading(true);
        await dispatch(getRoomsThunk(id!,token!));
        setLoading(false);
    }
    
    useEffect(() => {
        getRooms();
        socket.connect();
        socket.on("NEW:MESSAGE", async(data: {roomId:string,message:IMessage}) => {
            const {rooms} = store.getState().MessagesPage;
            const room = rooms?.filter(el => {
                return el._id === data.roomId ? true : false});
            if(room!.length === 0) {
               await dispatch(addNewRoomThunk(data.roomId,token!))
            } else {           
                dispatch(messagesReducerActions.addMessageAC(data))
            }
        });
        return () => {
            socket.off("NEW:MESSAGE");
            socket.disconnect();
        }
    },[])

    if(isLoading) return <Loader />

    return <React.Fragment>
        <Container style={{
            paddingTop:"20px"
        }}>
            {!changedRoomId && <Grid
                container
                spacing={2}
            >
                {rooms?.map(el => <Grid item xs = {3} key = {el._id}>
                    <RoomCard  room = {el}/>
                </Grid>)}
            </Grid>}
            {changedRoomId && <ChatWindow/>}
        </Container>
    </React.Fragment>
};


export default WithAuth(Messages);