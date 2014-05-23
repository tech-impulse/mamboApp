function getControlEventosPedidos() {

    localStorage["pantallaAnterior"] = "";

    $('#chkBtnOpenpTbPedidosProveedor').unbind('click').bind('click', function () {

        console.log("Click proveedor filter");

        if ($('#pTbPedidosProveedor-flt-toggle').is(':visible')) {
            $('#pTbPedidosProveedor-flt-toggle').hide();
        } else {
            $('#pTbPedidosProveedor-flt-toggle').show();
        }

    });


    //Boton login
    $('#btnEmitidos').unbind('click').bind('click', function () {
        //pMostrarPedidos();
        //$.mobile.changePage('#emitidos');
        //pMostrarPedidos();
    });


    //Boton BORRAR
    $('#btnDelete').unbind('click').bind('click', function () {
        console.log("Hemos hecho click Eliminar");
        deleteOrder();
        //$.mobile.changePage('#emitidos');
        //pMostrarPedidos();

    });

    // Pantalla de Nuevo Pedido

    //Boton NavBar Mostrar proveedores
    $('#pBtnlproveedores').unbind('click').bind('click', function () {
        $('#proveedores_autorizados').show();
        $('#almacenes_autorizados').hide();
        displayProviders();
    });

    //Boton NavBar Mostrar Almacenes
    $('#pBtnlalmacenes').unbind('click').bind('click', function () {
        $('#proveedores_autorizados').hide();
        $('#almacenes_autorizados').show();
        displayAlmacenes();
    });


    // Pantalla de Alta Pedido

    //Boton NavBar Mostrar proveedores
    $('#pBtnAnteriores').unbind('click').bind('click', function () {
        //$('#pGridPedidosPlantillas').hide();
        plistLastOrders();

    });

    //Boton NavBar Mostrar Almacenes
    $('#pBtnlMisPlantillas').unbind('click').bind('click', function () {
        //$('#pGridPedidosAnteriores').hide();  
        pMostrarPlantillasFiltradas();

    });

    // Pantalla de Articulos por Familia

    $('#pBtnFiltroFamilias').unbind('click').bind('click', function () {
        pMostrarFiltroFamilias();
    });
    $('#pBtnLimpiarFiltroFamilias').unbind('click').bind('click', function () {
        pMostrarArticulos();
    });


    // BOTONES DEL FOOTER

    $('#fbtn1').unbind('click').bind('click', function () {
        console.log("CLICKKKKKKKKKKKKKKKKKKKKKKKKK");

        if (localStorage["pantalla"] == "pedidoNuevoAnteriores" ||
            localStorage["pantalla"] == "pedidos_cabecera" || localStorage["pantalla"] == "pedidoNuevoPlantillas" || localStorage["pantalla"] == "pedidosAyuda" || localStorage["pantalla"] == "plantillas") {
            // CANCELAR 
            getDescripcionAviso("cancelarPedido");
            $("#pedidosDialogAC").popup("open");
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") { // GUARDAR COMO PLANTILLA
            
                	if(localStorage['pantalla_anterior']=="pedidos_plantillas_detalle"){
        		var provider = localStorage["pNuevoPedidoIdProveedor"];
						var center = localStorage["pNuevoPedidoIdCentro"];
						var refer = localStorage['pNuevoPedidoPlantillaRef'];
						
						db.transaction(function (transaction) {
			
			        var sql = "SELECT o.name as nombre FROM ordersTemplates as o WHERE o.reference='"+refer+"'";
			
			        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);
			
			        transaction.executeSql(sql, undefined,
			            function (transaction, result) {
			            	
			            	var rowDb = result.rows.item (0);
			            	
			            	if (rowDb.nombre==undefined) { 	$("#pedidosPopUpInputNombrePlantilla").val(""); }
			            	else { $("#pedidosPopUpInputNombrePlantilla").val(rowDb.nombre); }
			            	
				            $("#pedidosPopUpNombrePlantilla").popup("open");
				            
				            //pGuardarPedidoTemporalComoPlantillaNueva(localStorage['pNuevoPedidoIntenalId']);
				            //pRellenarGridNuevoPedido();	
				            
				          });
				    });
                        
				  } else {
                            // LISTA DE ZONAS
                    db.transaction(function (transaction) {
                        var sql = "SELECT distinct z.name as nom, z.idDeliveryZone as id FROM deliveryZones as z WHERE z.idPurchaseCenter=" + localStorage["pNuevoPedidoIdCentro"] + " ORDER BY z.name DESC ";
                        console.log("LISTA DE ZONAS 1 " + sql);
                        transaction.executeSql(sql, undefined,
                            function (transaction, result) {
                                console.log("LISTA DE ZONAS 2");
                                var i = 0;
                                var listaZonas = [];

                                for (i = 0; i < result.rows.length; i++) {
                                    var zone = result.rows.item(i);

                                    listaZonas.push({
                                        id_zona: zone.id,
                                        nombre_zona: zone.nom,
                                    });

                                }
                                if (i == 1) {
                                    $('#ptxtZonaCabeceraPlantilla').kendoDropDownList({
                                        dataSource: {
                                            data: listaZonas
                                        },
                                        dataTextField: 'nombre_zona',
                                        dataValueField: 'id_zona',
                                    }).data("kendoDropDownList");
                                } else {
                                    $('#ptxtZonaCabeceraPlantilla').kendoDropDownList({
                                        dataSource: {
                                            data: listaZonas
                                        },
                                        dataTextField: 'nombre_zona',
                                        dataValueField: 'id_zona',
                                        optionLabel: "Seleccionar",
                                    }).data("kendoDropDownList");
                                }

                            }, error6);
                    });
				  	$("#pedidosPopUpInputNombrePlantilla").val("");
				    $("#pedidosPopUpNombrePlantilla").popup("open");				  	
				  }

        } 
        else if (localStorage["pantalla"] == "pedidosDetalle" || localStorage["pantalla"] == "pedidos_plantillas_detalle") {
            // ELIMINAR
            getDescripcionAviso("eliminarPedido");
            $("#pedidosDialogAC").popup("open");
        } else if (localStorage["pantalla"] == "insertarArticulos") {
            // FINALIZAR INSERCION
            pRellenarGridNuevoPedido();
            insertLog(3,5,"Nuevo articulo en base a seleccion por familias",localStorage['pNuevoPedidoIntenalId']+","+localStorage['pNuevoPedidoIdProveedor']+","+localStorage['pNuevoPedidoIdCentro']);
        } else if (localStorage["pantalla"] == "pFiltroFamilias") {
            // QUITAR FILTRO
            pMostrarArticulos("filtrados");
        } else if (localStorage["pantalla"] == "nuevo_proveedores") {
            // PEDIDO EN BASE A ESCANER
            getDescripcionAviso("pedidoGLobalEscaner");
            $("#pedidosDialogAC").popup("open");
        } else if (localStorage["pantalla"] == "borradoresDetalle") {
            // BORRAR BORRADOR
        	getDescripcionAviso("eliminarBorrador");
        	insertLog(3,6,"Eliminar borrador ",localStorage['pNuevoPedidoIntenalId']+","+localStorage['pNuevoPedidoIdProveedor']+","+localStorage['pNuevoPedidoIdCentro']);
            $("#pedidosDialogAC").popup("open");
        		
        }
    });

    $('#fbtn2').unbind('click').bind('click', function () {


        if (localStorage["pantalla"] == "pedidoNuevoAnteriores" || localStorage["pantalla"] == "pedidoNuevoPlantillas") {
            // NUEVO PEDIDO POR ARTICULOS
            pListaNuevoPedidoVacio(); // genera la grid de kendo cargando la orden de la tabla temporal (vacia)
            insertLog(3,5,"Origen de alta de pedido","En blanco");

        } else if (localStorage["pantalla"] == "pedidosDetalle" || localStorage["pantalla"] == "pedidosDetalleAnterior" ) {
            // SELECCIONAR COMO PEDIDO BASE
            pGenerarPedidoEnBaseAPedido();
            insertLog(3,5,"Origen de alta de pedido","En base a pedido anterior");

            
        } else if( localStorage["pantalla"] == "pedidos_plantillas_detalle") {    
        	
           console.log(" PLANTILLA A PEDIDO BASE => "+$("#pTxtNuevoPedidoPlantillaRef").val());
           
           localStorage["pantalla_anterior"]="pedidos_plantillas_detalle";
           insertLog(3,5,"Origen de alta de pedido","En base a plantilla");
           localStorage["pantalla_anterior"]="";
           pGuardarPlantillaComoPedidoTemporal($("#pTxtNuevoPedidoPlantillaRef").val(),"0") ;
           
            
        } else if (localStorage["pantalla"] == "borradoresDetalle") {
        	
            // MODIFICAR    
            localStorage['numFilaSeleccionada']="borradores";
            console.log("------------fbtn2-------------------");
            console.log(localStorage['pNuevoPedidoIntenalId']);
            insertLog(3,6,"Modificar borrador",localStorage['pNuevoPedidoIntenalId']+","+localStorage['pNuevoPedidoIdProveedor']+","+localStorage['pNuevoPedidoIdCentro']);
            pGuardarBorradorComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId'], 2);               
            pRellenarGridNuevoPedido();   
            
        } else if (localStorage["pantalla"] == "pedidosAyuda") {
        	
            // GUARDAR BORRADOR 
            getDescripcionAviso("accionNoDisponible");
            $("#pedidosDialogA").popup("open");
            //pGuardarPlantillaComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId']);               
            //pRellenarGridNuevoPedido(); 
              
        } else if (localStorage["pantalla"] == "pFiltroFamilias") {
            // APLICAR FILTRO
            if (localStorage["pedidos_filtro_id_familia_nivel1"] == "nulo") {
                getDescripcionAviso("filtroFamiliaNoSeleccionado");
                $("#pedidosDialogAC").popup("open");
            } else
                pMostrarArticulos("filtrados");
        } else if (localStorage["pantalla"] == "pedidos_cabecera") {
            // RESUMEN
            //pRellenarGridNuevoPedido();
            localStorage["pantalla_anterior"]="pedidos_cabecera";
            pResumenNuevoPedido();

            //getDescripcionAviso("accionNoDisponible");
            //$("#pedidosDialogA").popup("open");
            //pGuardarPlantillaComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId']);               
            //pRellenarGridNuevoPedido();   
        } else if (localStorage["pantalla"] == "plantillas") {
            // GUARDAR PLANTILLA
            getDescripcionAviso("accionNoDisponible");
            $("#pedidosDialogA").popup("open");
            //pGuardarPlantillaComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId']);               
            //pRellenarGridNuevoPedido();   
        }
        else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && $('#fbtn2').text()!="Guardar Plantilla") {
            
            // GUARDAR BORRADOR 
			checkPedidoACero();

        }
        else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") {
            // GUARDAR BORRADOR 
           pGuardarPedidoTemporalComoBorrador(localStorage['pNuevoPedidoIntenalId'], "1");   
            
            
            //pGuardarPlantillaComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId']);               
            //pRellenarGridNuevoPedido();   
        }
        else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && $('#fbtn2').text()=="Guardar Plantilla") {
            pGuardarPedidoTemporalComoPlantillaExistente(localStorage["pNuevoPedidoIntenalId"]);
        }

    });

    $('#fbtn3').unbind('click').bind('click', function () {

        if (localStorage["pantalla"] == "pedidosDetalleNuevo") {
            // INSERTAR ARTICULOS / MODIFICAR
						crearFiltro(); // Reinicializa los filtros
            $('#pDivCheckPrecioDetallePedido').html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');
            pMostrarArticulos();
        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {
            // MODIFICAR
            
            console.log(" PLANTILLA A MODIFICAR  => "+$("#pTxtNuevoPedidoPlantillaRef").val());
            pGuardarPlantillaComoPedidoTemporal($("#pTxtNuevoPedidoPlantillaRef").val(),"2");
            
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") {
            // GUARDAR BORRADOR 
           insertLog(3,7,"Generacion de borrador","IdInterno: "+localStorage["pNuevoPedidoIntenalId"]+", Proveedor: "+localStorage["pNuevoPedidoIdCentro"]+", Centro: "+localStorage["pNuevoPedidoIdCentro"]);
           pGuardarPedidoTemporalComoBorrador(localStorage['pNuevoPedidoIntenalId'], "1");       
            
            //pGuardarPlantillaComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId']);               
            //pRellenarGridNuevoPedido();   
        } else if (localStorage["pantalla"] == "pedidos_cabecera") {
            // GUARDAR BORRADOR 

			checkPedidoACero(); 
			
        } else if (localStorage["pantalla"] == "borradoresDetalle") {
            // FINALIZAR (BORRADOR)
            
            pGuardarBorradorComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId'],0);
			pBorrarBorrador(localStorage['pNuevoPedidoIntenalId']);
            
            localStorage['proveedor_seleccionado']=$("#pTxtNuevoPedidoBorradorProveedor").val();
            localStorage['centro_seleccionado']=$("#pTxtNuevoPedidoBorradorCentro").val();

            //checkPedidoACero();
            
            
        } else if (localStorage["pantalla"] == "pedidosDetalle") {
            // MODIFICAR PEDIDO
            db.transaction(function (transaction) {

            var sql = "SELECT idInternalOrder, idVendor, idPurchaseCenter FROM ordersPending WHERE reference='"+$("#txtCodPedido").val()+"'";

            transaction.executeSql(sql, undefined,
                function (transaction, result) {

                    var rowDb = result.rows.item (0);
                    
                     localStorage['pNuevoPedidoIntenalId'] = rowDb.idInternalOrder;
                     localStorage['pNuevoPedidoIdProveedor'] = rowDb.idVendor;
                     localStorage['pNuevoPedidoIdCentro'] = rowDb.idPurchaseCenter;

                  });
            });
          
           
            pRellenarGridNuevoPedido();
            //checkPedidoACero();
            
            
        }


    });


    $("#fbtn4").unbind('click').bind('click', function () {
    	
    		$('#pDivCheckPrecioDetallePedido').html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');
				$('#pLbpedidosDetalleNuevoPrecio').html('<label id="pLbpedidosDetalleNuevoPrecio" style="font-weight: bold; margin-bottom: 0px;text-align: center;">Mostrar precios</label>');
			
				console.log("Datos: "+document.getElementById('fbtn4').text);

        if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {
            // MODIFICAR
            pGuardarPlantillaComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId']);
            pRellenarGridNuevoPedido();
        } else if (localStorage["pantalla"] == "insertarArticulos") { //pedidosResumenNuevoPedido
            // FINALIZAR INSERCIÓN
            pRellenarGridNuevoPedido();
        }else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && document.getElementById('fbtn4').text=="Modificar" ){
        	           
           pGuardarBorradorComoPedidoTemporal(localStorage['pNuevoPedidoIntenalId'], 2); 
           
           pRellenarGridNuevoPedido(); 
        
        
        } else if (localStorage["pantalla"] == "pedidosResumenNuevoPedido" && document.getElementById('fbtn4').text=="Modificar" ){
        	           
           
           pRellenarGridNuevoPedido(); 
        
        
        }else if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" ) {
            // ESCANER
            getDescripcionAviso("pedidoEscaner");
						$("#InCodigoEan").val("");
            $("#pDialogInsertEan").popup("open");
            insertLog(3,5,"Nuevo articulo en base a escaner","IdInterno: "+localStorage['pNuevoPedidoIntenalId']+", Proveedor: "+localStorage['pNuevoPedidoIdProveedor']+", Centro: "+localStorage['pNuevoPedidoIdCentro']);
            //setTimeout('$("#InCodigoEan").focus();',500);
            localStorage.setItem('ModoEscaner', "1");
            console.log("Ponemos Escaner a 1");
        } else if (localStorage["pantalla"] == "pedidos_cabecera") {
        	
        	if(localStorage['pantalla_anterior']=="pedidos_plantillas_detalle"){
        		var provider = localStorage["pNuevoPedidoIdProveedor"];
						var center = localStorage["pNuevoPedidoIdCentro"];
						var refer = localStorage['pNuevoPedidoPlantillaRef'];
						
						db.transaction(function (transaction) {
			
			        var sql = "SELECT o.name as nombre FROM ordersTemplates as o WHERE o.reference='"+refer+"'";
			
			        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);
			
			        transaction.executeSql(sql, undefined,
			            function (transaction, result) {
			            	
			            	var rowDb = result.rows.item (0);
			            	
			            	if (rowDb.nombre==undefined) { 	$("#pedidosPopUpInputNombrePlantilla").val(""); }
			            	else { $("#pedidosPopUpInputNombrePlantilla").val(rowDb.nombre); }
			            	
				            $("#pedidosPopUpNombrePlantilla").popup("open");
				            
				            //pGuardarPedidoTemporalComoPlantillaNueva(localStorage['pNuevoPedidoIntenalId']);
				            //pRellenarGridNuevoPedido();	
				            
				          });
				    });
				  } else {
				  	$("#pedidosPopUpInputNombrePlantilla").val("");
				    $("#pedidosPopUpNombrePlantilla").popup("open");				  	
				  }
        }

    });

    $("#fbtn5").unbind('click').bind('click', function () {
    	  
    	  if (localStorage["pantalla"] == "pedidosDetalleNuevo" && localStorage["pantalla_anterior"]=="pedidos_plantillas_detalle" ) {
        		//GUARDANDO UNA PLANTILLA EXISTENTE
        
   
	        db.transaction(function (transaction) {
				
				        var sql = "SELECT o.observaciones as nombre FROM ordersPending as o WHERE o.idInternalOrder='"+localStorage['pNuevoPedidoIntenalId']+"'";
				
				        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);
				
				        transaction.executeSql(sql, undefined,
				            function (transaction, result) {
				            	
				            	var rowDb = result.rows.item (0);
	            				if (rowDb.nombre==undefined) { 	$("#pedidosPopUpInputNombrePlantilla").val(""); }
	            				
			            	else { 
			            			 $("#pedidosPopUpInputNombrePlantilla").val(rowDb.nombre); 
			            	}
			            	
					            $("#pedidosPopUpNombrePlantilla").popup("open");
					            
					            //pGuardarPedidoTemporalComoPlantillaNueva(localStorage['pNuevoPedidoIntenalId']);
					            //pRellenarGridNuevoPedido();	
					            
					          });
					    });

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && $('#fbtn2').is(":hidden") || localStorage["pantalla"] == "pedidosResumenNuevoPedido"  )
        {
            displayCabeceraPedido();
          
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {
            // FINALIZAR (NUEVO PEDIDO)
            checkPedidoVacio();
            pLimpiarParametrosTemporales();

        } else if (localStorage["pantalla"] == "pedidos_cabecera") // Boton Enviar Pedido
        {
            // ENVIAR
            if ($("#ptxtFechaEntregaCabecera").val() == "Selecciona") {
                getDescripcionAviso("seleccionarFecha");
                $("#pedidosDialogA").popup("open");
            } else if ($("#ptxtZonaCabecera").val() == "") {
                getDescripcionAviso("seleccionarZona");
                $("#pedidosDialogA").popup("open");
            } else if ($("#ptxtFechaEntregaCabecera").val() != "Selecciona" && $("#ptxtZonaCabecera").val() != "") {
                console.log("Puede enviarse!");
                
                pBotonFinalizarNuevoPedido();

            }

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner"){
			
			getDescripcionAviso("borradoresGuardados");
			$("#pedidosDialogAC").popup("open");
			
			 //getDescripcionAviso("seleccionarFecha");
             //$("#pedidosDialogA").popup("open");

            //pGuardarPedidoGlobalTemporalComoBorrador();
			

        } else
            console.log("Boton 5 no sabemos que pantalla es");

    });

    $('#pBtnAyuda').unbind('click').bind('click', function () {


        console.log("BOTON 11111111 AYUDA PULSADO EN EVENTOS = " + localStorage["pantallaAnterior"] + "=" + localStorage["pantalla"]);

        localStorage["pantallaAnterior"] = localStorage["pantalla"];
				
       //localStorage["pantalla"] = "pedidosAyuda";

        getPedidosAyuda(localStorage["pantallaAnterior"]);

        console.log("BOTON 22222222 AYUDA PULSADO EN EVENTOS = " + localStorage["pantallaAnterior"] + "=" + localStorage["pantalla"]);

        //displayPedidosAyuda();
        
        var el = document.getElementById('pAyuda-popup');
        el.setAttribute('style','left:0px;width:100%;height:100%');
        $( "#pAyuda" ).popup( "open" );  
        insertLog(3,4,"Se ha accedido a la pantalla de ayuda",localStorage["pantalla"]);


    });

    $('#mpBtn1').unbind('click').bind('click', function () {
    	
    		pLimpiarParametrosTemporales();
    		
        if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "pedidos_cabecera" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" || localStorage["pantalla"] == "pedidosResumenNuevoPedido") {
            
            
            var grid = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
        		var datos = grid.data();
        		console.log("DAtos de la grid de nuevo pedido es null?");
        		console.log(datos);
        		if(datos.length > 0){
            getDescripcionAviso("cancelarPedido", "pMostrarPedidos");
            localStorage["columnaFiltrada"]="";
            $("#pedidosDialogAC").popup("open");
            $("#navpanel").panel("close");
            }else{$("#navpanel").panel("close"); pMostrarPedidos(); }
            
            
        } else {
            $("#navpanel").panel("close");
            pMostrarPedidos();
            pCargarParcialPedidos();
            //pMostrarPedidos();
        }
    });

    $('#mpBtn2').unbind('click').bind('click', function () {
    	    
    	  pLimpiarParametrosTemporales();  		
    	    		
        if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "pedidos_cabecera" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" || localStorage["pantalla"] == "pedidosResumenNuevoPedido") {
            
            var grid = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
        		var datos = grid.data();
        		console.log("DAtos de la grid de nuevo pedido es null?");
        		console.log(datos);
        		if(datos.length > 0){
            getDescripcionAviso("cancelarPedido", "getCentros");
            localStorage["columnaFiltrada"]="";
            $("#pedidosDialogAC").popup("open");
            $("#navpanel").panel("close");
            }else{$("#navpanel").panel("close"); getCentros(); displayNuevoPedido(); }
            
        } else {
        	
            $("#navpanel").panel("close");
            getCentros();
            displayNuevoPedido();
        }


    });

    $('#mpBtn3').unbind('click').bind('click', function () {
    	
    		pLimpiarParametrosTemporales();
    		
        if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "pedidos_cabecera" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" || localStorage["pantalla"] == "pedidosResumenNuevoPedido") {
            
            var grid = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
        		var datos = grid.data();
        		console.log("DAtos de la grid de nuevo pedido es null?");
        		console.log(datos);
        		if(datos.length > 0){
            getDescripcionAviso("cancelarPedido", "pMostrarTodosBorradores");
            localStorage["columnaFiltrada"]="";
            $("#pedidosDialogAC").popup("open");
            $("#navpanel").panel("close");
            }else{$("#navpanel").panel("close"); pMostrarTodosBorradores(); }
            
        } else {
            $("#navpanel").panel("close");
            //getCentros();
            pMostrarTodosBorradores();
        }

    });


    $('#mpBtn4').unbind('click').bind('click', function () {
    	
    		pLimpiarParametrosTemporales();

        if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "pedidos_cabecera" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" || localStorage["pantalla"] == "pedidosResumenNuevoPedido") {
            
            var grid = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
        		var datos = grid.data();
        		console.log("DAtos de la grid de nuevo pedido es null?");
        		console.log(datos);
        		if(datos.length > 0){
            getDescripcionAviso("cancelarPedido", "pMostrarTodasPlantillas");
            localStorage["columnaFiltrada"]="";
            $("#pedidosDialogAC").popup("open");
            $("#navpanel").panel("close");
            }else{$("#navpanel").panel("close"); pMostrarTodasPlantillas(); }
            
        } else {
            $("#navpanel").panel("close");
            pMostrarTodasPlantillas();
        }

    });


    //Ocutar detalla 
    $('#pBtnOcultarDetalle').unbind('click').bind('click', function () {
        $('#pDivDetallePedido0').show();
        $('#pDivDetallePedido1').hide();
        $('#pDivDetallePedido2').hide();
        $('#pDivDetallePedido3').hide();
        $('#pDivDetallePedido4').hide();
        $('#pDivDetallePedido5').hide();
        $('#pDivDetallePedido6').hide();
        
        if(localStorage["pantalla"]=="pedidosDetalleAnterior"){
        pMostrarDetallePedidoAnterior(localStorage['pDetalleAnterior'], false);
        }
        else {
        pMostrarDetallePedido(localStorage['pDetalleAnterior'], "", false);
        }
    });


    $('#pBtnMostrarCabeceraDetalle').unbind('click').bind('click', function () {
        $('#pDivDetallePedido0').hide();
        $('#pDivDetallePedido1').show();
        $('#pDivDetallePedido2').show();
        $('#pDivDetallePedido3').show();
        $('#pDivDetallePedido4').show();
        $('#pDivDetallePedido5').show();
        $('#pDivDetallePedido6').show();
        if(localStorage["pantalla"]=="pedidosDetalleAnterior"){
        pMostrarDetallePedidoAnterior(localStorage['pDetalleAnterior'], true);
        }
        else {
        pMostrarDetallePedido(localStorage['pDetalleAnterior'], "", true);
        }
    });


    //Ocutar detalle Plantilla

    $('#pBtnOcultarCabeceraDetallePlantilla').unbind('click').bind('click', function () {
        $('#pDivDetallePedidoPlantilla0').show();
        $('#pDivDetallePedidoPlantilla1').hide();
        $('#pDivDetallePedidoPlantilla2').hide();
        $('#pDivDetallePedidoPlantilla3').hide();
        $('#pDivDetallePedidoPlantilla4').hide();
        pMostrarDetallePlantilla(localStorage['pDetallePlantilla'], false);
    });


    $('#pBtnMostrarCabeceraDetallePlantilla').unbind('click').bind('click', function () {
        $('#pDivDetallePedidoPlantilla0').hide();
        $('#pDivDetallePedidoPlantilla1').show();
        $('#pDivDetallePedidoPlantilla2').show();
        $('#pDivDetallePedidoPlantilla3').show();
        $('#pDivDetallePedidoPlantilla4').show();
        pMostrarDetallePlantilla(localStorage['pDetallePlantilla'], true);
    });

    //Ocutar detalle Borradores

    $('#pBtnOcultarCabeceraDetalleBorrador').unbind('click').bind('click', function () {
        $('#pDivDetallePedidoBorrador0').show();
        $('#pDivDetallePedidoBorrador1').hide();
        $('#pDivDetallePedidoBorrador2').hide();
        $('#pDivDetallePedidoBorrador3').hide();
        $('#pDivDetallePedidoBorrador4').hide();
        pMostrarDetalleBorrador(localStorage['pDetallePlantilla'], false);
    });


    $('#pBtnMostrarCabeceraDetalleBorrador').unbind('click').bind('click', function () {
        $('#pDivDetallePedidoBorrador0').hide();
        $('#pDivDetallePedidoBorrador1').show();
        $('#pDivDetallePedidoBorrador2').show();
        $('#pDivDetallePedidoBorrador3').show();
        $('#pDivDetallePedidoBorrador4').show();
        pMostrarDetalleBorrador(localStorage['pDetallePlantilla'], true);
    });


    // POPUP DE INSERCION DE ARTICULOS

    $('#btnInsertarPedidoCancelar').unbind('click').bind('click', function () {
    	
    		document.getElementById("pLabelTextError").style.display="none";
    		document.getElementById("chartTAM").style.display="block";
        $("#dialogInsertarPedido").popup("close");
        $("#InUnidadesInsertarPedido").val('1');
        $("#InCadenaInsertarPedido").val('');
        $("#InTotalesInsertarPedido").val('0');
        $("#pBtnNumCargado").val('0');  
    });

    $('#btnInsertarPedidoOk').unbind('click').bind('click', function () {
    		
    		 $('#searchText').val("");
    		 
				 document.getElementById("pLabelTextError").style.display="none";
				 document.getElementById("chartTAM").style.display="block";	
         //pNuevoPedidoInsertarArticuloTemporal($("#LbTituloInsertarPedido").val(), $("#InUnidadesInsertarPedido").val(), $("#InCadenaInsertarPedido").data("kendoDropDownList").text());
          
	     		var valorUnidad = $('#InUnidadesInsertarPedido').val();
	     		
	     		if(valorUnidad==0 && localStorage['pantalla_anterior']!="pedidos_plantillas_detalle"){
	     			
	     				var grid = $("#pGridNuevoPedido").data("kendoGrid");
				    	var dataGrid = grid.dataSource.data();
	     				
	     				if(localStorage['pantalla']=="insertarArticulos"){//Si estamos en la grid de escoger articulos se debera elimnar de la grid de nuevo pedido el item puesto a 0
	     			
			     			var grid2 = $("#pGridArticulos").data("kendoGrid");
			       		var row2 = grid2.select();//no es el numero de la fila sino los datos seleccionados para kendo (es un array)
			        	var datos2 = grid2.dataItem(row2);
			        	var dataGrid2 = grid2.dataSource.data();
	     				  var datos ="";		
	     				  var dataJSON="";	
	     				  dataJSON = dataGrid.toJSON();	
	     				  
                //Borramos el articulo el articulo de la grid de Nuevo pedido
			    	  	for(var i=0;i<dataJSON.length;i++){
			    	  		if(datos2.cod_articulo == dataJSON[i].cod_pedid){
			    	  			grid.dataSource.remove(dataJSON[i]);
			    	  			pEliminarArticuloPedidoTemporal(dataJSON[i].cod_pedid);
			    	  		}
			    	  	}	  
			    	  	
			    	  	row2.each(function () {
								    var RowIndex = $(this).closest("tr").index();
								    if(localStorage["pedidos_pag_act"]>1){
										    console.log(RowIndex);
										    var filasTot = parseInt(localStorage["pedidos_pag_max_row"]);
										    var pagAct = parseInt(localStorage["pedidos_pag_act"])-1;
										    var filaSelect = RowIndex + (filasTot * (pagAct) );//sumamos el numero de filas segun la paginacion porque solo selecciona la fila de la pagina actual
					    	  			console.log(filaSelect);
					    	  			dataGrid2[filaSelect].can_pedida="";
					    	  			grid2.dataSource.data(dataGrid2);//cargamos de nuevo los datos modificados a la tabla
			    	  		 	}else{//pagina actual es 1
		    	  		 			dataGrid2[RowIndex].can_pedida="";
				    	  			grid2.dataSource.data(dataGrid2);//cargamos de nuevo los datos modificados a la tabla
			    	  		 	}
								})
								/*console.log(RowIndex);
			    	  	dataGrid2[0].can_pedida="";
			    	  	grid2.dataSource.data(dataGrid2);//cargamos de nuevo los datos modificados a la tabla*/
			    	  	
			    	  	
			    	  	var grid = $("#pGridNuevoPedido").data("kendoGrid");
				        grid.dataSource.page(localStorage['pedidos_detalle_pag_act']);
			    	  				
				    	}else{//si estamos en la grid de nuevo pedido eliminamos el item
				    		
				    		var row = grid.select();
				    		console.log(row);
				    		var datos = grid.dataItem(row);
				    		
				    		grid.dataSource.remove(datos);
					      pEliminarArticuloPedidoTemporal(datos.cod_pedid);			
					      
					      
				    	}
				    	
	    	  }else {
				 			console.log("ESTO");
	    	      pNuevoPedidoInsertarArticuloTemporal($("#LbTituloInsertarPedido").val(), $("#InUnidadesInsertarPedido").val(), $("#InCadenaInsertarPedido").data("kendoDropDownList").text());
          
          		
		    	  	var grid = $("#pGridNuevoPedido").data("kendoGrid");
			        grid.dataSource.page(localStorage['pedidos_detalle_pag_act']);
          } 
          $("#pBtnNumCargado").val('0');  
          $("#dialogInsertarPedido").popup("close"); 
         
            /*$("#InUnidadesInsertarPedido").val('1');
            $("#InCadenaInsertarPedido").val('');
            $("#InTotalesInsertarPedido").val('0');*/
            if (localStorage["ModoEscaner"]==1)
            {
                getDescripcionAviso("pedidoEscaner");
								console.log("ESCANER SE ABRE SOLO AQUI " + localStorage["ModoEscaner"]);
				
                //setTimeout('$("#InCodigoEan").focus();',2000);
                $("#pBtnNumCargado").val("0");
            }
            

           /* if (localStorage["pantalla"] == "insertarArticulos")
            {
                var grid = $("#pGridArticulos").data("kendoGrid");
                var rowId = localStorage.getItem('itemCheckGridNuevoPedido');
                var raw = grid.dataSource.data();
                var item = raw[rowId];
                grid.dataSource.remove(item);
                console.log(raw[rowId] + localStorage.getItem('itemCheckGridNuevoPedido'));
            }*/
            
    });

    $("#nivel1-menu").change(function () {
        console.log("Handler for .change() called.");
    });

    //POP UP de notificaciones
    $('#pNotificacionesBtnCerrar').unbind('click').bind('click', function () {
        $("#pNotificacionesPopup").popup("close");
    });

		//POP UP GUARDAR plantilla 
		$('#pedidosPopUpNombrePlantillaOk').unbind('click').bind('click', function(){
			
			if($("#pedidosPopUpInputNombrePlantilla").val()=="") {
       	$( "#pedidosPopUpErrorNombrePlantilla").show();
      } else {
      	$( "#pedidosPopUpErrorNombrePlantilla").hide();
      	$( "#pedidosPopUpNombrePlantilla" ).popup( "close");
      	
      	
      	pCerrarPlantilla(localStorage['pNuevoPedidoIntenalId'], $( "#pedidosPopUpInputNombrePlantilla").val(),$("#ptxtZonaCabeceraPlantilla").val());
      	
      	setTimeout(pEnviarPlantilla(localStorage['pNuevoPedidoIntenalId']),300);
      	
      	//RE-ubicar
      	//pGuardarPedidoTemporalComoPlantillaNueva(localStorage['pNuevoPedidoIntenalId'], $( "#pedidosPopUpInputNombrePlantilla").val() );
      }   
      
    });
    
    $('#pedidosPopUpNombrePlantillaCancel').on('tap', function(){
    	 $( "#pedidosPopUpErrorNombrePlantilla").hide();
       $( "#pedidosPopUpNombrePlantilla" ).popup( "close");
    });

		//////////////////////////////////////////////////////////////////////////////////////////////////////
		// Insertar Articulos Teclado numerico
		$('#pBtnNum1,#pBtnNum2,#pBtnNum3,#pBtnNum4,#pBtnNum5,#pBtnNum6,#pBtnNum7,#pBtnNum8,#pBtnNum9,#pBtnNum0').unbind('click').bind('click', function(){
			
			var n=this.id.substr(7,1);
			console.log("NUM= "+n);
			
       if ($("#pBtnNumCargado").val()==0 ||  $("#pBtnNumCargado").val()=="1" ) {
       		$("#InUnidadesInsertarPedido").val(n);
       		$("#pBtnNumCargado").val('2');	
       } else {
       		$("#InUnidadesInsertarPedido").val($("#InUnidadesInsertarPedido").val()+""+n);
       } 

       var unidades_totales = parseFloat($("#InUnidadesInsertarPedido").val()) * parseFloat($("#InCadenaInsertarPedido").val());
       $("#InTotalesInsertarPedido").val(unidades_totales);
    });
    
    $('#pBtnNumDelete').unbind('click').bind('click', function(){
			
			$("#InUnidadesInsertarPedido").val($("#InUnidadesInsertarPedido").val().substr(0,$("#InUnidadesInsertarPedido").val().length -1));
      
       var unidades_totales = parseFloat($("#InUnidadesInsertarPedido").val()) * parseFloat($("#InCadenaInsertarPedido").val());
       $("#InTotalesInsertarPedido").val(unidades_totales);
    });
    
  
    $('#pBtnNumD').unbind('click').bind('click', function(){
    	
			if ( $("#InUnidadesInsertarPedido").val().indexOf(".") == -1 )  {
				
				if ($("#InUnidadesInsertarPedido").val()=="")  { $("#InUnidadesInsertarPedido").val("0."); }
				else $("#InUnidadesInsertarPedido").val($("#InUnidadesInsertarPedido").val()+".");
					
					$("#pBtnNumCargado").val('2');	
			}
			
    });
   
        // Filtro popr familia pantalla Insertar Articulos
    $('#cancelNivel1').unbind('click').bind('click', function () {
    //$('#ListaNivel1').prop('selectedIndex',0);
	crearFiltro();
    pMostrarArticulos();
    });

    $('#cancelNivel2').unbind('click').bind('click', function () {
        //setTimeout(function{$('#ListaNivel2').hide();}, 300);
        $('#ListaNivel2').delay(200).fadeOut('slow');
        $('#cancelNivel2').delay(200).fadeOut('slow');
        localStorage["pedidos_filtro_id_familia_nivel2"] = "";
        localStorage["pedidos_filtro_id_familia_nivel3"] = "";
        pMostrarArticulos("filtrados");
    });

    $('#cancelNivel3').unbind('click').bind('click', function () {
        //var selectBox1 = document.getElementById("nivel1");
        //selectBox1.options[selectBox1.selectedIndex].value
       // $('#ListaNivel1').val();

        $('#ListaNivel3').delay(200).fadeOut('slow');
        $('#cancelNivel3').delay(200).fadeOut('slow');
        localStorage["pedidos_filtro_id_familia_nivel3"] = "";
        pMostrarArticulos("filtrados");
    });
    
		$("#pedidosPopUpNombrePlantilla").on("popupafteropen", function(event, ui) {
       // setTimeout('$("#InCodigoEan").focus();',1000);
				$("#pedidosPopUpInputNombrePlantilla").focus();
			
    });
}



