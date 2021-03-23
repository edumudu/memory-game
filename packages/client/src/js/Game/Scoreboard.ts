interface ScoreBoardElements {
  scoreboard : HTMLDivElement | HTMLElement;
  myHits : HTMLDivElement;
  enemyHits : HTMLDivElement;
}

interface Hits {
  my : number;
  enemy : number;
}

class Scoreboard {
  private els : ScoreBoardElements;
  private hits: Hits;

  constructor (el ?: HTMLElement) {
    this.els = {
      scoreboard: el || document.createElement('div'),
      myHits: document.createElement('div'),
      enemyHits: document.createElement('div')
    };

    this.hits = {
      my: 0,
      enemy: 0,
    };

    this.els.scoreboard.classList.add('scoreboard');

    this.initValues();
  }

  public get el () {
    return this.els.scoreboard;
  }

  public get myHits () {
    return this.hits.my;
  }

  public set myHits (value : number) {
    this.hits.my = value;
    this.els.myHits.textContent = `My Hits: ${value}`;
    this.els.myHits.classList.add('change');

    setTimeout(() => this.els.myHits.classList.remove('change'), 700);
  }

  public get enemyHits () {
    return this.hits.enemy;
  }

  public set enemyHits (value : number) {
    this.hits.enemy = value;
    this.els.enemyHits.textContent = `Enemy Hits: ${value}`;
    this.els.enemyHits.classList.add('change');

    setTimeout(() => this.els.enemyHits.classList.remove('change'), 700);
  }

  public initValues() : void {
    const { scoreboard, myHits, enemyHits } = this.els;
    const { enemy, my } = this.hits;

    myHits.classList.add('hits', 'my-hits');
    enemyHits.classList.add('hits', 'enemy-hits');

    this.myHits = my;
    this.enemyHits = enemy;
    
    scoreboard.append(myHits, enemyHits);
  }

  public reset() : void {
    this.hits = {
      my: 0,
      enemy: 0,
    };
  }

  public destroy () : void {
    this.el.remove();
  }
}

export default Scoreboard;
