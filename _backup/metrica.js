import { depurarVerso, invertirPalabra } from './utils.js';
import { extraeVocales, hiato, sinalefa, triSinalefa } from './vocales.js';
import { separaPalabra, cuatroSilaba, triptongoSilaba, hiatoSilaba } from './silabeo.js';

// Determina tipo de sinalefa: 2 = dos palabras, 3 = tres palabras
let tipoSina = 2;

/**
 * Orquesta el análisis poético completo de un verso: detecta y marca todas
 * las sinalefas (de dos y tres palabras) e imprime el resultado con "~".
 * Entrada : string del verso completo (puede tener mayúsculas y signos)
 * Salida  : arreglo de palabras con sílabas separadas por "/" y "~" al final
 *           de cada palabra que forma sinalefa con la siguiente
 *           (ej: ["ca/sa~", "a/zul"])
 *
 * Flujo:
 *   1. Depura el verso (minúsculas, quita signos) con depurarVerso()
 *   2. Detecta sinalefas de dos palabras contiguas (tipoSina=2) en todo el verso
 *   3. Silabea el verso completo con leerVerso()
 *   4. Cuando hay ≥3 palabras, comprueba si la palabra central (corta: 1-2 letras)
 *      permite fusionar tres palabras en una sola sinalefa (tipoSina=3)
 *   5. Marca con "~" las palabras que participan en cada sinalefa
 *   6. Colapsa múltiples "~~" en un solo "~" por si se marcó dos veces
 */
export function segundo(filas) {
  let fila = filas; //codigo nuevo
  let wordsVerso = [""];
  let versoConS = [""];
  let sinalefaa = [""];
  let trisinalefaa = [""];
  let versoSalida = [""];
  let sinalefaaExterior = false;

  let largo;
  let verso = "";

  /* let s = ("#intext1").val();
     //obtiene el verso y elimina blancos al inició o/y al final.
     verso = s;
     verso = s.trim();*/
  let s = depurarVerso(fila);
  verso = s;
  let versoCopia = verso; //Se crea una copia del verso inicial

  //determina número de caracteres del verso incluyendo blancos
  largo = verso.length;

  // almacena cada palabra en un arreglo y determina el número de palabras
  wordsVerso = verso.split(" ");
  let numPalabras = wordsVerso.length;

  //Crea una copia del verso para indicar  las sinalefas entre palabras con ~
  versoConS = wordsVerso;

  //Determina todas las sinalefas de dos palabras, del verso, con ~
  tipoSina = 2;
  for (let i = 0; i < versoConS.length - 1; i++) {
    let palabras = versoConS[i] + " " + versoConS[i + 1];
    let misSilabas = obtenerSilabas(palabras);
    sinalefaa[i] = sinalefaDosPalabras(misSilabas[0], misSilabas[1]);
  }
  versoSalida = leerVerso(s);
  //Determina donde hay sinalefa de tres palabras
  if (numPalabras > 2) {
    for (let i = 1; i < numPalabras - 1; i++) {
      if (
        (versoConS[i].length == 1 || versoConS[i].length == 2) &&
        sinalefaa[i - 1] &&
        sinalefaa[i]
      ) {
        let cadenaS =
          versoConS[i - 1] + " " + versoConS[i] + " " + versoConS[i + 1];
        tipoSina = 3;
        let misSilabas = obtenerSilabas(cadenaS);
        if (misSilabas[0] != "0") {
          trisinalefaa = sinalefaTresPalabras(
            misSilabas[0],
            misSilabas[1],
            misSilabas[2]
          );
          let j = (i - 1) / 2;
          if (trisinalefaa) {
            versoSalida[i - 1] = versoSalida[i - 1].concat("~");
            versoSalida[i] = versoSalida[i].concat("~");
          } else {
            // salida de hay sinalefa tres palabras
            versoSalida[i] = versoSalida[i].concat("~");
          }
        } else {
          //salida imposible sinalefa de tres palabras

          versoSalida[i] = versoSalida[i].concat("~");
        }
      } else {
        //salida condiciones posible sinalefa tres palabras
        if (sinalefaa[i - 1]) {
          versoSalida[i - 1] = versoSalida[i - 1].concat("~");
        }
        if (sinalefaa[i] && i == numPalabras - 2) {
          versoSalida[i] = versoSalida[i].concat("~");
        }
      }
    } //salida del for
  } else {
    //salida numero de palabras mayor de dos
    if (numPalabras == 2) {
      if (sinalefaa[0] == true) {
        versoSalida[0] = versoSalida[0].concat("~");
      }
    }
  }

  for (let i = 0; i < versoSalida.length; i++) {
    versoSalida[i] = versoSalida[i].replace(/(~)+/, "~");
  }

  return versoSalida;
}

