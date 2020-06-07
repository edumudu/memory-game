import '../scss/app.scss';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/Board';
import Modal from './Modal';
import socket from './io';

const el = document.querySelector('#board');
const restartButton = document.querySelector('#restart-button');
const modal = new Modal('#modal');
const menu = new Modal('#menu');

let game;

menu.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room', 'room-1');
  menu.setTitle('Waiting for other player')
  menu.removeAction(0);
});
menu.show();

socket.on('start-game', board => {
  game = new Board(el, board);
  menu.hide();
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
  game.setScoreboard(scoreboard, socket.id);
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

// modal.setAction('<i class="fas fa-play"></i>', () => {
//   board.restartGame();
//   modal.hide();
// }, ['success']);

// modal.setAction('<i class="fas fa-times"></i>', () => {
//   modal.hide();
//   restartButton.classList.add('visible');
//   restartButton.dataset.tooltip = 'Restart game';
// }, ['danger']);

// restartButton.addEventListener('click', function(e) {
//   e.preventDefault();
//   board.restartGame();
//   this.classList.remove('visible');
// }, false);