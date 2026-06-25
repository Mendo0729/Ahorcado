export function getWinRate(player) {
  if (!player || player.partidasJugadas === 0) {
    return 0;
  }

  return Math.round((player.victorias / player.partidasJugadas) * 100);
}

export function buildStatistics(player) {
  if (!player) {
    return [];
  }

  return [
    ["Partidas jugadas", player.partidasJugadas],
    ["Victorias", player.victorias],
    ["Derrotas", player.derrotas],
    ["Porcentaje", `${getWinRate(player)}%`],
    ["Puntaje", player.puntaje],
    ["Mejor racha", player.mejorRacha],
    ["Racha actual", player.rachaActual]
  ];
}
