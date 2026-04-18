import { vCH, invertirPalabra } from "./utils.js";

/**
 * Extrae la secuencia de vocales del borde de una sílaba (inicio o final).
 * Entrada : p = sílaba como string | d = "inv" si la sílaba está invertida
 * Salida  : string con las vocales consecutivas encontradas antes de la
 *           primera consonante, leyendo desde el final de la sílaba
 *
 * Se usa para determinar qué vocales quedan expuestas en el límite entre
 * dos palabras, y así evaluar si forman sinalefa o hiato.
 * Ejemplo (última sílaba de "cielo" = "lo" → no hay vocal expuesta más
 * que "o"; de "aire" última sílaba "re" → "e").
 *
 * El parámetro "inv" indica que la sílaba ya viene invertida (se usa para
 * analizar el inicio de la segunda palabra sin revertirla dos veces).
 * La "y" final se convierte a "i" cuando va precedida de vocal (ley → lei).
 */
export function extraeVocales(p, d) {
  let palabra = p;
  let palabraCopia = p.split("");  // array mutable para sustituir 'y' → 'i'
  let largoPalabra = p.length;
  let indPalabra = "";
  let secVocales = "";
  let direccion = d;
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];

  // La "y" actúa como vocal cuando va después de vocal (ley, rey, hoy)
  // En ese caso se sustituye por "i" para el análisis
  for (let i = largoPalabra; i >= 0; i--) {
    if (palabra[i] == "y") {
      if (largoPalabra == 1) {
        palabraCopia = ["i"];
      } else {
        //caso palabra invertida
        if (direccion == "inv") {
          for (let j = 0; j < vocales.length; j++) {
            if (palabra[i + 1] == vocales[j]) {
              palabraCopia[i] = "i";
            }
          }
        } else {
          //caso palabra no invertida
          for (let j = 0; j < vocales.length; j++) {
            if (palabra[i - 1] == vocales[j]) {
              palabraCopia[i] = "i";
            }
          }
        }
      }
    }
  }
  for (let i = largoPalabra - 1; i >= 0; i--) {
    let caracter = palabraCopia[i];
    let caracterRecibido = vCH(caracter);
    indPalabra = indPalabra.concat(caracterRecibido);
  }
  for (let i = 0; i < largoPalabra; i++) {
    if (indPalabra[i] == "v") {
      let n = largoPalabra - 1 - i;
      let caracter1 = palabra[n];
      secVocales = secVocales.concat(caracter1);
    } else if (indPalabra[i] == "c") {
      i = largoPalabra;
    }
  }
  secVocales = invertirPalabra(secVocales);
  return secVocales;
}

/**
 * Determina si dos vocales (contiguas o separadas por h) forman hiato.
 * Entrada : string de 2 o 3 caracteres (las dos vocales, con h opcional)
 * Salida  : true si forman hiato, false si forman diptongo
 *
 * Reglas de hiato en español:
 *   1. Dos vocales abiertas distintas: ae, ao, ea, eo, oa, oe
 *   2. Dos vocales iguales: aa, ee, oo (ia doble→hiato, uu→hiato)
 *   3. Vocal cerrada ACENTUADA junto a cualquier otra vocal: aí, eí, oí,
 *      ía, íe, ío, aú, eú, oú, úa, úe (la tilde "rompe" el diptongo)
 *
 * La "h" intercalada es muda y transparente (RAE 2010): se elimina antes
 * de comparar, así "ahora" → "ao" → hiato, igual que si no hubiera h.
 * Las vocales fuertes acentuadas (á, é, ó) no cambian el resultado
 * porque el acento en vocal fuerte no rompe el diptongo — solo se
 * normaliza para simplificar la comparación.
 */
