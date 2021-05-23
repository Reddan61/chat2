import { Box, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react"
import { getUploadsSRC } from "../../Utils/getUploadsSRC";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

interface IProps {
    audio:string
}

const AudioComponent:React.FC<IProps> = (props) => {
    const classes = useStyles();
    const [isPlaying,setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const togglePlay = () => {
        if(audioRef && audioRef.current) {
            if(isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    }
    const editedTime = (time:number) => {
        const mins = Math.floor(time / 60);
        const secs = Number((time % 60).toFixed());
        return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };
    useEffect(() => {
        if(audioRef && audioRef.current) {
            audioRef.current.onplaying = () => {
                setPlaying(true);
            }
            audioRef.current.onpause = () => {
                setPlaying(false);
            }
            audioRef.current.onended = () => {
                setPlaying(false);
                setCurrentTime(0);
                setProgress(0);
            }
            audioRef.current.ontimeupdate = () => {
                const duration = (audioRef.current && audioRef.current.duration) || 0;
                setCurrentTime(audioRef!.current!.currentTime);
                setProgress((audioRef!.current!.currentTime / duration) * 100);
            }
        }
    },[])

    return <Box className = {classes.root}>
        <audio ref = {audioRef} src = {getUploadsSRC(props.audio)}  preload = {"auto"} className = {classes.audio}/>
        <Box onClick = {togglePlay}>
            {!isPlaying
            ?
            <PlayCircleFilledIcon color="primary" className = {classes.button}/>
            :
            <PauseCircleFilledIcon color="primary" className = {classes.button}/>
            }
        </Box>
       
        <LinearProgress variant="determinate" value={progress} className = {classes.progress}/>
        <Typography className = {classes.time}>
            {editedTime(currentTime)}
        </Typography>
    </Box>
}


const useStyles = makeStyles(() => ({
    root:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    button: {
        cursor:"pointer"
    },
    audio: {
        display:"none"
    },
    progress:{
        width:"200px",
        margin:"0 0 0 10px"
    },
    time: {
        alignSelf:"flex-start",
        fontSize:"14px",
        margin:"2px 0 0 5px"
    }
}))
export default AudioComponent;