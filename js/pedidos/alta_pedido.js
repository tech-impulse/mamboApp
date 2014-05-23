function plistLastOrders(provider, center) {
    $('#pLbNuevoPedidoCentroAnterior').text("> " + localStorage["centro_seleccionado"]);
    $('#pLbNuevoPedidoProveedorAnterior').text("> " + localStorage["proveedor_seleccionado"]);
    if (localStorage["pantalla"] == "nuevo_proveedores") // Venimos de seleccionar Centro y Proveedor, cambiarlos
    {
        console.log("Cambialos");
        localStorage["pNuevoPedidoIdProveedor"] = provider;
        localStorage["pNuevoPedidoIdCentro"] = center;
    } else
        console.log("PAAAAAAAAAAAAAAAAAAAPAPA " + localStorage["pantalla"]);


    console.log("ALTA-PEDIDO:  BD listando pedidos Antiguos por, Proveedor: " + localStorage["pNuevoPedidoIdProveedor"] + "Centro: " + localStorage["pNuevoPedidoIdCentro"]);

    db.transaction(function (transaction) {

        var sql = "SELECT o.idOrder, o.documentDate, o.reference, o.deliveryDate , p.name as centro,  v.name as proveedor, s.icon FROM orders as o, vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.idVendor=" + localStorage["pNuevoPedidoIdProveedor"] + " AND o.idPurchaseCenter=" + localStorage["pNuevoPedidoIdCentro"] + " ORDER BY o.idOrder DESC;";

        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                var pJsonPedidos = [];

                n_reg = 0;
                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);

                    pJsonPedidos.push({

                        cod_pedid: rowDb.idOrder,
                        reference: rowDb.reference,
                        cod_centr: rowDb.centro,
                        cod_proveedo: rowDb.proveedor,
                        fecha_emisio: formatearFechaHoraKendo(rowDb.documentDate),
                        fecha_entreg: formatearFechaKendo(rowDb.deliveryDate),
                        estado_pedid: rowDb.icon
                    });
                    n_reg++;
                }

                var grid = $("#pGridPedidosAnteriores").data("kendoGrid");

                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                     $("#pGridPedidosAnteriores").data().kendoGrid.destroy();
		          				$("#pGridPedidosAnteriores").empty();
                }

                var mr = parseInt(localStorage.getItem("max_row_per_pag") -2); // Una fila menos debido a los labels superiores.
                
                //TRADUCCIONES GRID 
                var nume = localStorage.getItem('num');
                var infor = localStorage.getItem('info');
                var prove = localStorage.getItem('pro');
                var emit = localStorage.getItem('emi');
                var entr = localStorage.getItem('ent');
                var imag = localStorage.getItem('ima');
                var conteng = localStorage.getItem('contenga');
                var empiez = localStorage.getItem('igual');
                var col = localStorage.getItem('columns');
                var fil = localStorage.getItem('filtro');
                var asc = localStorage.getItem('asc');
                var desc = localStorage.getItem('desc');
                var filtit = localStorage.getItem('filtitulo');
                var filtro = localStorage.getItem('fil');
                var limp = localStorage.getItem('lim');

                $("#pGridPedidosAnteriores").kendoGrid({
                    dataSource: {
                        data: pJsonPedidos,
                        schema: {
                            model: {
                                fields: {
                                    reference: {
                                        type: "string"
                                    },
                                    cod_centr: {
                                        type: "string"
                                    },
                                    cod_proveedo: {
                                        type: "string"
                                    },
                                    fecha_emisio: {
                                        type: "date"
                                    },
                                    fecha_entreg: {
                                        type: "date"
                                    },
                                    image: {
                                        type: "php"
                                    }
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
                        field: "reference",
                        title: nume,
                        filterable: false,
                        width: '11%'
                    }, {
                        field: "cod_centr",
                        title: infor,
                        filterable: false,
                        width: '24%'
                    }, {
                        field: "cod_proveedo",
                        title: prove,
                        filterable: false,
                        width: '30%'
                    }, {
                        field: "fecha_emisio",
                        headerTemplate: "<div style='position: relative; float: left'> <a onclick='pOrdenacionGridPedidosAnteriores(\"fecha_emisio\",\"sortPedidosInsert\",\"dd-MM-yyyy HH:mm\")' data-role='button' role='button'> " 
                                        + emit + " <img id='sortPedidosInsert' src='./images/sort_both.png' > </a></div> " ,
                        title: emit,
                        format: "{0:dd-MM-yyyy HH:mm}",
                        filterable: false,
                        
                        width: '16%'
                    }, {
                        field: "fecha_entreg",
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionGridPedidosAnteriores(\"fecha_entreg\",\"sortPedidosInsert2\",\"dd-MM-yyyy\")' data-role='button' role='button'> " 
		                                    + entr + "<img id='sortPedidosInsert2' src='./images/sort_both.png' > </a></div>",
                        title: entr,
                        format: "{0:dd-MM-yyyy}",
                        filterable: false,
                        width: '12%'
                    }, {
                        field: "image",
                        filterable: false,
                        title: imag,
                        width: '7%',
                        template: "#= getIconoStatus(estado_pedid) #"
                    }]
                });

                $('.k-grid-pager').hide();

                ////////////////////////////////////////
                // NAVEGACION    
                localStorage["pedidos_pag_act"] = 1;
                localStorage["pedidos_pag_max_row"] = parseInt(mr);
                console.log(" n_reg " + n_reg + " mr " + mr + " ultima pagina " + localStorage.getItem("max_row_per_pag"));
                localStorage["pedidos_pag_last"] = Math.ceil(parseInt(n_reg) / parseInt(mr));

                console.log("Numero max por pag:" + localStorage.getItem("max_row_per_pag"));
                displayPedidosAnterioresNuevoPedido();
                //resizeGrid();

            }, error);

        console.log("ALTA-PEDIDO:  Query Finalizada");
    });
}

