import { depurarVerso } from "./utils.js";
import {
  contarSilabasOrtografico,
  contarSilabasPoetico,
  determinaAcentoPalabra,
  leerVerso,
  segundo,
} from "./metrica.js";

const ACENTO_NOMBRES = {
  "1": "aguda",
  "0": "llana",
  "-1": "esdrujula",
};

const VOCALES = new Set(["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú", "ü"]);

/**
 * @param {string} texto - Poema completo, un verso por línea
 * @returns {{ totalVersos: number, metroDominante: number|null, estructura: object, rima: object, versos: object[] }}
 */
export function analizarPoema(texto) {
  const versosEntrada = dividirVersos(texto);
  const versos = versosEntrada.map((verso, index) => analizarVerso(verso, index + 1));
  const metroDominante = calcularMetroDominante(silabasDeVersos(versos));
  const versosConSugerencias = versos.map((verso) => ({
    ...verso,
    sugerenciasMetricas: construirSugerenciasMetricas(verso, metroDominante),
  }));
  const rima = analizarRima(versosConSugerencias);
  const estructura = clasificarEstructura(versosConSugerencias, rima);

  return {
    totalVersos: versosConSugerencias.length,
    metroDominante,
    estructura,
    rima,
    versos: versosConSugerencias,
  };
}

/**
 * @param {string} verso - Texto del verso
 * @param {number} [numero=1] - Número de verso en el poema
 * @returns {{ silabasOrtograficas: number, silabasPoeticas: number, sinalefas: object[], rima: object|null }}
 */
export function analizarVerso(verso, numero = 1) {
  const texto = String(verso ?? "");
  const depurado = depurarVerso(texto);

  if (!depurado) {
    return {
      numero,
      texto,
      depurado,
      palabras: [],
      silabeoOrtografico: "",
      silabeoPoetico: "",
      silabasOrtograficas: 0,
      silabasPoeticas: 0,
      ajustePoetico: 0,
      sinalefas: [],
      ultimaPalabra: null,
      rima: null,
    };
  }

  const palabrasOrtograficas = leerVerso(depurado);
  const palabrasPoeticas = segundo(texto);
  const silabasOrtograficas = contarSilabasOrtografico(palabrasOrtograficas, "/");
  const ajustePoetico = contarSilabasPoetico(palabrasPoeticas);
  const silabasPoeticas = silabasOrtograficas + ajustePoetico;
  const sinalefas = extraerSinalefas(palabrasPoeticas);
  const ultimaPalabra = construirUltimaPalabra(palabrasOrtograficas);

  return {
    numero,
    texto,
    depurado,
    palabras: depurado.split(" "),
    silabeoOrtografico: palabrasOrtograficas.join(" "),
    silabeoPoetico: palabrasPoeticas.join(" "),
    silabasOrtograficas,
    silabasPoeticas,
    ajustePoetico,
    sinalefas,
    totalSinalefas: sinalefas.length,
    ultimaPalabra,
    rima: ultimaPalabra?.rima ?? null,
  };
}

/**
 * @param {object[]} versos - Array de versos analizados
 * @returns {{ tipoProbable: string, patronConsonante: string, patronAsonante: string, versos: object[] }}
 */
export function analizarRima(versos) {
  const rimas = versos.map((verso) => verso.rima);
  const consonante = asignarPatron(rimas.map((rima) => rima?.consonante ?? ""));
  const asonante = asignarPatron(rimas.map((rima) => rima?.asonante ?? ""));
  const tipoGlobal = detectarTipoRima(rimas);

  return {
    tipoProbable: tipoGlobal,
    patronConsonante: formatearPatron(consonante),
    patronAsonante: formatearPatron(asonante),
    versos: rimas.map((rima, index) => ({
      verso: index + 1,
      palabra: rima?.palabra ?? "",
      consonante: rima?.consonante ?? "",
      asonante: rima?.asonante ?? "",
      letraConsonante: consonante[index],
      letraAsonante: asonante[index],
    })),
  };
}

function dividirVersos(texto) {
  return String(texto ?? "")
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);
}

function extraerSinalefas(palabrasPoeticas) {
  const sinalefas = [];

  for (let i = 0; i < palabrasPoeticas.length - 1; i++) {
    if (palabrasPoeticas[i].endsWith("~")) {
      sinalefas.push({
        desdePalabra: i + 1,
        hastaPalabra: i + 2,
        desde: palabrasPoeticas[i].replace(/~+$/, ""),
        hasta: palabrasPoeticas[i + 1].replace(/~+$/, ""),
      });
    }
  }

  return sinalefas;
}

function construirUltimaPalabra(palabrasOrtograficas) {
  const silabeada = palabrasOrtograficas.at(-1);
  if (!silabeada) return null;

  const palabra = silabeada.replaceAll("/", "");
  const acentoValor = determinaAcentoPalabra(silabeada);
  const tipoAcento = ACENTO_NOMBRES[String(acentoValor)] ?? "desconocido";
  const rima = extraerRima(silabeada, palabra, acentoValor);

  return {
    palabra,
    silabeada,
    tipoAcento,
    ajuste: acentoValor,
    rima,
  };
}

function extraerRima(palabraSilabeada, palabra, acentoValor) {
  const silabas = palabraSilabeada.split("/");
  const desplazamiento = acentoValor === 1 ? 1 : acentoValor === 0 ? 2 : 3;
  const indiceTonico = Math.max(0, silabas.length - desplazamiento);
  const silabaTonica = silabas[indiceTonico] ?? "";
  const inicioVocal = buscarPrimeraVocal(silabaTonica);
  const fragmento = `${silabaTonica.slice(inicioVocal)}${silabas.slice(indiceTonico + 1).join("")}`;
  const consonante = normalizarRima(fragmento);
  const asonante = [...consonante].filter((char) => VOCALES.has(char)).join("");

  return {
    palabra,
    desdeSilaba: indiceTonico + 1,
    fragmento,
    consonante,
    asonante,
  };
}

