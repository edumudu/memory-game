import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import initListeners from './src/listeners';

import GameManager from './src/entities/GameManager';

const server = createServer();
const io = new Server(server, {
  cors: { origin: '*' }
});

const serverPort = process.env.PORT || 3000;
const gameManager = new GameManager();

const onConnect = (socket: Socket) => {
  gameManager.addPlayer(socket.id);
  io.emit('update-online-players', gameManager.playersCount);
  initListeners(io, socket, gameManager);
}

io.on('connection', onConnect);

server.listen(serverPort, () => {
  console.log(`listening on *:${serverPort}`);
});
