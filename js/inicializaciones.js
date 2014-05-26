var alto_content;
var tocado = 0;


/*$(document).on('mobileinit', function(){
$.mobile.defaultPageTransition = 'pop';
$.mobile.page.prototype.options.addBackBtn = true;
});*/

$(document).keydown(function (e) {
    if (e.keyCode == 27) return false; //////////deshabilitamos la tecla escape 
});


$(document).on('pageinit', '#LoginPage', function () {

    $('input').focus();
    localStorage["pantalla_anterior"] = "";
    localStorage["pantalla"] = "dialogoLogin";
    cargarLogin();

    $("#LbversionAppProgress").text(versionApp);
    $(".versionApp").text(versionApp);

    $(window).resize(function () { /////Funcion que comprueba si la pantalla cambia de tamaño

        //alert('window was resized!');

        if (localStorage["dispositivo"] == "PC") {
            CheckResolutionPc();
            if (localStorage["pantalla"] == "emitidos") {
                pMostrarPedidos();
                //resizeGrid("pGridPedidos"); 

            } else if (localStorage["pantalla"] == "pedidosDetalle") {

                pMostrarDetallePedido();
                //pMostrarDetallePedidoAnterior();
                //$("#pGridPedidosAnteriores").data("kendoGrid").dataSource.read();
                //$('#pGridPedidosAnteriores').data('kendoGrid').refresh(); 

            } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores") {

                plistLastOrders(localStorage["proveedor_seleccionado"], localStorage["centro_seleccionado"]);
                console.log("Resize pantalla nuevo pedidos nuevos anteriores");
                //$("#pGridPedidosAnteriores").data("kendoGrid").dataSource.read();
                //$('#pGridPedidosAnteriores').data('kendoGrid').refresh(); 

            } else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") {

                //$("#pGridPedidosPlantillas").data("kendoGrid").dataSource.read();
                //$('#pGridPedidosPlantillas').data('kendoGrid').refresh(); 

            } else if (localStorage["pantalla"] == "pedidos_plantillas") {

                pMostrarTodasPlantillas();

            } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

                pMostrarDetallePlantilla();

            } else if (localStorage["pantalla"] == "insertarArticulos") {

                //$("#pGridArticulos").data("kendoGrid").dataSource.read();
                //$('#pGridArticulos').data('kendoGrid').refresh(); 

            } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

                // $("#pGridNuevoPedido").dataSource("kendoGrid");

            } else if (localStorage["pantalla"] == "nuevo_proveedores") {

                getProvidersByCenter(localStorage["pNuevoPedidoIdCentro"], localStorage["centro_seleccionado"]);

            } else if (localStorage["pantalla"] == "nuevo_pedido") {

                getCentros();

            } else if (localStorage["pantalla"] == "pedidosBorradores") {
                pMostrarTodosBorradores();
            }
        }
    });

    //<input name="User" type="text" id="user_txt" style="width:75%" size="25"> 
    $('#InCodigoEan').on('focus', function () {
        if (tocado == 1) {
            //console.log("Bloqueamos Teclado") ;
            //$(this).blur();
            //setTimeout('$("#InCodigoEan").focus();',500);
            tocado = 0;
        } else {
            //setTimeout('$("#InCodigoEan").focus();',500);
            //console.log("Marcamos a 1 para bloquear el teclado") ;
            tocado = 1;
        }

    });



    /////////////////////////////////////////////////////////////////////////////////////
    // CARGA DE DATOS INICIAL
    $('#btnCargaDialogError').unbind('click').bind('click', function () {

        //Recarga total de los datos----------------------------------------------
        console.log("-BOTON ERROR--------------------------------->");
        $("#cargaDialogError").popup("close");
        restaurarCopia();

        $("#cargaDialogTextAC").html("Si desea recargar los datos pulse Aceptar.<br>Para continuar con los datos anteriores a la carga pulse cancelar.");
        setTimeout('$("#cargaDialogAC").popup("open");', 2000);


    });




    $('#btnCargaDialogOkAC').unbind('click').bind('click', function () {

        //Recarga total de los datos----------------------------------------------
        console.log("-BOTON ACEPTAR--------------------------------->");
        $("#cargaDialogAC").popup("close");

        setTimeout('recargaTotal();', 3000);


    });


    $('#btnCargaDialogCancelAC').unbind('click').bind('click', function () {
        //Continuar con los datos antiguos
        console.log("-BOTON CANCELAR--------------------------------->");

        db.transaction(function (transaction) {
            var sqlS = "SELECT COUNT(*) as n FROM items ";

            transaction.executeSql(sqlS, undefined,
                function (transaction, result) {
                    if (result.rows.item(0).n > 0) {
                        console.log("TIENE ELEMENTOS");

                        $("#cargaDialogAC").popup("close");

                        localStorage['pantalla'] = "menuPrincipal";
                        $.mobile.changePage('#menuPrincipal');

                    } else {

                        alert("NO existe una copia anterior");
                        console.log("NO TIENE ELEMENTOS  ELEMENTOS --> " + result.rows.item(0).n);

                    }


                });
        });

    });






    $("#pedidosDialogAC").on("popupafterclose", function (event, ui) {
        if (localStorage["ModoEscaner"] == "1") {
            console.log("ESTE caso");
            $("#InCodigoEan").val("");
            $("#pDialogInsertEan").popup("open");
        } else {
            if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" && $("pedidosDialogACOrden").text() != "") {
                console.log("ESTE OTRO CASO " + $("pedidosDialogACOrden").text());
                $("#InCodigoEan").val("");
                $("#pDialogInsertEan").popup("open");
            } else
                console.log("Caso desconocido");
        }
    });

    $("#dialogInsertarPedido").on("popupafterclose", function (event, ui) {
        if (localStorage["ModoEscaner"] == "1") {
            console.log("ESTE caso del Insertar/Modificar");
            $("#InCodigoEan").val("");
            $("#pDialogInsertEan").popup("open");
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") {
            localStorage["ModoEscaner"] = "1";
            console.log("ESTE caso del Insertar/Modificar");
            $("#InCodigoEan").val("");
            $("#pDialogInsertEan").popup("open");
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo" && localStorage["ModoEscaner"] == "2") {
            localStorage["ModoEscaner"] = "1";
            console.log("ESTE caso del Insertar/Modificar");
            $("#InCodigoEan").val("");
            $("#pDialogInsertEan").popup("open");
        } else {
            console.log("OTRO caso del Insertar/Modificar");
        }
    });

    localStorage["tipoOrden"] = "0";
    localStorage["columnaOrdena"] = "";
    localStorage["columnaFiltrada"] = "";
    localStorage["mensageErrorCabecera"] = "";
    localStorage.setItem('ModoEscaner', "0"); // Inicializamos el Escaner a 0 para que no salga el Popup de inserción automaticamente.
    localStorage.setItem('sortgrid', "1");
    //$("#flipPrecioDetallePedido").val("off");

    $('#versionApp').text("Build: " + versionApp);


    detectmob();

    localStorage.setItem('usuario', "");
    initDB(); // Inicializamos la base de datos
    //insertLog(0, 'Accede al sistema'); // APLICACION ----> 0
    localStorage["pedidos_pag_last"] == 10;

    //dameFechaUltimaCarga();



    localStorage['conectado'] = false;
    setInterval(function () {

        var actual = navigator.onLine;
        if (localStorage["pantalla"] != "menuPrincipal" && localStorage["pantalla"] != "dialogoLogin" && localStorage["pantalla"] != "" && localStorage["pantalla"] != undefined) {

            if (compareTime() > tiempoRecargaBD) //  6 horas
            {
                console.log("han pasado 6 horas " + localStorage["pantalla"]);
                var currentdate = new Date();
                localStorage["ultima_carga"] = currentdate.getTime(); // guardamos otra vez la ultima vez para recalcular las 6h
                getDescripcionAviso("recargarBaseDeDatos");
                //checkInicio();
                $("#pedidosDialogAC").popup("open");
            }
        }

        if (localStorage['online'] == 1) actual = true;
        else actual = false;

        if (actual !== JSON.parse(localStorage['conectado'])) {


            if (actual == true) {

                $('#imagenConexionMenuPrincipal').html("<a data-role='button' style='background: #e9e9e9; border-color: #e9e9e9; box-shadow:0 0 0; margin-top: 0px; ; padding: 0px' > <img id='status_connection' src='./images/verde.png' style='margin-left: 50px;' align='right'></a>");
                $('#imagenConexionPedidos').html("<a data-role='button' style='background: #e9e9e9; border-color: #e9e9e9; box-shadow:0 0 0; margin-top: 0px; ; padding: 0px' > <img id='status_connection' src='./images/verde.png' align='right'></a>");
                $('#imagenConexionMenu').html("<a data-role='button' style='background: #e9e9e9; border-color: #e9e9e9; box-shadow:0 0 0; margin-top: 0px; ; padding: 0px' > <img id='status_connection' src='./images/verde.png' align='right'></a>");
                localStorage['conectado'] = true;

            } else {

                $('#imagenConexionMenuPrincipal').html("<a data-role='button' style='background: #e9e9e9; border-color: #e9e9e9; box-shadow:0 0 0; margin-top: 0px; ; padding: 0px' > <img id='status_connection' src='./images/rojo.png' style='margin-left: 50px;' align='right'></a>");
                $('#imagenConexionPedidos').html("<a data-role='button' style='background: #e9e9e9; border-color: #e9e9e9; box-shadow:0 0 0; margin-top: 0px; ; padding: 0px' > <img id='status_connection' src='./images/rojo.png'  align='right'></a>");
                $('#imagenConexionMenu').html("<a data-role='button' style='background: #e9e9e9; border-color: #e9e9e9; box-shadow:0 0 0; margin-top: 0px; ; padding: 0px' > <img id='status_connection' src='./images/rojo.png' align='right'></a>");
                localStorage['conectado'] = false;



            }


        }

        //$('#imagenConexionMenuPrincipal').html("CONETADO = > "+ actual  ); 


    }, 1000);




    progress(0, "");
    initLocalStorage();

    currentTime = getCurrentTime(); // Obtenemos el tiempo actual.

    ///////////////////////////////////////////////////////
    // Inicializacion de menus      
    //activate_buttons_footer("", "", "", 1, 2, 0, 1);

    //$('#user_txt').val("thlleida");
    setTimeout(function () {
        $('#user_txt').focus()
    }, 100);
    //$('#pass_txt').val("test");
    /*
    if (localStorage.username != null) {
        document.getElementById("user_txt").value = localStorage.username;
    }
*/
    //$("#user_txt").focus();

    //Comportamiento de botones

    getControlEventosPedidos();

    $('#mLogout').unbind('click').bind('click', function () {

        insertLog(1, 3, "logoff en MAMBO Stock", "");
        //$.mobile.changePage('#LoginPage');
        //$(location).attr('href','./index.html');
        //location.href = './index.html';
        window.location.replace('./index.html');

    });

    $('#BtnSistema').unbind('click').bind('click', function () {

        localStorage["pantalla"] = "reportarIncidencia";
        console.log("Estamos en la pantalla => " + localStorage["pantalla"]);
        $.mobile.changePage('#Sistema');

        if (localStorage['online'] == 1) {
            console.log("ModoOnline");
            document.getElementById("sStatusConnection").src = "./images/verde.png";
        } else {
            console.log("ModoOffline");
            document.getElementById("sStatusConnection").src = "./images/rojo.png";
        }

        $('#menuSistema').show();
        $('#reportarIncidencia').hide();
        $('#enviarBD').hide();

    });


    /*
    Evento Boton carga total de la informaci�n 
    */
    $('#mBtnMenuCargaTotal').unbind('click').bind('click', function () {

        if (localStorage['online'] == 0) {

            console.log("No es posible recargar los datos sin conexi�n");
            getDescripcionAviso("NoSePuedeRecargar");
            $("#pedidosDialogAC").popup("open");

        } else {

            getDescripcionAviso("refrescarPrincipal");
            $("#mDialogAC").popup("open");



            //restServices();
        }

    });



    $('#btnDialogDetalleQueryOk').unbind('click').bind('click', function () {
        $("#DialogPedisoDetalleErrorQuery").popup("close");
    });

    $('#btnPedidosDialogRefrescarCancel').on('tap', function () {

        $("#pedidosDialogRefrescar").popup("close");

    });

    $("#pDialogInsertEan").on("popupafteropen", function (event, ui) {
        // setTimeout('$("#InCodigoEan").focus();',1000);
        $("#InCodigoEan").focus();
    });
    /////////////////////////////////////////////////////////////////////////////////
    //Capturamos en evento del espacio para capturar con el scanner el codigo
    $("#InCodigoEan").keyup(function (event) { //MARCA

        if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            var key = event.keyCode || event.which;

            if (key === 32) {

                var codigoEan = $("#InCodigoEan").val();
                codigoEan = codigoEan.replace(' ', '');

                db.transaction(function (transaction) {

                    var sql = "SELECT DISTINCT e.idItem, i.name FROM EANS as e, catalog as c, items as i WHERE c.idItem=e.idItem AND e.idEAN='" + codigoEan + "' AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " AND c.idVendor=" + localStorage['pNuevoPedidoIdProveedor'] + " AND i.idItem=c.idItem";

                    //var sql = "SELECT DISTINCT e.idItem FROM EANS as e, catalog as c WHERE c.idItem=e.idItem AND e.idEAN='"+codigoEan+"'";

                    console.log("CONSULTA ESCANER " + sql)
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {
                            console.log("EL resultado es: " + result.rows.length);

                            if (result.rows.length != 0) {

                                var idItemEANS = result.rows.item(0).idItem;

                                //pInsertarDetallePedidoTemporal(idItemEANS, "", 0);
                                //pRellenarGridNuevoPedido();
                                var Articulo = new Object();
                                Articulo.cod_pedid = result.rows.item(0).idItem;
                                Articulo.nom_pedid = result.rows.item(0).name;
                                $("#pDialogInsertEan").popup("close");
                                console.log("ESCANER EXISTE" + result.rows.item(0) + " con nombre " + result.rows.item(0).name);

                                $("#InCodigoEan").val("");
                                //pMostrarArticulosEscaner(idItemEANS);
                                //displayNuevoPedidoEscaner();

                                db.transaction(function (transaction) {

                                    var sql = "SELECT * FROM ordersPendingDetail as o WHERE idItem=" + Articulo.cod_pedid + "";
                                    transaction.executeSql(sql, undefined,
                                        function (transaction, res) {
                                            console.log("CONSULTA ESCANER si EXISTE" + sql)
                                            if (res.rows.length != 0) {
                                                localStorage["pNuevoPedidoIdItem"] = Articulo.cod_pedid;

                                                getDescripcionAviso("actualizarArticulo");
                                                $("#InCodigoEan").val(Articulo.nom_pedid);
                                                setTimeout('$("#pedidosDialogAC").popup("open");', 1000);

                                                /*
										 Articulo.uds = res.rows.item(0).quantity;
										 Articulo.totales = (parseInt(Articulo.uds) * parseInt(res.rows.item(0).ordinalType));
										 console.log("EXISTE con cantidad " + Articulo.uds);
										 pMostrarDetalleArticulo(Articulo,"modificarArticulo");
										 */
                                            } else
                                                pMostrarDetalleArticulo(Articulo);
                                        });
                                });




                            } else {

                                //alert("El EAN "+codigoEan+". No existe" );
                                $("#pDialogInsertEan").popup("close");
                                getDescripcionAviso("errorEAN", codigoEan);
                                setTimeout('$("#pedidosDialogAC").popup("open");', 1000);

                                console.log("ESCANER Codigo no valido");
                                $("#InCodigoEan").val("");
                            }

                        });
                });
                console.log("Enter");
            }
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") { // Si estamos en pedido Global en base a escaner

            var key = event.keyCode || event.which;

            if (key === 32) {

                var codigoEan = $("#InCodigoEan").val();
                codigoEan = codigoEan.replace(' ', '');

                db.transaction(function (transaction) {

                    var sql = "SELECT DISTINCT e.idItem, i.name, c.idVendor FROM EANS as e, catalog as c, items as i WHERE c.idItem=e.idItem AND i.idItem=c.idItem AND e.idEAN='" + codigoEan + "' AND c.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + "";

                    //var sql = "SELECT DISTINCT e.idItem FROM EANS as e, catalog as c WHERE c.idItem=e.idItem AND e.idEAN='"+codigoEan+"'";

                    console.log("CONSULTA ESCANER " + sql)
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {
                            console.log("EL resultado es: " + result.rows.length);

                            if (result.rows.length != 0) {

                                var idItemEANS = result.rows.item(0).idItem;

                                //pInsertarDetallePedidoTemporal(idItemEANS, "", 0);
                                var Articulo = new Object();
                                Articulo.cod_articulo = result.rows.item(0).idItem;
                                Articulo.nom_pedid = result.rows.item(0).name;
                                Articulo.idVendor = result.rows.item(0).idVendor;
                                $("#pDialogInsertEan").popup("close");
                                //pMostrarDetalleArticulo(Articulo);


                                console.log("ESCANER EXISTE" + result.rows.item(0).idItem + " con nombre " + result.rows.item(0).name);

                                $("#InCodigoEan").val("");

                                db.transaction(function (transaction) { // Comprobamos que el envio no es de tipo manual

                                    var sql = "SELECT r.vendorCommunicationType as tipo, v.name FROM relPurchaseCenter_Vendors as r, vendors as v WHERE r.idVendor=" + Articulo.idVendor + " AND r.idPurchaseCenter=" + localStorage['pNuevoPedidoIdCentro'] + " AND r.idVendor=v.idVendor";
                                    transaction.executeSql(sql, undefined,
                                        function (transaction, res) {
                                            localStorage["proveedor_seleccionado"] = res.rows.item(0).name;
                                            console.log("CONSULTA PROVEEDOR SI ES DE TIPO MANUAL" + sql);
                                            if (res.rows.item(0).tipo != "Manual" || localStorage["dispositivo"] == "PC") { // Si no es de tipo manual		

                                                db.transaction(function (transaction) {

                                                    var sql = "SELECT * FROM ordersPendingDetail as od, ordersPending as o WHERE idItem=" + Articulo.cod_articulo + " AND o.idInternalOrder=od.idInternalOrder";
                                                    transaction.executeSql(sql, undefined,
                                                        function (transaction, res) {
                                                            console.log("CONSULTA ESCANER si EXISTE" + sql);
                                                            if (res.rows.length != 0) {
                                                                console.log("EXISTE EN ORDERS PENDING DETAIL");
                                                                localStorage["pNuevoPedidoIdItem"] = Articulo.cod_articulo;
                                                                localStorage['pNuevoPedidoIntenalId'] = res.rows.item(0).idInternalOrder;
                                                                getDescripcionAviso("actualizarArticulo");
                                                                $("#InCodigoEan").val(Articulo.nom_pedid);
                                                                setTimeout('$("#pedidosDialogAC").popup("open");', 1000);
                                                            } else
                                                                pMostrarDetalleArticulo(Articulo);
                                                        });
                                                });

                                            } else {
                                                //alert("El EAN "+codigoEan+". No existe" );
                                                $("#pDialogInsertEan").popup("close");
                                                getDescripcionAviso("proveedorManual");
                                                setTimeout('$("#pedidosDialogAC").popup("open");', 1000);

                                                console.log("ESCANER Codigo no valido por proveedor Manual");
                                                $("#InCodigoEan").val("");
                                            }
                                        });
                                });




                            } else {

                                //alert("El EAN "+codigoEan+". No existe" );
                                $("#pDialogInsertEan").popup("close");
                                getDescripcionAviso("errorEAN", codigoEan);
                                setTimeout('$("#pedidosDialogAC").popup("open");', 1000);

                                console.log("ESCANER Codigo no valido");
                                $("#InCodigoEan").val("");
                            }

                        });
                });
                console.log("Enter");
            }
        }
    });

    /////////////////////////////////////////////////////////////////////////////////////
    //Filtro de la cabecera, cuando escribimos algun caracter se crean los filtros
    $('#searchText').keyup(function (event) {

        var charCode = event.charCode || event.keyCode;

        if (localStorage["pantalla"] == "emitidos") {


            console.log("ESTAMOS DENTRO DE PEDIDOS");

            var textSerch = $('#searchText').val();

            var grid = $("#pGridPedidos").data("kendoGrid");

            var filter = {
                logic: "or",
                filters: [
                    {
                        field: 'cod_pedid',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cod_centr',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cod_proveedo',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cod_zona',
                        operator: "contains",
                        value: textSerch
                    }
              ]
            };
            grid.dataSource.filter(filter);

            console.log("SEARCH pedidos: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSource = $("#pGridPedidos").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var dataa = query.filter(filters).data;

            //Refrescamos los botones de paginacion
            localStorage["pedidos_pag_act"] = 1;
            var maxRowPag = localStorage.getItem("max_row_per_pag");
            localStorage["pedidos_pag_last"] = Math.ceil(parseInt(dataa.length) / parseInt(maxRowPag));

            console.log("PAGINACION REFRESCO PEDIDOS " + localStorage["pedidos_pag_act"] + " " + maxRowPag + " " + localStorage["pedidos_pag_last"]);




            activate_buttons_footer("", "", "", "", "");

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);

            var gridDet = $("#pGridPedidosDet").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [
                    {
                        field: 'cod_articulo',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'nom_articulo',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cant_pedida',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cadena_logistica',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'unidades_total',
                        operator: "contains",
                        value: textSerch
                    }
              ]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridPedidosDet").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"] - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(dataDet.length / localStorage["pedidos_detalle_pag_max_row"]);



        } else if (localStorage["pantalla"] == "borradoresDetalle") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);

            var gridDet = $("#pGridDetalleBorrador").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [
                    {
                        field: 'cod_articulo',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'nom_articulo',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cant_pedida',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'cadena_logistica',
                        operator: "contains",
                        value: textSerch
                    },
                    {
                        field: 'unidades_total',
                        operator: "contains",
                        value: textSerch
                    }
              ]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridDetalleBorrador").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"] - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(dataDet.length / localStorage["pedidos_detalle_pag_max_row"]);



        }
    });

    $(document).on("swipeleft", "", function () {
        if ($("#pBtnPagNext").css("visibility") == "visible") {
            paginarAdelante();
        }
    });

    $(document).on("swiperight", "", function () {
        if ($("#pBtnPagBack").css("visibility") == "visible") {
            paginarAtras();
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////
    // PAGINACI?N 
    $('#pBtnPagBack').unbind('click').bind('click', function () {

        paginarAtras();

    });

    $('#pBtnPagNext').unbind('click').bind('click', function () {

        paginarAdelante();

    });

    function paginarAdelante() {

        if (localStorage["pantalla"] == "emitidos") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            displayPedidosEmitidos();

            $('#emitidos .k-i-arrow-e').click();

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            console.log("ENTRANDO EVENTO PAGINACION PEDIDO DETALLE NEXT");

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            displayDetail();

            $('#pGridPedidosDet .k-i-arrow-e').click();
        } else if (localStorage["pantalla"] == "pedidosDetalleAnterior") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            displayDetalleAnterior();

            $('#pGridPedidosDet .k-i-arrow-e').click();

        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            displayPedidosAnterioresNuevoPedido();

            $('#pGridPedidosAnteriores .k-i-arrow-e').click();

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            displayDetalleNuevoPedido();

            $('#pGridNuevoPedido .k-i-arrow-e').click();

            if ($('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) { // Esta des-seleccionado --> No hay que mostrar precios
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");

            } else {
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
            }




        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            displayPedidoPlantillas();

            console.log("Next de plantillas");

            $('#pGridPlantillas .k-i-arrow-e').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "insertarArticulos") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            displayInsertarArticulos();

            $('#pGridArticulos .k-i-arrow-e').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            displayInsertarArticulos();

            $('#pGridPedidosPlantillas .k-i-arrow-e').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            console.log("Next de plantillas detalle");

            $('#pGridNuevoPedidoPlantilla .k-i-arrow-e').click();

            displayPedidoPlantillasDetalle();

        } else if (localStorage["pantalla"] == "pedidosBorradores") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            displayBorradores();

            $('#pGridBorradores .k-i-arrow-e').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "borradoresDetalle") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            console.log("Next de plantillas detalle");

            $('#pGridDetalleBorrador .k-i-arrow-e').click();

            displayDetalleBorradores();

        } else if (localStorage["pantalla"] == "nuevo_proveedores") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            console.log("Next de listado de Proveedores");

            $('#pGridProveedores .k-i-arrow-e').click();

            displayProviders();

        } else if (localStorage["pantalla"] == "nuevo_pedido") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) + 1;

            console.log("Previous de listado de Centros");

            $('#pGridCentros .k-i-arrow-e').click();

            displayNuevoPedido();

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            console.log("Next de plantillas detalle");

            $('#pGridNuevoPedido .k-i-arrow-e').click();

            displayDetalleNuevoPedidoEscaner();

            $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
            $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
            $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
            $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
            $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
            $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");

        } else if (localStorage["pantalla"] == "pedidosResumenNuevoPedido") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) + 1;

            console.log("Previous de listado de Resumen");

            $('#pGridNuevoPedido .k-i-arrow-e').click();

            displayResumenNuevoPedido();

        } else {
            console.log("NINGUNO");
        }

        console.log("NEXT FIN");

    }

    function paginarAtras() {
        if (localStorage["pantalla"] == "emitidos") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            displayPedidosEmitidos();

            $('#emitidos .k-i-arrow-w').click();

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            console.log("ENTRANDO EVENTO PAGINACION PEDIDO DETALLE BACK");

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            displayDetail();

            $('#pGridPedidosDet .k-i-arrow-w').click();

        } else if (localStorage["pantalla"] == "pedidosDetalleAnterior") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            displayDetalleAnterior();

            $('#pGridPedidosDet .k-i-arrow-w').click();

        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            displayPedidosAnterioresNuevoPedido();

            $('#pGridPedidosAnteriores .k-i-arrow-w').click();

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            displayDetalleNuevoPedido();

            $('#pGridNuevoPedido .k-i-arrow-w').click();

            if ($('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) { // Esta des-seleccionado --> No hay que mostrar precios
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");

            } else { // Hay que ocultar precios, y enseÃ±ar cadena logistica y uds
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
                $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");
                $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
            }


        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            displayPedidoPlantillas();

            console.log("Previous de plantillas");

            $('#pGridPlantillas .k-i-arrow-w').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "insertarArticulos") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            displayInsertarArticulos();

            $('#pGridArticulos .k-i-arrow-w').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            displayInsertarArticulos();

            $('#pGridPedidosPlantillas .k-i-arrow-w').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            console.log("Previous de plantillas detalle");

            $('#pGridNuevoPedidoPlantilla .k-i-arrow-w').click();

            displayPedidoPlantillasDetalle();

        } else if (localStorage["pantalla"] == "pedidosBorradores") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            displayBorradores();

            $('#pGridBorradores .k-i-arrow-w').click();
            //resizeGrid();

        } else if (localStorage["pantalla"] == "borradoresDetalle") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            console.log("Previous de plantillas detalle");

            $('#pGridDetalleBorrador .k-i-arrow-w').click();

            displayDetalleBorradores();

        } else if (localStorage["pantalla"] == "nuevo_proveedores") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            console.log("Previous de listado de Proveedores");

            $('#pGridProveedores .k-i-arrow-w').click();

            displayProviders();

        } else if (localStorage["pantalla"] == "nuevo_pedido") {

            localStorage["pedidos_pag_act"] = parseInt(localStorage["pedidos_pag_act"]) - 1;

            console.log("Previous de listado de Centros");

            $('#pGridCentros .k-i-arrow-w').click();

            displayNuevoPedido();

        } else if (localStorage["pantalla"] == "pedidosResumenNuevoPedido") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            console.log("Previous de listado de Resumen");

            $('#pGridNuevoPedido .k-i-arrow-w').click();

            displayResumenNuevoPedido();

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") {

            localStorage["pedidos_detalle_pag_act"] = parseInt(localStorage["pedidos_detalle_pag_act"]) - 1;

            console.log("Previous de plantillas detalle");

            $('#pGridNuevoPedido .k-i-arrow-w').click();

            displayDetalleNuevoPedidoEscaner();

            $("#pGridNuevoPedido").data("kendoGrid").showColumn("precios");
            $("#pGridNuevoPedido").data("kendoGrid").hideColumn("precios");
            $("#pGridNuevoPedido").data("kendoGrid").hideColumn("totales");
            $("#pGridNuevoPedido").data("kendoGrid").showColumn("totales");
            $("#pGridNuevoPedido").data("kendoGrid").hideColumn("cad_log");
            $("#pGridNuevoPedido").data("kendoGrid").showColumn("cad_log");

        }
    }




    ///////////////////////////////////////////////////////////////////////////
    //////////Solucion bug de recarga pagina al apretar enter en el boton search
    $('form').keypress(function (e) {
        if (e == 13) {
            return false;
        }
    });

    $('input').keypress(function (e) {
        if (e.which == 13) {
            return false;
        }
    });

    /*
     *Capturamos el evento de hacer click en una fila de la tablade kendo UI
     *1-Llamamos a la tabla que hemos creado
     *2-Guardamos la fila donde estamos y seleccionamos los datos correspondientes a esa fila.
     */
    $(document).on('click', '.k-state-selected', function (e) {

        if (localStorage["pantalla"] == "emitidos") {
            var grid = $("#pGridPedidos").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            if (datos) {
                console.log("Mensaje es: " + datos.mensaje);
                //Enviado o pendiente de enviar
                if (datos.mensaje == "0" || datos.mensaje == "3") {
                    $('#pDivDetallePedido0').show();
                    $('#pDivDetallePedido1').hide();
                    $('#pDivDetallePedido2').hide();
                    $('#pDivDetallePedido3').hide();
                    $('#pDivDetallePedido4').hide();
                    $('#pDivDetallePedido5').hide();
                    $('#pDivDetallePedido6').hide();
                    console.log("Pedido esta en el estado: " + datos.estado_pedid);

                    pMostrarDetallePedido(datos.cod_pedid, "", false);

                } else if (datos.mensaje == "4") {
                    //CONTIENE ERROR ----
                    pRellenarGridNuevoPedido(localStorage['pNuevoPedidoIdProveedor']);
                }
            }

        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores") {

            var grid = $("#pGridPedidosAnteriores").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            if (datos) {
                pMostrarDetallePedidoAnterior(datos.cod_pedid);
            }
        } else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") // Desde Tab de Alta de Pedido
        {
            console.log("ESTAMOS AQUI GridPedidosPlantillas");
            var grid = $("#pGridPedidosPlantillas").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);

            if (datos) {

                console.log("ESTAMOS AQUI22222");
                console.log(datos);
                console.log("ERROR ???? " + datos.mensaje);

                //if(datos.mensaje=="0"){
                $('#pDivDetallePedidoPlantilla0').hide();
                $('#pDivDetallePedidoPlantilla1').show();
                $('#pDivDetallePedidoPlantilla2').show();
                $('#pDivDetallePedidoPlantilla3').show();
                $('#pDivDetallePedidoPlantilla4').show();
                console.log("Datos de cod_pedid= " + datos.cod_pedid);
                pMostrarDetallePlantilla(datos.cod_pedid, true);

                /*} else if(datos.mensaje != "0" ){ 
                //CONTIENE ERROR ----
                
                console.log("TIENE ERROR ");
                pRellenarGridNuevoPedido(localStorage['pNuevoPedidoIdProveedor']);
              } */
            }




        } else if (localStorage["pantalla"] == "pedidos_plantillas") // Desde Men�eral 
        {

            var grid = $("#pGridPlantillas").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            localStorage['pNuevoPedidoIntenalId'] = datos.idTemplate;
            localStorage["pNuevoPedidoIdCentro"] = datos.idTemplateCenter;
            localStorage["pNuevoPedidoIdProveedor"] = datos.idTemplateVendor;



            if (datos) {
                if (datos.mensaje == "0") {

                    console.log("SIN ERROR --->" + datos.cod_pedid);

                    console.log(datos);

                    $('#pDivDetallePedidoPlantilla0').hide();
                    $('#pDivDetallePedidoPlantilla1').show();
                    $('#pDivDetallePedidoPlantilla2').show();
                    $('#pDivDetallePedidoPlantilla3').show();
                    $('#pDivDetallePedidoPlantilla4').show();

                    pMostrarDetallePlantilla(datos.cod_pedid, true, datos.estado);
                    localStorage["deDondeVenimos"] = "plantillas";

                } else if (datos.mensaje != "0") {

                    console.log("ANTES DE LLAMAR A RELLENAR !!!! ");
                    console.log(datos);
                    pRellenarGridNuevoPedido(localStorage['pNuevoPedidoIdProveedor']);
                }
            }
        } else if (localStorage["pantalla"] == "insertarArticulos") {

            var target = $(e.target);
            if (target.is("td")) {
                var grid = $("#pGridArticulos").data("kendoGrid");
                var row = grid.select();
                var datos = grid.dataItem(row);

                //var row2 = $(this).closest("tr");
                var rowIdx = $("tr", grid.tbody).index(row);
                localStorage['itemCheckGridNuevoPedido'] = rowIdx;
                checkArticuloExistente(datos);
            }
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            var grid = $("#pGridNuevoPedido").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            console.log("DATOSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
            console.log(datos);
            if (datos.mensaje) {
                console.log("Hemos entrado en k-state-selected con error");
                /*var row = grid.select();
	            var datos = grid.dataItem(row);*/

                //var row2 = $(this).closest("tr");
                //var rowIdx = $("tr", grid.tbody).index(row);
                //localStorage['itemCheckGridNuevoPedido'] = rowIdx;
                pMostrarDetalleArticulo(datos, "error"); // Buscamos el Articulo para mostrar el Popup   
            } else {
                console.log("Hemos entrado en k-state-selected");
                /*var row = grid.select();
	            var datos = grid.dataItem(row);*/
                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                console.log(TIME_OUT);
                pMostrarDetalleArticulo(datos); // Buscamos el Articulo para mostrar el Popup  
            }
        } else if (localStorage["pantalla"] == "nuevo_proveedores") {
            var grid = $("#pGridProveedores").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            getLastOrders(datos.cod_proveedo, datos.nom_proveedo);
        } else if (localStorage["pantalla"] == "nuevo_pedido") {
            var grid = $("#pGridCentros").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            getProvidersByCenter(datos.cod_centro, datos.nom_centro);
        } else if (localStorage["pantalla"] == "pedidosBorradores") {

            var grid = $("#pGridBorradores").data("kendoGrid");
            var row = grid.select();
            var datos = grid.dataItem(row);
            localStorage['pNuevoPedidoIntenalId'] = datos.idInternalOrder;
            localStorage["pNuevoPedidoIdCentro"] = datos.idInternalOrderCenter;
            localStorage["pNuevoPedidoIdProveedor"] = datos.idInternalOrderVendor;
            if (datos) {
                $('#pDivDetallePedidoBorrador0').hide();
                $('#pDivDetallePedidoBorrador1').show();
                $('#pDivDetallePedidoBorrador2').show();
                $('#pDivDetallePedidoBorrador3').show();
                $('#pDivDetallePedidoBorrador4').show();
                pMostrarDetalleBorrador(datos.idInternalOrder, true);
            } else {
                console.log("No hay datos para este Borrador");
                getDescripcionAviso("SinArticulos");
                $("#pedidosDialogAC").popup("open");
            }
        } else
            console.log(localStorage["pantalla"]);



    });

    //////////////////////////////////////////////////////////////////////////////
    // CABECERA
    $('#btnHeaderBack').unbind('click').bind('click', function () {

        console.log("Click BACK CAB");

        if (localStorage["pantalla"] == "pedidosDetalle") {
            /*var grid = $("#pGridPedidos").data("kendoGrid");
				    grid.dataSource.page(localStorage['pedidos_pag_act']);*/
            displayPedidosEmitidos();
        } else if (localStorage["pantalla"] == "emitidos") {
            $.mobile.changePage('#menuPrincipal');
        } else if (localStorage["pantalla"] == "nuevo_pedido") {
            pMostrarPedidos(); // Si no no pagina bien
        } else if (localStorage["pantalla"] == "nuevo_proveedores") {

            /*var grid = $("#pGridProveedores").data("kendoGrid");
				    grid.dataSource.page(localStorage['pedidos_pag_act']);*/
            getCentros(); // Si no no pagina bien
            displayNuevoPedido();
        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores" || localStorage["pantalla"] == "pedidoNuevoPlantillas") {

            getProvidersByCenter(localStorage['pNuevoPedidoIdCentro'], localStorage['centro_seleccionado']);
            /*var grid = $("#pGridProveedores").data("kendoGrid");
				    grid.dataSource.page(localStorage['pedidos_pag_act']);*/

        } else if (localStorage["pantalla"] == "pedidosDetalleAnterior") {

            plistLastOrders(); // Si no no pagina bien
            //displayPedidosAnterioresNuevoPedido();
        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "pedidosDetalleNuevoEscaner" || localStorage["pantalla"] == "pedidosResumenNuevoPedido") {

            var grid = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
            var datos = grid.data();
            console.log("DAtos de la grid de nuevo pedido es null?");
            console.log(datos);
            if (datos.length > 0) {
                getDescripcionAviso("cancelarPedido");
                $("#pedidosDialogAC").popup("open");
            } else {
                pMostrarPedidos();
            }

        } else if (localStorage["pantalla"] == "pedidosAyuda") {

            //console.log("INICIACIONES XXXXXX------------->>>>         BACK DE AYUDA "+localStorage["pantalla"] +" = " +localStorage["pantallaAnterior"]);

            localStorage["pantalla"] = localStorage["pantallaAnterior"];

            var p = localStorage["pantalla"];

            if (p == "emitidos") {
                displayPedidosEmitidos();
            } else if (p == "pedidosDetalle") {
                //pMostrarDetallePedido( localStorage['pDetalleAnterior'] );
                displayDetail();
            }

        } else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") {
            plistLastOrders();
        } else if (localStorage["pantalla"] == "alta_pedidos_plantillas_detalle") {
            displayPlantillasNuevoPedido();
        } else if (localStorage["pantalla"] == "pedidos_plantillas") {
            //$.mobile.changePage('#menuPrincipal');
            pMostrarPedidos();
        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {
            var grid = $("#pGridPlantillas").data("kendoGrid");
            grid.dataSource.page(localStorage['pedidos_pag_act']);
            displayPedidoPlantillas();
        } else if ((localStorage["pantalla"] == "pedidos_plantillas_detalle") && (localStorage["plantillas"] == "plantillas")) {
            //pRellenarGridNuevoPedido();
            displayDetalleNuevoPedido();
        } else if (localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "pFiltroFamilias") {
            displayDetalleNuevoPedido();
        } else if (localStorage["pantalla"] == "pedidos_cabecera") {
            pRellenarGridNuevoPedido();
        } else if (localStorage["pantalla"] == "borradoresDetalle") {
            var grid = $("#pGridBorradores").data("kendoGrid");
            grid.dataSource.page(localStorage['pedidos_pag_act']);
            displayBorradores();
        } else {
            console.log("INICIALIZACIONES: No sabemos en que pantalla estamos, volvemos a inicio" + localStorage["pantalla"]);
            pMostrarPedidos();
        }

    });

    $('#InUnidadesInsertarPedido').keyup(function () {

        if ($("#InCadenaInsertarPedido").val() != 0) {
            var unidades = $("#InUnidadesInsertarPedido").val();
            var unidades_cadena = $("#InCadenaInsertarPedido").val();
            var unidades_totales = parseInt(unidades) * parseInt(unidades_cadena);
            $("#InTotalesInsertarPedido").val(unidades_totales);
        } else
            console.log("No seleccionado " + $("#InCadenaInsertarPedido").val());

    });



    $('#pBtnFiltrar').unbind('click').bind('click', function () {

        var mindatetime = $('#pListaFiltroFechasInicio').data("kendoDatePicker").value();
        var maxdatetime = $('#pListaFiltroFechasFin').data("kendoDatePicker").value();

        if ((mindatetime != null) || (maxdatetime != null)) {
            pFiltroPerso(null, localStorage.getItem('fila'), null, null);
            console.log("Filtrar por fecha la fila " + localStorage.getItem('fila'));
        } else {
            console.log("Faltan datos para filtrar por fechas");
        }
    });

    $('#pCargaDatos').unbind('click').bind('click', function () {

        if (localStorage["pantalla"] == "emitidos") {

            getDescripcionAviso("refrescar");
            $("#pedidosDialogRefrescar").popup("open");

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            getDescripcionAviso("refrescar");
            $("#pedidosDialogRefrescar").popup("open");

        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            getDescripcionAviso("refrescar");
            $("#pedidosDialogRefrescar").popup("open");

        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            getDescripcionAviso("refrescar");
            $("#pedidosDialogRefrescar").popup("open");

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            getDescripcionAviso("refrescar");
            $("#pedidosDialogRefrescar").popup("open");

        } else if (localStorage["pantalla"] == "insertarArticulos") {
            getDescripcionAviso("refrescar");
            $("#pedidosDialogRefrescar").popup("open");

        }
    });

    $('#btnPedidosDialogRefrescarOk').unbind('click').bind('click', function () {

        if (localStorage["pantalla"] == "emitidos") {

            $("#pedidosDialogRefrescar").popup("close");

            pCargarParcialPedidos();
            //$('#pGridPedidos').data('kendoGrid').dataSource.read();
            //$('#pGridPedidos').data('kendoGrid').refresh();

            // Diria que hay que llamar a RestService y recargar

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            $('#pGridPedidosDet').data('kendoGrid').dataSource.read();
            $('#pGridPedidosDet').data('kendoGrid').refresh();
            $("#pedidosDialogRefrescar").popup("close");

        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            $('#pGridPlantillas').data('kendoGrid').dataSource.read();
            $('#pGridPlantillas').data('kendoGrid').refresh();
            $("#pedidosDialogRefrescar").popup("close");

        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            $('#pGridNuevoPedidoPlantilla').data('kendoGrid').dataSource.read();
            $('#pGridNuevoPedidoPlantilla').data('kendoGrid').refresh();
            $("#pedidosDialogRefrescar").popup("close");

        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            $('#pGridNuevoPedido').data('kendoGrid').dataSource.read();
            $('#pGridNuevoPedido').data('kendoGrid').refresh();
            $("#pedidosDialogRefrescar").popup("close");

        } else if (localStorage["pantalla"] == "insertarArticulos") {

            $('#pGridArticulos').data('kendoGrid').dataSource.read();
            $('#pGridArticulos').data('kendoGrid').refresh();
            $("#pedidosDialogRefrescar").popup("close");

        }


    });

    $('#btnPedidosDialogRefrescarCancel').unbind('click').bind('click', function () {

        $("#pedidosDialogRefrescar").popup("close");

    });

    $('#searchText').keyup(function (event) {

        var charCode = event.charCode || event.keyCode;
        //var code = (event.keyCode ? event.keyCode : event.which);

        if (localStorage["pantalla"] == "emitidos") {


            console.log("ESTAMOS DENTRO DE PEDIDOS");

            var textSerch = $('#searchText').val();

            var grid = $("#pGridPedidos").data("kendoGrid");

            var filter = {
                logic: "or",
                filters: [{
                    field: 'cod_pedid',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_centr',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_proveedo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_zona',
                    operator: "contains",
                    value: textSerch
                }]
            };
            grid.dataSource.filter(filter);

            console.log("SEARCH pedidos: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSource = $("#pGridPedidos").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();
            var query = new kendo.data.Query(allData);
            var dataa = query.filter(filters).data;

            //Refrescamos los botones de paginacion
            localStorage["pedidos_pag_act"] = 1;
            var maxRowPag = localStorage.getItem("max_row_per_pag");
            localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);

            activate_buttons_footer("", "", "", "", "");

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);

            var gridDet = $("#pGridPedidosDet").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nom_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cant_pedida',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cadena_logistica',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'unidades_total',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridPedidosDet").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"] - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(dataDet.length / localStorage["pedidos_detalle_pag_max_row"]);

            displayDetail();

        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);

            var gridDet = $("#pGridPlantillas").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_pedid',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_centr',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_proveedo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nombre',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourcePlan = $("#pGridPlantillas").data("kendoGrid").dataSource;
            var filtersPlan = dataSourcePlan.filter();
            var allDataPlam = dataSourcePlan.data();
            var queryDet = new kendo.data.Query(allDataPlam);
            var dataPlan = queryDet.filter(filtersPlan).data;

            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = localStorage.getItem("max_row_per_pag");
            var mr = parseInt(localStorage["pedidos_pag_max_row"]);

            localStorage["pedidos_pag_last"] = Math.ceil(dataPlan.length / parseInt(localStorage["pedidos_pag_max_row"]));

            console.log("Numero max por pag TODAS PLANTILLAS : filas xpagina" + localStorage.getItem("max_row_per_pag") + " " + localStorage["pedidos_pag_act"] + " / " + localStorage["pedidos_pag_last"] + " = " + mr);

            displayPedidoPlantillas();

        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);

            var gridPlanDet = $("#pGridNuevoPedidoPlantilla").data("kendoGrid");

            var filterPlanDet = {
                logic: "or",
                filters: [{
                    field: 'cod_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nom_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cant_pedida',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cadena_logistica',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'unidades_total',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridPlanDet.dataSource.filter(filterPlanDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceNuevoPedPlan = $("#pGridNuevoPedidoPlantilla").data("kendoGrid").dataSource;
            var filtersPlan = dataSourceNuevoPedPlan.filter();
            var allDataNuevoPedPlam = dataSourceNuevoPedPlan.data();
            var queryDet = new kendo.data.Query(allDataNuevoPedPlam);
            var dataNuevoPedPlan = queryDet.filter(filtersPlan).data;


            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"] - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(dataNuevoPedPlan.length / localStorage["pedidos_detalle_pag_max_row"]);

            var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);

            displayPedidoPlantillasDetalle();

        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);

            var gridPlanDet = $("#pGridPedidosAnteriores").data("kendoGrid");

            var filterPlanDet = {
                logic: "or",
                filters: [{
                    field: 'reference',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_centr',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cod_proveedo',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridPlanDet.dataSource.filter(filterPlanDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceNuevoPedPlan = $("#pGridPedidosAnteriores").data("kendoGrid").dataSource;
            var filtersPlan = dataSourceNuevoPedPlan.filter();
            var allDataNuevoPedPlam = dataSourceNuevoPedPlan.data();
            var queryDet = new kendo.data.Query(allDataNuevoPedPlam);
            var dataNuevoPedPlan = queryDet.filter(filtersPlan).data;
            
            var mr = parseInt(localStorage.getItem("max_row_per_pag") -2); // Una fila menos debido a los labels superiores.
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = parseInt(mr);
            
            localStorage["pedidos_pag_last"] = Math.ceil(parseInt(dataNuevoPedPlan.length) / parseInt(mr));
            displayPedidosAnterioresNuevoPedido();


        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            console.log("ESTAMOS DENTRO DE NUEVO PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO NUEVO DETALLE " + textSerch);

            var gridDet = $("#pGridNuevoPedido").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_pedid',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'ref_prov',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nom_pedid',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'uds',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cad_log',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'totales',
                    operator: "contains",
                    value: textSerch
                }]
            };

            console.log(filterDet);
            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;

            var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"] - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(dataDet.length / localStorage["pedidos_detalle_pag_max_row"]);

            displayDetalleNuevoPedido();

        } else if (localStorage["pantalla"] == "insertarArticulos") {

            console.log("ESTAMOS DENTRO DE PEDIDOS DETALLE");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DETALLE " + textSerch);
            
            /*var grid = $("#pGridArticulos").data("kendoGrid");

            var fil = {
                logic: "or",
                filters: [{
                    field: 'cod_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'referencia',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nombre',
                    operator: "contains",
                    value: textSerch
                },{
                    field: 'can_pedida',
                    operator: "contains",
                    value: textSerch
                },{
                    field: 'stock',
                    operator: "contains",
                    value: textSerch
                }]
            };

            grid.dataSource.filter(fil);*/
            
            var gridArt = $("#pGridArticulos").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'referencia',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nombre',
                    operator: "contains",
                    value: textSerch
                }/*, {
                    field: 'can_pedida',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'stock',
                    operator: "contains",
                    value: textSerch
                }*/]
            };

            
            console.log(filterDet);
            gridArt.dataSource.filter(filterDet);

            console.log("SEARCH Pedidos detalle: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridArticulos").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;
            console.log("hemos filtrado en grid Articulos " + dataDet.length);
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = parseInt(localStorage["max_row_per_pag"]) - 3;
            localStorage["pedidos_pag_last"] = Math.ceil(parseInt(dataDet.length) / parseInt(localStorage["pedidos_pag_max_row"]));

            displayInsertarArticulos();

        } else if (localStorage["pantalla"] == "nuevo_proveedores") {

            console.log("ESTAMOS DENTRO DE LISTA DE PROVEEDORES");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO LISTA DE PROVEEDORES " + textSerch);

            var gridDet = $("#pGridProveedores").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_proveedo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nom_proveedo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'tipo_envio',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Proveedores: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridProveedores").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;
            
            var mr = parseInt(localStorage.getItem("max_row_per_pag") - 2); // -1 debido a los labels superiores
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = mr;
            localStorage["pedidos_pag_last"] = Math.ceil(dataDet.length/ mr);

            displayProviders();

        } else if (localStorage["pantalla"] == "pedidosDetalleAnterior") {

            console.log("ESTAMOS DENTRO DE DETALLE DE PEDIDO ANTERIOR");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO DE DETALLE DE PEDIDO ANTERIOR " + textSerch);

            var gridDet = $("#pGridPedidosDet").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'nom_articulo',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cant_pedida',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'cadena_logistica',
                    operator: "contains",
                    value: textSerch
                }, {
                    field: 'unidades_total',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Detalle Anterior: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridPedidosDet").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;
            
             localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_max"]);
            
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(dataDet.length / parseInt(localStorage["pedidos_detalle_pag_max_row"]));

            displayDetalleAnterior();

        } else if (localStorage["pantalla"] == "nuevo_pedido") {

            console.log("ESTAMOS DENTRO DE LISTA DE CENTROS");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO LISTA DE CENTROS " + textSerch);

            var gridDet = $("#pGridCentros").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'nom_centro',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Centros: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridCentros").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;

            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = localStorage["max_row_per_pag"];
            localStorage["pedidos_pag_last"] = Math.ceil(dataDet.length / localStorage["pedidos_pag_max_row"]);

            displayNuevoPedido();


        }else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") {

            console.log("ESTAMOS DENTRO DE LISTA DE CENTROS");

            var textSerch = $('#searchText').val();

            console.log("VALOR DEL FILTRO LISTA DE CENTROS " + textSerch);

            var gridDet = $("#pGridPedidosPlantillas").data("kendoGrid");

            var filterDet = {
                logic: "or",
                filters: [{
                    field: 'cod_centr',
                    operator: "contains",
                    value: textSerch
                },{
                    field: 'zona',
                    operator: "contains",
                    value: textSerch
                },{
                    field: 'cod_proveedo',
                    operator: "contains",
                    value: textSerch
                },{
                    field: 'nombre',
                    operator: "contains",
                    value: textSerch
                }]
            };

            gridDet.dataSource.filter(filterDet);

            console.log("SEARCH Centros: Pulsado tecla" + textSerch);

            event.stopPropagation();

            var dataSourceDetalle = $("#pGridPedidosPlantillas").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();
            var queryDet = new kendo.data.Query(allDataDet);
            var dataDet = queryDet.filter(filtersDetalle).data;

            
            var mr = parseInt(localStorage.getItem("max_row_per_pag") - 2);
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = mr;
            localStorage["pedidos_pag_last"] = Math.ceil(dataDet.length / parseInt(mr));
            displayPlantillasNuevoPedido();
        }

});

    
    //evento de cancelar filtro del filtro header
    $(document).on('click', '.ui-input-clear', function () {

        if (localStorage["pantalla"] == "emitidos") {

            var grid = $("#pGridPedidos").data("kendoGrid");
            grid.dataSource.filter([]);

            var dataSource = $("#pGridPedidos").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allData = dataSource.data();

            //Refrescamos los botones de paginacion
            localStorage["pedidos_pag_act"] = 1;
            var maxRowPag = localStorage.getItem("max_row_per_pag");
            localStorage["pedidos_pag_last"] = Math.ceil(allData.length / maxRowPag);

            activate_buttons_footer("", "", "", "", "");

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            var gridDet = $("#pGridPedidosDet").data("kendoGrid");
            gridDet.dataSource.filter([]);
            var dataSourceDetalle = $("#pGridPedidosDet").data("kendoGrid").dataSource;
            var filtersDetalle = dataSourceDetalle.filter();
            var allDataDet = dataSourceDetalle.data();

            //Refrescamos los botones de paginacion
            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"] - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(allDataDet.length / localStorage["pedidos_detalle_pag_max_row"]);

            displayDetail();

        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            var gridPlan = $("#pGridPlantillas").data("kendoGrid");
            gridPlan.dataSource.filter([]);
            var dataSourcePlan = $("#pGridPlantillas").data("kendoGrid").dataSource;
            var allDataPlan = dataSourcePlan.data();

            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = localStorage.getItem("max_row_per_pag");
            var mr = parseInt(localStorage["pedidos_pag_max_row"]);

            localStorage["pedidos_pag_last"] = Math.ceil(allDataPlan.length / parseInt(localStorage["pedidos_pag_max_row"]));

            console.log("Numero max por pag TODAS PLANTILLAS : filas xpagina" + localStorage.getItem("max_row_per_pag") + " " + localStorage["pedidos_pag_act"] + " / " + localStorage["pedidos_pag_last"] + " = " + mr);

            displayPedidoPlantillas();


        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            var gridDetPlan = $("#pGridNuevoPedidoPlantilla").data("kendoGrid");
            gridDetPlan.dataSource.filter([]);
            var dataSourceDetallePlan = $("#pGridNuevoPedidoPlantilla").data("kendoGrid").dataSource;
            var allDataDetPlan = dataSourceDetallePlan.data();

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["max_row_per_pag"]) - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(allDataDetPlan.length / parseInt(localStorage["pedidos_detalle_pag_max_row"]));

            var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
            displayPedidoPlantillasDetalle();


        } else if (localStorage["pantalla"] == "alta_pedidos") {

            var gridDetPlan = $("#pGridPedidosAnteriores").data("kendoGrid");
            gridDetPlan.dataSource.filter([]);
            var dataSourceDetallePlan = $("#pGridPedidosAnteriores").data("kendoGrid").dataSource;
            var allDataDetPlan = dataSourceDetallePlan.data();

            var mr = parseInt(localStorage.getItem("max_row_per_pag"));
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = mr;
            localStorage["pedidos_pag_last"] = Math.ceil(n_reg / mr);

            displayPedidosAnterioresNuevoPedido();


        } else if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            var gridDetPlan = $("#pGridNuevoPedido").data("kendoGrid");
            gridDetPlan.dataSource.filter([]);
            var dataSourceDetallePlan = $("#pGridNuevoPedido").data("kendoGrid").dataSource;
            var allDataDetPlan = dataSourceDetallePlan.data();

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["max_row_per_pag"]) - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(allDataDetPlan.length / parseInt(localStorage["pedidos_detalle_pag_max_row"]));

            var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);

            displayDetalleNuevoPedido();


        } else if (localStorage["pantalla"] == "insertarArticulos") {

            var gridDetPlan = $("#pGridArticulos").data("kendoGrid");
            gridDetPlan.dataSource.filter([]);
            var dataSourceDe = $("#pGridArticulos").data("kendoGrid").dataSource;
            var allDataDe = dataSourceDe.data();

            var mr = parseInt(localStorage["max_row_per_pag"]) - 3;

            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = mr;
            localStorage["pedidos_pag_last"] = Math.ceil(parseInt(allDataDe.length) / mr);

            displayInsertarArticulos();

        }else if (localStorage["pantalla"] == "nuevo_proveedores") {

            var grid = $("#pGridProveedores").data("kendoGrid");
            grid.dataSource.filter([]);
            var dataSource = $("#pGridProveedores").data("kendoGrid").dataSource;
            var allData = dataSource.data();

            var mr = parseInt(localStorage.getItem("max_row_per_pag") - 2); // -1 debido a los labels superiores
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = mr;
            localStorage["pedidos_pag_last"] = Math.ceil(parseInt(allData.length) / mr);

            displayProviders();

        }else if (localStorage["pantalla"] == "pedidoNuevoAnteriores") {

            var grid = $("#pGridPedidosAnteriores").data("kendoGrid");
            grid.dataSource.filter([]);
            var dataSource = $("#pGridPedidosAnteriores").data("kendoGrid").dataSource;
            var allData = dataSource.data();
            
            var mr = parseInt(localStorage.getItem("max_row_per_pag") -2); // Una fila menos debido a los labels superiores
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = parseInt(mr);
            localStorage["pedidos_pag_last"] = Math.ceil(parseInt(allData.length) / parseInt(mr));

            displayPedidosAnterioresNuevoPedido();
        }else if (localStorage["pantalla"] == "pedidoNuevoPlantillas") {

            var grid = $("#pGridPedidosPlantillas").data("kendoGrid");
            grid.dataSource.filter([]);
            var dataSource = $("#pGridPedidosPlantillas").data("kendoGrid").dataSource;
            var allData = dataSource.data();
            
            var mr = parseInt(localStorage.getItem("max_row_per_pag") - 2);
            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = mr;
            localStorage["pedidos_pag_last"] = Math.ceil(allData.length / parseInt(mr));
            displayPlantillasNuevoPedido();
            
        }else if (localStorage["pantalla"] == "pedidosDetalleAnterior") {

            var grid = $("#pGridPedidosDet").data("kendoGrid");
            grid.dataSource.filter([]);
            var dataSource = $("#pGridPedidosDet").data("kendoGrid").dataSource;
            var allData = dataSource.data();
            
            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_max"]);            

            localStorage["pedidos_detalle_pag_last"] = Math.ceil(parseInt(allData.length) / parseInt(localStorage["pedidos_detalle_pag_max_row_max"]));

            displayDetalleAnterior();

        }
        
        
    });

    $('#btnLoad').unbind('click').bind('click', function () {
        console.log("Hemos hecho click Listar");
        //$.mobile.changePage('#emitidos');     
        //pMostrarPedidos();

    });


    //Boton login
    $('#btnLogin').unbind('click').bind('click', function () {
        localStorage.setItem('pantalla', "dialogoLogin");
        authentication();
    });

    //Boton login Desarrollo Offline
    $('#btnLoginDesarrollo').unbind('click').bind('click', function () {
        //pMostrarPedidos();    

        console.log("LOGIN!!!!");
        //$.mobile.changePage('#menuPrincipal');        
        $.mobile.changePage('#menuPrincipal');

        console.log("FINNN LOGIN!!!!");

    });



    //////////////////////////////////////////////////////////////////////////////////////
    // Menu principal
    $('#mBtnPedidos').unbind('click').bind('click', function () {

        console.log("Menu -> Pedidos");
        $.mobile.changePage('#seccion_pedidos');

        localStorage["pantalla"] = "emitidos";
        console.log("Boton Pedidos Pulsado");

        eventoMostrarPedidos();

    });


    $('#mBtnMenuNoDisponible').unbind('click').bind('click', function () {

        localStorage["pantalla"] = "dialogoMenuPrincipal";
        getDescripcionAviso("menuNoDisponible");
        //$.mobile.changePage('#loginDialogAC', { role: "dialog" } );   
        //$( "#loginDialogAC" ).popup( "open" );
        $("#pedidosDialogA").popup("open");
        //alert("Option not available");

    });



    /*
        $('#btnHeaderMenu').on('tap', function(){
                
                console.log("Click en menu principal pedidos");
                
                if ( $('#submenu_pedidos').width() > 0){
                $('#mmenu').width('0px');
                $('#emitidos').width('100%');
                
                console.log(" 1111111 ");
                
            } else {
                $('#mmenu').width('20%');
                $('#emitidos').width('80%');
                
                console.log(" 2222222 ");
            }
        
        });
        */


    /////////////////////////////////////////////////////////////////////////////////////////////////
    // TRADUCCION

    $('#btnSpanish').unbind('click').bind('click', function () {

        traducir("ES");
        localStorage.setItem('language', "es");

    });


    $('#btnEnglish').unbind('click').bind('click', function () {

        traducir("EN");
        localStorage.setItem('language', "en")

    });


    //$('#pBtnPedidosEmitidos').click();

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // BOTONES DIALOGO
    // checkUsuario (1): EL USUARIO DISTINTO Y MODO OFFLINE
    // checkUsuario (2): EL USUARIO ES DISTINTO Y ESTAMOS ONLINE
    // checkUsuario (3): EL USUARIO ES IGUAL, MODO ONLINE
    // checkUsuario (4): EL USUARIO ES IGUAL, MODO OFFLINE

    $('#btnloginDialogOkAC').unbind('click').bind('click', function () {

        if (localStorage["pantalla"] == "dialogoLogin") {
            if (localStorage["checkUsuario"] == "1") {
                restServices();
            } else if (localStorage["checkUsuario"] == "2") {
                var pass = document.getElementById('loginDialogPassAC').value;
                pass = CryptoJS.MD5(pass).toString()
                document.getElementById('loginDialogPassAC').innerHTML = "";
                getValidarUsuario(localStorage.getItem('ultimo_usuario'), pass); // database.js 
            } else if (localStorage["checkUsuario"] == "3") {
                localStorage['pantalla'] = "menuPrincipal";
                $.mobile.changePage('#menuPrincipal');
            } else if (localStorage["checkUsuario"] == "9" && document.getElementById('loginDialogPassAC').value == "") {
                console.log("EL USUARIO ES DISTINTO Y ESTAMOS PREGUNTANDO PASSWORD 2");
                getDescripcionAviso("loginOfflineUserError");
            } else if (document.getElementById('loginDialogPassAC').value != "" && localStorage["checkUsuario"] == "9") {
                console.log("Aqui 2");
                var pass = document.getElementById('loginDialogPassAC').value;
                pass = CryptoJS.MD5(pass).toString()
                document.getElementById('loginDialogPassAC').innerHTML = "";
                getValidarUsuario(localStorage.getItem('ultimo_usuario'), pass); // database.js 
            } else if (localStorage["checkUsuario"] == "3") {
                console.log("Aqui 3");
                restServices();
            } else if (localStorage["checkUsuario"] == "4") {
                console.log("Aqui 4");
                pMostrarPedidos();
            } else if (localStorage["checkUsuario"] == "5") {
                getToken();
            } else if (localStorage["checkUsuario"] == "6") {
                console.log("Aqui 5");
                var pass = document.getElementById('loginDialogPassAC').value;
                pass = CryptoJS.MD5(pass).toString()
                document.getElementById('loginDialogPassAC').innerHTML = "";
                getValidarUsuario(localStorage.getItem('ultimo_usuario'), pass); // database.js 
            } else {
                console.log("Aqui nosesabe");
                getValidarUsuario(localStorage.getItem('usuario'), localStorage.getItem('pass'));
            }
        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores" || localStorage["pantalla"] == "pedidosDetalleNuevo") {
            pMostrarPedidos();
        } else if (localStorage["pantalla"] == "dialogoMenuPrincipal") {
            $('.ui-dialog').dialog('close');
        } else
            console.log("No se en que pantalla estamos");
    });

    $('#btnloginDialogCancelAC').unbind('click').bind('click', function () {

        if (localStorage["pantalla"] == "dialogoLogin") {
            if (localStorage["checkUsuario"] == "1") {
                localStorage['pantalla'] = "menuPrincipal";
                $.mobile.changePage('#menuPrincipal');
            } else if (localStorage["checkUsuario"] == "2") {
                $("#loginDialogAC").popup("close");
            } else if (localStorage["checkUsuario"] == "3") {
                $("#loginDialogAC").popup("close");
            } else if (localStorage["checkUsuario"] == "9") {
                console.log("EL USUARIO ES DISTINTO Y ESTAMOS OFFLINE");
                localStorage.setItem('checkUsuario', "9");
                getDescripcionAviso("loginOnline");
                $("#loginDialogAC").popup("close");
            } else
                $.mobile.changePage($('#LoginPage'), 'pop', false, true);
        } else if (localStorage["pantalla"] == "pedidoNuevoAnteriores" || localStorage["pantalla"] == "pedidosDetalleNuevo") {
            $("#loginDialogAC").popup("close");
        } else if (localStorage["pantalla"] == "dialogoMenuPrincipal") {
            $("#loginDialogAC").popup("close");
        } else
            console.log("No se en que pantalla estamos");
    });

    $('#btnloginDialogOkA').unbind('click').bind('click', function () {

        if (localStorage["pantalla"] == "dialogoLogin") {
            console.log("Aceptar");
            $.mobile.changePage($('#LoginPage'), 'pop', false, true);
        } else if (localStorage["pantalla"] == "dialogoMenuPrincipal") {
            $('.ui-dialog').dialog('close');
        } else
            console.log("No se en que pantalla estamos");
    });

    $('#btnPedidosDialogOkA').unbind('click').bind('click', function () {
        $("#pedidosDialogA").popup("close");
    });

    $('#btnPedidosDialogOkAC').unbind('click').bind('click', function () {


        $("#pDivCheckPrecioDetallePedido").html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');

        var accion = $('#pedidosDialogACOrden').text();

        if (localStorage["pantalla"] == "pFiltroFamilias" && accion == "") {
            pBorrarPedidosPendientes();
            $("#pedidosDialogAC").popup("close");
            pMostrarArticulos();
        } else if ((localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "pedidos_cabecera") && accion == "") {
            $('#pDivCheckPrecioDetallePedido').html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');
            $('#pLbpedidosDetalleNuevoPrecio').html('<label id="pLbpedidosDetalleNuevoPrecio" style="font-weight: bold; margin-bottom: 0px;text-align: center;">Mostrar precios</label>');
            pBorrarPedidosPendientes(); // Eliminamos el nuevo Pedido Temporal
            $("#pedidosDialogAC").popup("close");
            pMostrarPedidos();
        } else if (localStorage["pantalla"] == "pFiltroFamilias" && accion == "") {
            $("#pedidosDialogAC").popup("close");
            pBorrarPedidosPendientes();
            pMostrarArticulos();
        } else if (localStorage["pantalla"] == "pFiltroFamilias" && accion == "") {
            $("#pedidosDialogAC").popup("close");
            pBorrarPedidosPendientes();
            pMostrarArticulos();
        } else if (accion == "actualizar") {
            pBorrarPedidosPendientes();
            insertLog(2, 2, "Carga de datos por token caducado", "El usuario ha vuelto a recargar la base de datos");
            recargarInformacion();
        } else if (accion == "pMostrarPedidos") {
            pBorrarPedidosPendientes();
            $("#pedidosDialogAC").popup("close");
            $("#navpanel").panel("close");
            pMostrarPedidos();

        } else if (accion == "getCentros") {
            pBorrarPedidosPendientes();
            $("#pedidosDialogAC").popup("close");
            $("#navpanel").panel("close");
            getCentros();
            displayNuevoPedido();

        } else if (accion == "pMostrarTodosBorradores") {
            pBorrarPedidosPendientes();
            $("#pedidosDialogAC").popup("close");
            $("#navpanel").panel("close");
            pMostrarTodosBorradores();

        } else if (accion == "pMostrarTodasPlantillas") {
            pBorrarPedidosPendientes();
            $("#pedidosDialogAC").popup("close");
            $("#navpanel").panel("close");
            pMostrarTodasPlantillas();

        } else if (accion == "principal") {
            pBorrarPedidosPendientes();
            $.mobile.changePage('#menuPrincipal');

        } else if (accion == "pMostrarDetalleEscaner") {


            localStorage["pNuevoPedidoIdProveedor"] = ""; // Borramos los datos del proveedor por si no estaban vacios.
            localStorage["proveedor_seleccionado"] = "";
            localStorage["actualizarPedidoGlobal"] = "0";
            insertLog(3, 7, "Tipo de pedido global", "Tipo de pedido borrador anexado");
            pBorrarPedidosPendientes();
            checkBorradoresAnteriores();

        } else if (accion == "existenBorradores") {
            $("#pedidosDialogAC").popup("close");
            localStorage["actualizarPedidoGlobal"] = "1";
            // pListaNuevoPedidoVacio("escaner"); // genera la grid de kendo cargando la orden de la tabla temporal (vacia)
            pGeneraTodosPedidosGlobalesBorradores();
            console.log("Ponemos Escaner a 1 3");
            localStorage.setItem('ModoEscaner', "1");
            getDescripcionAviso("pedidoEscaner");
            /*
			$("#pedidosDialogAC").on("popupafterclose", function(event, ui) {
				console.log("PETE 1");
			   $("#InCodigoEan").val("");
			   $("#pDialogInsertEan").popup("open");
			});*/
            // setTimeout('$("#InCodigoEan").focus();',1000);
            // $('#InCodigoEan').focus().select(); 
            //$('#InCodigoEan').blur(); 
        } else if (accion == "eliminarBorrador") {

            $("#pedidosDialogAC").popup("close");
            pBorrarBorrador(localStorage['pNuevoPedidoIntenalId']);
            pMostrarTodosBorradores();
        } else if (accion == "eliminarPedido") {

            $("#pedidosDialogAC").popup("close");
            pBorrarBorrador(localStorage['pNuevoPedidoIntenalId']);
            pWSEliminarPedido($('#txtCodPedido').val());
            pMostrarPedidos();
        } else if (accion == "actualizarArticulo") {

            $("#pedidosDialogAC").popup("close");
            var codigoEan = $("#InCodigoEan").val();
            codigoEan = codigoEan.replace(' ', '');
            if (localStorage["ModoEscaner"] == "1") {
                localStorage["ModoEscaner"] = "2";
            }
            setTimeout('cargarPopupModificarArticulo();', 300);

        } else if (accion == "guardarBorrador") {

            $("#pedidosDialogAC").popup("close");
            insertLog(3, 5, "Pedido guardado como borrador", localStorage['pNuevoPedidoIntenalId'] + "," + localStorage['pNuevoPedidoIdProveedor'] + "," + localStorage['pNuevoPedidoIdCentro']);
            pGuardarPedidoTemporalComoBorrador(localStorage["pNuevoPedidoIntenalId"], "0");
            pMostrarTodosBorradores();
        } else if (accion == "borradoresGuardados") {

            $("#pedidosDialogAC").popup("close");

            insertLog(3, 7, "Generacion de borrador", "Inserccion de borrador por pedido global");
            pGuardarPedidoGlobalTemporalComoBorrador();
            setTimeout('pMostrarTodosBorradores();', 500);


        } else {
            pEliminarPedidoTemporal();
            pMostrarPedidos();
        }
    });

    $('#btnPedidosDialogCancelAC').unbind('click').bind('click', function () {
        var accion = $('#pedidosDialogACOrden').text();
        $("#navpanel").panel("close");
        $("#pedidosDialogAC").popup("close");

        if (accion == "existenBorradores") {
            localStorage["actualizarPedidoGlobal"] = "0";
            pListaNuevoPedidoVacio("escaner"); // genera la grid de kendo cargando la orden de la tabla temporal (vacia)
            insertLog(3, 7, "Tipo de pedido global", "Tipo de pedido nuevo borrador");
            console.log("Ponemos Escaner a 1 4");
            localStorage.setItem('ModoEscaner', "1");
            $('#pedidosDialogACOrden').text("");
            /*
			$("#pedidosDialogAC").on("popupafterclose", function(event, ui) {
				console.log("PETE 1");
			   $("#InCodigoEan").val("");
			   $("#pDialogInsertEan").popup("open");
			}); */
            //setTimeout('$("#InCodigoEan").focus();',1000);
        } else if (accion == "actualizarArticulo") {
            
            /*
			$("#pedidosDialogAC").on("popupafterclose", function(event, ui) {
				console.log("PETE 1");
			   $("#InCodigoEan").val("");
			   $("#pDialogInsertEan").popup("open");
			});
			*/

        } else if (accion == "pMostrarDetalleEscaner") {
            /*
			$("#pedidosDialogAC").on("popupafterclose", function(event, ui) {
				console.log("PETE 1");
			   $("#InCodigoEan").val("");
			   $("#pDialogInsertEan").popup("open");
			});
			*/
        } else if (accion == "actualizar") {
           getToken();
        }

    });

    $('#btnPedidosDialogA').unbind('click').bind('click', function () {

        $("#pedidosDialogA").popup("close");
    });

    $('#btnpDialogEliminarNuevoArticuloCancel').unbind('click').bind('click', function () {

        $("#pBtnNumCargado").val(0);
        $('.checkbox').prop('checked', false);
        $("#pDialogEliminarNuevoArticulo").popup("close");
        //console.log("CANCELADO !!! vamos a crear uno nuevo");
        //pRellenarGridNuevoPedido(localStorage['pNuevoPedidoIdProveedor']);

    });

    $('#btnpDialogEliminarNuevoArticulook').unbind('click').bind('click', function () {
        $("#pBtnNumCargado").val(0);
        if (localStorage["pantalla"] == "pedidosDetalleNuevo") {

            if (localStorage["deDondeVenimos"] == "plantillas") {

                var grid = $("#pGridNuevoPedido").data("kendoGrid");
                var rowId1 = localStorage['numFilaSeleccionada'];
                var raw1 = grid.dataSource.data();
                var item1 = raw1[rowId1];
                grid.dataSource.remove(item1);
                grid.showColumn("precios");
                grid.hideColumn("precios");


                var sql = "SELECT lineNumber FROM ordersPendingDetail WHERE idItem='" + localStorage['itemCheckGridNuevoPedido'] + "' AND idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'];
                console.log(sql);
                db.transaction(function (transaction) {
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {

                            var rowDb = result.rows.item(0);
                            var lineNum = rowDb.lineNumber;
                            console.log("Line del error es: " + lineNum);
                            var sql = "DELETE FROM ordersPendingDetail WHERE idItem='" + localStorage['itemCheckGridNuevoPedido'] + "' AND idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'];
                            console.log(sql);

                            transaction.executeSql(sql, undefined,
                                function (transaction, result) {

                                    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
                                    console.log(localStorage['pNuevoPedidoIntenalId']);
                                    console.log(rowId);

                                    var sql = "DELETE FROM ordersPendingDetailErrors WHERE idOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND lineNumber=" + lineNum;
                                    console.log(sql);

                                    transaction.executeSql(sql, undefined,
                                        function (transaction, result) {
                                            console.log("Hemos eliminado el error");
                                            pRellenarGridNuevoPedido();
                                            $("#pDialogEliminarNuevoArticulo").popup("close");


                                        });

                                });

                        });
                });


            } else if (localStorage["deDondeVenimos"] == "borradores") {


                var grid = $("#pGridNuevoPedido").data("kendoGrid");
                var rowId1 = localStorage['numFilaSeleccionada'];
                var raw1 = grid.dataSource.data();
                var item1 = raw1[rowId1];

                grid.dataSource.remove(item1);
                grid.showColumn("precios");
                grid.hideColumn("precios");

                var sql = "SELECT lineNumber FROM ordersPendingDetail WHERE idItem='" + localStorage['itemCheckGridNuevoPedido'] + "' AND idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'];
                console.log(sql);
                db.transaction(function (transaction) {
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {

                            var rowDb = result.rows.item(0);
                            var lineNum = rowDb.lineNumber;
                            console.log("Line del error es: " + lineNum);
                            var sql = "DELETE FROM ordersPendingDetail WHERE idItem='" + localStorage['itemCheckGridNuevoPedido'] + "' AND idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'];
                            console.log(sql);

                            transaction.executeSql(sql, undefined,
                                function (transaction, result) {

                                    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
                                    console.log(localStorage['pNuevoPedidoIntenalId']);
                                    console.log(rowId);
                                    var sql = "DELETE FROM ordersPendingDetailErrors WHERE idOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND lineNumber=" + lineNum;
                                    console.log(sql);

                                    transaction.executeSql(sql, undefined,
                                        function (transaction, result) {
                                            console.log("Hemos eliminado el error");
                                            $("#pDialogEliminarNuevoArticulo").popup("close");

                                        });

                                });

                        });
                });


            } else {

                var grid = $("#pGridNuevoPedido").data("kendoGrid");
                var rowId = localStorage['numFilaSeleccionada'];
                var raw = grid.dataSource.data();
                var item3 = raw[rowId];
                grid.dataSource.remove(item3);

                grid.showColumn("precios");
                grid.hideColumn("precios");


                console.log("Hemos eliminado el articulo " + item3.cod_pedid);

                var sql = "SELECT lineNumber FROM ordersPendingDetail WHERE idItem='" + item3.cod_pedid + "' AND idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'];
                console.log(sql);
                db.transaction(function (transaction) {
                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {

                            var rowDb = result.rows.item(0);
                            var lineNum = rowDb.lineNumber;
                            console.log("Line del error es: " + lineNum);
                            var sql = "DELETE FROM ordersPendingDetail WHERE idItem='" + item3.cod_pedid + "' AND idInternalOrder=" + localStorage['pNuevoPedidoIntenalId'];
                            console.log(sql);

                            transaction.executeSql(sql, undefined,
                                function (transaction, result) {

                                    console.log("AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
                                    console.log(localStorage['pNuevoPedidoIntenalId']);
                                    console.log(rowId);
                                    var sql = "DELETE FROM ordersPendingDetailErrors WHERE idOrder=" + localStorage['pNuevoPedidoIntenalId'] + " AND lineNumber=" + lineNum;
                                    console.log(sql);

                                    transaction.executeSql(sql, undefined,
                                        function (transaction, result) {
                                            console.log("Hemos eliminado el error");
                                            pRellenarGridNuevoPedido();
                                            $("#pDialogEliminarNuevoArticulo").popup("close");

                                        });

                                });

                        });
                });
            }

        }

    });

    $('#btnpDialogInsertEanok').unbind('click').bind('click', function () {

        pComprobarEan($("#InCodigoEan").val());
        $("#pDialogInsertEan").popup("close");
        localStorage.setItem('ModoEscaner', "0");

    });



    $("#pFiltrar").unbind('click').bind('click', function () { // Filtrar por un valor Popup

        if (localStorage["pantalla"] == "emitidos") {
            console.log("ESTAMOS DENTRO DE EMITIDOSSSSSSSSSSSSSSSSSSS " + getIconoStatus('status_emitido_confirmado.png') + " >---");
            var seleccionado = $("#pLista1").val();
            console.log("SELECCIONADO " + seleccionado);
            if (seleccionado != "-- Selec. --") {
                pFiltroPerso(localStorage.getItem('fila'), localStorage.getItem('tipoFiltro'));
            }
            var auxSort = localStorage.getItem('tipoSort');
            switch (auxSort) {
            case "Odenar ascendente":
                localStorage.setItem('tipoSort', "");
                sort3("1");
                break;
            case "Ordenar descendente":
                localStorage.setItem('tipoSort', "");
                sort3("0");
                break;
            case "Desordenar":
                localStorage.setItem('tipoSort', "");
                sort3("2");
                break;
            default:
                break;
            }

            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();

        } else if (localStorage["pantalla"] == "pedidosDetalle") {
            console.log("ESTAMOS DENTRO DE DETALLEEEEEEEEEEEEEEEEEEEE ");
            pFiltroPersoDet(localStorage.getItem('fila'), localStorage.getItem('tipoFiltro'));
            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();
        } else if (localStorage["pantalla"] == "pedidos_plantillas") {
            console.log("ESTAMOS DENTRO DE PLANTILLAAAASSSSSS ");
            pFiltroPersoPlan(localStorage.getItem('fila'), localStorage.getItem('tipoFiltro'));
            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();
        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {
            console.log("ESTAMOS DENTRO DE PLANTILLASSS NUEVAAAAAAAAA " + localStorage.getItem('fila'));
            pFiltroPersoNuevoPedPlan(localStorage.getItem('fila'), localStorage.getItem('tipoFiltro'));
            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();
        }

    });

    $('#pLimpiar').unbind('click').bind('click', function () { // Filtrar por un valor Popup

        if (localStorage["pantalla"] == "emitidos") {

            if (localStorage.getItem('fila') == "estado_pedid") {

                pMostrarPedidos();

            } else {
                var pVent = $("#pVenFiltro").data("kendoWindow");
                pVent.close();
                var grid = $("#pGridPedidos").data("kendoGrid");
                grid.dataSource.filter([]); //limpiamos el filtro


                var dataSource = $("#pGridPedidos").data("kendoGrid").dataSource;
                var filters = dataSource.filter();
                var allData = dataSource.data();

                //Refrescamos los botones de paginaci?        localStorage["pedidos_pag_act"]=1;
                var maxRowPag = localStorage.getItem("max_row_per_pag");
                localStorage["pedidos_pag_last"] = Math.ceil(allData.length / maxRowPag);

                displayPedidosEmitidos();
            }

        } else if (localStorage["pantalla"] == "pedidosDetalle") {

            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();
            var grid = $("#pGridPedidosDet").data("kendoGrid");
            grid.dataSource.filter([]); //limpiamos el filtro


            var dataSource = $("#pGridPedidosDet").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allDataDet = dataSource.data();

            //Refrescamos los botones de paginacion
            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"];
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(allDataDet.length / parseInt(localStorage["pedidos_detalle_pag_max_row"]));

            displayDetail();

        } else if (localStorage["pantalla"] == "pedidos_plantillas") {

            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();
            var grid = $("#pGridPlantillas").data("kendoGrid");
            grid.dataSource.filter([]); //limpiamos el filtro


            var dataSource = $("#pGridPlantillas").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allDataDet = dataSource.data();

            localStorage["pedidos_pag_act"] = 1;
            localStorage["pedidos_pag_max_row"] = parseInt(localStorage.getItem("max_row_per_pag"));
            var mr = parseInt(localStorage["pedidos_pag_max_row"]);

            localStorage["pedidos_pag_last"] = Math.ceil(allDataDet.length / parseInt(localStorage["pedidos_pag_max_row"]));

            console.log("Numero max por pag TODAS PLANTILLAS : filas xpagina" + localStorage.getItem("max_row_per_pag") + " " + localStorage["pedidos_pag_act"] + " / " + localStorage["pedidos_pag_last"] + " = " + mr);

            displayPedidoPlantillas();

        } else if (localStorage["pantalla"] == "pedidos_plantillas_detalle") {

            var pVent = $("#pVenFiltro").data("kendoWindow");
            pVent.close();
            var grid = $("#pGridNuevoPedidoPlantilla").data("kendoGrid");
            grid.dataSource.filter([]); //limpiamos el filtro


            var dataSource = $("#pGridNuevoPedidoPlantilla").data("kendoGrid").dataSource;
            var filters = dataSource.filter();
            var allDataDetPlan = dataSource.data();

            localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["max_row_per_pag"]) - 2;
            localStorage["pedidos_detalle_pag_last"] = Math.ceil(allDataDetPlan.length / parseInt(localStorage["pedidos_detalle_pag_max_row"]));

            var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);

            displayPedidoPlantillasDetalle();

        }
    });

    $('#pCancelar').unbind('click').bind('click', function () { // Cancelar Filtrar Popup

        var pVent = $("#pVenFiltro").data("kendoWindow");
        pVent.close();

        $('#filtroPedidosA').hide();
        $('#filtroPedidosB').hide();
        $('#filtroPedidosC').hide();
        $('#filtroPedidosD').hide();
        $('#filtroPedidosE').hide();
        $('#filtroPedidosF').hide();
        $('#filtroPedidosG').hide();
        $('#filtroPedidosH').hide();

    });

    /*$("#flipPrecioDetallePedido").change(function() {
        
        var state = $("#flipPrecioDetallePedido").val();
        console.log("Valor del switch " +state);
        
        var grid = $("#pGridNuevoPedido").data("kendoGrid");
        
        if(state=="on"){
            console.log("Valor del switch on");
            
            $('#pGridNuevoPedido').data('kendoGrid').dataSource.read();
            $('#pGridNuevoPedido').data('kendoGrid').refresh();
        		
        		grid.hideColumn("totales");
        		grid.hideColumn("cad_log");
        		grid.showColumn("precios");
        		
        }else if(state=="off"){
            console.log("Valor del switch off");
            
            $('#pGridNuevoPedido').data('kendoGrid').dataSource.read();
            $('#pGridNuevoPedido').data('kendoGrid').refresh();
            
            grid.showColumn("totales");
        		grid.showColumn("cad_log");
            grid.hideColumn("precios");
        }
        
        $('.ui-slider-handle.ui-btn.ui-shadow.ui-slider-handle-snapping').css( "background", '<img src="./images/status_anulado.png">');
        
        });*/

    $("#pDivCheckPrecioDetallePedido").unbind('click').bind('click', function () {

        console.log("xxxxxxxxxxxxxxxxx");
        var grid = $("#pGridNuevoPedido").data("kendoGrid");

        if ($('#checkPrecioDetallePedido').attr('src').indexOf("uncheck") > 0) {

            //$('#pGridNuevoPedido').data('kendoGrid').dataSource.read();
            //$('#pGridNuevoPedido').data('kendoGrid').refresh();

            //var encTemplate = kendo.template("<tr> <td class='ra'>#=cod_pedid#</td> <td class='ra'>#=ref_prov#</td> <td>#=nom_pedid#</td> <td class='ra'>#=uds#</td><td class='ra'>#=precios#</td><td style='text-align: center'>  <img class='checkbox' src='images/trash.png' style='width: 30px; height: 30px'></td></tr>");

            console.log("ESTA EN UNCHECK");


            console.log("ESTA EN UNCHECK");
            //grid.options.rowTemplate=encTemplate;
            //grid.thead.remove();
            grid.hideColumn("totales");
            grid.hideColumn("cad_log");
            grid.showColumn("precios");


            $("#pDivCheckPrecioDetallePedido").html('<img id="checkPrecioDetallePedido" src="images/check.png" style="width:30px; height:30px">');

        } else {
            console.log("ESTA EN CHECK");
            //$('#pGridNuevoPedido').data('kendoGrid').dataSource.read();
            //$('#pGridNuevoPedido').data('kendoGrid').refresh();
            //var encTemplate = kendo.template("<tr> <td class='ra'>#=cod_pedid#</td> <td class='ra'>#=ref_prov#</td> <td>#=nom_pedid#</td> <td class='ra'>#=uds#</td><td>#=cad_log#</td> <td class='ra'>#=totales#</td> <td style='text-align: center'>  <img class='checkbox' src='images/trash.png' style='width: 30px; height: 30px'></td></tr>");
            //grid.thead.remove();
            grid.showColumn("totales");
            grid.showColumn("cad_log");
            grid.hideColumn("precios");
            //grid.options.rowTemplate=encTemplate;

            $("#pDivCheckPrecioDetallePedido").html('<img id="checkPrecioDetallePedido" src="images/uncheck.png" style="width:30px; height:30px">');
        }
    });





    $('#pBtnPedidosMenuInicio').unbind('click').bind('click', function () { // Nuevo Pedido

        localStorage['pantalla_anterior'] = "";
        //activate_buttons_header(0 , "Pedidos emitidos", 1);
        //localStorage["pantalla"]="emitidos";
        console.log("HEMOS CLICADO EN EL BOTON DE INICIO");
        if (localStorage["pantalla"] == "pedidosDetalleNuevo" || localStorage["pantalla"] == "insertarArticulos" || localStorage["pantalla"] == "pedidos_cabecera") {
            getDescripcionAviso("cancelarPedido", "principal");
            $("#pedidosDialogAC").popup("open");
        } else {
            $.mobile.changePage('#menuPrincipal');
            localStorage["pantalla"] = "menuPrincipal";
        }

    });




    $('#mBtnAyuda').unbind('click').bind('click', function () {


        console.log("BOTON DE AYUDA PULSADO Menu principal");

        localStorage["pantalla"] = "ayudaPrincipal";

        //$('#mLabTextAyuda').html("Texto de ayuda para el men? principal. <br>La ayuda que se ha de mostrar es la pertece a la pantalla principal");


        console.log("BOTON 22222222 AYUDA PULSADO EN EVENTOS = " + localStorage["pantallaAnterior"] + "=" + localStorage["pantalla"]);

        //displayPedidosAyuda();

        var el = document.getElementById('mAyudaa-popup');
        el.setAttribute('style', 'left:0px;width:100%;height:100%');
        getPedidosAyuda(localStorage["pantalla"]);
        $("#mAyudaa").popup("open");
        insertLog(3, 4, "Se ha accedido a la pantalla de ayuda", localStorage["pantalla"]);


    });


    $('#mBtnHeaderBack').unbind('click').bind('click', function () {

        $("#menuPrincipalPantalla").show();

        $("#mBtnHeaderBack").hide();

        localStorage["pantalla"] = "menuPrincipal";


    });



    /////////////////////////////////////////////////////////////////////////////////////////////////
    // MENU PRINCIPAL POP-UP  CARGA DATOS

    $('#mBtnDialogACOk').unbind('click').bind('click', function () {
        $('#mDialogAC').popup("close");
        recargaTotal();

    });


    $('#mBtnDialogACCancel').unbind('click').bind('click', function () {

        $('#mDialogAC').popup("close");

    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //ENVIAR BD por email

    $('#btnEnviarDB').unbind('click').bind('click', function () {



        localStorage["pantalla"] = "enviarBD";
        //console.log("Estamos en la pantalla => "+localStorage["pantalla"]);
        //$.mobile.changePage('#enviarBD');



        $('#menuSistema').hide();
        $('#reportarIncidencia').hide();
        $('#enviarBD').show();



        exportDatabase();



    });



    $("#menuPrincipalPantalla").show();

    $("#mBtnHeaderBack").hide();




});




