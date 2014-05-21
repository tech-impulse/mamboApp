
function pGlobalEscanerAnadirArticulo(EAN, idLogisticChain, unidades, idCentroCompra) {
	
		
		//Recuperar info del item para recuperar el Vendor
		var q="SELECT DISTINCT c.idVendor FROM EANS as e, catalog as c WHERE e.idItem=c.idItem AND e.idEAN='"+EAN+"' AND c.idPurchaseCenter="+idCentroCompra+" AND c.idLogisticsChains='"+idLogisticChain+"' AND isPrimaryVendor=1 ";
		console.log("SQL pGlobalEscanerAnadirArticulo---> " + q);
        db.transaction(function (tx) {
        tx.executeSql(q, undefined,
		   function (tx, result) {
                console.log("SQL pGlobalEscanerAnadirArticulo--- EJECUTADA");
            	//SELECT c.idVendor FROM EANS as e, catalog as c WHERE e.idItem=c.idItem AND e.idEAN='079298100113' 8413511070028 AND c.idPurchaseCenter=1603 AND c.idLogisticsChains='312' AND isPrimaryVendor=1
                if (result.rows.length == 1) {
					        
					        //Buscamos si ya existe un borrador del mismo Proveedor
					        var idVendor=result.rows.item(0).idVendor;
					        q="SELECT * FROM ordersPending WHERE idPurchaseCenter="+idCentroCompra+" AND idVendor="+idVendor+" AND tipoInterno="+TIPO_TEMPORAL_DRAFT+" AND unfinished='TRUE'";

					        console.log("SQL pGlobalEscanerAnadirArticulo---> " + q);
					        tx.executeSql(q, undefined,
            				function (tx, res1) {

            					   console.log("SQL pGlobalEscanerAnadirArticulo--- EJECUTADA");
            						if (res1.rows.length == 1) {
            							
            							 	//YA existe un borrador: Añadir 
            							 	localStorage['pNuevoPedidoIntenalId']=res1.rows.item(0).idInternalOrder;
											var longname = $('#LbTituloInsertarPedido').text();
											var name=longname.substr(longname.indexOf("-") + 2);
											var chainName=$('#LbTituloInsertarPedido').val();
            							 	pInsertarDetallePedidoTemporal($("#LbTituloInsertarPedido").val(), idLogisticChain, unidades, name, chainName);
            							 	
            							 	console.log("LOG: Insertado correctamente en internalOrder." + res1.rows.item(0).idInternalOrder);
            							 	
            						} else if (res1.rows.length > 1) {
            							
	            							// Existe mas de un borrador
	            							console.log("WANING: Existe más un borrador para este proveedor.");
            							
            						} else {
            								//No existe un borrador: Crear borrador (pendiente) y añadir
            								pCrearPedidoTemporal(idCentroCompra, idVendor, 2 );
											var longname = $('#LbTituloInsertarPedido').text();
											var name=longname.substr(longname.indexOf("-") + 2);
											var chainName=$('#LbTituloInsertarPedido').val();
            								pInsertarDetallePedidoTemporal($("#LbTituloInsertarPedido").val(), idLogisticChain, unidades, name, chainName);
            								console.log("LOG: Pedido temporal creado y añadido (internalOrder." + localStorage['pNuevoPedidoIntenalId'] + ")");
                                            updateFiltroProveedor(); // Recargamos Filtro por proveedor con el nuevo articulo.
            						}
                                    //pListaTodosArticulosGlobalesBorradores(); 
								pRellenarGridNuevoPedido();
            				});
                    
             
                } else if (result.rows.length > 0) {
                	
					        console.log("ERROR: Este EAN y cadena logistica tiene mas de una posibilidad. (Provvedor principal)");
					        
				} else {
					      	
                	console.log("ERROR: No existe los datos en el catalogo.");
                	
                }

            }, error);

    });
}


function updateFiltroProveedor(){

	// FILTRO DE NIVEL 2
	
	function onClose() {
			filtrarPorProveedor();
           };

            db.transaction(function (transaction) {
        var sql = "SELECT distinct o.idVendor as id, v.name as name FROM ordersPending as o, vendors as v WHERE o.idPurchaseCenter="+localStorage["pNuevoPedidoIdCentro"]+" AND o.tipoInterno="+TIPO_TEMPORAL_DRAFT+" AND o.unfinished='TRUE' AND v.idVendor=o.idVendor ORDER BY o.idVendor DESC ";

            transaction.executeSql(sql, undefined,
                function (transaction, result) {
                    var i = 0;
                    var lista = [];

                    for (i = 0; i < result.rows.length; i++) {
                          var vendors = result.rows.item(i);

                        lista.push({
                            id: vendors.id,
							nombre: vendors.name
                        });

                    }
					if (i == 0) {
                        $('#selectProveedor').kendoDropDownList({
                            dataSource: {
                                data: lista
                            },
							close: onClose,
                            dataTextField: 'nombre',
                            dataValueField: 'todos',
							 optionLabel: "Todos",
                        }).data("kendoDropDownList");
                    }
                    else if (i == 1) {
                        $('#selectProveedor').kendoDropDownList({
                            dataSource: {
                                data: lista
                            },
							close: onClose,
                            dataTextField: 'nombre',
                            dataValueField: 'id',
                        }).data("kendoDropDownList");
                    } else {
                        $('#selectProveedor').kendoDropDownList({
                            dataSource: {
                                data: lista
                            },
							close: onClose,
                            dataTextField: 'nombre',
                            dataValueField: 'id',
                            optionLabel: "Todos",
                        }).data("kendoDropDownList");
                    }

                }, error6);
        });


	
}

function filtrarPorProveedor() {

    localStorage["pedidos_filtro_id_proveedor"] = $("#selectProveedor").val();
    pRellenarGridNuevoPedido(localStorage["pedidos_filtro_id_proveedor"]); // Habrá que llamarla con un flag de filtro como arriba

}

function checkBorradoresAnteriores()
{
		$("#pedidosDialogAC").popup("close"); 
		insertLog(3,7,"Inicio de pedido global","IdInterno"+localStorage['pNuevoPedidoIntenalId']+", Proveedor"+localStorage['pNuevoPedidoIdProveedor']+", Centro: "+localStorage['pNuevoPedidoIdCentro']);
    
    db.transaction(function (transaction) {
    var sql = "SELECT * FROM ordersDraft as d WHERE d.isGlobalScanner=1";   
    console.log("SQL ---> " + sql);
    transaction.executeSql(sql, undefined,
        function (transaction, result) {
            var i = 0;

            if (result.rows.length>0) {

                console.log("Hay " + result.rows.length + " borradores Anteriores con id " + result.rows.item(0).idInternalOrder );
                getDescripcionAviso("existenBorradores");
				setTimeout(' $("#pedidosDialogAC").popup("open");',1000);
                   

            }
            else
            {
                pListaNuevoPedidoVacio("escaner"); // genera la grid de kendo cargando la orden de la tabla temporal (vacia)
                localStorage.setItem('ModoEscaner', "1");  
                console.log("No hay borradores de Pedido Global");
                getDescripcionAviso("pedidoEscaner");
			    $("#InCodigoEan").val("");
				setTimeout('$("#pDialogInsertEan").popup("open");',1000);

            }

        }, error6);
    });
}