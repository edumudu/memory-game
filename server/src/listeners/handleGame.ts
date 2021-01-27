import { Server, Socket } from 'socket.io';

import GameManager from '../entities/GameManager';

export default function (io: Server, socket: Socket, gameManager: GameManager) {
  const onClick = (cardId: string) => {
    const room = Array.from(socket.rooms)[1];
    const game = gameManager.getGame(room);

    if(game.playerOfTheTime !== socket.id) return;

    game.checkIfCanFlip(cardId) && io.in(room).emit('game:flip', cardId);

    const activeCards = game.click(cardId);

    if(activeCards.length !== 2) return;

    if (game.checkIfMatch()){
      game.incrementHits();
      io.in(room).emit('game:check', activeCards.map(card => card.id));
      io.in(room).emit('game:hits', game.scoreboard);
      
      game.checkCanIfFinish() && io.in(room).emit('game:finish', game.getPlacing());
    } else {
      io.in(room).emit('game:unflip', activeCards.map(card => card.id));
      game.togglePlayer();
      io.in(room).emit('game:toggle-player', game.playerOfTheTime);
    }
  }

  const onRequestRematch = async () => {
    const room = Array.from(socket.rooms)[1];
    const game = gameManager.getGame(room);

    game.rematchRequests++

    if(game.rematchRequests === 2) {
      const clientsInRoom = Array.from(await io.in(room).allSockets());

      gameManager.createGame(room, clientsInRoom);
      io.in(room).emit('game:start', gameManager.getGame(room));
    }
  }

  socket.on('game:click', onClick);
  socket.on('game:request-rematch', onRequestRematch);
}
