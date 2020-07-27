import { CardJSON, CardAPI } from "../@types";

interface ScoreBoard extends Record<string, number>{
  total : number;
}

class Board {
  private elapsedTime : number;
  private cards : CardJSON[];
  private players : string[];
  private activesCards : CardJSON[];
  private matches : CardJSON[];
  public scoreboard : ScoreBoard;
  public rematchRequests : number;
  public playerOfTheTime : string;

  constructor (cards : CardAPI[], players : string[]) {
    this.elapsedTime = 0;
    this.cards = this.shuffle([...cards, ...cards].map(card => ({ ...card })));
    this.players = players;
    this.activesCards = [];
    this.matches = [];
    this.scoreboard = { total: 0 };
    this.rematchRequests = 0;

    this.playerOfTheTime = players[Math.floor(Math.random() * 2)];
  }

  private shuffle (cards : CardAPI[]) : CardJSON[] {
    return cards.map(({ icon }) => {
      const randomNumber = Math.floor(Math.random() * cards.length);
      const card : CardJSON = {
        icon,
        order: randomNumber,
        id: `_${Math.random().toString(36).substr(2, 9)}`
      };
      
      return card;
    });
  }

  public click (id : string) : CardJSON[] {
    const card = this.cards.find(card => card.id === id);
    
    if(!card || !this.checkIfCanFlip(id) || this.activesCards.length >= 2) return this.activesCards;
    
    this.activesCards.push(card)

    return this.activesCards;
  }

  public checkIfMatch () : boolean {
    const [first, second] = this.activesCards;
    const isMatch = first.icon === second.icon;

    this.activesCards = [];
    isMatch && this.matches.push(first, second);

    return isMatch;
  }

  public checkIfCanFlip (id : string) : boolean {
    const containInActives = this.activesCards.some(card => card.id === id);
    const containInMatches = this.matches.some(card => card.id === id);

    return !(containInActives || containInMatches)
  }

  public checkIfFinish () : boolean | string {
    if(this.scoreboard.total === this.cards.length / 2) {
      return this.players.reduce((winner, client) => this.scoreboard[client] > this.scoreboard[winner] ? client : winner);
    }

    return false;
  }

  public incrementHits () : void {
    const score = this.scoreboard[this.playerOfTheTime]
    this.scoreboard[this.playerOfTheTime] = (score || 0) + 1;
    this.scoreboard.total++;
  }

  public togglePlayer () : void {
    this.playerOfTheTime = this.players.find(player => player !== this.playerOfTheTime) || '';
  }
}

export default Board;