function buscarPrimeraVocal(texto) {
  const letras = [...String(texto ?? "")];
  const indice = letras.findIndex((char) => VOCALES.has(normalizarRima(char)));
  if (indice === -1) return 0;
  // Si la primera vocal es débil y la siguiente es fuerte, usar la fuerte
  // (diptongo creciente: "hue" → empezar desde "e", no desde "u")
  const debiles = new Set(["i", "u", "í", "ú"]);
  const char = normalizarRima(letras[indice]);
  if (debiles.has(char) && indice + 1 < letras.length) {
    const sig = normalizarRima(letras[indice + 1]);
    if (VOCALES.has(sig) && !debiles.has(sig)) {
      return indice + 1;
    }
  }
  return indice;
}

function construirSugerenciasMetricas(verso, metroObjetivo) {
  if (!metroObjetivo || !verso?.silabasPoeticas) {
    return {
      metroObjetivo,
      estado: "sin objetivo",
      explicacion: "No hay suficientes versos para inferir un metro dominante.",
      opciones: [],
    };
  }

  const diferencia = verso.silabasPoeticas - metroObjetivo;

  if (diferencia === 0) {
    return {
      metroObjetivo,
      estado: "ajustado",
      explicacion: `El verso tiene ${verso.silabasPoeticas} silabas metricas, lo que coincide con el metro dominante del poema. No se necesitan licencias metricas.`,
      opciones: [],
    };
  }

  if (diferencia > 0) {
    const opciones = proponerSineresis(verso, diferencia);
    const trisinalefas = proponerTrisinalefa(verso, diferencia);
    if (trisinalefas.length > 0) opciones.push(...trisinalefas);
    const sineresisSimples = opciones.filter(o => o.tipo === "sineresis");
    const todasCombinaciones = generarCombinacionesSineresis(verso, diferencia, sineresisSimples);
    if (todasCombinaciones.length > 0) opciones.unshift(...todasCombinaciones);
    return {
      metroObjetivo,
      estado: opciones.length > 0 ? "requiere reducir" : "sin sugerencia automatica",
      explicacion: opciones.length > 0
        ? `El verso tiene ${verso.silabasPoeticas} silabas pero el metro dominante es ${metroObjetivo}. Se necesitan ${diferencia} licencia(s) metrica(s) de reduccion.`
        : `El verso tiene ${verso.silabasPoeticas} silabas pero el metro dominante es ${metroObjetivo}. No se encontro una reduccion simple.`,
      causaProbable: detectarCausaDesviacion(verso, diferencia),
      opciones,
    };
  }

  const opciones = proponerDialefa(verso, Math.abs(diferencia));
  return {
    metroObjetivo,
    estado: opciones.length > 0 ? "requiere ampliar" : "sin sugerencia automatica",
    explicacion: opciones.length > 0
      ? `El verso tiene ${verso.silabasPoeticas} silabas pero el metro dominante es ${metroObjetivo}. Se necesitan ${Math.abs(diferencia)} licencia(s) metrica(s) de ampliacion.`
      : `El verso tiene ${verso.silabasPoeticas} silabas pero el metro dominante es ${metroObjetivo}. No hay sinalefas suficientes para proponer dialefa.`,
    causaProbable: detectarCausaDesviacion(verso, diferencia),
    opciones,
  };
}

function proponerSineresis(verso, reduccionNecesaria) {
  const palabras = verso.silabeoOrtografico.split(" ");
  const opciones = [];

  for (let palabraIndex = 0; palabraIndex < palabras.length; palabraIndex++) {
    const silabas = palabras[palabraIndex].split("/");
    if (silabas.length < 2) continue;

    for (let silabaIndex = 0; silabaIndex < silabas.length - 1; silabaIndex++) {
      if (!puedeHaberSineresis(silabas[silabaIndex], silabas[silabaIndex + 1])) continue;

      const nuevasSilabas = [
        ...silabas.slice(0, silabaIndex),
        `${silabas[silabaIndex]}${silabas[silabaIndex + 1]}`,
        ...silabas.slice(silabaIndex + 2),
      ];
      const palabrasAjustadas = [...palabras];
      palabrasAjustadas[palabraIndex] = nuevasSilabas.join("/");

      const palabraLimpia = palabras[palabraIndex].replaceAll("/", "");
      const silaba1 = silabas[silabaIndex];
      const silaba2 = silabas[silabaIndex + 1];

      opciones.push({
        tipo: "sineresis",
        queEs: "La sineresis une en una sola silaba metrica dos vocales que la lectura ortografica separa dentro de una palabra. Es una licencia poetica que permite ajustar la cuenta metrica sin cambiar el texto.",
        palabra: palabraLimpia,
        lecturaActual: {
          silabeo: palabras[palabraIndex],
          conteo: silabas.length,
          explicacion: `Se pronuncia con ${silabas.length} silabas: ${silabas.join(" / ")}.`,
        },
        lecturaPropuesta: {
          silabeo: palabrasAjustadas[palabraIndex],
          conteo: nuevasSilabas.length,
          explicacion: `Se unen "${silaba1}" y "${silaba2}" en una sola silaba. La palabra pasa a ${nuevasSilabas.length} silabas metricas: ${nuevasSilabas.join(" / ")}.`,
        },
        versoCompleto: {
          original: verso.silabeoOrtografico,
          propuesto: aplicarPalabraAjustada(verso.silabeoPoetico, palabraIndex, palabrasAjustadas[palabraIndex]),
        },
        silabasResultantes: verso.silabasPoeticas - 1,
        cambio: -1,
        consejo: `Si aplicas esta sineresis, el verso pasa de ${verso.silabasPoeticas} a ${verso.silabasPoeticas - 1} silabas metricas.`,
      });
    }
  }

  if (reduccionNecesaria > 1 && opciones.length >= reduccionNecesaria) {
    const combinada = combinarSineresis(verso, palabras, opciones, reduccionNecesaria);
    if (combinada && !opciones.some(o => o.tipo === "sineresis_multiple")) opciones.unshift(combinada);
  }

  return opciones.filter((opcion) => opcion.silabasResultantes === verso.silabasPoeticas - reduccionNecesaria);
}

