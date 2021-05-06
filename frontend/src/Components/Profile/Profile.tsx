import { Avatar, Box, Button, Container } from "@material-ui/core"
import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { getAvatarSRC } from "../../Utils/getAvatarSrc";
import { WithAuth } from "../HOC/withAuth";
import { updateAvatarThunk } from "../Redux/Reducers/authReducer";
import { StateType } from "../Redux/store";


const Profile = () => {
    const { avatarURL } = useSelector((state: StateType) => state.AuthPage)
    const dispatch = useDispatch();
    const avatarChange = (e: any) => {
        let file = e.target.files[0];
        if (e.target.files.length && (file.type === 'image/jpeg' || file.type === 'image/png' || file.mimetype === 'image/jpg')) {
            const data = new FormData();
            data.append("file", file)
            dispatch(updateAvatarThunk(data));
        }
    }
    return <React.Fragment>
        <Container style={{ paddingTop: "20px" }}>
            <Box>
                <Box style={{
                    display: "inline-block",
                    verticalAlign: "top"
                }}>
                    <Box style = {{
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"center",
                        alignItems:"center"
                    }}>
                        <Avatar alt="Avatar" src={getAvatarSRC(avatarURL)} variant="rounded" style={{ width: "300px", height: "300px" }} />
                        <input
                            accept="image/jpeg,image/png,image/jpg"
                            id="contained-button-file"
                            multiple
                            type="file"
                            style={{ display: "none" }}
                            onChange={avatarChange}
                        />
                        <label htmlFor="contained-button-file" style = {{
                            marginTop:"10px"
                        }}>
                            <Button variant="contained" color="primary" component="span">
                                Change image
                        </Button>
                        </label>
                    </Box>
                </Box>
            </Box>
        </Container>
    </React.Fragment>
}

export default WithAuth(Profile);