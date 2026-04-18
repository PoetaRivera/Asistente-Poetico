


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

// Este es el programa principal
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

// lee versos de entrada y guarda cada verso en cada elmento del arreglo lineas
function leerFila() {
  const intext1 = document.getElementById("intext1");
  let s = intext1.value;
  let verso = s;
  let lineas = verso.split("\n"); //separa
  lineas = lineas.filter((element) => element != ""); //elimina elementos vacios ""
  return lineas;
}


//Determina si una palabra es aguda, llana o esdrújula
// Devuelve 1 si es aguda, 0 si es llana y -1 si es esdrujula.
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
function depurarVerso(fila) {
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

//recibe una cadena(verso) y devuelve un arreglo donde cada palabra se almacena en una
//posicion separada en silabas por el caracter "/"
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
function extraeVocales(p, d) {
  let palabra = p;
  let palabraCopia = p;
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
        palabraCopia = "i";
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
        /*  //salida del for j*/
      }
    } //salida del if ==y
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
 * Invierte una cadena carácter a carácter.
 * Entrada : string (sílaba o palabra)
 * Salida  : string invertido
 *
 * Se usa para analizar el final de una palabra (última sílaba, última vocal)
 * leyendo desde el inicio del string invertido en lugar del final del original.
 * Ejemplo: "amor" → "roma"
 */
