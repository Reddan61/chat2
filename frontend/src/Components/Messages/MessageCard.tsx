import { Avatar, Box, Card, CardContent,Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { IMessage} from "../Redux/Reducers/messagesReducer";
import { StateType } from "../Redux/store";


const MessageCard: React.FC<{ message: IMessage,isFirst:boolean }> = (props) => {
    const { id } = useSelector((state: StateType) => state.AuthPage)
    const message = props.message;
    return  <Card style={{
        maxWidth:"350px",
        minWidth:"350px",
        minHeight:"50px",
        alignSelf: message.userBy._id === id ? "flex-end" : "flex-start",
        margin:props.isFirst?'0':'10px 0 0'
    }}>
        <MessageCardText message = {message}/>
    </Card>
}




const MessageCardText: React.FC<{message:IMessage}> = (props) => {
    const [date,setDate] = useState('');
    
    
    useEffect(() => {
        const msgDate = new Date(props.message.date);
        const hours = msgDate.getHours().toString().length === 1?'0'+msgDate.getHours():msgDate.getHours();
        const minutes = msgDate.getMinutes().toString().length === 1 ? '0' + msgDate.getMinutes():msgDate.getMinutes();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
    
        if(msgDate.valueOf() < today) {
            const month = msgDate.getMonth().toString().length === 1?'0'+msgDate.getMonth():msgDate.getMonth();
            const year = msgDate.getFullYear();
            setDate(date + " " + year +":"+month);
        } else {
            setDate(hours + ":" + minutes);
        }
    },[])
   
  

    const messageText = props.message.text;
    function splitText(text:string,lengthRow:number) {
        const arr = text.split('').map((el,index) => {
            if(!((index + 1) % lengthRow) && index !== 0) {
                return el + '\n'
            }
            return el
        });
        return arr.join('');
    }

    return <CardContent style={{
        paddingBottom: "10px",
        display:"flex"
    }}>
        <Avatar src = {props.message.userBy.avatar}/>
        <Box style = {{
            marginLeft:"10px"
        }}>
            <Typography>{props.message.userBy.username} {date}</Typography>
            <Typography style = {{
                
            }}>{splitText(messageText,30)}</Typography>
        </Box>
    </CardContent>
}



export default MessageCard;