function generarCombinacionesSineresis(verso, reduccionNecesaria, sineresisSimples) {
  if (reduccionNecesaria < 2 || sineresisSimples.length < 2) return [];
  const combinaciones = [];
  const indices = sineresisSimples.map((_, i) => i);
  const combinacionesIdx = generarSubconjuntos(indices, reduccionNecesaria);

  for (const subset of combinacionesIdx) {
    const palabrasAjustadas = verso.silabeoOrtografico.split(" ");
    const detalles = [];
    let valido = true;

    for (const idx of subset) {
      const opcion = sineresisSimples[idx];
      const palabraIdx = verso.silabeoOrtografico.split(" ").findIndex((palabra) => palabra.replaceAll("/", "") === opcion.palabra);
      if (palabraIdx === -1) { valido = false; break; }
      const nuevasSilabas = opcion.lecturaPropuesta.silabeo.split("/");
      palabrasAjustadas[palabraIdx] = nuevasSilabas.join("/");
      detalles.push(`"${opcion.palabra}": ${opcion.lecturaActual.silabeo} → ${opcion.lecturaPropuesta.silabeo}`);
    }

    if (valido) {
      combinaciones.push({
        tipo: "sineresis_multiple",
        queEs: `Se aplican ${subset.length} sineresis a la vez para reducir el conteo metrico.`,
        palabrasAfectadas: detalles,
        versoCompleto: {
          original: verso.silabeoOrtografico,
          propuesto: reconstruirPoeticoConOrtografico(verso.silabeoPoetico, palabrasAjustadas),
        },
        silabasResultantes: verso.silabasPoeticas - subset.length,
        cambio: -subset.length,
        consejo: `Si aplicas estas ${subset.length} sineresis, el verso pasa de ${verso.silabasPoeticas} a ${verso.silabasPoeticas - subset.length} silabas metricas.`,
      });
    }
  }

  return combinaciones.filter(c => c.silabasResultantes === verso.silabasPoeticas - reduccionNecesaria);
}

function generarSubconjuntos(arr, tamanio) {
  const resultados = [];
  function backtrack(inicio, actual) {
    if (actual.length === tamanio) { resultados.push([...actual]); return; }
    for (let i = inicio; i < arr.length; i++) {
      actual.push(arr[i]);
      backtrack(i + 1, actual);
      actual.pop();
    }
  }
  backtrack(0, []);
  return resultados;
}

function proponerTrisinalefa(verso, reduccionNecesaria) {
  if (!Array.isArray(verso.sinalefas) || verso.sinalefas.length < 2) return [];
  const palabrasPoeticas = verso.silabeoPoetico.split(" ");
  const opciones = [];

  for (let i = 0; i < verso.sinalefas.length - 1; i++) {
    const s1 = verso.sinalefas[i];
    const s2 = verso.sinalefas[i + 1];
    if (s1.hastaPalabra !== s2.desdePalabra) continue;

    const palabra1 = s1.desde.replaceAll("/", "");
    const palabra2 = s1.hasta.replaceAll("/", "");
    const palabra3 = s2.hasta.replaceAll("/", "");

    opciones.push({
      tipo: "trisinalefa",
      queEs: "La trisinalefa fusiona tres palabras consecutivas en una sola silaba metrica. Es mas intensa que la sinalefa simple y permite reducir dos silabas de un golpe.",
      entre: {
        palabras: `"${palabra1}" + "${palabra2}" + "${palabra3}"`,
        lecturaActual: {
          explicacion: `Hay dos sinalefas consecutivas: "${palabra1}"-"${palabra2}" y "${palabra2}"-"${palabra3}".`,
        },
        lecturaPropuesta: {
          explicacion: `Las tres palabras se pronuncian en un solo golpe de voz, reduciendo 2 silabas metricas.`,
        },
      },
      versoCompleto: {
        original: verso.silabeoPoetico,
        propuesto: palabrasPoeticas.map((p, idx) =>
          idx === s1.desdePalabra - 1 || idx === s2.desdePalabra - 1 ? p.replace(/~+$/, "") + "~" : p
        ).join(" "),
      },
      silabasResultantes: verso.silabasPoeticas - 2,
      cambio: -2,
      consejo: `Si aplicas esta trisinalefa, el verso pasa de ${verso.silabasPoeticas} a ${verso.silabasPoeticas - 2} silabas metricas.`,
    });
  }

  return opciones.filter(o => o.silabasResultantes === verso.silabasPoeticas - reduccionNecesaria);
}

function detectarCausaDesviacion(verso, diferencia) {
  const causas = [];
  const ultima = verso.ultimaPalabra;

  if (!ultima) return "No se pudo determinar la causa.";

  if (diferencia > 0) {
    if (ultima.tipoAcento === "aguda") causas.push("La ultima palabra es aguda (+1 silaba metrica).");
    if (verso.totalSinalefas === 0) causas.push("No hay sinalefas que reduzcan el conteo.");
    if (verso.ajustePoetico === 0) causas.push("No hay licencias metricas aplicadas automaticamente.");
    if (causas.length === 0) causas.push("El verso tiene silabas de mas por hiato o falta de sinalefas.");
  } else {
    if (ultima.tipoAcento === "esdrujula") causas.push("La ultima palabra es esdrujula (-1 silaba metrica).");
    if (verso.totalSinalefas > 0) causas.push(`Hay ${verso.totalSinalefas} sinalefa(s) que reducen el conteo.`);
    if (causas.length === 0) causas.push("El verso tiene silabas de menos por sinalefas o palabra esdrujula final.");
  }

  return causas.join(" ");
}

function combinarSineresis(verso, palabras, opciones, reduccionNecesaria) {
  const seleccion = opciones.slice(0, reduccionNecesaria);
  const palabrasAjustadas = [...palabras];
  const detalles = [];

  for (const opcion of seleccion) {
    const indice = palabras.findIndex((palabra) => palabra.replaceAll("/", "") === opcion.palabra);
    if (indice === -1) return null;
    const nuevasSilabas = opcion.lecturaPropuesta.silabeo.split("/");
    palabrasAjustadas[indice] = nuevasSilabas.join("/");
    detalles.push(`"${opcion.palabra}": ${opcion.lecturaActual.silabeo} → ${opcion.lecturaPropuesta.silabeo}`);
  }

  return {
    tipo: "sineresis_multiple",
    queEs: "Se aplican varias sineresis a la vez para reducir el conteo metrico. Cada sineresis une dos vocales dentro de una misma palabra.",
    palabrasAfectadas: detalles,
    versoCompleto: {
      original: verso.silabeoOrtografico,
      propuesto: reconstruirPoeticoConOrtografico(verso.silabeoPoetico, palabrasAjustadas),
    },
    silabasResultantes: verso.silabasPoeticas - reduccionNecesaria,
    cambio: -reduccionNecesaria,
    consejo: `Si aplicas las ${reduccionNecesaria} sineresis propuestas, el verso pasa de ${verso.silabasPoeticas} a ${verso.silabasPoeticas - reduccionNecesaria} silabas metricas.`,
  };
}

