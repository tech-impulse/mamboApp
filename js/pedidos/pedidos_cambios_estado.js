
function pCrearPedidoTemporal(idCentro, idProveedor, tipoIn) {
	
    var purchaseCenter = localStorage['pNuevoPedidoIdCentro'];
    var vendor = localStorage['pNuevoPedidoIdProveedor'];
    var tipo=TIPO_TEMPORAL_ORDER; 
    if (idCentro != undefined && idProveedor!= undefined ) {
    	
    		purchaseCenter = idCentro;
    		vendor = idProveedor;
    		tipo=tipoIn;
    		
    }
    
    db.transaction(function (tx) {
    	
    		var sql="";
       		
        // buscamos el primer idLibre 
        var sql = "SELECT MAX(idInternalOrder) as lastId FROM ordersPending";
        var id = 0;
        tx.executeSql(sql, undefined,
            function (tx, result) {
            	
                if ( result.rows.length > 0 ) { id = result.rows.item(0).lastId; }


        				if ( localStorage['pLastInternalOrder'] > id ) {	id = parseInt(localStorage['pLastInternalOrder']); } 
        				else { id= id + 1; }
     
                //GUARDAMOS LA CABECERA
                sql = 'INSERT INTO ordersPending (idInternalOrder, idVendor, idPurchaseCenter ,   status ,  username, operacion, tipoInterno ) ' +
                    ' VALUES (' + id + ', "' + vendor + '", "' + purchaseCenter + '",  3 , "' + localStorage['usuario'] + '", "N", '+tipo+')';
                console.log("ID INTERNO NUEVO PEDIDO NUEVO 333333= " + sql);
                tx.executeSql(sql, undefined,
                    function () {
                    	
                    	localStorage['pLastInternalOrder']=id + 1;
                    	
                    	}, error);
								
								
								
                localStorage['pNuevoPedidoIntenalId'] = id;
								
								return id;
            }, error);

    });
}


/*
	Finalizar un pedido
*/
function pCerrarPedidoTemporal(idDeliveryZone, observaciones, fechaEnt) {

    var id = localStorage['pNuevoPedidoIntenalId'];

    console.log("INICIO CERRAR el pedido ");
    var idOrder = localStorage['pNuevoPedidoIntenalId'];

		var fechaEntrega=fechaEnt.substr(0,4)+"-"+fechaEnt.substr(5,2)+"-"+fechaEnt.substr(8,2)+" 00:00:00";
		
    db.transaction(function (tx) {

        //idDeliveryZone 	Parametro
        //reference 			Calculado = idPurchaseCenter+sourceId+number 
        //documentDate 		Calculado NOW() 
        //amount 					0
        //currency        de PurchaseCenter
        //number 					Numero correlativo de pedido para el proveedor
        //sourceId 				???
        //type 						???
        //observaciones 	Parametro
        //unfinished			0

        // buscamos infomación general y relativa al purchaseCenter
        var sql = "SELECT c.currency, o.idVendor, o.idPurchaseCenter, o.reference FROM purchaseCenters as c, ordersPending as o WHERE o.idPurchaseCenter=c.idPurchaseCenter AND o.idInternalOrder=" + idOrder;
        var id = 0;
        var reference = currency = "";

        //console.log("INICIO CERRAR111 el pedido " + sql);

        tx.executeSql(sql, undefined,
            function (tx, result) {

                
                if (result.rows.length > 0) {
                	
                	
                		//Ponemos el valor correcto de Operacion
										//N= nueva , D= Borrar, M= modificar
										
                	
                    reference = "TmpP" + idOrder;
                    currency = result.rows.item(0).currency;

                    sql = 'UPDATE ordersPending SET idDeliveryZone="' + idDeliveryZone + '" , reference="' + reference + '" , unfinished=0, documentDate="' + nowBD() + '", deliveryDate="' + fechaEntrega + '", ' +
                        ' currency="' + currency + '", observaciones="' + observaciones + '" WHERE idInternalOrder=' + idOrder;

                    console.log("CERRAR PEDIDO TEMPORAL = " + sql);
                    
                    
                    tx.executeSql(sql, undefined, function () {});
                       
                    
		                //BORRAMOS las lineas que tengan error
		                 
                  /*  sql="DELETE FROM ordersPendingDetail as o WHERE idInternalOrder=" + idOrder;    
                    
                    console.log("!!!!!!!!!!!!!!!!!!!!!ELIMINANDO ==> "+ sql);
                   
                    db.transaction(function (tx3) {
                    
	                    tx3.executeSql(sql, undefined,
	                    	function () {
	                    			
	                    			//Recalculamos el numero de linea
	                        	sql="SELECT * FROM ordersPendingDetail WHERE idInternalOrder=" + idOrder;
	                        	tx3.executeSql(sql, undefined,
	            								function (tx3, detail) {
	                        				
		                        				for (var i=0; i < detail.rows.length ; i++ ) {
		                        					
		                        					update="UPDATE ordersPendingDetail SET lineNumber="+(i+1)+" WHERE idInternalOrder=" + idOrder+ " AND lineNumber="+ detail.rows.item(i).lineNumber ;	
					                        		console.log("ACTUALIZANDO ==> " + update);
					                        		db.transaction(function (tx4) {
					                        			tx4.executeSql(update, undefined, function (tx3) {} );
					                        			});
		                        				}
		                        			
	                        				 db.transaction(function (tx4) {
			                        				sql="DELETE FROM ordersDraft WHERE idInternalOrder=" + result.rows.item(0).reference;
						                        	tx4.executeSql(sql, undefined, function (tx, detail) { } );
						                        	
						                        	sql="DELETE FROM ordersDraftDetail WHERE idInternalOrder=" + result.rows.item(0).reference;
						                        	tx4.executeSql(sql, undefined, function (tx, detail) { } );
				            							
				            						   });
	                        				
	                        		});
	                        		
	                    	}	, error);  
										}	, error);   	*/
										
										
									$("#ptxtObservacionesCabecera").val("");
                } else {
                    console.log("ERROR AL CERRAR EL PEDIDO TMP Centro de compra inexistente.");

                }

            }, error);
            

    });

}

/*
		Elimina de la tabla orders pending un pedido
*/
function pEliminarPedidoTemporal(idOrden) {
	
	if (idOrden!="undefined") {
		var id = localStorage['pNuevoPedidoIntenalId'];	
	} else {
		var id	=idOrden;
	}
	
	db.transaction(function (tx) {
		// buscamos el primer idLibre 
		var sql = "DELETE FROM ordersPending WHERE idInternalOrder=" + id;
		tx.executeSql(sql, undefined,
			function (tx) {
				console.log("Pedido Eliminado");
			}, error);

		sql = "DELETE FROM ordersPendingDetail WHERE idInternalOrder=" + id;
		tx.executeSql(sql, undefined,
			function (tx) {}, error);
	});

	if (localStorage['pantalla'] == "pedidosDetalleNuevoEscaner"); {
		var pedidos = [];
		db.transaction(function (tx) {
			var sql = "SELECT * FROM ordersPending WHERE unfinished='TRUE' AND tipoInterno="+TIPO_TEMPORAL_DRAFT;
			tx.executeSql(sql, undefined,
				function (tx, result) {
					if (result.rows.length > 0) {
						for (i = 0; i < result.rows.length; i++) {
							var rowDb = result.rows.item(i);
							pedidos.push({
								id: rowDb.idInternalOrder
							});
						}

						db.transaction(function (tx) {
							sql = "DELETE FROM ordersPending WHERE unfinished='TRUE' AND tipoInterno="+TIPO_TEMPORAL_DRAFT;
							tx.executeSql(sql, undefined,
								function (tx) {
									console.log("Eliminamos todos los pedidos Globales");
								}, error);

							for (i = 0; i < pedidos.length; i++) {
								sql = "DELETE FROM ordersPendingDetail WHERE idInternalOrder=" + pedidos[i].id + "";
								tx.executeSql(sql, undefined,
									function (tx) {
										console.log("Eliminamos todos los Articulos de pedidos Globales");
									}, error);

							}
						});

					}
				}, error);
		});
	}
}

