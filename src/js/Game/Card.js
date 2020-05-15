class Card {
  #fliped = false
  #id;
  #el;
  #imgs = {
    front: '',
    back: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Card_back_02.svg/412px-Card_back_02.svg.png'
  }

  constructor(card, id) {
    this.#id = id
    this.#el = document.createElement('div');
    this.#imgs.front = card.front || ''
    
    this.initCard()
  }

  toNode() {
    return this.#el;
  }

  addClick(callback) {
    this.#el.addEventListener('click', callback);
  }

  removeClick(callback) {
    this.#el.removeEventListener('click', callback);
  }

  set fliped (val) {
    this.#fliped = val;
  }

  get fliped () {
    return this.#fliped;
  }

  get id () {
    return this.#id;
  }

  set order (n) {
    this.toNode().style.order = n;
  }

  flip () {
    this.#fliped = true;
    this.#el.classList.add('active');
  }

  unflip () {
    this.#fliped = false;
    this.#el.classList.remove('active');
  }

  initCard() {
    this.#el.dataset.id = this.#id;
    this.#el.classList.add('card');

    const front = document.createElement('img');
    const back = document.createElement('img');

    front.src = this.#imgs.front;
    back.src = this.#imgs.back;

    front.classList.add('face', 'front');
    back.classList.add('face', 'back');

    this.#el.appendChild(front);
    this.#el.appendChild(back);
  }

}

export default Card