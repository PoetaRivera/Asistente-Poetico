import { depurarVerso } from './utils.js';
import { leerVerso, segundo, contarSilabasOrtografico, contarSilabasPoetico } from './metrica.js';

let tamanoInicialVentana = '25vh';
let ampliar = true;

/**
 * Limpia todos los textarea y deshabilita el botón de limpiar.
 * Entrada : ninguna (lee los elementos del DOM por id)
 * Salida  : ninguna (efecto de lado: vacía los campos y restaura altura mínima)
 *
 * Restablece la altura de cada textarea al valor inicial (--tamanoVentanaMin)
 * para deshacer el efecto de ampliarVentanas().
 */
export function limpiar() {
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
export function ampliarVentanas() {
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
export function obtenerTamanoPantalla() {
  const body = document.getElementById("body");
//  let ancho = screen.width;
  let alto = screen.height;
  alto = 1 * alto;
//  ancho = 1 * ancho;
  body.css("height", alto + "px");
}

/**
 * Limpia todos los textarea y deshabilita el botón de limpiar.
 * Entrada : ninguna (lee los elementos del DOM por id)
 * Salida  : ninguna (efecto de lado: vacía los campos y restaura altura mínima)
 *
 * Restablece la altura de cada textarea al valor inicial (--tamanoVentanaMin)
 * para deshacer el efecto de ampliarVentanas().
 */
export function largoMayor(arre) {
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
export function principal() {
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
export function leerFila() {
  const intext1 = document.getElementById("intext1");
  let s = intext1.value;
  let verso = s;
  let lineas = verso.split("\n"); //separa
  lineas = lineas.filter((element) => element != ""); //elimina elementos vacios ""
  return lineas;
}