function pEliminarArticuloPedidoTemporal(id) {
    var idOrder = localStorage['pNuevoPedidoIntenalId'];
    db.transaction(function (tx) {
        // buscamos el primer idLibre 
        var sql = "DELETE FROM ordersPendingDetail WHERE idInternalOrder="+idOrder+" AND idItem=" + id;
        
        console.log("BORRANDO EL ARTICULO = "+sql);
        tx.executeSql(sql, undefined,
            function (tx) {
                console.log("Articulo Eliminado");
            }, error);

    });
}


/*
		Inserta un articulo en un pedido temporal
*/
function pInsertarDetallePedidoTemporal(idItem, idLogisticChain, quantity, itemName, logisticsChainName) {
    db.transaction(function (tx) {
        var idOrder = localStorage['pNuevoPedidoIntenalId'];

        var sql = "SELECT MAX(lineNumber) as l FROM ordersPendingDetail WHERE idInternalOrder=" + idOrder;
        var nl = 0;

        var unitType = idLogisticChain.substr(0, 1);
        var ordinalType = idLogisticChain.substr(1, idLogisticChain.length).replace(",",".");
        tx.executeSql(sql, undefined,
            function (tx, result) {
                if (result.rows.length > 0) {
                    if (result.rows.item(0).l == undefined) {
                        nl = 0;
                    } else {
                        nl = result.rows.item(0).l;
                    }
                }

                nl++;

								var itemName="";
								var logisticsChainName="";
                var insert = 'INSERT INTO ordersPendingDetail (idInternalOrder, lineNumber, idItem , quantity , idLogisticsChain, unitType ,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus ) ' +
                    'VALUES (' + idOrder + ', "' + nl + '", "' + idItem + '", "' + quantity + '",  "' + idLogisticChain + '", "' + unitType + '", "' + ordinalType + '", "'+itemName + '", "0", "'+ logisticsChainName + '", "0")';

                console.log(insert);

                tx.executeSql(insert, undefined,
                    function (tx) {
						if (localStorage["ModoEscaner"]!="1")
                        pMostrarArticulos();
						else if (localStorage["ModoEscaner"]=="1" && (localStorage["pantalla"]=="pedidosDetalleNuevo" || localStorage["pantalla"]=="pedidosDetalleNuevoEscaner"))
							pRellenarGridNuevoPedido();
                    }, error);
            }, error);
    });


}


/*
		Modifica un articulo de un pedido temporal
*/			
function pModificarDetallePedidoTemporal(idItem, idLogisticChain, quantity) {
    db.transaction(function (tx) {
        var idOrder = localStorage['pNuevoPedidoIntenalId'];
        var update = "UPDATE ordersPendingDetail SET " +
            "idLogisticsChain='" + idLogisticChain + "', " +
            "quantity='" + quantity + "' WHERE idItem='" + idItem + "' AND idInternalOrder='" + idOrder + "'";
        console.log(update);

        tx.executeSql(update, undefined,
            function (tx) {

                if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner")
                    pRellenarGridNuevoPedido();
                else if  (localStorage["pantalla"] == "insertarArticulos")
                    pMostrarArticulos();
                else if (localStorage["ModoEscaner"] == "1")
		        {
				   console.log("Abrimos por modoScaner");
		           $("#pDialogInsertEan").popup("open"); 
                   //setTimeout('$("#InCodigoEan").focus();',1000);
		        } 
            }, error);

    });
}



/*
	
*/
function pGuardarPedidoTemporalComoBorrador(idOrder, param) {
			
    console.log("Es un pedido Global? " + param);
    var global = param;

  	// buscamos infomación general y relativa al purchaseCenter
    var sql = "SELECT * FROM ordersPending  WHERE idInternalOrder="+idOrder;
    var estadoBorrador= 2;

    db.transaction(function (tx) {
        
    //console.log("INICIO GUARDAR BORRADOR el pedido "+sql)	;
    tx.executeSql (sql, undefined, 
			function (tx, res)
			{

				
      	if (res.rows.length > 0) 
				{
						var cab = res.rows.item(0);
						
						if ( cab.tipoInterno == TIPO_TEMPORAL_DRAFT ) {
					  	//YA existe el borrador, borra por completo y se crea otro
					  	
					  	sql = "DELETE FROM ordersDraftDetail WHERE idInternalOrder="+cab.reference;
	 						
	 						console.log("BORRAMOS LA ORDEN ANTERIOR!!!!" + sql);
	 						 						
					    tx.executeSql (sql, undefined,  
					      function (tx) 
					      { 
					      	console.log("BORRADO 111111");
					  			sql = "DELETE FROM ordersDraft WHERE idInternalOrder="+cab.reference; 						
							    tx.executeSql (sql, undefined,  function (tx) { 
							    								    	
							    	console.log("BORRADO 222222" + sql); 
							    	
							    	sql = "SELECT MAX(idInternalOrder) as n FROM ordersDraft ";
				 						//console.log("INICIO 222222 BORRADOR el pedido "+sql)	;
				 						
								    tx.executeSql (sql, undefined,  
								      function (tx, maxDraft) 
								      { 

													//Nuevo pedido guardar como NUEVO BORRADOR 
									      	
									      	var idDraft=1;
									      	
									      	if (maxDraft.rows.length > 0) 
													{
														console.log(maxDraft);
														
									      		idDraft=maxDraft.rows.item(0).n;
									      		idDraft++;
									      	}
												
																
								      	//PREPARAMOS LA CABECERA
								      	var datos = {};
								      	datos.idInternal=idDraft;
								      	datos.idVendor=cab.idVendor;
								      	datos.idPurchaseCenter=cab.idPurchaseCenter;
								      	datos.idDeliveryZone=cab.idDeliveryZone;
								      	datos.reference=cab.reference;
								      	datos.status=estadoBorrador;
								      	datos.documentDate=nowBD();
								      	datos.amount=cab.amount;
								      	datos.currency=cab.currency;
								      	datos.observaciones=cab.observaciones;
								      	datos.number=cab.number;
								      	datos.sourceId=cab.sourceId;
								      	datos.type=cab.type;
								      	
								      	insert= getQueryInsertOrderDraft(datos, global);
								      	console.log(insert);
								      	
												tx.executeSql (insert, undefined,  
									      function (tx) 
									      { 
									      		//PREPARAMOS LAS LINEAS 
						  			      	var insert2="INSERT INTO ordersDraftDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus ) SELECT "+idDraft+", lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;
						  			      	console.log(insert2);
											      tx.executeSql (insert2, undefined,  
											      function (tx) 
											      { 
											      		
				                        console.log("Eliminamos el pedido temporal con ID " + datos.idInternal);
				                        pEliminarPedidoTemporal(datos.idInternal);   
				                                                                               
				                        setInterval(pRefrescarNotificaciones(),200);
											    	}, errorTX);	
									    	}, errorTX2);	     	
								      	
								      }, error);
							    	
							    	
							    	
							    });
					  		});
					  	
					  } else  if (cab.tipoInterno==TIPO_TEMPORAL_ORDER ) {

							sql = "SELECT MAX(idInternalOrder) as n FROM ordersDraft ";
	 						//console.log("INICIO 222222 BORRADOR el pedido "+sql)	;
	 						
					    tx.executeSql (sql, undefined,  
					      function (tx, maxDraft) 
					      { 
					      	
									//Nuevo pedido guardar como NUEVO BORRADOR 
					      	
					      	var idDraft=1;
					      	
					      	if (maxDraft.rows.length > 0) 
									{
										console.log(maxDraft);
										
					      		idDraft=maxDraft.rows.item(0).n;
					      		idDraft++;
					      	}
									
									
									
					      	//PREPARAMOS LA CABECERA
					      	var datos = {};
					      	datos.idInternal=idDraft;
					      	datos.idVendor=cab.idVendor;
					      	datos.idPurchaseCenter=cab.idPurchaseCenter;
					      	datos.idDeliveryZone=cab.idDeliveryZone;
					      	datos.reference=cab.reference;
					      	datos.status=estadoBorrador;
					      	datos.documentDate=nowBD();
					      	datos.amount=cab.amount;
					      	datos.currency=cab.currency;
					      	datos.observaciones=cab.observaciones;
					      	datos.number=cab.number;
					      	datos.sourceId=cab.sourceId;
					      	datos.type=cab.type;
					      	
					      	insert= getQueryInsertOrderDraft(datos, global);
					      	console.log(insert);
					      	
									tx.executeSql (insert, undefined,  
						      function (tx) 
						      { 
						      		//PREPARAMOS LAS LINEAS 
			  			      	var insert2="INSERT INTO ordersDraftDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus  ) SELECT "+idDraft+", lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;
			  			      	console.log(insert2);
								      tx.executeSql (insert2, undefined,  
								      function (tx) 
								      { 
								      		
	                        console.log("Eliminamos el pedido temporal con ID " + datos.idInternal);
	                        pEliminarPedidoTemporal(datos.idInternal);  
	                                                                        
								    	}, errorTX);	
						    	}, errorTX2);	     	
					      	
					      	
					      	setInterval(pRefrescarNotificaciones(),200);      
					      	
					      }, error);
				   	}
 
      	} else {
      		console.log("ERROR GUARDAR BORRADOR Pedido Inexitente.");
      		
      	}
		    
      }, error);
  	
  });
}

