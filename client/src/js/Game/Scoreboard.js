class Scoreboard {
  #myHits;
  #enemyHits;
  #el;

  constructor (el) {    
    this.#el = {
      scoreboard: el || document.createElement('div'),
      myHits: document.createElement('div'),
      enemyHits: document.createElement('div')
    };

    this.myHits = 0;
    this.enemyHits = 0;

    this.#el.scoreboard.classList.add('scoreboard');

    this.initValues();
  }

  get el () {
    return this.#el.scoreboard;
  }

  set el (value) {
    this.#el = value;
  }

  get myHits () {
    return this.#myHits;
  }

  set myHits (value) {
    this.#myHits = value;
    this.#el.myHits.textContent = `My Hits: ${value}`;
    this.#el.myHits.classList.add('change');

    setTimeout(() => this.#el.myHits.classList.remove('change'), 700);
  }

  get enemyHits () {
    return this.#enemyHits;
  }

  set enemyHits (value) {
    this.#enemyHits = value;
    this.#el.enemyHits.textContent = `Enemy Hits: ${value}`;
    this.#el.enemyHits.classList.add('change');

    setTimeout(() => this.#el.enemyHits.classList.remove('change'), 700);
  }

  initValues() {
    const {scoreboard, myHits, enemyHits} = this.#el;

    myHits.classList.add('hits', 'my-hits');
    enemyHits.classList.add('hits', 'enemy-hits');
    
    scoreboard.append(myHits, enemyHits);
  }

  reset() {
    this.myHits = 0;
    this.enemyHits = 0;
  }

  destroy () {
    this.el.remove();
  }
}

export default Scoreboard;