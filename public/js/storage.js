const PLAYERS_KEY = "ahorcadoBienestar.players";
const CURRENT_PLAYER_KEY = "ahorcadoBienestar.currentPlayer";
const THEME_KEY = "ahorcadoBienestar.theme";
const MUTE_KEY = "ahorcadoBienestar.muted";

const basePlayer = (nombre) => ({
  nombre,
  puntaje: 0,
  victorias: 0,
  derrotas: 0,
  partidasJugadas: 0,
  rachaActual: 0,
  mejorRacha: 0,
  fechaUltimaPartida: null
});

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getPlayers() {
  return readJson(PLAYERS_KEY, []);
}

export function savePlayers(players) {
  writeJson(PLAYERS_KEY, players);
}

export function findPlayer(name) {
  const normalized = name.trim().toLowerCase();
  return getPlayers().find((player) => player.nombre.toLowerCase() === normalized) || null;
}

export function getOrCreatePlayer(name) {
  const cleanName = name.trim();
  const players = getPlayers();
  const existing = players.find((player) => player.nombre.toLowerCase() === cleanName.toLowerCase());

  if (existing) {
    setCurrentPlayer(existing.nombre);
    return existing;
  }

  const player = basePlayer(cleanName);
  players.push(player);
  savePlayers(players);
  setCurrentPlayer(player.nombre);
  return player;
}

export function updatePlayer(name, updater) {
  const players = getPlayers();
  const index = players.findIndex((player) => player.nombre.toLowerCase() === name.toLowerCase());

  if (index === -1) {
    return null;
  }

  const updated = updater({ ...players[index] });
  players[index] = updated;
  savePlayers(players);
  setCurrentPlayer(updated.nombre);
  return updated;
}

export function getCurrentPlayer() {
  const name = localStorage.getItem(CURRENT_PLAYER_KEY);
  return name ? findPlayer(name) : null;
}

export function setCurrentPlayer(name) {
  localStorage.setItem(CURRENT_PLAYER_KEY, name);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function isMuted() {
  return localStorage.getItem(MUTE_KEY) === "true";
}

export function setMuted(value) {
  localStorage.setItem(MUTE_KEY, String(value));
}