function proponerDialefa(verso, ampliacionNecesaria) {
  if (!Array.isArray(verso.sinalefas) || verso.sinalefas.length === 0) return [];

  const opciones = verso.sinalefas.map((sinalefa) => {
    const palabrasPoeticas = verso.silabeoPoetico.split(" ");
    palabrasPoeticas[sinalefa.desdePalabra - 1] = palabrasPoeticas[sinalefa.desdePalabra - 1].replace(/~+$/, "");

    const palabra1 = sinalefa.desde.replaceAll("/", "");
    const palabra2 = sinalefa.hasta.replaceAll("/", "");

    return {
      tipo: "dialefa",
      queEs: "La dialefa evita la sinalefa normal, pronunciando las vocales de dos palabras consecutivas en silabas metricas separadas. Esto suma una silaba a la cuenta metrica. Tambien se llama 'hiato intencional'.",
      entre: {
        palabras: `"${palabra1}" + "${palabra2}"`,
        lecturaActual: {
          explicacion: `Hay una sinalefa entre "${palabra1}" y "${palabra2}". Se pronuncian unidos en una sola silaba metrica.`,
        },
        lecturaPropuesta: {
          explicacion: `Se rompe la sinalefa. "${palabra1}" termina con una silaba y "${palabra2}" empieza con otra, sumando una silaba a la cuenta.`,
        },
      },
      versoCompleto: {
        original: verso.silabeoPoetico,
        propuesto: palabrasPoeticas.join(" "),
      },
      silabasResultantes: verso.silabasPoeticas + 1,
      cambio: 1,
      consejo: `Si aplicas esta dialefa, el verso pasa de ${verso.silabasPoeticas} a ${verso.silabasPoeticas + 1} silabas metricas.`,
    };
  });

  if (ampliacionNecesaria > 1 && verso.sinalefas.length >= ampliacionNecesaria) {
    opciones.unshift(...generarCombinacionesDialefa(verso, ampliacionNecesaria));
  }

  return opciones.filter((opcion) => opcion.silabasResultantes === verso.silabasPoeticas + ampliacionNecesaria);
}

function generarCombinacionesDialefa(verso, ampliacionNecesaria) {
  const combinaciones = [];
  const indices = verso.sinalefas.map((_, index) => index);
  const subsets = generarSubconjuntos(indices, ampliacionNecesaria);

  for (const subset of subsets) {
    const palabrasPoeticas = verso.silabeoPoetico.split(" ");
    const palabrasAfectadas = [];

    for (const idx of subset) {
      const sinalefa = verso.sinalefas[idx];
      palabrasPoeticas[sinalefa.desdePalabra - 1] = palabrasPoeticas[sinalefa.desdePalabra - 1].replace(/~+$/, "");
      const palabra1 = sinalefa.desde.replaceAll("/", "");
      const palabra2 = sinalefa.hasta.replaceAll("/", "");
      palabrasAfectadas.push(`"${palabra1}" + "${palabra2}"`);
    }

    combinaciones.push({
      tipo: "dialefa_multiple",
      queEs: "Se rompen varias sinalefas a la vez para ampliar el conteo metrico del verso.",
      palabrasAfectadas,
      versoCompleto: {
        original: verso.silabeoPoetico,
        propuesto: palabrasPoeticas.join(" "),
      },
      silabasResultantes: verso.silabasPoeticas + ampliacionNecesaria,
      cambio: ampliacionNecesaria,
      consejo: `Si aplicas estas ${ampliacionNecesaria} dialefas, el verso pasa de ${verso.silabasPoeticas} a ${verso.silabasPoeticas + ampliacionNecesaria} silabas metricas.`,
    });
  }

  return combinaciones;
}

function puedeHaberSineresis(izquierda, derecha) {
  const ultima = ultimaLetraSignificativa(izquierda);
  const primera = primeraLetraSignificativa(derecha);
  return VOCALES.has(normalizarRima(ultima)) && VOCALES.has(normalizarRima(primera));
}

function ultimaLetraSignificativa(texto) {
  const letras = [...String(texto ?? "")].reverse();
  return letras.find((char) => /[a-zA-Z\u00c0-\u017f]/u.test(char)) ?? "";
}

function primeraLetraSignificativa(texto) {
  const letras = [...String(texto ?? "")];
  return letras.find((char) => /[a-zA-Z\u00c0-\u017f]/u.test(char)) ?? "";
}

function aplicarPalabraAjustada(silabeoPoetico, palabraIndex, palabraAjustada) {
  const palabrasPoeticas = silabeoPoetico.split(" ");
  const marcaSinalefa = palabrasPoeticas[palabraIndex]?.endsWith("~") ? "~" : "";
  palabrasPoeticas[palabraIndex] = `${palabraAjustada}${marcaSinalefa}`;
  return palabrasPoeticas.join(" ");
}

function reconstruirPoeticoConOrtografico(silabeoPoetico, palabrasAjustadas) {
  const palabrasPoeticas = silabeoPoetico.split(" ");
  return palabrasPoeticas.map((palabra, index) => {
    const marcaSinalefa = palabra.endsWith("~") ? "~" : "";
    return `${palabrasAjustadas[index] ?? palabra.replace(/~+$/, "")}${marcaSinalefa}`;
  }).join(" ");
}

function normalizarRima(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .replaceAll("á", "a")
    .replaceAll("é", "e")
    .replaceAll("í", "i")
    .replaceAll("ó", "o")
    .replaceAll("ú", "u")
    .replaceAll("ü", "u")
    .replace(/y$/u, "i");
}

