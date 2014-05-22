////PLANTILLAS////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// Opción de nuevo pedido
// Muestra las plantillas de un proveedor
function pMostrarPlantillasFiltradas() {
    var provider = localStorage["pNuevoPedidoIdProveedor"];
    var center = localStorage["pNuevoPedidoIdCentro"];

    db.transaction(function (transaction) {

        var sql = "SELECT o.*, p.name as centro, v.name as proveedor, d.name as zona, s.icon FROM ordersTemplates as o, vendors as v , purchaseCenters as p, deliveryZones as d, status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND d.idDeliveryZone=o.idDeliveryZone AND o.status=s.id AND o.idVendor=" + provider + " AND o.idPurchaseCenter=" + center + " ";

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                var pJsonPedidos = [];

                n_reg = 0;
                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);

                    pJsonPedidos.push({
                        zona: rowDb.zona,
                        cod_pedid: rowDb.reference,
                        cod_centr: rowDb.centro,
                        cod_proveedo: rowDb.proveedor,
                        fecha_doc: formatearFechaHoraKendo(rowDb.documentDate),
                        estado: rowDb.icon,
                        nombre: rowDb.name
                    });
                    n_reg++;

                }

                /*idTemplate:rowDb.idTemplate,
                idTemplateVendor:rowDb.idVendor,
                idTemplateCenter:rowDb.idPurchaseCenter,*/

                var grid = $("#pGridPedidosPlantillas").data("kendoGrid");

                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                    grid.destroy();
                }

                var mr = parseInt(localStorage.getItem("max_row_per_pag") - 2);
                localStorage["pedidos_pag_act"] = 1;
                localStorage["pedidos_pag_max_row"] = mr;
                localStorage["pedidos_pag_last"] = Math.ceil(n_reg / parseInt(mr));

                console.log("Numero max por pag:" + localStorage.getItem("max_row_per_pag"));

                //TRADUCCIONES GRID 
                var nume = localStorage.getItem('num');
                var infor = localStorage.getItem('info');
                var prove = localStorage.getItem('pro');
                var emit = localStorage.getItem('creacion');
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
                var nombre = "Nombre";

                $("#pGridPedidosPlantillas").kendoGrid({
                    dataSource: {
                        data: pJsonPedidos,
                        schema: {
                            model: {
                                fields: {
                                    zona: {
                                        type: "string"
                                    },
                                    cod_centr: {
                                        type: "string"
                                    },
                                    cod_proveedo: {
                                        type: "string"
                                    },
                                    nombre: {
                                        type: "string"
                                    },
                                    fecha_doc: {
                                        type: "date"
                                    },
                                    estado: {
                                        type: "string"
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
                        field: "cod_centr",
                        filterable: false,
                        title: infor,
                        width: '25%'
              }, {
                        field: "zona",
                        title: "Zona",
                        filterable: false,
                        /*headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"zona\",\"strings\",\"zona\")' data-role='button' role='button'> " +
                            				 "Zona" + "</a>" +
                                     "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"cod_proveedo\",\"strings\",\"zona\")' data-role='button' role='button'>" +
                                     "<img id='cod_proveedoPlan5' src='./images/icno_ordenable_filtrable.png' > </a> </div>",*/
                        width: '15%'
              }, {
                        field: "cod_proveedo",
                        filterable: false,
                        title: prove,
                        width: '32%'
              }, {
                        field: "nombre",
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionGridPedidosPlan(\"nombre\",\"string\",\"sortPedidosPlant1\")' data-role='button' role='button'> " + localStorage["str_nombre"] + "<img id='sortPedidosPlant1' src='./images/sort_both.png' > </a></div>",
                        filterable: false,
                        title: nombre,
                        width: '26%'
              }, {
                        field: "fecha_doc",
                        headerTemplate: "<div style='position: relative; float: left'> <a onclick='pOrdenacionGridPedidosPlan(\"fecha_doc\",\"date\",\"sortPedidosPlant2\",\"dd-MM-yyyy  HH:mm\")' data-role='button' role='button'> " + emit + "<img id='sortPedidosPlant2' src='./images/sort_both.png' > </a></div>",
                        title: emit,
                        format: "{0:dd-MM-yyyy HH:mm}",
                        filterable: false,
                        width: '18%'
              }, {
                        field: "estado",
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a  data-role='button' role='button'> " + "Estado" + " <img id='sortPedidosPlan6' src='./images/sort_both.png' > </a></div>",

                        template: "#=getIconoStatus(estado)#",
                        width: '8%'
              }]
                });

                $('.k-grid-pager').hide();
                displayPlantillasNuevoPedido();
            }, error);

    });

}