function eventoMostrarPedidos() {


    localStorage["pantalla"] = "pedidos";
    console.log("Boton Pedidos Pulsado");

    // no seguro //max_reg_pag=get_numfilas(); //Maximo numero de registros por pagina
    // no seguro //localStorage["max_row_per_pag"]=max_reg_pag;

    /////////////////////////////////////////////////////////////////////////
    // FILTROS 
    /*db.transaction (function (transaction) 
    {
        /*
        insertLog('APLICACION', 'Consulta Pedidos');
        
        var sql = "SELECT DISTINCT(nom_center) as center FROM Orders, Providers , Centers WHERE Centers.cod_center=Orders.cod_centro AND Providers.codPro=Orders.cod_proveedor ";
        console.log(sql);
        
        var filter_centers=new Array();
        var filter_providers=new Array();
        
        transaction.executeSql (sql, undefined, 
            function (transaction, result)
            {
                var n=result.rows.length;           
                var row="";     
                for (var i = 0; i < n; i++) 
                {
                    row=result.rows.item(i);
                    filter_centers.push(row.center);
                }
                
            }, error);
        
        var sql2 = "SELECT DISTINCT(nomPro) as provider FROM Orders, Providers , Centers WHERE Centers.cod_center=Orders.cod_centro AND Providers.codPro=Orders.cod_proveedor ";
        console.log(sql2);
            
        transaction.executeSql (sql2, undefined, 
            function (transaction, result)
            {
                var n=result.rows.length;           
                var row="";     
                
                for (var i = 0; i < n; i++) 
                {
                        if (i > 10) { break; }
                        row=result.rows.item(i);
                        //console.log("FILTRO provides  "+row.provider);
                        //filter_providers=filter_providers + "'" + row.provider + "'  ," ;
                        filter_providers.push(row.provider);
                    
                    
                }
                
                //filter_providers = filter_providers+"'dani'";
                
                //console.log("FILTRO providers  FIN |"+filter_providers+"|");
        
                $('#pTbPedidos').dataTable().columnFilter(
                { sPlaceHolder: "head:before", 
                        aoColumns: [
            null,
            { type: "checkbox", values: filter_centers },
            { type: "checkbox", values: filter_providers },
            null,
            null, 
            null   
            ]
        }); 
        
            }, error);
        
        
        console.log("FILTRO providers  FIN |"+filter_providers+"|");
                
                $('#pTbPedidos').dataTable().columnFilter(
                { sPlaceHolder: "head:before", 
                        aoColumns: [
            null,
            { type: "checkbox", values: filter_centers },
            { type: "checkbox", values: filter_providers },
            null,
            null, 
            null   
            ]
        }); 
            
        */

    //FIN FILTROS ////////////////////////////////////////////////////////////////////////////////////////////////

    //var sql = "SELECT COUNT(*) as n FROM Orders, Providers , Centers WHERE Centers.cod_center=Orders.cod_centro AND Providers.codPro=Orders.cod_proveedor ";

    /*var sql = "SELECT COUNT(*) as n FROM orders as o WHERE 1 ";

        console.log(sql);
        
        transaction.executeSql (sql, undefined, 
            function (transaction, result)
            {
                            
                if (result.rows.length)
                {
                    
                    var rowDb = result.rows.item(0);
                    console.log("Numero de registros " +rowDb.n);
                    console.log("objetos maximos por pantalla " +localStorage["max_row_per_pag"]);
                    localStorage["pedidos_pag_act"]=1;
                    localStorage["pedidos_pag_max_row"]=localStorage["max_row_per_pag"];
                    localStorage["pedidos_pag_last"]=   Math.ceil(rowDb.n / localStorage["pedidos_pag_max_row"] );

                    console.log("Numero de registros ---> "+ rowDb.n + " / " + localStorage["pedidos_pag_max_row"] );
                }
                else
                {
                    //$('#pedidos_max_row').val(0);
                }
                            
                console.log("PEDIDOS INICIO pag_act="+localStorage["pedidos_pag_act"]+" | MAX POR PAG="+localStorage["pedidos_pag_max_row"] + " | ULTIMA PAGINA " + localStorage["pedidos_pag_last"]);  
                
                //activate_buttons_header(0 , "Detalle de pedidos", 1);
                activate_buttons_footer("","","","",""); 
                
                $('#emitidos').show();
                $('#nuevo').hide(); 
                $("#detalle").hide();
                $('#footer_comun').show();      
                
            }, error);
    });*/

    pMostrarPedidos();

    console.log("Boton Pedidos Pulsado FIN");

}

