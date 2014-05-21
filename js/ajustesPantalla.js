function CheckResolutionMobile() {
    var an = screen.width;
    var al = screen.height;
    var alto = $(window).height();
    var ancho = $(window).width();
    var alto_header = (60);
    var alto_footer = (65);
    var margenes = 15;
    alto_content = (alto - alto_header - alto_footer - (2 * margenes));
    $("#header_pedidos_emitidos").css('height', alto_header);
    $("#footer_comun").css('height', alto_footer);
    
    console.log("Ancho de la pantalla ancho " + an + "alto " + al);
    if (al >= 1080) { //FULL HD
        var alto = $(window).height();
        $('head').append('  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=high-dpi" charset="utf-8"/>');
        var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
        $('style').append('.k-grid tbody tr{height:50px; font-size:15px;}');
        
        localStorage["max_row_per_pag"] = Math.floor(alto_content / 35);
        localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 35) -4;
        localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 35) - 1); 
        console.log("alto disponible " + alto + "ancho disponible" + ancho);
        console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);
        /*console.log("NEXUS " + "alto " + al + "ancho " + an);
        var alto = $(window).height();
        $('head').append('  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=high-dpi" charset="utf-8"/>');
        var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
        localStorage["max_row_per_pag"] = Math.floor(alto_content / 20) - 1;
        localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 20) -6;
        localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 20) - 2); 
        console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);*/
    } else if (al >= 800) {
        console.log("GALAXY TAB 10 ");
        var alto = $(window).height();
        $('head').append('  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=medium-dpi" charset="utf-8"/>');
        var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
        $('style').append('.k-grid tbody tr{height:50px;}');
        localStorage["max_row_per_pag"] = Math.floor(alto_content / 50);
        localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 50) -4;
        localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 50) - 1); 
        console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);
    } else if (al >= 600) {
        console.log("Tablet despacho");
        var alto = $(window).height();
        $('head').append('  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=medium-dpi" charset="utf-8"/>');
        var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
        $('style').append('.k-grid tbody tr{height:50px;}');
        localStorage["max_row_per_pag"] = Math.floor(alto_content / 50);
        localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 50) -4;
        localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 50) - 1); 
        console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);
    } else if (al >= 480) {
        console.log("Galaxy S2");
        var alto = $(window).height();
        $('head').append('  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=high-dpi" charset="utf-8"/>');
        var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
        $('style').append('.k-grid tbody tr{height:50px;}');
        localStorage["max_row_per_pag"] = Math.floor(alto_content / 20) - 1;
        localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 20) -6;
        localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 20) - 2); 
        console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);
    } else {
        var alto = $(window).height();
        console.log("TABLET");
        $('head').append('  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=medium-dpi" charset="utf-8"/>');
        console.log("Resolucion " + alto);
        var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
        localStorage["max_row_per_pag"] = Math.floor(alto_content / 20) - 1; // tiene que ser 40
        localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 20) -4;
        localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 20) - 1); 
        console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);
    }
    console.log("ancho total mobil " + an);
	return 1;
}

function CheckResolutionPc() {
    var an = screen.width;
    var al = screen.height;
    var alto = $(window).height();
    var ancho = $(window).width();
    var alto_header = (60);
    var alto_footer = (65);
    var margenes = 15;
    alto_content = (alto - alto_header - alto_footer - (2 * margenes));
    $("#header_pedidos_emitidos").css('height', alto_header);
    $("#footer_comun").css('height', alto_footer);
    $('style').append('.k-grid tbody tr{height:50px;}');
    console.log("Ancho de la pantalla ancho " + an + "alto " + al);
    var alto = $(window).height();
    var max_reg_pag = $(window).height(); //Maximo numero de registros por pagina
    localStorage["max_row_per_pag"] = Math.floor(alto_content / 50);
    localStorage["pedidos_detalle_pag_max_row_min"] = Math.floor(alto_content / 50) -4 ;
    localStorage["pedidos_detalle_pag_max_row_max"] = Math.floor((alto_content / 50) -1 ); 

    console.log("Paginas por pantalla" + localStorage["max_row_per_pag"]);
}