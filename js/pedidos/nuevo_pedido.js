var aux_center;

function getCentros() {


		pBorrarParametrosLocales();
		
		$("#pDivCheckPrecioDetallePedido").html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');

    db.transaction(function (transaction) {
        var sql = "SELECT * FROM purchaseCenters ORDER BY name ASC ";

        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var pJsonPedidos = [];
                n_reg = 0;
                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);
                    var center = result.rows.item(i);
                    console.log("CENTROS ENCONTRADOS " + center.name);

                    pJsonPedidos.push({

                        cod_centro: center.idPurchaseCenter,
                        nom_centro: center.name,
                    });
                    n_reg++;
                }

                if (n_reg == 1) {
                    console.log("Solo hay un Centro con nombre " + pJsonPedidos[0].nom_centro);
                    getProvidersByCenter(pJsonPedidos[0].cod_centro, pJsonPedidos[0].nom_centro);
                } else {
                    var grid = $("#pGridCentros").data("kendoGrid");

                    if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                        grid.destroy();
                    }

                    var mr = parseInt(localStorage.getItem("max_row_per_pag"));
                    localStorage["pedidos_pag_act"] = 1;
                    localStorage["pedidos_pag_max_row"] = mr;
                    console.log(" n_reg " + n_reg + " mr " + mr + " ultima pagina " + localStorage.getItem("max_row_per_pag"));
                    localStorage["pedidos_pag_last"] = Math.ceil(n_reg / mr);

                    console.log("Numero max por pag:" + localStorage.getItem("max_row_per_pag"));

                    //TRADUCCIONES GRID 
                    var cod = localStorage.getItem('str_codigo');

                    $("#pGridCentros").kendoGrid({
                        dataSource: {
                            data: pJsonPedidos,
                            schema: {
                                model: {
                                    fields: {
                                        nom_centro: {
                                            type: "string"
                                        },
                                    }
                                }
                            },
                            pageSize: mr
                        },
                        filterable: true,
                        scrollable: false,
                        selectable: true,
                        pageable: true,
                        sortable: true,
                        columns: [{
                            field: "nom_centro",
                            title: localStorage.getItem('pLbCentrosDisponibles'),
                            filterable: false,
                            width: '10%'
                        }]
                    });

                    $('.k-grid-pager').hide();

                    localStorage["pedidos_pag_act"] = 1;
                    displayNuevoPedido();
                }



            }, error);

        console.log("Nuevo-PEDIDO:  Query Finalizada, Listando Proveedores");
    });
}





function pCreateChartTAM(idPurchaseCenter, idVendor,  idItem, logisticsChainsText) {
	
	console.log("-------------------------");
								console.log("-------------------------");
	
		var idLogisticsChains="00";
		
    db.transaction(function (transaction) {
    	
    		var sql = "SELECT * FROM logisticChains WHERE idItem="+idItem+" AND logisticChainName='"+logisticsChainsText+"'";
				console.log(sql);
				localStorage['tiempoInicio'] = new Date().getTime();
    		console.log("Tiempo de inicio "+localStorage['tiempoInicio']);
				
        transaction.executeSql(sql, undefined,
    			 function (transaction, cl) {
    					if (cl.rows.length > 0 ) {
    						
    						console.log(cl.rows.item(0));
    						
    						idLogisticsChains=cl.rows.item(0).idLogisticsChains;
    						
    					}
    		
			        var sql = "SELECT * FROM catalog WHERE idVendor="+idVendor+" AND idPurchaseCenter="+idPurchaseCenter+" AND idItem="+idItem+" AND idLogisticsChains='"+idLogisticsChains+"'";
							console.log(sql);
			        transaction.executeSql(sql, undefined,
			            function (transaction, res) {
										if (res.rows.length > 0 ) {
											
											var v=res.rows.item(0);
											
											var datos=[v.matQ1, v.matQ2, v.matQ3, v.matQ4, v.matQ5, v.matQ6, v.matQ7, v.matQ8, v.matQ9 , v.matQ10, v.matQ11, v.matQ12, v.matQ13];
											
											var meses=['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DIC'];
											
											mesact=new Date().getMonth();
											
											var gmes=[];
											
											for (var m=12; m >= 0; m--) {
												gmes[m]=meses[mesact];
												mesact=mesact - 1 ;
												if (mesact < 0) mesact=11;
												console.log
											}
											
											
											console.log(datos);
											console.log(gmes);
											
									    $("#chartTAM").kendoChart({
									        title: {
									            text: "Compras semanales últimos 12 meses"
									        },
									        legend: {
									            visible: false
									        },
									        chartArea: {
												    height: 200
												  },
									        seriesDefaults: {
									            type: "line",
									            missingValues: "gap",
									            stack: true
									        },
									        series: [{
									            data: datos,
									            color: "#f3ac32"
									        }],
									        valueAxis: {
									            //max: 180,
									            line: {
									                visible: false
									            },
									            majorGridLines: {
													      visible: false
													    }
			
									            
									        },
									        
									        categoryAxis: {
									            categories: gmes,
									            majorGridLines: {
					                        visible: false
					                    },
					                    
									            
									        }
									        
									    });
									    
									    
									  } else {
									  	
									  	/*localStorage['tiempoFinal'] = new Date().getTime();
									    var tiempoEje = parseInt(localStorage['tiempoFinal']) - parseInt(localStorage['tiempoInicio']);
									    console.log("Tiempo de ejecucion " + (tiempoEje/60) +" seg" );*/
									  	console.log("EVOLUCIÓN NO DISPONIBLE");
									  }
								  });
								  
								  localStorage['tiempoFinal'] = new Date().getTime();
							    var tiempoEje = localStorage['tiempoFinal'] - localStorage['tiempoInicio'];
							    console.log("Tiempo de ejecucion " + (tiempoEje/60) +" seg" );
					 });
		});
}