/*
    
*/
function pActualizarPedidoTemporalComoBorrador(idOrder, idDraft) {

    console.log("Es un pedido Global? " );
    //var global = param;

    // buscamos infomación general y relativa al purchaseCenter
    var sql = "SELECT * FROM ordersPending as o, ordersPendingDetail as d  WHERE o.idInternalOrder=d.idInternalOrder AND o.idInternalOrder="+idOrder ;
    var estadoBorrador= 2;
    var nl=1;
    var insert2="";
    console.log("PASO 1 " + sql ); 
    db.transaction(function (tx) {
        
        //console.log("INICIO GUARDAR BORRADOR el pedido "+sql) ;
        tx.executeSql (sql, undefined, 
            function (tx, res)
            {

                for (var i=0; i < res.rows.length; i++ )  
                
                {
                    

                    var linea = res.rows.item(i);


                        
                    sql="SELECT * FROM ordersDraftDetail WHERE idInternalOrder="+idDraft+" AND idItem="+linea.idItem ;


                    console.log("Iteracion " + i + " --> " + sql  );

                    tx.executeSql (sql, undefined,  
                      function (tx, borradores) 
                      { 


                        if( borradores.rows.length > 0)  
                        {
                            //EXISTE el articulo en los borradores => Actualizar
                            var sql2="UPDATE ordersDraftDetail SET quantity="+linea.quantity+", idLogisticsChain='"+linea.idLogisticsChain+"', ordinalType='"+linea.ordinalType+"', unitType='"+linea.unitType+"' WHERE idInternalOrder="+idDraft+" AND idItem="+borradores.rows.item(0).idItem+ " AND idInternalOrder="+idDraft ;

                            console.log("EXISTE EL ELEMENTO!!! " + sql2 );

                                    tx.executeSql (sql2, undefined,  function (tx) { 
                                        console.log("LO HAGO 22222!!!!" + sql2);  
                                    },error);  

                            console.log("FINAL !!!!!!!!!!!!!!! ");

                        } else {
                            //NO esta incluido => Insertar
                            
                            insert2="INSERT INTO ordersDraftDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus  ) SELECT "+idDraft+", "+nl+", idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType, , itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersPendingDetail WHERE idItem="+linea.idItem+" AND idInternalOrder="+idDraft;

                            console.log("NO EXISTE " + insert2 );
                            
                            tx.executeSql (insert2, undefined,  function (tx) {
                            });    
                           

                        }
                    });
                
                console.log("Eliminamos el pedido temporal con ID " + idOrder);
                pEliminarPedidoTemporal(idOrder); 
								
				setInterval(pRefrescarNotificaciones(),200);
                }
            }
        );

    
  });
}

/*
    
*/
function pGuardarPedidoGlobalTemporalComoBorrador() {

	// buscamos infomación general y relativa al purchaseCenter
    if (localStorage["actualizarPedidoGlobal"] == 0) {
			var sql = "SELECT p.idInternalOrder, d.idInternalOrder as idDraft FROM ordersPending as p LEFT JOIN ordersDraft as d ON p.idVendor=d.idVendor AND p.idPurchaseCenter=d.idPurchaseCenter AND isGlobalScanner=1 WHERE unfinished='TRUE' AND tipoInterno="+TIPO_TEMPORAL_DRAFT;
    	//var sql = "SELECT p.* FROM ordersPendingDetail as p WHERE p.idInternalOrder="(localStorage['pLastInternalOrder']-1);
		}
    else {
      var sql = "SELECT p.idInternalOrder, d.idInternalOrder as idDraft FROM ordersPending as p LEFT JOIN ordersDraft as d ON p.idVendor=d.idVendor AND p.idPurchaseCenter=d.idPurchaseCenter AND isGlobalScanner=1 WHERE unfinished='TRUE' AND tipoInterno="+TIPO_TEMPORAL_DRAFT+" GROUP BY d.idVendor";
    }


	var idVendor;
	var idPurchaseCenter;
	db.transaction(function (tx) {

		console.log("INICIO GUARDAR BORRADOR el pedido " + sql);
		tx.executeSql(sql, undefined,
			function (tx, result) {

				if (result.rows.length) {
					var numPedidos = 0;

					//Pedido glogal sin actualizar los borradores anteriores
					if (localStorage["actualizarPedidoGlobal"] == 0) {
						for (var i = 0; i < result.rows.length; i++) {
							var rowDb = result.rows.item(i);
								numPedidos = rowDb.idInternalOrder;
								idVendor = rowDb.idVendor;
								idPurchaseCenter = rowDb.idPurchaseCenter;
							console.log("No queremos hacer UPDATE, asi que hacemos INSERT de Nuevo Boorrador " + rowDb.idInternalOrder)
							pGuardarPedidoTemporalComoBorrador(numPedidos, "1");
						}

					} else {

						//Los nuevos borradores se añadiran a los antiguos en caso de existir


						for (var i = 0; i < result.rows.length; i++) {
							var rowDb = result.rows.item(i);
							numPedidos = rowDb.idInternalOrder;
							idVendor = rowDb.idVendor;
							idPurchaseCenter = rowDb.idPurchaseCenter;



							if (rowDb.idDraft != null) {
								//Existe un borrador => Actualizar 

								console.log("El Pedido existe y hay que hacer UPDATE idOrder " + numPedidos + " idDraft" + rowDb.idDraft);
								pActualizarPedidoTemporalComoBorrador(numPedidos, rowDb.idDraft);

							} else {
								//No existe borrador => Crear uno nuevo 
								console.log("El pedido temporal no existe en borradores, lo insertamos " + numPedidos)
								pGuardarPedidoTemporalComoBorrador(numPedidos, "1");

							}



							console.log("Numero de pedidos " + rowDb.idInternalOrder);
						}
					}
					getDescripcionAviso("borradoresGuardados");
					$("#pedidosDialogA").popup("open");
					//pBorrarPedidosPendientes();

				} else {
					console.log("ERROR GUARDAR Pedido Global como borradores.");

				}
			}, error);

	});
}


