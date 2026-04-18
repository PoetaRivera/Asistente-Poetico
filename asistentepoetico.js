import { depurarVerso, invertirPalabra, vCH, nuevoArreglo } from "./utils.js";
import { extraeVocales, hiato, sinalefa, triSinalefa, tresVocales, cuatroVocales } from "./vocales.js";
import { separaPalabra, cuatroSilaba, triptongoSilaba, hiatoSilaba } from "./silabeo.js";

document.addEventListener("DOMContentLoaded", function () {

  // Obtén referencias a los elementos del DOM
  const boton1 = document.getElementById("boton1");
  const boton2 = document.getElementById("boton2");
  const boton3 = document.getElementById("boton3");
  const intext1 = document.getElementById("intext1");
  const outtext1 = document.getElementById("outtext1");
  const outtext2 = document.getElementById("outtext2");
  const outtext3 = document.getElementById("outtext3");
  const outtext4 = document.getElementById("outtext4");

  // Asigna los manejadores de eventos
  //------------------------------------------------------------------------------------------------
  //deshabilita el boton 'ampliar'
  boton3.disabled = true;
  //ejecuta el programa principal
  boton1.addEventListener("click", principal);
  //limpia las cuatro textArea
  boton2.addEventListener("click", limpiar);
  //amplia ventanas
  boton3.addEventListener("click", ampliarVentanas);
  //--------------------------------------------------------------------------------------------------
  intext1.addEventListener("scroll", () => {
    let y = intext1.scrollTop;
    intext1.scrollTo(0, y);
  });
  // cuando hace scroll outtext1 se sincroniza para que outtext2  se desplaze igual.
  outtext1.addEventListener("scroll", () => {
    let y = outtext1.scrollTop;
    outtext2.scrollTo(0, y);
  });
  // cuando hace scroll outtext2 se sincroniza para que outtext1  se desplaze igual.
  outtext2.addEventListener("scroll", () => {
    let y = outtext2.scrollTop;
    outtext1.scrollTo(0, y);
  });
  // cuando hace scroll outtext3 se sincroniza para que outtext4  se desplaze igual.
  outtext3.addEventListener("scroll", () => {
    let y = outtext3.scrollTop;
    outtext4.scrollTo(0, y);
  });
  // cuando hace scroll outtext4 se sincroniza para que outtext3  se desplaze igual.
  outtext4.addEventListener("scroll", () => {
    let y = outtext4.scrollTop;
    outtext3.scrollTo(0, y);
  });
  //----------------------------------------------------------------------------------------------
});

//definicion de constantes
let tipoSina = 2; //determina el tipo de sinalefa
let tamanoInicialVentana = "25vh";
let ampliar = true;

/**
 * Limpia todos los textarea y deshabilita el botón de limpiar.
 * Entrada : ninguna (lee los elementos del DOM por id)
 * Salida  : ninguna (efecto de lado: vacía los campos y restaura altura mínima)
 *
 * Restablece la altura de cada textarea al valor inicial (--tamanoVentanaMin)
 * para deshacer el efecto de ampliarVentanas().
 */
function limpiar() {
  // limpia todos loa textarea
  const boton3 = document.getElementById("boton3");
  const intext1 = document.getElementById("intext1");
  const outtext1 = document.getElementById("outtext1");
  const outtext2 = document.getElementById("outtext2");
  const outtext3 = document.getElementById("outtext3");
  const outtext4 = document.getElementById("outtext4");

  boton3.disabled = true;
  intext1.value = "";
  intext1.style.height = tamanoInicialVentana;
  outtext1.value = "";
  outtext1.style.height = tamanoInicialVentana;
  outtext2.value = "";
  outtext2.style.height = tamanoInicialVentana;
  outtext3.value = "";
  outtext3.style.height = tamanoInicialVentana;
  outtext4.value = "";
  outtext4.style.height = tamanoInicialVentana;
}

//Determina el elemento mas largo de un arreglo.
//Recibe un arreglo y devuelve el número de elementos(carácteres) del verso más largo.
//Determina el verso más largo del poema
//No se utilizó
function largoMayor(arre) {
  let arreglo = arre;
  let mayor = 0;
  if (arreglo.length > 1) {
    for (let i = 0; i < arreglo.length - 1; i++) {
      if (arreglo[i].length >= arreglo[i + 1].length) {
        mayor = arreglo[i].length;
      } else {
        mayor = arreglo[i + 1].length;
      }
    }
  } else {
    mayor = arreglo[0].length;
  }
  return mayor;
}

