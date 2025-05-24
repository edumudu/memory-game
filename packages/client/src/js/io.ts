import { io } from 'socket.io-client';

const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://dom-memory-game.edumudu.dev/');

export default socket;