////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes tabla plantillas
function pOrdenacionGridPedidosAnteriores(NombreColumna,imagen,formato) {
	
	var aux = localStorage.getItem('sortgrid');
	var grid = $("#pGridPedidosAnteriores").data("kendoGrid");
	console.log("ORDENADO LA COMUNA " + NombreColumna +" "+ imagen +" "+ formato ); 	
		switch (aux) {
			  case "0":
						grid.dataSource.sort({
							field: NombreColumna, 
							format: formato,
							type: "date",
							dir: "desc" 
					});
					grid.refresh();
					localStorage.setItem('sortgrid',"1");
					$('#'+imagen).attr("src","./images/sort_desc.png");
			    break;
			  case "1":
						grid.dataSource.sort({
							field: NombreColumna,
							format: formato, 
							type: "date",
							dir: "asc" 
					});
					grid.refresh();
					localStorage.setItem('sortgrid',"2");
					$('#'+imagen).attr("src","./images/sort_asc.png");
			    break;
			  case "2":
			    $("#pGridPedidosAnteriores").data("kendoGrid").dataSource.sort({});
			    console.log("ORDENADO LA COMUNA " + NombreColumna +" "+ imagen +" "+ formato ); 
			    localStorage.setItem('sortgrid',"0");
			    $('#'+imagen).attr("src","./images/sort_both.png");
			    break;
		}
}