/**
 * Alterna entre dos modos de altura de los textarea: ajustada al contenido o mínima.
 * Entrada : ninguna — usa la variable global `ampliar` como interruptor
 * Salida  : ninguna (efecto de lado: modifica `style.height` de los textarea)
 *
 * Cuando ampliar=true: fuerza "height:auto" y luego ajusta al scrollHeight real,
 * permitiendo que el área crezca para mostrar todo el texto sin scroll interno.
 * Cuando ampliar=false: restaura la altura mínima definida en CSS (--tamanoVentanaMin).
 * Invierte el valor de `ampliar` al final para que el siguiente clic haga lo contrario.
 */
function ampliarVentanas() {
  const intext1 = document.getElementById("intext1");
  const outtext1 = document.getElementById("outtext1");
  const outtext2 = document.getElementById("outtext2");
  const outtext3 = document.getElementById("outtext3");
  const outtext4 = document.getElementById("outtext4");

  if (ampliar) {
    // Ajustar la altura automáticamente
    intext1.style.height = "auto";
    intext1.style.height = intext1.scrollHeight + "px";

    // Ajustar la altura automáticamente
    outtext1.style.height = "auto";
    outtext1.style.height = outtext1.scrollHeight + "px";

    // Ajustar la altura automáticamente
    outtext2.style.height = "auto";
    outtext2.style.height = outtext2.scrollHeight + "px";

    // Ajustar la altura automáticamente
    outtext3.style.height = "auto";
    outtext3.style.height = outtext3.scrollHeight + "px";

    // Ajustar la altura automáticamente
    outtext4.style.height = "auto";
    outtext4.style.height = outtext4.scrollHeight + "px";
  } else {
    intext1.style.height = tamanoInicialVentana;

    outtext1.style.height = tamanoInicialVentana;

    outtext2.style.height = tamanoInicialVentana;

    outtext3.style.height = tamanoInicialVentana;

    outtext4.style.height = tamanoInicialVentana;
  }
  ampliar = !ampliar;
}

//Hacer alto de pantalla igual a la pantalla del dispositivo.
function obtenerTamanoPantalla() {
  const body = document.getElementById("body");
//  let ancho = screen.width;
  let alto = screen.height;
  alto = 1 * alto;
//  ancho = 1 * ancho;
  body.css("height", alto + "px");
}

/**
 * Función principal: lee el poema del textarea, lo procesa verso a verso
 * y muestra los resultados en los cuatro paneles de salida.
 * Entrada : ninguna — lee `intext1.value` del DOM
 * Salida  : ninguna (efecto de lado: escribe en outtext1..4 y habilita boton3)
 *
 * Para cada verso:
 *   outtext1 — verso con sílabas ortográficas separadas por "/"
 *   outtext2 — conteo ortográfico de sílabas por verso
 *   outtext3 — verso con sílabas poéticas (incluye "~" para sinalefas)
 *   outtext4 — conteo poético de sílabas por verso
 *
 * La numeración de versos (1--, 2--...) se añade como prefijo a cada línea
 * para facilitar la lectura del resultado en los textarea.
 */
function principal() {
  let arrSilOrto = [""];
  let arrVerOrto = [""];
  let arrSilPoe = [""];
  let arrVerPoe = [""];
  let a1 = "";
  let a2 = "";
  let a3 = "";
  let a4 = "";

  const intext1 = document.getElementById("intext1");
  const outtext1 = document.getElementById("outtext1");
  const outtext2 = document.getElementById("outtext2");
  const outtext3 = document.getElementById("outtext3");
  const outtext4 = document.getElementById("outtext4");
  const boton3 = document.getElementById("boton3");

  if (intext1.value.trim() === "") {
    boton3.disabled = true;
  } else {
    boton3.disabled = false;
  }
  let filas = leerFila(); //codigo nuevo
  for (let i = 0; i < filas.length; i++) {
    let j = i + 1;
    let versoEntrada = depurarVerso(filas[i]);
    let versoSalida = [];

    versoSalida = leerVerso(versoEntrada);
    let contaOrtografica = contarSilabasOrtografico(versoSalida, "/");
    arrSilOrto[i] = j + "- " + contaOrtografica.toString().concat("\n");
    arrVerOrto[i] = versoSalida;
    arrVerOrto[i] = arrVerOrto[i].toString().replaceAll(",", " ");

    versoSalida = segundo(filas[i]);
    let silabasPoetico = contaOrtografica + contarSilabasPoetico(versoSalida);
    arrSilPoe[i] = j + "- " + silabasPoetico.toString().concat("\n");
    arrVerPoe[i] = versoSalida;
    arrVerPoe[i] = arrVerPoe[i].toString().replaceAll(",", " ");
  }

  //para cada verso, en ambos arreglos, agrega un numero de verso y luego --
  for (let i = 0; i < arrVerPoe.length; i++) {
    let j = i + 1;
    arrVerPoe[i] = j + "-- " + arrVerPoe[i].concat("\n");
    arrVerOrto[i] = j + "-- " + arrVerOrto[i].concat("\n");
  }
  for (let i = 0; i < filas.length; i++) {
    a1 = a1.concat(arrVerOrto[i]);
    a2 = a2.concat(arrSilOrto[i]);
    a3 = a3.concat(arrVerPoe[i]);
    a4 = a4.concat(arrSilPoe[i]);
    outtext1.value=a1; //imprime salida ortografic
    outtext2.value=a2; //impripe salida poetica
    outtext3.value=a3; //imprime salida ortografic
    outtext4.value=a4; //impripe salida poetica
  }
}

