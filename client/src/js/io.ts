import { io } from 'socket.io-client';

const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://edumudu-memory-game.herokuapp.com/');

export default socket;