function asignarPatron(claves) {
  const mapa = new Map();
  const conteos = new Map();
  let siguiente = 0;

  for (const clave of claves) {
    if (!clave) continue;
    conteos.set(clave, (conteos.get(clave) ?? 0) + 1);
  }

  return claves.map((clave) => {
    if (!clave || conteos.get(clave) === 1) return "-";
    if (!mapa.has(clave)) {
      mapa.set(clave, letraPatron(siguiente));
      siguiente++;
    }
    return mapa.get(clave);
  });
}

function letraPatron(index) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (index < letras.length) return letras[index];
  return `R${index + 1}`;
}

function formatearPatron(letras) {
  return letras.join("");
}

function detectarTipoRima(rimas) {
  const consonantes = contarRepetidas(rimas.map((rima) => rima?.consonante ?? ""));
  const asonantes = contarRepetidas(rimas.map((rima) => rima?.asonante ?? ""));

  if (consonantes > 0 && consonantes >= asonantes) return "consonante";
  if (asonantes > 0) return "asonante";
  return "sin rima clara";
}

function contarRepetidas(claves) {
  const conteos = new Map();
  for (const clave of claves) {
    if (clave) conteos.set(clave, (conteos.get(clave) ?? 0) + 1);
  }
  return [...conteos.values()].filter((cantidad) => cantidad > 1).length;
}

function calcularMetroDominante(metros) {
  const conteos = new Map();

  for (const metro of metros) {
    conteos.set(metro, (conteos.get(metro) ?? 0) + 1);
  }

  let dominante = null;
  let total = 0;
  for (const [metro, cantidad] of conteos.entries()) {
    if (cantidad > total) {
      dominante = metro;
      total = cantidad;
    }
  }

  return dominante !== null ? Number(dominante) : null;
}

function silabasDeVersos(versos) {
  return versos.map((v) => v.silabasPoeticas);
}

function clasificarEstructura(versos, rima) {
  const total = versos.length;
  const metros = silabasDeVersos(versos);
  const metroDominante = calcularMetroDominante(metros);
  const patronConsonante = rima.patronConsonante;
  const patronAsonante = rima.patronAsonante;
  const todosCerca = (metro) => metros.every((valor) => Math.abs(valor - metro) <= 1);
  const todosExactos = (metro) => metros.every((valor) => valor === metro);
  const liraAjustada = analizarLiraConLicencias(versos, patronConsonante);

  if (total === 14 && todosCerca(11) && esSoneto(patronConsonante)) {
    return {
      tipoProbable: "soneto",
      confianza: 0.85,
      motivo: `14 versos endecasilabos con estructura de soneto (${patronConsonante.slice(0, 8)}...).`,
    };
  }

  if (total === 14 && todosCerca(14) && esSoneto(patronConsonante)) {
    return {
      tipoProbable: "soneto alejandrino",
      confianza: 0.85,
      motivo: `14 versos alejandrinos con estructura de soneto (${patronConsonante.slice(0, 8)}...).`,
    };
  }

  if (total === 17 && todosCerca(11) && esSoneto(patronConsonante)) {
    return {
      tipoProbable: "soneto con estrambote",
      confianza: 0.85,
      motivo: "17 versos endecasilabos con estructura de soneto mas 3 versos de estrambote.",
    };
  }

  if (total === 10 && todosExactos(8) && patronConsonante === "ABBAACCDDC") {
    return {
      tipoProbable: "decima espinela",
      confianza: 0.9,
      motivo: "10 versos octosilabos con patron ABBAACCDDC.",
    };
  }

  if (total === 4 && todosExactos(8) && patronConsonante === "ABBA") {
    return {
      tipoProbable: "redondilla",
      confianza: 0.85,
      motivo: "4 versos octosilabos con rima ABBA.",
    };
  }

  if (total === 4 && todosCerca(8) && esCopla(patronAsonante)) {
    return {
      tipoProbable: "copla",
      confianza: 0.8,
      motivo: "4 versos octosilabos con asonancia en versos pares.",
    };
  }

  if (total === 4 && todosExactos(8) && patronConsonante === "ABAB") {
    return {
      tipoProbable: "cuarteta",
      confianza: 0.85,
      motivo: "4 versos octosilabos con rima ABAB.",
    };
  }

  if (total >= 4 && total % 4 === 0 && todosCerca(8) && esRedondillas(patronConsonante)) {
    const estrofas = total / 4;
    return {
      tipoProbable: "redondillas",
      confianza: 0.85,
      motivo: `${total} versos octosilabos en ${estrofas} redondilla(s) ABBA.`,
    };
  }

  if (total === 4 && esSeguidilla(metros, patronAsonante)) {
    return {
      tipoProbable: "seguidilla",
      confianza: 0.8,
      motivo: "4 versos con patron 7-5-7-5 y asonancia en pares.",
    };
  }

  if (total === 4 && todosCerca(11) && patronConsonante === "ABBA") {
    return {
      tipoProbable: "cuarteto",
      confianza: 0.85,
      motivo: "4 versos endecasilabos con rima abrazada ABBA.",
    };
  }

  if (total === 4 && todosCerca(11) && patronConsonante === "ABAB") {
    return {
      tipoProbable: "serventesio",
      confianza: 0.85,
      motivo: "4 versos endecasilabos con rima alterna ABAB.",
    };
  }

  if (total >= 4 && todosCerca(11) && pareceRomance(patronAsonante)) {
    return {
      tipoProbable: "romance heroico",
      confianza: 0.8,
      motivo: "Versos endecasilabos con asonancia en versos pares.",
    };
  }

  if (total >= 4 && todosCerca(8) && pareceRomance(patronAsonante)) {
    return {
      tipoProbable: "romance",
      confianza: 0.75,
      motivo: "Versos cercanos al octosilabo con asonancia predominante en versos pares.",
    };
  }

  if (total === 5 && todosCerca(8) && esQuintilla(patronConsonante)) {
    return {
      tipoProbable: "quintilla",
      confianza: 0.8,
      motivo: `5 versos octosilabos con rima consonante variada (${patronConsonante}).`,
    };
  }

  if (total === 3 && todosCerca(11) && esTerceto(patronConsonante)) {
    return {
      tipoProbable: "terceto",
      confianza: 0.8,
      motivo: "3 versos endecasilabos con rima consonante.",
    };
  }

  if (total === 8 && todosCerca(11) && patronConsonante === "ABABABCC") {
    return {
      tipoProbable: "octava real",
      confianza: 0.9,
      motivo: "8 versos endecasilabos con rima ABABABCC.",
    };
  }

  if (total >= 3 && esElegia(versos, rima)) {
    return {
      tipoProbable: "elegia",
      confianza: 0.85,
      motivo: `${total} versos endecasilabos en tercetos encadenados (ABA BCB CDC...).`,
    };
  }

  if (liraAjustada) {
    return {
      tipoProbable: "lira",
      confianza: liraAjustada.confianza,
      motivo: liraAjustada.motivo,
      metrosAjustados: liraAjustada.metros,
      licenciasUsadas: liraAjustada.licencias,
    };
  }

  if (esMadrigal(metros, patronConsonante)) {
    return {
      tipoProbable: "madrigal",
      confianza: 0.75,
      motivo: `${total} versos heptasilabos y endecasilabos con rima consonante.`,
    };
  }

  if (total === 6 && todosCerca(8)) {
    return {
      tipoProbable: "sextilla",
      confianza: 0.6,
      motivo: "6 versos octosilabos. Patron de rima no coincide con formas especificas.",
    };
  }

  if (esSilva(metros, rima)) {
    return {
      tipoProbable: "silva",
      confianza: 0.7,
      motivo: `Mezcla de heptasilabos y endecasilabos con rima consonante libre.`,
    };
  }

  if (total >= 3 && todosExactos(11) && esRimaLibre(rima)) {
    return {
      tipoProbable: "endecasilabos sueltos",
      confianza: 0.65,
      motivo: `${total} versos endecasilabos sin rima consonante organizada.`,
    };
  }

  if (esVersoLibre(metros, rima)) {
    return {
      tipoProbable: "verso libre",
      confianza: 0.5,
      motivo: "Sin metro dominante claro ni patron de rima consistente.",
    };
  }

  return {
    tipoProbable: "no clasificado",
    confianza: 0.35,
    motivo: `Metro dominante ${metroDominante ?? "desconocido"} y patron de rima no coinciden con las formas basicas incluidas.`,
  };
}

