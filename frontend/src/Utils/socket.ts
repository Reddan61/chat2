import io from "socket.io-client";
import { getAuthToken } from "./auth";

const socket = io("http://localhost:8888", {
  autoConnect: false,
  auth: (cb) => {
    cb({
      token: getAuthToken(),
    });
  },
});

export default socket;
