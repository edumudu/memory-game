import Card from './Card'
import Scoreboard from './Scoreboard'

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
    this.timeRemaining = totalTime;
    this.timer = document.createElement('div');
    this.cards = cards.map((card, index) => {
      return [new Card(card, index), new Card(card, index)]
    }).flat();

    this.timer.classList.add('timer');
    this.#board.appendChild(this.timer);
  }

  startGame() {
    this.initScoreBoard();
    this.initCards();
    this.startCountDown();
  }

  initCards() {
    this.shuffle();

    document.addEventListener('cardFlip', e => this.clickInCard(e.detail))

    this.insertCardsInBoard();
  }

  initScoreBoard() {
    this.scoreboard = new Scoreboard();
    this.#board.appendChild(this.scoreboard.el);
  }

  shuffle() {
    this.cards.forEach(card => {
      const randomNumber = Math.floor(Math.random() * this.cards.length);

      card.order = randomNumber;
    })
  }

  startCountDown() {
    this.#countDown = setInterval(() => {
      this.timeRemaining--;
      this.timer.textContent = this.timeRemaining;

      if(this.timeRemaining == 0) {
        clearInterval(this.#countDown);
        this.loseCallback();
      }
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
      this.disableCards();
      this.scoreboard.hits++;
    } else {
      this.unflipCards();
      this.scoreboard.error++;
    };

    this.checkIfWonOrLose();
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

  resetGame() {
    this.resetBoard();
    this.resetAllCards();
    this.scoreboard.reset();
    this.timeRemaining = this.totalTime;
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

  checkIfWonOrLose() {
    if(this.scoreboard.error >= 10) {
      clearTimeout(this.#timeout);
      this.#locked = true;
      this.loseCallback();
    } else if(this.cards.length / 2 === this.scoreboard.hits) {
      clearTimeout(this.#timeout);
      this.#locked = true;
      this.wonCallback();
    }
  }
}

export default Board;