export function hiato(s) {
  let dip = s;
  let b;

  // La h es muda: se elimina para evaluar las vocales en contacto real
  if (dip.match("h"));
  {
    dip = dip.replace("h", "");
  }

  // Normaliza vocales fuertes acentuadas (á→a, é→e, ó→o)
  // El acento en vocal fuerte no rompe el diptongo, solo marca énfasis
  dip = dip.replaceAll("á", "a");
  dip = dip.replaceAll("é", "e");
  dip = dip.replaceAll("ó", "o");

  b =
    dip == "aa" || dip == "ee" || dip == "oo" || dip == "ii" || dip == "uu" || // vocales iguales
    dip == "ae" || dip == "ea" || dip == "ao" || dip == "oa" || dip == "eo" || dip == "oe" || // abiertas distintas
    dip == "aí" || dip == "aú" || dip == "eí" || dip == "eú" || dip == "oí" || dip == "oú" || // fuerte + cerrada acentuada
    dip == "ía" || dip == "úa" || dip == "íe" || dip == "úe" || dip == "ío" || dip == "úe";   // cerrada acentuada + fuerte

  return b;
}

/**
 * Determina si dos vocales en contacto entre palabras forman sinalefa.
 * Entrada : string de 2 caracteres (vocal final palabra 1 + vocal inicial palabra 2)
 * Salida  : true si forman sinalefa, false si no
 *
 * En métrica española la h es muda, por lo que la sinalefa puede ocurrir
 * a través de ella. Esta función recibe ya las vocales limpias (sin h).
 *
 * Los cuatro grupos de pares que forman sinalefa:
 *   caso1 — fuerte+débil  : ao, ae, oi, eu... (la débil se apoya en la fuerte)
 *   caso2 — débil+fuerte  : ia, ie, ua, ue... (la débil se apoya en la fuerte)
 *   caso3 — vocales iguales: aa, ee, oo... (se fusionan en una sola sílaba)
 *   caso4 — cerrada acentuada+otra : ía, íe, úa... (la acentuada atrae a la otra)
 *
 * Nota: fuerte = a, e, o | débil = i, u, y
 */
export function sinalefa(v) {
  let sina = false;
  let sina1 = false;
  let sina2 = false;
  let sina3 = false;
  let sina4 = false;
  let vocales;
  vocales = v;

  // Fuerte debil
  let caso1 = [
    "ao", "ae", "au", "ai", "ay",
    "oe", "ou", "oi", "oy",
    "eu", "ei", "ey",
    "ui", "uy",
    "áo", "áe", "áu", "ái", "áy",
    "óe", "óu", "ói", "óy",
    "éu", "éi", "éy",
    "úi", "úy",
  ];
  // Debil fuerte
  let caso2 = [
    "ia", "ya", "ie", "ye", "io", "yo", "iu", "yu",
    "ua", "ue", "uo",
    "ea", "eo", "oa", "oe",
    "iá", "yá", "ié", "yé", "ió", "yó", "iú", "yú",
    "uá", "ué", "uó",
    "eá", "eó", "oá",
  ];
  // Vocales iguales
  let caso3 = [
    "aa", "ee", "ii", "yy", "oo", "uu",
    "aá", "eé", "ií", "oó", "uú",
    "áa", "ée", "íi", "óo", "úu",
  ];

  let caso4 = [
    "ía", "íe", "ío", "íu", "íy",
    "úá", "úé", "úó", "úy",
    "éa", "éo", "éy",
    "óa", "óy",
    "aí", "eí", "oí", "uí", "yí",
    "aú", "eú", "oú", "yú",
    "aé", "oé", "yé",
    "aó", "yó",
  ];

  for (let i = 0; i < caso1.length; i++) {
    if (vocales == caso1[i]) { sina1 = true; i = caso1.length; }
    else { sina1 = false; }
  }
  for (let i = 0; i < caso2.length; i++) {
    if (vocales == caso2[i]) { sina2 = true; i = caso2.length; }
    else { sina2 = false; }
  }
  for (let i = 0; i < caso3.length; i++) {
    if (vocales == caso3[i]) { sina3 = true; i = caso3.length; }
    else { sina3 = false; }
  }
  for (let i = 0; i < caso4.length; i++) {
    if (vocales == caso4[i]) { sina4 = true; i = caso4.length; }
    else { sina4 = false; }
  }
  sina = sina1 || sina2 || sina3 || sina4;
  return sina;
}