$(document).on('pageinit', '#menuPrincipal', function () {

    //Rutina para comprobar el estado de la conexi򬞍
    pSincronizar();
    restSecuritySettingsJSON();

    checkPermisosUsuario();
    console.log("BIENVENIDO AL MENU PRINCIPAL");

    $("#mUsuario").text(localStorage.getItem('usuario'));

    //var h = dateFormat(localStorage.getItem('ultimaCarga'),"d-mm-yyyy HH:MM");
    var d = new Date(parseInt(localStorage.getItem('ultimaCarga')));
    var h = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();

    pRefrescarNotificaciones();
    $("#mLbLastDataPrincipal").text("Última carga: " + localStorage["ultimaCarga"]);

    //$("#pedidosNotificacion").html('<span class="notificaciones_menu">2</span>');
    $("#recepcionNotificacion").hide();
    $("#devolucionNotificacion").hide();

    $("#expedicionNotificacion").hide();
    $("#inventarioNotificacion").hide();
    $("#mermasNotificacion").hide();
    $("#expedicionNotificacion").hide();

});

var currentTime;
var prog = 0;


/*
 *Autoajustar el grid a la pantalla ( No funciona)
 */
/*function resizeGrid()
{
       var gridElement = $("#pGridPedidos");
       var dataArea = gridElement.find(".k-grid-content");
       var newHeight = gridElement.parent().innerHeight() - 2;
       var diff = gridElement.innerHeight() - dataArea.innerHeight();
       gridElement.height(newHeight);
       dataArea.height(newHeight - diff); 
}*/




