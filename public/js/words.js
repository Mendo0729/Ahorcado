const wordGroups = {
  "Emociones positivas": [
    "alegria", "calma", "esperanza", "gratitud", "serenidad", "entusiasmo", "optimismo",
    "satisfaccion", "ilusion", "orgullo", "paz", "felicidad", "confianza", "carino",
    "amor", "empatia", "ternura", "alivio", "agrado", "gozo", "contento", "placer",
    "aprecio", "animo", "sonrisa", "risa", "euforia", "asombro", "inspiracion",
    "seguridad", "plenitud", "armonia", "dulzura", "interes", "motivacion", "energia",
    "quietud", "valor", "sorpresa", "compasion", "cercania", "tranquilidad", "pasion",
    "iluminar", "bienvenida"
  ],
  "Autocuidado": [
    "descansar", "respirar", "meditar", "hidratar", "caminar", "dormir", "relajarse",
    "desconectar", "cuidarse", "estirar", "pausar", "escuchar", "aceptar", "comer",
    "beber", "ordenar", "darse", "cuidar", "mimarse", "leer", "pasear", "jugar",
    "bailar", "reir", "escribir", "dibujar", "priorizar", "organizar", "lavarse",
    "descanso", "rutina", "limites", "silencio", "siesta", "calmar", "soltar",
    "observar", "sentir", "pedir", "ayuda", "hablar", "banarse",
    "nutrir", "cocinar", "cantar"
  ],
  "Salud mental": [
    "autoestima", "resiliencia", "equilibrio", "autocontrol", "conciencia", "reflexion",
    "bienestar", "crecimiento", "fortaleza", "proposito", "aceptacion", "estabilidad",
    "atencion", "mindfulness", "regulacion", "claridad", "identidad", "seguridad",
    "pensamiento", "emocion", "conducta", "memoria", "aprendizaje", "adaptacion",
    "autonomia", "motivacion", "descanso", "confianza", "paciencia", "calma",
    "esperanza", "sentido", "balance", "progreso", "recursos", "habitos", "cambio",
    "cuidado", "apoyo", "escucha", "dialogo", "limites", "energia", "realismo",
    "presencia"
  ],
  "Relaciones saludables": [
    "apoyo", "respeto", "confianza", "escucha", "empatia", "comprension", "cooperacion",
    "amistad", "dialogo", "compania", "afecto", "union", "familia", "abrazo",
    "perdon", "cuidado", "lealtad", "honestidad", "paciencia", "ternura", "carino",
    "acuerdo", "ayuda", "equipo", "solidaridad", "cercania", "saludo", "mensaje",
    "visita", "compartir", "colaborar", "conectar", "hablar", "aceptar", "apreciar",
    "valorar", "convivir", "acompanar",
    "incluir", "proteger", "consolar", "animar", "reparar", "ceder", "celebrar"
  ],
  "Mindfulness": [
    "presente", "respirar", "silencio", "observar", "atencion", "pausa", "calma",
    "naturaleza", "gratitud", "equilibrio", "serenidad", "notar", "sentir", "escuchar",
    "mirar", "fluir", "quietud", "conciencia", "aceptar", "soltar", "despacio",
    "instante", "ahora", "cuerpo", "mente", "aliento", "ritmo", "detalle", "aroma",
    "sonido", "luz", "sombra", "brisa", "paso", "camino", "conectar", "atender",
    "reposo", "claridad", "presencia", "contempla", "enfoque", "centrarse", "apertura",
    "curiosidad"
  ],
  "Fortalezas personales": [
    "valentia", "paciencia", "disciplina", "perseverancia", "constancia", "creatividad",
    "liderazgo", "honestidad", "humildad", "generosidad", "responsabilidad", "compromiso",
    "flexibilidad", "coraje", "firmeza", "prudencia", "curiosidad", "amabilidad",
    "justicia", "templanza", "gratitud", "esperanza", "humor", "sabiduria",
    "esfuerzo", "orden", "energia", "iniciativa", "respeto", "lealtad", "optimismo",
    "autonomia", "confianza", "adaptacion", "resistencia", "dedicacion", "talento",
    "vision", "enfoque", "progreso", "valor", "calma", "servicio", "sinceridad",
    "persistir"
  ],
  "Valores": [
    "respeto", "amor", "bondad", "solidaridad", "empatia", "justicia", "honestidad",
    "libertad", "paz", "igualdad", "tolerancia", "compasion", "lealtad", "dignidad",
    "humildad", "gratitud", "cuidado", "verdad", "union", "amistad", "familia",
    "servicio", "equidad", "integridad", "generosidad", "responsabilidad", "coherencia",
    "inclusion", "perdon", "confianza", "dialogo", "paciencia", "colaboracion",
    "comunidad", "amabilidad", "civismo", "armonia",
    "honor", "nobleza", "apoyo", "calidez", "alegria", "cercania", "prudencia",
    "esperanza"
  ]
};

export const categories = Object.keys(wordGroups);

function getDifficulty(word) {
  if (word.length <= 6) {
    return "easy";
  }

  if (word.length <= 9) {
    return "medium";
  }

  return "hard";
}

export const words = Object.entries(wordGroups).flatMap(([category, entries]) =>
  entries.map((entry) => {
    const word = normalizeText(entry);
    return {
      word,
      category,
      difficulty: getDifficulty(word)
    };
  })
);

export function normalizeText(value) {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u00f1/g, "n");
}

export function getRandomWord(category = "random", difficulty = "medium") {
  const matches = words.filter((item) => {
    const categoryMatches = category === "random" || item.category === category;
    const difficultyMatches = item.difficulty === difficulty;
    return categoryMatches && difficultyMatches;
  });

  const pool = matches.length ? matches : words;
  return pool[Math.floor(Math.random() * pool.length)];
}
