import { getRandomWord, normalizeText } from "./words.js";
import { updatePlayer } from "./storage.js";
import {
  elements,
  renderWord,
  updateKeyboard,
  updateHangman,
  setMessage,
  launchConfetti
} from "./ui.js";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const MAX_MISTAKES = 6;
const TIMER_SECONDS = 120;

const difficultyNames = {
  easy: "Facil",
  medium: "Media",
  hard: "Dificil"
};

export class HangmanGame {
  constructor({ onFinish, playSound }) {
    this.onFinish = onFinish;
    this.playSound = playSound;
    this.timerId = null;
    this.nextWordTimeout = null;
    this.resetState();
  }

  resetState() {
    this.player = null;
    this.wordData = null;
    this.word = "";
    this.category = "random";
    this.difficulty = "medium";
    this.guessedLetters = new Set();
    this.correctLetters = new Set();
    this.wrongLetters = new Set();
    this.mistakes = 0;
    this.isFinished = false;
    this.isLoadingNextWord = false;
    this.timerEnabled = true;
    this.timeLeft = TIMER_SECONDS;
  }

  start({ player, category, difficulty, timerEnabled }) {
    this.stopTimer();
    this.clearNextWordTimeout();
    this.resetState();
    this.player = player;
    this.category = category;
    this.difficulty = difficulty;
    this.timerEnabled = timerEnabled;

    elements.playerLabel.textContent = player.nombre;
    elements.difficultyLabel.textContent = difficultyNames[difficulty] || difficulty;
    elements.scoreLabel.textContent = player.puntaje;

    this.loadNextWord();
    setMessage("Elige una letra para empezar.");
  }

  guess(rawLetter) {
    if (this.isFinished || this.isLoadingNextWord) {
      return;
    }

    const letter = normalizeText(rawLetter).charAt(0);
    if (!LETTERS.includes(rawLetter) && !LETTERS.includes(letter)) {
      return;
    }

    if (this.guessedLetters.has(letter)) {
      return;
    }

    this.guessedLetters.add(letter);

    if (this.word.includes(letter)) {
      this.correctLetters.add(letter);
      this.playSound("correct");
      setMessage("Muy bien, esa letra esta en la palabra.");
    } else {
      this.wrongLetters.add(letter);
      this.mistakes += 1;
      this.playSound("wrong");
      setMessage("Esa letra no aparece. Respira y prueba otra.");
    }

    this.render();
    this.checkResult();
  }

  startTimer() {
    this.timerId = window.setInterval(() => {
      this.timeLeft -= 1;
      elements.timerLabel.textContent = this.timeLeft;

      if (this.timeLeft <= 0) {
        this.finishLoss("Se acabo el tiempo.");
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  clearNextWordTimeout() {
    if (this.nextWordTimeout) {
      window.clearTimeout(this.nextWordTimeout);
      this.nextWordTimeout = null;
    }
  }

  stop() {
    this.stopTimer();
    this.clearNextWordTimeout();
    this.isFinished = true;
    this.isLoadingNextWord = false;
  }

  render() {
    const displayLetters = this.word.split("").map((letter) => (this.correctLetters.has(letter) ? letter : ""));
    renderWord(displayLetters);
    updateKeyboard(this.guessedLetters, this.correctLetters, this.wrongLetters, this.isFinished || this.isLoadingNextWord);
    updateHangman(this.mistakes);
    elements.mistakeCount.textContent = this.mistakes;
  }

  checkResult() {
    const won = this.word.split("").every((letter) => this.correctLetters.has(letter));

    if (won) {
      this.completeWord();
      return;
    }

    if (this.mistakes >= MAX_MISTAKES) {
      this.finishLoss("Perdiste la partida.");
    }
  }

  loadNextWord() {
    this.stopTimer();
    this.wordData = getRandomWord(this.category, this.difficulty);
    this.word = normalizeText(this.wordData.word);
    this.guessedLetters = new Set();
    this.correctLetters = new Set();
    this.wrongLetters = new Set();
    this.mistakes = 0;
    this.isLoadingNextWord = false;
    this.timeLeft = TIMER_SECONDS;

    elements.categoryLabel.textContent = this.wordData.category;
    elements.timerLabel.textContent = this.timerEnabled ? this.timeLeft : "Sin limite";

    this.render();

    if (this.timerEnabled) {
      this.startTimer();
    }
  }

  completeWord() {
    if (this.isLoadingNextWord || this.isFinished) {
      return;
    }

    this.isLoadingNextWord = true;
    this.stopTimer();

    const updatedPlayer = updatePlayer(this.player.nombre, (player) => {
      const nextStreak = player.rachaActual + 1;

      return {
        ...player,
        puntaje: player.puntaje + 10,
        victorias: player.victorias + 1,
        partidasJugadas: player.partidasJugadas + 1,
        rachaActual: nextStreak,
        mejorRacha: Math.max(player.mejorRacha, nextStreak),
        fechaUltimaPartida: new Date().toISOString()
      };
    });

    this.player = updatedPlayer || this.player;
    elements.scoreLabel.textContent = this.player.puntaje;
    this.correctLetters = new Set(this.word.split(""));
    this.render();
    setMessage("Palabra correcta. +10 puntos. Preparando la siguiente...", "win");
    this.playSound("win");
    launchConfetti();
    this.onFinish(this.player);

    this.nextWordTimeout = window.setTimeout(() => {
      this.nextWordTimeout = null;
      if (!this.isFinished) {
        this.loadNextWord();
        setMessage("Nueva palabra. Tienes 120 segundos y 6 errores disponibles.");
      }
    }, 1100);
  }

  finishLoss(reason) {
    if (this.isFinished) {
      return;
    }

    this.isFinished = true;
    this.stopTimer();

    const updatedPlayer = updatePlayer(this.player.nombre, (player) => {
      return {
        ...player,
        puntaje: Math.max(0, player.puntaje - 5),
        derrotas: player.derrotas + 1,
        partidasJugadas: player.partidasJugadas + 1,
        rachaActual: 0,
        fechaUltimaPartida: new Date().toISOString()
      };
    });

    this.player = updatedPlayer || this.player;
    elements.scoreLabel.textContent = this.player.puntaje;
    this.correctLetters = new Set(this.word.split(""));
    this.render();
    setMessage(`${reason} La palabra era "${this.word}".`, "loss");
    this.playSound("loss");

    this.onFinish(this.player);
  }
}

export { LETTERS };
