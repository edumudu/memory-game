import Express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import initListeners from './src/listeners';

import GameManager from './src/entities/GameManager';

const isProduction = process.env.NODE_ENV === 'production';
const app = Express();
const http = createServer(app);
const io = new Server(http, {
  cors: { origin: isProduction ? 'https://edumudu.github.io' : '*' }
});

app.use(cors({
  origin: isProduction ? 'https://edumudu.github.io' : '*',
}));

app.get('/', (req, res) => {
  res.send('<h1>Server is online</h1>');
})

const serverPort = process.env.PORT || 3000;
const gameManager = new GameManager();

const onConnect = (socket: Socket) => {
  gameManager.addPlayer(socket.id);
  io.emit('update-online-players', gameManager.playersCount);
  initListeners(io, socket, gameManager);
}

io.on('connection', onConnect);

http.listen(serverPort, () => {
  console.log(`listening on *:${serverPort}`);
});
