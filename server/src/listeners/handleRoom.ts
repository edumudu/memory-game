import { Server, Socket } from 'socket.io';

import GameManager from '../entities/GameManager';

export default function (io: Server, socket: Socket, gameManager: GameManager) {
  let currentRoom = '';

  const onJoinRoom = (room: string = '') => {
    currentRoom = room;

    const verifyIfCanStartGame = () => {
      const clientsInRoom = io.sockets.adapter.rooms.get(currentRoom);

      if(clientsInRoom?.size !== 2) return;

      gameManager.createGame(currentRoom, Array.from(clientsInRoom))
      io.in(currentRoom).emit('game:start', gameManager.getGame(currentRoom));
    }

    if(!currentRoom) {
      const rooms = io.sockets.adapter.rooms;
      const [roomName] = Array.from(rooms).find(([name, roomObject]) => roomObject.size < 2 && name.includes('room-')) || [];

      currentRoom = roomName || `room-${rooms.size}`;
    }
    
    socket.join(currentRoom);
    socket.emit('room:joined', currentRoom);
    verifyIfCanStartGame()
  }

  const onLeftRoom = () => {
    socket.in(currentRoom).emit('room:player-left');

    io.in(currentRoom).allSockets().then(clients => {
      clients.forEach(socketId => io.sockets.sockets.get(socketId)?.leave(currentRoom))
    })

    gameManager.deleteGame(currentRoom);
  }

  socket.on('room:join', onJoinRoom);
  socket.on('room:left', onLeftRoom);
}
