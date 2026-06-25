const screens = {
  home: document.querySelector("#home-screen"),
  game: document.querySelector("#game-screen"),
  ranking: document.querySelector("#ranking-screen"),
  stats: document.querySelector("#stats-screen")
};

export const elements = {
  startForm: document.querySelector("#start-form"),
  playerName: document.querySelector("#player-name"),
  nameError: document.querySelector("#name-error"),
  categorySelect: document.querySelector("#category-select"),
  difficultySelect: document.querySelector("#difficulty-select"),
  rankingButton: document.querySelector("#ranking-button"),
  statsButton: document.querySelector("#stats-button"),
  themeToggle: document.querySelector("#theme-toggle"),
  muteToggle: document.querySelector("#mute-toggle"),
  backHomeButtons: document.querySelectorAll(".back-home"),
  newGameButton: document.querySelector("#new-game-button"),
  restartButton: document.querySelector("#restart-button"),
  playerLabel: document.querySelector("#player-label"),
  categoryLabel: document.querySelector("#category-label"),
  difficultyLabel: document.querySelector("#difficulty-label"),
  scoreLabel: document.querySelector("#score-label"),
  mistakeCount: document.querySelector("#mistake-count"),
  timerLabel: document.querySelector("#timer-label"),
  wordDisplay: document.querySelector("#word-display"),
  keyboard: document.querySelector("#keyboard"),
  gameMessage: document.querySelector("#game-message"),
  rankingBody: document.querySelector("#ranking-body"),
  statsGrid: document.querySelector("#stats-grid"),
  confetti: document.querySelector("#confetti")
};

export function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
}

export function fillCategoryOptions(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    elements.categorySelect.append(option);
  });
}

export function renderWord(displayLetters) {
  elements.wordDisplay.replaceChildren();

  displayLetters.forEach((letter) => {
    const slot = document.createElement("span");
    slot.className = "letter-slot";
    slot.textContent = letter || "";
    elements.wordDisplay.append(slot);
  });
}

export function renderKeyboard(letters, onClick) {
  elements.keyboard.replaceChildren();

  letters.forEach((letter) => {
    const button = document.createElement("button");
    button.className = "key";
    button.type = "button";
    button.textContent = letter;
    button.setAttribute("aria-label", `Probar letra ${letter.toUpperCase()}`);
    button.addEventListener("click", () => onClick(letter));
    elements.keyboard.append(button);
  });
}

export function updateKeyboard(guessedLetters, correctLetters, wrongLetters, disabled) {
  elements.keyboard.querySelectorAll(".key").forEach((button) => {
    const letter = button.textContent.toLowerCase();
    button.disabled = disabled || guessedLetters.has(letter);
    button.classList.toggle("is-correct", correctLetters.has(letter));
    button.classList.toggle("is-wrong", wrongLetters.has(letter));
  });
}

export function updateHangman(mistakes) {
  document.querySelectorAll(".body-part").forEach((part) => {
    const partNumber = Number(part.dataset.part);
    part.classList.toggle("is-visible", partNumber <= mistakes);
  });
}

export function setMessage(text, state = "") {
  elements.gameMessage.textContent = text;
  elements.gameMessage.classList.toggle("is-win", state === "win");
  elements.gameMessage.classList.toggle("is-loss", state === "loss");
}

export function renderRanking(players) {
  elements.rankingBody.replaceChildren();

  if (!players.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="empty-state" colspan="5">Aun no hay jugadores.</td>`;
    elements.rankingBody.append(row);
    return;
  }

  players.forEach((player, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.nombre}</td>
      <td>${player.puntaje}</td>
      <td>${player.victorias}</td>
      <td>${player.derrotas}</td>
    `;
    elements.rankingBody.append(row);
  });
}

export function renderStats(items) {
  elements.statsGrid.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Escribe tu nombre o juega una partida para ver estadisticas.";
    elements.statsGrid.append(empty);
    return;
  }

  items.forEach(([label, value]) => {
    const card = document.createElement("article");
    card.className = "stat-card";
    card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    elements.statsGrid.append(card);
  });
}

export function launchConfetti() {
  elements.confetti.replaceChildren();
  const colors = ["#1E00FF", "#6C63FF", "#00A6A6", "#FFD166", "#FF7777"];

  for (let index = 0; index < 42; index += 1) {
    const piece = document.createElement("span");
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 220}ms`;
    elements.confetti.append(piece);
  }

  window.setTimeout(() => elements.confetti.replaceChildren(), 1200);
}
