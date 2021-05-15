import { Box, CircularProgress } from "@material-ui/core";
import React from "react";



const Loader = () => {
    return <Box style = {{
        position:'absolute',
        width:"100%",
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    }}>
        <CircularProgress  size = {60}/>
    </Box>
}

export default Loader;