////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes tabla plantillas
function pOrdenacionGridPedidosPlan(NombreColumna, tipo, imagen, formato) {

    var aux = localStorage.getItem('sortgrid');
    var grid = $("#pGridPedidosAnteriores").data("kendoGrid");
    console.log("ORDENADO LA COMUNA " + NombreColumna + " " + tipo + " " + imagen + " " + formato);
    switch (aux) {
    case "0":
        grid.dataSource.sort({
            field: NombreColumna,
            format: formato,
            type: tipo,
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#' + imagen).attr("src", "./images/sort_desc.png");
        break;
    case "1":
        grid.dataSource.sort({
            field: NombreColumna,
            format: formato,
            type: tipo,
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#' + imagen).attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidosAnteriores").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#' + imagen).attr("src", "./images/sort_both.png");
        break;
    }
}


////////////////////////////////////////////////////////////////////////////////////////////
// Muestra el detalle de una plantilla
/*
data= referencia
*/
function pMostrarDetallePlantilla(data, show, estado) {



    db.transaction(function (transaction) {

        localStorage['pDetallePlantilla'] = data;

        var sql = "SELECT idInternalOrder as idTemplate, o.idVendor, o.idPurchaseCenter, o.reference, o.documentDate, p.name as centro,  v.name as proveedor, s.icon, documentDate, o.observaciones as name, p.name as centro, o.status as estado,  1 as tieneError, 1 as tmp FROM ordersPending as o, vendors as v , purchaseCenters as p,  status as s, relPurchaseCenter_Vendors as r   WHERE r.idVendor=o.idVendor AND o.idPurchaseCenter=r.idPurchaseCenter AND o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.reference='" + data + "' " +
            " UNION ALL " +
            " SELECT idTemplate, o.idVendor, o.idPurchaseCenter, o.reference, o.documentDate, p.name as centro,  v.name as proveedor, s.icon, documentDate, o.name as name, p.name as centro, o.status as estado,  1 as tieneError, 0 as temp FROM ordersTemplates as o, vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.reference='" + data + "' ";

        console.log("DETALLE PLANTILLA" + sql);

        var grid = $("#pGridNuevoPedidoPlantilla").data("kendoGrid");

        if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
            grid.destroy();
            //$("#pGridPedidosAnteriores").remove();
            console.log("Destruidaaaaaaaaaaaaaaaaaaaaaaa");
        }

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length) {

                    var preu;

                    for (var i = 0; i < result.rows.length; i++) {
                        var rowDb = result.rows.item(i);

                        $("#pTxtNuevoPedidoPlantillaRef").val(rowDb.reference);
                        localStorage['pNuevoPedidoPlantillaRef'] = rowDb.reference;
                        $("#pTxtNuevoPedidoPlantillaProveedor").val(rowDb.proveedor);
                        $("#pTxtNuevoPedidoPlantillaCentro").val(rowDb.centro);
                        $("#pTxtNuevoPedidoPlantillaZona").val(rowDb.idDeliveryZone);
                        $("#pTxtNuevoPedidoPlantillaFecha").val(darFormatoSegunWS(rowDb.documentDate, true));
                        $("#pTxtNuevoPedidoPlantillaTexto").val(rowDb.name);

                    }

                    if (rowDb.tmp == "1") {
                        //Listado de articulos
                        var sqlItem = " SELECT d.*, i.*, l.logisticChainName, d.ordinalType , i.itemUnitName, 0 as itemStatus, 0 as logisticsChainStatus " + " FROM ordersPendingDetail as d , items as i  " + " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + rowDb.idVendor + " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter + " WHERE d.idItem=i.idItem AND d.idInternalOrder='" + rowDb.idTemplate + "' ";
                    } else {

                        //Listado de articulos
                        var sqlItem = " SELECT * " + " FROM ordersTemplatesDetail as d   " + " WHERE d.idTemplate='" + rowDb.idTemplate + "' ";
                    }

                    console.log("DETALLE PLANTILLA !!!!!! " + sqlItem);

                    transaction.executeSql(sqlItem, undefined,
                        function (transaction, result) {
                            if (result.rows.length) {

                                localStorage["pTemplateDetailIdItem"] = result.rows.item(0).idItem;
                                localStorage["pTemplateDetailQuantity"] = result.rows.item(0).quantity;
                                localStorage["pTemplateDetailIdLogisticsChain"] = result.rows.item(0).idLogisticsChain;

                                var n_reg = 0;
                                var pJsonPedidosDet = [];
                                var cadena = "";
                                var total = 0;

                                for (var i = 0; i < result.rows.length; i++) {
                                    var rowDb = result.rows.item(i);



                                    total = parseFloat(rowDb.quantity) * parseFloat(parseNumberLogisticChain(rowDb.ordinalType));
                                    //total = parseFloat(rowDb.quantity) * parseFloat(rowDb.numUds) ;	

                                    pJsonPedidosDet.push({

                                        cod_articulo: rowDb.idItem,
                                        nom_articulo: rowDb.itemName,
                                        cant_pedida: rowDb.quantity,
                                        cadena_logistica: rowDb.logisticsChainName,
                                        unidades_total: total,
                                        item_error: rowDb.itemStatus,
                                        cadena_error: rowDb.logisticsChainStatus

                                    });
                                    n_reg = n_reg + 1;
                                }

                                var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);

                                //TITULOS DE LA GRID 
                                var cod = localStorage.getItem('cod');
                                var des = localStorage.getItem('art');
                                var prov = localStorage.getItem('ref');
                                var cant = localStorage.getItem('can');
                                var cade = localStorage.getItem('cad');
                                var unid = localStorage.getItem('uni');

                                var col = localStorage.getItem('columns');
                                var fil = localStorage.getItem('filtro');
                                var asc = localStorage.getItem('asc');
                                var desc = localStorage.getItem('desc');
                                var filtit = localStorage.getItem('filtitulo');

                                var filtro = localStorage.getItem('fil');
                                var limp = localStorage.getItem('lim');

                                $("#pGridNuevoPedidoPlantilla").kendoGrid({

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

                                    rowTemplate: '<tr class="#:item_error==1? \"colorRowGridErrorItem\" : cadena_error==1? \"colorRowGridErrorLog\" : \"white\"#"><td class="ra">#=cod_articulo# </td><td>#=nom_articulo#</td>' +
                                        '<td class="ra">#=cant_pedida#</td> <td>#=cadena_logistica#</td> <td class="ra">#=unidades_total#</td> </tr>',
                                    scrollable: false,
                                    sortable: false,
                                    filterable: true,
                                    resizable: true,
                                    selectable: false,
                                    pageable: true,
                                    columns: [{
                                            field: "cod_articulo",
                                            headerTemplate: "<div style='position: relative; float: left'>" +
                                                "<a onclick='sortPlanDet(\"pGridNuevoPedidoPlantilla\",\"cod_articulo\",\"string\",\"sortNuevoPedidosPlan1\")' data-role='button' role='button'> " + cod + " <img id='sortNuevoPedidosPlan1' src='./images/sort_both.png' > </a> ",
                                            title: cod,
                                            template: "<div class='ra'>#= cod_articulo #</div>",
                                            filterable: false,
                                            width: '7%'
                 }, {
                                            field: "nom_articulo",
                                            headerTemplate: "<div style='position: relative; float: left'>" +
                                                "<a onclick='sortPlanDet(\"pGridNuevoPedidoPlantilla\",\"nom_articulo\",\"string\",\"sortNuevoPedidosPlan2\")' data-role='button' role='button'> " + des + " <img id='sortNuevoPedidosPlan2' src='./images/sort_both.png' > </a> ",
                                            title: des,
                                            filterable: false,
                                            width: '50%'
                 },
                                        {
                                            field: "cant_pedida",
                                            headerTemplate: "<div style='position: relative; float: left'>" +
                                                "<a onclick='sortPlanDet(\"pGridNuevoPedidoPlantilla\",\"cant_pedida\",\"string\",\"sortNuevoPedidosPlan3\")' data-role='button' role='button'> " + cant + " <img id='sortNuevoPedidosPlan3' src='./images/sort_both.png' > </a> ",
                                            title: cant,
                                            template: "<div class='ra'>#= cant_pedida #</div>",
                                            filterable: false,
                                            width: '7%'
                 }, {
                                            field: "cadena_logistica",
                                            headerTemplate: "<div style='position: relative; float: left'>" +
                                                "<a onclick='sortPlanDet(\"pGridNuevoPedidoPlantilla\",\"nom_articulo\",\"string\",\"sortNuevoPedidosPlan4\")' data-role='button' role='button'> " + cade + " <img id='sortNuevoPedidosPlan4' src='./images/sort_both.png' > </a> ",
                                            title: cade,
                                            filterable: false,
                                            width: '16%'
                 }, {
                                            field: "unidades_total",
                                            headerTemplate: "<div style='position: relative; float: left'>" +
                                                "<a onclick='sortPlanDet(\"pGridNuevoPedidoPlantilla\",\"unidades_total\",\"string\",\"sortNuevoPedidosPlan5\")' data-role='button' role='button'> " + unid + " <img id='sortNuevoPedidosPlan5' src='./images/sort_both.png' > </a> ",
                                            title: unid,
                                            template: "<div class='ra'>#= unidades_total #</div>",
                                            filterable: false,
                                            width: '7%'
                 }]
                                });

                                $('.k-grid-pager').hide();

                                //if (localStorage["pantalla"]=="pedidos_plantillas") { displayPlantillasDetalle();	} 
                                //else { displayPedidoPlantillasDetalle(); }


                                localStorage["pedidos_detalle_pag_act"] = 1;

                                if (show == true) {
                                    localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["max_row_per_pag"] - 3);
                                } else {
                                    localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["max_row_per_pag"] - 1);
                                }

                                localStorage["pedidos_detalle_pag_last"] = Math.ceil(parseInt(n_reg) / parseInt(localStorage["pedidos_detalle_pag_max_row"]));

                                displayPedidoPlantillasDetalle(estado);

                            } else {
                                console.log("No hay Artículos Para este Pedido " + data);
                                getDescripcionAviso("SinArticulos");
                                $("#pedidosDialogAC").popup("open");
                            }
                            //);

                        }, error);


                } else {

                    console.log("No falta algun dato");
                }

            }, error);


    });


}

