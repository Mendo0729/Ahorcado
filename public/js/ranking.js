import { getPlayers } from "./storage.js";

export function getTopPlayers(limit = 10) {
  return [...getPlayers()]
    .sort((a, b) => b.puntaje - a.puntaje || b.victorias - a.victorias || a.nombre.localeCompare(b.nombre))
    .slice(0, limit);
}
