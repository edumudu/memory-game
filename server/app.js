const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http);

const cards = require('./src/data/cards');
const Board = require('./src/Board');

const games = {};

io.on('connection', socket => {
  let userRoom;

  socket.on('room', room => {
    const rooms = io.sockets.adapter.rooms;

    if(!room) {
      for (let [name, roomObj] of Object.entries(rooms)) {
        if (!name.includes('room-') || roomObj.length >= 2) continue;

        room = name;
      }

      room = room ? room : `room-${Object.keys(rooms).length}`;
    }

    socket.join(room);
    userRoom = room;

    const clientes = rooms[room];

    if(clientes.length === 2) {
      games[room] = new Board(cards, Object.keys(clientes.sockets));
      io.sockets.in(room).emit('start-game', games[room], room);
    }
  });

  socket.on('leave', room => {
    socket.leave(room);
  });

  socket.on('click', id => {
    const room = userRoom;
    const game = games[room];
    if(game.playerOfTheTime !== socket.id) return;
    
    game.checkIfCanFlip(id) && io.sockets.in(room).emit('flip', id);
    const activeCards = game.click(id);
    
    if(activeCards.length === 2) {
      const isMatch = game.checkIfMatch();

      if (isMatch){
        game.incrementHits();
        io.sockets.in(room).emit('check', activeCards.map(card => card.id));
        io.sockets.in(room).emit('hits', game.scoreboard);

        const winner = game.checkIfFinish();
        
        if(winner) {
          const sockets = Object.values(io.in(room).connected);
          sockets.map(sock => sock.id === winner ? sock.emit('won') : sock.emit('lose'));
        }
      } else {
        io.sockets.in(room).emit('unflip', activeCards.map(card => card.id));
        game.togglePlayer();
        io.sockets.in(room).emit('toggle-player', game.playerOfTheTime);
      }
    }
  });

  socket.on('disconnect', () => {
    socket.leaveAll();
  });
});

Http.listen(process.env.PORT || 3000);