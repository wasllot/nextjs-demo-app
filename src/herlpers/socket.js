import { io } from "socket.io-client";

const socket = io("https://sunset-credits.herokuapp.com", { transports: ["websocket"] });
//const socket = io("http://192.168.86.37:8000", { transports: ["websocket"] });
export default socket;
