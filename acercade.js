$(document).ready(function (e) {
    obtenerTamanoPantalla();
    

});

function obtenerTamanoPantalla() {
    let ancho = screen.width;
    let alto = screen.height;
    alto = 1 * alto;
    ancho = 1 * ancho;
    $("body").css("height", alto + "px");
  /*  $("body").css("width", ancho + "px");
    $("img").css("height", alto/12.1 + "px");
    $("img").css("width", ancho/9.2 + "px"); 
    

    if (ancho <= 720) {
        $("p").css("font-size","30px");
        $("#a1Acerca").css("font-size","18px"); 
        $("#cabeceraAcerca").css("gap","8px");
   
    } else if (ancho > 720 && ancho <=1080 ){
        $("p").css("font-size","40px");
        $("#a1Acerca").css("font-size","20px"); 
        $("#cabeceraAcerca").css("gap","15px");
    }else{
        $("p").css("font-size","60px");
        $("#a1Acerca").css("font-size","30px"); 
        $("#cabeceraAcerca").css("gap","30px");
    }*/
    
}