function asonanciaEnPares(patron) {
  const pares = [];
  for (let i = 1; i < patron.length; i += 2) {
    if (patron[i] !== "-") pares.push(patron[i]);
  }
  return pares.length >= 2 && pares.every((letra) => letra === pares[0]);
}

function pareceRomance(patronAsonante) {
  return asonanciaEnPares(patronAsonante);
}

function esLira(metros, patronConsonante) {
  if (metros.length !== 5) return false;
  const esperado = [7, 11, 7, 7, 11];
  const coincide = metros.every((metro, i) => Math.abs(metro - esperado[i]) <= 1);
  if (!coincide) return false;
  const p = patronConsonante;
  if (p.length < 5) return false;
  if (p[0] === '-' || p[2] === '-' || p[0] !== p[2]) return false;
  if (p[1] === '-' || p[4] === '-' || p[1] !== p[4]) return false;
  if (p[0] === p[1]) return false;
  return true;
}

function analizarLiraConLicencias(versos, patronConsonante) {
  if (versos.length !== 5) return null;

  const esperado = [7, 11, 7, 7, 11];
  const ajuste = ajustarMetrosEsperados(versos, esperado);
  if (!ajuste) return null;

  const rima = evaluarRimaDeLira(patronConsonante);
  if (!rima.valida) return null;

  const conLicencias = ajuste.licencias.length > 0;
  const confianza = rima.estricta ? 0.85 : 0.78;
  const detalleLicencias = conLicencias
    ? ` ajustado mediante ${resumirLicencias(ajuste.licencias)}.`
    : ".";
  const detalleRima = rima.estricta
    ? "rima aBabB"
    : "rima de lira con segundo verso no enlazado por consonancia estricta";

  return {
    confianza: conLicencias ? confianza : Math.max(confianza, 0.85),
    motivo: `5 versos con patron metrico 7-11-7-7-11 y ${detalleRima}${detalleLicencias}`,
    metros: ajuste.metros,
    licencias: ajuste.licencias,
  };
}

function ajustarMetrosEsperados(versos, esperado) {
  const metros = [];
  const licencias = [];

  for (let i = 0; i < esperado.length; i++) {
    const verso = versos[i];
    const objetivo = esperado[i];
    if (verso.silabasPoeticas === objetivo) {
      metros.push(objetivo);
      continue;
    }

    const opcion = buscarLicenciaParaMetro(verso, objetivo);
    if (!opcion) return null;

    metros.push(opcion.silabasResultantes);
    licencias.push(describirLicenciaUsada(verso, opcion));
  }

  return { metros, licencias };
}

function buscarLicenciaParaMetro(verso, objetivo) {
  const diferencia = verso.silabasPoeticas - objetivo;
  if (diferencia === 0) return null;

  if (diferencia > 0) {
    const opciones = [
      ...proponerSineresis(verso, diferencia),
      ...proponerTrisinalefa(verso, diferencia),
    ];
    const sineresisSimples = opciones.filter((opcion) => opcion.tipo === "sineresis");
    opciones.unshift(...generarCombinacionesSineresis(verso, diferencia, sineresisSimples));
    return opciones.find((opcion) => opcion.silabasResultantes === objetivo) ?? null;
  }

  return proponerDialefa(verso, Math.abs(diferencia))
    .find((opcion) => opcion.silabasResultantes === objetivo) ?? null;
}

function describirLicenciaUsada(verso, opcion) {
  const licencia = {
    verso: verso.numero,
    tipo: opcion.tipo,
    silabasBase: verso.silabasPoeticas,
    silabasAjustadas: opcion.silabasResultantes,
    cambio: opcion.cambio,
  };

  if (opcion.entre?.palabras) licencia.entre = opcion.entre.palabras;
  if (opcion.palabra) licencia.palabra = opcion.palabra;
  if (opcion.versoCompleto) licencia.lectura = opcion.versoCompleto;

  return licencia;
}

