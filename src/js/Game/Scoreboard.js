class Scoreboard {
  #hits;
  #el;

  constructor (el) {
    this.#hits = 0;
    
    this.#el = {
      scoreboard: el || document.createElement('div'),
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

  set hits (value) {
    this.#hits = value;
    this.#el.hits.innerHTML = `Hits: ${value}`;
    this.#el.hits.classList.add('change');

    setTimeout(() => this.#el.hits.classList.remove('change'), 700);
  }

  initValues() {
    const {scoreboard, hits} = this.#el;

    this.hits = this.hits;

    hits.classList.add('hits');
    
    scoreboard.appendChild(hits);
  }

  reset() {
    this.hits = 0;
  }
}

export default Scoreboard;