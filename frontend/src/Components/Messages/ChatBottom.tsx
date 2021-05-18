import { Box, Button, IconButton, makeStyles, TextField } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import React, { SyntheticEvent, useState } from "react"
import ChoosedImages from "./ChoosedImages";
import socket from "../../Utils/socket";
import { useSelector } from "react-redux";
import { StateType } from "../Redux/store";


interface IProps {
  
}


const ChatBottom:React.FC<IProps> = (props) => {
    const classes = useStyles();
    const [changedImages,setChangedImage] = useState<Array<{id:number,fileURL:string}>>([]);
    const [changedFiles,setChangedFiles] = useState<Array<{id:number,file:File}>>([]);
    const [text,setText] = useState('');
    const {id} = useSelector((state:StateType) => state.AuthPage)
    const {changedRoomId} = useSelector((state:StateType) => state.MessagesPage)


    function sendMessage() {
        socket.emit("SEND:MESSAGE",{userId:id,text,roomId:changedRoomId})
        setText('');
    }

    function getImages(e:SyntheticEvent) {
        try {
            const extensions = ["image/jpg", "image/jpeg", "image/png"];
            const files = (e.target as HTMLInputElement).files;
            if(changedFiles.length + files!.length > 5 || changedFiles.length >= 5) {
                throw new Error("You can pass only 5 pictures")
            }
            if(files){
                [].forEach.call(files,(el:any) => {
                    if(extensions.indexOf(el.type) === -1) {
                        throw new Error("Only pictures are allowed")
                    }
                    const reader = new FileReader();
                    reader.readAsDataURL(el);
                    reader.onload = function(){
                        const randomId = Math.random() * 1000 + Math.random() * 1000;
                        // @ts-ignore
                        setChangedImage((state) => [...state,{id:randomId,fileURL: reader.result}]);
                        setChangedFiles((state) => [...state,{id:randomId,file:el}])
                    }
                    reader.onerror = function(){
                        throw new Error("Something was wrong!")
                    }
                })
            }   
        }
        catch(e:any) {
            alert(e.message)
        }
    }

    function deleteImage(id:number) {
        const images = changedImages.filter(el => el.id !== id)
        const files = changedFiles.filter(el => el.id !== id)
        setChangedImage(images);
        setChangedFiles(files);
    };


    return <Box className={classes.root}>
    <Box style = {{
        display:"flex",
        flexDirection:"column"
    }}>
        <TextField multiline rowsMax={3} className = {classes.inputMessage}
        value = {text}
        onChange = {(e) => {
            setText(e.target.value);
        }}
        />
        <ChoosedImages deleteImage = {deleteImage} changedImages = {changedImages}/>
    </Box>
    <Box>
        <input accept="image/*" 
            multiple className={classes.inputPhoto} 
            id="icon-button-file" type="file" 
            onChange = {(e) => {
                getImages(e)
                e.target.value = '';
            }}
        />
        <label htmlFor="icon-button-file" className = {classes.photoIcon}>
            <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
            </IconButton>
        </label>
        <Button size = {"large"} color = {"primary"} onClick = {() => sendMessage()}> Send</Button>
    </Box>
</Box>
}

const useStyles = makeStyles(() => ({
    root: {
        display:"flex",
        width:"100%",
        alignItems:"flex-start",
        justifyContent:"flex-start",
        margin:"20px 0 0"
    },
    inputMessage: {
        marginLeft:"15px",
        minWidth:"300px"
    },
    photoIcon: {
        margin:"5px"
    },
    inputPhoto: {
        display: 'none'
    }
}))

export default ChatBottom;