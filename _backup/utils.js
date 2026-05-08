/**
 * Limpia un verso para que solo contenga caracteres válidos del español.
 * Entrada : string con el verso tal como lo escribió el usuario
 * Salida  : string en minúsculas, sin puntuación ni caracteres especiales,
 *           con espacios simples entre palabras
 *
 * Se eliminan signos de puntuación, números y cualquier carácter fuera
 * del alfabeto español (incluyendo diéresis ä ë ï ö ü para préstamos).
 * La "y" se conserva porque actúa como vocal en posición final (ley, rey).
 */
export function depurarVerso(fila) {
  const caracteresValidos = new Set([
    "a", "e", "i", "o", "u",
    "á", "é", "í", "ó", "ú",
    "h",
    "ä", "ë", "ï", "ö", "ü",
    "b", "c", "d", "f", "g", "j", "k", "l", "m",
    "n", "ñ", "p", "q", "r", "s", "t", "v", "w",
    "x", "y", "z",
    " ",
  ]);

  let verso = fila.trim().toLowerCase();
  let versoDepurado = "";

  for (const char of verso) {
    if (caracteresValidos.has(char)) {
      versoDepurado += char;
    }
  }

  // Colapsa espacios múltiples en uno solo (pueden quedar tras eliminar caracteres)
  versoDepurado = versoDepurado.replace(/\s+/g, " ");

  return versoDepurado;
}

/**
 * Invierte una cadena carácter a carácter.
 * Entrada : string (sílaba o palabra)
 * Salida  : string invertido
 *
 * Se usa para analizar el final de una palabra (última sílaba, última vocal)
 * leyendo desde el inicio del string invertido en lugar del final del original.
 * Ejemplo: "amor" → "roma"
 */
export function invertirPalabra(p) {
  let palabra = p;
  let revPalabra = "";
  let largo = palabra.length;

  for (let k = 0; k < largo; k++) {
    let caracter = palabra[largo - 1 - k];
    revPalabra = revPalabra.concat(caracter);
  }
  return revPalabra;
}

/**
 * Clasifica un carácter en vocal, consonante o h.
 * Entrada : un carácter en minúscula
 * Salida  : "v" si es vocal, "h" si es h, "c" si es consonante o y
 *
 * La "y" se clasifica como consonante porque en posición intervocálica
 * actúa como consonante (yema, yo). Cuando actúa como vocal (ley, rey)
 * se maneja como caso especial en extraeVocales.
 * La "h" recibe su propio código porque es muda y necesita tratamiento
 * especial en el análisis de diptongos e hiatos.
 */
export function vCH(s) {
  let caracterIn = s;
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];

  let vch = false;
  let caracterOut = " ";
  let largoVocales = vocales.length;

  for (let k = 0; k < largoVocales; k++) {
    if (vocales[k] == caracterIn) {
      vch = true;
      caracterOut = "v";
      k = vocales.length;
    } else {
      vch = false;
    }
  }
  if (vch == false) {
    if ("h" == caracterIn) {
      caracterOut = "h";
    } else if ("y" == caracterIn) {
      caracterOut = "c";
    } else {
      caracterOut = "c";
    }
  }

  return caracterOut;
}

/**
 * Compacta un arreglo eliminando posiciones vacías (" " o "").
 * Entrada : arreglo disperso (con huecos " " entre sílabas reales)
 * Salida  : arreglo compacto con solo las sílabas válidas
 *
 * triptongoSilaba, hiatoSilaba y cuatroSilaba producen arreglos ×2/×3/×4
 * con huecos como separadores. nuevoArreglo los limpia antes de continuar.
 */
export function nuevoArreglo(a) {
  let j = 0;
  let i = 0;
  let numNuevo = 0;

  let out = [];
  out = a;

  // Cuenta cuántas posiciones tienen contenido real
  for (i = 0; i < out.length; i++) {
    if (!(out[i] == " " || out[i] == "")) {
      numNuevo++;
    }
  }

  // Transfiere solo las sílabas válidas al nuevo arreglo
  let nuevo = [numNuevo];
  i = 0;
  for (j = 0; j < out.length; j++) {
    if (!(out[j] == " " || out[j] == "")) {
      nuevo[i] = out[j];
      i++;
    }
  }
  return nuevo;
}
