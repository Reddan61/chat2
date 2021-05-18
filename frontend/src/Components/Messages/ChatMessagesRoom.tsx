import { makeStyles } from "@material-ui/core";
import React from "react"
import { useSelector } from "react-redux";
import { StateType } from "../Redux/store";
import MessageCard from "./MessageCard";


const ChatMessagesRoom = React.forwardRef<HTMLDivElement>((props,ref) => {
    const classes = useStyles();
    const { rooms, changedRoomId } = useSelector((state: StateType) => state.MessagesPage)

    return <div ref={ref} className={classes.root}>
        {
            rooms?.filter((el) => el._id === changedRoomId ? true : false)[0].messages.map((el, index) => <MessageCard isFirst={index === 0} key={el.text + el.userBy + Math.random()} message={el} />)
        }
    </div>
})

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