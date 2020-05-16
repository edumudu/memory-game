import Card from './Card'
import Scoreboard from './Scoreboard'

class Board {
  #locked = false;
  #scoreboard;
  #cards = [];
  #board;
  #wonCallback;
  #timeout;
  #loseCallback;
  #isActive = {
    first: null,
    second: null
  }

  constructor(el, cards = []) {
    this.#cards = cards;
    this.#board = el;
  }

  set cards(cards) {
    this.#cards = cards;
  }

  set wonCallback(callback) {
    this.#wonCallback = callback;
  }

  set loseCallback(callback) {
    this.#loseCallback = callback;
  }

  initGame() {
    this.initScoreBoard();
    this.initCards();
  }

  initCards() {
    const cards = this.#cards.map((card, index) => {
      return [new Card(card, index), new Card(card, index)]
    })

    this.#cards = cards.flat();
    this.shuffle();

    document.addEventListener('cardFlip', e => this.clickInCard(e.detail))

    this.insertCardsInBoard();
  }

  initScoreBoard() {
    const scoreboard = document.createElement('div');

    scoreboard.classList.add('scoreboard');

    this.#scoreboard = new Scoreboard(scoreboard);

    this.#board.appendChild(this.#scoreboard.el);
  }

  shuffle() {
    this.#cards.forEach(card => {
      const randomNumber = Math.floor(Math.random() * this.#cards.length);

      card.order = randomNumber;
    })
  }

  insertCardsInBoard() {
    this.#cards.forEach(card => this.#board.appendChild(card.toNode()));
  }

  removeCardsFromBoard() {
    this.#cards.forEach(card => this.#board.removeChild(card.toNode()));
  }

  clickInCard(card) {
    if(this.#locked) return

    card = this.#cards.find(c => c.toNode() === card);

    if(this.#isActive.first === card) return

    card.flip();

    if(!this.#isActive.first){
      this.#isActive.first = card;

      return;
    }

    this.#isActive.second = card;

    this.checkForMatch();
  }

  checkForMatch() {
    const isMatch = this.#isActive.first.id === this.#isActive.second.id

    if(isMatch) {
      this.disableCards();
      this.incrementMatches();
      this.checkIfWon();
    } else {
      this.unflipCards();
      this.incrementErrors();
      this.checkIfLose();
    };
  }

  disableCards() {
    this.#isActive.first.removeClick(() => this.clickInCard(this.#isActive.first));
    this.#isActive.second.removeClick(() => this.clickInCard(this.#isActive.second));

    this.resetBoard()
  }

  unflipCards() {
    this.#locked = true;

    this.#timeout = setTimeout(() => {
      this.#isActive.first.unflip();
      this.#isActive.second.unflip();

      this.resetBoard();
    }, 800)
  }

  resetBoard() {
    this.#isActive = {
      first: null,
      second: null
    };

    this.#locked = false;
  }

  resetGame() {
    this.resetBoard();
    this.resetAllCards();
    this.#scoreboard.reset();
  }

  resetAllCards() {
    this.removeCardsFromBoard();
    this.shuffle();
    this.insertCardsInBoard();
    this.#cards.forEach(card => card.unflip());
    this.#cards.forEach(card => card.removeClick());
    this.#cards.forEach(card => card.addClick());
  }

  incrementMatches() {
    this.#scoreboard.hits++;
  }

  incrementErrors() {
    this.#scoreboard.error++;
  }

  checkIfWon() {
    if(this.#cards.length / 2 === this.#scoreboard.hits) {
      clearTimeout(this.#timeout);
      this.#locked = true;
      this.#wonCallback();
    }
  }

  checkIfLose() {
    if(this.#scoreboard.error >= 10) {
      clearTimeout(this.#timeout);
      this.#locked = true;
      this.#loseCallback();
    }
  }
}

export default Board;