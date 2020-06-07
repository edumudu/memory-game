class Board {
  constructor (cards, players) {
    this.elapsedTime = 0;
    this.cards = this.shuffle(cards);
    this.players = players;
    this.activesCards = [];
    this.matches = [];
    this.scoreboard = { total: 0 };

    this.playerOfTheTime = players[Math.floor(Math.random() * 2)];

    this.startTimer();
  }

  shuffle (cards) {
    return cards.map(card => {
      const randomNumber = Math.floor(Math.random() * cards.length);
      card.order = randomNumber;
      card.id = `_${Math.random().toString(36).substr(2, 9)}`;

      return card;
    });
  }

  click (id) {
    const card = this.cards.find(card => card.id === id);
    
    if(!this.checkIfCanFlip(id) || this.activesCards.length >= 2) return this.activesCards;
    
    this.activesCards.push(card)

    return this.activesCards;
  }

  checkIfMatch () {
    const [first, second] = this.activesCards;
    const isMatch = first.icon === second.icon;

    this.activesCards = [];
    isMatch && this.matches.push(first, second);

    return isMatch;
  }

  checkIfCanFlip (id) {
    const containInActives = this.activesCards.some(card => card.id === id);
    const containInMatches = this.matches.some(card => card.id === id);

    return !(containInActives || containInMatches)
  }

  checkIfFinish () {
    if(this.scoreboard.total === this.cards.length / 2) {
      return this.players.reduce((winner, client) => this.scoreboard[client] > this.scoreboard[winner] ? client : winner);
    }

    return false;
  }

  incrementHits () {
    const score = this.scoreboard[this.playerOfTheTime]
    this.scoreboard[this.playerOfTheTime] = (score || 0) + 1;
    this.scoreboard.total++;
  }

  togglePlayer () {
    const index = this.players.indexOf(this.playerOfTheTime) === 0 ? 1 : 0;
    this.playerOfTheTime = this.players[index];
  }

  startTimer () {
    // this.timerInterval = setInterval(() => {
    //   this.elapsedTime++;
    // }, 1000);
  }
}

module.exports = Board;