function evaluarRimaDeLira(patronConsonante) {
  const p = patronConsonante;
  if (p.length < 5) return { valida: false, estricta: false };
  if (esLira([7, 11, 7, 7, 11], patronConsonante)) {
    return { valida: true, estricta: true };
  }

  const rimaPrimera = p[0] !== "-" && p[0] === p[2];
  const rimaFinal = p[3] !== "-" && p[3] === p[4];
  const gruposDistintos = p[0] !== p[3];
  if (!rimaPrimera || !rimaFinal || !gruposDistintos) {
    return { valida: false, estricta: false };
  }

  return {
    valida: true,
    estricta: p[1] !== "-" && p[1] === p[4],
  };
}

function resumirLicencias(licencias) {
  const conteos = new Map();
  for (const licencia of licencias) {
    conteos.set(licencia.tipo, (conteos.get(licencia.tipo) ?? 0) + 1);
  }

  return [...conteos.entries()]
    .map(([tipo, cantidad]) => cantidad === 1 ? tipo : `${cantidad} ${tipo}`)
    .join(" y ");
}

function esSoneto(patron) {
  if (patron.length < 14) return false;
  const arr = [...patron];
  // Primer cuarteto: versos 1-4 deben rimar (ABBA o ABAB)
  const c1 = arr.slice(0, 4);
  const cuarteto1 = (c1[0] !== '-' && c1[0] === c1[3] && c1[1] !== '-' && c1[1] === c1[2] && c1[0] !== c1[1]) ||  // ABBA
                    (c1[0] !== '-' && c1[0] === c1[2] && c1[1] !== '-' && c1[1] === c1[3] && c1[0] !== c1[1]);   // ABAB
  if (!cuarteto1) return false;
  // Segundo cuarteto: versos 5-8 deben tener rima organizada
  const c2 = arr.slice(4, 8);
  const cuarteto2 = c2.filter(c => c !== '-').length >= 3;
  if (!cuarteto2) return false;
  // Tercetos: versos 9-14 deben tener rima organizada
  const tercetos = arr.slice(8, 14);
  const t1Ok = tercetos.filter(c => c !== '-').length >= 4;
  return t1Ok;
}

function esTerceto(patronConsonante) {
  if (patronConsonante.length < 3) return false;
  const p = patronConsonante;
  if (p[0] === '-' || p[2] === '-') return false;
  if (p[0] !== p[2]) return false;
  return true;
}

function esRedondillas(patron) {
  for (let i = 0; i < patron.length; i += 4) {
    const bloque = patron.slice(i, i + 4);
    // Cada bloque de 4 debe ser ABBA
    if (bloque[0] === '-' || bloque[3] === '-') return false;
    if (bloque[0] !== bloque[3]) return false;
    if (bloque[1] === '-' || bloque[2] === '-') return false;
    if (bloque[1] !== bloque[2]) return false;
    if (bloque[0] === bloque[1]) return false;
  }
  return true;
}

// Quintilla: 5 versos octosilabos. Patrones validos:
// ababa, abaab, abbab, aabab, aabba (no mas de 2 versos seguidos con misma rima)
const QUINTILLA_PATRONES = new Set(["ABABA", "ABAAB", "ABBAB", "AABAB", "AABBA"]);

function esQuintilla(patronConsonante) {
  if (patronConsonante.length < 5) return false;
  const p = patronConsonante.slice(0, 5);
  if (p.includes("-")) return false;
  return QUINTILLA_PATRONES.has(p);
}

function esMadrigal(metros, patronConsonante) {
  // Madrigal: 6-15 versos, mezcla heptasílabos (7) y endecasílabos (11),
  // rima consonante sin versos sueltos
  if (metros.length < 6 || metros.length > 15) return false;
  const es7u11 = (m) => Math.abs(m - 7) <= 1 || Math.abs(m - 11) <= 1;
  if (!metros.every(es7u11)) return false;
  const hay7 = metros.some((m) => Math.abs(m - 7) <= 1);
  const hay11 = metros.some((m) => Math.abs(m - 11) <= 1);
  if (!hay7 || !hay11) return false;
  // Todos los versos deben rimar (no hay versos sueltos)
  if (patronConsonante.includes("-")) return false;
  return patronConsonante.length >= 6;
}

function esElegia(versos, rima) {
  const n = versos.length;
  if (n < 3) return false;

  // Todos los versos deben ser endecasílabos (10-12 sílabas poéticas)
  const todosEndecasilabos = versos.every((v) => Math.abs(v.silabasPoeticas - 11) <= 1);
  if (!todosEndecasilabos) return false;

  // Tercetos encadenados: el patrón de rima debe seguir ABA BCB CDC...
  const rimas = rima.versos.map((r) => r.consonante);
  const numTercetos = Math.floor(n / 3);

  for (let t = 0; t < numTercetos; t++) {
    const i = t * 3;
    // Versos 1° y 3° del terceto deben rimar entre sí
    if (rimas[i] && rimas[i + 2] && rimas[i] !== rimas[i + 2]) return false;
    // El 2° verso encadena con el 1° y 3° del terceto siguiente
    if (t < numTercetos - 1) {
      if (rimas[i + 1] && rimas[i + 3] && rimas[i + 1] !== rimas[i + 3]) return false;
    }
  }

  // Versos sobrantes (cierre): serventesio final o verso único
  const resto = n % 3;
  if (resto === 1) {
    // Verso final suelto: debe rimar con el 2° del último terceto
    if (rimas[n - 1] && rimas[numTercetos * 3 - 2] && rimas[n - 1] !== rimas[numTercetos * 3 - 2]) return false;
  } else if (resto === 2) {
    // Dos versos finales: deben formar pareado o rimar con la cadena
    if (rimas[n - 2] && rimas[n - 1] && rimas[n - 2] !== rimas[n - 1]) return false;
  }

  return true;
}

function esCopla(patronAsonante) {
  return patronAsonante.length >= 4 && asonanciaEnPares(patronAsonante);
}

function esSeguidilla(metros, patronAsonante) {
  if (metros.length !== 4) return false;
  const coincide = Math.abs(metros[0] - 7) <= 1 && Math.abs(metros[1] - 5) <= 1 && Math.abs(metros[2] - 7) <= 1 && Math.abs(metros[3] - 5) <= 1;
  return coincide && asonanciaEnPares(patronAsonante);
}