function pMostrarDetallePedidoAnterior(data, modo) {
    db.transaction(function (transaction) {
        console.log("ALTA-PEDIDO: Inicio pMostrarDetallePedidoAnterior");
        localStorage['pDetalleAnterior'] = data;
        var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado , s.icon as icono, s.id as tipo FROM orders as o,  vendors as v , purchaseCenters as p, status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=o.status AND o.status=s.id AND  o.idOrder='" + data + "'";
        console.log("SQL ---> " + sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length) {

                    var preu;

                    for (var i = 0; i < result.rows.length; i++) {
                        var rowDb = result.rows.item(i);

                        $("#txtCodPedido").val(rowDb.reference);
                        $("#txtCodCentro").val(rowDb.centro);
                        // sera una combo $("#txtNomCentro")
                        //$("#txtCodProveedor").val(rowDb.cod_proveedor);
                        $("#txtNomProveedor").val(rowDb.proveedor);
                        // Nom proveedor será combo
                        $("#txtFechaEmision").val(darFormatoSegunWS(rowDb.documentDate.substring(0, 16),true));
                        //$("#txtHoraEmision").val(rowDb.hora_entrega);
                        $("#txtFechaEntrega").val(darFormatoSegunWS(rowDb.deliveryDate.substring(0, 10)));
                        //$("#txtEstadoPedido").val(rowDb.estado);
                        preu = Math.round(rowDb.amount * 100) / 100
                        $("#txtValorPedido").val(formatearMoneda(preu));
                        $("#txtEstadoPedido").text(rowDb.tipo);
                        $("#txtEstadoPedido2").val(rowDb.estado);
                        $("#txtEstadoPedido2").css('display', 'inside');
                        $("#txtEstadoPedido2").css('padding-left', '15px');
                        
                         $("#imagenEstado").attr("src", './images/'+rowDb.icono);

                    }
                    

                    var grid = $("#pGridPedidosDet").data("kendoGrid");

                     if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
		                    console.log("Destruida");
		                    $("#pGridPedidosDet").data().kendoGrid.destroy();
		                    $("#pGridPedidosDet").empty();
		                 }

                    //Listado de articulos
                    //var sqlItem = "SELECT d.*, i.*, c.desCantidad FROM ordersDetail as d, items as i, catalog as c WHERE  d.idItem=i.idItem AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor="+rowDb.idVendor+ "  AND d.idOrder='"+data+"' "; 
					
					
					
					
					 var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad, d.ordinalType as numUds, null as error_row, i.itemUnitName " +
                        " FROM ordersDetail as d , items as i  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + rowDb.idVendor +  
                        " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
                        " WHERE d.idItem=i.idItem AND d.idOrder='" + data + "' ";
					
					
					
		console.log("SQL --->" + sqlItem);
                    transaction.executeSql(sqlItem, undefined,
                        function (transaction, result) {
                            if (result.rows.length) {

                                var n_reg = 0;
                                var pJsonPedidosDet = [];

								var cadena="";
								var total=0;
								
                                for (var i = 0; i < result.rows.length; i++) {
                                    console.log("Paso1");
                                    var rowDb = result.rows.item(i);

									
									if (rowDb.desCantidad==null || rowDb.desCantidad=="") { cadena=rowDb.itemUnitName; }
                                    else cadena=rowDb.desCantidad;
                                    	
                                    total=parseFloat(rowDb.quantity) * parseFloat(parseNumberLogisticChain(rowDb.numUds)) ;
									
                                    pJsonPedidosDet.push({

                                        cod_articulo: rowDb.idItem,
                                        nom_articulo: rowDb.name,
                                        cant_pedida: rowDb.quantity,
                                        cadena_logistica: cadena,
                                        unidades_total: total

                                    });
                                    n_reg = n_reg + 1;
                                }
                                
                                 localStorage["pedidos_detalle_pag_act"] = 1;
                                if (modo == true) {
                                    localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_min"]);
                                    //console.log("Menos Detalle " + localStorage["pedidos_detalle_pag_max_row_min"]);
                                } else {
                                    localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_max"]);
                                    //console.log("Mas Detalle " + localStorage["pedidos_detalle_pag_max_row_max"]);
                                }

                                localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / localStorage["pedidos_detalle_pag_max_row"]);


                                var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
                                
                                //localStorage["pedidos_detalle_pag_act"] = 1;
                                //localStorage["pedidos_detalle_pag_max_row"] = Math.ceil(localStorage["pedidos_detalle_pag_max_row_min"])+1;
                                //localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / localStorage["pedidos_detalle_pag_max_row"]);


                              //  var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
                               // mr = mr;
                                console.log("maximas filas en detalle pedido" + mr);


                                //TITULOS DE LA GRID 
                                var codi = localStorage.getItem('cod');
                                var des = localStorage.getItem('art');
                                var prov = localStorage.getItem('ref');
                                var cant = localStorage.getItem('can');
                                var cade = localStorage.getItem('cad');
                                var unid = localStorage.getItem('uni');

                                var cod = localStorage.getItem('cod');

                                var col = localStorage.getItem('columns');
                                var fil = localStorage.getItem('filtro');
                                var asc = localStorage.getItem('asc');
                                var desc = localStorage.getItem('desc');

                                var comienza = localStorage.getItem('comienza');
                                var igual = localStorage.getItem('igual');
                                var diferente = localStorage.getItem('diferente');

                                var filtit = localStorage.getItem('filtitulo');

                                var filtro = localStorage.getItem('fil');
                                var limp = localStorage.getItem('lim');


                                $("#pGridPedidosDet").kendoGrid({

                                    dataSource: {
                                        data: pJsonPedidosDet,
                                        schema: {
                                            model: {
                                                fields: {
                                                    cod_articulo: {
                                                        type: "string"
                                                    },
                                                    nom_articulo: {
                                                        type: "string"
                                                    },
                                                    cant_pedida: {
                                                        type: "string"
                                                    },
                                                    cadena_logistica: {
                                                        type: "string"
                                                    },
                                                    unidades_total: {
                                                        type: "string"
                                                    }
                                                }
                                            }
                                        },
                                        pageSize: mr
                                    },
                                    scrollable: false,
                                    sortable: true,
                                    filterable: true,
                                    pageable: true,
                                    columns: [{
                                        field: "cod_articulo",
                                        template: "<div class='ra'>#= cod_articulo #</div>",
                                        filterable: false,
                                        title: cod,
                                        width: '7%'
                                    }, {
                                        field: "nom_articulo",
                                        filterable: false,
                                        title: des,
                                        width: '50%'
                                    }, {
                                        field: "cant_pedida",
                                        template: "<div class='ra'>#= cant_pedida #</div>",
                                        filterable: false,
                                        title: cant,
                                        width: '7%'
                                    }, {
                                        field: "cadena_logistica",
                                        filterable: false,
                                        title: cade,
                                        width: '16%'
                                    }, {
                                        field: "unidades_total",
                                        template: "<div class='ra'>#= unidades_total #</div>",
                                        filterable: false,
                                        title: unid,
                                        width: '7%'
                                    }]
                                });

                                $('.k-grid-pager').hide();


                                //activate_buttons_header(1 , "Detalle de pedidos", 1);
                                $("#tblDetallePedido_paginate").hide();
                                $("#tblDetallePedido_filter").css("display", " none");
                                displayDetalleAnterior();
                                console.log(" ALTA-PEDIDO: Detalle Pedidos INCIO pag_act=" + localStorage["pedidos_detalle_pag_act"] + "| max_row_per_pag=" + localStorage["pedidos_detalle_pag_max_row"] + " | LAST PAGE " + localStorage["pedidos_detalle_pag_last"]);


                            } else{
                                console.log("No hay Artículos Para este Pedido " + data);
                                getDescripcionAviso("SinArticulos");
                                $("#pedidosDialogAC").popup("open");
							}
                        }, error);
                }
            }, error);
        console.log("ALTA-PEDIDO: Fin pMostrarDetallePedidoAnterior");
    });
}



