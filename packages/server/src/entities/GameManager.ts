import { CardAPI } from "../../@types";
import Board from '../Board';
import cards from '../data/cards';

export default class GameManager {
  private static cards: CardAPI[] = cards;
  private games: Record<string, Board> = {};
  private onlinePlayers: string[] = [];

  get playersCount() {
    return this.onlinePlayers.length;
  }

  public addPlayer(playerSocketId: string) {
    this.onlinePlayers = [...this.onlinePlayers, playerSocketId];
  }

  public removePlayer(playerSocketId: string) {
    this.onlinePlayers = this.onlinePlayers.filter(id => id !== playerSocketId);
  }

  public createGame(room: string, players: string[]) {
    this.games[room] = new Board(GameManager.cards, players);
  }

  public deleteGame(room: string) {
    delete this.games[room];
  }

  public getGame(room: string) {
    return this.games[room];
  }
}