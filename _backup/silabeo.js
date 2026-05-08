import { nuevoArreglo, vCH, invertirPalabra } from './utils.js';
import { tresVocales, hiato, cuatroVocales } from './vocales.js';

/**
 * Separa una palabra en sílabas ortográficas usando análisis de secuencias.
 * Entrada : string con una sola palabra en minúsculas, ya depurada
 * Salida  : arreglo de strings donde cada elemento es una sílaba
 *
 * ── Algoritmo ──────────────────────────────────────────────────────────────
 * El algoritmo recorre la palabra carácter a carácter construyendo una
 * "secuencia" de códigos: "v" (vocal) y "c" (consonante).
 * En cada paso busca los patrones de corte de sílaba, de mayor a menor
 * prioridad:
 *
 *   cad1 = "vccccv" → 4 consonantes entre vocales → corte después de vc
 *   cad2 = "vcccv"  → 3 consonantes entre vocales → corte después de vc o vcc
 *   cad3 = "vccv"   → 2 consonantes entre vocales → corte después de v
 *   cad4 = "vcv"    → 1 consonante entre vocales  → corte después de v
 *
 * Cuando encuentra un patrón, guarda los caracteres de esa sílaba en pdt[m]
 * y avanza ind2 (inicio de la próxima sílaba).
 *
 * ── Consonantes dobles (grupos inseparables) ────────────────────────────────
 * Ciertos pares de consonantes no se separan porque forman un solo sonido:
 *   - Grupos con r: br, cr, dr, fr, gr, pr, tr, kr, rr
 *   - Grupos con l: bl, cl, dl, fl, gl, pl, tl, kl, ll
 *   - ch: la "h" después de "c" forma dígrafo
 *
 * Cuando se detecta uno de estos grupos (ante_r, ante_l, ante_h),
 * el punto de corte se ajusta para mantenerlos juntos en la misma sílaba.
 * La variable indDC guarda la posición del grupo detectado para comparar
 * con ind y decidir si aplica el ajuste.
 *
 * ── Tratamiento especial de la "h" ─────────────────────────────────────────
 * - "h" al inicio de palabra → se trata como "cc" (doble c) en la secuencia
 * - "h" después de "c" (ch) → ante_h=true, agrega "c" a la secuencia
 * - "h" después de vocal → agrega "v" a la secuencia (h es transparente;
 *   las vocales que la rodean se evalúan como si estuvieran en contacto)
 * - "h" después de otra consonante → agrega "c"
 *
 * ── Resultado ───────────────────────────────────────────────────────────────
 * pdt[] es un arreglo de 20 posiciones (máximo de sílabas esperado).
 * Al terminar el recorrido, los caracteres restantes (última sílaba)
 * se agregan a pdt[m]. nuevoArreglo() limpia los huecos vacíos al final.
 *
 * Nota: esta función hace el silabeo base. Los diptongos, triptongos
 * e hiatos se corrigen en los pasos siguientes: cuatroSilaba →
 * triptongoSilaba → hiatoSilaba.
 */