/**
 * Extrae las sílabas relevantes para analizar sinalefa entre 2 o 3 palabras.
 * Entrada : string con 2 o 3 palabras separadas por espacio;
 *           la variable global `tipoSina` indica cuántas palabras hay (2 o 3)
 * Salida  : arreglo de 2 o 3 strings con las vocales de contacto de cada palabra
 *           (para caso 2: última sílaba de palabra1 + primera de palabra2)
 *           (para caso 3: igual pero con la palabra del medio completa)
 *           Si la palabra del medio no es corta (1-2 letras), devuelve ["0"]
 *
 * Para caso tipoSina=2:
 *   - extrae la última sílaba de palabra1 (hacia adelante, invertida)
 *   - extrae la primera sílaba de palabra2 (invertida → desinvertida)
 * Para caso tipoSina=3 (solo si palabra2 tiene 1-2 letras y es "a", "o", "ha" o "he"):
 *   - igual pero incluye la sílaba de palabra2 entre las otras dos
 */
export function obtenerSilabas(palabras) {
  // extrae silabas casos dos y tres palabras. Para luego determinar sinalefa
  // let versoEntrada = ("#intext1").val();
  let versoEntrada = palabras;
  let versoSalida = [];
  versoSalida = leerVerso(versoEntrada);
  if (tipoSina == 2) {
    //caso dos palabras
    let palabra1 = versoSalida[0];
    let palabra2 = versoSalida[1];
    let silaba1 = extraerSilabas(palabra1);
    let palabra2inv = invertirPalabra(palabra2);
    let silaba2 = extraerSilabas(palabra2inv);
    silaba1 = invertirPalabra(silaba1);
    let misSilabas = new Array(2);
    misSilabas[0] = silaba1;
    misSilabas[1] = silaba2;
    return misSilabas;
  } else if (tipoSina == 3) {
    //caso tres palabras
    let palabra1 = versoSalida[0];
    let palabra2 = versoSalida[1];
    let largoPalabra2 = palabra2.length;
    let palabra3 = versoSalida[2];
    let silaba1 = extraerSilabas(palabra1);
    let silaba2 = extraerSilabas(palabra2);
    let palabra3inv = invertirPalabra(palabra3);
    let silaba3 = extraerSilabas(palabra3inv);
    silaba1 = invertirPalabra(silaba1);
    silaba2 = invertirPalabra(silaba2);
    let largosilaba2 = silaba2.length;
    let largosilaba3 = silaba3.length;
    let largosilaba1 = silaba1.length;
    if (largoPalabra2 == 2 && (silaba2 == "ha" || silaba2 == "he")) {
      let misSilabas = [];
      misSilabas[0] = silaba1;
      misSilabas[1] = silaba2;
      misSilabas[2] = silaba3;
      return misSilabas;
    } else if (largoPalabra2 == 1 && (silaba2 == "a" || silaba2 == "o")) {
      let misSilabas = [];
      misSilabas[0] = silaba1;
      misSilabas[1] = silaba2;
      misSilabas[2] = silaba3;
      return misSilabas;
    } else {
      let misSilabas = [];
      misSilabas[0] = "0";
      return misSilabas;
    }
  }
}

