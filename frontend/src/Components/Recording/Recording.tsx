import { makeStyles } from "@material-ui/core";
import React from "react";

const Recording = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.cyrcleStatic}></div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    width: "10px",
    height: "10px",
  },
  cyrcleStatic: {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "red",
    zIndex: 2,
    "&::before": {
      content: `''`,
      top: 0,
      left: 0,
      position: "absolute",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: "rgba(255, 0, 0, 0.4)",
      zIndex: 1,
      animation: "$recordingAnimation 1000ms linear infinite alternate ",
    },
  },
  "@keyframes recordingAnimation": {
    "0%": {
      transform: "scale(1, 1)",
    },
    "100%": {
      transform: "scale(2, 2)",
    },
  },
}));

export default Recording;