export function separaPalabra(mipalabra) {
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];

  // "ch" es dígrafo inseparable → "c" es el único especial que puede preceder a "h"
  let especiales_h = ["c"];

  // Consonantes que forman grupo inseparable cuando preceden a "r" (br, cr, dr...)
  let especiales_r = ["b", "c", "d", "f", "g", "p", "t", "k", "r"];

  // Consonantes que forman grupo inseparable cuando preceden a "l" (bl, cl, fl...)
  let especiales_l = ["b", "c", "d", "f", "g", "p", "t", "k", "l"];

  // Arreglo de salida con espacio para hasta 20 sílabas
  let pdt = ["","","","","","","","","","","","","","","","","","","",""];

  // Patrones de secuencia que indican dónde cortar la sílaba
  let secuencia = "";
  let cad1 = "vccccv"; // vocal + 4 consonantes + vocal
  let cad2 = "vcccv";  // vocal + 3 consonantes + vocal
  let cad3 = "vccv";   // vocal + 2 consonantes + vocal
  let cad4 = "vcv";    // vocal + 1 consonante  + vocal
  let temp = "";

  let vccccv = false;
  let vcccv = false;
  let vccv = false;
  let vcv = false;
  let esr = false;
  let esl = false;
  let esh = false;
  let esvocal = false;
  let ante_r = false;
  let ante_l = false;
  let ante_h = false;
  let ante_v = false;

  let ind = -1;  // posición en secuencia donde se encontró el patrón de corte
  let ind2 = 0;  // inicio de la sílaba actual en la secuencia (avanza con cada corte)
  let indDC = 30; // posición del último grupo consonántico doble detectado (br, cl, ch...)
  let i = 0;
  let i_h = 0;
  let ii = 0;
  let j = 0;
  let m = 0;  // índice de la sílaba actual en pdt[]
  let n = 0;
  let k = 0;
  let nvocales = vocales.length;
  let largo_r = especiales_r.length;
  let largo_l = especiales_l.length;
  let largo_h = especiales_h.length;

  let palabra = mipalabra;
  let cadena = palabra;
  let largoCadena = cadena.length;
  let vt = new Array(largoCadena);

  // Descompone la palabra en un arreglo de caracteres individuales
  // para poder acceder a vt[i-1] (carácter anterior) eficientemente
  for (i = 0; i < cadena.length; i++) {
    vt[i] = cadena.slice(i, i + 1);
  }

  i = 0;
  while (i < cadena.length) {
    temp = cadena.slice(i, i + 1); // carácter actual

    // ── Paso 1: clasificar el carácter actual y construir la secuencia ──────
    // Determina si es vocal → "v", consonante → "c", con casos especiales para h
    for (k = 0; k < nvocales; k++) {
      if (vocales[k] == temp) {
        esvocal = true;
        secuencia = secuencia.concat("v");
        k = nvocales; // salida anticipada del for
      } else {
        esvocal = false;
      }
    }

    if (esvocal == false) {
      // La h NO agrega "c" aquí; su código se decide más abajo según contexto
      if (!(temp == "h")) {
        secuencia = secuencia.concat("c");
      }

      esr = (temp == "r");
      esl = (temp == "l");
      esh = (temp == "h");

      // ── Detección de grupos consonánticos inseparables ─────────────────
      // Si la consonante actual es r/l/h y la anterior forma dígrafo con ella,
      // se marca ante_r/ante_l/ante_h y se guarda la posición (indDC)
      // para ajustar el corte y no separar el grupo (br, cl, ch...)

      if (esr && i != 0) {
        for (j = 0; j < largo_r; j++) {
          if (vt[i - 1] == especiales_r[j]) {
            ante_r = true;
            indDC = i; // posición de la "r" en el dígrafo
            j = largo_r;
          } else {
            ante_r = false;
          }
        }
      }

      if (esl && i != 0) {
        for (j = 0; j < largo_l; j++) {
          if (vt[i - 1] == especiales_l[j]) {
            ante_l = true;
            indDC = i; // posición de la "l" en el dígrafo
            j = largo_l;
          } else {
            ante_l = false;
          }
        }
      }

      // ── Tratamiento especial de la "h" ────────────────────────────────
      if (esh && i == 0) {
        // "h" al inicio de palabra: actúa como consonante doble (he-ro-e → "cc")
        secuencia = secuencia.concat("c");
      }

      if (esh && i != 0) {
        // "h" en posición interior: depende del carácter anterior
        for (j = 0; j < largo_h; j++) {
          if (vt[i - 1] == especiales_h[j]) {
            // "ch": dígrafo inseparable → agrega "c" y marca ante_h
            ante_h = true;
            secuencia = secuencia.concat("c");
            j = largo_h;
          } else {
            ante_h = false;
          }
        }
        for (j = 0; j < nvocales; j++) {
          if (vt[i - 1] == vocales[j]) {
            // "h" entre vocales (ahora, prohibir): la h es transparente,
            // se agrega "v" para que las vocales que la rodean queden juntas
            // y sean evaluadas por hiatoSilaba en el paso siguiente
            ante_v = true;
            secuencia = secuencia.concat("v");
            j = nvocales;
          } else {
            ante_v = false;
          }
        }
        if (!ante_v && !ante_h) {
          // "h" entre consonantes (inusual): se trata como consonante
          secuencia = secuencia.concat("c");
        }
      }
    }

    // ── Paso 2: buscar patrones de corte en la secuencia acumulada ──────────
    // Se evalúan de mayor a menor cantidad de consonantes (prioridad descendente)
    // Solo se busca desde ind2 en adelante (lo ya cortado no se reanaliza)

    if (secuencia.substring(ind2).includes(cad1)) {
      vccccv = true;
      ind = secuencia.indexOf(cad1, ind2);
      if (ante_v) { ante_v = false; }
    } else { vccccv = false; }

    if (secuencia.substring(ind2).includes(cad2)) {
      vcccv = true;
      ind = secuencia.indexOf(cad2, ind2);
      if (ante_v) { ante_v = false; }
    } else { vcccv = false; }

    if (secuencia.substring(ind2).includes(cad3)) {
      vccv = true;
      ind = secuencia.indexOf(cad3, ind2);
      if (ante_v) { ante_v = false; }
    } else { vccv = false; }

    if (secuencia.substring(ind2).includes(cad4)) {
      vcv = true;
      ind = secuencia.indexOf(cad4, ind2);
      if (ante_v) { ante_v = false; }
    } else { vcv = false; }

    // ── Paso 3: ejecutar el corte de sílaba según el patrón encontrado ──────
    // En cada caso, si hay dígrafo (ante_r/l/h) y el corte cae ANTES del dígrafo
    // (ind < indDC), se incluye la consonante extra en la sílaba para no separarlo.
    // El valor de corte (ind+1, ind+2, ind+3) determina cuántos caracteres
    // van a la sílaba actual antes de avanzar al siguiente segmento.

    // caso 1: vccccv → corte después de vc (3 chars con dígrafo, 3 sin él)
    if (vccccv) {
      if ((ante_r || ante_l || ante_h) && ind < indDC) {
        for (n = ind2; n < ind + 3; n++) {
          pdt[m] = pdt[m] + vt[n];
          ante_r = false; ante_l = false; ante_h = false;
        }
        ind2 = ind + 3;
      } else {
        for (n = ind2; n < ind + 3; n++) {
          pdt[m] = pdt[m] + vt[n];
        }
        ind2 = ind + 3;
      }
      m++;
    }

    // caso 2: vcccv → corte después de v o vc según dígrafo
    if (vcccv) {
      if ((ante_r || ante_l || ante_h) && ind < indDC) {
        for (n = ind2; n < ind + 2; n++) {
          pdt[m] = pdt[m] + vt[n];
          ante_r = false; ante_l = false; ante_h = false;
        }
        ind2 = ind + 2;
      } else {
        for (n = ind2; n < ind + 3; n++) {
          pdt[m] = pdt[m] + vt[n];
        }
        ind2 = ind + 3;
      }
      m++;
    }

    // caso 3: vccv → corte después de v (dígrafo → solo v; sin dígrafo → vc)
    if (vccv) {
      if ((ante_r || ante_l || ante_h) && ind < indDC) {
        for (n = ind2; n < ind + 1; n++) {
          pdt[m] = pdt[m] + vt[n];
          ante_r = false; ante_l = false; ante_h = false;
        }
        ind2 = ind + 1;
      } else {
        for (n = ind2; n < ind + 2; n++) {
          pdt[m] = pdt[m] + vt[n];
        }
        ind2 = ind + 2;
      }
      m++;
    }

    // caso 4: vcv → corte siempre después de v (la consonante va con la sílaba siguiente)
    if (vcv) {
      for (n = ind2; n < ind + 1; n++) {
        pdt[m] = pdt[m] + vt[n];
      }
      ind2 = ind + 1;
      m++;
    }

    i++;
  }

  // Agrega los caracteres restantes como última sílaba
  for (n = ind2; n < cadena.length; n++) {
    pdt[m] = pdt[m] + vt[n];
  }

  let nuevo = nuevoArreglo(pdt);

  return nuevo;
}

