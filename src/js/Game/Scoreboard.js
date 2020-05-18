class Scoreboard {
  #hits;
  #error;
  #el;

  constructor (el) {
    this.#hits = 0;
    this.#error = 0;
    
    this.#el = {
      scoreboard: el || document.createElement('div'),
      error: document.createElement('div'),
      hits: document.createElement('div')
    };

    this.#el.scoreboard.classList.add('scoreboard');

    this.initValues();
  }

  get el () {
    return this.#el.scoreboard;
  }

  set el (value) {
    this.#el = value;
  }

  get hits () {
    return this.#hits;
  }

  get error () {
    return this.#error;
  }

  set hits (value) {
    this.#hits = value;
    this.#el.hits.innerHTML = `Acertos: ${value}`;
    this.#el.hits.classList.add('change');

    setTimeout(() => this.#el.hits.classList.remove('change'), 700);
  }

  set error (value) {
    this.#error = value;
    this.#el.error.innerHTML = `Erros: ${value}`;
    this.#el.error.classList.add('change');

    setTimeout(() => this.#el.error.classList.remove('change'), 700);
  }

  initValues() {
    const {scoreboard, hits, error} = this.#el;

    this.hits = this.hits;
    this.error = this.error;

    hits.classList.add('hits');
    error.classList.add('erros');
    
    scoreboard.appendChild(hits);
    scoreboard.appendChild(error);
  }

  reset() {
    this.hits = 0;
    this.error = 0;
  }
}

export default Scoreboard;