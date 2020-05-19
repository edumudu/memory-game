import Card from './Card';
import Scoreboard from './Scoreboard';
import AudioController from './AudioController';

class Board {
  #locked = false;
  #countDown;
  #board;
  wonCallback;
  loseCallback;
  #timeout;
  #isActive = {
    first: null,
    second: null
  }

  constructor(el, totalTime, cards = []) {
    this.#board = el;
    this.totalTime = totalTime;
    this.timer = document.createElement('div');
    this.AudioController = new AudioController;
    this.cards = cards.map((card, index) => {
      return [new Card(card, index), new Card(card, index)]
    }).flat();

    this.timer.classList.add('timer');
    document.querySelector('#game-info').appendChild(this.timer);
  }

  initCards() {
    this.shuffle();

    document.addEventListener('cardFlip', e => this.clickInCard(e.detail))

    this.insertCardsInBoard();
  }

  initScoreBoard() {
    this.scoreboard = new Scoreboard();
    document.querySelector('#game-info').appendChild(this.scoreboard.el);
  }

  observe(observed, callback, oldvalue) {
    undefined === oldvalue && (oldvalue = this[observed]);
    
    let check = setInterval((oldvalue) => {
      const value = this[observed];

      if (value !== oldvalue) {
        clearInterval(check);
        callback(value);
        this.observe(observed, callback, value);
      }
    }, 500, oldvalue);
  }

  shuffle() {
    this.cards.forEach(card => {
      const randomNumber = Math.floor(Math.random() * this.cards.length);

      card.order = randomNumber;
    })
  }

  startCountDown() {
    this.observe('timeRemaining', v => this.timer.textContent = `Time ${v}`);
    this.timeRemaining = this.totalTime;

    this.#countDown = setInterval(() => {
      this.timeRemaining--;

      if(this.timeRemaining === 0) this.gameOver();
    }, 1000);
  }

  insertCardsInBoard() {
    this.cards.forEach(card => this.#board.appendChild(card.toNode()));
  }

  removeCardsFromBoard() {
    this.cards.forEach(card => this.#board.removeChild(card.toNode()));
  }

  clickInCard(card) {
    if(this.#locked) return

    card = this.cards.find(c => c.toNode() === card);

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
      this.AudioController.match();
      this.disableCards();
      this.scoreboard.hits++;
    } else {
      this.unflipCards();
    };

    this.checkIfWon();
  }

  disableCards() {
    const { first, second } = this.#isActive;

    first.removeClick(() => this.clickInCard(this.#isActive.first));
    second.removeClick(() => this.clickInCard(this.#isActive.second));

    first.markAsMatched();
    second.markAsMatched();

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

  resetAllCards() {
    this.removeCardsFromBoard();
    this.shuffle();
    this.insertCardsInBoard();

    this.cards.forEach(card => {
      card.unflip();
      card.removeClick();
      card.addClick();
    });
  }

  stopTimers() {
    clearInterval(this.#countDown);
    clearTimeout(this.#timeout);
  }

  checkIfWon() {
    if(this.cards.length / 2 === this.scoreboard.hits) {
      this.stopTimers();
      this.#locked = true;
      this.wonCallback();
    }
  }

  startGame() {
    this.initScoreBoard();
    this.initCards();
    this.startCountDown();
  }

  restartGame() {
    this.stopTimers();
    this.resetBoard();
    this.resetAllCards();
    this.scoreboard.reset();
    this.startCountDown();
  }

  gameOver() {
    this.stopTimers()
    this.#locked = true;
    this.loseCallback();
  }
}

export default Board;