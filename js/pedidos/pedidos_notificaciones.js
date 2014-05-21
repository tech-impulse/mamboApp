
function pMostrarNotificaciones( seccion ) {
		/* 
		Muestra el detalle de las notificaciones
		*/
		
		
	// Recuperar la cabecer
  
	
  var res={};
	var aux="";
	var tabla="";
  var tipo0=tipo1=tipo2=0;
  var errores=0;
  
	//console.log("ini " + s);
	var aux="";
	
	db.transaction (function (tx) 
  {
  		var s="SELECT o.idInternalOrder as id, o.reference, documentDate as fecha,  p.name as centro, v.name as proveedor, p.shortName, o.tipoInterno as interno, error as merror FROM ordersPending as o, vendors as v , purchaseCenters as p, scopes as s WHERE s.scope=o.idPurchaseCenter AND o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND ( o.tipoInterno="+TIPO_TEMPORAL_ORDER+" || o.tipoInterno="+TIPO_TEMPORAL_TEMPLATE+")  AND o.username='"+localStorage['usuario']+"' AND o.unfinished=0 "+ 
  					" UNION " +
  				  "SELECT o.idInternalOrder as id, o.reference, documentDate as fecha,  p.name as centro, v.name as proveedor, p.shortName, "+TIPO_TEMPORAL_DRAFT+" as interno, 0 as merror  FROM ordersDraft as o, vendors as v , purchaseCenters as p, scopes as s WHERE s.scope=o.idPurchaseCenter AND o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter ";

			console.log("NOTIFICACIONES==> "+s);

    	tx.executeSql (s, undefined, 
			function (tx, result)
			{

      	if (result.rows.length > 0) 
				{	
        
          $('#pNotificacionesTablaPedidos tr').remove();
          $('#pNotificacionesTablaPedidosErrores tr').remove();
          $('#pNotificacionesTablaBorradores tr').remove();
          $('#pNotificacionesTablaPlantillas tr').remove();
          insertLog(3,4,"Se ha accedido a la pantalla de notificaciones","Punto de entrada caption pantalla "+localStorage['pantalla']); 
          
          for (var i=0; i < result.rows.length; i++) {
              aux="";
              
              res=result.rows.item(i);
              
          
              //console.log("ini 33333  " + aux );
							if (res.interno==TIPO_TEMPORAL_ORDER && res.merror!="0" && (seccion=="O" || seccion==undefined) ) {
                 tabla="pNotificacionesTablaPedidosErrores";
                 aux="<tr onclick='$(\"#navpanel\").panel(\"close\"); $(\"#pNotificacionesPopup\").popup(\"close\") ; pMostrarDetallePedido(\""+res.reference+"\")' ><td >"+res.id+" | </td><td>"+res.centro+" | </td><td>"+res.proveedor+" | </td><td>"+res.fecha+"</td></tr>";
                 errores=1;
              
              } else if (res.interno==TIPO_TEMPORAL_ORDER && (seccion=="O" || seccion==undefined) ) {
                 tipo0++;
                 tabla="pNotificacionesTablaPedidos";
                 aux="<tr onclick='$(\"#navpanel\").panel(\"close\"); $(\"#pNotificacionesPopup\").popup(\"close\") ; pMostrarDetallePedido(\""+res.reference+"\")' ><td >"+res.id+" | </td><td>"+res.centro+" | </td><td>"+res.proveedor+" | </td><td>"+res.fecha+"</td></tr>";
                 
              } else if (res.interno==TIPO_TEMPORAL_DRAFT  && (seccion=="D" || seccion==undefined)) {
                 tipo2++;
                 tabla="pNotificacionesTablaBorradores";
                 aux="<tr onclick='$(\"#navpanel\").panel(\"close\"); $(\"#pNotificacionesPopup\").popup(\"close\") ; pMostrarDetalleBorrador("+res.id+")'><td>"+res.id+"  </td><td>| "+res.centro+" </td><td>"+res.proveedor+" </td><td>| "+res.fecha+"</td></tr>";
             
              } else if (res.interno==TIPO_TEMPORAL_TEMPLATE && res.merror!="0" && (seccion=="T" || seccion==undefined)) {
                 tipo1++;
                 tabla="pNotificacionesTablaPlantillasErrores";
                 aux="<tr onclick='$(\"#navpanel\").panel(\"close\"); $(\"#pNotificacionesPopup\").popup(\"close\") ; pMostrarDetallePlantilla("+res.id+")'><td>"+res.id+" </td><td> | "+res.centro+"  </td><td> | "+res.proveedor+"  </td><td>|"+res.fecha+"</td></tr>";
                 
              } else if (res.interno==TIPO_TEMPORAL_TEMPLATE  && (seccion=="T" || seccion==undefined)) {
                 tipo1++;
                 tabla="pNotificacionesTablaPlantillas";
                 aux="<tr onclick='$(\"#navpanel\").panel(\"close\"); $(\"#pNotificacionesPopup\").popup(\"close\") ; pMostrarDetallePlantilla("+res.id+")'><td>"+res.id+"  </td><td> | "+res.centro+"  </td><td> | "+res.proveedor+"  </td><td>|"+res.fecha+"</td></tr>";
                 
              }

              //$('#'+tabla+' > tbody:last').append(aux);
              $('#'+tabla+'').append(aux);
              
              //console.log("ini 44444" + '#'+tabla+' > tbody:last' );
          } 
          //console.log(" ----> "+tipo0+" "+tipo1+" "+tipo2);
          pDisplayNotificaciones (tipo0, tipo1, tipo2 , errores );    
          
					
      	} else {
        
      		console.log("NO HAY NOTIFICACIONES");
      		
          pDisplayNotificaciones(tipo0, tipo1, tipo2 , 0 );
      	}
 	
	   	}, error, function (e) { 
          console.log(e.message);  }) ;
          
	});
	
}


