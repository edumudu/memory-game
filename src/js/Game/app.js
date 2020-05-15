import Card from './Card'

class Board {
  #locked = false;
  #mathes = 0;
  #cards = [];
  #board;
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

    this.#cards.forEach(card => card.addClick(() => { this.clickInCard(card) }))

    this.insertCardsInBoard();
  }

  insertCardsInBoard() {
    this.#cards.forEach(card => this.#board.appendChild(card.toNode()));
  }

  clickInCard(card) {
    if(this.#locked) return
    if(this.#isActive.first === card) return

    console.log(this.#isActive.first)

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

    isMatch ? this.disableCards() : this.unflipActives();
  }

  disableCards() {
    this.#isActive.first.removeClick(this.clickInCard);
    this.#isActive.second.removeClick(this.clickInCard);

    this.resetBoard()
  }

  unflipActives() {
    this.#locked = true;

    setTimeout(() => {
      this.#isActive.first.unflip();
      this.#isActive.second.unflip();

      this.resetBoard();
    }, 1000)
  }

  resetBoard() {
    this.#isActive = {
      first: null,
      second: null
    };

    this.#locked = false;
  }

}

export default Board;