/*

*/
function pGuardarPlantillaComoPedidoTemporal(reference, tipo) {

	var estadoPendienteEnviar = 3;
	var operacion = tipo;
	var insert = "";
	console.log("El tipo essssss " + tipo);

		localStorage['proveedor_seleccionado'] = $('#pTxtNuevoPedidoPlantillaProveedor').val();
		localStorage['centro_seleccionado'] = $('#pTxtNuevoPedidoPlantillaCentro').val(); //pTxtNuevoPedidoPlantillaProveedor
/*	
	else if ($('#pTxtNuevoPedidoPlantillaCentro').val()=="") {
		localStorage['proveedor_seleccionado'] = $('#pTxtNuevoPedidoPlantillaProveedor').val();
		localStorage['centro_seleccionado'] = $('#pTxtNuevoPedidoPlantillaProveedor').val();
	}*/


	db.transaction(function (transaction) { // Comprobamos que el envio no es de tipo manual

		var sql = "SELECT r.vendorCommunicationType as tipo, v.name as nombre FROM relPurchaseCenter_Vendors as r, vendors as v, purchaseCenters as c WHERE v.name='" + localStorage['proveedor_seleccionado'] + "' AND c.name='" + localStorage['centro_seleccionado'] + "' AND r.idVendor=v.idVendor";
		transaction.executeSql(sql, undefined,
			function (transaction, res) {
				console.log("CONSULTA PROVEEDOR SI ES DE TIPO MANUAL" + sql);
				if (res.rows.item(0).tipo != "Manual" || localStorage["dispositivo"] == "PC") { // Si no es de tipo manual o es un PC
					db.transaction(function (tx) {

						// buscamos infomación general y relativa al purchaseCenter
						var sql = "SELECT * FROM ordersTemplates  WHERE reference='" + reference + "'";

						console.log("INICIO GUARDAR PLANTILLA como pending el pedido " + sql);

						tx.executeSql(sql, undefined,
							function (tx, cabecera) {

								console.log("INICIO 2222 el pedido " + reference);

								if (cabecera.rows.length > 0) {
									var cab = cabecera.rows.item(0);

									sql = "SELECT MAX(idInternalOrder) as lastId FROM ordersPending";
									var id = 0;
									tx.executeSql(sql, undefined,
										function (tx, result) {

											if (result.rows.length > 0) {
												id = result.rows.item(0).lastId;
											}

											if (localStorage['pLastInternalOrder'] > id) {
												id = localStorage['pLastInternalOrder'];
											} else {
												id = id + 1;
											}


											var idtmp = id;

											//PREPARAMOS LA CABECERA
											var data = {};
											data.idInternal = idtmp;
											data.idVendor = cab.idVendor;
											data.idPurchaseCenter = cab.idPurchaseCenter;
											data.idDeliveryZone = cab.idDeliveryZone;
											data.reference = cab.reference;
											data.status = estadoPendienteEnviar;
											data.documentDate = cab.documentDate;
											data.amount = cab.amount;
											data.currency = cab.currency;
											data.observaciones = cab.name;
											data.number = cab.number;
											data.sourceId = cab.sourceId;
											data.type = cab.type;



											//Guardamos en el localstoraje el id de la plantilla a modificar
											localStorage["pIdPlantillaModificada"] = cab.idTemplate;
											//Operacion M = modificar
											var operacion="M";
											if (tipo == 0 ) {
												operacion="N";
											}
											
											insert = getQueryInsertOrderPending(data, tipo, 'M');
											console.log(insert);
											tx.executeSql(insert, undefined,
												function (tx) {
													//PREPARAMOS LAS LINEAS 

													var insert2 = "INSERT INTO ordersPendingDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus  )  SELECT " + idtmp + ", lineNumber, idItem ,  0 ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersTemplatesDetail WHERE idTemplate=" + cab.idTemplate+" AND itemStatus=0 AND logisticsChainStatus=0";
													console.log("Insertar Articulos en pedido temporal SQL --> " + insert2);
													tx.executeSql(insert2, undefined,
														function (tx) {
															localStorage['pNuevoPedidoIntenalId'] = idtmp;
															localStorage["pNuevoPedidoIdCentro"] = data.idPurchaseCenter;
															localStorage["pNuevoPedidoIdProveedor"] = data.idVendor;
															pListaNuevoPedido(idtmp);

															//displayDetalleNuevoPedido();

															pRellenarGridNuevoPedido(localStorage["pNuevoPedidoIdProveedor"], operacion);

															localStorage["proveedor_seleccionado"] = $('#pTxtNuevoPedidoPlantillaCentro').val();
															localStorage["centro_seleccionado"] = $('#pTxtNuevoPedidoPlantillaProveedor').val();
															$('#pLbCentroSeleccionado').text("> " + localStorage["centro_seleccionado"]);
															$('#pLbProveedorSeleccionado').text(" > " + localStorage["proveedor_seleccionado"]);

														});
												});
											setInterval(pRefrescarNotificaciones(), 300);
										});
								} else {
									console.log("ERROR  GUARDAR PLANTILLA Pedido Inexitente.");

								}

							}, error);

					});


				} else {
					$("#pDialogInsertEan").popup("close");
					getDescripcionAviso("proveedorManual");
					setTimeout('$("#pedidosDialogAC").popup("open");', 700);
					console.log("Proveedor Manual");
				}

			});
	});

}



/*
	Pasa una plantilla temporal a Definitiva 
*/

