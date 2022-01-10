import { io } from 'socket.io-client';

const socket = io('https://d8cf-116-98-251-31.ngrok.io', { autoConnect: false });

export default socket;