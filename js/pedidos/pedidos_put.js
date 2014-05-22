
/*
Funci�n que enviara al WS un nuevo pedido

reenvio: indica si proviene cron 
*/
function pEnviarPedido(idOrder, reenvio) {
    
    //if (navigator.onLine==true) {
    
        console.log("Enviamos el pedido "+idOrder);

        // Recuperar la cabecer
        var s = "SELECT * FROM ordersPending WHERE idInternalOrder=" + idOrder;

        var res = {};
        var linea = {};

        console.log("ini ENVIO WS NEW ORDER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


        db.transaction(function (tx) {

            tx.executeSql(s, undefined,
                function (tx, result) {

                    if (result.rows.length > 0) {

                        var cab = result.rows.item(0);


                        //CREAMOS LA CABECERA 			
                        res.internalId = 0;
                        res.deliveryDate = cab.deliveryDate; // hora minuto y segundo ???
                        res.documentDate = cab.documentDate;

                        res.deliveryDate = formatearFechaWS(cab.deliveryDate); //"2014-04-02T00:00:00+0200";  // hora minuto y segundo ???
                        res.documentDate = formatearFechaWS(cab.documentDate); //"2014-03-27T00:00:00+0200";
                        res.deliveryZoneId = cab.idDeliveryZone;
                        res.isTemplate = 0;

                        res.number = 0; //?? AL sistema
                        res.purchaseCenterId = cab.idPurchaseCenter;
                        //res.reference=cab.reference;		
                        res.sourceId = "T"; //?? C Central, D Despatx, T Tablet
                        res.status = 0;
                        res.type = "P"; //?? Proveidor P Magatzem A
                        res.vendorId = cab.idVendor;
                        res.warehouseId = 999999; //?? 999999
                        res.comments= cab.observaciones;

                        if (reenvio==1) {
                            res.transactionId=cab.transactionCode;
                            console.log("REENVIO DEL WEBSERVICE ==> " + cab.transactionCode);
                        } else {
                            //res.transactionId="123234523a1232341232w45=="+(Math.random() * 100000);
                            var rand=Math.floor(Math.random() * 1000); 
                            if (rand < 1000 ) { rand=rand*10; }

                            res.transactionId=localStorage['transactionId']+""+rand+""+idOrder;


                            console.log("NUEVO DEL WEBSERVICE ==> " + cab.transactionCode);

                            var u = " UPDATE ordersPending SET error=0, transactionCode='"+res.transactionId+"' WHERE idInternalOrder="+idOrder;

                            console.log(u);
                            tx.executeSql (u, undefined, function (tx) 	{ } );
                        }


                        res.orderLines= new Array();

                        var d="SELECT * FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;

                        //DETALLE del pedido
                        tx.executeSql(d, undefined,
                            function (tx, result2) {

                                if (result2.rows.length > 0) {
                                    for (var i = 0; i < result2.rows.length; i++) {

                                        linea = result2.rows.item(i);

                                        res.orderLines.push({
                                            internalId: 0,
                                            itemId: linea.idItem,
                                            lineNumber: linea.lineNumber,
                                            logisticsChainId: linea.idLogisticsChain,
                                            ordinalType: linea.ordinalType,
                                            quantity: linea.quantity,
                                            firstSizeId: "000",
                                            secondSizeId: "000",
                                            unitType: linea.unitType

                                        });
                                    }

                                    insertLog(1,5,"Pedido finalizado ok",linea.idItem);

                                    console.log("");
                                    console.log("");
                                    console.log("");
                                    //console.log(res);
                                    console.log("JSON DE ENVIO DE PEDIDO "+JSON.stringify(res));

                                    //Generar codigo de envio

                                    //Enviar al WS
                                    var uri = "/orders";
                                    var dir = host + uri;
                                    console.log("ENviando al ws  " + dir);

                                    //token="dGhsbGVpZGE6MTM5NjM4MzU0ODI0MjpBUFBfUkVQTEVOSVNITUVOVDpURVNUOkVTOkVTOjFmYWUxMzQxN2RiNDM4Y2FjZjQ3NzMxNzU5MDZlYjRk";

                                    pEliminarErroresPedido(idOrder);//eliminamos el error para enviarlo y no duplicar articulos

                                    $.ajax({

                                        //async: 				false,
                                        url: dir,
                                        beforeSend: function (request) {
                                            request.setRequestHeader("Areas-Token", token);
                                        },
                                        contentType: 'application/json',
                                        //dataType: 		"json",
                                        type: 'POST',
                                        crossDomain: true,
                                        success: pNuevoPedidoPostOk,
                                        error: pNuevoPedidoPostError,
                                        data: JSON.stringify(res),
                                        timeout: 30000
                                    });

                                    console.log("FINAL ");
                                } else {

                                    console.log("EL PEDIDO NO TIIENE elementos ");
                                }

                            }, error);

                    } else {
                        console.log("Pedido TMP no encontrado = " + idOrder);

                    }

                }, error);

        });
    //}

}


function pNuevoPedidoPostOk(data) {

	//Hemos recivido respuesta----------------------------------------------------------------------------------

	//CASO OK
	console.log("EL PEDIDO SE HA ENVIADO, ESTA ES LA RESPUESTA!!!!");
    console.log(JSON.stringify(data));
	console.log(data);
    

	var estadoError=4;
	
	var errores = data.body.detail;
	var transId = data.body.entity.transactionId;

	var ini = localStorage['transactionId'].length ;
	var fin = data.body.entity.transactionId.length;

	var idOrder = data.body.entity.transactionId.substring(ini+4, fin);
    //var idOrder = data.body.entity.transactionId.split('==')[1];

	//CASO ERROR
	if (data.body.status == "ERROR") {

			console.log("SE HA ENVIADO PERO HA DEVUELTO ERROR");
				
			var sql="";			
			db.transaction ( 
		  function (transaction) 
		  {

			  	sql="UPDATE ordersPending SET error=1 , status="+estadoError+" WHERE transactionCode='"+data.body.entity.transactionId+"' ";
					console.log("-------------------------------------->"+sql+"(" );
					transaction.executeSql (sql, [],  function ()
					{
			  	
						sql="INSERT INTO ordersPendingErrors (idOrder, message) VALUES ("+idOrder+", ' "+data.body.message+" ')";
						console.log(sql);
						transaction.executeSql (sql, [],  function ()
						{
	
							 $.each(errores, function() {
					  			q="INSERT INTO ordersPendingDetailErrors (idOrder, lineNumber, message) VALUES ("+idOrder+", '"+this.lineNumber+"', '"+this.message+"')";
					  			localStorage['mensageConError']=this.message;
						 			console.log(q);
					  			transaction.executeSql (q, [],  function ()	{});
		      		 });
		      		 
		      		 pRefrescarPantallaActual();
	      		
	      		});  	
          });

          insertLog(2,5,"Pedido finalizado con ERROR",localStorage['pNuevoPedidoIntenalId']+","+localStorage['pNuevoPedidoIdProveedor']+","+localStorage['pNuevoPedidoIdCentro']+","+localStorage['mensageConError']);
			  
			  			  		  
			});
			
			
			//alert("ERROR EN EL PEDIDO "+ data.body.entity.reference);
			
	}	 else {
		 console.log("todo OK --->"+idOrder);
		 
		 pConfirmacionPedidoOk(idOrder, data);
		 
		 
	}

	setInterval(pRefrescarNotificaciones(),300);
 
}


function pNuevoPedidoPostError(data) {

	//Hemos recivido contestacion del servidor con error
	//No hemos recivido contestacion del servidor 
	console.log("ERROR AL ENVIAR EL PEDIDO, RESPUESTA");
    console.log(JSON.stringify(data));
	console.log(data);
}


function pEliminarErroresPedido(idOrder){
	
	db.transaction (function (transaction) {
	  	
	  	sql="DELETE FROM ordersPendingDetailErrors WHERE idOrder='"+idOrder+"' ";
				console.log(sql);
				transaction.executeSql (sql, [],  function (){});  
				
			sql2="UPDATE ordersPending SET error=0 WHERE idInternalOrder='"+idOrder+"' ";
							console.log(sql2);
							transaction.executeSql (sql2, [],  function (){});
	  	
	});
	
}





function pWSEliminarPedido(reference) {

	var uri = "/orders/" + reference;
	var dir = host + uri;
	console.log("Enviando al ws  " + dir);
	console.log("Token = " + token);

	$.ajax({

		async: false,
		url: dir,
		//data: 				{token:token},
		contentType: 'application/json; charset=iso-8859-1',
		type: 'delete',
		timeout: 10000,
		
		beforeSend: function (request) {
			request.setRequestHeader("Areas-Token", token);
		},

		success: pPostEliminarPedidoOk,
		error: pPostEliminarPedidoError,
	});

}

function pPostEliminarPedidoOk(data) {

	//Hemos recivido contestaci�n del servidor
	console.log("ELIMINAR PEDIDO OK");
    console.log(JSON.stringify(data));
	console.log(data);

	var estadoBorrado = 9;

	if (data.body.status == "ERROR") {
		//ERROR AL BORRAR UN pedido
		
	} else {

		//Actualizamos el estado en Pedido 
		db.transaction(
			function (transaction) {
				
				var sql = "UPDATE orders SET status=" + estadoBorrado + " WHERE reference='"+data.body.entity.reference+"'" ;
				
				transaction.executeSql (sql, [],  function ()
				{
						pRefrescarPantallaActual();
						pRefrescarNotificaciones();
			  });
			});

	}
}

function pPostEliminarPedidoError(data) {

	//No hemos recivido contestaci�n del servidor
	console.log("ELIMINAR PEDIDO Error");
    console.log(JSON.stringify(data));
	console.log(data);
}



function pPostLogs() {

    //if (navigator.onLine==true ) {
    
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM Log";

            transaction.executeSql(sql, undefined,
                function (transaction, result) {

                    if (result.rows.length) {
                        var pJsonLogs = [];

                        for (var i = 0; i < result.rows.length; i++) {
                            var rowDb = result.rows.item(i);

                            pJsonLogs.push({

                                type: rowDb.tipo,
                                category: rowDb.categoria,
                                user: rowDb.usuario,
                                date: formatearFechaWS(rowDb.tiempo),
                                //formatearFechaWS(rowDb.tiempo),
                                //idses: rowDb.transactionCode,
                                idses: transactionId,
                                description: rowDb.descripcion,
                                content: rowDb.data,
                                pkDevice: rowDb.device,
                                appVersion: versionApp

                            });
                        }
                        //console.log("JSON DE LOGS " + JSON.stringify(pJsonLogs));

                        //console.log(pJsonLogs);

                        //[{"type": 1,"category": 1,"user": "jordi","date": "2014-04-14T18:35:26.000Z","idses": "Hello", "description":"Esto es una descripcion","content":"Esto es el env�o que ha cascado"},{"type": 2,"category": 2,"user": "jordi2","date": "2014-04-14T18:35:26.000Z","idses": "Hello2","description":"Esto es una descripcion","content":"Esto es el env�o que ha cascado"}]
                        var uri = "/logging/send";
                        var dir = host + uri;
                        $.ajax({
                            url: dir,
                            beforeSend: function (request) {
                                request.setRequestHeader("Areas-Token", token);
                            },
                            contentType: 'application/json',
                            //dataType: 		"json",
                            type: 'POST',
                            crossDomain: true,
                            success: pPostLogsOk,
                            error: pPostLogsError,
                            data: JSON.stringify(pJsonLogs)
                        });

                    } else
                        console.log("no hay logs");

                }, error);

        });
    //}
}