function invertirPalabra(p) {
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
function vCH(s) {
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
function separaPalabra(mipalabra) {
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

//Crea un nuevo arreglo con el tamaño justo del número de sílabas,eliminando espacios en blanco.
/**
 * Compacta un arreglo eliminando posiciones vacías o con espacios en blanco.
 * Entrada : arreglo con sílabas y posiciones vacías ("" o " ") intercaladas
 * Salida  : arreglo nuevo con exactamente las sílabas válidas, sin huecos
 *
 * Las funciones de silabeo (triptongoSilaba, hiatoSilaba, cuatroSilaba)
 * trabajan con arreglos sobredimensionados que dejan espacios vacíos al
 * reorganizar sílabas. Esta función los limpia al final de cada paso.
 * Ejemplo: ["ca", "", "sa", " ", ""] → ["ca", "sa"]
 */
function nuevoArreglo(a) {
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
function triptongoSilaba(a) {
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
function tresVocales(t) {
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
function hiatoSilaba(a) {
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
function hiato(s) {
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
function cuatroSilaba(a) {
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
function cuatroVocales(t) {
  let trip = t;
  let caso = 0;
  if (trip.match("h"));
  {
    trip = trip.replace("h", "");
  }
  trip = trip.replaceAll("á", "F");
  trip = trip.replaceAll("é", "F");
  trip = trip.replaceAll("ó", "F");
  trip = trip.replaceAll("í", "f");
  trip = trip.replaceAll("ú", "f");
  trip = trip.replaceAll("a", "F");
  trip = trip.replaceAll("e", "F");
  trip = trip.replaceAll("o", "F");
  trip = trip.replaceAll("i", "d");
  trip = trip.replaceAll("u", "d");

  if (trip == "dFFd") {
    caso = 1;
  }

  if (trip == "dfFd") {
    caso = 2;
  }

  if (trip == "dFfF") {
    caso = 3;
  }

  if (trip == "FFFd") {
    caso = 4;
  }

  if (trip == "FfFd") {
    caso = 5;
  }

  if (trip == "FFFF") {
    caso = 6;
  }

  if (trip == "FFfF") {
    caso = 7;
  }

  if (trip == "FdFF") {
    caso = 8;
  }

  if (trip == "FdfF") {
    caso = 9;
  }

  if (trip == "FFdf") {
    caso = 10;
  }

  if (trip == "FFdd") {
    caso = 11;
  }

  if (trip == "FdFd") {
    caso = 12;
  }

  if (trip == "FddF") {
    caso = 13;
  }

  if (trip == "dFdF") {
    caso = 14;
  }

  if (trip == "ddFd") {
    caso = 15;
  }
  return caso;
}
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
function sinalefa(v) {
  let sina = false;
  let sina1 = false;
  let sina2 = false;
  let sina3 = false;
  let sina4 = false;
  let vocales;
  vocales = v;

  // Fuerte debil
  let caso1 = [
    "ao",
    "ae",
    "au",
    "ai",
    "ay",
    "oe",
    "ou",
    "oi",
    "oy",
    "eu",
    "ei",
    "ey",
    "ui",
    "uy",
    "áo",
    "áe",
    "áu",
    "ái",
    "áy",
    "óe",
    "óu",
    "ói",
    "óy",
    "éu",
    "éi",
    "éy",
    "úi",
    "úy",
  ];
  // Debil fuerte
  let caso2 = [
    "ia",
    "ya",
    "ie",
    "ye",
    "io",
    "yo",
    "iu",
    "yu",
    "ua",
    "ue",
    "uo",
    "ea",
    "eo",
    "oa",
    "oe",
    "iá",
    "yá",
    "ié",
    "yé",
    "ió",
    "yó",
    "iú",
    "yú",
    "uá",
    "ué",
    "uó",
    "eá",
    "eó",
    "oá",
  ];
  // Vocales iguales
  let caso3 = [
    "aa",
    "ee",
    "ii",
    "yy",
    "oo",
    "uu",
    "aá",
    "eé",
    "ií",
    "oó",
    "uú",
    "áa",
    "ée",
    "íi",
    "óo",
    "úu",
  ];

  let caso4 = [
    "ía",
    "íe",
    "ío",
    "íu",
    "íy",
    "úá",
    "úé",
    "úó",
    "úy",
    "éa",
    "éo",
    "éy",
    "óa",
    "óy",
    "aí",
    "eí",
    "oí",
    "uí",
    "yí",
    "aú",
    "eú",
    "oú",
    "yú",
    "aé",
    "oé",
    "yé",
    "aó",
    "yó",
  ];

  for (let i = 0; i < caso1.length; i++) {
    if (vocales == caso1[i]) {
      sina1 = true;
      i = caso1.length;
    } else {
      sina1 = false;
    }
  }

  for (let i = 0; i < caso2.length; i++) {
    if (vocales == caso2[i]) {
      sina2 = true;
      i = caso2.length;
    } else {
      sina2 = false;
    }
  }

  for (let i = 0; i < caso3.length; i++) {
    if (vocales == caso3[i]) {
      sina3 = true;
      i = caso3.length;
    } else {
      sina3 = false;
    }
  }

  for (let i = 0; i < caso4.length; i++) {
    if (vocales == caso4[i]) {
      sina4 = true;
      i = caso4.length;
    } else {
      sina4 = false;
    }
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
 *
 * Ejemplo que NO forma trisinalefa: vocal muy abierta flanqueada por cerradas
 * donde el ritmo obligaría a dos golpes de voz.
 */
function triSinalefa(s) {
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
    if (vocales[i] == "a") {
      numeros[i] = 5;
    }
    if (vocales[i] == "á") {
      numeros[i] = 5;
    }
    if (vocales[i] == "o") {
      numeros[i] = 4;
    }
    if (vocales[i] == "ó") {
      numeros[i] = 4;
    }
    if (vocales[i] == "e") {
      numeros[i] = 3;
    }
    if (vocales[i] == "é") {
      numeros[i] = 3;
    }
    if (vocales[i] == "u") {
      numeros[i] = 2;
    }
    if (vocales[i] == "ú") {
      numeros[i] = 2;
    }
    if (vocales[i] == "i") {
      numeros[i] = 1;
    }
    if (vocales[i] == "í") {
      numeros[i] = 1;
    }
    if (vocales[i] == "y") {
      numeros[i] = 1;
    }
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