function esSilva(metros, rima) {
  const validos = metros.every((metro) => metro === 7 || metro === 11 || Math.abs(metro - 7) <= 1 || Math.abs(metro - 11) <= 1);
  if (!validos) return false;
  const hay7 = metros.some((metro) => Math.abs(metro - 7) <= 1);
  const hay11 = metros.some((metro) => Math.abs(metro - 11) <= 1);
  if (!hay7 || !hay11) return false;
  const consonantesRepetidas = rima.patronConsonante.replace(/-/g, "");
  return consonantesRepetidas.length >= 2;
}

function esRimaLibre(rima) {
  const consonante = rima.patronConsonante.replace(/-/g, "");
  const asonante = rima.patronAsonante.replace(/-/g, "");
  const letrasUnicasConsonante = new Set(consonante).size;
  const letrasUnicasAsonante = new Set(asonante).size;
  return letrasUnicasConsonante >= consonante.length * 0.7 && letrasUnicasAsonante >= asonante.length * 0.7;
}

function esVersoLibre(metros, rima) {
  if (metros.length < 3) return false;
  const unico = metros[0];
  const todosIguales = metros.every((metro) => Math.abs(metro - unico) <= 1);
  if (todosIguales) return false;
  const dominante = calcularMetroDominante(metros);
  if (dominante !== null) {
    const proporcion = metros.filter((metro) => Math.abs(metro - dominante) <= 1).length / metros.length;
    if (proporcion > 0.7) return false;
  }
  return esRimaLibre(rima);
}

// ── Nuevas herramientas ──────────────────────────────────────────────────────

/**
 * Analiza varios poemas separados por "---" en un solo texto.
 * @param {string} texto - Bloques de poemas separados por "---"
 * @returns {{ total: number, poemas: object[] }}
 */
export function escanearPoema(texto) {
  const bloques = String(texto ?? "")
    .split(/\n---\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (bloques.length === 0) {
    return { total: 0, poemas: [] };
  }

  const poemas = bloques.map((bloque, index) => {
    const analisis = analizarPoema(bloque);
    return {
      indice: index + 1,
      totalVersos: analisis.totalVersos,
      metroDominante: analisis.metroDominante,
      estructura: analisis.estructura.tipoProbable,
      rima: analisis.rima.tipoProbable,
    };
  });

  return {
    total: poemas.length,
    poemas,
  };
}

/**
 * Extrae la rima (consonante y asonante) de una palabra.
 * @param {string} palabra - Palabra a analizar
 * @returns {{ palabra: string, silabeo: string, tipoAcento: string, rima: { consonante: string, asonante: string } }}
 */
export function extraerRimaPalabra(palabra) {
  const depurada = depurarVerso(String(palabra ?? ""));
  if (!depurada) return { error: "Palabra vacia o invalida." };

  const silabeo = leerVerso(depurada);
  const silabeada = silabeo[0];
  if (!silabeada) return { error: "No se pudo silabear la palabra." };

  const limpia = silabeada.replaceAll("/", "");
  const acentoValor = determinaAcentoPalabra(silabeada);
  const tipoAcento = ACENTO_NOMBRES[String(acentoValor)] ?? "desconocido";

  const silabas = silabeada.split("/");
  const desplazamiento = acentoValor === 1 ? 1 : acentoValor === 0 ? 2 : 3;
  const indiceTonico = Math.max(0, silabas.length - desplazamiento);
  const silabaTonica = silabas[indiceTonico] ?? "";

  const VOCALES = new Set(["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú", "ü"]);
  const letras = [...silabaTonica];
  const inicioVocal = letras.findIndex((char) =>
    VOCALES.has(
      String(char)
        .toLowerCase()
        .replaceAll("á", "a")
        .replaceAll("é", "e")
        .replaceAll("í", "i")
        .replaceAll("ó", "o")
        .replaceAll("ú", "u")
        .replaceAll("ü", "u")
    )
  );

  const fragmento = `${silabaTonica.slice(inicioVocal === -1 ? 0 : inicioVocal)}${silabas.slice(indiceTonico + 1).join("")}`;
  const consonante = String(fragmento)
    .toLowerCase()
    .replaceAll("á", "a")
    .replaceAll("é", "e")
    .replaceAll("í", "i")
    .replaceAll("ó", "o")
    .replaceAll("ú", "u")
    .replaceAll("ü", "u")
    .replace(/y$/u, "i");

  const asonante = [...consonante].filter((c) => VOCALES.has(c)).join("");

  return {
    palabra: limpia,
    silabeo: silabeada,
    tipoAcento,
    silabas: silabas.length,
    silabaTonica: indiceTonico + 1,
    rima: { consonante, asonante },
  };
}

/**
 * Verifica si un poema cumple con un patrón métrico esperado.
 * @param {string} texto - Poema completo
 * @param {number[]} esperado - Arreglo con sílabas esperadas por verso
 * @returns {{ valido: boolean, motivo: string, metros: number[], esperado: number[], detalle: object[] }}
 */
export function validarMetrica(texto, esperado) {
  if (!Array.isArray(esperado) || esperado.length === 0) {
    return { valido: false, error: "Se requiere un arreglo de metros esperados." };
  }

  const analisis = analizarPoema(String(texto ?? ""));
  const metros = analisis.versos.map((v) => v.silabasPoeticas);

  if (metros.length !== esperado.length) {
    return {
      valido: false,
      motivo: `El poema tiene ${metros.length} versos pero se esperaban ${esperado.length}.`,
      metros,
      esperado,
    };
  }

  const coincidencias = metros.map((metro, i) => ({
    verso: i + 1,
    obtenido: metro,
    esperado: esperado[i],
    coincide: metro === esperado[i],
  }));

  const todosCoinciden = coincidencias.every((c) => c.coincide);

  return {
    valido: todosCoinciden,
    motivo: todosCoinciden
      ? "Todos los versos coinciden con el patron esperado."
      : `${coincidencias.filter((c) => !c.coincide).length} verso(s) no coinciden.`,
    metros,
    esperado,
    detalle: coincidencias,
  };
}

