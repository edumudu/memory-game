import '../scss/app.scss';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/Board';
import Modal from './Modal';
import socket from './io';

const el = document.querySelector('#board');
const modal = new Modal('#modal');
const menu = new Modal('#menu');

let game;
let room;

menu.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room');
  menu.setTitle('Waiting for other player')
  menu.disableAction(0);
});
menu.show();

modal.setAction('<i class="fas fa-undo-alt"></i>', () => {
  socket.emit('room', room);
  modal.hide();
  menu.show();
  game.destroy();
}, 'success', 'Rematch');

modal.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('player-left');
  socket.emit('room');
  modal.hide();
  menu.show();
  game.destroy();
}, '', 'New game');

socket.on('start-game', (board, playerRoom) => {
  room = playerRoom;
  game = new Board(el, board, socket.id);
  game.setPlayerTurn(board.playerOfTheTime);
  menu.hide();

  socket.on('enemy-left', () => {
    game.destroy();
    modal.hide();
    menu.setTitle('Enemy left the room');
    menu.enableAction(0);
    menu.show();
  })

  socket.on('check', ids => {
    game.check(ids);
  })
  
  socket.on('flip', id => {
    game.flip(id);
  });
  
  socket.on('unflip', ids => {
    setTimeout(() => game.unflip(ids), 800)
  });
  
  socket.on('hits', scoreboard => {
    game.setScoreboard(scoreboard);
  });
  
  socket.on('won', () => {
    game.stopTimers();
    modal.setTitle('You win!');
    modal.show();
  });
  
  socket.on('lose', () => {
    game.stopTimers();
    modal.setTitle('You lose!');
    modal.show();
  });
  
  socket.on('toggle-player', player => {
    game.setPlayerTurn(player);
  })
})