function pGuardarPedidoTemporalComoPlantillaExistente(idOrder) {

    var estadoBorrador = 2;
    var insert = "";

    db.transaction(function (tx) {


				var sql = "SELECT t.idTemplate, o.reference  FROM ordersPending as o, ordersTemplates as t WHERE o.reference=t.reference AND o.idInternalOrder=" + idOrder;
                console.log("SQL--> " + sql)

				tx.executeSql(sql, undefined,
            function (tx, pending) {
            	if (pending.rows.length > 0 ) {
            		
            		var ref=pending.rows.item(0).reference;
            		var idTemplate=pending.rows.item(0).idTemplate;
            		
            		//Modifica la cabecera definitiva
				        sql = "UPDATE ordersTemplates SET " +
				            "idDeliveryZone=(SELECT idDeliveryZone FROM ordersPending WHERE reference=" + idOrder + "), " +
				            "reference=(SELECT reference FROM ordersPending  WHERE idInternalOrder=" + idOrder + "), " +
				            "name=(SELECT reference FROM ordersPending  WHERE   idInternalOrder=" + idOrder + "), " +
				            "amount=(SELECT reference FROM ordersPending WHERE   idInternalOrder=" + idOrder + ") " +
				            " WHERE reference='" + ref+"'" ;
				
				        console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
				
				        tx.executeSql(sql, undefined,
				            function (tx) {
				            	
				                //BORRAMOS TODO EL DETALLE
				                sql = "DELETE FROM ordersTemplatesDetail WHERE idTemplate=" + idTemplate;
				                 console.log("SQL--> " + sql)
				               
				                tx.executeSql(sql, undefined,
				                    function (tx) {
				                        //PREPARAMOS LAS LINEAS 
				                        var insert = "INSERT INTO ordersTemplatesDetail (idTemplate, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus )  SELECT "+idTemplate+", lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersPendingDetail WHERE idInternalOrder=" + idOrder;
				                        
				                        
				                        tx.executeSql(insert, undefined,
				                            function (tx) {
                                              console.log("Se ha guardado bien");
                                              pEliminarPedidoTemporal();
                                              pMostrarTodasPlantillas();  
                                            }, errorTX);
				                    }, errorTX2);
				
				            }, error);
            		
            				setInterval(pRefrescarNotificaciones(),300);
            		
            	} else {
            		console.log("ERROR AL modificar plantilla ");
            	}	
            	
            
          	}	);
            	
		});


}









/*
		Guarda un pedido temporal como una nueva plantilla
*/
function pGuardarPedidoTemporalComoPlantillaNueva(idOrder, nombre){
	
	var estadoPlantilla=1;
	var insert="";
		
	db.transaction (function (tx) 
  {
 
 		// buscamos infomación general y relativa al purchaseCenter
    var sql = "SELECT * FROM ordersPending  WHERE idInternalOrder="+idOrder;
        
    //console.log("INICIO GUARDAR BORRADOR el pedido "+sql)	;
    tx.executeSql (sql, undefined, 
			function (tx, cabecera)
			{
				
				//console.log("INICIO 2222 el pedido ")	;
				
      	if (cabecera.rows.length > 0) 
				{
						
						sql = "SELECT min(idTemplate) as n FROM ordersTemplates ";
 						//console.log("INICIO 222222 BORRADOR el pedido "+sql)	;
 						
				    tx.executeSql (sql, undefined,  
				      function (tx, max) 
				      { 
				      	
				      	var newId=1;
				      	
				      	if (max.rows.length > 0) 
								{
									
				      		newId=max.rows.item(0).n;
				      		newId--;
				      	}
				      	var cab=cabecera.rows.item(0);
				      	var data={};
				      	
				      	data.idTemplate=newId;
				      	data.idVendor=cab.idVendor;
				      	data.idPurchaseCenter=cab.idPurchaseCenter;
				      	data.idDeliveryZone=cab.idDeliveryZone;
				      	data.reference="TmpT"+newId;
				      	
				      	data.amount=cab.amount;
				      	data.currency=cab.currency;
				      	data.name=nombre;
				      	if (data.name==undefined) { data.name=""; }
				      	data.documentDate=nowBD();
				      	data.number=cab.number;
				      	data.sourceId=cab.sourceId;
				      	data.type=cab.type;
				      	
				      	
				      	var insert=getQueryInsertOrdersTemplates(data) ;
	
								console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
    						console.log(insert);
						    tx.executeSql (insert, undefined, 
									function (tx)
									{
											//PREPARAMOS LAS LINEAS 
		  			      	var insert2="INSERT INTO ordersTemplatesDetail (idTemplate, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus  )  SELECT "+newId+", lineNumber, idItem , 0 ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, 0, itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;
		  			      	console.log(insert2);
							      tx.executeSql (insert2, undefined,  
							      function (tx) 
							      { 
							      		pRefrescarNotificaciones ();
							      		
							      		pMostrarTodasPlantillas();
							      		$('#ptxtObservacionesCabecera').val("");
							      		$('#pedidosPopUpInputNombrePlantilla').val("");
							    	}, errorTX);
							    	
									}, errorTX2);
							});	
			  }
      }, error);
  	
  });
}


function pGenerarPedidoEnBaseAPedido() {

	localStorage['proveedor_seleccionado'] = $('#txtNomProveedor').val();
	localStorage['centro_seleccionado'] = $('#txtCodCentro').val();
	var ref = $('#txtCodPedido').val();
	console.log("OPCIOON NUEVO MENU " + ref);


	db.transaction(function (transaction) { // Comprobamos que el envio no es de tipo manual

		var sql = "SELECT r.vendorCommunicationType as tipo, v.name as nombre FROM relPurchaseCenter_Vendors as r, vendors as v, purchaseCenters as c WHERE v.name='" + localStorage['proveedor_seleccionado'] + "' AND c.name='" + localStorage['centro_seleccionado'] + "' AND r.idVendor=v.idVendor";
		transaction.executeSql(sql, undefined,
			function (transaction, res) {
				console.log("CONSULTA PROVEEDOR SI ES DE TIPO MANUAL" + sql);
				if (res.rows.item(0).tipo != "Manual" || localStorage["dispositivo"]=="PC") { // Si no es de tipo manual o es un PC
					db.transaction(function (tx) {
						var sql = "SELECT idOrder FROM orders  WHERE reference='" + ref + "'";

						//console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
						console.log("111111 " + sql);
						tx.executeSql(sql, undefined,
							function (tx, res) {

								if (res.rows.length > 0) {

									console.log("OK==> " + res.rows.item(0).idOrder);
									pGuardarPedidoComoPedidoTemporal(res.rows.item(0).idOrder);
									setInterval(pRefrescarNotificaciones(), 200);
								} else {
									console.log("PEDIDO NO ENCONTRADO");
								}

							});
					});

				} else {
					$("#pDialogInsertEan").popup("close");
					getDescripcionAviso("proveedorManual");
					setTimeout('$("#pedidosDialogAC").popup("open");', 700);
					console.log("Proveedor Manual");
				}

			});
	});

}


