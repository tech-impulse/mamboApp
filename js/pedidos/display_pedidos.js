// Contenedores generales según pantalla y nombre de pantalla ///////////////////
// Nombre del DIV 		// Nombre de la pantalla
// contenido_pedidos_emitidos es el contenido principal del modulo Pedidos
// emitidos						// pedidos
// detalle						// pedidosDetalle
// nuevo_centros			// nuevo_pedido
// nuevo_proveedores 	// nuevo_proveedores
// alta_pedidos				// alta_pedidos
// anterioresDetalle	// pedidosDetalleAnterior
// pedidosDetalleNuevo// pedidosDetalleNuevo
// insertarArticulos  // insertarArticulos
// pFiltroFamilias  // pFiltroFamilias
localStorage.setItem('seccion_title_emitidos', 'Pedidos Emitidos');
localStorage.setItem('seccion_title_detalle', 'Detalle de Pedidos');
localStorage.setItem('seccion_title_nuevo_centros', 'Nuevo Pedido');
localStorage.setItem('seccion_title_nuevo_proveedores', 'Nuevo Pedido');
localStorage.setItem('seccion_title_alta_pedidos', 'Alta de Pedido');
localStorage.setItem('seccion_title_anterioresDetalle', 'Alta de Pedido');
localStorage.setItem('seccion_title_pedidosDetalleNuevo', 'Detalle de Nuevo Pedido');
localStorage.setItem('seccion_title_pedido_plantillas', 'Plantillas');
localStorage.setItem('seccion_title_pedidos_cabecera', 'Cabecera de Pedido');
localStorage.getItem('seccion_title_pedidosDetalleNuevo');

function displayPedidosEmitidos() { // Pantalla de pedidos Emitidos
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
	if (localStorage['pantalla'] != "emitidos")
		$('#searchText').val("");
		
    localStorage['pantalla'] = "emitidos";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_emitidos'), 1);
    $('#emitidos').show();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", "", "");
}

function displayDetail(estado) // Pantalla con Alta Pedido, contiene Pedidos anteriores y Mis Plantillas
{
	if (localStorage['pantalla'] != "pedidosDetalle")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidosDetalle";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_detalle'), 1);
    $('#nuevo_centros').hide();
    $("#detalle").show();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    console.log("ESTADO " + estado);
    
    var estado = $("#txtEstadoPedido").text();
	if(estado==9 || estado==8 || DELETE_ORDER!="1") {
		 activate_buttons_footer("", localStorage["footer_btn_pedido_base"], "", "", ""); // NO TIENE PERMISOS PARA ELIMINAR
	}else if(estado==3){
		activate_buttons_footer("", "", "", "", ""); // PEDIDO ENVIANDO
	} else if(estado==4){
        activate_buttons_footer(localStorage["footer_btn_eliminar"], "", localStorage["footer_btn_modificar"], "", ""); // PEDIDO CON ERROR MODIFICAR?
    }else if(estado==7){
        activate_buttons_footer("", localStorage["footer_btn_pedido_base"], "", "", ""); // EMITIDO Y CONFIRMADO NO SE PUEDE ELIMINAR
    } else {
        console.log("ESTADO " + estado);
		 activate_buttons_footer(localStorage["footer_btn_eliminar"], localStorage["footer_btn_pedido_base"], "", "", "");
	}
    
   $('#emitidos').hide();
}


function displayNuevoPedido() // Pantalla Nuevo Pedido, contiene listado de Centros
{
	if (localStorage['pantalla'] != "nuevo_pedido")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "nuevo_pedido";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_nuevo_centros'), 1);
    $('#emitidos').hide();
    $("#detalle").hide();
    $('#nuevo_centros').show();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", "", "");
    
    console.log("PLANTILA 222222");
}

function displayProviders() // Pantalla Proveedores, contiene Proveedores Autorizados y Almacenes Autorizados
{
	if (localStorage['pantalla'] != "nuevo_proveedores")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "nuevo_proveedores";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_nuevo_proveedores'), 1);
    var nav1 = document.getElementById("pBtnlproveedores");
    var nav2 = document.getElementById("pBtnlalmacenes");
    nav1.setAttribute("class", "ui-link ui-btn ui-btn-active");
    nav2.setAttribute("class", "ui-link ui-btn ui-btn");
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').show();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#proveedores_autorizados').show();
    $('#almacenes_autorizados').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer(localStorage["footer_btn_pedido_escaner"], "", "", "", "");
}

