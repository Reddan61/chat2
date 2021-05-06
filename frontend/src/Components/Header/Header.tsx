import { AppBar, IconButton, makeStyles, Menu, Toolbar, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react"
import { WithAuth } from "../HOC/withAuth"
import MenuIcon from '@material-ui/icons/Menu';
import { MenuItem } from "@material-ui/core";
import { compose } from "redux";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { logOutThunk } from "../Redux/Reducers/authReducer";

const Header = () => {
const classes = useStyles();
const [anchorEl, setAnchorEl] = React.useState(null);
const [title, setTitle] = useState<null | string>(null);
const history = useHistory();
const dispatch = useDispatch();

useEffect(() => {
    const title = history.location.pathname[1].toUpperCase() + history.location.pathname.slice(2);
    setTitle(title);
});


const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = (e:any,path:string) => {
    history.push(path);
    setAnchorEl(null);
};

return <React.Fragment>
    <AppBar position="static">
        <Toolbar>
            <IconButton onClick = {handleClick} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className = {classes.menu}
            >
                <MenuItem onClick={(e) => handleClose(e,"profile")}>Profile</MenuItem>
                <MenuItem onClick={(e) => handleClose(e,"users")}>Users</MenuItem>
                <MenuItem onClick={(e) => handleClose(e,"messages")}>Messages</MenuItem>
                <MenuItem onClick={() => {dispatch(logOutThunk())}}>Logout</MenuItem>
            </Menu>
            <Typography variant="h6" className={classes.title}>
               {title}
            </Typography>
        </Toolbar>
    </AppBar>
</React.Fragment>
}


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menu: {
        marginTop: "20px"
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    }
  }));


export default WithAuth(Header);