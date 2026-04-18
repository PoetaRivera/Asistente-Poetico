import { principal, limpiar, ampliarVentanas } from "./ui.js";

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
  boton3.disabled = true;
  boton1.addEventListener("click", principal);
  boton2.addEventListener("click", limpiar);
  boton3.addEventListener("click", ampliarVentanas);

  intext1.addEventListener("scroll", () => {
    let y = intext1.scrollTop;
    intext1.scrollTo(0, y);
  });
  outtext1.addEventListener("scroll", () => {
    let y = outtext1.scrollTop;
    outtext2.scrollTo(0, y);
  });
  outtext2.addEventListener("scroll", () => {
    let y = outtext2.scrollTop;
    outtext1.scrollTo(0, y);
  });
  outtext3.addEventListener("scroll", () => {
    let y = outtext3.scrollTop;
    outtext4.scrollTo(0, y);
  });
  outtext4.addEventListener("scroll", () => {
    let y = outtext4.scrollTop;
    outtext3.scrollTo(0, y);
  });
});
