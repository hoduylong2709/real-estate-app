import { io } from 'socket.io-client';

const socket = io('http://9102-58-186-134-77.ngrok.io', { autoConnect: false });

export default socket;