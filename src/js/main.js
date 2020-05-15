import '../css/main.css';
import Board from './Game/app';
import cards from './data/cards';

const el = document.querySelector('#board');

const board = new Board(el, cards);

board.initCards()
