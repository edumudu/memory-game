import '../css/main.css';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/app';
import Modal from './Modal';
import cards from './data/cards';

const el = document.querySelector('#board');
const board = new Board(el, cards);
const modal = new Modal('#modal');

board.initGame();

board.wonCallback = () => {
  modal.setTitle('Você ganhou!');
  modal.show();
};

board.loseCallback = () => {
  modal.setTitle('Você perdeu!');
  modal.show();
};

modal.setContent('Conteudo Real do modal');

modal.setAction('jogar de novo', () => {
  board.resetGame();
  modal.hide();
}, ['success']);

modal.setAction('fechar', () => modal.hide(), ['danger']);