function initLocalStorage() {

}

function detectmob() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "cordova.js";
        document.body.appendChild(js);
        setTimeout(CheckResolutionMobile, 300);
        console.log("Es un Movil");;
        localStorage["dispositivo"] = "MOVIL";
    } else {
        setTimeout(CheckResolutionPc, 300);
        console.log("Es un Pc");;
        localStorage["dispositivo"] = "PC";
    }
}



function getAnchoCol(param) {

    var usuario = localStorage['multiplesZonasEntrega'];

    switch (param) {
    case "cod_pedid":
        if (usuario == "0") {
            return '10%';
        } else if (usuario == "1") {
            return '10%';
        }
        break;
    case "cod_centr":
        if (usuario == "0") {
            return '15%';
        } else if (usuario == "1") {
            return '15%';
        }
        break;
    case "cod_zona":
        if (usuario == "0") {
            return '0%';
        } else if (usuario == "1") {
            return '14%';
        }
        break;
    case "cod_proveedo":
        if (usuario == "0") {
            return '39%';
        } else if (usuario == "1") {
            return '30%';
        }
        break;
    case "fecha_emisio":
        if (usuario == "0") {
            return '20%';
        } else if (usuario == "1") {
            return '15%';
        }
        break;
    case "fecha_entreg":
        if (usuario == "0") {
            return '10%';
        } else if (usuario == "1") {
            return '10%';
        }
        break;
    case "estado_pedid":
        if (usuario == "0") {
            return '6%';
        } else if (usuario == "1") {
            return '6%';
        }
        break;
    }

}