/*
function getCentrosOld() {
    console.log("GET CENTROS");
    var contenedorPrincipal = document.getElementById("divlistaCentrosPrincipal");
    $("#divlistaCentros").empty();
    var divp = document.createElement('div');
    divp.id = 'divlistaCentros';
    contenedorPrincipal.appendChild(divp);

    var contenedor1 = document.getElementById("divlistaCentros");
    var ul = document.createElement("ul");
    ul.setAttribute("id", "plista_centros");
    ul.setAttribute("data-filter", "true");
    ul.setAttribute("data-role", "listview");
    ul.setAttribute("data-theme", "a");
    ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all ui-shadow");
    var l = document.createElement("li");
    l.setAttribute("role", "heading");
    l.setAttribute("data-role", "list-divider");
    l.setAttribute("class", "ui-li ui-li-divider ui-bar-d ui-li-has-count");
    var h3 = document.createElement("h3");
    h3.innerHTML = "<h2>" + localStorage.getItem('pLbCentrosDisponibles') + "</h2>";
    var span = document.createElement("span");
    span.setAttribute("class", "ui-li-count ui-btn-up-c ui-btn-corner-all");
    var label = document.createElement("label");
    label.setAttribute("id", "num_centros");
    ul.appendChild(l);
    l.appendChild(h3);
    l.appendChild(span);
    span.appendChild(label);

    db.transaction(function (transaction) {

        var sql = "SELECT * FROM purchaseCenters ORDER BY name ASC ";

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                for (var i = 0; i < result.rows.length; i++) {
                    var center = result.rows.item(i);
                    console.log("CENTROS ENCONTRADOS " + center.name);

                    var li;
                    li = document.createElement("li");
                    li.setAttribute("data-filtertext", center.name);
                    ul.appendChild(li);

                    var a;
                    a = document.createElement("a");
                    a.setAttribute("href", "#");
                    a.setAttribute("onClick", "getProvidersByCenter(" + center.idPurchaseCenter + ",'" + center.name + "')");
                    a.innerHTML = center.name;
                    li.appendChild(a);

                    //restArticleJSON(provider.codPro);
                    label.innerHTML = (i + 1);
                }
                contenedor1.appendChild(ul);
                if (i == 1) {
                    console.log("Solo hay un Centro");
                    getProvidersByCenter(center.idPurchaseCenter, center.name);
                } else {
                    $("#divlistaCentros").trigger("create"); // HAcerlo o si no, no te mete los estilos
                    displayNuevoPedido();
                   // $('.ui-filterable').hide();
                   //<input data-type="search" placeholder="Filter items..." data-lastval="">
                }

            }, error);

    });

    console.log("FIN GET CENTERS");
}*/

