declare interface ModalNodes {
  title: HTMLElement,
  content: HTMLParagraphElement,
  actions: HTMLDivElement,
  playersOnline: HTMLSpanElement,
}

class Modal {
  private el : HTMLElement;
  private modalNodes : ModalNodes;
  private overlay : HTMLDivElement;
  private visible : boolean = false;
  private template : string = `
    <h2 class="title"></h1>

    <p class="content"></p>

    <div class="actions"></div>
  `;

  public constructor(el: string | HTMLElement) {
    const overlay = document.createElement('div');
    const playerOnlineCounter = document.createElement('span');

    el = document.querySelector(el as string) as HTMLElement;

    playerOnlineCounter.classList.add('players-online');
    overlay.classList.add('modal-overlay');

    el.classList.add('modal');
    el.innerHTML = this.template;
    el.parentNode?.appendChild(overlay);
    overlay.appendChild(playerOnlineCounter);
    overlay.appendChild(el);
    
    this.el = el;
    this.overlay = overlay;
    this.modalNodes = this.initNodes();

    this.hide();
  }

  public show(bg = 'rgba(0,0,0,0.7)') : void {
    this.visible = true;
    this.overlay.style.display = 'flex';
    this.overlay.style.backgroundColor = bg
  }

  public hide() : void {
    this.visible = false;
    this.overlay.style.display = 'none';
  }
  
  public toggle() : void {
    this.overlay.style.display = this.visible ? 'none' : 'block';
  }

  public initNodes() : ModalNodes {
    const el = this.el;

    return {
      title: el.querySelector('.title') as HTMLElement,
      content: el.querySelector('.content') as HTMLParagraphElement,
      actions: el.querySelector('.actions') as HTMLDivElement,
      playersOnline: this.overlay.querySelector('.players-online') as HTMLSpanElement,
    }
  }

  public setAction(text : string, callback : () => void, classes : string = '', tooltip : string = '') : void {
    const button = document.createElement('button');

    classes = classes ? `${classes} btn` : 'btn';

    button.classList.add(...classes.split(' '));
    button.innerHTML = text;
    button.addEventListener('click', callback);

    if (tooltip) {
      button.dataset.tooltip = tooltip;
      button.classList.add('tooltip');
    }

    this.modalNodes.actions.appendChild(button);
  }

  public disableAction(id : number) : void {
    const action = this.modalNodes.actions.children[id] as HTMLElement;
    action.style.display = 'none';
  }

  public enableAction(id : number) : void {
    const action = this.modalNodes.actions.children[id] as HTMLElement;
    action.style.display = 'block';
  }

  public setTitle(text : string) : void {
    this.modalNodes.title.textContent = text;
  }

  public setContent(html : string) : void {
    this.modalNodes.content.innerHTML = html;
  }

  public updateUsersOnline(quantity: number): void {
    this.modalNodes.playersOnline.textContent = `${quantity} ${quantity > 1 ? 'players' : 'player'} online :)`;
  }
}

export default Modal;
