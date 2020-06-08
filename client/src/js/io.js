import io from 'socket.io-client';

const socket = io('https://edumudu-memory-game.herokuapp.com/');

export default socket;