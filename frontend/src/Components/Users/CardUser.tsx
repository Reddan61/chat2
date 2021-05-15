import React from "react"
import { Avatar, Button, Card, CardActions, CardHeader,Typography } from "@material-ui/core";
import { IUser } from "../Redux/Reducers/usersReducer";
import { getAvatarSRC } from "../../Utils/getAvatarSrc";
import { useDispatch, useSelector } from "react-redux";
import { createRoomThunk } from "../Redux/Reducers/messagesReducer";
import { StateType } from "../Redux/store";
import { useHistory } from "react-router";


const CardUser: React.FC<IUser> = (props) => {
    const dispatch = useDispatch();
    const {id,token} = useSelector((state:StateType) => state.AuthPage)
    const history = useHistory();
    async function createRoom() {
        await dispatch(createRoomThunk(id!,props._id,token!));
        history.push('/messages')
    }
    return <Card variant={"elevation"} >
        <CardHeader avatar={
            <Avatar src={getAvatarSRC(props.avatar)} />
        }
            title={
                <Typography>
                    {props.username}
                </Typography>
            }
        />
        <CardActions>
            <Button size="small" color="primary" onClick = {createRoom}>
                Send message
            </Button>
        </CardActions>
    </Card>
}

export default CardUser;