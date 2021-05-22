import { makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { StateType } from "../Redux/store";
import MessageCard from "./MessageCard";


const ChatMessagesRoom = () => {
    const classes = useStyles();
    const { rooms, changedRoomId } = useSelector((state: StateType) => state.MessagesPage)
    const myRef = useRef<HTMLDivElement>(null);
    const [heightListDiv,setHeight] = useState(0);
    useEffect(() => {
        if (myRef && myRef.current) {
            setHeight(myRef.current.scrollHeight);
            myRef.current.scrollTop = myRef.current.scrollHeight;
        }
    },[])

    useEffect(() => {
        if (myRef && myRef.current) {
            const heightNewMessage = myRef.current.scrollHeight - heightListDiv;
            if(Math.floor(myRef.current.scrollHeight - myRef.current.scrollTop - heightNewMessage) <= myRef.current.clientHeight) {
                myRef.current.scrollTop = myRef.current.scrollHeight;
            }
            setHeight(myRef.current.scrollHeight);
        }
    },[rooms])
    const messages = rooms?.filter((el) => el._id === changedRoomId ? true : false)[0]
    .messages.map(function(el, index){
        return <MessageCard isFirst={index === 0} key={String(index + el.date)} message={el} />
    })
    
    return <div ref={myRef} className={classes.root} id = {"list"}>
        { messages }
    </div>
}

const useStyles = makeStyles(() => ({
    root: {
        display:"flex",
        flexDirection:"column",
        overflow:'auto',
        width:"100%",
        margin:"20px 0 0",
        minHeight:"600px",
        maxHeight:"600px"
    }
}));
export default ChatMessagesRoom;