function pListaNuevoPedido(data) {

    $('#pLbCentroSeleccionado').text(" > "+localStorage.getItem('centro_seleccionado')+" > ");
    $('#pLbProveedorSeleccionado').text(localStorage.getItem('proveedor_seleccionado'));
    console.log(localStorage.getItem('centro_seleccionado'));
    console.log(localStorage.getItem('proveedor_seleccionado'));
    var grid = $("#pGridNuevoPedido").data("kendoGrid");

    if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
        console.log("Destruida!!!!!!!!!!!!!!!!!!!!!!!!!!!! con codigo " + data);
        $('#pGridNuevoPedido').data().kendoGrid.destroy();
        $('#pGridNuevoPedido').empty();
    }
    db.transaction(function (transaction) {
        console.log("Inicio pMostrarDetallePedido");


        var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado FROM orders as o,  vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=o.status AND o.idOrder='" + data + "'";
        
        console.log("DEBUG ==> " + sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                console.log("DETALLE PEDIDO PASO 1");
                if (result.rows.length) {
                    console.log("DETALLE PEDIDO PASO 2");
                    var preu;

                    for (var i = 0; i < result.rows.length; i++) {
                        var rowDb = result.rows.item(i);

                    }

                    console.log("DETALLE PEDIDO PASO 3");

                    //Listado de articulos
                    //var sqlItem = "SELECT d.*, i.*, c.desCantidad FROM ordersDetail as d, items as i, catalog as c WHERE  d.idItem=i.idItem AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor="+rowDb.idVendor+ "  AND d.idOrder='"+data+"' "; 
                    //var sqlItem = "SELECT d.*, i.*, c.logisticChainName as desCantidad FROM ordersDetail as d, items as i, catalog as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + "  AND d.idOrder='" + data + "' ";
										var sqlItem = "SELECT d.*, i.*, c.logisticChainName as desCantidad, c.ordinalType as numUds, d.idInternalOrder as idOrder, message as error_row, i.itemUnitName " + 
                        " FROM ordersPendingDetail as d LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " WHERE d.idInternalOrder='" + data + "' ";
										
										
                    transaction.executeSql(sqlItem, undefined,
                        function (transaction, result) {

                            console.log("DETALLE PEDIDO PASO 4");
                            if (result.rows.length) {
                                console.log("DETALLE PEDIDO PASO 5");
                                var n_reg = 0;
                                var pJsonPedidosDet = [];
                                
                                
											    	  	var grid = $("#pGridNuevoPedido").data("kendoGrid");
												        grid.dataSource.page(localStorage['pedidos_detalle_pag_act']);

                                var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
                                mr = mr - 7;
                                console.log("maximas filas en detalle pedido" + mr);

                                //TITULOS DE LA GRID 
                                var codi = localStorage.getItem('cod');
                                var des = localStorage.getItem('art');
                                var prov = localStorage.getItem('ref');
                                var cant = localStorage.getItem('can');
                                var cade = localStorage.getItem('cad');
                                var unid = localStorage.getItem('uni');

                                var cod = localStorage.getItem('cod');

                                var col = localStorage.getItem('columns');
                                var fil = localStorage.getItem('filtro');
                                var asc = localStorage.getItem('asc');
                                var desc = localStorage.getItem('desc');

                                var comienza = localStorage.getItem('comienza');
                                var igual = localStorage.getItem('igual');
                                var diferente = localStorage.getItem('diferente');

                                var filtit = localStorage.getItem('filtitulo');

                                var filtro = localStorage.getItem('fil');
                                var limp = localStorage.getItem('lim');


                                $("#pGridNuevoPedido").kendoGrid({
                                    dataSource: {
                                        schema: {
                                            model: {
                                                fields: {
                                                    cod_pedid: {
                                                        type: "string"
                                                    },
                                                    ref_prov: {
                                                        type: "string"
                                                    },
                                                    nom_pedid: {
                                                        type: "string"
                                                    },
                                                    uds: {
                                                        type: "string"
                                                    },
                                                    cad_log: {
                                                        type: "string"
                                                    },
                                                    totales: {
                                                        type: "string"
                                                    }
                                                }
                                            }
                                        },
                                        pageSize: mr
                                    },
                                    scrollable: false,
                                    sortable: false,
                                    filterable: true,
                                    pageable: true,
                                    columns: [{
                                        field: "cod_pedid",
                                        filterable: false,
                                        title: cod,
                                        width: '10%'
                                    }, {
                                        field: "ref_prov",
                                        filterable: false,
                                        title: des,
                                        width: '25%'
                                    }, {
                                        field: "nom_pedid",
                                        filterable: false,
                                        title: cant,
                                        width: '7%'
                                    }, {
                                        field: "uds",
                                        filterable: false,
                                        title: cade,
                                        width: '16%'
                                    }, {
                                        field: "cad_log",
                                        filterable: false,
                                        title: cade,
                                        width: '16%'
                                    }, {
                                        field: "totales",
                                        filterable: false,
                                        title: unid,
                                        width: '7%'
                                    }, {
                                        field: "Eliminar",
                                        headerTemplate: "<div style='position: relative; float: left'> <a onclick='inactivo()' data-role='button' role='button'> " + "<img id='sortPedidosVendors' src='./images/papelera.png'> ",
                                        template: "<input type='checkbox' class='checkbox' />",
                                        filterable: false,
                                        title: "Eliminar",
                                        width: '7%'
                                    }]
                                });

																
                                
                                $('.k-grid-pager').hide();

                                /* ------------------------------------------------------------------
																	Preparar entorno grafico
																*/
                                //activate_buttons_header(1 , "Detalle de pedidos", 1);
                                $("#tblDetallePedido_paginate").hide();
                                $("#tblDetallePedido_filter").css("display", " none");
                                displayDetalleNuevoPedido();
                                console.log("Detalle Pedidos INCIO pag_act=" + localStorage["pedidos_detalle_pag_act"] + "| max_row_per_pag=" + localStorage["pedidos_detalle_pag_max_row"] + " | LAST PAGE " + localStorage["pedidos_detalle_pag_last"]);

                            } else {

                                console.log("No hay datos para este pedido " + data);


                                var sqlItem1 = "SELECT d.*, i.*  FROM ordersDetail as d, items as i WHERE  d.idItem=i.idItem AND d.idOrder='" + data + "' ";

                                transaction.executeSql(sqlItem, undefined,
                                    function (transaction, result) {
                                        if (result.rows.length) console.log(" OPCION 1 = " + result.rows.length);
                                        else console.log(" OPCION x = 0 ");
                                    });
                            }

                        }, error);
                }

            }, error);
        console.log("Fin pMostrarDetallePedido");


    });
}