/**
 * Determina si tres vocales consecutivas (de tres palabras distintas) forman trisinalefa.
 * Entrada : string de 3 caracteres (una vocal de cada palabra)
 * Salida  : true si las tres forman una sola sílaba poética, false si no
 *
 * Para que haya trisinalefa, las tres vocales deben poder pronunciarse
 * en un solo golpe de voz. Se evalúa su "apertura" (jerarquía de abertura):
 *   a=5, o=4, e=3, u=2, i/y=1
 *
 * Condiciones válidas (cualquiera de estas forma trisinalefa):
 *   caso1 — la vocal del medio es la más abierta o igual: tipo "campana" (i-a-u)
 *   caso2 — secuencia descendente en apertura: a-e-i (cada vocal más cerrada)
 *   caso3 — secuencia ascendente en apertura: i-e-a (cada vocal más abierta)
 *   caso4 — las tres vocales son iguales en apertura: a-a-a
 */
export function triSinalefa(s) {
  let trio = s;
  let vocales = new Array(3);
  let numeros = new Array(3);

  let caso1 = false;
  let caso2 = false;
  let caso3 = false;
  let caso4 = false;
  let tripSinalefa = false;

  vocales[0] = trio.substring(0, 1);
  vocales[1] = trio.substring(1, 2);
  vocales[2] = trio.substring(2);

  for (let i = 0; i < 3; i++) {
    if (vocales[i] == "a" || vocales[i] == "á") { numeros[i] = 5; }
    if (vocales[i] == "o" || vocales[i] == "ó") { numeros[i] = 4; }
    if (vocales[i] == "e" || vocales[i] == "é") { numeros[i] = 3; }
    if (vocales[i] == "u" || vocales[i] == "ú") { numeros[i] = 2; }
    if (vocales[i] == "i" || vocales[i] == "í" || vocales[i] == "y") { numeros[i] = 1; }
  }

  // sinalefa vocal más abierta en medio.
  caso1 = numeros[1] >= numeros[0] && numeros[1] >= numeros[2];
  // Sinalefa ascendente
  caso2 = numeros[0] >= numeros[1] && numeros[1] >= numeros[2];
  // Sinalefa descendente
  caso3 = numeros[0] <= numeros[1] && numeros[1] <= numeros[2];
  // Sinalefa todas las vocales iguales
  caso4 = numeros[0] == numeros[1] && numeros[1] == numeros[2];

  tripSinalefa = caso1 || caso2 || caso3 || caso4;
  return tripSinalefa;
}

/**
 * Determina el caso de tres vocales seguidas dentro de una sílaba (triptongo o no).
 * Entrada : string de 3 vocales (puede incluir h muda)
 * Salida  : número de caso (0 = no triptongo, 1-4 = tipo de división)
 *
 * Sistema de codificación de vocales:
 *   F = vocal fuerte (a, e, o) o vocal débil acentuada (í, ú) en "trip"
 *   d = vocal débil no acentuada (i, u)
 *   f = vocal débil acentuada (í, ú) — solo en "trip1" para distinguirla
 *
 * Se usan dos codificaciones paralelas (trip y trip1) porque el acento
 * en vocal débil (í, ú) cambia el comportamiento: rompe el triptongo.
 *
 * Casos resultado:
 *   0 — no aplica (es triptongo "uie" o "uia", caso especial)
 *   1 — FFF: tres fuertes → se dividen en tres sílabas separadas
 *   2 — débil+fuerte+débil o variantes → diptongo, se divide en 2
 *   3 — dFF sin acento en débil → triptongo, las tres en una sílaba
 *   4 — dFF con acento en débil (dfF) → se divide: la í/ú acentuada rompe
 *
 * Excepción: "uie" y "uia" son triptongos garantizados (como en "buey"),
 * se devuelve 0 y se maneja en el nivel superior.
 */
