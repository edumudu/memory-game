import flipSound from '../../assets/audio/flip.wav';
import matchSound from '../../assets/audio/match.mp3';

class AudioController {
  private flipSound : HTMLAudioElement;
  private matchSound : HTMLAudioElement;

  public constructor() {
    this.flipSound = new Audio(flipSound);
    this.matchSound = new Audio(matchSound);
  }

  public flip() : void {
    this.flipSound.play();
  }

  public match() : void {
    this.matchSound.play();
  }
}

export default AudioController;