function pComprobarEan(EAN) {

    db.transaction(function (transaction) {
        //comprobamos que el EAN existe en la BD
        var sql = "SELECT COUNT(*) as n FROM EANS as e WHERE idEAN='" + EAN + "' ";

        console.log("CONSULTA MOSTRAR PEDIDOS " + sql + " " + EAN);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                console.log("EANSSSSSSSS ENCONTRADOSSSSSSSS " + result.rows.item(0).n);

                if (result) { //EAN existe

                    var sql2 = "SELECT i.idVendor, i.idItem FROM EANS as e, relItems as i WHERE e.idItem=i.idItem AND idEAN='" + EAN + "' ";

                    console.log("CONSULTA MOSTRAR PEDIDOS " + sql2);

                    transaction.executeSql(sql2, undefined,
                        function (transaction, result2) {

                            if (result2.rows.length > 0) {
                                var rowDb = result2.rows.item(0);

                                console.log("VENDEDORRRRRRRRRRRRRRR " + rowDb.idVendor + " " + rowDb.idItem);

                                if (rowDb) {

                                    pMostrarDetalleArticulo(rowDb.idItem);

                                } else {
                                    console.log("NO HAY VENDEDOR CON ESE EAN " + rowDb.idVendor);
                                }
                            } else {
                                console.log("No encuenta el item " + sql2);
                            }
                        }, error);

                } else {
                    console.log("EAN que se ha introducido no existe");
                }
            }, error);

    });



}