export function tresVocales(t) {
  let trip = t;
  let trip1 = t;
  let caso = 0;

  // La h es muda: se elimina para evaluar solo las vocales
  if (trip.match("h"));
  {
    trip = trip.replace(/h/, "");
  }

  if (!(trip == "uie" || trip == "uia")) {
    // Codificación 1 (trip): í y ú se tratan igual que las demás fuertes
    trip = trip.replaceAll("á", "F").replaceAll("é", "F").replaceAll("ó", "F");
    trip = trip.replaceAll("í", "F").replaceAll("ú", "F");
    trip = trip.replaceAll("a", "F").replaceAll("e", "F").replaceAll("o", "F");
    trip = trip.replaceAll("i", "d").replaceAll("u", "d");

    // Codificación 2 (trip1): í y ú se marcan como "f" para detectar acento en débil
    trip1 = trip1.replaceAll("á", "F").replaceAll("é", "F").replaceAll("ó", "F");
    trip1 = trip1.replaceAll("í", "f").replaceAll("ú", "f");
    trip1 = trip1.replaceAll("a", "F").replaceAll("e", "F").replaceAll("o", "F");
    trip1 = trip1.replaceAll("i", "d").replaceAll("u", "d");

    if (trip == "FFF") {
      caso = 1; // tres fuertes → tres sílabas
    }

    if (trip == "FFd" || trip == "FdF" || trip == "Fdd" || trip == "ddF") {
      caso = 2; // hay diptongo → dos sílabas
    }

    if (trip == "dFF") {
      if (trip1 == "dfF") {
        caso = 4; // débil acentuada (í/ú) + fuertes → se rompe el triptongo
      } else {
        caso = 3; // débil sin acento + fuertes → triptongo válido
      }
    }
  }

  return caso;
}

/**
 * Determina el caso de cuatro vocales seguidas dentro de una sílaba.
 * Entrada : string de 4 vocales (puede incluir h muda)
 * Salida  : número de caso del 1 al 15 que indica cómo dividirlas
 *
 * Sistema de codificación (igual que tresVocales pero sin trip1):
 *   F = vocal fuerte (a, e, o) o fuerte acentuada (á, é, ó)
 *   f = vocal débil acentuada (í, ú) — rompe el diptongo
 *   d = vocal débil no acentuada (i, u)
 *
 * Cada caso representa una combinación distinta de tipos de vocal y
 * determina cómo se divide la secuencia en sílabas dentro de cuatroSilaba.
 */
export function cuatroVocales(t) {
  let trip = t;
  let caso = 0;
  if (trip.match("h"));
  {
    trip = trip.replace("h", "");
  }
  trip = trip.replaceAll("á", "F").replaceAll("é", "F").replaceAll("ó", "F");
  trip = trip.replaceAll("í", "f").replaceAll("ú", "f");
  trip = trip.replaceAll("a", "F").replaceAll("e", "F").replaceAll("o", "F");
  trip = trip.replaceAll("i", "d").replaceAll("u", "d");

  if (trip == "dFFd") { caso = 1; }
  if (trip == "dfFd") { caso = 2; }
  if (trip == "dFfF") { caso = 3; }
  if (trip == "FFFd") { caso = 4; }
  if (trip == "FfFd") { caso = 5; }
  if (trip == "FFFF") { caso = 6; }
  if (trip == "FFfF") { caso = 7; }
  if (trip == "FdFF") { caso = 8; }
  if (trip == "FdfF") { caso = 9; }
  if (trip == "FFdf") { caso = 10; }
  if (trip == "FFdd") { caso = 11; }
  if (trip == "FdFd") { caso = 12; }
  if (trip == "FddF") { caso = 13; }
  if (trip == "dFdF") { caso = 14; }
  if (trip == "ddFd") { caso = 15; }

  return caso;
}
