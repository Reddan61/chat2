import { Box, Container, Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { WithAuth } from "../HOC/withAuth";
import { getUsersThunk, IgetUsers } from "../Redux/Reducers/usersReducer";
import { StateType } from "../Redux/store";
import CardUser from "./CardUser";
import UserSearch from "./UserSearch";



const Users = () => {
    const { users,totalPages } = useSelector((state: StateType) => state.UsersPage)
    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();

    async function getUsers({page = "1",search = ""}: IgetUsers) {
        const data = {
            page,
            search
        }
        setLoading(true);
        await dispatch(getUsersThunk(data));
        setLoading(false);
    }
    function changePagiantion(e:any,value:number) {
        getUsers({page:value.toString()})
    }

    useEffect(() => {
        getUsers({})
    }, [])


    return <Container style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)"
    }}>
        <Box>
            <UserSearch getUsers = {getUsers}/>
        </Box>
        <Box style={{
            marginTop: "20px",
            flex: "1 0 auto"
        }}>
            <Grid
                container
                spacing={2}
            >
                {!isLoading && users?.map(el => <Grid item xs={3} key={el._id}>
                    <CardUser avatar={el.avatar} username={el.username} _id={el._id} />
                </Grid>)}
            </Grid>
        </Box>
        <Container style={{
            display: "flex",
            justifyContent: "center",
            flex: "0 0 50px"
        }}>
            <Pagination count={totalPages ?totalPages : 1} shape="rounded" showFirstButton showLastButton 
                onChange = {changePagiantion}
                disabled = {isLoading}
            />
        </Container>
    </Container>
};



export default WithAuth(Users);