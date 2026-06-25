import { categories } from "./words.js";
import {
  getOrCreatePlayer,
  getCurrentPlayer,
  getTheme,
  setTheme,
  isMuted,
  setMuted
} from "./storage.js";
import { getTopPlayers } from "./ranking.js";
import { buildStatistics } from "./statistics.js";
import {
  elements,
  showScreen,
  fillCategoryOptions,
  renderKeyboard,
  renderRanking,
  renderStats
} from "./ui.js";
import { HangmanGame, LETTERS } from "./game.js";

let currentPlayer = getCurrentPlayer();
let muted = isMuted();
let audioContext = null;

const game = new HangmanGame({
  onFinish(player) {
    currentPlayer = player;
  },
  playSound
});

function init() {
  fillCategoryOptions(categories);
  renderKeyboard(LETTERS, (letter) => {
    playSound("click");
    game.guess(letter);
  });
  applyTheme(getTheme());
  applyMuteState();

  if (currentPlayer) {
    elements.playerName.value = currentPlayer.nombre;
  }

  bindEvents();
}

function bindEvents() {
  elements.startForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.playerName.value.trim();

    if (!name) {
      elements.nameError.textContent = "El nombre no puede estar vacio.";
      elements.playerName.focus();
      return;
    }

    elements.nameError.textContent = "";
    currentPlayer = getOrCreatePlayer(name);
    startGame();
  });

  elements.rankingButton.addEventListener("click", () => {
    renderRanking(getTopPlayers());
    showScreen("ranking");
  });

  elements.statsButton.addEventListener("click", () => {
    const player = elements.playerName.value.trim()
      ? getOrCreatePlayer(elements.playerName.value.trim())
      : currentPlayer;
    currentPlayer = player;
    renderStats(buildStatistics(player));
    showScreen("stats");
  });

  elements.backHomeButtons.forEach((button) => {
    button.addEventListener("click", () => showScreen("home"));
  });

  elements.restartButton.addEventListener("click", () => {
    game.stop();
    showScreen("home");
  });

  elements.newGameButton.addEventListener("click", () => {
    if (currentPlayer) {
      startGame();
    }
  });

  elements.themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  });

  elements.muteToggle.addEventListener("click", () => {
    muted = !muted;
    setMuted(muted);
    applyMuteState();
  });

  window.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === "INPUT" || activeTag === "SELECT" || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const letter = event.key.toLowerCase();
    if (LETTERS.includes(letter)) {
      game.guess(letter);
    }
  });
}

function startGame() {
  showScreen("game");
  game.start({
    player: currentPlayer,
    category: elements.categorySelect.value,
    difficulty: elements.difficultySelect.value,
    timerEnabled: true
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.textContent = theme === "dark" ? "☀" : "◐";
  elements.themeToggle.setAttribute("aria-label", theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
}

function applyMuteState() {
  elements.muteToggle.textContent = muted ? "×" : "♪";
  elements.muteToggle.setAttribute("aria-label", muted ? "Activar sonidos" : "Silenciar sonidos");
}

function playSound(type) {
  if (muted) {
    return;
  }

  const settings = {
    click: [360, 0.04],
    correct: [620, 0.08],
    wrong: [170, 0.1],
    win: [740, 0.18],
    loss: [120, 0.2]
  }[type];

  if (!settings) {
    return;
  }

  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = settings[0];
  gain.gain.setValueAtTime(0.06, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + settings[1]);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + settings[1]);
}

init();
