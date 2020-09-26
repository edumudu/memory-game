import '../scss/app.scss';
import loaderSvg from '../assets/svgs/loader.svg';
import '@fortawesome/fontawesome-free/js/all';
import Board from './Game/Board';
import Modal from './Modal';
import socket from './io';

const el = document.querySelector('#board') as HTMLElement;
const modal = new Modal('#modal');
const menu = new Modal('#menu');

let game : Board;
let room : string;

menu.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('room');
  menu.setTitle('Waiting for other player');
  menu.setContent(loaderSvg);
  menu.disableAction(0);
});

menu.show('black');

modal.setAction('<i class="fas fa-undo-alt"></i>', () => {
  socket.emit('room', room);
  modal.hide();
  menu.show('black');
  game.destroy();
}, 'success', 'Rematch');

modal.setAction('<i class="fas fa-play"></i>', () => {
  socket.emit('player-left');
  socket.emit('room');
  modal.hide();
  menu.show('black');
  game.destroy();
}, '', 'New game');

socket.on('update-online-players', (quantity: number) => {
  menu.updateUsersOnline(quantity);
});

socket.on('start-game', (board : any, playerRoom : string) => {
  room = playerRoom;
  game = new Board(el, board, socket.id);
  game.setPlayerTurn(board.playerOfTheTime);
  menu.hide();
  menu.setContent('');

  socket.on('enemy-left', () => {
    game.destroy();
    modal.hide();
    menu.setTitle('Enemy left the room');
    menu.enableAction(0);
    menu.show('black');
  })

  socket.on('check', (ids : string[]) => {
    game.check(ids);
  })
  
  socket.on('flip', (id : string) => {
    game.flip(id);
  });
  
  socket.on('unflip', (ids : string[]) => {
    setTimeout(() => game.unflip(ids), 800)
  });
  
  socket.on('hits', (scoreboard : Record<string, number>) => {
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
  
  socket.on('toggle-player', (player : string) => {
    game.setPlayerTurn(player);
  })
})
