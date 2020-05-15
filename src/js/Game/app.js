import Card from './Card'
import Scoreboard from './Scoreboard'

class Board {
  #locked = false;
  #scoreboard;
  #cards = [];
  #board;
  #isActive = {
    first: null,
    second: null
  }

  constructor(el, cards = []) {
    this.#cards = cards;
    this.#board = el;

    this.initScoreBoard();
  }

  set cards(cards) {
    this.#cards = cards;
  }

  shuffle() {
    this.#cards.forEach(card => {
      const randomNumber = Math.floor(Math.random() * 12);

      card.order = randomNumber;
    })
  }

  initCards() {
    const cards = this.#cards.map((card, index) => {
      return [new Card(card, index), new Card(card, index)]
    })

    this.#cards = cards.flat();
    this.shuffle();

    // this.#cards.forEach(card => card.addClick(() => this.clickInCard(card)));
    document.addEventListener('cardFlip', e => this.clickInCard(e.detail))

    this.insertCardsInBoard();
  }

  initScoreBoard() {
    const scoreboard = document.createElement('div');

    scoreboard.classList.add('scoreboard');

    this.#scoreboard = new Scoreboard(scoreboard);

    this.#board.appendChild(this.#scoreboard.el);
  }

  insertCardsInBoard() {
    this.#cards.forEach(card => this.#board.appendChild(card.toNode()));
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

    isMatch ? this.disableCards() : this.unflipCards();
  }

  disableCards() {
    this.incrementMatches();

    this.#isActive.first.removeClick(() => this.clickInCard(this.#isActive.first));
    this.#isActive.second.removeClick(() => this.clickInCard(this.#isActive.second));

    this.resetBoard()
  }

  unflipCards() {
    this.#locked = true;
    this.#scoreboard.error++;

    setTimeout(() => {
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

  incrementMatches() {
    this.#scoreboard.hits++;
  }

}

export default Board;