/*
	Muestra en numero de notificaciones en la cabecera y en el menu lateral
*/
function pRefrescarNotificaciones () {
 
	
	//NOTIFICACIONES DE PEDIDOS Y PLANTILLAS pendientes de enviar
	var s="SELECT * FROM ordersPending as o, scopes as s  WHERE s.scope=o.idPurchaseCenter AND unfinished=0 AND o.username='"+localStorage['usuario']+"'";
  console.log("NOTIFICACIONES REFRESC==> "+s);
  var res={};
  var tipo0=0;
  var tipo1=0;
  var tipo2=0;
  var tipo0_otros=0;
  var tipo1_otros=0;
  var tipo2_otros=0;
	
	
	db.transaction (function (tx) 
  {
  		
    	tx.executeSql (s, undefined, 
			function (tx, result)
			{

      	if (result.rows.length > 0) 
				{	
          for (var i=0; i < result.rows.length; i++) {
  
              res=result.rows.item(i);
              
              //console.log("ini 33333  " + aux );
              if (res.tipoInterno==TIPO_TEMPORAL_ORDER  ) {
                 if (res.username==localStorage['usuario']) {
                 		tipo0++;
                 } else {
                 		tipo0_otros++;	
                 }
              } else if (res.tipoInterno==TIPO_TEMPORAL_TEMPLATE ) {
                 if (res.username==localStorage['usuario']) {
                 		tipo1++;
                 } else {
                 		tipo1_otros++;	
                 }
              }

          }
          
          if (tipo0 > 0) { 
						$('#pedidosNotificacionEmitidos').show();
						$('#pedidosNotificacionEmitidos span').text(tipo0);
					} else {
						$('#pedidosNotificacionEmitidos').hide();
						
					}

					if (tipo1 > 0) { 
						$('#pedidosNotificacionPlantillas').show();
						$('#pedidosNotificacionPlantillas span').text(tipo0);
					} else {
						$('#pedidosNotificacionPlantillas').hide();
					}
        } else {
        
      		console.log("NO HAY NOTIFICACIONES pendientes de enviar");
      		$('#pedidosNotificacionPlantillas').hide();
      		$('#pedidosNotificacionEmitidos').hide();
      	}  
          
      }, error, function (e) { 
          console.log(e.message);  }) ;
          
      
      //NOTIFICACIONES DE BORRADORES-------------------------------------------------------------
			
			var s2="SELECT * FROM ordersDraft as o, scopes as s  WHERE s.scope=o.idPurchaseCenter   ";
       console.log("NOTIFICACIONES REFRESCAR==> "+s2);   
       
       tipo2=0;
      tx.executeSql (s2, undefined, 
			function (tx, result)
			{

      	if (result.rows.length > 0) 
				{	
          for (var i=0; i < result.rows.length; i++) {

              tipo2++;

          }
          
         	if (tipo2 > 0) { 
						$('#pedidosNotificacionBorradores').show();
						$('#pedidosNotificacionBorradores span').text(tipo2);
					} else {
						$('#pedidosNotificacionBorradores').hide();
					} 
					
					 
        } else {
        
      		console.log("NO HAY NOTIFICACIONES de Borradores");
      		$('#pedidosNotificacionBorradores').hide();
      	} 
      	
      	var total=tipo0+tipo1+tipo2;
      	
				if (total > 0) { 
					$('#pedidosNotificacionTotalCabecera').show();
					$('#pedidosNotificacionTotalCabecera span').text(total);
			
					$('#pedidosNotificacion').show();
					$('#pedidosNotificacionPedidosMenuPrincipal').text(total);
					
					
				} else {
					$('#pedidosNotificacionTotalCabecera').hide();
					$('#pedidosNotificacion').hide();
					$('#pedidosNotificacionPedidosMenuPrincipal').text("");
				}  
        
        console.log("RESULTADO = "+total+"="+tipo0+"+"+tipo1+"+"+tipo2);
      }, error, function (e) { 
          console.log(e.message);  }) ;
              
  });                   
	
}
