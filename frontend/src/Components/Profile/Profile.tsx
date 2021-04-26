import { Avatar, Box, Container } from "@material-ui/core"
import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { WithAuth } from "../HOC/withAuth";
import { updateUserThunk } from "../Redux/Reducers/authReducer";
import { StateType } from "../Redux/store";


const Profile = () => {
    const {avatarURL} = useSelector((state:StateType) => state.AuthPage )
    const dispatch = useDispatch();
    const avatarChange = (e:any) => {
        let file = e.target.files[0];
        if(e.target.files.length && (file.type === 'image/jpeg' || file.type === 'image/png' || file.mimetype === 'image/jpg')) {
            const data = new FormData();
            data.append("file",file)
            dispatch(updateUserThunk(data));
        }
    }
    return <React.Fragment>
        <Container style = {{paddingTop:"20px"}}>
            <Box>
                <Avatar alt="Avatar" src = {avatarURL!.length === 0 ? "" : `http://localhost:8888/${avatarURL}`} variant="rounded" style = {{width: "300px", height:"300px"}}/>
                <input type = "file" onChange = {avatarChange}/>
            </Box>
        </Container>
    </React.Fragment>
}

export default WithAuth(Profile);