import Card from './Card';
import Scoreboard from './Scoreboard';
import AudioController from './AudioController';

class Board {
  #board;

  constructor(el, { elapsedTime, cards, players }) {
    this.#board = el;
    this.elapsedTime = elapsedTime;
    this.players = players;
    this.cards = cards.map(card => new Card(card));
    this.timer = document.createElement('div');
    this.timer.textContent = `Time ${this.elapsedTime}`;
    this.AudioController = new AudioController;

    this.timer.classList.add('timer');
    document.querySelector('#game-info').appendChild(this.timer);

    
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

  setScoreboard (score, id) {
    const index = this.players.indexOf(id) === 0 ? 1 : 0;
    const enemyId = this.players[index];

     this.scoreboard.myHits = score[id] || 0;
     this.scoreboard.enemyHits = score[enemyId] || 0;
  }

  resetAllCards() {
    this.removeCardsFromBoard();
    this.insertCardsInBoard();

    this.cards.forEach(card => {
      card.unflip();
      card.removeClick();
      card.addClick();
    });
  }

  stopTimers() {
    clearInterval(this.timerInterval);
  }

  startGame() {
    this.startTimer();
  }

  restartGame() {
    this.stopTimers();
    this.resetAllCards();
    this.scoreboard.reset();
    this.startTimer();
  }
}

export default Board;