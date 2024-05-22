document.addEventListener("DOMContentLoaded", function () {
  // obtenerTamanoPantalla();

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
let tamanoInicialVentana = "15vh";
let ampliar = true;

function limpiar() {
  // limpia todo
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
  let ancho = screen.width;
  let alto = screen.height;
  alto = 1 * alto;
  ancho = 1 * ancho;
  body.css("height", alto + "px");
}

// Este es el programa principal
function principal() {
  let arrSilOrto = [""];
  let arrVerOrto = [""];
  let arrSilPoe = [""];
  let arrVerPoe = [""];
  let arrOrto = [""];
  let arrPoe = [""];
  let cadenaVacios = " ";

  let numVacios = 0;
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
function determinaAcentoPalabra(pal) {
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
}

function depurarVerso(fila) {
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
}

function segundo(filas) {
  let fila = filas; //codigo nuevo
  let wordsVerso = [""];
  let versoConS = [""];
  let sinalefaa = [""];
  let trisinalefaa = [""];
  let versoSalida = [""];
  sinalefaaExterior = false;

  let largo;
  let verso = "";

  /* let s = ("#intext1").val();
     //obtiene el verso y elimina blancos al inició o/y al final.
     verso = s;
     verso = s.trim();*/
  let s = depurarVerso(fila);
  verso = s;
  versoCopia = verso; //Se crea una copia del verso inicial

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
      if (sinalefaa == true) {
        versoSalida[0] = versoSalida[0].concat("~");
      } else {
      }
    }
  }

  for (let i = 0; i < versoSalida.length; i++) {
    versoSalida[i] = versoSalida[i].replace(/(~)+/, "~");
  }

  return versoSalida;
}

function contarSilabasOrtografico(arreglo, caracter) {
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

function contarSilabasPoetico(v) {
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
  versoCopia = verso; //Se crea una copia del verso inicial

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

function extraeVocales(p, d) {
  let palabra = p;
  let palabraCopia = p;
  let largoPalabra = p.length;
  let indPalabra = "";
  let secVocales = "";
  let direccion = d;
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];

  //corregir igriega (y) si esta despues de vocal cambiar por "i"
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

//Determina si es vocal, "y", consonante o "h" el caracter (en minuscula) en turno
//recibe un caracter y devuelve un caracter indicador
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

//método preliminar que separa en silabas una palabra. Recibe una cadena

function separaPalabra(mipalabra) {
  let vocales = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"];
  let especiales_h = ["c"];
  let especiales_r = ["b", "c", "d", "f", "g", "p", "t", "k", "r"]; //posibles combinaciones seguidas de r
  let especiales_l = ["b", "c", "d", "f", "g", "p", "t", "k", "l"]; //posibles combinaciones seguidas de l

  let pdt = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  let secuencia = "";
  let cad1 = "vccccv";
  let cad2 = "vcccv";
  let cad3 = "vccv";
  let cad4 = "vcv";
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

  let ind = -1;
  let ind2 = 0;
  let indDC = 30;
  let i = 0;
  let i_h = 0;
  let ii = 0;
  let j = 0;
  let m = 0;
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

  //Arreglo para almacenar temporalmente los carateres de la palabra en un arreglo
  i = 0;
  for (i = 0; i < cadena.length; i++) {
    vt[i] = cadena.slice(i, i + 1);
  }

  i = 0;
  while (i < cadena.length) {
    //examina caracter por caracter de la palabra
    temp = cadena.slice(i, i + 1); //extrae caracter

    //Determina si el caracter actual es vocal o consonante, si es consonante determina
    //si es consonante especial (r,l o h) en cuyo caso verifica si forma doble consonante
    //(cr, pr, rr, ch, etc) y finalmente determina la secuencia de la palabra.
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

    //Si no es vocal determina si el caracter actual es r,l o h y si el anterior es especial
    if (esvocal == false) {
      if (!(temp == "h")) {
        secuencia = secuencia.concat("c");
      }

      //Determina si el caracter actual es r
      if (temp == "r") {
        esr = true;
      } else {
        esr = false;
      }

      //Determina si el caracter actual es l
      if (temp == "l") {
        esl = true;
      } else {
        esl = false;
      }

      //Determina si el caracter actual es h
      if (temp == "h") {
        esh = true;
      } else {
        esh = false;
      }

      // verifica si caracter anterior es consonante o h en cada uno de los casos especiales(r,l o h);
      // siempre y cuando no sea el primer carater de la palabra
      if (esr && i != 0) {
        //si el caracter actual es r, verifica si el caracter anterior es especial
        j = 0;
        for (j = 0; j < largo_r; j++) {
          if (vt[i - 1] == especiales_r[j]) {
            ante_r = true;
            indDC = i;
            j = largo_r;
          } else {
            ante_r = false;
          }
        }
      }

      if (esl && i != 0) {
        //si el caracter actual es l, verifica si el caracter anterior es especial
        j = 0;
        for (j = 0; j < largo_l; j++) {
          if (vt[i - 1] == especiales_l[j]) {
            ante_l = true;
            indDC = i;
            j = largo_l;
          } else {
            ante_l = false;
          }
        }
      }

      if (esh && i == 0) {
        secuencia = secuencia.concat("c");
      }

      if (esh && i != 0) {
        //si el caracter actual es h, verifica si el caracter anterior es especial o vocal
        j = 0;
        for (j = 0; j < largo_h; j++) {
          if (vt[i - 1] == especiales_h[j]) {
            ante_h = true;
            secuencia = secuencia.concat("c");
            j = largo_h;
          } else {
            ante_h = false;
          }
        }
        for (j = 0; j < nvocales; j++) {
          if (vt[i - 1] == vocales[j]) {
            ante_v = true;
            secuencia = secuencia.concat("v");
            j = nvocales;
          } else {
            ante_v = false;
          }
        }
        if (!ante_v && !ante_h) {
          secuencia = secuencia.concat("c");
        }
      }
    }

    //
    //busca secuenciaPatron en la secuencia actual de la palabra y determina posicion de inicio
    //si la encuentra
    if (secuencia.substring(ind2).includes(cad1)) {
      vccccv = true;
      ind = secuencia.indexOf(cad1, ind2);
      if (ante_v) {
        ante_v = false;
      }
    } else {
      vccccv = false;
    }

    if (secuencia.substring(ind2).includes(cad2)) {
      vcccv = true;
      ind = secuencia.indexOf(cad2, ind2);
      if (ante_v) {
        ante_v = false;
      }
    } else {
      vcccv = false;
    }

    if (secuencia.substring(ind2).includes(cad3)) {
      vccv = true;
      ind = secuencia.indexOf(cad3, ind2);
      if (ante_v) {
        ante_v = false;
      }
    } else {
      vccv = false;
    }

    if (secuencia.substring(ind2).includes(cad4)) {
      vcv = true;
      ind = secuencia.indexOf(cad4, ind2);
      if (ante_v) {
        ante_v = false;
      }
    } else {
      vcv = false;
    }
    //genera corte de silaba
    //analiza condicion vccccv
    if (vccccv) {
      //        if (ante_v == false) {
      //en caso de doble consonante
      if ((ante_r || ante_l || ante_h) && ind < indDC) {
        for (n = ind2; n < ind + 3; n++) {
          pdt[m] = pdt[m] + vt[n];
          ante_r = false;
          ante_l = false;
          ante_h = false;
        }
        ind2 = ind + 3;
      } else {
        //sin doble consonante
        for (n = ind2; n < ind + 3; n++) {
          pdt[m] = pdt[m] + vt[n];
        }
        ind2 = ind + 3;
      }
      m++;
      //    } else {
      //        let largoSecuencia = secuencia.length;
      //        secuencia = secuencia.slice(0, largoSecuencia - 1);
      //   }
    }
    //caso 2: analiza condicion VCCCV
    if (vcccv) {
      if ((ante_r || ante_l || ante_h) && ind < indDC) {
        for (n = ind2; n < ind + 2; n++) {
          pdt[m] = pdt[m] + vt[n];
          ante_r = false;
          ante_l = false;
          ante_h = false;
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

    //caso 3: analiza condicion VCCV:
    if (vccv) {
      if ((ante_r || ante_l || ante_h) && ind < indDC) {
        for (n = ind2; n < ind + 1; n++) {
          pdt[m] = pdt[m] + vt[n];
          ante_r = false;
          ante_l = false;
          ante_h = false;
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

    //caso 4: analiza condicion VCV
    if (vcv) {
      for (n = ind2; n < ind + 1; n++) {
        pdt[m] = pdt[m] + vt[n];
      }
      ind2 = ind + 1;
      m++;
    }

    i++;
  }

  for (n = ind2; n < cadena.length; n++) {
    pdt[m] = pdt[m] + vt[n];
  }

  let nuevo = this.nuevoArreglo(pdt);

  return nuevo;
}

//Crea un nuevo arreglo con el tamaño justo del número de sílabas,eliminando espacios en blanco.
function nuevoArreglo(a) {
  //Determina el número de silabas, que sería igual al largo del arreglo nuevo
  let j = 0;
  let i = 0;
  let numNuevo = 0;

  out = [];
  out = a;
  for (i = 0; i < out.length; i++) {
    if (!(out[i] == " " || out[i] == "")) {
      numNuevo++;
    }
  }
  //transfiere las silabas al nuevo arreglo
  nuevo = [numNuevo];
  i = 0;
  for (j = 0; j < out.length; j++) {
    if (!(out[j] == " " || out[j] == "")) {
      nuevo[i] = out[j];
      i++;
    }
  }
  return nuevo;
}

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
          caso = this.tresVocales(iin[n].substring(ind, ind + 3));
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

  let nuevo = this.nuevoArreglo(oout);
  return nuevo;
}

//Determina el caso correspondiente a tres vocales seguidas
function tresVocales(t) {
  let trip = t;
  let trip1 = t;
  let caso = 0;
  if (trip.match("h"));
  {
    trip = trip.replace(/h/, "");
  }
  if (!(trip == "uie" || trip == "uia")) {
    trip = trip.replaceAll("á", "F");
    trip = trip.replaceAll("é", "F");
    trip = trip.replaceAll("ó", "F");
    trip = trip.replaceAll("í", "F");
    trip = trip.replaceAll("ú", "F");
    trip = trip.replaceAll("a", "F");
    trip = trip.replaceAll("e", "F");
    trip = trip.replaceAll("o", "F");
    trip = trip.replaceAll("i", "d");
    trip = trip.replaceAll("u", "d");

    trip1 = trip1.replaceAll("á", "F");
    trip1 = trip1.replaceAll("é", "F");
    trip1 = trip1.replaceAll("ó", "F");
    trip1 = trip1.replaceAll("í", "f");
    trip1 = trip1.replaceAll("ú", "f");
    trip1 = trip1.replaceAll("a", "F");
    trip1 = trip1.replaceAll("e", "F");
    trip1 = trip1.replaceAll("o", "F");
    trip1 = trip1.replaceAll("i", "d");
    trip1 = trip1.replaceAll("u", "d");

    if (trip == "FFF") {
      caso = 1;
    }

    if (trip == "FFd" || trip == "FdF" || trip == "Fdd" || trip == "ddF") {
      caso = 2;
    }

    if (trip == "dFF") {
      if (trip1 == "dfF") {
        caso = 4;
      } else {
        caso = 3;
      }
    }
  }

  return caso;
}

//recibe arreglo y devuelve arreglo
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
        if (this.hiato(iin[n].substring(ind, ind + 2))) {
          oout[2 * n] = iin[n].substring(ind2, ind + 1);
          oout[n * 2 + 1] = iin[n].substring(ind + 1);
        }
        i = iin[n].length;
      }
      //caso 2: análiza vhv
      if (vhv) {
        if (this.hiato(iin[n].substring(ind, ind + 3))) {
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

  let nuevo = this.nuevoArreglo(oout);
  return nuevo;
}

//recibe cadena y devuelve boolean
function hiato(s) {
  let dip = s;
  let b;
  if (dip.match("h"));
  {
    dip = dip.replace("h", "");
  }
  dip = dip.replaceAll("á", "a");
  dip = dip.replaceAll("é", "e");
  dip = dip.replaceAll("ó", "o");

  b =
    dip == "aa" ||
    dip == "ee" ||
    dip == "oo" ||
    dip == "ii" ||
    dip == "uu" ||
    dip == "ae" ||
    dip == "ea" ||
    dip == "ao" ||
    dip == "oa" ||
    dip == "eo" ||
    dip == "oe" ||
    dip == "aí" ||
    dip == "aú" ||
    dip == "eí" ||
    dip == "eú" ||
    dip == "oí" ||
    dip == "oú" ||
    dip == "ía" ||
    dip == "úa" ||
    dip == "íe" ||
    dip == "úe" ||
    dip == "ío" ||
    dip == "úe";

  return b;
}

//recibe cadena y regresa arreglo. Determina si hay diptongo cuatro vocales

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
        let caso = this.cuatroVocales(secvocales);

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
    let nuevo = this.nuevoArreglo(oout);
  } else {
  }

  return nuevo;
}

//recibe cadena y regresa numero de caso
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
// determina si hay sinalefa dos palabras, caso dos vocales
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

//determina si hay sinalefa con tres vocales y tres palabras.
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