function displayAlmacenes() // Pantalla Proveedores, contiene Proveedores Autorizados y Almacenes Autorizados
{
	if (localStorage['pantalla'] != "nuevo_almacenes")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "nuevo_almacenes";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_nuevo_proveedores'), 1);
    var nav1 = document.getElementById("pBtnlproveedores");
    var nav2 = document.getElementById("pBtnlalmacenes");
    nav1.setAttribute("class", "ui-link ui-btn ui-btn");
    nav2.setAttribute("class", "ui-link ui-btn ui-btn-active");
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').show();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#proveedores_autorizados').hide();
    $('#almacenes_autorizados').show();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    activate_buttons_footer(localStorage["footer_btn_pedido_escaner"], "", "", "", "");
    ajustarFooter(true);
}

function displayPedidosAnterioresNuevoPedido() // Pantalla con Alta Pedido, contiene Pedidos anteriores y Mis Plantillas
{
	if (localStorage['pantalla'] != "pedidoNuevoAnteriores")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidoNuevoAnteriores";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_alta_pedidos'), 1);
    var nav1 = document.getElementById("pBtnAnteriores");
    var nav2 = document.getElementById("pBtnlMisPlantillas");
    nav1.setAttribute("class", "ui-link ui-btn ui-btn-active");
    nav2.setAttribute("class", "ui-link ui-btn ui-btn");
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').show();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#anteriores').show();
    $('#plantillas').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer(localStorage["footer_btn_cancelar"], localStorage["footer_btn_nuevo_blanco"], "", "", "");
}

function displayPlantillasNuevoPedido() // Pantalla con Alta Pedido, contiene Pedidos anteriores y Mis Plantillas
{
    localStorage['pantallaAnterior']= "pedidoNuevoAnteriores";
	if (localStorage['pantalla'] != "pedidoNuevoPlantillas")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidoNuevoPlantillas";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_alta_pedidos'), 1);
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').show();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#anteriores').hide();
    $('#plantillas').show();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer(localStorage["footer_btn_cancelar"], localStorage["footer_btn_nuevo_blanco"], "", "", "");
}

function displayDetalleAnterior() // Contiene el detalle de un pedido anterior
{
	if (localStorage['pantalla'] != "pedidosDetalleAnterior")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidosDetalleAnterior";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_anterioresDetalle'), 1);    
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").show();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    
        var estado = $("#txtEstadoPedido").text();
	if(estado==9 || estado==8 || DELETE_ORDER!="1") {
		 activate_buttons_footer("", localStorage["footer_btn_pedido_base"], "", "", ""); // NO TIENE PERMISOS PARA ELIMINAR
	}else if(estado==3){
		activate_buttons_footer("", "", "", "", ""); // PEDIDO ENVIANDO
	} else if(estado==4){
        activate_buttons_footer(localStorage["footer_btn_eliminar"], "", localStorage["footer_btn_modificar"], "", ""); // PEDIDO CON ERROR MODIFICAR?
    }else if(estado==7){
        activate_buttons_footer("", localStorage["footer_btn_pedido_base"], "", "", ""); // EMITIDO Y CONFIRMADO NO SE PUEDE ELIMINAR
    } else {
		 activate_buttons_footer(localStorage["footer_btn_eliminar"], localStorage["footer_btn_pedido_base"], "", "", "");
	}


}

function displayDetalleNuevoPedido() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
	if (localStorage['pantalla'] != "pedidosDetalleNuevo")
		$('#searchText').val("");
	
    localStorage["plantillas"] = "";
    localStorage["pantalla"] = "pedidosDetalleNuevo";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosDetalleNuevo'), 1);
	
    $("#divInfoDetallePedido").show();
    $("#pFiltroProveedores").hide();

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#pGridPedidoDetMod').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').show();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    console.log("KAKA 11111");
    if (localStorage["pantalla_anterior"] != "pedidos_plantillas_detalle"){
    		console.log("ESTAMOS AQUI EN DISPLAY FOOTER NUEVO PEDIDO ");
        activate_buttons_footer(localStorage["footer_btn_guardar_plantilla"], localStorage["footer_btn_guardar_borrador"], localStorage["footer_btn_insertar_articulo"], localStorage["footer_btn_codigo_barras"], localStorage["footer_btn_finalizar"]);
    }else if (localStorage["pantalla_anterior"] == "pedidos_plantillas_detalle"){
    	activate_buttons_footer(localStorage["footer_btn_cancelar"], localStorage["footer_btn_guardar_borrador"], localStorage["footer_btn_insertar_articulo"], localStorage["footer_btn_codigo_barras"], localStorage["footer_btn_finalizar"]);
    }
    else{
        activate_buttons_footer(localStorage["footer_btn_cancelar"], "", localStorage["footer_btn_insertar_articulo"], localStorage["footer_btn_codigo_barras"], localStorage["footer_btn_guardar_plantilla"]);
		}
}

