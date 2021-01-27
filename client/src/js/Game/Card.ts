import { icon, IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core'
import AudioController from './AudioController';
import socket from '../io';
import { CardJSON } from '../../../@types';

class Card {
  private el : HTMLDivElement;
  private effect : HTMLSpanElement;
  private icon : Element;
  private hashId : string;
  private flipTimeout : NodeJS.Timeout | null = null;
  private AudioController : AudioController;

  constructor({ id, order, icon: iconNames } : CardJSON) {
    this.el = document.createElement('div');
    this.hashId = id;
    this.order = order;
    this.AudioController = new AudioController();
    
    const [prefix, iconName] = iconNames.split(' ') as [IconPrefix, IconName];
    this.icon = icon({ prefix, iconName }).node[0];
    this.icon.classList.add('main-icon');

    this.effect = document.createElement('span');
    this.effect.innerHTML = '<i class="fas fa-plus"></i>';
    this.effect.classList.add('match-effect');

    this.initCard();
  }

  get id () {
    return this.hashId;
  }

  set order (n : number) {
    this.toNode().style.order = (n).toString();
  }

  toNode() {
    return this.el;
  }

  click() : void {
    socket.emit('game:click', this.hashId);
  }

  addClick() : void {
    this.el.addEventListener('click', this.click.bind(this));
  }

  removeClick() : void {
    this.el.removeEventListener('click', this.click);
  }

  flip () : void {
    clearTimeout(this.flipTimeout as NodeJS.Timeout);
    this.el.querySelector('.face.front')?.appendChild(this.icon);
    this.AudioController.flip();
    this.el.classList.add('active');
  }

  unflip () : void {
    this.el.classList.remove('active');
    this.el.classList.remove('matched');
    this.flipTimeout = setTimeout(() => this.icon.remove(), 800);
  }

  markAsMatched () : void {
    this.el.classList.add('matched');

    for(let i = 1; i <= 6; i++) {
      const clone = this.effect.cloneNode(true);
      this.el.firstElementChild?.appendChild(clone);
      setTimeout(() => this.el.firstElementChild?.removeChild(clone), 1000);
    }
  }

  initCard() : void {
    this.el.classList.add('card');

    this.el.innerHTML = `
      <div class="face front">
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