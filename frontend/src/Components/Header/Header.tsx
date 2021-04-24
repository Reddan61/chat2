import { AppBar, Button, IconButton, makeStyles, Menu, Toolbar, Typography } from "@material-ui/core";
import React from "react"
import { WithAuth } from "../HOC/withAuth"
import MenuIcon from '@material-ui/icons/Menu';
import { MenuItem } from "@material-ui/core";

const Header = () => {
const classes = useStyles();
const [anchorEl, setAnchorEl] = React.useState(null);

const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};

return <React.Fragment>
    <AppBar position="static">
        <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon onClick = {handleClick}/>
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className = {classes.menu}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Friends</MenuItem>
                <MenuItem onClick={handleClose}>Messages</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
            <Typography variant="h6" className={classes.title}>
               Profile
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