function pPostLogsOk(data) {
	var sql = "DELETE FROM Log WHERE transactionCode=1";
	db.transaction(function (transaction) {
		transaction.executeSql(sql, null, function () {
			//console.log("Todos los logs a 1 enviados y eliminados");
		});
	});
}

function pPostLogsError(data) {
	console.log("Envio ok");
	var sql = "UPDATE Log SET transactionCode=0 WHERE transactionCode=1";
	db.transaction(function (transaction) {
		transaction.executeSql(sql, null, function () {
			console.log("Error al enviar los logs, todos los logs puestos a 0");
		});
	});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLANTILLAS 

/*
 Enviar una nueva plantilla al sistema central
*/
function pEnviarPlantilla(idOrder, reenvio) {

    console.log("Enviamos el la plantilla "+idOrder);

    // Recuperar la cabecer
    var s = "SELECT * FROM ordersPending WHERE idInternalOrder=" + idOrder;

    var res = {};
    var linea = {};

    console.log("ini ENVIO WS PLANTILLA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


    db.transaction(function (tx) {

        tx.executeSql(s, undefined,
            function (tx, result) {

                if (result.rows.length > 0) {

                    var cab = result.rows.item(0);

                    console.log(cab);

                    // operacion= N => Nueva plantilla
                    // operacion= M => Modificar plantilla
                    var operacion=cab.operacion;
                    console.log("OPERACION =>  " + operacion);


                    //CREAMOS LA CABECERA
                    res.internalId = 0;


                    //res.deliveryDate = "0000-00-00T00:00:00+0200"; //"2014-04-02T00:00:00+0200";  // hora minuto y segundo ???
                    var fechaActual = nowBD();
                    fechaActual = formatearFechaWS(fechaActual);
                    res.documentDate = fechaActual;//formatearFechaWS(cab.documentDate); //"2014-03-27T00:00:00+0200";
                    res.deliveryZoneId = $("#ptxtZonaCabecera").val();//cab.idDeliveryZone;
                    res.isTemplate = 1;

                    res.number = cab.number; //?? AL sistema
                    res.purchaseCenterId = cab.idPurchaseCenter;
                    res.reference=""; //cab.reference;        NULL
                    res.sourceId = cab.sourceId; //?? C Central, D Despatx, T Tablet
                    res.status = 0;
                    res.type = "P"; //?? Proveidor P Magatzem A
                    res.vendorId = cab.idVendor;
                    res.warehouseId = 999999; //?? 999999
                    if (cab.observaciones=="" || cab.observaciones=="undefined" || cab.observaciones=="null" || cab.observaciones==null || cab.observaciones==undefined) {res.comments= $("#pedidosPopUpInputNombrePlantilla").val();}
                    else {res.comments= cab.observaciones;}


                    //res.transactionId="123234523a1232341232w45=="+(Math.random() * 100000);

                    if (reenvio==1) {
                        res.transactionId=cab.transactionCode;

                    } else {
                        //res.transactionId="123234523a1232341232w45=="+(Math.random() * 100000);
                        var rand=Math.floor(Math.random() * 1000);
                        if (rand < 1000 ) { rand=rand*10; }

                        res.transactionId=localStorage['transactionId']+""+rand+""+idOrder;


                        var u = " UPDATE ordersPending SET error=0, transactionCode='"+res.transactionId+"' WHERE idInternalOrder="+idOrder;

                        console.log(u);
                        tx.executeSql (u, undefined, function (tx)     { } );
                    }


                    var u = " UPDATE ordersPending SET error=0, transactionCode='"+res.transactionId+"' WHERE idInternalOrder="+idOrder;

                    console.log(u);
                    tx.executeSql (u, undefined, function (tx)     { } );

                    res.templateLines= new Array();

                    var d="SELECT * FROM ordersPendingDetail WHERE idInternalOrder="+idOrder;

                    //DETALLE del pedido
                    tx.executeSql(d, undefined,
                        function (tx, result2) {

                            if (result2.rows.length > 0) {
                                for (var i = 0; i < result2.rows.length; i++) {

                                    linea = result2.rows.item(i);

                                    res.templateLines.push({
                                        internalId: 0,
                                        itemId: linea.idItem,
                                        lineNumber: linea.lineNumber,
                                        logisticsChainId: linea.idLogisticsChain,
                                        ordinalType: linea.ordinalType,
                                        quantity: linea.quantity,
                                        firstSizeId: "000",
                                        secondSizeId: "000",
                                        unitType: linea.unitType

                                    });
                                }

                                insertLog(1,5,"Plantilla finalizada ok",linea.idItem);

                                console.log("");
                                console.log(res);


                                pEliminarErroresPedido(idOrder);//eliminamos el error para enviarlo y no duplicar articulos


                                if (operacion =="N") {

                                    res.sourceId = "T"; //?? C Central, D Despatx, T Tablet
                                    res.number = 0;

                                    var uri = "/templates";
                                    var dir = host + uri;
                                    console.log("ANADIR PLANTILLA AL WS  " + dir);
                                     console.log(JSON.stringify(res));
                                    $.ajax({

                                        //async:                 false,
                                        url: dir,
                                        beforeSend: function (request) {
                                            request.setRequestHeader("Areas-Token", token);
                                        },
                                        contentType: 'application/json',
                                        //dataType:         "json",
                                        type: 'POST',
                                        crossDomain: true,
                                        success: pPlantillaNuevaPostOk,
                                        error: pPlantillaNuevaPostError,
                                        data: JSON.stringify(res),
                                        timeout: 30000
                                    });
                                } else if (operacion =="M")  {

                                    console.log("VAMOS A BORRAR LA PLANTILLA");
                                    pPlantillaBorrar(cab.reference);

                                    var uri = "/templates";
                                    var dir = host + uri;
                                    console.log("MODIFICAR PLANTILLA EN WS  " + dir);
                                     console.log(JSON.stringify(res));
                                    $.ajax({

                                        //async:                 false,
                                        url: dir,
                                        beforeSend: function (request) {
                                            request.setRequestHeader("Areas-Token", token);
                                        },
                                        contentType: 'application/json',
                                        //dataType:         "json",
                                        type: 'PUT', // PUT
                                        crossDomain: true,
                                        success: pPlantillaModificarPostOk,
                                        error: pPlantillaModificarPostError,
                                        data: JSON.stringify(res),
                                        timeout: 30000
                                    });
                                } else {
                                        console.log("Ninguna operación disponible => " + operacion + " - " +res.operacion);
                                }
                                console.log("FINAL ");

                            } else {

                                console.log("EL PEDIDO NO TIIENE elementos ");
                            }

                        }, error);

                } else {
                    console.log("Pedido TMP no encontrado = " + idOrder);

                }

            }, error);

    });

}


function pPlantillaNuevaPostOk(data) {

	//Hemos recivido respuesta----------------------------------------------------------------------------------

	//CASO OK
	console.log("PLANTILLA ENVIADA OK!!!!");
	console.log(data);
    console.log(JSON.stringify(data));

	var estadoError=4;
	
	var errores = data.body.detail;
	var transId = data.body.entity.transactionId;

	var ini = localStorage['transactionId'].length ;
	var fin = data.body.entity.transactionId.length;

	var idOrder = data.body.entity.transactionId.substring(ini, fin);

	//CASO ERROR
	if (data.body.status == "ERROR") {

			console.log("HA HABIDO UN ERROR");
				
			var sql="";			
			db.transaction ( 
		  function (transaction) 
		  {
		  	
		  	sql="UPDATE ordersPending SET error=1 , status="+estadoError+" WHERE transactionCode='"+data.body.entity.transactionId+"' ";
				console.log("-------------------------------------->"+sql+"(" );
				transaction.executeSql (sql, [],  function ()
				{
		  	
					sql="INSERT INTO ordersPendingErrors (idOrder, message) VALUES ("+idOrder+", ' "+data.body.message+" ')";
					console.log(sql);
					transaction.executeSql (sql, [],  function ()
					{
					
					
				
						 $.each(errores, function() {
				  			q="INSERT INTO ordersPendingDetailErrors (idOrder, lineNumber, message) VALUES ("+idOrder+", '"+this.lineNumber+"', '"+this.message+"')";
				  			localStorage['mensageConError']=this.message;
					 			console.log(q);
				  			transaction.executeSql (q, [],  function ()	{});
	      		 });
	      		 
	      		 pRefrescarPantallaActual();
      		
      		});  	
			  });	
			  
			  insertLog(2,5,"Plantilla finalizada con ERROR",localStorage['pNuevoPedidoIntenalId']+","+localStorage['pNuevoPedidoIdProveedor']+","+localStorage['pNuevoPedidoIdCentro']+","+localStorage['mensageConError']);
			  
			  			  		  
			});
			
			
			//alert("ERROR EN EL PEDIDO "+ data.body.entity.reference);
			
	}	 else {
		 console.log("todo OK");
		 
		 pConfirmacionNuevaPlantilla(idOrder, data);
		 
		 
	}

	setInterval(pRefrescarNotificaciones(),300);
 
}


function pPlantillaNuevaPostError(data) {

	//Hemos recivido contestacion del servidor con error
	//No hemos recivido contestacion del servidor 
	console.log("ERROR AL ENVIAR Plantilla");
    console.log(JSON.stringify(data));
	console.log(data);
}



function pPlantillaModificarPostOk(data) {

	//Hemos recivido respuesta----------------------------------------------------------------------------------

	//CASO OK
	console.log("PLANTILLA ENVIADA OK!!!");
    console.log(JSON.stringify(data));
	console.log(data);

	var estadoError=4;
	
	var errores = data.body.detail;
	var transId = data.body.entity.transactionId;

	var ini = localStorage['transactionId'].length ;
	var fin = data.body.entity.transactionId.length;

	var idOrder = data.body.entity.transactionId.substring(ini+4, fin);

	//CASO ERROR
	if (data.body.status == "ERROR") {

			console.log("HA HABIDO UN ERROR");
				
			var sql="";			
			db.transaction ( 
		  function (transaction) 
		  {
		  	
		  	sql="UPDATE ordersPending SET error=1 , status="+estadoError+" WHERE transactionCode='"+data.body.entity.transactionId+"' ";
				console.log("-------------------------------------->"+sql+"(" );
				transaction.executeSql (sql, [],  function ()
				{
		  	
					sql="INSERT INTO ordersPendingErrors (idOrder, message) VALUES ("+idOrder+", ' "+data.body.message+" ')";
					console.log(sql);
					transaction.executeSql (sql, [],  function ()
					{
					
					
				
						 $.each(errores, function() {
				  			q="INSERT INTO ordersPendingDetailErrors (idOrder, lineNumber, message) VALUES ("+idOrder+", '"+this.lineNumber+"', '"+this.message+"')";
				  			localStorage['mensageConError']=this.message;
					 			console.log(q);
				  			transaction.executeSql (q, [],  function ()	{});
	      		 });
	      		 
	      		 pRefrescarPantallaActual();
      		
      		});  	
			  });	
			  
			  insertLog(2,5,"Plantilla finalizada con ERROR",localStorage['pNuevoPedidoIntenalId']+","+localStorage['pNuevoPedidoIdProveedor']+","+localStorage['pNuevoPedidoIdCentro']+","+localStorage['mensageConError']);
			  
			  			  		  
			});
			
			
			//alert("ERROR EN EL PEDIDO "+ data.body.entity.reference);
			
	}	 else {
		 console.log("todo OK");
		 
		 pConfirmacionPlantillaModificada(idOrder, data);
		 
		 
	}

	setInterval(pRefrescarNotificaciones(),300);
 
}


function pPlantillaModificarPostError(data) {

	//Hemos recivido contestacion del servidor con error
	//No hemos recivido contestacion del servidor 
	console.log("ERROR AL ENVIAR Plantilla UPDATE");
    console.log(JSON.stringify(data));
	console.log(data);
}



function pWSEliminarPlantilla(reference) {

	var uri = "/templates/" + reference;
	var dir = host + uri;
	console.log("Enviando al ws  " + dir);
	console.log("Token = " + token);

	$.ajax({

		async: false,
		url: dir,
		//data: 				{token:token},
		contentType: 'application/json; charset=iso-8859-1',
		type: 'delete',
             timeout: 10000,

		beforeSend: function (request) {
			request.setRequestHeader("Areas-Token", token);
		},

		success: pPostEliminarPlantillaOk,
		error: pPostEliminarPlantillaError,
   
	});

}

function pPostEliminarPlantillaOk(data) {

	//Hemos recivido contestaci�n del servidor
	console.log("ELIMINAR Plantilla OK");
    console.log(JSON.stringify(data));
	console.log(data);

	if (data.body.status == "ERROR") {
		//ERROR AL BORRAR UN pedido
		
	} else {

		//Actualizamos el estado en Pedido 
		db.transaction(
			function (transaction) {
				
				var sql = "SELECT * FROM ordersTemplates WHERE reference='"+data.body.entity.reference+"'" ;
				
				transaction.executeSql (sql, [],  function (result)
				{
					  if ( result.rows.length > 0) {
               var id = result.rows.item(0).idTemplate;
               var sql = "DELETE FROM ordersTemplates WHERE idTemplate='"+id+"'" ;
								transaction.executeSql (sql, [],  function ()
								{	
							  });
							  
							  var sql = "DELETE FROM ordersTemplatesDetail WHERE idTemplate='"+id+"'" ;
								transaction.executeSql (sql, [],  function ()
								{
										pRefrescarPantallaActual();
										pRefrescarNotificaciones();
								});
            }
				});
				
	
			});

	}
}

function pPostEliminarPlantillaError(data) {

	//No hemos recivido contestacin del servidor
	console.log("ELIMINAR PLANTILLA Error");
    console.log(JSON.stringify(data));
}