function getProvidersByCenter(center, centerName) {


    localStorage.setItem('centro_seleccionado', centerName);
    localStorage.setItem('pNuevoPedidoIdCentro', center);
    $('#pLbNuevoPedidoCentroProveedor').text("> " + centerName);
    aux_center = center;

    console.log("ALTA-PEDIDO:  BD listando pedidos Antiguos por, Proveedor: " + localStorage["pNuevoPedidoIdProveedor"] + "Centro: " + localStorage["pNuevoPedidoIdCentro"]);

    db.transaction(function (transaction) {
    	
    		if(localStorage['dispositivo']!="PC"){//si es un movil solo se mostraran los envios manuales
        	var sql = "SELECT v.*, r.vendorCommunicationType FROM vendors as v, relPurchaseCenter_Vendors as r WHERE r.idVendor=v.idVendor AND r.vendorCommunicationType!='Manual' AND r.idPurchaseCenter=" + center + " ORDER BY name ASC";
				}else{
					var sql = "SELECT v.*, r.vendorCommunicationType FROM vendors as v, relPurchaseCenter_Vendors as r WHERE r.idVendor=v.idVendor AND r.idPurchaseCenter=" + center + " ORDER BY name ASC";
				}
				console.log(sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var pJsonPedidos = [];
                n_reg = 0;
                
                var tipo="";
                
                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);
										tipo = rowDb.vendorCommunicationType;
										
										if (tipo==undefined) { tipo=""; }
										
                    pJsonPedidos.push({

                        cod_proveedo: rowDb.idVendor,
                        nom_proveedo: rowDb.name,
                        tipo_envio: tipo

                    });
                    n_reg++;
                }

                if (n_reg == 1) {
                    console.log("Solo hay un Proveedor con nombre " + pJsonPedidos[0].nom_proveedo);
                    getLastOrders(pJsonPedidos[0].cod_proveedo, pJsonPedidos[0].nom_proveedo);
                } else {
                    var grid = $("#pGridProveedores").data("kendoGrid");

                    if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                        grid.destroy();
                    }

                    var mr = parseInt(localStorage.getItem("max_row_per_pag")-2); // -1 debido a los labels superiores
                    

                    //TRADUCCIONES GRID 
                    var cod = localStorage.getItem('str_codigo');
                    var prove = localStorage.getItem('pro');
                    var tipo = localStorage.getItem('str_tipo_de_envio');


                    $("#pGridProveedores").kendoGrid({
                        dataSource: {
                            data: pJsonPedidos,
                            schema: {
                                model: {
                                    fields: {
                                        cod_proveedo: {
                                            type: "string"
                                        },
                                        nom_proveedo: {
                                            type: "string"
                                        },
                                        tipo_envio: {
                                            type: "string"
                                        },
                                    }
                                }
                            },
                            pageSize: mr
                        },
                        filterable: true,
                        scrollable: false,
                        selectable: true,
                        pageable: true,
                        sortable: false,
                        columns: [{
                            field: "cod_proveedo",
                            headerTemplate:"<div style='position: relative; float: left'><a onclick='pOrdenarProveedores(\"cod_proveedo\",\"ordenaProv1\")' data-role='button' role='button'> " + cod 
                                            + " <img id='ordenaProv1' src='./images/sort_both.png' > </a> </div> ",
                            title: cod,
                            filterable: false,
                            template: "<div class='ra'>#= cod_proveedo #</div>",
                            width: '10%'
                        }, {
                            field: "nom_proveedo",
                            headerTemplate:"<div style='position: relative; float: left'><a onclick='pOrdenarProveedores(\"nom_proveedo\",\"ordenaProv2\")' data-role='button' role='button'> " + prove 
                                            + " <img id='ordenaProv2' src='./images/sort_both.png' > </a> </div> ",
                            title: prove,
                            filterable: false,
                            width: '60%'
                        }, {
                            field: "tipo_envio",
                            headerTemplate:"<div style='position: relative; float: left'><a onclick='pOrdenarProveedores(\"tipo_envio\",\"ordenaProv3\")' data-role='button' role='button'> " + tipo 
                                              + " <img id='ordenaProv3' src='./images/sort_both.png' > </a> </div> ",
                            title: tipo,
                            filterable: false,
                            width: '30%'
                        }]
                    });

                    $('.k-grid-pager').hide();
                    
                    localStorage["pedidos_pag_act"] = 1;
                    localStorage["pedidos_pag_max_row"] = mr;
                    localStorage["pedidos_pag_last"] = Math.ceil(n_reg / mr);

                    displayProviders();
                }



            }, error);

        console.log("Nuevo-PEDIDO:  Query Finalizada, Listando Proveedores");
    });
}

function pOrdenarProveedores(nombreColumna,imagen) {
	
	var aux = localStorage.getItem('sortgrid');
	var grid = $("#pGridProveedores").data("kendoGrid");
	
		switch (aux) {
			  case "0":
					grid.dataSource.sort({
							field: nombreColumna, 
							type: "string",
							dir: "desc" 
					});
					grid.refresh();
					localStorage.setItem('sortgrid',"1");
					$('#'+imagen).attr("src","./images/sort_desc.png");
			    break;
			  case "1":
					grid.dataSource.sort({
							field: nombreColumna, 
							type: "string",
							dir: "asc" 
					});
					grid.refresh();
					localStorage.setItem('sortgrid',"2");
					$('#'+imagen).attr("src","./images/sort_asc.png");
			    break;
			  case "2":
			    $("#pGridProveedores").data("kendoGrid").dataSource.sort({});
			    localStorage.setItem('sortgrid',"0");
			    $('#'+imagen).attr("src","./images/sort_both.png");
			    break;
		}
				
}

/*
function getProvidersByCenterOld(center, centerName) {
    localStorage.setItem('centro_seleccionado', centerName);
    aux_center = center;

    var contenedorPrincipal = document.getElementById("divlistaProveedoresPrincipal");
    $("#divlistaProveedores").empty();
    var divp = document.createElement('div');
    divp.id = 'divlistaProveedores';
    contenedorPrincipal.appendChild(divp);

    var contenedor1 = document.getElementById("divlistaProveedores");
    var ul = document.createElement("ul");
    ul.setAttribute("id", "plista_proveedores");
    ul.setAttribute("data-filter", "true");
    ul.setAttribute("data-role", "listview");
    ul.setAttribute("data-theme", "a");
    ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all ui-shadow");
    var l = document.createElement("li");
    l.setAttribute("role", "heading");
    l.setAttribute("data-role", "list-divider");
    l.setAttribute("class", "ui-li ui-li-divider ui-bar-d ui-li-has-count");
    var h3 = document.createElement("h3");
    h3.innerHTML = localStorage.getItem('pLbProveedoresDisponibles');
    var span = document.createElement("span");
    span.setAttribute("class", "ui-li-count ui-btn-up-c ui-btn-corner-all");
    var label = document.createElement("label");
    label.setAttribute("id", "num_proveedores");
    ul.appendChild(l);
    l.appendChild(h3);
    l.appendChild(span);
    span.appendChild(label);

    db.transaction(function (transaction) {
        var sql = "SELECT v.* FROM vendors as v, relPurchaseCenter_Vendors as r WHERE r.idVendor=v.idVendor AND r.idPurchaseCenter=" + center;

        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var i = 0;

                for (i = 0; i < result.rows.length; i++) {
                    var provider = result.rows.item(i);

                    var li;
                    li = document.createElement("li");
                    li.setAttribute("data-filtertext", provider.name);
                    ul.appendChild(li);

                    var a;
                    a = document.createElement("a");
                    a.setAttribute("href", "#");
                    a.setAttribute("onClick", "getLastOrders(" + provider.idVendor + ",'" + provider.name + "')");
                    a.innerHTML = provider.name;
                    li.appendChild(a);

                    //restArticleJSON(provider.codPro);
                    label.innerHTML = (i + 1);
                    console.log("Iteracion " + i + " elem " + provider.idVendor + " - " + provider.name);

                }
                contenedor1.appendChild(ul);
                if (i == 1) {
                    console.log("Solo hay un Proveedor");
                    getLastOrders(provider.idVendor, provider.name);
                } else {
                    $("#divlistaProveedores").trigger("create"); // HAcerlo o si no, no te mete los estilos
                    displayProviders();
                }


            }, error6);
    });


}*/


