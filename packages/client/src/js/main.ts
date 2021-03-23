import { env } from 'process';
import '../scss/app.scss';
import loaderSvg from '../assets/svgs/loader.svg';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/Board';
import Modal from './Modal';
import socket from './io';

const el = document.querySelector('#board') as HTMLElement;
const modal = new Modal('#modal');
const menu = new Modal('#menu');

let game: Board;
let room: string;

menu.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room:join');
  menu.setTitle('Waiting for other player');
  menu.setContent(loaderSvg);
  menu.disableAction(0);
});

menu.show('black');

modal.setAction('<i class="fas fa-undo-alt"></i>', () => {
  socket.emit('game:request-rematch');
  modal.hide();
  menu.show('black');
  game.destroy();
}, 'success', 'Rematch');

modal.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room:left');
  socket.emit('room:join');
  modal.hide();
  menu.show('black');
  game.destroy();
}, '', 'New game');

socket.on('update-online-players', (quantity: number) => {
  menu.updateUsersOnline(quantity);
});

socket.on('room:joined', (roomName: string) => {
  room = roomName;
})

socket.on('game:start', (board : any) => {
  game = new Board(el, board, socket.id);
  game.setPlayerTurn(board.playerOfTheTime);
  menu.hide();
  menu.setContent('');
})

socket.on('room:player-left', () => {
  game.destroy();
  modal.hide();
  menu.setTitle('Enemy left the room');
  menu.enableAction(0);
  menu.show('black');
})

socket.on('game:check', (ids : string[]) => {
  game.check(ids);
})

socket.on('game:flip', (id : string) => {
  game.flip(id);
});

socket.on('game:unflip', (ids : string[]) => {
  setTimeout(() => game.unflip(ids), 800)
});

socket.on('game:hits', (scoreboard : Record<string, number>) => {
  game.setScoreboard(scoreboard);
});

socket.on('game:finish', (placing: { winner: string, loser: string }) => {
  game.stopTimers();
  modal.setTitle(placing.winner === socket.id ? 'You win!' : 'You lose!')
  modal.show();
})

socket.on('game:toggle-player', (player : string) => {
  game.setPlayerTurn(player);
})
