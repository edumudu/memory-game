import fs from 'fs';
import { resolve } from 'path';
import { Server, Socket } from 'socket.io';

import GameManager from '../entities/GameManager';

export default (io: Server, socket: Socket, gameManager: GameManager) => {
  // Full path to the current directory
  const listenersPath = resolve(__dirname);

  // Reads all the files in a directory
  fs.readdir(listenersPath, (err, files) => {
    if(err) {
      console.error('Error while reading listeners');
      process.exit(1);
    }

    files.map(fileName => {
      if(fileName !== 'index.ts') {
        console.debug(`Initializing listener at: ${fileName}`);
        // Requires all the files in the directory that is not a index.js.
        const listener: (io: Server, socket: Socket, gameManager: GameManager) => void = require(resolve(__dirname, fileName)).default;
        // Initialize it with io as the parameter.
        listener(io, socket, gameManager);
      }
    })
  })
};
