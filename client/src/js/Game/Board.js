import Card from './Card';
import Scoreboard from './Scoreboard';
import AudioController from './AudioController';

class Board {
  #board;

  constructor(el, { elapsedTime, cards, players }, me) {
    this.#board = el;
    this.me = me;
    this.elapsedTime = elapsedTime;
    this.players = players;
    this.cards = cards.map(card => new Card(card));

    this.timer = document.createElement('div');
    this.timer.textContent = `Time ${this.elapsedTime}`;

    this.playerTurnEl = document.createElement('div');
    this.playerTurnEl.classList.add('player-turn');

    this.AudioController = new AudioController;

    this.timer.classList.add('timer');
    document.querySelector('#game-info').append(this.timer, this.playerTurnEl);
    
    this.insertCardsInBoard();
    this.initScoreBoard();
    this.startTimer();
  }

  initScoreBoard() {
    this.scoreboard = new Scoreboard();
    document.querySelector('#game-info').appendChild(this.scoreboard.el);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
      this.timer.textContent = `Time ${this.elapsedTime}`;
    }, 1000);
  }

  insertCardsInBoard() {
    this.cards.forEach(card => this.#board.appendChild(card.toNode()));
  }

  removeCardsFromBoard() {
    this.cards.forEach(card => this.#board.removeChild(card.toNode()));
  }

  flip (id) {
    const card = this.cards.find(card => id === card.id);
    card.flip();
  }

  unflip (ids) {
    const cards = this.cards.filter(card => ids.includes(card.id));
    cards.forEach(card => card.unflip());
  }

  check(ids) {
    const cards = this.cards.filter(card => ids.includes(card.id));
    cards.forEach(card => card.markAsMatched());
    this.AudioController.match();
  }

  setScoreboard (score) {
    this.players.forEach(player => {
      this.scoreboard[player === this.me ? 'myHits' : 'enemyHits'] = score[player] || 0;
    })
  }

  setPlayerTurn(playerOfTheTime) {
    this.playerTurnEl.textContent = playerOfTheTime === this.me ? 'Your turn' : 'Enemy turn';
  }

  stopTimers() {
    clearInterval(this.timerInterval);
  }

  destroy () {
    this.removeCardsFromBoard();
    this.scoreboard.destroy();
    this.stopTimers();
    this.timer.remove();
    this.playerTurnEl.remove();
  }
}

export default Board;