/*
	Crea un uno pedido temporal, en base a un pedido existente
*/
function pGuardarPedidoComoPedidoTemporal(idOrder) {

    var estadoPendienteEnviar = 3;
    var insert = "";

    db.transaction(function (tx) {

        // buscamos infomación general y relativa al purchaseCenter
        var sql = "SELECT * FROM orders  WHERE idOrder=" + idOrder;

        //console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;

        tx.executeSql(sql, undefined,
            function (tx, cabecera) {

                console.log("INICIO 2222 el pedido " + idOrder);

                if (cabecera.rows.length > 0) {

                sql = "SELECT MAX(idInternalOrder) as n FROM ordersPending ";
                //console.log("INICIO 222222 BORRADOR el pedido "+sql)	;

                tx.executeSql(sql, undefined,
                    function (tx, max) {

                        var newId = 1;

                        if (max.rows.length > 0) {

                            newId = max.rows.item(0).n;
                            newId++;
                        }

                        var cab = cabecera.rows.item(0);

                        //var idtmp=cab.idTemplate;

                        //PREPARAMOS LA CABECERA
                        var data = {};
                        data.idInternal = newId;
                        data.idVendor = cab.idVendor;
                        data.idPurchaseCenter = cab.idPurchaseCenter;
                        data.idDeliveryZone = cab.idDeliveryZone;
                        data.reference = cab.reference;
                        data.status = estadoPendienteEnviar;
                        data.documentDate = "";
                        data.amount = cab.amount;
                        data.currency = cab.currency;
                        data.observaciones = cab.observaciones;
                        data.number = cab.number;
                        data.sourceId = cab.sourceId;
                        data.type = cab.type;
                        var tipo = TIPO_TEMPORAL_ORDER; //Pedido
                        //Operacion N = new pedido
                        insert = getQueryInsertOrderPending(data, tipo, 'N');
                        console.log(insert);
                        tx.executeSql(insert, undefined,
                            function (tx) {
                                //PREPARAMOS LAS LINEAS 
                                var insert2 = "INSERT INTO ordersPendingDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus  )  SELECT " + newId + ", lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersDetail WHERE itemStatus=0 AND logisticsChainStatus=0 AND idOrder=" + idOrder;
                                console.log(insert2);
                                tx.executeSql(insert2, undefined,
                                    function (tx) {
                                        localStorage['pNuevoPedidoIntenalId'] = newId;
                                        localStorage["pNuevoPedidoIdCentro"] = data.idPurchaseCenter;
                                        localStorage["pNuevoPedidoIdProveedor"] = data.idVendor;
                                        pListaNuevoPedido(newId);

                                        pRellenarGridNuevoPedido();                                            
										pRefrescarNotificaciones ();
                                    }, errorTX);



                            }, errorTX2);
                    });
                } else {
                    console.log("ERROR  GUARDAR PLANTILLA Pedido Inexitente.");

                }

            }, error);

    });
}


/*
 Pasar un pedido pendiente de enviar OK a finalizado
*/
function pConfirmacionPedidoOk(idOrder, json) {


    db.transaction(function (tx) {
 
        // buscamos infomación general y relativa al purchaseCenter
        
        var cab= json.body.entity;
        
        var params=[];
        
        var sql = "INSERT OR IGNORE INTO orders ( idOrder , idVendor , idPurchaseCenter , idDeliveryZone , reference , status , deliveryDate , documentDate, amount, currency, number, sourceId , type , observaciones ) values (";
        
        sql=sql+" '"+ cab.internalId+ "' ,";
				sql=sql+" '"+ cab.vendorId+ "' ,";
				sql=sql+" '"+ cab.purchaseCenterId+ "' ,";
				sql=sql+" '"+ cab.deliveryZoneId+ "' ,";
				sql=sql+" '"+ cab.reference+ "' ,";
				sql=sql+" '"+ cab.status+ "' ,";
				sql=sql+" '"+ formatearFechaBD(cab.deliveryDate)+ "' ,";
				sql=sql+" '"+ formatearFechaBD(cab.documentDate)+ "' ,";
				sql=sql+" '"+ cab.amount+ "' ,";
				sql=sql+" '"+ cab.currency+ "' ,";
				sql=sql+" '"+ cab.number+ "' ,";
				sql=sql+" '"+ cab.sourceId+ "' ,";
				sql=sql+" '"+ cab.type+ "' ,";
				sql=sql+" '"+ cab.comments+ "' ); ";

        //console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
        
        console.log(sql);
      
				//GUARDAMOS LA CABECERA
        tx.executeSql (sql, undefined,  function (tx)
				    {

                //console.log("DOS!!!!!!");
						
                $.each(cab.orderLines, function () {

										sql = "INSERT OR IGNORE INTO ordersDetail ( idOrder, lineNumber, idItem , quantity , firstSizeId , secondSizeId, unitType , ordinalType , idLogisticsChain, itemName, itemStatus, logisticsChainName, logisticsChainStatus) VALUES (";
										
										
										sql=sql+" '"+ cab.internalId+ "' ,";
										sql=sql+" '"+ this.lineNumber+ "' ,";
						        sql=sql+" '"+ this.itemId+ "' ,";
						        sql=sql+" '"+ this.quantity+ "' ,";
						        sql=sql+" '"+ this.firstSizeId+ "' ,";
						        sql=sql+" '"+ this.secondSizeId+ "' ,";
						        sql=sql+" '"+ this.unitType+ "' ,";
						        sql=sql+" '"+ this.ordinalType+ "' ,";
						        sql=sql+" '"+ this.logisticsChainId+ "' ,";
						        sql=sql+" '"+ this.itemName+ "' ,";
						        sql=sql+" '"+ this.itemStatus+ "' ,";
						        sql=sql+" '"+ this.logisticsChainName+ "' ,";
						        sql=sql+" '"+ this.logisticsChainStatus+ "' );";

										console.log(sql);
										
										//GUARDAMOS CADA UNA DE LAS LINEAS 
                    tx.executeSql(sql, [] , function (tx) {} );
               
								});
								
								sql = "DELETE FROM ordersPending WHERE idInternalOrder="+idOrder;
								console.log(sql);
								tx.executeSql(sql, [] , function (tx) {} );
								
								sql = "DELETE FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;
								//console.log(sql);
								tx.executeSql(sql, [] , function (tx) {} );
								
								pRefrescarNotificaciones();
								
								pRefrescarPantallaActual();

            }, pFinalConfirmarPedidoERROR );
				
    });
	
}




function pGuardarBorradorComoPedidoTemporal(idOrder, tipo, redireccion){
	
	var estadoPendienteEnviar=3;
	var insert="";
		
	db.transaction (function (tx) 
  {

  	// buscamos infomación general y relativa al purchaseCenter
    var sql = "SELECT * FROM ordersDraft  WHERE idInternalOrder='"+idOrder+"'";
        
    console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
    
    tx.executeSql (sql, undefined, 
			function (tx, cabecera)
			{
				
				console.log("INICIO 2222 el pedido "+idOrder)	;
				
      	if (cabecera.rows.length > 0) 
				{
						var cab=cabecera.rows.item(0);
						
						sql = "SELECT MAX(idInternalOrder) as lastId FROM ordersPending";
		        var id = 0;
		        tx.executeSql(sql, undefined,
		            function (tx, result) {
		            	
		                if ( result.rows.length > 0 ) { id = result.rows.item(0).lastId; }
		
		        				if ( localStorage['pLastInternalOrder'] > id ) {	id = parseInt(localStorage['pLastInternalOrder']); } 
        						else { id= id + 1; }

										var idtmp=id;
										
						      	//PREPARAMOS LA CABECERA
						      	var data = {};
						      	data.idInternal=idtmp;
						      	data.idVendor=cab.idVendor;
						      	data.idPurchaseCenter=cab.idPurchaseCenter;
						      	data.idDeliveryZone=cab.idDeliveryZone;
						      	data.reference=cab.idInternalOrder; //GUARDAMOS el ID de Borrador
						      	data.status=estadoPendienteEnviar;
						      	data.documentDate= cab.documentDate;
						      	data.amount=cab.amount;
						      	data.currency=cab.currency;
						      	data.observaciones=cab.observaciones;
						      	data.number=cab.number;
						      	data.sourceId=cab.sourceId;
						      	data.type=cab.type;
						      	
						      	
						      	//Operacion M = modificar
						      	insert=getQueryInsertOrderPending(data, TIPO_TEMPORAL_DRAFT, 'M');
						      	console.log(insert);
										tx.executeSql (insert, undefined,  
							      function (tx) 
							      { 
							      		//PREPARAMOS LAS LINEAS 
				  			      	var insert2="INSERT INTO ordersPendingDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus  )  SELECT "+idtmp+", lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId, ordinalType, itemName , itemStatus , logisticsChainName , logisticsChainStatus FROM ordersDraftDetail WHERE idInternalOrder="+idOrder;
				  			      	//console.log(insert2);
									      tx.executeSql (insert2, undefined,  
									      function (tx) 
									      { 
									      		localStorage['pNuevoPedidoIntenalId']=idtmp;
										    		localStorage["pNuevoPedidoIdCentro"]=data.idPurchaseCenter;
				 									localStorage["pNuevoPedidoIdProveedor"]=data.idVendor;	
											  		if(redireccion!="no"){
										    			pListaNuevoPedido(idtmp);										    	
											    		displayDetalleNuevoPedido();
														pRellenarGridNuevoPedido();
														pRefrescarNotificaciones ();
													}
									      	
									    	});	
							    	});					
				    		});
      	} else {
      		console.log("ERROR  GUARDAR PLANTILLA Pedido Inexitente.");
      		
      	}
		    
      }, error);
  	
  });
  
}