function displayDetalleNuevoPedidoMod() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
	if (localStorage['pantalla'] != "pedidosDetalleNuevo")
		$('#searchText').val("");
	
    localStorage["plantillas"] = "";
    localStorage["pantalla"] = "pedidosDetalleNuevo";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosDetalleNuevo'), 1);
	
    $("#divInfoDetallePedido").show();
    $("#pFiltroProveedores").hide();

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').show();
    $('#pGridNuevoPedido').hide();
    $('#pGridPedidoDetMod').show();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    console.log("KAKA 222");
        activate_buttons_footer(localStorage["footer_btn_cancelar"], localStorage["footer_btn_guardar_borrador"], localStorage["footer_btn_insertar_articulo"], localStorage["footer_btn_codigo_barras"], localStorage["footer_btn_finalizar"]);
    
}



function displayPedidosAyuda() 
{
	if (localStorage['pantalla'] != "pedidosAyuda")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidosAyuda";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);

    activate_buttons_header(1, localStorage.getItem('seccion_title_insertarArticulos'), 1);
    //ajustarFooter(true);
    //activate_buttons_footer(localStorage["footer_btn_cancelar"], localStorage["footer_btn_guardar_borrador"], localStorage["footer_btn_insertar_articulo"], "", "");
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').hide();
    //$('#pAyuda').show();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
}

function displayInsertarArticulos() 
{
	

	if (localStorage['pantalla'] != "insertarArticulos")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "insertarArticulos";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_insertarArticulos'), 1);

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').show();
    $('#pFiltroFamilias').show();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer(localStorage["footer_btn_finalizar_insercion"], "", "", "", "");
}

function displayFiltroFamilias() 
{
	if (localStorage['pantalla'] != "pFiltroFamilias")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pFiltroFamilias";
    console.log("--------------   FAMILIAS DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_filtroArticulos'), 1)
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').show();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer(localStorage["footer_btn_quitar_filtro"], localStorage["footer_btn_aplicar_filtro"], "", "", "");
}


////////////////////////////////////////////////////////////////////////////////
// PLANTILLAS

//Muestra todas las plantillas de un proveedor para nuevos pedidos
function displayNuevoPedidoPlantilla() 
{
	if (localStorage['pantalla'] != "pedidoNuevoPlantillas")
		$('#searchText').val("");

    localStorage["pantalla"] = "pedidoNuevoPlantillas";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, "", 1);

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').show();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", "", "");
    console.log("PLANTILA 11111111");
}


//Muestra el detalle de la plantilla en Nuevo Pedido de Plantilla
function displayPedidoPlantillasDetalle(estado) // Comun para detalle de plantilla Por Alta de Pedido o Menú Lateral
{
	if (localStorage['pantalla'] != "pedidos_plantillas_detalle")
		$('#searchText').val("");

    localStorage["pantalla"] = "pedidos_plantillas_detalle";

    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, "", 1);

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').show();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
		if(DELETE_TEMPLATE!="1") {
			activate_buttons_footer("", localStorage["footer_btn_pedido_base"], localStorage["footer_btn_modificar"], "", "");
		}else if(estado=="status_enviando.png"){
			activate_buttons_footer("", "", "", "", "");
		}
		else {
			activate_buttons_footer(localStorage["footer_btn_eliminar"], localStorage["footer_btn_pedido_base"], localStorage["footer_btn_modificar"], "", "");
		}


}


// Muestra todas las plantillas
function displayPedidoPlantillas() // Contiene el detalle de un pedido anterior
{
	if (localStorage['pantalla'] != "pedidos_plantillas")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidos_plantillas";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, "", 1);
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').show();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", "", "");
 
}

