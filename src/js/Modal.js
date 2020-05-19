class Modal {
  #el;
  #modalNodes;
  #overlay;
  #visible = false;
  #template = `
    <h2 class="title"></h1>

    <p class="content"></p>

    <div class="actions"></div>
  `;

  constructor(el) {
    const overlay = document.createElement('div');

    el = document.querySelector(el);

    overlay.classList.add('modal-overlay');

    el.classList.add('modal');
    el.innerHTML = this.#template;
    el.parentNode.appendChild(overlay);
    overlay.appendChild(el);    
    
    this.#el = el;
    this.#overlay = overlay;

    this.initNodes();
    this.hide();
  }

  show() {
    this.#visible = true;
    this.#overlay.style.display = 'flex';
  }

  hide() {
    this.#visible = false;
    this.#overlay.style.display = 'none';
  }
  
  toggle() {
    this.#overlay.style.display = this.#visible ? 'none' : 'block';
  }

  initNodes() {
    const el = this.#el;

    this.#modalNodes = {
      title: el.querySelector('.title'),
      content: el.querySelector('.content'),
      actions: el.querySelector('.actions'),
    }
  }

  setAction(text, callback, classes = []) {
    const button = document.createElement('button');

    classes = [...classes, 'btn'];

    button.classList.add(...classes);
    button.innerHTML = text;
    button.addEventListener('click', callback);

    this.#modalNodes.actions.appendChild(button);
  }

  setTitle(text) {
    this.#modalNodes.title.textContent = text;
  }

  setContent(html) {
    this.#modalNodes.content.innerHTML = html;
  }
}

export default Modal;