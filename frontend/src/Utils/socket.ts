import io from "socket.io-client";



const token = localStorage.getItem("token");

const socket = io("http://localhost:8888",{autoConnect:false,query:{token:token?token:''}})


export default socket;
