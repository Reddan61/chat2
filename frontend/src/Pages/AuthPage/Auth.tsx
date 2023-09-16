import React, { FC, useState } from "react";
import { Box, Button, makeStyles } from "@material-ui/core";
import { SignInDialog } from "../../Components/SignInDialog";
import { SignUpDialog } from "../../Components/SignUpDialog";
import { ForgotDialog } from "../../Components/ForgotDialog";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const useStyle = makeStyles({
  root: {
    minHeight: "100vh",
    Width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: "200px",
  },
});

const Auth: FC = () => {
  const classes = useStyle();
  const [isOpenSignIn, setOpenSignIn] = useState(false);
  const [isOpenSignUp, setOpenSignUp] = useState(false);
  const [isOpenForgotPassword, setOpenForgotPassword] = useState(false);
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to={"/profile"} />;
  }

  return (
    <>
      <SignInDialog
        isOpen={isOpenSignIn}
        closeDialog={() => setOpenSignIn(false)}
        openForgotPasswordDialog={() => setOpenForgotPassword(true)}
      />

      <SignUpDialog
        isOpen={isOpenSignUp}
        closeDialog={() => setOpenSignUp(false)}
      />

      <ForgotDialog
        isOpen={isOpenForgotPassword}
        closeDialog={() => setOpenForgotPassword(false)}
      />

      <Box className={classes.root}>
        <Button onClick={() => setOpenSignIn(true)} className={classes.button}>
          Войти
        </Button>
        <Button onClick={() => setOpenSignUp(true)} className={classes.button}>
          Регистрация
        </Button>
      </Box>
    </>
  );
};

export default Auth;
