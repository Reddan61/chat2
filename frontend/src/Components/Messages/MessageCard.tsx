import { Avatar, Box, Card, CardContent,Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { getAvatarSRC } from "../../Utils/getAvatarSrc";
import { IMessage} from "../Redux/Reducers/messagesReducer";
import { StateType } from "../Redux/store";


const MessageCard: React.FC<{ message: IMessage,isFirst:boolean }> = (props) => {
    const { id } = useSelector((state: StateType) => state.AuthPage)
    const refRoot = useRef<HTMLDivElement>(null);
    const refWrapped = useRef<HTMLDivElement>(null);
    const [date,setDate] = useState('');
    useEffect(() => {
        if(refRoot && refRoot.current && refWrapped && refWrapped.current) {     
            refRoot.current.style.minHeight = String(refWrapped.current.clientHeight) + 'px';    
        }

        const msgDate = new Date(props.message.date);
        const hours = msgDate.getHours().toString().length === 1?'0'+msgDate.getHours():msgDate.getHours();
        const minutes = msgDate.getMinutes().toString().length === 1 ? '0' + msgDate.getMinutes():msgDate.getMinutes();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
    
        if(msgDate.valueOf() < today) {
            const month = msgDate.getMonth().toString().length === 1?'0'+msgDate.getMonth():msgDate.getMonth();
            const year = msgDate.getFullYear();
            setDate(year +":"+month);
        } else {
            setDate(hours + ":" + minutes);
        }
        
    },[])

    function splitText(text:string,lengthRow:number) {
        const arr = text.split('').map((el,index) => {
            if(!((index + 1) % lengthRow) && index !== 0) {
                return el + '\n'
            }
            return el
        });
        return arr.join('');
    }
    return  <Card ref = {refRoot} variant="outlined" style={{
        maxWidth:"350px",
        minWidth:"350px",
        minHeight:"80px",
        alignSelf: props.message.userBy._id === id ? "flex-end" : "flex-start",
        margin:props.isFirst?'0':'10px 0 0'
    }}>
        <CardContent  ref = {refWrapped} style={{
            paddingBottom: "10px",
            display:"flex"
        }}>
            <Avatar src = {props.message.userBy.avatar}/>
            <div style = {{
                marginLeft:"10px"
            }}>
                <Typography>{props.message.userBy.username} {date}</Typography>
                <Typography>{splitText(props.message.text,30)}</Typography>
                <Box style = {{
                    padding:'10px 0 0 0',
                    display:'flex',
                    flexWrap:"wrap",
                    maxWidth:'200px'
                }}>
                    {props.message.imagesSrc.map((el,index) => <img style = {{
                        minWidth:"100px",
                        maxWidth:"100px",
                        minHeight:"100px",
                        maxHeight:"100px"
                    }} key = {String(el + index)} src = {getAvatarSRC(el)} alt = {"img"}/>)}
                </Box>
            </div>
        </CardContent>
    </Card>
}



export default React.memo(MessageCard);