/**
 * Detecta y divide triptongos dentro de las sílabas producidas por separaPalabra.
 * Entrada : arreglo de sílabas (salida de cuatroSilaba)
 * Salida  : arreglo de sílabas con triptongos correctamente divididos
 *
 * separaPalabra puede dejar tres vocales juntas dentro de una sílaba
 * (secuencia "vvv") que no son triptongo sino dos sílabas. Esta función
 * analiza esos casos y los divide según la función tresVocales().
 *
 * Patrones buscados dentro de cada sílaba:
 *   "vvv"  → tres vocales seguidas
 *   "vhvv" → tres vocales con h muda intercalada (transparente)
 *
 * El arreglo de salida (oout) se dimensiona al triple del de entrada
 * para tener espacio en caso de que cada sílaba se divida en hasta 3.
 * Los huecos se eliminan con nuevoArreglo() al final.
 *
 * El flag "g" maneja el caso especial de palabras como "guía" donde
 * la "u" no suena y el triptongo es garantizado (caso = 3).
 */
export function triptongoSilaba(a) {
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];
  let consonantes = [
    "h",
    "b",
    "c",
    "d",
    "f",
    "g",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let especiales = ["h"];

  let silaba = "";
  let secuencia = "";
  let cad1 = "vvv";
  let cad2 = "vhvv";
  let temp = "";
  let cadena = "";

  let ind = -1;
  let ind2 = 0;
  //int i = 0;
  //Número consonante
  let j = 0;
  //silaba en estudio
  let n = 0;
  //Número de vocal
  let k = 0;
  let numNuevo = 0;
  let numSilabas = 0;
  let largoSilaba = 0;
  let nconsonantes = consonantes.length;
  let nvocales = vocales.length;
  let caso;

  let esvocal = false;

  let vvv = false;
  let vhvv = false;
  let g = false;

  let iin = a;
  let largoIn = iin.length;
  numSilabas = largoIn;

  //Hace largo de arreglo de salida igual al doble del número de sílabas
  let largoOut = numSilabas * 3;
  let oout = new Array(largoOut);

  //corrimiento de silabas
  for (let i = numSilabas; i > 0; i--) {
    oout[(i - 1) * 3] = iin[i - 1];
  }
  //espacios entre silabas
  for (let i = 1; i < numSilabas + 1; i++) {
    oout[3 * i - 2] = " ";
    oout[3 * i - 1] = " ";
  }

  //Avance silaba por silaba de la palabra
  for (n = 0; n < iin.length; n++) {
    largoSilaba = iin[n].length;
    secuencia = "";

    //Avance caracter por caracter de la silaba
    let i = 0;
    while (i < largoSilaba) {
      cadena = iin[n];

      if (!(cadena == "guía" || cadena == "guía" || cadena == "guía")) {
        //Determina si es vocal o consonante el caracter en turno
        temp = cadena.substring(i, i + 1);
        k = 0;
        for (k = 0; k < nvocales; k++) {
          if (vocales[k] == temp) {
            esvocal = true;
            secuencia = secuencia.concat("v");
            k = nvocales;
          } else {
            esvocal = false;
          }
        }
        if (esvocal == false) {
          j = 0;
          for (j = 0; j < nconsonantes; j++) {
            if (consonantes[j] == temp) {
              if ("h" == temp) {
                secuencia = secuencia.concat("h");
              } else {
                secuencia = secuencia.concat("c");
              }
              j = nconsonantes;
            }
          }
        }

        if (secuencia.substring(ind2).includes(cad1)) {
          vvv = true;
          ind = secuencia.indexOf(cad1, ind2);
        } else {
          vvv = false;
        }

        if (secuencia.substring(ind2).includes(cad2)) {
          vhvv = true;
          ind = secuencia.indexOf(cad2, ind2);
        } else {
          vhvv = false;
        }
      } else {
        vvv = true;
        g = true;
      }
      //caso 1: análiza condicion vvv
      if (vvv) {
        if (!(g == true)) {
          caso = tresVocales(iin[n].substring(ind, ind + 3));
        } else {
          caso = 3;
          ind = 2;
        }

        switch (caso) {
          case 1:
          case 4:
            oout[3 * n] = iin[n].substring(ind2, ind + 1);
            oout[3 * n + 1] = iin[n].substring(ind + 1, ind + 2);
            oout[3 * n + 2] = iin[n].substring(ind + 2);
            break;

          case 2:
            oout[3 * n] = iin[n].substring(ind2, ind + 1);
            oout[3 * n + 1] = iin[n].substring(ind + 1);
            break;

          case 3:
            oout[3 * n] = iin[n].substring(ind2, ind + 2);
            oout[3 * n + 1] = iin[n].substring(ind + 2);
            break;
        }
      }

      i++;
    }
  }

  let nuevo = nuevoArreglo(oout);
  return nuevo;
}