function sortPlanDet(Grid, nombreColumn, tipoColumna, nombreImg) {

    var aux = localStorage.getItem('sortgrid');
    if (localStorage["columnaOrdena"] != nombreColumn) localStorage["columnaOrdena"] = "1";

    switch (aux) {
    case "0":
        var tipoOrdenacion = "desc";
        var grid = $("#" + Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumn,
            type: tipoColumna,
            dir: tipoOrdenacion
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#' + nombreImg).attr("src", "./images/sort_desc.png");
        localStorage["columnaOrdena"] = nombreColumn;
        break;
    case "1":
        var tipoOrdenacion = "asc";
        var grid = $("#" + Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumn,
            type: tipoColumna,
            dir: tipoOrdenacion
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#' + nombreImg).attr("src", "./images/sort_asc.png");
        localStorage["columnaOrdena"] = nombreColumn;
        break;
    case "2":
        $("#" + Grid).data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#' + nombreImg).attr("src", "./images/sort_both.png");
        localStorage["columnaOrdena"] = nombreColumn;
        break;
    }

}



/////////////////////////////////////////////////////////////////////////////////
// Opción de Mostrar Plantillas
// Muestra todas las plantillas de todos los proveedores
function pMostrarTodasPlantillas() {
    //console.log("ALTA-PEDIDO:  BD listando Plantillas, Proveedor: " + provider + "Centro: "+center);
    pBorrarParametrosLocales();

    db.transaction(function (transaction) {

        var filtroExtra = "";

        if (localStorage['dispositivo'] == "MOVIL") {
            filtroExtra = " AND (r.vendorCommunicationType != 'Manual')";
        }

        //filtroExtra=" AND (r.vendorCommunicationType != 'Manual')";

        var sql = " SELECT idInternalOrder as idTemplate, o.reference, o.idVendor, o.idPurchaseCenter, d.name as zona, o.documentDate, p.name as centro,  v.name as proveedor, s.icon, p.shortName, o.status as estado, observaciones as name, 1 as tieneError FROM ordersPending as o, vendors as v , purchaseCenters as p,  status as s, relPurchaseCenter_Vendors as r, deliveryZones as d WHERE r.idVendor=o.idVendor AND d.idDeliveryZone=o.idDeliveryZone AND o.idPurchaseCenter=d.idPurchaseCenter AND o.idPurchaseCenter=r.idPurchaseCenter " + filtroExtra + " AND o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.tipoInterno=" + TIPO_TEMPORAL_TEMPLATE + "  AND o.username='" + localStorage['usuario'] + "' AND o.unfinished=0 " +
            " UNION ALL " +
            "	SELECT idTemplate, o.reference, o.idVendor, o.idPurchaseCenter, d.name as zona, o.documentDate, p.name as centro,  v.name as proveedor, s.icon, p.shortName, o.status as estado, o.name as name,0 as tieneError FROM ordersTemplates as o, vendors as v , purchaseCenters as p,  status as s , relPurchaseCenter_Vendors as r, deliveryZones as d WHERE r.idVendor=o.idVendor AND d.idDeliveryZone=o.idDeliveryZone AND o.idPurchaseCenter=d.idPurchaseCenter AND o.idPurchaseCenter=r.idPurchaseCenter " + filtroExtra + " AND o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id";

        console.log("CONSULTA MOSTRAR PLANTILLAS " + sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                var pJsonPedidos = [];
                n_reg = 0;

                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);

                    pJsonPedidos.push({
                        zona: rowDb.zona,
                        cod_pedid: rowDb.reference,
                        cod_centr: rowDb.centro,
                        cod_proveedo: rowDb.proveedor,
                        nombre: rowDb.name,
                        idTemplate: rowDb.idTemplate,
                        idTemplateVendor: rowDb.idVendor,
                        idTemplateCenter: rowDb.idPurchaseCenter,
                        fecha: formatearFechaHoraKendo(rowDb.documentDate),
                        estado: rowDb.icon,
                        mensaje: rowDb.tieneError
                    });

                    n_reg++;

                }

                var grid = $("#pGridPlantillas").data("kendoGrid");

                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                    grid.destroy();
                }

                localStorage["pedidos_pag_act"] = 1;
                localStorage["pedidos_pag_max_row"] = localStorage.getItem("max_row_per_pag");
                var mr = parseInt(localStorage["pedidos_pag_max_row"]);

                localStorage["pedidos_pag_last"] = Math.ceil(n_reg / parseInt(localStorage["pedidos_pag_max_row"]));

                console.log("Numero max por pag TODAS PLANTILLAS : filas xpagina" + localStorage.getItem("max_row_per_pag") + " " + localStorage["pedidos_pag_act"] + " / " + localStorage["pedidos_pag_last"] + " = " + mr);

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
                var nombre = localStorage.getItem('nomPlan');

                $("#pGridPlantillas").kendoGrid({
                    dataSource: {
                        data: pJsonPedidos,
                        schema: {
                            model: {
                                fields: {
                                    zona: {
                                        type: "string"
                                    },
                                    cod_centr: {
                                        type: "string"
                                    },
                                    cod_proveedo: {
                                        type: "string"
                                    },
                                    fecha: {
                                        type: "date"
                                    },
                                    nombre: {
                                        type: "string"
                                    },
                                    estado: {
                                        type: "string"
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
                        field: "cod_centr",
                        title: infor,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"cod_centr\",\"strings\",\"" + infor + "\")' data-role='button' role='button'> " +
                            infor + "</a>" +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"cod_centr\",\"strings\",\"" + infor + "\")' data-role='button' role='button'>" +
                            "<img id='cod_centrPlan' src='./images/icno_ordenable_filtrable.png' > </a> </div>",
                        width: '22%'
              }, {
                        field: "zona",
                        title: "Zona",
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"zona\",\"strings\",\"zona\")' data-role='button' role='button'> " +
                            "Zona" + "</a>" +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"cod_proveedo\",\"strings\",\"zona\")' data-role='button' role='button'>" +
                            "<img id='cod_proveedoPlan5' src='./images/icno_ordenable_filtrable.png' > </a> </div>",
                        width: '13%'
              }, {
                        field: "cod_proveedo",
                        title: prove,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"cod_proveedo\",\"strings\",\"" + prove + "\")' data-role='button' role='button'> " +
                            prove + "</a>" +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumnaPlan(\"pGridPlantillas\",\"cod_proveedo\",\"strings\",\"" + prove + "\")' data-role='button' role='button'>" +
                            "<img id='cod_proveedoPlan' src='./images/icno_ordenable_filtrable.png' > </a> </div>",
                        width: '25%'
              }, {
                        field: "fecha",
                        filterable: false,
                        title: "Fecha",
                        format: formatoFecha(true),
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortPlanFecha()' data-role='button' role='button'> " + "Fecha" + "<img id='sortPedidosPlan3' src='./images/sort_both.png'></a></div>",
                        width: '15%'
              }, {
                        field: "nombre",
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortPlanNombre()' data-role='button' role='button'> " + "Nombre" + " <img id='sortPedidosPlan4' src='./images/sort_both.png' > </a></div>",
                        width: '17%'
              }, {
                        field: "estado",
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a  data-role='button' role='button'> " + "Estado" + " <img id='sortPedidosPlan6' src='./images/sort_both.png' > </a></div>",

                        template: "#=getIconoStatus(estado)#",
                        width: '8%'
              }]
                });

                $('.k-grid-pager').hide();

                var grid = $("#pGridPlantillas").data("kendoGrid").dataSource;


                localStorage["columnaOrdena"] = "";
                localStorage['sortgrid'] = "0";
                sortPlanFecha();

                displayPedidoPlantillas();

            }, error);

    });

}

/*function pComprobarColumnaFiltrada(nombreColumna){
	
	  var aux = [];
	  var col = false;
	  if(localStorage["columnaFiltrada"]!=""){
	    aux = JSON.parse(localStorage["columnaFiltrada"]);
	    
	    for(var i=0;i<aux.length;i++){
	    	
	    	if(aux[i].columna==nombreColumna) col=true;
	    	
	      console.log("Buscando coincidencias "+aux[i].columna+" "+nombreColumna+" "+col);
	    	
	    }
		}
		return col;
	
	}*/

function pPopUpFiltroColumnaPlan(Grid, nomColum, tipo, tituloColumna) {

    console.log("Estamos en la columna: " + nomColum + " tipo: " + tipo);

    var comp = pComprobarColumnaFiltrada(nomColum);

    console.log("Comparaciones es = " + comp);

    switch (tipo) {

    case "strings":

        var tituloCol = document.getElementById("tituloPopUpFiltro");
        tituloCol.innerHTML = localStorage["str_opciones_de_columna"] + tituloColumna;

        if (localStorage["columnaOrdena"] != nomColum) {
            pMostrarIconoOrdenarPlan(Grid, nomColum, "0", "", "");
        }

        if (nomColum == "cod_proveedo" || nomColum == "cod_centr") {
            var dataSource = $("#" + Grid).data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var dataa = query.filter(filters).data;

            $("#pListaFiltroFechas").hide();
            $("#pListaFiltroStrings").show();
            $("#pListaFiltroEstados").hide();


            var contenedorPrincipal = document.getElementById("pListaFiltro");
            $("#pListaFiltroStrings").empty();
            var divp = document.createElement('div');
            divp.id = 'pListaFiltroStrings';
            contenedorPrincipal.appendChild(divp);

            var contenedorFiltro = document.getElementById("pListaFiltroStrings");
            var ul = document.createElement("ul");
            ul.setAttribute("id", "pListaFiltros");
            ul.setAttribute("data-role", "listview");
            ul.setAttribute("data-theme", "a");
            ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all ");


            var datFiltrados = ordenarDatosLista(dataa, nomColum);


            if (localStorage["columnaFiltrada"] != "") {
                var aux = JSON.parse(localStorage["columnaFiltrada"]);
                console.log(aux);
            }

            for (var i = 0; i < datFiltrados.length; i++) {

                var nombre = datFiltrados[i];
                var li = document.createElement("li");
                ul.appendChild(li);

                var a = document.createElement("a");
                a.setAttribute("href", "#");

                if (filters != null && pComprobarColumnaFiltrada(nomColum)) {
                    a.setAttribute("onClick", "pLimpiarFiltroPlan('" + Grid + "','" + nomColum + "')");
                } else {
                    a.setAttribute("onClick", "pFiltroPersoPlan('" + Grid + "' , '" + nomColum + "',null,'" + nombre + "')");
                }

                a.setAttribute("value", "filtrar" + nomColum);
                a.innerHTML = nombre;
                li.appendChild(a);

            }

            contenedorFiltro.appendChild(ul);

            $("#pListaFiltroStrings").trigger("create");

            var alt = $(window).height();
            var altura = (alt) - 125;

            console.log("Altura: " + altura + " altura pantalla: " + $(window).height);

            $('#pFiltroPopUp').css("height", altura + "px");

            $("#pFiltroPopUp").popup("open");

        } else {

            $("#pListaFiltroFechas").hide();
            $("#pListaFiltroStrings").hide();
            $("#pListaFiltroEstados").hide();

            var alt = $(window).height();
            var altura = (alt) - 125;

            console.log("Altura: " + altura + " altura pantalla: " + $(window).height);

            $('#pFiltroPopUp').css("height", altura + "px");

        }
        break;

    case "date":

        pMostrarIconoOrdenarPlan(Grid, nomColum, localStorage["tipoOrden"], "", "");

        if (localStorage["columnaOrdena"] != nomColum) {

            pMostrarIconoOrdenarPlan(Grid, nomColum, "0", "", "");
            $(".k-datepicker input").val('');
            console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAA2");

        }

        pMostrarIconoOrdenarPlan(Grid, nomColum, localStorage["tipoOrden"], "", "");

        var tituloCol = document.getElementById("tituloPopUpFiltro");
        tituloCol.innerHTML = localStorage["str_opciones_de_columna"] + tituloColumna;

        localStorage['fila'] = nomColum;
        $("#pListaFiltroFechas").show();
        $("#pListaFiltroStrings").hide();
        $("#pListaFiltroEstados").hide();

        $("#pListaFiltroFechasInicio").kendoDatePicker({
            format: "dd-MM-yyyy"
        }).data("kendoDatePicker");

        $("#pListaFiltroFechasFin").kendoDatePicker({
            format: "dd-MM-yyyy"
        }).data("kendoDatePicker");

        $("#pFiltroPopUp").popup("open");

        break;

    }
}

function pLimpiarFiltroPlan(Grid, nomColum, operator) {
    //Eliminar unicamente el filtro que nos pasant

    console.log("pLimpiarFiltroPlan => " + Grid + " " + nomColum);

    var datasource = $("#" + Grid).data("kendoGrid").dataSource;
    var filtro = datasource.filter();

    datasource.filter([]);
    for (var i = 0; i < filtro.filters.length; i++) {

        if (filtro.filters[i].field == nomColum) {
            if (filtro.filters[i].operator == operator) {
                filtro.filters.splice(i, 1);
                datasource.filter(filtro);
            } else if (filtro.filters[i].operator != operator) {
                filtro.filters.splice(i, 1);
                datasource.filter(filtro);
            }
        }
    }

    //limpiamos el filtro
    $("#pFiltroPopUp").popup("close");

    //Para la paginación
    var dataSource = $("#" + Grid).data("kendoGrid").dataSource;
    var allData = dataSource.data();

    localStorage["pedidos_pag_act"] = 1;
    var maxRowPag = localStorage.getItem("max_row_per_pag");
    localStorage["pedidos_pag_last"] = Math.ceil(allData.length / maxRowPag);

    displayPedidoPlantillas();
    localStorage['pValorFiltroGrid'] = "0";

    var aux = [];

    aux = JSON.parse(localStorage["columnaFiltrada"]);
    var longitud = aux.length;
    console.log("LONGITUD " + aux.length);

    var x = "";

    for (var j = 0; j < longitud; j++) {
        if (aux[j].columna == nomColum) {
            x = aux[j].columna;
            console.log(aux);
            pPintarIconoCabeceraGridPlan(Grid, x, localStorage["tipoOrden"], 1);
            aux.splice(j, 1);
            localStorage["columnaFiltrada"] = JSON.stringify(aux);
        }
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////
//Inicializa los botones de ordenacion
function pMostrarIconoOrdenarPlan(Grid, nomColum, tipoOrden, tipoColumna, formatColumna) {

    console.log("pMostrarIconoOrdenar => " + Grid + " " + nomColum + " " + tipoOrden + " " + tipoColumna + " " + formatColumna);

    var btnAsc = document.getElementById("pBtnPopUpAsc");
    var btnDesc = document.getElementById("pBtnPopUpDesc");
    var imgDesc = document.getElementById("pImgDesc");
    var imgAsc = document.getElementById("pImgAsc");

    //var tipoOrden = localStorage["tipoOrden"];

    if (tipoOrden == "asc") {

        imgAsc.setAttribute("src", './images/icno_chec.png');
        imgDesc.setAttribute("src", './images/blancoOrdenacion.png');
        btnAsc.setAttribute("onClick", "pOrdenacionColumnaPlan('" + Grid + "','" + nomColum + "' , '0' , '" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value", "asc" + nomColum);
        btnDesc.setAttribute("onClick", "pOrdenacionColumnaPlan('" + Grid + "','" + nomColum + "', 'desc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value", "0");
        console.log("Ordenado de manera asc y el value es = " + btnAsc.getAttribute("value"));
        localStorage["tipoOrden"] = "asc";
        pPintarIconoCabeceraGrid(Grid, nomColum, tipoOrden);

    } else if (tipoOrden == "desc") {

        imgDesc.setAttribute("src", './images/icno_chec.png');
        imgAsc.setAttribute("src", './images/blancoOrdenacion.png');
        btnDesc.setAttribute("onClick", "pOrdenacionColumnaPlan('" + Grid + "','" + nomColum + "', '0' , '" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value", "desc" + nomColum);
        btnAsc.setAttribute("onClick", "pOrdenacionColumnaPlan('" + Grid + "','" + nomColum + "', 'asc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value", "0");
        console.log("Ordenado de manera desc y el value es = " + btnDesc.getAttribute("value"));
        localStorage["tipoOrden"] = "desc";
        pPintarIconoCabeceraGrid(Grid, nomColum, tipoOrden);

    } else if ((tipoOrden == "0")) {

        imgAsc.setAttribute("src", './images/blancoOrdenacion.png');
        imgDesc.setAttribute("src", './images/blancoOrdenacion.png');
        btnAsc.setAttribute("onClick", "pOrdenacionColumnaPlan('" + Grid + "','" + nomColum + "', 'asc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value", "0");
        btnDesc.setAttribute("onClick", "pOrdenacionColumnaPlan('" + Grid + "','" + nomColum + "', 'desc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value", "0");
        localStorage["tipoOrden"] = "0";
        pPintarIconoCabeceraGrid(Grid, nomColum, tipoOrden);
        console.log("Desordenadoooooooooooooooooooo");
    }

}

function pPintarIconoCabeceraGridPlan(nombreGrid, nombreColumna, ordenacion, limpiado) {

    console.log("pPintarIconoCabeceraGrid => " + nombreGrid + " " + nombreColumna + " " + ordenacion + " " + localStorage['columnaFiltrada']);

    if ((localStorage["columnaFiltrada"] != "")) {
        var aux = JSON.parse(localStorage["columnaFiltrada"]);
        for (var j = 0; j < aux.length; j++) {
            if (aux[j].columna == nombreColumna) {

                if (limpiado != null) {
                    var imgGridHeader = document.getElementById(nombreColumna + "Plan");
                    imgGridHeader.setAttribute("src", './images/icno_ordenable_filtrable.png');
                } else if (ordenacion == "0") {
                    var imgGridHeader = document.getElementById(nombreColumna + "Plan");
                    imgGridHeader.setAttribute("src", './images/icno_filtrado.png');
                    console.log("Hemos entrado al estado filtrar");
                } else if (ordenacion == "desc") {
                    var imgGridHeader = document.getElementById(nombreColumna + "Plan");
                    imgGridHeader.setAttribute("src", './images/icno_filtroOrdenarDescOn.png');
                } else if (ordenacion == "asc") {
                    var imgGridHeader = document.getElementById(nombreColumna + "Plan");
                    imgGridHeader.setAttribute("src", './images/icno_filtroOrdenarAscOn.png');
                }
            }
        }

    } else {
        if (ordenacion == "0") {
            var imgGridHeader = document.getElementById(nombreColumna + "Plan");
            imgGridHeader.setAttribute("src", './images/icno_ordenable_filtrable.png');
            console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " + ordenacion);
        } else if (ordenacion == "desc") {
            var imgGridHeader = document.getElementById(nombreColumna + "Plan");
            imgGridHeader.setAttribute("src", './images/icno_filtrado_ascendente.png ');
            console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " + ordenacion);
        } else if (ordenacion == "asc") {
            var imgGridHeader = document.getElementById(nombreColumna + "Plan");
            imgGridHeader.setAttribute("src", './images/icno_filtrado_descendente.png');
            console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " + ordenacion);
        } else {
            console.log("KAKAKAKAKAAK");
        }

        console.log("AQUI!!!!");
    }

}

////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes 
function pOrdenacionColumnaPlan(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna) {

    console.log("pOrdenacionColumna => " + Grid + " " + nombreColumna + " " + tipoOrdenacion + " " + tipoColumna + " " + formatColumna);

    if (localStorage["columnaOrdena"] == "") localStorage["columnaOrdena"] = nombreColumna;

    switch (tipoOrdenacion) {

    case "asc":

        if (localStorage["columnaOrdena"] != nombreColumna) {
            pPintarIconoCabeceraGridPlan(Grid, localStorage["columnaOrdena"], "0");
            console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        }

        console.log("Ordenacion ascendente");
        var grid = $("#" + Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumna,
            type: tipoColumna,
            format: formatColumna,
            dir: "asc"
        });

        localStorage["columnaOrdena"] = nombreColumna;
        localStorage["tipoOrden"] = tipoOrdenacion;
        pPintarIconoCabeceraGridPlan(Grid, nombreColumna, "asc");
        pMostrarIconoOrdenarPlan(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);

        $("#pFiltroPopUp").popup("close");
        break;
    case "desc":

        if (localStorage["columnaOrdena"] != nombreColumna) {

            pPintarIconoCabeceraGridPlan(Grid, localStorage["columnaOrdena"], "0");
            console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");

        }
        console.log("Ordenacion descendente");
        var grid = $("#" + Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumna,
            type: tipoColumna,
            format: formatColumna,
            dir: "desc"
        });

        localStorage["columnaOrdena"] = nombreColumna;
        localStorage["tipoOrden"] = tipoOrdenacion;
        pPintarIconoCabeceraGridPlan(Grid, nombreColumna, "desc");
        pMostrarIconoOrdenarPlan(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);

        $("#pFiltroPopUp").popup("close");
        break;
    case "0":

        if (localStorage["columnaOrdena"] != nombreColumna) {

            pPintarIconoCabeceraGridPlan(Grid, localStorage["columnaOrdena"], "0");
            console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");

        }

        console.log("Ordenacion 0");
        $("#" + Grid).data("kendoGrid").dataSource.sort({
            field: nombreColumna
        });

        localStorage["columnaOrdena"] = nombreColumna;
        localStorage["tipoOrden"] = "0";
        pPintarIconoCabeceraGridPlan(Grid, nombreColumna, "0");
        pMostrarIconoOrdenarPlan(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);

        $("#pFiltroPopUp").popup("close");

        break;
    }

}


////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes tabla plantillas
function sortPlanFecha() {

    var aux = localStorage.getItem('sortgrid');
    console.log("ORDENADO LA COMUNA 3333");
    switch (aux) {
    case "0":
        var grid = $("#pGridPlantillas").data("kendoGrid");
        grid.dataSource.sort({
            field: "fecha",
            type: "date",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosPlan3').attr("src", "./images/sort_desc.png");
        break;
    case "1":
        var grid = $("#pGridPlantillas").data("kendoGrid");
        grid.dataSource.sort({
            field: "fecha",
            type: "date",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosPlan3').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPlantillas").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosPlan3').attr("src", "./images/sort_both.png");
        break;
    }

}

function sortPlanNombre() {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var grid = $("#pGridPlantillas").data("kendoGrid");
        grid.dataSource.sort({
            field: "nombre",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosPlan4').attr("src", "./images/sort_desc.png");
        break;
    case "1":
        var grid = $("#pGridPlantillas").data("kendoGrid");
        grid.dataSource.sort({
            field: "nombre",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosPlan4').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPlantillas").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosPlan4').attr("src", "./images/sort_both.png");
        break;
    }

}

//////////////////////////////////////////////////////////////////////////
//Creamos nustros propios filtros para la Grid de Kendo
function pFiltroPersoPlan(Grid, pFila, pTipoFiltro, itemSeleccionado) {

    var ultimoFiltro = [];
    var ultimoFiltro2 = [];
    var extra = 0;
    console.log("pFiltroPerso => " + Grid + " " + pFila + " " + pTipoFiltro + " " + itemSeleccionado);


    $("#pFiltroPopUp").popup("close");
    var operador = "";
    var operador2 = "";
    var valor = "";
    var valor2 = "";

    if ((pFila == "cod_centr" || pFila == "cod_proveedo")) { //nuevoooooooooooooooooooooooooooooooooooooooo filtrooooooooooooooooooooooooooo

        ultimoFiltro = {
            field: pFila,
            operator: "eq",
            value: itemSeleccionado
        };

        console.log("ENTRA EN STRING => " + itemSeleccionado);

    } else {
        console.log("XXXXXXXXXXXXXXXXXXXXXX>>> NOOOOOOOOOOOOOOO");
    }

    console.log(ultimoFiltro);

    if (pFila == "cod_centr" || pFila == "cod_proveedo") {
        ////////////////////////////////////////////////////////
        // Revisamos si existe el filtro, si es asi lo Borramos 
        var dataSource = $("#" + Grid).data("kendoGrid").dataSource;
        var filters = dataSource.filter();

        console.log("Tots els filtres");
        console.log(filters);

        if (filters != undefined) {

            for (var j = 0; j < filters.filters.length; j++) {

                if (filters.filters[j].field == pFila) {
                    //x=aux[j].columna;
                    //console.log( aux );
                    //pPintarIconoCabeceraGrid(Grid, x,"0", 1);

                    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX " + j + " --> " + filters.filters[j].field);
                    console.log(filters.filters);
                    filters.filters.splice(j, 1);
                    console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYY " + j + "  ");
                    console.log(filters.filters);
                    j--;
                }

            }
        }

        console.log("Filtres sense repetir");
        console.log(filters);
        ////////////////////////////////////////////////////////


        if (filters != null) filters.filters.push(ultimoFiltro);
        else {

            filters = {
                logic: "and",
                filters: [ultimoFiltro]
            };
        }

        if (extra == 1) {
            filters.filters.push(ultimoFiltro2);
        }

        console.log("Filtres final");
        console.log(filters);

        dataSource.filter(filters);

        var allData = dataSource.data();

        var query = new kendo.data.Query(allData);
        var dataa = query.filter(filters).data;

        //console.log("DATOSSSSS PAGINAAAA FILTROOOOOO " + dataa.length);

        //Refrescamos los botones de paginaci?n
        localStorage["pedidos_pag_act"] = 1;
        var maxRowPag = localStorage.getItem("max_row_per_pag");
        //console.log("MAXXXXXXXXXXXXX ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  " + maxRowPag);
        localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);
        //console.log("LASSSSSTTTTTTTTTTT PAGEEEEEEEEEEEEEEEEEEEEE  " + localStorage["pedidos_pag_last"]);

        //Refrescamos los botones de paginaci?n
        localStorage["pedidos_pag_act"] = 1;
        var maxRowPag = localStorage.getItem("max_row_per_pag");
        //console.log("MAXXXXXXXXXXXXX ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  " + maxRowPag);
        localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);
        //console.log("LASSSSSTTTTTTTTTTT PAGEEEEEEEEEEEEEEEEEEEEE  " + localStorage["pedidos_pag_last"]);

        displayPedidoPlantillas();
        //localStorage['pValorFiltroGrid'] = "1";

        var aux = [];

        if (localStorage["columnaFiltrada"] != "") {
            aux = JSON.parse(localStorage["columnaFiltrada"]);
            aux.push({
                columna: pFila
            });

        } else aux.push({
            columna: pFila
        });

        localStorage["columnaFiltrada"] = JSON.stringify(aux);

        pPintarIconoCabeceraGridPlan(Grid, pFila, localStorage["tipoOrden"]);
    }

}