/*function maximizar(){ 

window.moveTo(0,0);

window.resizeTo(screen.width,screen.height);


 var x = window.screen.availWidth;
 var y = window.screen.availHeight;
 window.moveTo(0,0);
 Window.Resizeto(x,y);
 self.blur();

}*/

function cargarLogin() {
    //Idioma del navegador para el login

    $("#LbVersionAppLogin").text(versionApp);
    var lang = navigator.language.toLowerCase();
    lang = lang.substring(0, 2);

    if (lang == "en" || lang == "EN") {
        localStorage.setItem('language', "EN");
    } else if (lang == "es" || lang == "ES") {
        localStorage.setItem('language', "ES");
    } else {
        lang = "es";
        localStorage.setItem('language', "ES");
    }

    //else localStorage.setItem('language',lang);
    console.log("Language BROWSER" + " " + localStorage.getItem('language'));


    var divUsername = document.getElementById("divUsername");
    var inUsername = document.createElement('input');
    inUsername.id = "user_txt";
    inUsername.name = 'User';
    inUsername.type = "text";

    inUsername.value = "";

    if (localStorage['usuario'] != undefined) {
        inUsername.value = localStorage['usuario'];
    }

    divUsername.appendChild(inUsername);

    var divPassword = document.getElementById("divPassword");
    var inPassword = document.createElement('input');
    inPassword.name = 'Password';
    inPassword.type = "password";
    inPassword.id = "pass_txt";
    //inPassword.value = "test";
    divPassword.appendChild(inPassword);
    if (localStorage['language'] == "EN") {
        document.getElementById('txtUsername').innerHTML = "Username";
        document.getElementById('txtPassword').innerHTML = "Password";
        document.getElementById('slogan').innerHTML = "Managing stock movements <br> from mobile devices";
    } else {
        document.getElementById('txtUsername').innerHTML = "Usuario";
        document.getElementById('txtPassword').innerHTML = "Contraseña";
        document.getElementById('slogan').innerHTML = "Gesti&oacute;n movimientos de stock<br/> desde dispositivos m&oacute;viles";
    }

}