function testNuevo() {
    pListaNuevoPedido(localStorage['pDetalleAnterior']);
    displayDetalleNuevoPedido();
}

function checkPedidoVacio() { // Checkeamos que la tabla de nuevo Pedido tiene Articulos para enviar

    db.transaction(function (transaction) {
        var sql = "SELECT quantity as n FROM ordersPendingDetail as o WHERE idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + "";
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var cantidad = 0;
                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);
                    cantidad = cantidad + parseInt(rowDb.n);                                
                }
                if (cantidad >= 1||localStorage['pantalla_anterior']=="pedidos_plantillas_detalle") {

									pMostrarCabeceraPedido();

						
                }else {
                    console.log("Numero de Articulos " + cantidad);
                    getDescripcionAviso("pedidoVacio");
                    $("#pedidosDialogA").popup("open");
                }

            }, error);
    });
}

function checkPedidoACero() { // Checkeamos que la tabla de nuevo Pedido tiene Articulos para enviar

    db.transaction(function (transaction) {
        var sql = "SELECT COUNT(*) as n FROM ordersPendingDetail WHERE idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + "";
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
					console.log("Ressultado " + result.rows.item(0).n);
                if (result.rows.item(0).n > 0) {
					console.log("Ressultado " + result.rows.item(0).n);
					getDescripcionAviso("guardarBorrador");
					$("#pedidosDialogAC").popup("open");
						
                } else {
                    getDescripcionAviso("pedidoVacio");
                    $("#pedidosDialogA").popup("open");
                }

            }, error);
    });
}

function pRefrescarPantallaActual() {
		
	if(localStorage['pantalla']=="emitidos") {
		
		pMostrarPedidos();
		
		 //alert("pedidos!!!!");
	} else if(localStorage['pantalla']=="pedidos_plantillas") {
		pMostrarTodasPlantillas();
	} 
 	
}


/*
Funcion utilizada para limpiar variables globales
*/
function pLimpiarParametrosTemporales(){
	
	$('#pDivCheckPrecioDetallePedido').html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');;
	$('#pLbpedidosDetalleNuevoPrecio').html('<label id="pLbpedidosDetalleNuevoPrecio" style="font-weight: bold; margin-bottom: 0px;text-align: center;">Mostrar precios</label>');
	
	localStorage['panatalla_anterior']="";


}