function pListaNuevoPedidoVacio(tipo) {


    var grid = $("#pGridNuevoPedido").data("kendoGrid");

    if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
        console.log("Destruida");
        $('#pGridNuevoPedido').data().kendoGrid.destroy();
        $('#pGridNuevoPedido').empty();
    }

    if (tipo=="escaner"){ // Pedido GLobal en base a escaner, no hay proveedor

       updateFiltroProveedor();
    }
    else
    {

    }

    localStorage["pedidos_detalle_pag_act"] = 1;
    localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"];
    localStorage["pedidos_detalle_pag_last"] = Math.ceil(1 / localStorage["pedidos_detalle_pag_max_row"]);
    $('#pLbCentroSeleccionado').text(" > "+localStorage.getItem('centro_seleccionado')+" > ");
    $('#pLbProveedorSeleccionado').text(localStorage.getItem('proveedor_seleccionado'));

    var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
    mr = mr - 1;
    console.log("maximas filas en detalle pedido" + mr);

    //TITULOS DE LA GRID 
    var codi = localStorage.getItem('cod');
    var des = localStorage.getItem('art');
    var prov = localStorage.getItem('ref');
    var cant = localStorage.getItem('can');
    var cade = localStorage.getItem('cad');
    var unid = localStorage.getItem('uni');

    var cod = localStorage.getItem('cod');

    var col = localStorage.getItem('columns');
    var fil = localStorage.getItem('filtro');
    var asc = localStorage.getItem('asc');
    var desc = localStorage.getItem('desc');

    var comienza = localStorage.getItem('comienza');
    var igual = localStorage.getItem('igual');
    var diferente = localStorage.getItem('diferente');

    var filtit = localStorage.getItem('filtitulo');

    var filtro = localStorage.getItem('fil');
    var limp = localStorage.getItem('lim');

    $("#pGridNuevoPedido").kendoGrid({

        dataSource: {
            pageSize: mr
        },
        scrollable: false,
        sortable: true,
        filterable: true,
        pageable: true,
        columns: [{
            field: "cod_articulo",
            filterable: false,
            title: cod,
            width: '7%'
        }, {
            field: "nom_articulo",
            filterable: false,
            title: des,
            width: '50%'
        }, {
            field: "cant_pedida",
            filterable: false,
            title: cant,
            width: '7%'
        }, {
            field: "cadena_logistica",
            filterable: false,
            title: cade,
            width: '16%'
        }, {
            field: "unidades_total",
            filterable: false,
            title: unid,
            width: '7%'
        }, {
            field: "Eliminar",
            headerTemplate: "<div style='position: relative; float: center'> <a onclick='inactivo()' data-role='button' role='button'> " + "<img id='sortPedidosVendors' src='./images/papelera.png'> ",
            template: "<input type='checkbox' class='checkbox' />",
            filterable: false,
            title: "Eliminar",
            width: '7%'
        }]
    });


    $('.k-grid-pager').hide();

    /* ------------------------------------------------------------------
				Preparar entorno grafico
			*/
    //activate_buttons_header(1 , "Detalle de pedidos", 1);
    $("#tblDetallePedido_paginate").hide();
    $("#tblDetallePedido_filter").css("display", " none");
    if(tipo=="escaner"){
        
        displayDetalleNuevoPedidoEscaner();
    }
    else
    {  
        displayDetalleNuevoPedido();
        console.log("Detalle Pedidos INCIO pag_act=" + localStorage["pedidos_detalle_pag_act"] + "| max_row_per_pag=" + localStorage["pedidos_detalle_pag_max_row"] + " | LAST PAGE " + localStorage["pedidos_detalle_pag_last"]);
        pCrearPedidoTemporal();
    }
}




