import { Server, Socket } from 'socket.io';

import GameManager from '../entities/GameManager';

export default function (io: Server, socket: Socket, gameManager: GameManager) {
  const onDisconnecting = () => {
    const room = Array.from(socket.rooms)[1];

    if(room) {
      socket.in(room).emit('room:player-left');

      io.in(room).allSockets().then(clients => {
        clients.forEach(socketId => io.sockets.sockets.get(socketId)?.leave(room))
      })
    }
  };

  const onDisconnect = () => {
    gameManager.removePlayer(socket.id);
    io.emit('update-online-players', gameManager.playersCount);
  };

  socket.on('disconnecting', onDisconnecting);
  socket.on('disconnect', onDisconnect);
}