/**
 * Extrae las sílabas relevantes para analizar sinalefa entre 2 o 3 palabras.
 * Entrada : string con 2 o 3 palabras separadas por espacio;
 *           la variable global `tipoSina` indica cuántas palabras hay (2 o 3)
 * Salida  : arreglo de 2 o 3 strings con las vocales de contacto de cada palabra
 *           (para caso 2: última sílaba de palabra1 + primera de palabra2)
 *           (para caso 3: igual pero con la palabra del medio completa)
 *           Si la palabra del medio no es corta (1-2 letras), devuelve ["0"]
 *
 * Para caso tipoSina=2:
 *   - extrae la última sílaba de palabra1 (hacia adelante, invertida)
 *   - extrae la primera sílaba de palabra2 (invertida → desinvertida)
 * Para caso tipoSina=3 (solo si palabra2 tiene 1-2 letras y es "a", "o", "ha" o "he"):
 *   - igual pero incluye la sílaba de palabra2 entre las otras dos
 */
export function extraerSilabas(p) {
  let i = p.length - 1;
  let silaba = "";
  while (p[i] != "/" && i >= 0) {
    let caracter = p[i];
    silaba = silaba.concat(caracter);
    i--;
  }
  return silaba;
}

/**
 * Determina si tres palabras forman una trisinalefa (tres vocales en un solo golpe).
 * Entrada : silaba1 = última sílaba de palabra 1 (vocales al final)
 *           silaba2 = sílaba completa de palabra 2 (la palabra corta del medio)
 *           silaba3 = primera sílaba de palabra 3 (invertida, vocales al inicio)
 * Salida  : true si hay trisinalefa, false si no
 *
 * Concatena las vocales de los tres extremos y delega en triSinalefa().
 * Caso especial: si hay 4 vocales y la del medio es "a", cuenta como sinalefa directa
 * (p. ej. "la aurora": a+a+u → la vocal "a" de "la" se funde con "au" de "aurora").
 */
export function sinalefaTresPalabras(silaba1, silaba2, silaba3) {
  let silabaDos = silaba2;
  let silabaUno = silaba1;
  let silabatres = silaba3;
  let vocalesPalUno = extraeVocales(silabaUno);
  let vocalesPalDos = extraeVocales(silabaDos);
  let silabatresInv = invertirPalabra(silabatres);
  let vocalesPalTres = extraeVocales(silabatresInv, "inv");
  let vocalesCompleto = vocalesPalUno
    .concat(vocalesPalDos)
    .concat(vocalesPalTres);
  if (vocalesCompleto.length == 3) {
    let sinalefaa = triSinalefa(vocalesCompleto);
    return sinalefaa;
  }
  if (vocalesCompleto.length == 4 && vocalesPalDos == "a") {
    let sinalefaa = true;
    return sinalefaa;
  }
}

/**
 * Determina si dos palabras forman sinalefa en el límite entre ellas.
 * Entrada : silaba1 = última sílaba de la primera palabra (vocales al final)
 *           silaba2 = primera sílaba de la segunda palabra (invertida, vocales al inicio)
 * Salida  : true si hay sinalefa, false si no
 *
 * Casos según cuántas vocales hay en cada extremo:
 *   1+1 → dos vocales en contacto: delega en sinalefa()
 *   1+2 → la segunda palabra empieza con diptongo: hay sinalefa si NO es hiato
 *   2+1 → la primera termina con diptongo: hay sinalefa si NO es hiato
 *   2+2 → ambas terminan/empiezan con diptongo: sinalefa solo si ninguno es hiato
 *   cualquier otro caso (cadena vacía) → false
 */