function error6(tx, error) {
    console.log("ERROR SQL" + error.message);

}


function getLastOrders(provider, providerName) {
    localStorage.setItem('proveedor_seleccionado', providerName);
    plistLastOrders(provider, aux_center);
}

function pRellenarGridNuevoPedido(proveedor, tipo) {
    console.log("RELLENAMOS LA GRID");

    var tabla = "";
    var condicion = "";

    db.transaction(function (transaction) {
         
        if (localStorage["pantalla"]=="pedidosDetalleNuevoEscaner")
        {   
            if (proveedor=="todos" || proveedor==null || proveedor=="") {
				/*
                var sql = "SELECT DISTINCT d.idItem, i.name, c.vendorReference, d.quantity, c.logisticChainName , c.ordinalType, null as error_row , i.itemUnitName as nombreUnidades, c.grossPrice  FROM ordersPendingDetail as d, ordersPending as o LEFT OUTER JOIN items as i ON d.idItem=i.idItem  LEFT OUTER JOIN logisticChains as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=o.idVendor 	WHERE d.idInternalOrder=o.IdInternalOrder AND o.tipoInterno=2 AND o.unfinished='TRUE' ORDER BY d.lineNumber ASC";
				*/
				
				// PEDIDO GLOBAL sin filtro
				var sql = "SELECT d.*, i.*, l.logisticChainName , d.ordinalType as numUds, c.vendorReference, d.idInternalOrder as idOrder, message as error_row, i.itemUnitName as nombreUnidades, c.grossPrice " + 
                        " FROM ordersPendingDetail as d, catalog as c, ordersPending as o "+
                        " LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=c.idVendor " + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " WHERE o.idInternalOrder=d.idInternalOrder AND o.tipoInterno="+TIPO_TEMPORAL_DRAFT+" AND o.unfinished='TRUE' AND  d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains  AND  c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] ;
				
			}	
				
            else {
			/*	
                var sql = "SELECT DISTINCT d.idItem, i.name, c.vendorReference, d.quantity, c.logisticChainName , c.ordinalType, null as error_row ,i.itemUnitName as nombreUnidades, c.grossPrice FROM ordersPendingDetail as d, ordersPending as o LEFT OUTER JOIN items as i ON d.idItem=i.idItem  LEFT OUTER JOIN logisticChains as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=o.idVendor WHERE d.idInternalOrder=o.IdInternalOrder AND o.idInternalOrder=d.idInternalOrder AND o.tipoInterno=2 AND o.unfinished='TRUE' AND o.idVendor="+proveedor+" ORDER BY d.lineNumber ASC";
            */
				//PEDIDO GLOBAL con filtro
				var sql = "SELECT d.*, i.*, l.logisticChainName , d.ordinalType as numUds, c.vendorReference, o.idInternalOrder as idOrder, message as error_row, i.itemUnitName as nombreUnidades, c.grossPrice " + 
                        " FROM ordersPendingDetail as d, catalog as c, ordersPending as o "+
                        " LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + proveedor + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " WHERE o.idInternalOrder=d.idInternalOrder AND o.tipoInterno="+TIPO_TEMPORAL_DRAFT+"  AND o.unfinished='TRUE'  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains  AND  c.idVendor=" + proveedor + " AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] ;
				
			}
            //console.log("SQL---> " + sql);
        }
        else {
           
			//PARA LOS CASOS DE NUEVO PEDIDO / MODIFICAR plantilla / Modificar Borrador ------------------------------------------------------
						
						//Miramos si tiene error y los mostramos en un pop up
						
						 var sql1 = "SELECT idInternalOrder , trim(message) as message  " + 
                        " FROM ordersPending as d  LEFT OUTER JOIN ordersPendingErrors as e ON e.idOrder=d.idInternalOrder "+ 
                        " WHERE d.idInternalOrder='" + localStorage['pNuevoPedidoIntenalId'] + "' " ;
			
						console.log(sql1);
						
						 transaction.executeSql(sql1, undefined,
		            function (transaction, result) {
		                if ( 1 == result.rows.length) {
		                	
		                	console.log("TIENE ERROR '"+result.rows.item(0).message+"'");
		                	
		                		if (result.rows.item(0).message != undefined && result.rows.item(0).message != "" )  {
		                			console.log("TIENE ERROR");
		                			
		                			$("#pedidosDialogAText").text(result.rows.item(0).message);
	              					$("#DialogPedisoDetalleErrorQuery").popup("open");	
		                		}
		                		
		                }
		            });
		            		
						
						
			
            console.log(localStorage['pNuevoPedidoIntenalId']);
            
            
            var sql = "SELECT d.*, i.*, l.logisticChainName , d.ordinalType as numUds, c.vendorReference, d.idInternalOrder as idOrder, message as error_row, i.itemUnitName as nombreUnidades, c.grossPrice " + 
                        " FROM ordersPendingDetail as d, catalog as c "+
                        " LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " WHERE d.idInternalOrder='" + localStorage['pNuevoPedidoIntenalId'] + "' AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + " AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " ORDER BY d.lineNumber ASC "  ;
			
			
		}    
        console.log("PAntalla actual ==> " +  localStorage['pantalla']+" | nuevo pedido id => "+localStorage['pNuevoPedidoIntenalId']);    
        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                var pJsonNuevoPedido = [];
								var rowDb=[];
								var des="";
								var precio=0;
								var total=0;
								var n_reg = 0;
                for (var i = 0; i < result.rows.length; i++) {
                    rowDb = result.rows.item(i);
										
										
										var ref=rowDb.vendorReference;
										if (rowDb.vendorReference == undefined || rowDb.vendorReference == null || rowDb.vendorReference == "undefined"  ) { ref=""}
										
										if (rowDb.logisticChainName == undefined || rowDb.logisticChainName == "undefined" ) { des=rowDb.nombreUnidades; }
										else { des=rowDb.logisticChainName;  console.log("222222222");}
										
										
										total=parseFloat(rowDb.quantity) * parseFloat(parseNumberLogisticChain(rowDb.ordinalType)) ;
										
										if (typeof total === 'number' && total.toString().indexOf(".") > 0 ) {
                                    	
                      	total=total.toString().substring(0,total.toString().indexOf(".")+3);
                      	total=formatearMonedaIdioma(total, 2, ".", ",");
                      } 
										console.log( " AQUIIIIII => "+rowDb.quantity + " " + parseFloat(rowDb.quantity) +" | " +rowDb.ordinalType+" " + parseFloat(parseNumberLogisticChain(rowDb.ordinalType)) + " = " +total);

										precio = parseFloat(rowDb.quantity) * parseFloat(rowDb.grossPrice)* parseFloat(rowDb.ordinalType);
										precio = precio.toFixed(2);
										
										var formatPrecio = formatearMoneda(precio);
                    
											
                    pJsonNuevoPedido.push({

                        cod_pedid: rowDb.idItem,
                        ref_prov: ref,
                        nom_pedid: rowDb.name,
                        uds: rowDb.quantity,
                        cad_log: des,
                        totales: total,
                        precios: formatPrecio,
                        mensaje:rowDb.error_row

                    });
					 					n_reg = n_reg + 1;
                }
                				
								var grid = $("#pGridNuevoPedido").data("kendoGrid");

                if ( grid != null ) { //destruimos el grid asi cuando cargamos no se duplique botones
                     console.log("Destruida");
                    $('#pGridNuevoPedido').data().kendoGrid.destroy();
                    $('#pGridNuevoPedido').empty();
                } else {
									 console.log("Destruida NOOOO"); 
								}

               	var mr = parseInt(localStorage["pedidos_detalle_pag_max_row_max"] - 1 ); 
                console.log("maximas filas en detalle pedido" + mr);

                //TITULOS DE LA GRID 
                var codi = localStorage.getItem('cod');
                var cade = localStorage.getItem('cad');
                var refprov = localStorage.getItem('ref_prov');
                var uds = localStorage.getItem('uds');
                var nomart = localStorage.getItem('nom_art');
                var tot = localStorage.getItem('totales');
                
                $("#pGridNuevoPedido").kendoGrid({
                    
                    dataSource: {
                        data: pJsonNuevoPedido,
                        schema: {
                            model: {
                                fields: {
                                    cod_pedid: { type: "string" },
                                    ref_prov: { type: "string" },
                                    nom_pedid: { type: "string" },
                                    uds: {type: "string"},
                                    cad_log: {type: "string"},
                                    totales: { type: "string" },
                                    precios:{type:"string"}
                                }
                            }
                         },
                        pageSize: mr
                    },
                    scrollable: false,
                    sortable: false,
                    filterable: true,
                    pageable: true,
                    selectable: true,  
                    rowTemplate: '<tr class="#:mensaje!=null? \"colorRowGrid\" : \"white\"#"> <td class="ra">#=cod_pedid#</td> <td class="ra">#=ref_prov#</td> <td>#=nom_pedid#</td> <td class="ra">#=uds#</td>'+
				                         '<td>#=cad_log#</td> <td class="ra">#=totales#</td> <td class="ra">#=precios#</td> <td style="text-align: center">  <img class="checkbox" src="images/trash.png" style="width: 30px; height: 30px "></td> </tr>',
				                                          /*<td class="ra">#=precios#</td> <td class="ra">#=mensaje#</td>'*/
                    columns: [{
                        field: "cod_pedid",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"cod_pedid\",\"ordenacionNuevoPed1\")' data-role='button' role='button'> " 
		                                 + codi + " <img id='ordenacionNuevoPed1' src='./images/sort_both.png' > </a> ", 
                        filterable: false,
                        template: "<div class='ra'>#= cod_pedid #</div>",
                        title: codi,
                        width: '8%'
                    }, {
                        field: "ref_prov",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"ref_prov\",\"ordenacionNuevoPed2\")' data-role='button' role='button'> " 
		                                 + refprov + " <img id='ordenacionNuevoPed2' src='./images/sort_both.png' > </a> ",
                        filterable: false,
                        template: "<div class='ra'>#= ref_prov #</div>",
                        title: refprov,
                        width: '8%'
                    }, {
                        field: "nom_pedid",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"nom_pedid\",\"ordenacionNuevoPed3\")' data-role='button' role='button'> " 
		                                 + nomart + " <img id='ordenacionNuevoPed3' src='./images/sort_both.png' > </a> ",
                        filterable: false,
                        title: nomart,
                        width: '39%'
                    }, {
                        field: "uds",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"uds\",\"ordenacionNuevoPed4\")' data-role='button' role='button'> " 
		                                 + uds + " <img id='ordenacionNuevoPed4' src='./images/sort_both.png' > </a> ",
                        filterable: false,
                        template: "<div class='ra'>#= uds #</div>",
                        title: uds,
                        width: '7%'
                    }, {
                        field: "cad_log",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"cad_log\",\"ordenacionNuevoPed5\")' data-role='button' role='button'> " 
		                                 + cade + " <img id='ordenacionNuevoPed5' src='./images/sort_both.png' > </a> ",
                        filterable: false,
                        title: cade,
                        width: '15%'
                    }, {
                        field: "totales",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"totales\",\"ordenacionNuevoPed6\")' data-role='button' role='button'> " 
		                                 + tot + " <img id='ordenacionNuevoPed6' src='./images/sort_both.png' > </a> ",
                        filterable: false,
                        template: "<div class='ra'>#= totales #</div>",
                        title: tot,
                        width: '7%'
                    },{
                        field: "precios",
                        headerTemplate: "<div style='position: relative; float: left'>"+
					                "<a onclick='' data-role='button' role='button'> " + "Precios" + " <img id='ordenacionNuevoPed7' src='./images/sort_both.png' > </a> ",
                        filterable: false,
                        //template: "<div class='ra'>#= precios #</div>",
                        title: "Precios",
                        width: '10%'
                    },{
                        field: "Eliminar",
                        headerTemplate: "<div style='position: relative; float: center'> <a onclick='' data-role='button' role='button'><center> " + "<img id='sortPedidosVendors' src='./images/papelera.png'></center> ",
                        //template: "<input  type='checkbox' class='checkbox' />",
                        filterable: false,
                        width: '6%'
                    }]
                });




                console.log("PASO 2");

               var gridNuevoPedido = $("#pGridNuevoPedido").data("kendoGrid");

               gridNuevoPedido.hideColumn("precios");

               gridNuevoPedido.table.on("click", ".checkbox", function (e) {

                   grid = $("#pGridNuevoPedido").data("kendoGrid");
                   var row = $(e.target).closest("tr");
                   var item = grid.dataItem(row);
                   localStorage['itemCheckGridNuevoPedido'] = item.cod_pedid;
                   var row2 = $(this).closest("tr");
                   var rowIdx = $("tr", grid.tbody).index(row2);
                   localStorage['numFilaSeleccionada'] = rowIdx;

                   $("#pDialogEliminarNuevoArticulo").popup("open");

               });



               $('.k-grid-pager').hide();
               if (localStorage["plantillas"] == "plantillas" || tipo == "2") {
                   console.log("Estamos en footer pRellenar pedido tipo 2");
                   displayModificarPlantilla();
               } else if (localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "emitidos" || localStorage["pantalla"] == "pedidos_cabecera") {
                   console.log("YYYYYY");
                   displayDetalleNuevoPedido();
               } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") {
                   console.log("Estamos en footer pRellenar para pedidos Detalle  Nuevo escanner");
                   $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
                   $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
                   $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
                   $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
                   $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
                   $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");
                   displayDetalleNuevoPedidoEscaner();
               } else {
                   console.log("Footer por defecto");
                   displayDetalleNuevoPedido();
               }



                if (localStorage["pedidos_detalle_pag_act"] > 1) {
                   console.log("HA OCURRIDO ESTO");
                   gridNuevoPedido.dataSource.page(localStorage["pedidos_detalle_pag_act"]);
                   localStorage["pedidos_detalle_pag_max_row"] = Math.ceil(parseInt(localStorage["pedidos_detalle_pag_max_row_max"]) - 1);
                   localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / (parseInt(localStorage["pedidos_detalle_pag_max_row"])));
                   console.log(" DETALLE ACT +1 OPERACION DE PAGINACION: PAG_LAST " + localStorage["pedidos_detalle_pag_last"] + "RESULTADO DE " + n_reg + "/" + localStorage["pedidos_detalle_pag_max_row"] + "-1");
               } else {
                   localStorage["pedidos_detalle_pag_act"] = 1;
                   localStorage["pedidos_detalle_pag_max_row"] = Math.ceil(parseInt(localStorage["pedidos_detalle_pag_max_row_max"]) - 1);
                   localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / (parseInt(localStorage["pedidos_detalle_pag_max_row"])));
                   console.log("OPERACION DE PAGINACION: PAG_LAST " + localStorage["pedidos_detalle_pag_last"] + "RESULTADO DE " + n_reg + "/" + localStorage["pedidos_detalle_pag_max_row"] + "-1");
               }

               if (localStorage["pantalla"] == "pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) { // Esta des-seleccionado --> No hay que mostrar precios
                   console.log("Escondemos la columna de precios");
                   gridNuevoPedido.showColumn("precios");
                   gridNuevoPedido.hideColumn("precios");
                   gridNuevoPedido.showColumn("totales");
                   gridNuevoPedido.showColumn("cad_log");
               } else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") < 0) {
                   console.log("Escondemos las columnas de cad_log y totales");
                   gridNuevoPedido.showColumn("precios");
                   gridNuevoPedido.showColumn("totales");
                   gridNuevoPedido.showColumn("cad_log");
                   gridNuevoPedido.hideColumn("totales");
                   gridNuevoPedido.hideColumn("cad_log");
               }

               console.log("PAGINANDO ==>  " + localStorage["pedidos_detalle_pag_max_row_min"] + " " + n_reg + " / " + localStorage["pedidos_detalle_pag_max_row"]);

               console.log("PASO 3");

            }, error);

        console.log("Nuevo-PEDIDO:  Query Finalizada");
    });

}

