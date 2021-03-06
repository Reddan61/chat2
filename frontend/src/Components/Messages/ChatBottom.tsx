import { Box, IconButton, makeStyles, TextField } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react"
import ChoosedImages from "./ChoosedImages";
import socket from "../../Utils/socket";
import { useSelector } from "react-redux";
import { StateType } from "../Redux/store";
import MicNoneIcon from '@material-ui/icons/MicNone';
import StopIcon from '@material-ui/icons/Stop';
import Recording from "../Recording/Recording";

interface IProps {
  
}


const ChatBottom:React.FC<IProps> = (props) => {
    const classes = useStyles();
    const [changedImages,setChangedImage] = useState<Array<{id:number,fileURL:string}>>([]);
    const [changedFiles,setChangedFiles] = useState<Array<{id:number,file:File}>>([]);
    const [text,setText] = useState('');
    const {id} = useSelector((state:StateType) => state.AuthPage)
    const {changedRoomId} = useSelector((state:StateType) => state.MessagesPage)
    const [isRecording,setRecording] = useState(false);
    const stopButtonRef = useRef<HTMLDivElement>(null);
    //const [audioUrl,setAudioUrl] = useState<string | null>(null)

    function sendTextMessage() {
            const files = new FormData();
            changedFiles.forEach(el => {
                files.append("file", el.file)
            })
            socket.emit("SEND:MESSAGE",{userId:id,text,roomId:changedRoomId,files:files.getAll('file')})
            setText('');
            setChangedImage([]);
            setChangedFiles([]);
       
    }
    function sendAudio(file:File) {
        socket.emit("SEND:MESSAGE/AUDIO",{userId:id,text,roomId:changedRoomId,file})
        setRecording(!isRecording)
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

    async function startRecord() {
        try{
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && isRecording) {
                setText('');
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(e => {throw new Error});
                const mediaRecorder = new MediaRecorder(stream);
                let chunks: BlobPart[] = [];
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                }
                mediaRecorder.onstop = function(e) {
                    //const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                    const file = new File(chunks,'audio.ogg', {type:"audio/ogg"})
                    chunks = [];
                    //const audioURL = window.URL.createObjectURL(blob);
                    sendAudio(file);
                }
                if(stopButtonRef && stopButtonRef.current) {
                    stopButtonRef.current.onclick = () => {
                        mediaRecorder.stop();
                    }
                }
            }
        }
        catch(e){
            setRecording(false);
            alert("You didn't allow to use the microphone")
        }
    }

    useEffect(() => {
        startRecord();
    },[isRecording])

    return <Box className={classes.root}>
        <Box className = {classes.container}>
            <Box className = {classes.inpustRoot}>
                {!isRecording &&
                <TextField multiline rowsMax={3} className = {classes.inputMessage}
                disabled = {isRecording}
                onKeyPress = {(e) => {
                    const keyCode = e.code || e.key;
                    if(keyCode == 'Enter' || keyCode == "NumpadEnter") {
                        e.preventDefault();
                        sendTextMessage();
                    }
                }}
                value = {text}
                onChange = {(e) => {
                    setText(e.target.value);
                }}
                />
                }
                {isRecording && <Recording />}
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
            </Box>
            <Box>
                {!isRecording
                ?
                    <IconButton  onClick = {() => {
                        setRecording(!isRecording);
                    }} color="primary" aria-label="record voice" component="span">
                        <MicNoneIcon />
                    </IconButton>
                :
                <IconButton ref = {stopButtonRef} color="primary" aria-label="record voice" component="span">
                    <StopIcon />
                </IconButton>
                }
            </Box>
        </Box>
        <ChoosedImages deleteImage = {deleteImage} changedImages = {changedImages}/>
</Box>
}

const useStyles = makeStyles(() => ({
    root: {
        display:"flex",
        flexDirection:"column",
        width:"100%",
        alignItems:"flex-start",
        justifyContent:"flex-start",
        margin:"20px 0 0",
        padding:"0 0 0 15px"
    },
    container: {
        display:"flex"
    },
    inpustRoot: {
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center"
    },
    inputMessage: {
        minWidth:"300px"
    },
    messageRoot: {
        minWidth:"300px"
    },
    photoIcon: {
        margin:"5px"
    },
    inputPhoto: {
        display: 'none'
    },
   
}))

export default ChatBottom;