/*
// Muestra el detalle de una plantilla para el modulo de Plantillas
function displayPlantillasDetalle()
{
	localStorage["pantalla"]="pedidos_plantillas_detalle";
	console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
	activate_buttons_header(1 , "", 1);
	activate_buttons_footer(localStorage["footer_btn_eliminar"],"",localStorage["footer_btn_pedido_base"],"","");
	$('#emitidos').hide();
	$('#nuevo_centros').hide();
	$("#detalle").hide();
	$('#nuevo_proveedores').hide();
	$('#alta_pedidos').hide();
	$('#anterioresDetalle').hide();
	$('#pedidosDetalleNuevo').hide();
	$('#insertarArticulos').hide();
	$('#pFiltroFamilias').hide();
	$('#pCabeceraPedido').hide();
	$('#footer_comun').show();
	$('#pAyuda').hide();
	$('#pPlantillasDetalle').show();
	$('#pMostrarPlantillas').hide();
}
*/

// Muestra la cabecera para rellenar y enviar el nuevo pedido
function displayCabeceraPedido() 
{
	if (localStorage['pantalla'] != "pedidos_cabecera")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidos_cabecera";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);   
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidos_cabecera'), 0);
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').show();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true); // Activar/Desactivar Envio
    activate_buttons_footer(localStorage["footer_btn_cancelar"], localStorage["footer_btn_resumen"], localStorage["footer_btn_guardar_borrador"],"", localStorage["footer_btn_enviar"]);
   
}

function displayModificarPlantilla() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
    console.log("MODIFICAR PLANTILLA");
	if (localStorage['pantalla'] != "pedidosDetalleNuevo")
		$('#searchText').val("");
	
    localStorage["plantillas"] = "plantillas";
    localStorage["pantalla"] = "pedidosDetalleNuevo";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosModificacionPlantilla'), 1);
    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').show();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);

    activate_buttons_footer("", localStorage["footer_btn_guardar_plantilla"], localStorage["footer_btn_insertar_articulo"], localStorage["footer_btn_codigo_barras"], "");
   
}

function displayBorradores() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
	if (localStorage['pantalla'] != "pedidosBorradores")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "pedidosBorradores";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosBorradores'), 1);
  

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    //$('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').show();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", "", "");
}

function displayDetalleBorradores() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
	if (localStorage['pantalla'] != "borradoresDetalle")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "borradoresDetalle";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosDetalleBorradores'), 1);

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').show();
    ajustarFooter(true);
	if(DELETE_DRAFT!="1") {
    	activate_buttons_footer("", localStorage["footer_btn_modificar"], localStorage["footer_btn_finalizar"], "", "");
	}
	else {
		activate_buttons_footer(localStorage["footer_btn_eliminar"], localStorage["footer_btn_modificar"], localStorage["footer_btn_finalizar"], "", "");
	}
}

function displayNuevoPedidoEscaner() // Pantalla Nuevo Pedido, contiene listado de Centros
{
	if (localStorage['pantalla'] != "insertarPedidoEscaner")
		$('#searchText').val("");
	
    localStorage["pantalla"] = "insertarPedidoEscaner";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem(''), 1);
    $('#emitidos').hide();
    $("#detalle").hide();
    $('#nuevo_centros').hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').hide();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
    $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    $('#insertarArticulosEscaner').show();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", "", "");
    
}

function ajustarFooter(permiso) {
    var fboton1 = document.getElementById("divBoton1");
    var fboton2 = document.getElementById("divBoton2");
    var fboton3 = document.getElementById("divBoton3");
    var fboton4 = document.getElementById("divBoton4");
    var fboton5 = document.getElementById("divBoton5");
    var fdivBotones = document.getElementById("botonerafooter");
    var fdivPaginacion = document.getElementById("divPaginacionFooter");
    var fdivEstado = document.getElementById("divEstadoFooter");
    $('#divBoton1').show();
    $('#divBoton2').show();
    $('#divBoton3').show();
    $('#divBoton4').show();
    $('#divBoton5').show();
    fdivBotones.setAttribute("style", "width:67%");
    fdivPaginacion.setAttribute("style", "width:23%");
    fdivEstado.setAttribute("style", "width:9%");

    var pantalla = localStorage["pantalla"];
    switch (pantalla) {
    case "pedidosDetalle": // ELiminar -- Seleccionar como Pedido Base
        if (permiso == false) {
            $('#divBoton1').hide();
        }
        break;

    case "pedidos_plantillas_detalle":
    	$('#divBoton1').hide(); // Cancelar Oculto
        break;

	case "pedidosDetalleNuevo":
        //$('#divBoton1').hide(); // Cancelar Oculto
        break;

    case "pedidos_cabecera":
        $('#divBoton1').hide(); // Cancelar Oculto
        if (permiso == false) {
            console.log("Sin permisos para Enviar");
            $('#divBoton5').hide(); // Desactivar Botón Enviar
        }
        break;

    case "pedidoNuevoAnteriores":
        $('#divBoton1').hide();
        break; 

    case "pedidoNuevoPlantillas":
        $('#divBoton1').hide();
        break; 
    }
}