export function sinalefaDosPalabras(silaba1, silaba2) {
  let silabaDos = silaba2;
  let silabaUno = silaba1;
  let sinalefaa = false;
  let sinalefaa1 = false;
  let sinalefaa2 = false;
  let silabaDosInv = invertirPalabra(silabaDos);
  let vocalesPalUno = extraeVocales(silabaUno);
  let vocalesPalDos = extraeVocales(silabaDosInv, "inv");
  //vocalesPalDos = invertirPalabra(vocalesPalDos);
  let largoVocalesUno = vocalesPalUno.length;
  let largoVocalesDos = vocalesPalDos.length;

  if (vocalesPalUno != "" && vocalesPalDos != "") {
    //caso dos palabras dos vocales
    if (largoVocalesUno == 1 && largoVocalesDos == 1) {
      let vocalesCompleto = vocalesPalUno.concat(vocalesPalDos);
      sinalefaa = sinalefa(vocalesCompleto);
      return sinalefaa;

      // sinalefa dos palabras tres vocales 1-2
    } else if (largoVocalesUno == 1 && largoVocalesDos == 2) {
      sinalefaa = !hiato(vocalesPalDos);
      return sinalefaa;

      // sinalefa dos palabras tres vocales 2-1
    } else if (largoVocalesUno == 2 && largoVocalesDos == 1) {
      sinalefaa = !hiato(vocalesPalUno);
      return sinalefaa;

      // sinalefa dos palabras cuatro vocales 2-2
    } else if (largoVocalesUno == 2 && largoVocalesDos == 2) {
      sinalefaa1 = !hiato(vocalesPalUno);
      sinalefaa2 = !hiato(vocalesPalUno);
      sinalefaa = sinalefaa1 && sinalefaa2;
      return sinalefaa;
    }
  } else {
    sinalefaa = false;
    return sinalefaa;
  }
}

/**
 * Silabea un verso completo palabra por palabra y devuelve las sílabas ortográficas.
 * Entrada : string con el verso (puede tener varias palabras separadas por espacio)
 * Salida  : arreglo donde cada elemento es una palabra con sus sílabas separadas por "/"
 *           (ej: ["ca/sa", "a/zul"])
 *
 * Pipeline por cada palabra:
 *   separaPalabra → cuatroSilaba → triptongoSilaba → hiatoSilaba
 * Luego une las sílabas con "/" y almacena la palabra resultante en el arreglo.
 * Esta función produce la vista ortográfica; para la poética (con sinalefas) se usa segundo().
 */
export function leerVerso(s) {
  let miArreglo = [" "];
  let miArregloh = [" "];
  let miArreglohh = [" "];
  let miArreglohhh = [" "];
  let miArreglohS = [""];
  let miArregloSil = [""];
  let miArreglohSil = [""];
  let wordsVerso = [""];
  let versoConS = [""];

  let largo;
  let var1 = "";
  let verso = "";

  //obtiene el verso y elimina blancos al inició o/y al final.
  verso = s;
  verso = s.trim();
  let versoCopia = verso; //Se crea una copia del verso inicial

  //determina número de caracteres del verso incluyendo blancos
  largo = verso.length;

  // almacena cada palabra en un arreglo y determina el número de palabras
  wordsVerso = verso.split(" ");
  let numPalabras = wordsVerso.length;

  //crea nuevo arreglo donde se guardara cada palabra del verso, pero dividida por /
  miArregloSil = Array(1).fill(""); //division ortografica
  miArreglohSil = Array(1).fill(""); // division con triptongos y diptongos

  //Crea una copia del verso para indicar  las sinalefas entre palabras con ~
  versoConS = wordsVerso;

  //lee palabra por palabra del verso
  for (let j = 0; j < numPalabras; j++) {
    //Aplicamos separacion de silabas inicial a cada palabra del verso
    miArreglo = separaPalabra(wordsVerso[j]); //Separa y almacena palabra

    //Aplica diptongos y triptongos a la palabras del verso
    miArreglohhh = cuatroSilaba(miArreglo);
    miArreglohh = triptongoSilaba(miArreglohhh);
    miArregloh = hiatoSilaba(miArreglohh);

    //Transforma arreglo de silabas a palabra, donde las silabas se separan por /
    let k = 0;
    for (k = 0; k < miArregloh.length; k++) {
      if (miArregloh[k] != undefined) {
        var1 = var1.concat(miArregloh[k] + "/");
      } else k = miArregloh.length;
    }

    //Guarda palabras en silabas divididas por / en nuevo arreglo
    let largoVar1 = var1.length;
    var1 = var1.substring(0, var1.length - 1);
    miArregloSil[j] = var1;
    var1 = "";
  }
  return miArregloSil;
}