function pMostrarCabeceraPedido() {
    var centro = localStorage["pNuevoPedidoIdCentro"];

    $("#ptxtCentroCabecera").val(localStorage.getItem('centro_seleccionado'));
    $("#ptxtProveedorCabecera").val(localStorage.getItem('proveedor_seleccionado'));
    var f =  getCurrentTime();
    if(localStorage['DATE_FORMAT']== 'DD/MM/YYYY'){ f = f.substring(6,10)+"-"+(f.substring(3,5))+"-"+f.substring(0,2)+" "+f.substring(11,13)+" "+f.substring(14,16); }
    $("#ptxtFechaEmisionCabecera").val(darFormatoSegunWS(f,true)); //Temporal, hay que cambiar por la actual
    $("#ptxtValoracionTotalCabecera").val("Not Available"); // Habra que hacer una query

    console.log("centro " + localStorage.getItem('centro_seleccionado'));

    // Query para extraer el estado del pedido
    db.transaction(function (transaction) { 
            var sql = "SELECT o.status as status,o.deliveryDate as fechaEntrega,o.observaciones FROM ordersPending as o WHERE o.idInternalOrder=" + localStorage["pNuevoPedidoIntenalId"] + "";
            console.log("SQL ==> " + sql);
            transaction.executeSql(sql, undefined,
                function (transaction, result) {
                    var rowDb1 = result.rows.item(0);
                    var estado = rowDb1.status;

                    db.transaction(function (transaction) { 
                    var sql = "SELECT s.name as name FROM status as s WHERE s.id=" + estado + "";
                    console.log("SQL ==> " + sql);
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {
                        	
                            if (result.rows.length > 0) {
                            	 var rowDb2 = result.rows.item(0);
							                 
                                $("#ptxtEstadoPedidoCabecera").val(rowDb2.name);
                                if(rowDb1.fechaEntrega!=null){
	                   	            $("#ptxtFechaEntregaCabecera").kendoDatePicker({
	                    								value: ""+rowDb1.fechaEntrega.substring(0,4)+""+"-"+""+rowDb1.fechaEntrega.substring(5,7)+""+"-"+""+rowDb1.fechaEntrega.substring(8,10)+"",
	                    								format:formatoFecha()
	               									});
	               								}
	               								console.log("----------------------------------------------------------------------------");
                                console.log(rowDb1.observaciones);
                                if(rowDb1.observaciones!="undefined" && localStorage['deDondeVenimos']!="plantillas"){
	               									$("#ptxtObservacionesCabecera").val(rowDb1.observaciones);
					               			  }else { $("#ptxtObservacionesCabecera").text(""); }
                            }
                            else {
                                $("#ptxtEstadoPedidoCabecera").val("Not Available");
                            }
                        }, error6);
                    });
                }, error6);
            });

    // Query para calcular la valoración Total
    db.transaction(function (transaction) { 
            var sql = "SELECT SUM(c.grossPrice * o.quantity * o.ordinalType) as total FROM ordersPendingDetail as o, catalog as c WHERE o.idInternalOrder=" + localStorage["pNuevoPedidoIntenalId"] + " AND o.idItem=c.idItem AND o.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + localStorage["pNuevoPedidoIdProveedor"] + " AND c.idPurchaseCenter="+ localStorage["pNuevoPedidoIdCentro"] ;
            console.log("SQL ==> " + sql);
            transaction.executeSql(sql, undefined,
                function (transaction, result) {
                    var rowDb1 = result.rows.item(0);
                    var valoracion = Math.round(rowDb1.total * 100) / 100;
                    console.log("Precio total " + valoracion);
                    
                    var formatPrecio = formatearMoneda(valoracion);
					      		/*if (localStorage['language']=="EN") { formatPrecio = "$"+formatPrecio;}
										else if (localStorage['language']=="ES") { formatPrecio = formatPrecio+"€";}*/
                    
                     $("#ptxtValoracionTotalCabecera").val(formatPrecio);
                }, error6);
            });

        // LISTA DE ZONAS
        db.transaction(function (transaction) {
            var sql = "SELECT distinct z.name as nom, z.idDeliveryZone as id FROM deliveryZones as z WHERE z.idPurchaseCenter=" + centro + " ORDER BY z.name DESC ";

            transaction.executeSql(sql, undefined,
                function (transaction, result) {
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
                        $('#ptxtZonaCabecera').kendoDropDownList({
                            dataSource: {
                                data: listaZonas
                            },
                            dataTextField: 'nombre_zona',
                            dataValueField: 'id_zona',
                        }).data("kendoDropDownList");
                    } else {
                        $('#ptxtZonaCabecera').kendoDropDownList({
                            dataSource: {
                                data: listaZonas
                            },
                            dataTextField: 'nombre_zona',
                            dataValueField: 'id_zona',
                            optionLabel: "Seleccionar",
                        }).data("kendoDropDownList");
                    }

                    displayCabeceraPedido();
                }, error6);
        });
        
        kendo.culture("es-ES");
        var fechaLimite = new Date();
        fechaLimite.setDate((fechaLimite.getDate()+1));
        console.log("Fecha minima "+fechaLimite.getDate()+1);
        // LISTA DE FECHAS DE ENTREGA
        $("#ptxtFechaEntregaCabecera").kendoDatePicker({
            value: localStorage["str_selecciona"],
            min: fechaLimite,
            format: formatoFecha()
        });
    }


