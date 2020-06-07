import AudioController from './AudioController';
import socket from './../io';

class Card {
  #fliped = false
  #id;
  #el;
  #icon;

  constructor({id, order, icon}) {
    this.#el = document.createElement('div');
    this.#id = id;
    this.#icon = icon || '';
    this.order = order;
    
    this.AudioController = new AudioController();
    
    this.effect = document.createElement('span');
    this.effect.innerHTML = '<i class="fas fa-plus"></i>';
    this.effect.classList.add('match-effect');

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
    socket.emit('click', this.id);
  }

  addClick() {
    this.#el.addEventListener('click', this.click.bind(this));
  }

  removeClick() {
    this.#el.removeEventListener('click', this.click);
  }

  flip () {
    this.AudioController.flip();
    this.#fliped = true;
    this.#el.classList.add('active');
  }

  unflip () {
    this.#fliped = false;
    this.#el.classList.remove('active');
    this.#el.classList.remove('matched');
  }

  markAsMatched () {
    this.#el.classList.add('matched');

    for(let i = 1; i <= 6; i++) {
      const clone = this.effect.cloneNode(true);
      this.#el.firstElementChild.appendChild(clone);
      setTimeout(() => this.#el.firstElementChild.removeChild(clone), 1000);
    }
  }

  initCard() {
    this.#el.classList.add('card');

    this.#el.innerHTML = `
      <div class="face front">
        <i class="${this.#icon} main-icon"></i>
        <i class="fab fa-mixcloud nimbus"></i>
      </div>

      <div class="face back">
        <i class="fas fa-cloud-moon ornament"></i>
        <i class="fas fa-cloud-moon ornament"></i>
        <i class="fas fa-cloud-moon ornament bottom"></i>
        <i class="fas fa-cloud-moon ornament bottom"></i>

        <i class="fas fa-paw main-icon"></i>

      </div>
    `;

    this.addClick();
  }

}

export default Card