/**
 * Lee el textarea de entrada y divide el poema en versos individuales.
 * Entrada : ninguna — lee `intext1.value` del DOM
 * Salida  : arreglo de strings, uno por verso, sin líneas vacías
 */
function leerFila() {
  const intext1 = document.getElementById("intext1");
  let s = intext1.value;
  let verso = s;
  let lineas = verso.split("\n"); //separa
  lineas = lineas.filter((element) => element != ""); //elimina elementos vacios ""
  return lineas;
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
function determinaAcentoPalabra(palabra) {
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

/*function determinaAcentoPalabra(pal) {
  let p = pal;
  let arregloEnSilabas = [""];
  let arregloVocalesAcento = ["á", "é", "í", "ó", "ú"];
  let palabra = p;
  let silaba;
  let letra;
  let tilde = false;
  let numeroDeSilaba;
  let indicadorAcento = 2;
  let numeroSilabas;
  let palabraEnSilabas = palabra.toString();
  arregloEnSilabas = palabraEnSilabas.split("/");
  numeroSilabas = arregloEnSilabas.length;

  if (numeroSilabas != 1) {
    for (let i = 0; i < numeroSilabas; i++) {
      //determina si la palabra lleva tilde
      silaba = arregloEnSilabas[i];
      for (let j = 0; j < silaba.length; j++) {
        letra = silaba[j];
        for (let k = 0; k < arregloVocalesAcento.length; k++) {
          if (letra == arregloVocalesAcento[k]) {
            numeroDeSilaba = i;

            if (numeroDeSilaba === numeroSilabas - 1) {
              indicadorAcento = 1;
            } else if (numeroDeSilaba == numeroSilabas - 2) {
              indicadorAcento = 0;
            } else if (numeroDeSilaba < numeroSilabas - 2) {
              indicadorAcento = -1;
            }
            k = arregloVocalesAcento.length;
            j = silaba.length;
            i = numeroSilabas.length;
          }
        } //salida for arregloVocales
      } //salida for letras
    } //salida for numeroSilabas.
    if (indicadorAcento == 2) {
      //Si palabra no lleva tilde
      let ultimaSilaba = arregloEnSilabas[numeroSilabas - 1];
      let ultimaLetra = ultimaSilaba[ultimaSilaba.length - 1];
      if (
        ultimaLetra == "s" ||
        ultimaLetra == "n" ||
        ultimaLetra == "a" ||
        ultimaLetra == "e" ||
        ultimaLetra == "i" ||
        ultimaLetra == "o" ||
        ultimaLetra == "u"
      ) {
        indicadorAcento = 0; //palabra llana
      } else {
        indicadorAcento = 1; //palabra aguda
      }
    }
  } else {
    //monosilabo
    indicadorAcento = 1; //palabra aguda monosilabo
  }
  return indicadorAcento;
}*/

/*function depurarVerso(fila) {
  let arregloCaracteresNormales = [
    "a",
    "e",
    "i",
    "o",
    "u",
    "á",
    "é",
    "í",
    "ó",
    "ú",
    "h",
    "ä",
    "ë",
    "ï",
    "ö",
    "ü",
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
    " ",
  ];
  let s = fila; //codigo en prueba

  let caracterValido = false;
  let verso = s;
  verso = s.trim();
  let versoCopia = verso.toLowerCase();

  for (let i = 0; i < versoCopia.length; i++) {
    caracterValido = false;
    for (let j = 0; j < arregloCaracteresNormales.length; j++) {
      if (versoCopia[i] == arregloCaracteresNormales[j]) {
        caracterValido = true;
      } //salida de caracter valido
    } //salida j
    if (!caracterValido) {
      versoCopia = versoCopia.replaceAll(versoCopia[i], "");
      i = i - 1;
    }
  } //salida de i
  versoCopia = versoCopia.replaceAll(/\s+/g, " ");

  return versoCopia;
}*/

// → movido a utils.js

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
function segundo(filas) {
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

/*function contarSilabasOrtografico(arreglo, caracter) {
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
}*/

/**
 * Cuenta las sílabas ortográficas totales de un verso.
 * Entrada : arreglo de palabras silabadas (salida de leerVerso)
 *           caracter = separador de sílabas (siempre "/")
 * Salida  : número entero con el total de sílabas del verso
 *
 * Por cada palabra: cuenta las apariciones de "/" y le suma 1
 * (n separadores = n+1 sílabas). Si la palabra no tiene separador, vale 1.
 */
function contarSilabasOrtografico(arreglo, caracter) {
  let totalSilabas = 0;

  for (const palabra of arreglo) {
    let contadorCaracter = 0;

    for (const letra of palabra) {
      if (letra === caracter) {
        contadorCaracter++;
      }
    }

    // Si no se encuentra el caracter en la palabra, cuenta como 1 sílaba
    if (contadorCaracter === 0) {
      totalSilabas++;
    } else {
      // Se suman las sílabas encontradas más una adicional
      totalSilabas += contadorCaracter + 1;
    }
  }

  return totalSilabas;
}

/*function contarSilabasPoetico(v) {
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
}*/

/**
 * Calcula el ajuste poético sobre el conteo ortográfico.
 * Entrada : arreglo de palabras marcadas por segundo() (palabras con "~" al final
 *           indican sinalefa con la palabra siguiente)
 * Salida  : número entero (negativo o positivo) que se SUMA al conteo ortográfico:
 *           −1 por cada sinalefa + ajuste por acento de la última palabra
 *
 * Regla de acento final (se suma al resultado):
 *   aguda  (+1): el verso suena con una sílaba extra al final
 *   llana  ( 0): sin ajuste
 *   esdrújula (−1): se descuenta una sílaba
 *
 * Ejemplo: "amor eterno" → orto=5, conta=0 sinalefas, acento aguda(+1) → poético=6
 */
function contarSilabasPoetico(verso) {
  let conta = 0;

  // Contar las tildes al final de cada palabra en el verso
  for (const palabra of verso) {
    if (palabra.endsWith("~")) {
      conta++;
    }
  }

  // Determinar el acento de la última palabra del verso
  const acentoUltimaPalabra = determinaAcentoPalabra(verso[verso.length - 1]);

  // Calcular el total de sílabas poéticas
  const total = -conta + acentoUltimaPalabra;

  return total;
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
function obtenerSilabas(palabras) {
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

function extraerSilabas(p) {
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
function sinalefaTresPalabras(silaba1, silaba2, silaba3) {
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
function sinalefaDosPalabras(silaba1, silaba2) {
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
function leerVerso(s) {
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

// → movido a vocales.js
// → movido a vocales.js


// → movido a utils.js

// → movido a utils.js

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
// → movido a silabeo.js


// → movido a utils.js

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
// → movido a silabeo.js


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
// → movido a vocales.js


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
// → movido a silabeo.js


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
// → movido a vocales.js


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
// → movido a silabeo.js


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
 * Ejemplos:
 *   "iuei" → dFFd → caso 1
 *   "uiei" → caso con triptongo + débil → otro caso
 */
// → movido a vocales.js

//--------------------------------------------------------------------------------------------------
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
// → movido a vocales.js


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
 *
 * Ejemplo que NO forma trisinalefa: vocal muy abierta flanqueada por cerradas
 * donde el ritmo obligaría a dos golpes de voz.
 */
// → movido a vocales.js


/*function monosilabo(mono) {
 pal= leerVerso(mono); 
 let monoSilabo; 
if(pal.length ==1){
    monoSilabo=true;
}else {
    monoSilabo=false;
}
    return monoSilabo;
}*/
