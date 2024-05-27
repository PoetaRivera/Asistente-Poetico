export function limpiar(tamanoInicialVentana) {
  // limpia los textarea y deshabilita el boton limpiar
 
const elementos = [
  document.getElementById("intext1"),
  document.getElementById("outtext1"),
  document.getElementById("outtext2"),
  document.getElementById("outtext3"),
  document.getElementById("outtext4")
];

const boton3 = document.getElementById("boton3");
boton3.disabled = true;

elementos.forEach(elemento => {
  elemento.value = "";
  elemento.style.height = tamanoInicialVentana;
});

 
}
