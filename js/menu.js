
/*
Si boton1,2,3 es diferente de vacio se activara con el nombre indicado.
Si nPag es mayor que 0 se activara el apartado de paginacion.
*/
function activate_buttons_footer(boton1, boton2, boton3,boton4,boton5) {
	
	//console.log("MENU CABECERA Inicio"); 
	
	var pag_act=0;
	var pag_last=0;
	var mr=0;
	if (localStorage["pantalla"] == "emitidos") // Mostramos el icono de refrescar de agua
	{
		$('#pCargaDatos').show();
	}
	else
	$('#pCargaDatos').hide();
	
	// Recogemos los valores almacenados para cada pantalla
	if (localStorage["pantalla"]=="emitidos" || localStorage["pantalla"]=="pedidoNuevoAnteriores" || localStorage["pantalla"]=="insertarArticulos" || localStorage["pantalla"]=="pedidos_plantillas" || localStorage["pantalla"]=="pedidosBorradores" || localStorage["pantalla"]=="nuevo_proveedores" || localStorage["pantalla"]=="nuevo_pedido" ) {

		pag_act=localStorage["pedidos_pag_act"];
		pag_last=localStorage["pedidos_pag_last"];
		mr=localStorage["pedidos_pag_max_row"];
        
        console.log("PAGINACION REFRESCO 222222 PEDIDOS " + localStorage["pedidos_pag_act"] +" "+   localStorage["pedidos_pag_max_row"] + " "  +localStorage["pedidos_pag_last"] );
            
		
	} else if (localStorage["pantalla"]=="pedidosDetalle" || localStorage["pantalla"]=="pedidosDetalleAnterior" || localStorage["pantalla"]=="pedidosDetalleNuevo" || localStorage["pantalla"]=="pedidos_plantillas_detalle" || localStorage["pantalla"]=="borradoresDetalle" || localStorage["pantalla"]=="pedidosDetalleNuevoEscaner" || localStorage["pantalla"]=="pedidosResumenNuevoPedido") {
	
		pag_act=localStorage["pedidos_detalle_pag_act"];
		pag_last=localStorage["pedidos_detalle_pag_last"];
		mr=localStorage["pedidos_detalle_pag_max_row"];
		
	} else {
		console.log("PANTALLA NO DETECTADA");
	}	
	console.log("Ultima Pagina " + pag_last);
	// Miramos que botones hay que activar
	
	//PAGINACIÓN 
	if (parseInt(pag_last) > 1 ) {
		console.log("mantiene footer");
		  //document.getElementById("divPaginacionFooter").style.width="20%";
		  //document.getElementById("botonerafooter").style.width="70%";		

			if (localStorage["pantalla"]=="emitidos" || localStorage["pantalla"]=="pedidoNuevoAnteriores"  || localStorage["pantalla"]=="insertarArticulos" || localStorage["pantalla"]=="pedidos_plantillas" || localStorage["pantalla"]=="pedidosBorradores" || localStorage["pantalla"]=="nuevo_proveedores" || localStorage["pantalla"]=="nuevo_pedido")
			{

				if (parseInt(pag_act) > 1)	{ $("#pBtnPagBack").css('visibility', 'visible');} 
				else 					  						{ $("#pBtnPagBack").css('visibility', 'hidden'); }
				
				if (parseInt(pag_last) > parseInt(pag_act) ) 	{ $("#pBtnPagNext").css('visibility', 'visible'); } 
				else 					  															{ $("#pBtnPagNext").css('visibility', 'hidden');  }
					
				var text_pag=pag_act +" / "+ pag_last;
				document.getElementById('pSpanPagDesc').innerHTML = text_pag;		
				
				$("#divPag").css('visibility', 'visible'); 
			}
			
			else if(localStorage["pantalla"]=="pedidosDetalle" || localStorage["pantalla"]=="pedidosDetalleAnterior" || localStorage["pantalla"]=="pedidosDetalleNuevo" || localStorage["pantalla"]=="pedidos_plantillas_detalle" || localStorage["pantalla"]=="borradoresDetalle" || localStorage["pantalla"]=="pedidosDetalleNuevoEscaner" || localStorage["pantalla"]=="pedidosResumenNuevoPedido")
			{
				
				if (parseInt(pag_act) > 1)	{ $("#pBtnPagBack").css('visibility', 'visible'); } 
				else 					  						{ $("#pBtnPagBack").css('visibility', 'hidden'); }
				
				if (parseInt(pag_last) > parseInt(pag_act) ) 	{ $("#pBtnPagNext").css('visibility', 'visible'); console.log(" MOSTRAR NEXT ");  } 
				else 					  															{ $("#pBtnPagNext").css('visibility', 'hidden');  console.log(" ESCONDER  NEXT ");}
			
				var text_pag=pag_act +" / "+ pag_last;
				document.getElementById('pSpanPagDesc').innerHTML = text_pag;	
				
				$("#divPag").css('visibility', 'visible'); 
				//document.getElementById("botonerafooter").style.width="70%";
			}			
			else
			{
				console.log("Ninguna pantalla");
			}	
        
        document.getElementById("divPaginacionFooter").style.width="23%";
		  document.getElementById("botonerafooter").style.width="67%";
        
	} 
	else 
	{
		  //document.getElementById("botonerafooter").style.width="95%";
		  document.getElementById("divPaginacionFooter").style.width="0%";
		  document.getElementById("botonerafooter").style.width="90%";
		  console.log("aumenta footer");
			$("#divPag").css('visibility', 'hidden');
			$("#pBtnPagBack").css('visibility', 'hidden');
			$("#pBtnPagNext").css('visibility', 'hidden'); 
	}		
	
	console.log("MENU CABECERA Paginacion=>"+pag_act +" / "+ pag_last + "("+mr+")");
	
	//Mostrar o ocultar botones
	if (boton1!="") { $("#fbtn1").show(); $("#fbtn1").text(boton1); } 
	else 					 	{ $("#fbtn1").hide(); }
		
	if (boton2!="") { $("#fbtn2").show(); $("#fbtn2").text(boton2);} 
	else 					 	{ $("#fbtn2").hide(); }			
		
	if (boton3!="") { $("#fbtn3").show(); $("#fbtn3").text(boton3);} 
	else 					 	{ $("#fbtn3").hide(); }
		
	if (boton4!="") { $("#fbtn4").show(); $("#fbtn4").text(boton4); } 
	else 					 	{ $("#fbtn4").hide(); }
		
	if (boton5!="") { $("#fbtn5").show(); $("#fbtn5").text(boton5); } 
	else 					 	{ $("#fbtn5").hide();}
		
	
	
	//VERIFICAMOS QUE TENGA LOS PERMISOS
	if (boton1=="Eliminar" && localStorage['pantalla']=="pedidosDetalle") {
				
		db.transaction (function (transaction) 
		{
			var sql = "SELECT * FROM security WHERE username='"+localStorage['usuario']+"' AND module='APP_ORDERS' AND action='DELETE_ORDERS' ";			
			transaction.executeSql (sql, undefined, 
				function (transaction, result)
				{
				
					if (result.rows.length >= 1) {
						$("#fbtn1").show(); 
						$("#fbtn1").text(boton1); 
					} else {
            //Temporalmente  desavilitado
						//$("#fbtn1").hide();
            $("#fbtn1").show();
            $("#fbtn1").text(boton1); 
					}
					
				});
		});
		
	} 
	
	if (boton1=="Eliminar" && localStorage['pantalla']=="pedidos_plantillas_detalle") {
				
		db.transaction (function (transaction) 
		{
			var sql = "SELECT * FROM security WHERE username='"+localStorage['usuario']+"' AND module='APP_ORDERS' AND action='DELETE_TEMPLATE' ";
			
			transaction.executeSql (sql, undefined, 
				function (transaction, result)
				{
				
					if (result.rows.length >= 1) {
						$("#fbtn1").show(); 
						$("#fbtn1").text(boton1); 
						
					} else {
						//Temporalmente  desavilitado
						//$("#fbtn1").hide();
            $("#fbtn1").show();
            $("#fbtn1").text(boton1); 
					}
					
				});
		});
		
	} 
	
	if (localStorage['language']=="EN" || localStorage['language']=="en") {
			if (boton1=="Eliminar") { boton1="Delete"; }
			
			if (boton3=="Seleccionar como Pedido Base" || boton3=="Seleccionar como P. Base"  ) { boton3="Use as Template"; }
	}		
	
}


function activate_buttons_header(back , titulo, search) {

	getPedidosTitulo();
		
	if (back==1) 		{ $("#headerBack").show(); } 
	else 					 	{ $("#headerBack").hide(); }
		
	if (search==1) 	{	$("#headerSearch").show(); } 
	else 					 	{ $("#headerSearch").hide(); }			

}