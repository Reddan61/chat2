import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { chooseRoomThunk, IRoom } from "../Redux/Reducers/messagesReducer";



const RoomCard:React.FC<{room:IRoom}> = (props) => {
    const dispatch = useDispatch();
    const usersName:Array<string> = [];
    props.room.users.forEach(el => usersName.push(el.username))
    const roomName = usersName.join(`/`).slice(0,20);

    return <Card variant={"elevation"} onClick = {() => {dispatch(chooseRoomThunk(props.room._id))}}style = {{
        cursor:'pointer'
    }}>
        <CardContent>
            <Typography>{roomName} ...</Typography>
        </CardContent>
    </Card>
}

export default RoomCard;