///////////////////////////////////////////////////////////////////
///////////////Ordenacion de la grid de NUevoPedido
function pOrdenacionGridNuevoPedido(Grid,nombreColumn,nombreImg) {
	
	var aux = localStorage.getItem('sortgrid');
	
		switch (aux) {
			  case "0":
			    var tipoOrdenacion = "desc";
			    var grid = $("#"+Grid).data("kendoGrid");
						grid.dataSource.sort({
							field: nombreColumn, 
							type: "string",
							dir: "desc" 
					});
          /*grid.showColumn("precios");        
          grid.hideColumn("precios");  */
					localStorage.setItem('sortgrid',"1");
					$('#'+nombreImg).attr("src","./images/sort_desc.png");
					localStorage["columnaOrdena"]=nombreColumn;
					if (localStorage["pantalla"]=="pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) { // Esta des-seleccionado --> No hay que mostrar precios
							        console.log("Ordenando sin la columna precios");
							        grid.showColumn("cad_log");
							        grid.showColumn("totales");
							        grid.hideColumn("precios");
				    }
				    else if(localStorage["pantalla"]=="pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") < 0)
				    {
				    		console.log("Ordenando con la columna precios");
				        grid.hideColumn("cad_log");
				        grid.hideColumn("totales");
				        grid.showColumn("precios");
				        
				    }
					
			    break;
			  case "1":
			  	var tipoOrdenacion = "asc";
			    var grid = $("#"+Grid).data("kendoGrid");
						grid.dataSource.sort({
							field: nombreColumn, 
							type: "string",
							dir: "asc" 
						});
					/*grid.showColumn("precios");      
          grid.hideColumn("precios");*/ 
					localStorage.setItem('sortgrid',"2");
					$('#'+nombreImg).attr("src","./images/sort_asc.png");
					localStorage["columnaOrdena"]=nombreColumn;
					if (localStorage["pantalla"]=="pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) { // Esta des-seleccionado --> No hay que mostrar precios
				        console.log("Ordenando sin la columna precios");
				        
				        grid.showColumn("totales");
				        grid.showColumn("cad_log");
				        grid.hideColumn("precios");
				    }
				    else if(localStorage["pantalla"]=="pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") < 0)
				    {
				    		console.log("Ordenando con la columna precios");
				        grid.showColumn("precios");
				        grid.hideColumn("totales");
				        grid.hideColumn("cad_log");
				    }
			    break;
			  case "2":
			    $("#"+Grid).data("kendoGrid").dataSource.sort({});  
			    var grid = $("#"+Grid).data("kendoGrid");   
          /*grid.showColumn("precios");     
          grid.hideColumn("precios");*/ 
			    localStorage.setItem('sortgrid',"0");
			    $('#'+nombreImg).attr("src","./images/sort_both.png");
			    localStorage["columnaOrdena"]=nombreColumn;
			    if (localStorage["pantalla"]=="pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) { // Esta des-seleccionado --> No hay que mostrar precios
							       console.log("Ordenando sin la columna precios");
							        grid.hideColumn("precios");
							        grid.showColumn("totales");
							        grid.showColumn("cad_log");
							    }
							    else if(localStorage["pantalla"]=="pedidosDetalleNuevo" && $('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") < 0)
							    {
							    	console.log("Ordenando con la columna precios");
							        grid.showColumn("precios");
							        grid.hideColumn("totales");
							        grid.hideColumn("cad_log");
							    }
			    
			    break;
		}
				
}

