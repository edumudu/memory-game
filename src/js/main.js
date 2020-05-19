import '../scss/app.scss';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/Game';
import Modal from './Modal';
import cards from './data/cards';

const el = document.querySelector('#board');
const restartButton = document.querySelector('#restart-button');
const board = new Board(el, 100, cards);
const modal = new Modal('#modal');

board.startGame();

board.wonCallback = () => {
  modal.setTitle('You win!');
  modal.show();
};

board.loseCallback = () => {
  modal.setTitle('You lose!');
  modal.show();
};

restartButton.addEventListener('click', function(e) {
  e.preventDefault();
  board.restartGame();
  this.classList.remove('visible');
}, false);

modal.setAction('<i class="fas fa-play"></i>', () => {
  board.restartGame();
  modal.hide();
}, ['success']);

modal.setAction('<i class="fas fa-times"></i>', () => {
  modal.hide();
  restartButton.classList.add('visible');
}, ['danger']);