function checkPermisosUsuario() {

    var sql = "SELECT action as permiso FROM security WHERE username='" + localStorage['usuario'] + "'";
    db.transaction(
        function (transaction) {
            transaction.executeSql(sql, undefined,
                function (transaction, result) {
                    for (var i = 0; i < result.rows.length; i++) {

                        switch (result.rows.item(i).permiso) {
                        case "READ_PURCHASE_CENTER":
                            READ_PURCHASE_CENTER = "1";
                            break;
                        case "READ_VENDOR":
                            READ_VENDOR = "1";
                            break;
                        case "READ_ITEM":
                            READ_ITEM = "1";
                            break;
                        case "READ_ORDER_STATUS":
                            READ_ORDER_STATUS = "1";
                            break;
                        case "READ_TEMPLATE":
                            READ_TEMPLATE = "1";
                            break;
                        case "DELETE_ORDER":
                            DELETE_ORDER = "1";
                            break;
                        case "DELETE_DRAFT":
                            DELETE_DRAFT = "1";
                            break;
                        case "DELETE_TEMPLATE":
                            DELETE_TEMPLATE = "1";
                            break;
                        case "UPDATE_TEMPLATE":
                            UPDATE_TEMPLATE = "1";
                            break;
                        default:
                            console.log("Permiso " + result.rows.item(i).permiso + " desconocido");
                        }
                    }
                }, error);
        });
}