function checkArticuloExistente(articulo) {
    db.transaction(function (transaction) { // hay que añadir IdPurchaseCenter
        var sql = "SELECT distinct o.idItem as id FROM ordersPendingDetail as o WHERE o.idItem=" + articulo.cod_articulo + " AND idInternalOrder="+localStorage["pNuevoPedidoIntenalId"]+"";
        console.log("SQL ==> " + sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length > 0) {
                    var rowDb = result.rows.item(0);
                    idArticulo = rowDb.id;
                    console.log("Articulo duplicado");
                    pMostrarDetalleArticulo(articulo,"modificar"); // lanzamos el popup de modificar articulo
                } else {
                    if (articulo) {
                        pMostrarDetalleArticulo(articulo);
                        console.log("Vamos a ver el del articulo " + articulo.cod_articulo);
                    } else {
                        console.log("No hay datos para este Articulo");
                        getDescripcionAviso("SinArticulos");
												$("#pedidosDialogAC").popup("open");
                    }
                }
            }, error6);
    });
}

function pResumenNuevoPedido() {

var tabla = "";
var condicion = "";

$('#pDivCheckPrecioDetallePedido').text("");
$('#pLbpedidosDetalleNuevoPrecio').text("");


db.transaction(function (transaction) {
    
    var total;
    var precio; 
    
    $('#pLbDetalleNuevoPedido').text("");
    
    if(localStorage['pantalla_anterior']=="pedidos_cabecera"){
    	
    //var sql = "SELECT DISTINCT d.idItem, i.name, c.vendorReference, d.quantity, c.logisticChainName , c.ordinalType,cat.grossPrice FROM ordersPendingDetail as d, catalog as cat LEFT OUTER JOIN items as i ON d.idItem=i.idItem  LEFT OUTER JOIN logisticChains as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor="+localStorage['pNuevoPedidoIdProveedor']+" WHERE  d.idInternalOrder='" + localStorage['pNuevoPedidoIntenalId'] + "' AND d.quantity!=0 AND  d.idItem=cat.idItem ORDER BY d.lineNumber ASC";
    var sql = "SELECT d.*, i.*, l.logisticChainName , d.ordinalType as numUds, c.vendorReference, d.idInternalOrder as idOrder, i.itemUnitName as nombreUnidades, c.grossPrice " + 
                        " FROM ordersPendingDetail as d, catalog as c "+
                        " LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " WHERE d.idInternalOrder='" + localStorage['pNuevoPedidoIntenalId'] + "' AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + " AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " AND d.quantity > 0 " ;
		}else{
			 var sql = "SELECT d.*, i.*, l.logisticChainName , d.ordinalType as numUds, c.vendorReference, d.idInternalOrder as idOrder, i.itemUnitName as nombreUnidades, c.grossPrice " + 
                        " FROM ordersPendingDetail as d, catalog as c "+
                        " LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " WHERE d.idInternalOrder='" + localStorage['pNuevoPedidoIntenalId'] + "' AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + " AND d.quantity>0 AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] ;
		
		}    
    console.log("CONSULTA RESUMEN PEDIDO " + sql);

    transaction.executeSql(sql, undefined,
        function (transaction, result) {

            var pJsonNuevoPedido = [];
						var rowDb;
						var des="";
						
            for (var i = 0; i < result.rows.length; i++) {
                rowDb = result.rows.item(i);

								total=(parseFloat(rowDb.ordinalType) * parseFloat(rowDb.quantity));

								precio = parseFloat(rowDb.quantity) * parseFloat(rowDb.grossPrice) * parseFloat(rowDb.ordinalType);
								precio = precio.toFixed(2);
								console.log("Precio: "+precio);
								
								var formatPrecio = formatearMoneda(precio);								
								
								if (rowDb.logisticChainName == undefined || rowDb.logisticChainName == "undefined" ) { des=rowDb.nombreUnidades; }
								else { des=rowDb.logisticChainName;  console.log("222222222");}
								
								var ref=rowDb.vendorReference;
								if (rowDb.vendorReference == undefined || rowDb.vendorReference == null || rowDb.vendorReference == "undefined" || rowDb.vendorReference == NaN ) { ref=""}
								console.log("Totales: "+total);
								
								/*
								var tot = isNaN(total);
								console.log("total: "+total );
								if(tot == true){total="";}
								*/
								if (typeof total === 'number' && total.toString().indexOf(".") > 0 ) {
                                    	
                	total=total.toString().substring(0,total.toString().indexOf(".")+3);
                	total=formatearMoneda(total);
                } 
								
                pJsonNuevoPedido.push({

                    cod_pedid: rowDb.idItem,
                    ref_prov: ref,
                    nom_pedid: rowDb.name,
                    uds: rowDb.quantity,
                    cad_log: des,
                    totales: total,
                    precios: formatPrecio

                });
            }

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["pedidos_detalle_pag_max_row_max"];
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(pJsonNuevoPedido.length / localStorage["pedidos_detalle_pag_max_row"]);

            var grid = $("#pGridNuevoPedido").data("kendoGrid");

            if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                console.log("Destruida");
                $('#pGridNuevoPedido').data().kendoGrid.destroy();
                $('#pGridNuevoPedido').empty();
            }

            var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
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
                selectable: false,  
                columns: [{
                    field: "cod_pedid",
                    headerTemplate: "<div style='position: relative; float: left'>"+
			                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"cod_pedid\",\"ordenacionNuevoPed1\")' data-role='button' role='button'> " 
                                 + codi + " <img id='ordenacionNuevoPed1' src='./images/sort_both.png' > </a> ", 
                    filterable: false,
                    template: "<div class='ra'>#= cod_pedid #</div>",
                    title: codi,
                    width: '7%'
                },{
                    field: "nom_pedid",
                    headerTemplate: "<div style='position: relative; float: left'>"+
			                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"nom_pedid\",\"ordenacionNuevoPed3\")' data-role='button' role='button'> " 
                                 + nomart + " <img id='ordenacionNuevoPed3' src='./images/sort_both.png' > </a> ",
                    filterable: false,
                    title: nomart,
                    width: '41%'
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
			                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridNuevoPedido\",\"precios\",\"ordenacionNuevoPed7\")' data-role='button' role='button'> "
			                 + localStorage["str_precios"] + " <img id='ordenacionNuevoPed7' src='./images/sort_both.png' > </a> ",
                    filterable: false,
                    template: "<div class='ra'>#= precios #</div>",
                    title: "Precios",
                    width: '10%'
                }]
            });
           
            $('.k-grid-pager').hide();
           /* 
            if (localStorage["pantalla"] == "pedidos_plantillas_detalle" || localStorage["pantalla"] == "pedidos_plantillas_detalle") {
                displayModificarPlantilla();
            } else if (localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "emitidos") {
                console.log("YYYYYY");
                displayDetalleNuevoPedido();
            }
            else if(localStorage["pantalla"] == "pedidos_cabecera")*/
                displayResumenNuevoPedido();

        }, error);

    console.log("Nuevo-PEDIDO:  Query Finalizada");
});

}

function cargarPopupModificarArticulo(){
	db.transaction(function (transaction) {

	var sql = "SELECT * FROM ordersPendingDetail as o WHERE idItem=" + localStorage["pNuevoPedidoIdItem"] + "";
	transaction.executeSql(sql, undefined,
		function (transaction, res) {
			 var Articulo = new Object();
			 Articulo.cod_pedid = localStorage["pNuevoPedidoIdItem"];
			 Articulo.nom_pedid = $("#InCodigoEan").val();
			 Articulo.uds = res.rows.item(0).quantity;
			 Articulo.totales = (parseInt(Articulo.uds) * parseInt(res.rows.item(0).ordinalType));
			 console.log("EXISTE con cantidad " + Articulo.uds);
			 //setTimeout('$("#pedidosDialogAC").popup("open");',500);
			 pMostrarDetalleArticulo(Articulo,"modificarArticulo");

		});
	});
}