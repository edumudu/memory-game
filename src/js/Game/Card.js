class Card {
  #fliped = false
  #id;
  #el;
  #imgs = {
    front: '',
    back: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Card_back_10.svg/800px-Card_back_10.svg.png'
  }

  constructor(card, id) {
    this.#id = id;
    this.#el = document.createElement('div');
    this.#imgs.front = card.front || '';

    this.initCard()
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

  toNode() {
    return this.#el;
  }

  click() {
    const e = new CustomEvent('cardFlip', { detail: this });
    document.dispatchEvent(e);
  }

  addClick() {
    this.#el.addEventListener('click', this.click);
  }

  removeClick() {
    this.#el.removeEventListener('click', this.click);
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
    this.#el.classList.add('card');

    const front = document.createElement('img');
    const back = document.createElement('img');

    front.src = this.#imgs.front;
    back.src = this.#imgs.back;

    front.classList.add('face', 'front');
    back.classList.add('face', 'back');

    this.#el.appendChild(front);
    this.#el.appendChild(back);

    this.addClick();
  }

}

export default Card