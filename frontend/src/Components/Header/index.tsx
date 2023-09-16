import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  IconButton,
  makeStyles,
  Menu,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { MenuItem } from "@material-ui/core";
import { useLocation, useNavigate } from "react-router-dom";
import { getHeaderTitleByLocation } from "../../Utils/header";
import { useAuth } from "../../hooks/useAuth";

const menuItems = [
  {
    name: "Профиль",
    link: "/profile",
  },
  {
    name: "Пользователи",
    link: "/users",
  },
  {
    name: "Комнаты",
    link: "/rooms",
  },
];

const Header = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logOut } = useAuth();

  const [isOpenMenu, setOpenMenu] = useState(false);
  const [title, setTitle] = useState<string | null>(null);

  const anchorElRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const title = getHeaderTitleByLocation(pathname);

    setOpenMenu(false);
    setTitle(title);
  }, [pathname]);

  const openMenuClick = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const menuItemClick = (link: string) => () => {
    navigate(link);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          onClick={openMenuClick}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          ref={anchorElRef}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElRef.current}
          keepMounted
          open={isOpenMenu}
          onClose={handleMenuClose}
          className={classes.menu}
        >
          {menuItems.map(({ name, link }) => (
            <MenuItem key={name} onClick={menuItemClick(link)}>
              {name}
            </MenuItem>
          ))}

          <MenuItem onClick={logOut}>Выйти</MenuItem>
        </Menu>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    marginTop: "20px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default Header;