/**
 * Detecta hiatos dentro de las sílabas y las divide cuando corresponde.
 * Entrada : arreglo de sílabas (salida de triptongoSilaba)
 * Salida  : arreglo de sílabas con hiatos correctamente separados
 *
 * Después de triptongoSilaba pueden quedar sílabas con dos vocales juntas
 * que forman hiato (no diptongo). Esta función las detecta y separa.
 *
 * Patrones buscados dentro de cada sílaba:
 *   "vv"  → dos vocales contiguas → se llama hiato() para decidir
 *   "vhv" → dos vocales con h muda → ídem (h transparente)
 *
 * El arreglo de salida (oout) se dimensiona al doble del de entrada.
 * Al final se reordenan los huecos con un bubble-sort parcial antes
 * de limpiar con nuevoArreglo().
 *
 * Nota: si hiato() devuelve false (son diptongo), no se hace ningún corte
 * y la sílaba permanece intacta. Esto preserva diptongos como "ai", "ue".
 */
export function hiatoSilaba(a) {
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];
  //String pdt[] = {"", "", "", "", "", "", "", "", "", ""};
  let consonantes = [
    "h",
    "b",
    "c",
    "d",
    "f",
    "g",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
    "r",
    "l",
  ];
  let especiales = ["h"];

  let silaba = "";
  let secuencia = "";
  let cad1 = "vv";
  let cad2 = "vhv";
  let cad3 = "vvv";
  let temp = "";
  let cadena = "";

  let ind = -1;
  let ind2 = 0;
  //int i = 0;
  //Número consonante
  let j = 0;
  //silaba en estudio
  let n = 0;
  //Número de vocal
  let k = 0;

  let numNuevo = 0;
  let numSilabas = 0;
  let largoSilaba = 0;
  let nconsonantes = consonantes.length;
  let nvocales = vocales.length;

  let esvocal = false;

  let vv = false;
  let vhv = false;
  let vvv = false;
  let tri = false;

  let iin = a;
  numSilabas = iin.length;

  //Hace largo de arreglo de salida igual al doble del número de sílabas
  let largoOut = numSilabas * 2;
  let oout = new Array(largoOut);

  //corrimiento de sílabas:introuce las sílabas al nuevo arreglo dejando dos espacios(null) entre sílabas
  for (let i = numSilabas; i > 0; i--) {
    oout[(i - 1) * 2] = iin[i - 1];
  }
  //Introduce espacios en blaco entre silabas
  for (let i = 1; i < numSilabas + 1; i++) {
    oout[2 * i - 1] = " ";
  }

  //Avance silaba por silaba de la palabra
  for (n = 0; n < iin.length; n++) {
    largoSilaba = iin[n].length;
    secuencia = "";
    //Avance caracter por caracter de la silaba
    let i = 0;
    while (i < largoSilaba) {
      cadena = iin[n];

      //Determina si es vocal o consonante el caracter en turno
      temp = cadena.substring(i, i + 1);
      k = 0;
      for (k = 0; k < nvocales; k++) {
        if (vocales[k] == temp) {
          esvocal = true;
          secuencia = secuencia.concat("v");
          k = nvocales;
        } else {
          esvocal = false;
        }
      }
      if (esvocal == false) {
        j = 0;
        for (j = 0; j < nconsonantes; j++) {
          if (consonantes[j] == temp) {
            if ("h" == temp) {
              secuencia = secuencia.concat("h");
              j = nconsonantes;
            } else {
              secuencia = secuencia.concat("c");
            }
            j = nconsonantes;
          }
        }
      }

      if (secuencia.substring(ind2).includes(cad1)) {
        vv = true;
        ind = secuencia.indexOf(cad1, ind2);
      } else {
        vv = false;
      }

      if (secuencia.substring(ind2).includes(cad2)) {
        vhv = true;
        ind = secuencia.indexOf(cad2, ind2);
      } else {
        vhv = false;
      }

      //caso 1: análiza condicion vv
      if (vv) {
        if (hiato(iin[n].substring(ind, ind + 2))) {
          oout[2 * n] = iin[n].substring(ind2, ind + 1);
          oout[n * 2 + 1] = iin[n].substring(ind + 1);
        }
        i = iin[n].length;
      }
      //caso 2: análiza vhv
      if (vhv) {
        if (hiato(iin[n].substring(ind, ind + 3))) {
          oout[2 * n] = iin[n].substring(ind2, ind + 1);
          oout[2 * n + 1] = iin[n].substring(ind + 1);
        }
        i = iin[n].length;
      }

      i++;
    } //termina de analizar sílaba
  } //termina de analizar palabra
  j = 0;
  for (let i = 0; i < oout.length - 1; i++) {
    if (oout[i] == " " && !(oout[i + 1] == " ")) {
      oout[i] = oout[i + 1];
      oout[i + 1] = " ";
    }
    if (oout[i] == " " && oout[i + 1] == " " && i < oout.length - 2) {
      oout[i] = oout[i + 2];
      oout[i + 2] = " ";
    }
  }

  let nuevo = nuevoArreglo(oout);
  return nuevo;
}