/**
 * Clasifica una palabra según la posición del acento (tónico o convencional).
 * Entrada : string de palabra ya silabada con "/" (ej: "ca/sa", "á/gil", "mú/si/ca")
 * Salida  : 1 = aguda (acento en última sílaba)
 *           0 = llana (acento en penúltima sílaba)
 *          -1 = esdrújula (acento en antepenúltima o anterior)
 *
 * Algoritmo:
 *   1. Busca tilde explícita (á é í ó ú) — posición directa
 *   2. Si no hay tilde, aplica la regla ortográfica:
 *      - Termina en s, n o vocal → llana (0)
 *      - Cualquier otra consonante → aguda (1)
 *   3. Monosílabos siempre se tratan como agudos (1) para el conteo métrico
 *
 * El valor de retorno se usa en contarSilabasPoetico() para el ajuste final:
 *   aguda (+1), llana (0), esdrújula (−1).
 */
export function determinaAcentoPalabra(palabra) {
  const arregloVocalesAcento = ["á", "é", "í", "ó", "ú"];
  const silabas = palabra.split("/");
  const numeroSilabas = silabas.length;
  let indicadorAcento = 2;

  // Función para determinar si una sílaba contiene una vocal acentuada
  const contieneVocalAcentuada = (silaba) => {
    return arregloVocalesAcento.some((vocal) => silaba.includes(vocal));
  };

  // Si la palabra tiene más de una sílaba
  if (numeroSilabas > 1) {
    for (let i = 0; i < numeroSilabas; i++) {
      const silaba = silabas[i];
      if (contieneVocalAcentuada(silaba)) {
        const numeroDeSilaba = i;
        if (numeroDeSilaba === numeroSilabas - 1) {
          indicadorAcento = 1; // última sílaba
        } else if (numeroDeSilaba === numeroSilabas - 2) {
          indicadorAcento = 0; // penúltima sílaba
        } else {
          indicadorAcento = -1; // antepenúltima sílaba o anterior
        }
        break;
      }
    }

    // Si no se encontró una vocal acentuada
    if (indicadorAcento === 2) {
      const ultimaSilaba = silabas[numeroSilabas - 1];
      const ultimaLetra = ultimaSilaba.slice(-1);
      if ("snaioue".includes(ultimaLetra)) {
        indicadorAcento = 0; // palabra llana
      } else {
        indicadorAcento = 1; // palabra aguda
      }
    }
  } else {
    // Si la palabra es monosílaba
    indicadorAcento = 1; // palabra aguda monosílaba
  }

  return indicadorAcento;
}

/**
 * Cuenta las sílabas ortográficas totales de un verso.
 * Entrada : arreglo de palabras silabadas (salida de leerVerso)
 *           caracter = separador de sílabas (siempre "/")
 * Salida  : número entero con el total de sílabas del verso
 *
 * Por cada palabra: cuenta las apariciones de "/" y le suma 1
 * (n separadores = n+1 sílabas). Si la palabra no tiene separador, vale 1.
 */
export function contarSilabasOrtografico(arreglo, caracter) {
  let miArreglo = arreglo;
  let miCaracter = caracter;
  let conta = 0;
  let conta2 = 0;
  for (let i = 0; i < arreglo.length; i++) {
    let largoPali = miArreglo[i].length;
    conta = 0;
    for (let j = 0; j < largoPali; j++) {
      if (miArreglo[i][j] == miCaracter) {
        conta++;
      }
    }
    if (conta == 0) {
      conta = 1;
      conta2 = conta2 + conta;
    } else {
      conta2 = conta2 + conta + 1;
    }
  }
  return conta2;
}

/**
 * Calcula el ajuste poético sobre el conteo ortográfico.
 * Entrada : arreglo de palabras marcadas por segundo() ("~" al final = sinalefa)
 * Salida  : número entero que se SUMA al conteo ortográfico
 *           (−1 por cada sinalefa + ajuste por acento de la última palabra)
 */
export function contarSilabasPoetico(v) {
  let verso = v;
  let conta = 0;
  for (let i = 0; i < verso.length; i++) {
    if (verso[i][verso[i].length - 1] == "~") {
      conta++;
    }
  }
  determinaAcentoPalabra(verso[verso.length - 1]);
  let total = -conta + determinaAcentoPalabra(verso[verso.length - 1]);

  return total;
}

