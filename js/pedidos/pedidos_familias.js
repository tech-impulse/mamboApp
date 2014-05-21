function pMostrarArticulos(param) {

    console.log("Mostrando Grid de Articulos por familia con parametro " + param);

    $("#dialogInsertarPedido").popup("close");

    db.transaction(function (transaction) {
        var centro = localStorage["pNuevoPedidoIdCentro"];
        var proveedor = localStorage["pNuevoPedidoIdProveedor"];



        if ((param == "filtrados" || $("#ListaNivel2").is(':visible')) && localStorage["pedidos_filtro_id_familia_nivel1"] != "") // hemos llamado a esta función filtrando previamente y filtrado por primer nivel
        {
            $('#ListaNivel2').show();
            $('#cancelNivel2').show();
            var fnivel1 = localStorage["pedidos_filtro_id_familia_nivel1"];
            var fnivel2 = localStorage["pedidos_filtro_id_familia_nivel2"];
            var fnivel3 = localStorage["pedidos_filtro_id_familia_nivel3"];
            if (fnivel2 == "" && fnivel3 == "") // nivel 1
            {
                console.log("Filtro nivel 1");
                $('#pLbArticulosFamilia2').text(localStorage["pedidos_filtro_nombre_familia_nivel1"]);
                var sql = "SELECT distinct i.idItem as cod, c.vendorReference as referencia , i.name as nombreArticulo, theoreticalStock, quantity FROM catalog as c, items as i LEFT JOIN ordersPendingDetail as p ON p.idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND p.idItem=i.idItem AND p.idItem=c.idItem WHERE c.idItem=i.idItem AND c.idVendor=" + proveedor + " AND AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + "  i.idFirstFamily=" + fnivel1 + " ORDER BY i.name DESC ";
            } else if (fnivel2 != "" && fnivel3 == "") // nivel 1 y 2
            {
                console.log("Filtro nivel 2");
                $('#ListaNivel3').show();
                $('#cancelNivel3').show();
                $('#pLbArticulosFamilia2').text(localStorage["pedidos_filtro_nombre_familia_nivel2"]);
                var sql = "SELECT distinct i.idItem as cod, c.vendorReference as referencia , i.name as nombreArticulo, theoreticalStock, quantity FROM catalog as c, items as i LEFT JOIN ordersPendingDetail as p ON p.idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND p.idItem=i.idItem AND p.idItem=c.idItem WHERE c.idItem=i.idItem AND c.idVendor=" + proveedor + " AND AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " i.idFirstFamily=" + fnivel1 + " AND i.idSecondFamily=" + fnivel2 + " ORDER BY i.name DESC ";
            } else if (fnivel2 == "" && fnivel3 != "") // nivel 1
            {
                console.log("Filtro nivel 1");
                $('#ListaNivel3').hide();
                $('#cancelNivel3').hide();
                $('#pLbArticulosFamilia2').text(localStorage["pedidos_filtro_nombre_familia_nivel3"]);
                var sql = "SELECT distinct i.idItem as cod, c.vendorReference as referencia , i.name as nombreArticulo, theoreticalStock, quantity FROM catalog as c, items as i LEFT JOIN ordersPendingDetail as p ON p.idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND p.idItem=i.idItem AND p.idItem=c.idItem WHERE c.idItem=i.idItem AND c.idVendor=" + proveedor + " AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " AND i.idFirstFamily=" + fnivel1 + " ORDER BY i.name DESC ";
            } else // nivel 1, 2 y 3
            {
                console.log("Filtro nivel 3");
                $('#ListaNivel3').show();
                $('#cancelNivel3').show();
                $('#pLbArticulosFamilia2').text(localStorage["pedidos_filtro_nombre_familia_nivel3"]);
                var sql = "SELECT distinct i.idItem as cod, c.vendorReference as referencia , i.name as nombreArticulo, theoreticalStock, quantity FROM catalog as c, items as i LEFT JOIN ordersPendingDetail as p ON p.idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND p.idItem=i.idItem AND p.idItem=c.idItem WHERE c.idItem=i.idItem AND c.idVendor=" + proveedor + " AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " AND i.idFirstFamily=" + fnivel1 + " AND i.idSecondFamily=" + fnivel2 + " AND i.idThirdFamily=" + fnivel3 + " ORDER BY i.name DESC ";
            }
        } else // hemos llamado a la función sin filtrar
        {
            $('#pLbArticulosFamilia2').text(localStorage["todos"]);
            var sql = "SELECT distinct i.idItem as cod, c.vendorReference as referencia , i.name as nombreArticulo, theoreticalStock, quantity FROM catalog as c, items as i LEFT JOIN ordersPendingDetail as p ON p.idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND p.idItem=i.idItem AND p.idItem=c.idItem WHERE c.idItem=i.idItem AND c.idVendor=" + proveedor + " AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " ORDER BY i.name DESC ";
            pMostrarFiltroFamilias();
        }

        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);
        var n_reg = 0;
        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                var pJsonPedidos = [];
                console.log("RESULTADOS FAMILIAS " + result.rows.length);
                var displayedData = $("#pGridNuevoPedido").data().kendoGrid.dataSource.view()
                var displayedDataAsJSON = JSON.stringify(displayedData);
                console.log("Datos de la Grid Anterior " + displayedDataAsJSON);
                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);

                    var cantidad = rowDb.quantity;
                    var ref = rowDb.referencia;

                    if (rowDb.referencia == undefined || rowDb.referencia == "undefined") {
                        ref = "";
                    }
                    if (rowDb.quantity == undefined || rowDb.quantity == "undefined") {
                        cantidad = "";
                    }


                    pJsonPedidos.push({

                        cod_articulo: rowDb.cod,
                        referencia: ref,
                        nombre: rowDb.nombreArticulo,
                        can_pedida: cantidad,
                        stock: rowDb.theoreticalStock,
                    });
                    n_reg++;
                }

                var grid = $("#pGridArticulos").data("kendoGrid");

                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones


                    $("#pGridArticulos").data().kendoGrid.destroy();
                    $("#pGridArticulos").empty();



                    console.log("Destruidaaaaaaaaaaaaaaaaaaaaaaa");
                }

                ////////////////////////////////////////
                // NAVEGACION  

                var mr = parseInt(localStorage.getItem("max_row_per_pag")) - 3;

                console.log("Numero max por pag:" + mr);

                //TRADUCCIONES GRID 
                var nume = localStorage.getItem('num');
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
                var ref = localStorage.getItem('ref_prov');
                var tCantidad = localStorage.getItem('can');

                $("#pGridArticulos").kendoGrid({
                    dataSource: {
                        data: pJsonPedidos,
                        schema: {
                            model: {
                                fields: {
                                    cod_articulo: {
                                        type: "integer"
                                    },
                                    referencia: {
                                        type: "string"
                                    },
                                    nombre: {
                                        type: "string"
                                    },
                                    can_pedida: {
                                        type: "integer"
                                    },
                                    stock: {
                                        type: "integer"
                                    },
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
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionArticulos(\"pGridArticulos\",\"cod_articulo\",\"ordenacionArticulos1\",\"integer\")' data-role='button' role='button'> " + nume + " <img id='ordenacionArticulos1' src='./images/sort_both.png' > </a>  </div> ",
                        width: '10%'
                    }, {
                        field: "referencia",
                        title: ref,
                        filterable: false,
                        template: "<div class='ra'>#= referencia #</div>",
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionArticulos(\"pGridArticulos\",\"referencia\",\"ordenacionArticulos2\",\"string\")' data-role='button' role='button'> " + ref +
                            " <img id='ordenacionArticulos2' src='./images/sort_both.png' > </a>  </div> ",
                        width: '12%'
                    }, {
                        field: "nombre",
                        title: prove,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionArticulos(\"pGridArticulos\",\"nombre\",\"ordenacionArticulos3\",\"string\")' data-role='button' role='button'> " + desc +
                            " <img id='ordenacionArticulos3' src='./images/sort_both.png' > </a>  </div> ",
                        width: '62%'
                    }, {
                        field: "can_pedida",
                        title: tCantidad,
                        filterable: false,
                        template: "<div class='ra'>#= can_pedida #</div>",
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionArticulos(\"pGridArticulos\",\"can_pedida\",\"ordenacionArticulos4\",\"integer\")' data-role='button' role='button'> " + tCantidad +
                            " <img id='ordenacionArticulos4' src='./images/sort_both.png' > </a>  </div> ",
                        width: '8%'
                    }, {
                        field: "stock",
                        title: stk,
                        filterable: false,
                        template: "<div class='ra'>#= stock #</div>",
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pOrdenacionArticulos(\"pGridArticulos\",\"stock\",\"ordenacionArticulos5\",\"integer\")' data-role='button' role='button'> " + stk +
                            " <img id='ordenacionArticulos5' src='./images/sort_both.png' > </a>  </div> ",
                        width: '8%'
                    }]
                });




                $('.keyboard').blur(); //escondemos el teclado                    
                $('.k-grid-pager').hide();

                /*localStorage["pedidos_detalle_pag_act"] = 1;
                localStorage["pedidos_pag_max_row"] = mr;
                localStorage["pedidos_pag_last"] = Math.ceil(n_reg / mr);*/

                if (localStorage["pedidos_pag_act"] > 1) {
                    console.log("Pag. actual del detalle es "+localStorage['pedidos_pag_act']);
                    var grid = $("#pGridArticulos").data("kendoGrid");
                    grid.dataSource.page(parseInt(localStorage['pedidos_pag_act']));
                    localStorage["pedidos_pag_max_row"] = mr;
                    localStorage["pedidos_pag_last"] = Math.ceil(n_reg / mr);

                } else {
                    localStorage["pedidos_pag_act"] = 1;
                    localStorage["pedidos_pag_max_row"] = mr;
                    localStorage["pedidos_pag_last"] = Math.ceil(n_reg / mr);

                }

                displayInsertarArticulos(); // Show/hide Divs


            }, errorMostrar);

        console.log("Query Finalizada");
        localStorage.setItem('sortgrid', "0");

    });
}

function pOrdenacionArticulos(Grid, nombreColumn, nombreImg, tipo) {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var tipoOrdenacion = "desc";
        var grid = $("#" + Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumn,
            type: tipo,
            dir: "desc"
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
            type: tipo,
            dir: "asc"
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

function pMostrarFiltroFamilias() {


    localStorage.setItem('pedidos_filtro_id_familia_nivel1', "");
    localStorage.setItem('pedidos_filtro_id_familia_nivel2', "");
    localStorage.setItem('pedidos_filtro_id_familia_nivel3', "");

    // LISTA DE NIVEL 1

    function onClose() {

        localStorage.setItem('pedidos_filtro_id_familia_nivel1', $('#nivel1').val());
        localStorage.setItem('pedidos_filtro_nombre_familia_nivel1', $('#nivel1').text());
        filtrarPorFamilia(1);
        showFiltroFamilia2();

    };

    db.transaction(function (transaction) {
        var sql = "SELECT distinct i.firstFamilyName as nom1, i.idFirstFamily as id1 FROM catalog as c, items as i WHERE c.idItem=i.idItem AND c.idVendor=" + localStorage["pNuevoPedidoIdProveedor"]; + " AND c.idPurchaseCenter=" + localStorage["pNuevoPedidoIdCentro"] + " ORDER BY i.name DESC ";

        //console.log("FILTRO FAMILIAS 1 => "+sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var i = 0;
                var listaNivel1 = [];

                for (i = 0; i < result.rows.length; i++) {
                    var family = result.rows.item(i);

                    listaNivel1.push({
                        nombre: family.nom1,
                        id: family.id1
                    });

                }
                if (i == 1) {
                    $('#nivel1').kendoDropDownList({
                        dataSource: {
                            data: listaNivel1
                        },
                        close: onClose,
                        dataTextField: 'nombre',
                        dataValueField: 'id',
                    }).data("kendoDropDownList");
                } else {
                    $('#nivel1').kendoDropDownList({
                        dataSource: {
                            data: listaNivel1
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

function showFiltroFamilia2() {

    // FILTRO DE NIVEL 2

    function onClose() {

        localStorage.setItem('pedidos_filtro_id_familia_nivel2', $('#nivel2').val());
        localStorage.setItem('pedidos_filtro_nombre_familia_nivel2', $('#nivel2').text());
        filtrarPorFamilia(2);
        showFiltroFamilia3();
    };

    db.transaction(function (transaction) {
        var sql = "SELECT distinct i.secondFamilyName as nom2, i.idSecondFamily as id2 FROM catalog as c, items as i WHERE i.idFirstFamily=" + localStorage["pedidos_filtro_id_familia_nivel1"] + " AND c.idItem=i.idItem AND c.idVendor=" + localStorage["pNuevoPedidoIdProveedor"]; + " AND c.idPurchaseCenter=" + localStorage["pNuevoPedidoIdCentro"] + " ORDER BY i.name DESC ";
        //console.log("FILTRO FAMILIAS 2 => "+sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var i = 0;
                var listaNivel2 = [];

                for (i = 0; i < result.rows.length; i++) {
                    var family = result.rows.item(i);

                    listaNivel2.push({
                        nombre: family.nom2,
                        id: family.id2
                    });

                }
                if (i == 1) {
                    $('#nivel2').kendoDropDownList({
                        dataSource: {
                            data: listaNivel2
                        },
                        close: onClose,
                        dataTextField: 'nombre',
                        dataValueField: 'id',
                    }).data("kendoDropDownList");
                } else {
                    $('#nivel2').kendoDropDownList({
                        dataSource: {
                            data: listaNivel2
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

function showFiltroFamilia3() {


    function onClose() {

        localStorage.setItem('pedidos_filtro_id_familia_nivel3', $('#nivel3').val());
        localStorage.setItem('pedidos_filtro_nombre_familia_nivel3', $('#nivel3').text());
        filtrarPorFamilia(3);

    };

    db.transaction(function (transaction) {
        var sql = "SELECT distinct i.thirdFamilyName as nom3, i.idThirdFamily as id3 FROM catalog as c, items as i WHERE i.idFirstFamily=" + localStorage["pedidos_filtro_id_familia_nivel1"] + " AND i.idSecondFamily=" + localStorage["pedidos_filtro_id_familia_nivel2"] + " AND c.idItem=i.idItem AND c.idVendor=" + localStorage["pNuevoPedidoIdProveedor"]; + " AND c.idPurchaseCenter=" + localStorage["pNuevoPedidoIdCentro"] + " ORDER BY i.name DESC ";


        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var i = 0;
                var listaNivel3 = [];

                for (i = 0; i < result.rows.length; i++) {
                    var family = result.rows.item(i);

                    listaNivel3.push({
                        nombre: family.nom3,
                        id: family.id3
                    });

                }
                if (i == 1) {
                    $('#nivel3').kendoDropDownList({
                        dataSource: {
                            data: listaNivel3
                        },
                        close: onClose,
                        dataTextField: 'nombre',
                        dataValueField: 'id',
                    }).data("kendoDropDownList");
                } else {
                    $('#nivel3').kendoDropDownList({
                        dataSource: {
                            data: listaNivel3
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



function crearFiltroOld() {

    //<label style="margin-top:10px; font-size:22px" id="nivel1"></label>

    var contenedor = document.getElementById("pFiltroFamiliasDiv");

    $("#ListaNivel1").empty();
    var lista1 = document.createElement('div');
    lista1.id = 'ListaNivel1';
    lista1.class = "ui-block-a";

    $("#ListaNivel2").empty();
    var lista2 = document.createElement('div');
    lista2.id = 'ListaNivel2';
    lista2.class = "ui-block-b";

    $("#ListaNivel3").empty();
    var lista3 = document.createElement('div');
    lista3.id = 'ListaNivel3';
    lista3.class = "ui-block-c";

    contenedor.appendChild(lista1);
    contenedor.appendChild(lista2);
    contenedor.appendChild(lista3);

}

function crearFiltro() {

    console.log("Recreamos los filtros por familia");

    $('#ListaNivel2').hide();
    $('#ListaNivel3').hide();
    $('#cancelNivel2').hide();
    $('#cancelNivel3').hide();

    var contenedor = document.getElementById("ListaNivel1");
    var contenedor2 = document.getElementById("ListaNivel2");
    var contenedor3 = document.getElementById("ListaNivel3");

    $("#ListaNivel1").empty();
    $("#ListaNivel2").empty();
    $("#ListaNivel3").empty();


    var drop1 = document.createElement('label');
    drop1.id = "nivel1";
    drop1.style.fontSize = "22px";
    drop1.style.marginTop = "10px";

    var drop2 = document.createElement('label');
    drop2.id = "nivel2";
    drop2.style.fontSize = "22px";
    drop2.style.marginTop = "10px";

    var drop3 = document.createElement('label');
    drop3.id = "nivel3";
    drop3.style.fontSize = "22px";
    drop3.style.marginTop = "10px";

    contenedor.appendChild(drop1);
    contenedor2.appendChild(drop2);
    contenedor3.appendChild(drop3);
    //contenedor.appendChild(lista1);
    // contenedor.appendChild(lista2);
    //contenedor.appendChild(lista3);
    //$('#mong').trigger('create');

    pMostrarFiltroFamilias();

}


/*
datos=> 

*/

function pMostrarDetalleArticulo(datos, orden) {
    var codArticulo;
    var nomArticulo;

    if (orden == "error") {
        console.log("Mostraremos el mensage de error en el popup");
        document.getElementById("pLabelTextError").style.display = "block";
        document.getElementById('pLabelTextError').value = datos.mensaje;
        document.getElementById("pLabelTextError").style.color = "red";
        document.getElementById("chartTAM").style.display = "none";
    }

    console.log("Mostrar detalle pedido");

    //$('#InUnidadesInsertarPedido').val(1);

    if ($("#pBtnNumCargado").val() == 0) {

        console.log("Entra qui 1111");

        if (localStorage["pantalla"] == "pedidosDetalleNuevo" && localStorage["ModoEscaner"] != "1") {



            codArticulo = datos.cod_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            nomArticulo = datos.nom_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            console.log("Modificar Articulo No escaner" + codArticulo);
            getDescripcionAviso("modificarArticulo");

            if (datos.uds > 0) {
                $("#InUnidadesInsertarPedido").val(datos.uds);
            } else if ($('#InUnidadesInsertarPedido').val() == "0" || $('#InUnidadesInsertarPedido').val() == "" || $('#InUnidadesInsertarPedido').val() == undefined || datos.uds == 0 || datos.uds == undefined) {
                console.log("ES 0");
                $('#InUnidadesInsertarPedido').val(1);
            } else {
                console.log("ES " + $("#InUnidadesInsertarPedido").val());
                $("#InUnidadesInsertarPedido").val(datos.uds);
            }
            $("#InTotalesInsertarPedido").val(datos.totales);
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && localStorage["ModoEscaner"] == "1" && orden != "modificarArticulo") {
            codArticulo = datos.cod_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            nomArticulo = datos.nom_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            console.log("Insertar Articulo  escaner 1111 " + datos.cod_articulo);
            getDescripcionAviso("insertarArticulo");
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && localStorage["ModoEscaner"] == "1" && orden == "modificarArticulo") {
            console.log("Modificar Articulo escaner modificar " + datos.cod_pedid);
            codArticulo = datos.cod_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            nomArticulo = datos.nom_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js

            getDescripcionAviso("modificarArticulo");
            if ($('#InUnidadesInsertarPedido').val() == "0") {
                console.log("ES 0");
                $('#InUnidadesInsertarPedido').val(1);
            } else {
                console.log("ES " + $("#InUnidadesInsertarPedido").val());
                $("#InUnidadesInsertarPedido").val(datos.uds);
            }
            $("#InTotalesInsertarPedido").val(datos.totales);
        } else if (orden == "modificar") {
            console.log("Modificar Articulo 2222 " + datos.cod_articulo);
            getDescripcionAviso("modificarArticulo");
            codArticulo = datos.cod_articulo;
            nomArticulo = datos.nombre;
            $("#InUnidadesInsertarPedido").val(datos.can_pedida);

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" && orden == "modificarArticulo") {
            console.log("Modificar Articulo 33333 " + datos.cod_pedid);
            codArticulo = datos.cod_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            nomArticulo = datos.nom_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            console.log("Modificar Articulo GLOBAL" + codArticulo);
            getDescripcionAviso("modificarArticulo");
            if ($('#InUnidadesInsertarPedido').val() == "0") {
                console.log("ES 0");
                $('#InUnidadesInsertarPedido').val(1);
            } else {
                console.log("ES " + $("#InUnidadesInsertarPedido").val());
                $("#InUnidadesInsertarPedido").val(datos.uds);
            }

            $("#InTotalesInsertarPedido").val(datos.totales);
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" && localStorage["ModoEscaner"] == "1") {
            codArticulo = datos.cod_articulo; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            nomArticulo = datos.nom_pedid; // asi se llama el codigo del articulo de la Grid de Detalle de Nuevo Pedido.... /alta_pedido.js
            console.log("Insertar Articulo global " + codArticulo + " " + nomArticulo);
            getDescripcionAviso("insertarArticulo");
        } else if ($("#InUnidadesInsertarPedido") == 0) {
            //PARA PLANTILLAS
            console.log("UNIDADES = 0   ");
            $("#InUnidadesInsertarPedido").val(1);
            //$("#InTotalesInsertarPedido").val(datos.totales);
        } else {

            console.log("Insertar Articulo ELSE  " + datos.cod_articulo);
            getDescripcionAviso("insertarArticulo");
            codArticulo = datos.cod_articulo;
            nomArticulo = datos.nombre;
            $("#InUnidadesInsertarPedido").val(1);
        }

        $("#pBtnNumCargado").val("1");
    } else {
        console.log("ENTRA POR AQUI , YA CARGADO !!!!!");
    }
    localStorage['pNuevoPedidoIdItem'] = codArticulo;

    var prov = localStorage['pNuevoPedidoIdProveedor'];
    var cen = localStorage['pNuevoPedidoIdCentro'];

    db.transaction(function (transaction) {
        //var sql = "SELECT distinct l.logisticChainName as desCantidad, l.ordinalType as numUds, l.idLogisticsChains, c.vendorReference, e.idEAN, theoreticalStock FROM catalog as c, logisticChains as l, EANS as e WHERE c.idPurchaseCenter="+cen+" AND c.idVendor="+prov+" AND c.idItem="+codArticulo+" AND c.idItem=l.idItem AND c.idVendor=l.idVendor AND c.idLogisticsChains=l.idLogisticsChains AND e.idItem="+codArticulo+" ORDER BY l.logisticChainName  DESC ";
        var pJsonAux = [];
        if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner")
            var sql = "SELECT distinct l.logisticChainName as desCantidad, l.ordinalType as numUds, l.idLogisticsChains, c.vendorReference, theoreticalStock, allowsPerUnitRequest, itemUnitName, c.* FROM catalog as c LEFT OUTER JOIN logisticChains as l ON c.idItem=l.idItem AND c.idLogisticsChains=l.idLogisticsChains WHERE c.idPurchaseCenter=" + cen + " AND c.idItem=" + codArticulo + "  ORDER BY l.isPrimary DESC, l.logisticChainName  DESC ";
        else
            var sql = "SELECT distinct l.logisticChainName as desCantidad, l.ordinalType as numUds, l.idLogisticsChains, c.vendorReference, theoreticalStock, allowsPerUnitRequest, itemUnitName, c.* FROM catalog as c LEFT OUTER JOIN logisticChains as l ON c.idItem=l.idItem AND c.idLogisticsChains=l.idLogisticsChains WHERE c.idPurchaseCenter=" + cen + " AND c.idVendor=" + prov + " AND c.idItem=" + codArticulo + " ORDER BY l.isPrimary DESC, l.logisticChainName  DESC ";

        console.log("SQL -->>> " + sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                var i = 0;


                console.log("SQL -->>> " + sql + " TOTAL ELEMENTOS = " + result.rows.length);

                for (i = 0; i < result.rows.length; i++) {


                    var rowDb = result.rows.item(i);

                    console.log("ARTICULOS INSERTANDO -----------" + i + " ==(" + result.rows.length + " - 1) && " + rowDb.allowsPerUnitRequest);


                    if (rowDb.desCantidad != null && rowDb.desCantidad != "") {
                        console.log("Cadena Obtenida" + rowDb.desCantidad);
                        console.log("Modificar articulo " + rowDb.vendorReference);



                        pJsonAux.push({

                            cadena: rowDb.desCantidad,
                            unidades_totales: rowDb.numUds,
                            id_cadena: rowDb.idLogisticsChains
                        });

                        console.log("Existe cadena logistica");

                    }

                    var ref = rowDb.vendorReference;
                    if (ref == "undefined") {
                        ref = "";
                    }

                    //var ean = rowDb.idEan;

                    if (i == (result.rows.length - 1) && rowDb.allowsPerUnitRequest == 1) {

                        console.log("ESTA ENTRANDO");

                        pJsonAux.push({

                            cadena: rowDb.itemUnitName,
                            unidades_totales: 1,
                            id_cadena: "11"
                        });

                        console.log("No existe cadena logistica");

                    }
                    $("#InRefProvInsertarPedido").val(ref); // Esta undefined en la base de datos
                    $("#InEANPrincipalInsertarPedido").val("AAAAAAA");
                    $("#InStockInsertarPedido").val(rowDb.theoreticalStock);
                }

                function onChange() {

                    console.log("Cambiamos en bacground de la fila!!!!");
                    var grid = $("#pGridArticulos").data("kendoGrid");
                    var row = grid.select();
                    var datos = grid.dataItem(row);

                    //if(datos.mensaje!=null){
                    console.log("Cambiamos en bacground de la fila!!!!");

                    /*db.transaction(function (transaction) {
		                    var sql = "UPDATE ordersPendingDetailErrors SET mensage='"+asdadasdasd+"' WHERE  idOrder='"+localStorage['pNuevoPedidoIntenalId']+"' ";
		                    console.log(sql);
		                    transaction.executeSql(sql, undefined,
		                        function (transaction, result) {
		                            console.log("Update hecho");
		                        }, error6);

                		});*/


                    //}
                }

                function onClose() {

                    var unidades = $("#InUnidadesInsertarPedido").val();
                    var unidades_cadena = $("#InCadenaInsertarPedido").val();
                    var unidades_totales = parseFloat(unidades) * parseFloat(unidades_cadena);




                    if (typeof unidades_totales === 'number' && unidades_totales.toString().indexOf(".") > 0) {

                        unidades_totales = unidades_totales.toString().substring(0, unidades_totales.toString().indexOf(".") + 3);
                        unidades_totales = formatearMonedaIdioma(total, 2, ".", ",");
                    }


                    $("#InTotalesInsertarPedido").val(unidades_totales);



                    pCreateChartTAM(localStorage['pNuevoPedidoIdCentro'], localStorage['pNuevoPedidoIdProveedor'], localStorage['pNuevoPedidoIdItem'], $("#InCadenaInsertarPedido").data("kendoDropDownList").text());

                    //DANI AQUI
                };

                $("#LbTituloInsertarPedido").text(codArticulo + " - " + nomArticulo);
                $("#LbTituloInsertarPedido").val(codArticulo);




                $('#InCadenaInsertarPedido').kendoDropDownList({
                    dataSource: {
                        data: pJsonAux
                    },
                    dataTextField: 'cadena',
                    dataValueField: 'unidades_totales',
                    close: onClose,
                    change: onChange
                }).data("kendoDropDownList");

                var unidades = $("#InUnidadesInsertarPedido").val();
                var unidades_cadena = $("#InCadenaInsertarPedido").val();
                var unidades_totales = parseFloat(unidades) * parseFloat(unidades_cadena);

                $("#InTotalesInsertarPedido").val(unidades_totales);


                db.transaction(function (transaction) {
                    var sql = "SELECT * FROM EANS WHERE idItem=" + codArticulo + "";
                    console.log("SQL -->>> " + sql);
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {
                            var i = 0;

                            var pJsonAux = [];
                            if (result.rows.length > 0) {
                                for (i = 0; i < result.rows.length; i++) {
                                    var rowDb = result.rows.item(i);
                                    console.log("ID de EAN encontrado " + rowDb.idEAN);
                                    //$("#InRefProvInsertarPedido").val(rowDb.ref_prov);
                                    $("#InEANPrincipalInsertarPedido").val(rowDb.idEAN);
                                    // $("#InStockMinInsertarPedido").val(rowDb.StockMin);
                                    // $("#InStockInsertarPedido").val(rowDb.Stock);

                                }
                            } else {
                                $("#InEANPrincipalInsertarPedido").val("");
                                console.log("EAN no encontrado para articulo " + codArticulo);
                            }

                            //setTimeout('$("#dialogInsertarPedido").popup("open")', 200);
                            //$("#dialogInsertarPedido").popup("open");

                        }, error6);

                });

                /*$("#dialogInsertarPedido").bind({
   										popupafteropen: function(event, ui) {
   											pCreateChartTAM(localStorage['pNuevoPedidoIdCentro'],localStorage['pNuevoPedidoIdProveedor'],localStorage['pNuevoPedidoIdItem'],$("#InCadenaInsertarPedido").data("kendoDropDownList").text());
   											console.log("Ejecutamos la funcion antes de que se habra el popUp");
   										}
								});*/


                pCreateChartTAM(localStorage['pNuevoPedidoIdCentro'], localStorage['pNuevoPedidoIdProveedor'], localStorage['pNuevoPedidoIdItem'], $("#InCadenaInsertarPedido").data("kendoDropDownList").text());
                //$("#dialogInsertarPedido").popup("open");
                setTimeout('$("#dialogInsertarPedido").popup("open")', 100);

            }, error6);
    });

}


function pNuevoPedidoInsertarArticuloTemporal(idItem, cantidad, nomCadena) {


    console.log("Articulo Seleccionado id_item:" + idItem + " cantidad: " + cantidad + " Nombre Cadena: " + nomCadena);
    var idCadena;
    db.transaction(function (transaction) { // hay que añadir IdPurchaseCenter
        if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "insertarArticulos")
            var sql = "SELECT distinct c.idLogisticsChains as idCadena FROM logisticChains as c WHERE c.idItem=" + idItem + " AND c.idVendor=" + localStorage["pNuevoPedidoIdProveedor"] + " AND c.logisticChainName='" + nomCadena + "'";
        else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner")
            var sql = "SELECT distinct c.idLogisticsChains as idCadena FROM logisticChains as c WHERE c.idItem=" + idItem + " AND c.logisticChainName='" + nomCadena + "'";

        console.log("SQL ==> " + sql);
        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length > 0) {
                    var rowDb = result.rows.item(0);
                    idCadena = rowDb.idCadena;
                    console.log("ID de Cadena Obtenida" + idCadena);
                    if ((localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") && $('#pedidosDialogInsertarOrden').text() == "Modificar") {
                        console.log("Modificamos Articulo Pedido Normal ");
                        pModificarDetallePedidoTemporal(idItem, idCadena, cantidad);
                    } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" && $('#pedidosDialogACOrden').text() != "existenBorradores") {
                        console.log("Insertamos Global");
                        pGlobalEscanerAnadirArticulo($("#InEANPrincipalInsertarPedido").val(), idCadena, cantidad, localStorage["pNuevoPedidoIdCentro"]);
                    } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" && $('#pedidosDialogACOrden').text() == "existenBorradores") {
                        console.log("Insertamos Global sin EAN");
                        pGlobalEscanerAnadirArticulo($("#InEANPrincipalInsertarPedido").val(), idCadena, cantidad, localStorage["pNuevoPedidoIdCentro"]);
                    } else {
                        console.log("Insertamos Detalle de Pedido temporal por defecto por CADENA ENCONTRADA");
                        var longname = $('#LbTituloInsertarPedido').text();
                        var name = longname.substr(longname.indexOf("-") + 2);
                        var chainName = $('#LbTituloInsertarPedido').val();

                        pInsertarDetallePedidoTemporal(idItem, idCadena, cantidad, name, chainName);
                    }

                } else {

                    idCadena = "11";
                    if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" && $('#pedidosDialogInsertarOrden').text() != "Modificar") {
                        console.log("Insertando Articulo pedido GLOBAL ");
                        pGlobalEscanerAnadirArticulo($("#InEANPrincipalInsertarPedido").val(), idCadena, cantidad, localStorage["pNuevoPedidoIdCentro"]);
                    } else if ($('#pedidosDialogInsertarOrden').text() == "Modificar") {
                        console.log("Modificando Articulo pedido ");
                        pModificarDetallePedidoTemporal(idItem, idCadena, cantidad);
                    } else {
                        console.log("Insertamos Detalle de Pedido temporal por defecto  de tipo UNIDAD");
                        var longname = $('#LbTituloInsertarPedido').text();
                        var name = longname.substr(longname.indexOf("-") + 2);
                        var chainName = $('#LbTituloInsertarPedido').val();
                        pInsertarDetallePedidoTemporal(idItem, idCadena, cantidad, name, chainName);



                    }
                }

            }, error6);
    });


}


$('#InUnidadesInsertarPedido').bind('keyup mouseup', function () {
    var unidades = $(this).val(); // get the current value of the input field.
    console.log("Unidades " + unidades);
    var unidades_cadena = $("#InCadenaInsertarPedido").val();
    var unidades_totales = parseInt(unidades) * parseInt(unidades_cadena);
    $("#InTotalesInsertarPedido").val(unidades_totales);
});

function filtrarPorFamilia(nivel) {
    if (nivel == 1) {
        console.log("Id de la familia " + $('#nivel1').val());
        localStorage["pedidos_filtro_id_familia_nivel1"] = $('#nivel1').val();
    }
    if (nivel == 2) {
        localStorage["pedidos_filtro_id_familia_nivel2"] = $('#nivel2').val();
    }
    if (nivel == 3) {
        localStorage["pedidos_filtro_id_familia_nivel3"] = $('#nivel3').val();
    }

    pMostrarArticulos("filtrados");

}