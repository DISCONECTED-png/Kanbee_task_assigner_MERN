import { io } from 'socket.io-client';
const socket = io('https://kanbee-task-assigner-mern.onrender.com', {
  transports: ['websocket'],
  withCredentials: true,
});

export default socket;