function pMostrarArticulosEscaner(idItemEANS){
	
	db.transaction(function (transaction) {
		
		var sql = "SELECT c.idVendor,c.idItem,c.idLogisticsChains,c.logisticChainName FROM catalog as c WHERE c.idItem='"+idItemEANS+"' AND idPurchaseCenter="+localStorage['pNuevoPedidoIdCentro']+" AND idVendor="+localStorage['pNuevoPedidoIdProveedor']+" ORDER BY c.idItem DESC ";
									
        console.log("CONSULTA MOSTRAR DETALLE ARTICULO POR EAN" + sql);

         transaction.executeSql(sql, undefined,
        function (transaction, result) {
        	
				  var pJsonPedidos = [];
          console.log("RESULTADOS DE EANS ENCONTRADOS" + result.rows.length);

          for (var i = 0; i < result.rows.length; i++) {
              var rowDb = result.rows.item(i);

              pJsonPedidosEscaner.push({
                  cod_articulo: rowDb.idVendor,
                  referencia: rowDb.idItem,
                  nombre: rowDb.idLogisticsChains,
                  stock: rowDb.logisticChainName
              });
          }
          
          var grid = $("#pGridArticulosEscaner").data("kendoGrid");

          if (grid != null) { 
              grid.destroy();
          }

          var mr = parseInt(localStorage.getItem("max_row_per_pag")) - 2;

          localStorage["pedidos_pag_act"] = 1;
          localStorage["pedidos_pag_max_row"] = mr;
          localStorage["pedidos_pag_last"] = Math.ceil(pJsonPedidosEscaner.length / mr);

          console.log("Numero max por pag:" + mr);

          //TRADUCCIONES GRID 
         /* var nume = localStorage.getItem('num');
          var infor = localStorage.getItem('info');
          var prove = localStorage.getItem('pro');
          var emit = localStorage.getItem('emi');
          var entr = localStorage.getItem('ent');
          var imag = localStorage.getItem('ima');
          var conteng = localStorage.getItem('contenga');
          var filtro = localStorage.getItem('fil');
          var limp = localStorage.getItem('lim');
          var desc = localStorage.getItem('art');
          var stk = localStorage.getItem('stk');
          var ref = localStorage.getItem('ref_prov');*/

          $("#pGridArticulosEscaner").kendoGrid({
              dataSource: {
                  data: pJsonPedidosEscaner,
                  schema: {
                      model: {
                          fields: {
                              cod_articulo: {type: "string"},
                              referencia: {type: "string"},
                              nombre: {type: "string"},
                              stock: {type: "string"}
                          }
                      }
                  },
                  pageSize: mr
              },
              scrollable: false,
              selectable: true,
              resizable: true,
              filterable: true,
              pageable: true,
              sortable: false,
              columns: [{
                  field: "cod_articulo",
                  title: nume,
                  filterable: false,
                  template: "<div class='ra'>#= cod_articulo #</div>",
                  headerTemplate: "<div style='position: relative; float: left'><a onclick='sort1()' data-role='button' role='button'> " + nume + " <img id='sortPedidosVendors1' src='./images/sort_both.png' > </a>  </div> <div style='position: relative; float: right'> <a onclick='prueba1()' data-role='button' role='button'> <img id='filterPedidosVendors1' src='./images/filtroGrid.png' > </a></div>",
                  width: '8%'
              }, {
                  field: "referencia",
                  title: prove,
                  filterable: false,
                  template: "<div class='ra'>#= referencia #</div>",
                  headerTemplate: "<div style='position: relative; float: left'><a onclick='sort2()' data-role='button' role='button'> " + ref + " <img id='sortPedidosVendors2' src='./images/sort_both.png' > </a>  </div> <div style='position: relative; float: right'> <a onclick='prueba2()' data-role='button' role='button'> <img id='filterPedidosVendors1' src='./images/filtroGrid.png' > </a></div>",
                  width: '12%'
              }, {
                  field: "nombre",
                  title: prove,
                  filterable: false,
                  //headerTemplate: "<div style='position: relative; float: left'>"+ prove + "<button onclick='prueba3()'>Fil</button> </div> <div style='position: relative; float: right'> <button onclick='sort3()' >Sor</button></div>", 
                  headerTemplate: "<div style='position: relative; float: left'><a onclick='sort3()' data-role='button' role='button'> " + desc + " <img id='sortPedidosVendors3' src='./images/sort_both.png' > </a> </div> <div style='position: relative; float: right'> <a onclick='prueba3()' data-role='button' role='button'> <img id='filterPedidosVendors1' src='./images/filtroGrid.png' > </a></div>",
                  width: '70%'
              }, {
                  field: "stock",
                  title: stk,
                  filterable: false,
                  template: "<div class='ra'>#= stock #</div>",
                  //headerTemplate: "<div style='position: relative; float: left'>"+ prove + "<button onclick='prueba3()'>Fil</button> </div> <div style='position: relative; float: right'> <button onclick='sort3()' >Sor</button></div>", 
                  headerTemplate: "<div style='position: relative; float: left'><a onclick='sort4()' data-role='button' role='button'> " + stk + " <img id='sortPedidosVendors3' src='./images/sort_both.png' > </a> </div> <div style='position: relative; float: right'> <a onclick='prueba3()' data-role='button' role='button'> <img id='filterPedidosVendors1' src='./images/filtroGrid.png' > </a></div>",
                  width: '8%'
              }]
          });




          $('.keyboard').blur(); //escondemos el teclado                    
          $('.k-grid-pager').hide();

          //displayNuevoPedidoEscaner(); // Show/hide Divs
    
						            	
				});
	},error6);
				
}            	

