import { Button, Container, Box, TextField, makeStyles, createStyles, withStyles } from "@material-ui/core";
import React, { MutableRefObject, Ref, useEffect, useRef, useState } from "react"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MessageCard from "./MessageCard";
import { StateType } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { chooseRoomThunk } from "../Redux/Reducers/messagesReducer";
import socket from "../../Utils/socket";
import { autofill } from "redux-form";

const ChatWindow:React.FC<{}> = (props) => {
    const classes = useStyles();
    const [text,setText] = useState('');
    const {rooms,changedRoomId} = useSelector((state:StateType) => state.MessagesPage)
    const {id,token} = useSelector((state:StateType) => state.AuthPage)
    const dispatch = useDispatch();
    const myRef = useRef<HTMLDivElement>(null);
    
    function sendMessage() {
        socket.emit("SEND:MESSAGE",{token,userId:id,text,roomId:changedRoomId})
        setText('');
    }

    useEffect(() => {
        if (myRef && myRef.current) {
            myRef.current.scrollTop = myRef.current.scrollHeight;
        }
    },[])
    return  <Container
        className = {classes.container}
    >
    <Box style = {{
        width:"100%"
    }}>
        <ArrowBackIcon onClick = {() => {
            dispatch(chooseRoomThunk(null))
        }}
        style = {{
            cursor:'pointer'
        }}
        />
    </Box>
    <div 
        ref = {myRef}
        className = {classes.div}
    >
        {
            rooms?.filter((el) => el._id === changedRoomId?true:false)[0].messages.map((el,index) => <MessageCard isFirst = {index === 0} key = {el.text + el.userBy + Math.random()} message = {el}/>)
        }
        
    </div>
    <Box className={classes.bottom}>
        <TextField multiline rowsMax={3} style = {{
            marginLeft:"15px",
            minWidth:"300px"
        }}
        value = {text}
        onChange = {(e) => {
            setText(e.target.value);
        }}
        />
        <Button size = {"large"} color = {"primary"} onClick = {() => sendMessage()}> Send</Button>
    </Box>
</Container>
}
const useStyles = makeStyles((theme) => ({
    div: {
        margin:"20px 0 0",
        display:"flex",
        flexDirection:"column",
        width:"100%",
        overflow:'auto',
        height:"600px",
    },
    bottom: {
        width:"100%",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        margin:"20px 0 0"
    },
    container: {
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        maxWidth:"900px"
    }
}))
export default ChatWindow;