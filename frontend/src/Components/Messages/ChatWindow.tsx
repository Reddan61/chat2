import {Container, Box,makeStyles } from "@material-ui/core";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { StateType } from "../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { chooseRoomThunk } from "../Redux/Reducers/messagesReducer";
import ChatBottom from "./ChatBottom";
import ChatMessagesRoom from "./ChatMessagesRoom";

const ChatWindow:React.FC<{}> = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const myRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        if (myRef && myRef.current) {
            myRef.current.scrollTop = myRef.current.scrollHeight;
        }
    },[])

    return  <Container className = {classes.root}>
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
    <ChatMessagesRoom ref = {myRef}/>
    <ChatBottom />
</Container>
}

const useStyles = makeStyles((theme) => ({
    root: {
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        maxWidth:"900px"
    }
}))
export default ChatWindow;