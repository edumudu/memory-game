import '../scss/app.scss';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/Board';
import Modal from './Modal';
import socket from './io';

const el = document.querySelector('#board');
const modal = new Modal('#modal');
const menu = new Modal('#menu');
const playerTurn = document.querySelector('#player-turn');

let game;
let room;

menu.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room');
  menu.setTitle('Waiting for other player')
  menu.removeAction(0);
});
menu.show();

modal.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room', room);
  modal.hide();
  menu.show();
  game.destroy();
  playerTurn.textContent = '';
}, ['success'], 'Rematch');

socket.on('start-game', (board, playerRoom) => {
  room = playerRoom;
  game = new Board(el, board, socket.id);
  menu.hide();
  playerTurn.textContent = board.playerOfTheTime === game.me ? 'You turn' : 'Enemy turn';
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
  socket.emit('leave', room);
});

socket.on('lose', () => {
  game.stopTimers();
  modal.setTitle('You lose!');
  modal.show();
  socket.emit('leave', room);
});

socket.on('toggle-player', player => {
  playerTurn.textContent = player === game.me ? 'You turn' : 'Enemy turn';
})
