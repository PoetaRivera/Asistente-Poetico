import { depurarVerso } from './utils.js';
import { leerVerso, segundo, contarSilabasOrtografico, contarSilabasPoetico } from './metrica.js';
import { analizarPoema } from './analizador.js';

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

  const analisis = document.getElementById("analisis-completo");
  if (analisis) {
    analisis.classList.remove("visible");
    const contenido = document.getElementById("contenido-analisis");
    if (contenido) {
      while (contenido.firstChild) contenido.removeChild(contenido.firstChild);
    }
  }
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

export function analisisCompleto() {
  const intext1 = document.getElementById("intext1");
  if (!intext1.value.trim()) return;

  const r = analizarPoema(intext1.value);
  const cont = document.getElementById("contenido-analisis");
  while (cont.firstChild) cont.removeChild(cont.firstChild);

  const forma = r.estructura.tipoProbable;
  const esperado = metroEsperado(forma, r.versos.length, r.estructura);
  const ok = (sl, i) => {
    if (esperado[i] !== undefined) return sl === esperado[i];
    if (forma === 'silva') return sl === 7 || sl === 11;
    return sl === r.metroDominante;
  };

  cont.appendChild(crearResumen(r, forma));
  cont.appendChild(crearTablaAnalisis(r, ok));
  const sugerencias = crearSugerencias(r);
  if (sugerencias) cont.appendChild(sugerencias);

  const seccion = document.getElementById("analisis-completo");
  seccion.classList.add("visible");
}

function crearResumen(r, forma) {
  const div = document.createElement("div");
  div.className = "resumen-analisis";

  const datos = [
    ["Versos:", String(r.totalVersos)],
    ["Metro dominante:", (r.metroDominante ?? "--") + "s"],
    ["Forma:", forma + " (" + Math.round(r.estructura.confianza * 100) + "%)"],
    ["Rima:", r.rima.tipoProbable + " | " + r.rima.patronConsonante],
  ];

  for (const [etiqueta, valor] of datos) {
    const span = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = etiqueta;
    span.appendChild(strong);
    span.appendChild(document.createTextNode(" " + valor));
    div.appendChild(span);
  }

  return div;
}

function crearTablaAnalisis(r, ok) {
  const table = document.createElement("table");
  table.className = "tabla-analisis";

  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  for (const h of ["#", "Sil. poéticas", "Rima", "Palabra final", "Estado"]) {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  }
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let i = 0; i < r.versos.length; i++) {
    const v = r.versos[i];
    const letra = r.rima.versos[i]?.letraConsonante;
    const palabra = r.rima.versos[i]?.palabra ?? "";
    const consonante = r.rima.versos[i]?.consonante ?? "";
    const esOk = ok(v.silabasPoeticas, i);

    const tr = document.createElement("tr");
    if (!esOk) tr.className = "fila-desviada";

    const valores = [
      String(v.numero),
      String(v.silabasPoeticas),
      letra && letra !== "-" ? letra : "·",
      palabra,
      esOk ? "✓" : "⚠",
    ];

    for (let j = 0; j < valores.length; j++) {
      const td = document.createElement("td");
      td.textContent = valores[j];
      if (j === 2 && consonante) td.title = consonante;
      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  return table;
}

function crearSugerencias(r) {
  const versosConSugerencias = r.versos.filter(
    (v) => v.sugerenciasMetricas?.opciones?.length > 0
  );
  if (versosConSugerencias.length === 0) return null;

  const fragment = document.createDocumentFragment();

  const titulo = document.createElement("div");
  titulo.className = "titulo-seccion";
  titulo.textContent = "Sugerencias métricas";
  fragment.appendChild(titulo);

  for (const v of versosConSugerencias) {
    const div = document.createElement("div");
    div.className = "sugerencia";

    const strong = document.createElement("strong");
    strong.textContent = "Verso " + v.numero + ":";
    div.appendChild(strong);
    div.appendChild(document.createTextNode(" " + v.sugerenciasMetricas.explicacion));

    const ul = document.createElement("ul");
    for (const o of v.sugerenciasMetricas.opciones) {
      const li = document.createElement("li");
      const em = document.createElement("em");
      em.textContent = o.tipo + ":";
      li.appendChild(em);
      li.appendChild(document.createTextNode(" " + o.consejo));
      ul.appendChild(li);
    }
    div.appendChild(ul);
    fragment.appendChild(div);
  }

  return fragment;
}

function metroEsperado(forma, total, estructura) {
  // Formas con patrón métrico fijo por posición
  if (forma === 'lira') return [7, 11, 7, 7, 11];
  if (forma === 'seguidilla') return [7, 5, 7, 5];
  // Silva: cualquier verso de 7 u 11 es válido
  if (forma === 'silva') {
    return Array(total).fill(null).map(() => null); // null = cualquier 7 o 11
  }
  // Si la estructura ya tiene metrosAjustados, usarlos
  if (estructura.metrosAjustados) return estructura.metrosAjustados;
  // Para el resto, se compara contra metroDominante (comportamiento por defecto)
  return [];
}


