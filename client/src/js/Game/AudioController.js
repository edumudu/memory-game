import flipSound from '../../assets/audio/flip.wav';
import matchSound from '../../assets/audio/match.mp3';

class AudioController {
  constructor() {
    this.flipSound = new Audio(flipSound);
    this.matchSound = new Audio(matchSound);
  }

  flip() {
    this.flipSound.play();
  }

  match() {
    this.matchSound.play();
  }
}

export default AudioController;