/**
 * Ajusta el silabeo cuando una sílaba contiene 4 vocales seguidas.
 * Entrada : arreglo de sílabas producido por separaPalabra (o por triptongoSilaba)
 * Salida  : nuevo arreglo de sílabas con la secuencia cuádruple dividida;
 *           si no hay secuencia vvvv, devuelve el arreglo original sin cambios.
 *
 * Funciona igual que triptongoSilaba pero amplía el arreglo de salida a ×4
 * para permitir hasta 3 fragmentos por sílaba original.
 * Delega en cuatroVocales() la clasificación de los 15 casos posibles
 * y distribuye los subcortes según el caso devuelto.
 * El patrón vhvvv (vocal + h muda + tres vocales) está reservado para
 * extensión futura; por ahora el bloque vhvvv no hace nada.
 */
export function cuatroSilaba(a) {
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];
  let consonantes = [
    "h",
    "b",
    "c",
    "d",
    "f",
    "g",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
    "r",
    "l",
  ];
  let especiales = ["h"];
  let silaba = "";
  let secuencia = "";
  let cad1 = "vvvv";
  let cad2 = "vhvvv";
  let temp = "";
  let cadena = "";
  let ind = -1;
  let ind2 = 0;
  // int i = 0;
  // Número consonante
  let j = 0;
  // silaba en estudio
  let n = 0;
  // Número de vocal
  let k = 0;
  let numNuevo = 0;
  let numSilabas = 0;
  let largoSilaba = 0;
  let nconsonantes = consonantes.length;
  let nvocales = vocales.length;
  let esvocal = false;
  let vvv = false;
  let vvvv = false;
  let vhvvv = false;
  let iin = a;
  let largoIn = iin.length;
  numSilabas = largoIn;

  // Hace largo de arreglo de salida igual al doble del número de sílabas
  let largoOut = numSilabas * 4;
  let oout = new Array(largoOut);

  // corrimiento de silabas
  for (let i = numSilabas; i > 0; i--) {
    oout[(i - 1) * 4] = iin[i - 1];
  }
  // espacios entre silabas
  for (let i = 1; i < numSilabas + 1; i++) {
    oout[4 * i - 3] = " ";
    oout[4 * i - 2] = " ";
    oout[4 * i - 1] = " ";
  }

  // Avance silaba por silaba de la palabra
  for (n = 0; n < iin.length; n++) {
    largoSilaba = iin[n].length;
    secuencia = "";
    // Avance caracter por caracter de la silaba
    let i = 0;
    while (i < largoSilaba) {
      cadena = iin[n];

      // Determina si es vocal o consonante el caracter en turno
      temp = cadena.substring(i, i + 1);
      k = 0;
      for (k = 0; k < nvocales; k++) {
        if (vocales[k] == temp) {
          esvocal = true;
          secuencia = secuencia.concat("v");
          k = nvocales;
        } else {
          esvocal = false;
        }
      }
      if (esvocal == false) {
        j = 0;
        for (j = 0; j < nconsonantes; j++) {
          if (consonantes[j] == temp) {
            if ("h" == temp) {
              secuencia = secuencia.concat("h");
            } else {
              secuencia = secuencia.concat("c");
            }
            j = nconsonantes;
          }
        }
      }

      if (secuencia.substring(ind2).includes(cad1)) {
        vvvv = true;
        ind = secuencia.indexOf(cad1, ind2);
      } else {
        vvvv = false;
      }

      if (secuencia.substring(ind2).includes(cad2)) {
        vhvvv = true;
        ind = secuencia.indexOf(cad2, ind2);
      } else {
        vhvvv = false;
      }

      // caso 1: análiza condicion vvvv
      if (vvvv) {
        let secvocales = iin[n].substring(ind, ind + 4);
        let caso = cuatroVocales(secvocales);

        switch (caso) {
          case 2:
          case 4:
          case 5:
          case 10:
          case 11:
            oout[4 * n] = iin[n].substring(ind2, ind + 1);
            oout[4 * n + 1] = iin[n].substring(ind + 1, ind + 2);
            oout[4 * n + 2] = iin[n].substring(ind + 2);
            break;

          case 6:
          case 7:
            oout[4 * n] = iin[n].substring(ind2, ind + 1);
            oout[4 * n + 1] = iin[n].substring(ind + 1, ind + 2);
            oout[4 * n + 2] = iin[n].substring(ind + 2, ind + 3);
            oout[4 * n + 2] = iin[n].substring(ind + 3);
            break;

          case 12:
          case 15:
            oout[4 * n] = iin[n].substring(ind2, ind + 1);
            oout[4 * n + 1] = iin[n].substring(ind + 1);
            break;

          case 1:
          case 13:
          case 14:
            oout[4 * n] = iin[n].substring(ind2, ind + 2);
            oout[4 * n + 1] = iin[n].substring(ind + 2);
            break;

          case 3:
          case 9:
            oout[4 * n] = iin[n].substring(ind2, ind + 2);
            oout[4 * n + 1] = iin[n].substring(ind + 2, ind + 3);
            oout[4 * n + 2] = iin[n].substring(ind + 3);
            break;

          case 8:
            oout[4 * n] = iin[n].substring(ind2, ind + 1);
            oout[4 * n + 1] = iin[n].substring(ind + 1, ind + 3);
            oout[4 * n + 2] = iin[n].substring(ind + 3);
            break;
        }
      } else if (vhvvv) {
      }
      i++;
    } //salida de fin de silaba
  } //salida de fin de palabra
  if (vvvv) {
    return nuevoArreglo(oout);
  }

  return iin;
}

