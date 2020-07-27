import Card from './Card';
import Scoreboard from './Scoreboard';
import AudioController from './AudioController';
import { CardJSON } from '../../../@types';

class Board {
  private board : HTMLElement;
  private timer: HTMLDivElement;
  private playerTurnEl: HTMLDivElement;
  private cards : Card[];
  private me : string;
  private players : string[];
  private elapsedTime : number;
  private timerInterval : NodeJS.Timeout;
  private AudioController : AudioController;
  private scoreboard : Scoreboard;

  constructor(
    el : HTMLElement,
    { elapsedTime, cards, players } : { elapsedTime: number, cards: CardJSON[], players: string[] },
    me : string
  ) {
    this.board = el;
    this.me = me;
    this.elapsedTime = elapsedTime;
    this.players = players;
    this.cards = cards.map(card => new Card(card));

    this.timer = document.createElement('div');
    this.timer.textContent = `Time ${this.elapsedTime}`;

    this.playerTurnEl = document.createElement('div');
    this.playerTurnEl.classList.add('player-turn');

    this.AudioController = new AudioController;
    this.scoreboard = new Scoreboard;

    this.timer.classList.add('timer');
    document.querySelector('#game-info')?.append(this.timer, this.playerTurnEl);
    
    this.timerInterval = this.startTimer();

    this.insertCardsInBoard();
    this.initScoreBoard();
  }

  private initScoreBoard() : void {
    document.querySelector('#game-info')?.appendChild(this.scoreboard.el);
  }

  private startTimer() : NodeJS.Timeout {
    return setInterval(() => {
      this.elapsedTime++;
      this.timer.textContent = `Time ${this.elapsedTime}`;
    }, 1000);
  }

  private insertCardsInBoard() : void {
    this.cards.forEach(card => this.board.appendChild(card.toNode()));
  }

  private removeCardsFromBoard() : void {
    this.cards.forEach(card => this.board.removeChild(card.toNode()));
  }

  public flip (id : string) : void {
    const card = this.cards.find(card => id === card.id);
    card?.flip();
  }

  public unflip (ids : string[]) : void {
    const cards = this.cards.filter(card => ids.includes(card.id));
    cards.forEach(card => card.unflip());
  }

  public check(ids : string[]) : void {
    const cards = this.cards.filter(card => ids.includes(card.id));
    cards.forEach(card => card.markAsMatched());
    this.AudioController.match();
  }

  public setScoreboard (score : Record<string, number>) : void {
    this.players.forEach(player => {
      this.scoreboard[player === this.me ? 'myHits' : 'enemyHits'] = score[player] || 0;
    })
  }

  public setPlayerTurn(playerOfTheTime : string) : void {
    this.playerTurnEl.textContent = playerOfTheTime === this.me ? 'Your turn' : 'Enemy turn';
  }

  public stopTimers() : void {
    clearInterval(this.timerInterval);
  }

  public destroy () : void {
    this.removeCardsFromBoard();
    this.scoreboard.destroy();
    this.stopTimers();
    this.timer.remove();
    this.playerTurnEl.remove();
  }
}

export default Board;