function pFinalConfirmarPedido(tx, o ) {
	console.log("ACABADA !! ");
}


function pFinalConfirmarPedidoERROR(tx, error) {
	console.log("ERROR => "+error.message);
}


/*
	Todas las acciones relativas a finalizar un pedido y enviarlo al WS
*/
function pBotonFinalizarNuevoPedido(idOrder)  {
	
	var f = $("#ptxtFechaEntregaCabecera").val();
	var fechaFormateada = f.substring(6, 10)+"-"+f.substring(3,5)+"-"+f.substring(0,2);
	
	pCerrarPedidoTemporal($("#ptxtZonaCabecera").val(), $("#ptxtObservacionesCabecera").val(),fechaFormateada );
	
	var id = localStorage['pNuevoPedidoIntenalId'];
	//pEnviarPedido(id);
	//setTimeout(pEnviarPedido( localStorage['pNuevoPedidoIntenalId'] ),500);
	pEnviarPedido( localStorage['pNuevoPedidoIntenalId'] );
	
	pMostrarPedidos();

}


/*
	Elimina un borrador
*/
function pBorrarBorrador(idOrder) {
	
	db.transaction (function (tx) 
    {

    var sql = "DELETE FROM ordersDraft  WHERE idInternalOrder='"+idOrder+"'";
    
    tx.executeSql (sql, undefined, 
			function (tx)
			{
      	         
                var sql2 = "DELETE FROM ordersDraftDetail  WHERE idInternalOrder='"+idOrder+"'";

                  tx.executeSql (sql2, undefined, 
                            function (tx)
                            {
                                 pRefrescarNotificaciones();                                 
                            });
                    });
			});
	
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLANTILLAS
/*
Guarda los ultimos datos de una plantilla
	Nombre de la plantilla, fecha de creación, zona de entrega
*/

function pCerrarPlantilla(idOrder, nombre, zona){
	
	
    console.log("INICIO CERRAR el PLANTILLA ");

    db.transaction(function (tx) {


        // buscamos infomación general y relativa al purchaseCenter
        var sql = "SELECT c.currency, o.idVendor, o.idPurchaseCenter, o.reference FROM purchaseCenters as c, ordersPending as o WHERE o.idPurchaseCenter=c.idPurchaseCenter AND o.idInternalOrder=" + idOrder;
        var id = 0;
        var reference = currency = "";

        //console.log("INICIO CERRAR111 el pedido " + sql);

        tx.executeSql(sql, undefined,
            function (tx, result) {

                
                if (result.rows.length > 0) {
                	
                	
                		//Ponemos el valor correcto de Operacion
										//N= nueva , D= Borrar, M= modificar
										
                	
                    reference = "TmpT" + idOrder;
                    currency = result.rows.item(0).currency;
										var z="";
										
										if (zona=="" || zona==undefined ) { }
										else { z='idDeliveryZone="' + zona + '" , "'; }

                    sql = 'UPDATE ordersPending SET '+ z +' unfinished=0, documentDate="' + nowBD() + '", ' +
                        ' currency="' + currency + '", observaciones="' + nombre + '" , tipoInterno='+TIPO_TEMPORAL_TEMPLATE+' WHERE idInternalOrder=' + idOrder;

                    console.log("CERRAR PLANTILLA TEMPORAL = " + sql);
                    
                    
                    tx.executeSql(sql, undefined, function () {});
                       
                    
		                //BORRAMOS las lineas que tengan error
		                 
                  /*  sql="DELETE FROM ordersPendingDetail as o WHERE idInternalOrder=" + idOrder;    
                    
                    console.log("!!!!!!!!!!!!!!!!!!!!!ELIMINANDO ==> "+ sql);
                   
                    db.transaction(function (tx3) {
                    
	                    tx3.executeSql(sql, undefined,
	                    	function () {
	                    			
	                    			//Recalculamos el numero de linea
	                        	sql="SELECT * FROM ordersPendingDetail WHERE idInternalOrder=" + idOrder;
	                        	tx3.executeSql(sql, undefined,
	            								function (tx3, detail) {
	                        				
		                        				for (var i=0; i < detail.rows.length ; i++ ) {
		                        					
		                        					update="UPDATE ordersPendingDetail SET lineNumber="+(i+1)+" WHERE idInternalOrder=" + idOrder+ " AND lineNumber="+ detail.rows.item(i).lineNumber ;	
					                        		console.log("ACTUALIZANDO ==> " + update);
					                        		db.transaction(function (tx4) {
					                        			tx4.executeSql(update, undefined, function (tx3) {} );
					                        			});
		                        				}
		                        			
	                        				 db.transaction(function (tx4) {
			                        				sql="DELETE FROM ordersDraft WHERE idInternalOrder=" + result.rows.item(0).reference;
						                        	tx4.executeSql(sql, undefined, function (tx, detail) { } );
						                        	
						                        	sql="DELETE FROM ordersDraftDetail WHERE idInternalOrder=" + result.rows.item(0).reference;
						                        	tx4.executeSql(sql, undefined, function (tx, detail) { } );
				            							
				            						   });
	                        				
	                        		});
	                        		
	                    	}	, error);  
										}	, error);   	*/
										
										
										$("#ptxtObservacionesCabecera").val("");
										pMostrarTodasPlantillas();
										
                } else {
                    console.log("ERROR AL CERRAR EL PEDIDO TMP Centro de compra inexistente.");

                }

            }, error);
            

    });
	
	
}


function pConfirmacionNuevaPlantilla(idOrder, json) {


    db.transaction(function (tx) {
 
        // buscamos infomación general y relativa al purchaseCenter
        
        var cab= json.body.entity;
        
        console.log("TEMPLATE RECIVIDO --------------------------------------------");
        console.log(cab);
        
        var params=[];
        
       var sql = "INSERT OR IGNORE INTO ordersTemplates ( idTemplate , idVendor , idPurchaseCenter , idDeliveryZone , reference , documentDate, amount, currency, number, sourceId , type , name, status) values (";

               sql=sql+" '"+ cab.internalId+ "' ,";
                       sql=sql+" '"+ cab.vendorId+ "' ,";
                       sql=sql+" '"+ cab.purchaseCenterId+ "' ,";
                       sql=sql+" '"+ cab.deliveryZoneId+ "' ,";
                       sql=sql+" '"+ cab.reference+ "' ,";
                       sql=sql+" '"+ formatearFechaBD(cab.documentDate)+ "' ,";
                       sql=sql+" '"+ cab.amount+ "' ,";
                       sql=sql+" '"+ cab.currency+ "' ,";
                       sql=sql+" '"+ cab.number+ "' ,";
                       sql=sql+" '"+ cab.sourceId+ "' ,";
                       sql=sql+" '"+ cab.type+ "' ,";
                       sql=sql+" '"+ cab.comments+ "' ,";
                       sql=sql+" '"+"7"+ "' ); ";


        //console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
        
        console.log(sql);
      
				//GUARDAMOS LA CABECERA
        tx.executeSql (sql, undefined,  function (tx)
				    {

                //console.log("DOS!!!!!!");
						
                $.each(cab.templateLines, function () {

										sql = "INSERT OR IGNORE INTO ordersTemplatesDetail ( idTemplate, lineNumber, idItem , quantity , firstSizeId , secondSizeId, unitType , ordinalType , idLogisticsChain) VALUES (";
										
										
										sql=sql+" '"+ cab.internalId+ "' ,";
										sql=sql+" '"+ this.lineNumber+ "' ,";
						        sql=sql+" '"+ this.itemId+ "' ,";
						        sql=sql+" '"+ this.quantity+ "' ,";
						        sql=sql+" '"+ this.firstSizeId+ "' ,";
						        sql=sql+" '"+ this.secondSizeId+ "' ,";
						        sql=sql+" '"+ this.unitType+ "' ,";
						        sql=sql+" '"+ this.ordinalType+ "' ,";
						        sql=sql+" '"+ this.logisticsChainId+ "' );";

										console.log(sql);
										
										//GUARDAMOS CADA UNA DE LAS LINEAS 
                    tx.executeSql(sql, [] , function (tx) {} );
               
								});
								
								
								sql = "DELETE FROM ordersPending WHERE idInternalOrder="+idOrder;
								console.log(sql);
								tx.executeSql(sql, [] , function (tx) {} );
								
								sql = "DELETE FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;
								//console.log(sql);
								tx.executeSql(sql, [] , function (tx) {} );
								
								pRefrescarNotificaciones();
								
								pRefrescarPantallaActual();

            }, pFinalConfirmarPedidoERROR );
				
    });
	
}


function pConfirmacionPlantillaModificada(idOrder, json) {


    db.transaction(function (tx) {
 
        // buscamos infomación general y relativa al purchaseCenter
        
        var cab= json.body.entity;
        
        console.log("TEMPLATE RECIVIDO --------------------------------------------");
        console.log(cab);
        
        var params=[];
        
        //BORRAMOS LA PLANTILLAS 
        
        pPlantillaBorrar(cab.reference);
             
        
        //Insertamos la nueva plantilla
        setTimeout(pInsertarPlantilla(cab), 500);
        
				
    });
	
}


function pInsertarPlantilla(cab){
	
	 db.transaction(function (tx) {
	
				var sql = "INSERT OR IGNORE INTO ordersTemplates ( idTemplate , idVendor , idPurchaseCenter , idDeliveryZone , reference , documentDate, amount, currency, number, sourceId , type , name, status ) values (";
        
        sql=sql+" '"+ cab.internalId+ "' ,";
				sql=sql+" '"+ cab.vendorId+ "' ,";
				sql=sql+" '"+ cab.purchaseCenterId+ "' ,";
				sql=sql+" '"+ cab.deliveryZoneId+ "' ,";
				sql=sql+" '"+ cab.reference+ "' ,";
				sql=sql+" '"+ formatearFechaBD(cab.documentDate)+ "' ,";
				sql=sql+" '"+ cab.amount+ "' ,";
				sql=sql+" '"+ cab.currency+ "' ,";
				sql=sql+" '"+ cab.number+ "' ,";
				sql=sql+" '"+ cab.sourceId+ "' ,";
				sql=sql+" '"+ cab.type+ "' ,";
				sql=sql+" '"+ cab.comments+ "', ";
				sql=sql+" '7' ); ";

        //console.log("INICIO GUARDAR PLANTILLA como pending el pedido "+sql)	;
        
        console.log(sql);
      
				//GUARDAMOS LA CABECERA
        tx.executeSql (sql, undefined,  function (tx)
				    {

                //console.log("DOS!!!!!!");
						
                $.each(cab.templateLines, function () {

										sql = "INSERT OR IGNORE INTO ordersTemplatesDetail ( idTemplate, lineNumber, idItem , quantity , firstSizeId , secondSizeId, unitType , ordinalType , idLogisticsChain, itemName, itemStatus, logisticsChainName, logisticsChainStatus) VALUES (";
										
										
										sql=sql+" '"+ cab.internalId+ "' ,";
										sql=sql+" '"+ this.lineNumber+ "' ,";
						        sql=sql+" '"+ this.itemId+ "' ,";
						        sql=sql+" '"+ this.quantity+ "' ,";
						        sql=sql+" '"+ this.firstSizeId+ "' ,";
						        sql=sql+" '"+ this.secondSizeId+ "' ,";
						        sql=sql+" '"+ this.unitType+ "' ,";
						        sql=sql+" '"+ this.ordinalType+ "' ,";
						        sql=sql+" '"+ this.logisticsChainId+ "' ,";
						        sql=sql+" '"+ this.itemName+ "' ,";
						        sql=sql+" '"+ this.itemStatus+ "' ,";
						        sql=sql+" '"+ this.logisticsChainName+ "' ,";
						        sql=sql+" '"+ this.logisticsChainStatus+ "' );";

										console.log(sql);
										
										//GUARDAMOS CADA UNA DE LAS LINEAS 
                    tx.executeSql(sql, [] , function (tx) {} );
               
								});
								
								var sql = "DELETE FROM ordersPendingDetail  WHERE  EXISTS (SELECT * FROM ordersPending as o WHERE o.idInternalOrder=ordersPendingDetail.idInternalOrder AND o.reference='"+cab.reference+"') ";
								//sql = "DELETE FROM ordersPending WHERE idInternalOrder="+idOrder;
								console.log(sql);
								tx.executeSql(sql, [] , function (tx) {
									  var sql2 = "DELETE FROM ordersPending  WHERE reference='"+cab.reference+"'";
									  console.log(sql2);
	                  tx.executeSql (sql2, undefined, 
	                            function (tx)
	                            {
	                            		console.log("BORRADO OK");
	                                pRefrescarNotificaciones();                                 
	                            });
	                  
									
								} );
								
							
								
								pRefrescarNotificaciones();
								
								pRefrescarPantallaActual();

            }, pFinalConfirmarPedidoERROR );
	});
}

/*
	Elimina un plantilla
*/
function pPlantillaBorrar(reference) {
	
	db.transaction (function (tx) 
    {

    var sql = "DELETE FROM ordersTemplatesDetail  WHERE  EXISTS (SELECT * FROM ordersTemplates as o WHERE o.idTemplate=ordersTemplatesDetail.idTemplate AND o.reference='"+reference+"') ";
    console.log(sql);
    tx.executeSql (sql, undefined, 
			function (tx)
			{
      	         
                var sql2 = "DELETE FROM ordersTemplates  WHERE reference='"+reference+"'";
								console.log(sql2);
                  tx.executeSql (sql2, undefined, 
                            function (tx)
                            {
                            		console.log("BORRADO OK");
                                pRefrescarNotificaciones();                                 
                            });
                    });
			});
	
}