function pDisplayNotificaciones (tipo0, tipo1, tipo2, errores ) {
  console.log("DISPLAY NOTIFICACIONES");

    if (tipo0==0) { 
      $('#pNotificacionesTxtPedidos').hide();
      $('#pNotificacionesTablaPedidos').hide();
    } else {
    	$('#pNotificacionesTxtPedidos').show();
      $('#pNotificacionesTablaPedidos').show();
    }
    
    if (errores > 0 ) {
    	$('#pNotificacionesTxtPedidosErrores').show();
      $('#pNotificacionesTablaPedidosErrores').show();
    	
    } else {
    	$('#pNotificacionesTxtPedidosErrores').hide();
      $('#pNotificacionesTablaPedidosErrores').hide();
    }
    
    if ( tipo1==0) { 
      $('#pNotificacionesTxtPlantillas').hide();
      $('#pNotificacionesTablaPlantillas').hide();
    } else {
    	$('#pNotificacionesTxtPlantillas').show();
      $('#pNotificacionesTablaPlantillas').show();
    }
    
    if ( tipo2==0) { 
      $('#pNotificacionesTxtBorradores').hide();
      $('#pNotificacionesTablaBorradores').hide();
    } else {
    	$('#pNotificacionesTxtBorradores').show();
      $('#pNotificacionesTablaBorradores').show();
    }
    
    if (tipo0+tipo1+tipo2+errores > 0) {
       $('#pNotificacionesTxtNinguna').hide();
    } else {
    	 $('#pNotificacionesTxtNinguna').show();
    }
    $( "#pNotificacionesPopup" ).popup( "open");

}

function displayDetalleNuevoPedidoEscaner() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
	if (localStorage['pantalla'] != "pedidosDetalleNuevoEscaner")
		$('#searchText').val("");
	
    localStorage["plantillas"] = "";
    localStorage["pantalla"] = "pedidosDetalleNuevoEscaner";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosDetalleNuevo'), 1);
  

    $("#divInfoDetallePedido").hide();
    $("#pFiltroProveedores").show();


    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').show();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("","", "" , localStorage["footer_btn_codigo_barras"], localStorage["footer_btn_finalizar"]);
}

function displayResumenNuevoPedido() // Pantalla que contiene los articulos del nuevo pedido y botones para añadirlos.
{
	if (localStorage['pantalla'] != "pedidosDetalleNuevo")
		$('#searchText').val("");
	
    localStorage["plantillas"] = "";
    localStorage["pantalla"] = "pedidosResumenNuevoPedido";
    console.log("--------------   DISPLAY ACTUAL  ------------------ " + localStorage["pantalla"]);
    activate_buttons_header(1, localStorage.getItem('seccion_title_pedidosDetalleNuevo'), 1);
    $("#divInfoDetallePedido").show();
    $("#pFiltroProveedores").hide();

    $('#emitidos').hide();
    $('#nuevo_centros').hide();
    $("#detalle").hide();
    $('#nuevo_proveedores').hide();
    $('#alta_pedidos').hide();
    $('#anterioresDetalle').hide();
    $('#pedidosDetalleNuevo').show();
    $('#insertarArticulos').hide();
    $('#pFiltroFamilias').hide();
    $('#pCabeceraPedido').hide();
    $('#footer_comun').show();
   // $('#pAyuda').hide();
    $('#pPlantillasDetalle').hide();
    $('#pMostrarPlantillas').hide();
    $('#pMostrarBorradores').hide();
    $('#pBorradoresDetalle').hide();
    ajustarFooter(true);
    activate_buttons_footer("", "", "", localStorage["footer_btn_modificar"], localStorage["footer_btn_finalizar"]);
}

var lastTapTime;
function isJqmGhostClick(event) {
    var currTapTime = new Date().getTime();
   
    if(lastTapTime == null || currTapTime > (lastTapTime + 800)) {
        lastTapTime = currTapTime;
        return false;
    }
    else {
        return true;
    }
}
