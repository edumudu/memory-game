const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http);

const cards = require('./src/data/cards');
const Board = require('./src/Board');

const players = [];
const games = {};

io.on('connection', socket => {
  socket.on('room', room => {
    socket.join(room);
    const clientes = io.sockets.adapter.rooms[room];

    if(clientes.length === 2) {
      games[room] = new Board(cards, Object.keys(clientes.sockets));
      io.sockets.in(room).emit('start-game', games[room]);
    }
  })

  socket.on('click', id => {
    const room = Object.keys(socket.rooms).pop();
    const game = games[room];

    if(game.playerOfTheTime !== socket.id) return;
    
    game.checkIfCanFlip(id) && io.sockets.in(room).emit('flip', id);
    const cards = game.click(id);

    if(cards.length === 2) {
      const isMatch = game.checkIfMatch();

      if (isMatch){
        game.incrementHits();
        io.sockets.in(room).emit('check', cards.map(card => card.id));
        io.sockets.in(room).emit('hits', game.scoreboard);

        const winner = game.checkIfFinish();
        if(winner) {
          const sockets = Object.values(io.in(room).connected);
          sockets.map(sock => sock.id === winner ? sock.emit('won') : sock.emit('lose'));
        }
      } else {
        io.sockets.in(room).emit('unflip', cards.map(card => card.id));
      }

      game.togglePlayer();
    }
  })
});

Http.listen(3000, () => {
  console.log('Server runing in: http://localhost:3000');
});