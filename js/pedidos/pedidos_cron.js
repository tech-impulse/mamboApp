/*
Función que reenviaró las tareas pendientes
*/
function pSincronizar( ) {
	




	//Recuperar Pedidos y plantillas pendientes de enviar
	var debug=1;
	
	var s="SELECT * FROM ordersPending as o WHERE unfinished!='TRUE' AND error=0 ";
	
	var res={};

	setInterval(function () {
	    restPing();

	}, 30000);

	setInterval(function () {



		res={};
		if (debug==1) console.log("SINCRONIZANDO -------------------------------------- ONLINE= " + localStorage['online']);
		
		//if (navigator.onLine) {
			db.transaction (function (tx) 
		  {
		  		
		    	tx.executeSql (s, undefined, 
					function (tx, result)
					{
							
							console.log(result.rows);
							var l;
							for (var i = 0; i < result.rows.length; i++) { 
									
									l=result.rows.item(i);
									
									if(l.tipoInterno==TIPO_TEMPORAL_ORDER) {
										//Es un pedido
										
										if (l.operacion=="N") {
											//Enviar Pedido
											
											if (debug==1) console.log("Pedido Nuevo"+l.idInternalOrder);
											pEnviarPedido(l.idInternalOrder,1);
										
										} else if (l.operacion=="D") {
											
											//Elimnar Pedido
											if (debug==1) console.log("Pedido Borrar"+l.idInternalOrder);
											pWSEliminarPedido(l.reference);
											
										} else {
											if (debug==1) console.log("Sincronizar PEDIDO erroneo = "+l.operacion);
										}	
										
									} else if(l.tipoInterno==TIPO_TEMPORAL_TEMPLATE) {
										
										//Es un Plantilla 
										if (l.operacion=="N" || l.operacion=="M" ) {	
											//Modificar o nueva plantilla
											if (debug==1) console.log("Sincronizar Plantilla Nueva o modificar "+l.idInternalOrder);
											pEnviarPlantilla(l.idInternalOrder,1);
											
										} else if (l.operacion=="D") {
											
											//Eliminar plantilla
											if (debug==1) console.log("Sincronizar Plantilla Eliminar "+l.idInternalOrder);
											pWSEliminarPlantilla(l.reference);
										
										}	 else {
											if (debug==1) console.log("Sincronizar PLANTILLA erroneo = "+l.operacion);
										}						
									} else if(l.tipoInterno==TIPO_TEMPORAL_DRAFT) {
										//Es un borrador --> No hacer nada
										if (debug==1) console.log("Sincronizar Borrador "+l.idInternalOrder);
									} else {
										if (debug==1) console.log("Sincronizar tipo erroneo = "+l.tipoInterno);
									}
								
								
							} 
					});
					var sql = "UPDATE Log SET transactionCode=1 WHERE transactionCode=0";
					tx.executeSql (sql, null, function ()
					{ 
						pPostLogs();
						
					});
			}, error);
			/*
		} else {
			console.log("Sin conexion! No es posible sincronizar");
		}
		*/
	}, tiempoSincronismo);
}
