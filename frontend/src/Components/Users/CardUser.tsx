import React from "react"
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, IconButton, makeStyles, Paper, Typography } from "@material-ui/core";
import EmailIcon from '@material-ui/icons/Email';
import { IUser } from "../Redux/Reducers/usersReducer";
import { getAvatarSRC } from "../../Utils/getAvatarSrc";


const CardUser: React.FC<IUser> = (props) => {

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
            <Button size="small" color="primary">
                Send message
                </Button>
        </CardActions>
    </Card>
}

export default CardUser;