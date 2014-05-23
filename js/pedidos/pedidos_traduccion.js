function getTraduccionPedidos() {

    var lang = localStorage['language'];

    console.log("TRADUCCIENDO !!!!!! a " + lang);

    if (lang == "ES") {
        console.log("ESPAÑOL");
        // STRINGS


        /////////////////////////////////////////////////////////////
        // LOGIN
        $('#login_username').text("Usuario");
        $('#login_password').text("Contraseña");
        $('#LbUltimaCargaProgress').text("Última Carga: ");
        $('.versionApp').text("Versión: " + versionApp);
        $('#slogan').text("Gestión de movimientos de stock \r\n desde dispositivos móviles");
        $("label[for='btnRemember'] span.ui-btn-text").text("Recordar");


        /////////////////////////////////////////////////////////////
        // GRID PEDIDOS
        $('#searchText').attr('placeholder', 'Filtrar elementos...');
        $('#pLbpedidosDetalleNuevoPrecio').text("Mostrar precios ");

        //////////////////////////////////////////////////////////////////
        //BOTONES DEL POPUP DE LOS FILTROS
        $('#pBtnPopUpAsc').html('<img src="./images/icno_ascendente.png">' + 'Sort in ascending order');
        $('#pBtnPopUpDesc').html('<img src="./images/icno_descendente.png">' + 'Sort in descending order');
        $('#LbPopUpFiltro').text("Filter");
        $('#tituloPopUpFiltro').text("Column options: ");
        $('#LbpPopUpFiltroFechaD').text("Date from: ");
        $('#LbpPopUpFiltroFechaH').text("Date to: ");
        $('#pBtnFiltrar').text("Acept");

        localStorage['num'] = "";
        localStorage['info'] = "";


        localStorage.setItem('num', 'Cod');
        localStorage.setItem('str_codigo', 'Código');
        localStorage.setItem('str_tipo_de_envio', 'Tipo de envío');
        localStorage.setItem('info', 'Cent. Compra');
        localStorage.setItem('pro', 'Proveedor / Almacén');
        localStorage.setItem('emi', 'Emisión');
        localStorage.setItem('ent', 'Entr.');
        localStorage.setItem('ima', 'Estado');
        localStorage.setItem('creacion', 'Creación');
        localStorage.setItem('str_opciones_de_columna', 'Opciones de columna:');
        localStorage.setItem('str_selecciona', 'Selecciona');
        localStorage.setItem('str_nombre', 'Nombre');
        localStorage.setItem('str_precios', 'Precios');

        /////////////////////////////////////////////////////////////
        // FILTROS GRID
        localStorage.setItem('fil', 'Filtro');
        localStorage.setItem('filtrar', 'Filtro');
        localStorage.setItem('limpiar', 'Limpiar');
        localStorage.setItem('cancelar', 'Cancelar');
        localStorage.setItem('aceptar', 'Aceptar');
        localStorage.setItem('comienza', 'Comienza por');
        localStorage.setItem('intervalo', 'Intervalo de fechas');


        /////////////////////////////////////////////////////////////
        // GRID PEDIDOS DETALLE			
        localStorage.setItem('cod', 'Cod.');
        localStorage.setItem('art', 'Descripción');
        localStorage.setItem('ref', 'Proveedor');
        localStorage.setItem('can', 'Cant.');
        localStorage.setItem('cad', 'Cad. Logística');
        localStorage.setItem('uni', 'Total');


        // GRID BORRADORES	
        localStorage.setItem('str_centro', 'Centro de Compra.');
        localStorage.setItem('str_proveedor', 'Proveedor');
        localStorage.setItem('str_fechayhora', 'Fecha y Hora');
        localStorage.setItem('str_usuario', 'Usuario');
        $('#pLbNuevoPedidoBorradorProveedor').text("Proveedor");
        $('#pLbNuevoPedidoBorradorCentro').text("Centro de Compra");
        $('#pLbNuevoPedidoBorradorValoracion').text("Valoración");
        $('#pLbNuevoPedidoBorradorFecha').text("Fecha");

        /////////////////////////////////////////////////////////////
        // MENU HEADER
        localStorage.setItem('seccion_title_emitidos', 'Pedidos Emitidos');
        localStorage.setItem('seccion_title_detalle', 'Detalle de Pedidos');
        localStorage.setItem('seccion_title_nuevo_centros', 'Nuevo Pedido');
        localStorage.setItem('seccion_title_nuevo_proveedores', 'Nuevo Pedido');
        localStorage.setItem('seccion_title_alta_pedidos', 'Alta de Pedido');
        localStorage.setItem('seccion_title_anterioresDetalle', 'Alta de Pedido');
        localStorage.setItem('seccion_title_pedidosDetalleNuevo', 'Detalle de Nuevo Pedido');
        localStorage.setItem('seccion_title_pedidosModificacionPlantilla', 'Modificación de Platilla');

        localStorage.setItem('seccion_title_nuevo_pedido_plantilla', 'Nuevo Pedido de plantilla');

        // GRID ARTICULOS
        localStorage.setItem('stk', 'Stock');
        localStorage.setItem('todos', 'TODOS');
        localStorage.setItem('ref_prov', 'Ref.');
        localStorage.setItem('uds', 'Uds.');
        localStorage.setItem('nom_art', 'Nombre Artículo');
        localStorage.setItem('totales', 'Tot.');

        /////////////////////////////////////////////////////////////
        // MENU PEDIDOS
        $('#pTbCabPedidoNum').text("Numero");
        $('#pTbCabPedidoCentroCompra').text("Centro compra");
        $('#pTbCabPedidoProveedor').text("Proveedor");
        $('#pTbCabPedidoEmision').text("Fecha Emision");
        $('#pTbCabPedidoEntrada').text("Fecha Recepción");

        /////////////////////////////////////////////////////////////
        // MENU PEDIDOS DETALLE
        $('#pLbDetalleNum').text("Numero");
        $('#pLbDetalleCentroCompra').text("Centro compra");
        $('#pLbDetalleProveedor').text("Proveedor");
        $('#pLbDetalleEmision').text("Fecha Emision");
        $('#pLbDetalleEntrega').text("Fecha Recepción");
        $('#pLbDetalleEstado').text("Estado");
        $('#pLbDetalleValoracion').text("Precio");
        $('#pLbDetalleObservaciones').text("Observaciones");


        $('#pTbCabDetalleNum').text("Num.");
        $('#pTbCabDetalleCod').text("Cod");
        $('#pTbCabDetalleArticulo').text("Articulo");
        $('#pTbCabDetalleCantidad').text("Can.");
        $('#pTbCabDetalleCadenaLogistica').text("Cad Logistica");
        $('#pTbCabDetalleUnidades').text("Un.");

        // NUEVO PEDIDO CENTROS DE VENTA
        $('#pLbNuevoCentrosCabecera').text("Centros de Compra Disponibles");
        $('#pLbNuevoPedidoCentro').text("> Nuevo Pedido");
        $('#pLbNuevoPedidoSelecioneCentro').text(" > Seleccione el centro...");

        // NUEVO PEDIDO PROVEEDORES DISPONIBLES
        $('#pBtnlproveedores').text("Proveedores autorizados");
        $('#pBtnlalmacenes').text("Almacenes autorizados");
        $('#pLbNuevoProveedoresDisponibles').text("Proveedores Disponibles");
        $('#pLbNuevoAlmacenesDisponibles').text("Almacenes Disponibles");
        $('#pBtnAnteriores').text("Pedidos Anteriores");
        $('#pBtnlMisPlantillas').text("Mis Plantillas");
        $('#pLbNuevoPedidoProveedor').text("> Nuevo Pedido");
        $('#pLbNuevoPedidoSelecioneProveedor').text(" > Seleccione el proveedor o almacén...");


        // MENU PEDIDOS DETALLE ANTERIOR
        $('#pLbDetalleNumAnt').text("Numero");
        $('#pLbDetalleCentroCompraAnt').text("Centro compra");
        $('#pLbDetalleProveedorAnt').text("Proveedor");
        $('#pLbDetalleEmisionAnt').text("Fecha Emision");
        $('#pLbDetalleEntregaAnt').text("Fecha Recepción");
        $('#pLbDetalleEstadoAnt').text("Estado");
        $('#pLbDetalleValoracionAnt').text("Precio");
        $('#pLbNuevoPedidoAnterior').text("> Nuevo Pedido");
        $('#pLbNuevoPedidoSelecioneAnterior').text(" > Alta en base a...");

        $('#pTbCabDetalleNumAnt').text("Num.");
        $('#pTbCabDetalleCodAnt').text("Cod");
        $('#pTbCabDetalleArticuloAnt').text("Articulo");
        $('#pTbCabDetalleCantidadAnt').text("Can.");
        $('#pTbCabDetalleCadenaLogisticaAnt').text("Cad Logistica");
        $('#pTbCabDetalleUnidadesAnt').text("Un.");

        // NUEVO PEDIDO DETALLE
        $('#pLbDetalleNuevoPedido').text("> New Order");


        // MENU ARTICULOS POR FAMILIA	
        $('#pLbArticulosFamilia1').text("ARTICULOS POR FAMILIA: ");
        $('#pLbArticulosFamilia2').text("TODOS");
        $('#pBtnLimpiarFiltroFamilias').text("Quitar Filtro");
        $('#pBtnFiltroFamilias').text("Filtro Por Niveles");
        $('#pLbFiltroPorFamiliasInsertar').text("Filtro por familias");
        localStorage.setItem('str_nivel1', 'Nivel 1: Todos');
        localStorage.setItem('str_nivel2', 'Nivel 2: Todos');
        localStorage.setItem('str_nivel3', 'Nivel 3: Todos');


        //MENU LATERAL
        $('#mpBtn1').text("Pedidos emitidos");
        $('#mpBtn2').text("Nuevo pedido");
        $('#mpBtn3').text("Borradores");
        $('#mpBtn4').text("Plantillas");

        $('#pBtnPedidosMenuInicio').text("Menú Principal");

        //NUEVO PEDIDO LISTA DE CENTRO Y PROVEEDOR
        $('#lbTituloCentrosDisponibles').text("Centros de Compra Disponibles");
        localStorage.setItem('pLbCentrosDisponibles', 'Centros autorizados');
        localStorage.setItem('pLbProveedoresDisponibles', 'Proveedores Disponibles');

        // DIALOG INSERTAR PEDIDO
        $('#LbRefProvInsertarPedido').text("Ref Prov.");
        $('#LbEANPrincipalInsertarPedido').text("EAN Principal");
        $('#LbStockMinInsertarPedido').text("Stock min.");
        $('#LbStockInsertarPedido').text("Stock");
        $('#LbUnidadesInsertarPedido').text("Unidades");
        $('#LbCadenaInsertarPedido').text("Cad. Logistica");
        $('#LbTotalesInsertarPedido').text("Totales");

        // MENU CABECERA DE PEDIDO
        $('#plbCentroCabecera').text("Centro");
        $('#plbProveedorCabecera').text("Proveedor");
        $('#plbZonaCabecera').text("Zona");
        $('#plbFechaEntregaCabecera').text("Fecha de Entrega");
        $('#plbEstadoPedidoCabecera').text("Estado");
        $('#plbFechaEmisionCabecera').text("Fecha de Emisión");
        $('#plbObservacionesCabecera').text("Observaciones");
        $('#plbValoracionFinalCabecera').text("Valoración Total");

        // MENU PEDIDO EN BASE A ESCANER
        localStorage.setItem('str_filtro', 'Filtro');

        // BOTONES FOOTER
        localStorage.setItem('footer_btn_cancelar', 'Cancelar');
        localStorage.setItem('footer_btn_eliminar', 'Eliminar');
        localStorage.setItem('footer_btn_pedido_base', 'Seleccionar como P. Base');
        localStorage.setItem('footer_btn_pedido_escaner', 'Pedido global en base a escaner');
        localStorage.setItem('footer_btn_nuevo_pedido', 'Nuevo Pedido por articulos');
        localStorage.setItem('footer_btn_guardar_borrador', 'Guardar Borrador');
        localStorage.setItem('footer_btn_guardar_plantilla', 'Guardar Plantilla');
        localStorage.setItem('footer_btn_insertar_articulo', 'Insertar Art.');
        localStorage.setItem('footer_btn_codigo_barras', 'Escaner');
        localStorage.setItem('footer_btn_finalizar', 'Finalizar');
        localStorage.setItem('footer_btn_finalizar_insercion', 'Finalizar Inserción');
        localStorage.setItem('footer_btn_quitar_filtro', 'Quitar Filtro');
        localStorage.setItem('footer_btn_aplicar_filtro', 'Aplicar Filtro');
        localStorage.setItem('footer_btn_resumen', 'Resumen');
        localStorage.setItem('footer_btn_enviar', 'Enviar');
        localStorage.setItem('footer_btn_modificar', 'Modificar');
        localStorage.setItem('footer_btn_nuevo_blanco', 'Nuevo (en blanco)');

        // NOTIFICACIONES DE PEDIDO
        $('#pNotificacionesTxtNinguna').text("No hay notificaciones");
        $('#pNotificacionesTxtPedidos').text("Pedidos pendientes de enviar");
        $('#pNotificacionesTxtBorradores').text("Borradores pendientes");
        $('#pNotificacionesTxtPlantillas').text("Plantillas pendientes de enviar");
        $('#pNotificacionesBtnCerrar').text("Cerrar");


        //////////////////////////////////////////////////////////////////
        //BOTONES DEL POPUP DE LOS FILTROS
        $('#pBtnPopUpAsc').html('<img src="./images/icno_ascendente.png">' + 'Orden ascendente');
        $('#pBtnPopUpDesc').html('<img src="./images/icno_descendente.png">' + 'Orden descendente');
        $('#LbPopUpFiltro').text("Filtro");
        $('#tituloPopUpFiltro').text(localStorage["str_opciones_de_columna"]);
        $('#LbpPopUpFiltroFechaD').text("Fecha desde: ");
        $('#LbpPopUpFiltroFechaH').text("Fecha hasta: ");
        $('#pBtnFiltrar').text("Aceptar");

        // POPUP DE GUARDAR PLANTILLA
        $('#pedidosPopUpTituloNombrePlantilla').text("Guardar plantilla ");
        $('#pedidosPopUpTextoNombrePlantilla').text("Nombre de la plantilla ");
        $('#pedidosPopUpNombrePlantillaCancel').text("Cancelar");
        $('#pedidosPopUpNombrePlantillaOk').text("Aceptar");

        // POPUP DE NOTIFICACIONES
        $('#pNotificacionesTitulo').text("Notificaciones");
        $('#pNotificacionesBtnCerrar').text("Cerrar");






    } else if (lang == "EN") {

        console.log("INGLES");
        /////////////////////////////////////////////////////////////
        // LOGIN
        $('#login_username').text("Username");
        $('#login_password').text("Password");
        $('#loginRemenber').text("Remenber");
        $('#LbUltimaCargaProgress').text("Last Load: ");
        $('.versionApp').text("Build: " + versionApp);
        $('#slogan').text("Managing stock movements from mobile devices");

        $("label[for='btnRemember'] span.ui-btn-text").text("Remenber");

        //$('a#btnLogin').html('Login');

        /////////////////////////////////////////////////////////////
        // GRID PEDIDOS
        $('#searchText').attr('placeholder', 'Filter items...');
        $('#pLbpedidosDetalleNuevoPrecio').text("Show prices ");


        localStorage['num'] = "";
        localStorage['info'] = "";
        localStorage.setItem('str_codigo', 'Code');
        localStorage.setItem('str_tipo_de_envio', 'Shipping Type');

        localStorage['num'] = 'Id';
        localStorage['info'] = 'Stock center';
        localStorage.setItem('pro', 'Vendors / Warehouse');
        localStorage.setItem('emi', 'Issue date');
        localStorage.setItem('ent', 'Deli. date');
        localStorage.setItem('ima', 'Status');
        localStorage.setItem('str_opciones_de_columna', 'Column options:');
        localStorage.setItem('str_selecciona', 'Select');
        localStorage.setItem('str_nombre', 'Name');
        localStorage.setItem('str_precios', 'Price');

        /////////////////////////////////////////////////////////////
        // FILTROS GRID						
        localStorage['fil'] = 'Filter';
        localStorage['filtrar'] = 'Filter';
        localStorage.setItem('limpiar', 'Clear');
        localStorage.setItem('cancelar', 'Cancel');
        localStorage.setItem('aceptar', 'Accept');
        localStorage.setItem('comienza', 'Start with');
        localStorage.setItem('intervalo', 'Date Range');


        /////////////////////////////////////////////////////////////
        // GRID PEDIDOS DETALLE
        localStorage.setItem('cod', 'Id');
        localStorage.setItem('des', 'Name');
        localStorage.setItem('art', 'Description');
        localStorage.setItem('ref', 'Vendors');
        localStorage.setItem('can', 'Quant.');
        localStorage.setItem('cad', 'UOM/Log. Ch.');
        localStorage.setItem('uni', 'Total Units');

        /////////////////////////////////////////////////////////////
        // GRID PLANTILLAS	
        localStorage.setItem('nomPlan', "Name");


        /////////////////////////////////////////////////////////////
        // MENU PEDIDOS
        $('#pTbCabPedidoNum').text("Number");
        $('#pTbCabPedidoCentroCompra').text("Purchase Center");
        $('#pTbCabPedidoProveedor').text("Vendor");
        $('#pTbCabPedidoEmision').text("Issue date");
        $('#pTbCabPedidoEntrada').text("Delivery date");

        /////////////////////////////////////////////////////////////
        // MENU PEDIDOS DETALLE
        $('#pLbDetalleNum').text("Id");
        $('#pLbDetalleCentroCompra').text("Purchase Center");
        $('#pLbDetalleProveedor').text("Vendor");
        $('#pLbDetalleEmision').text("Issue date");
        $('#pLbDetalleEntrega').text("Delivery date");
        $('#pLbDetalleEstado').text("Entering");
        $('#pLbDetalleValoracion').text("Price");
        $('#pLbDetalleObservaciones').text("Remarks");


        $('#pTbCabDetalleNum').text("Id");
        $('#pTbCabDetalleCod').text("Id");
        $('#pTbCabDetalleArticulo').text("Article");
        $('#pTbCabDetalleCantidad').text("Quantity");
        $('#pTbCabDetalleCadenaLogistica').text("UOM/Log. Ch.");
        $('#pTbCabDetalleUnidades').text("Units");

        // NUEVO PEDIDO CENTROS DE VENTA
        $('#pLbNuevoCentrosCabecera').text("Available Centers");
        $('#pLbNuevoPedidoCentro').text("> New order");
        $('#pLbNuevoPedidoSelecioneCentro').text(" > Select a purchase center..");

        // NUEVO PEDIDO PROVEEDORES DISPONIBLES
        $('#pBtnlproveedores').text("Authorized Vendors");
        $('#pBtnlalmacenes').text("Authorized Warehouses");
        $('#pLbNuevoProveedoresDisponibles').text("Available Providers");
        $('#pLbNuevoAlmacenesDisponibles').text("Available Warehouses");
        $('#pBtnAnteriores').text("Previous orders");
        $('#pBtnlMisPlantillas').text("Templates");
        $('#pLbNuevoPedidoProveedor').text(" > New Order");
        $('#pLbNuevoPedidoSelecioneProveedor').text(" > Select your supplier or warehouse...");




        // MENU PEDIDOS DETALLE ANTERIOR
        $('#pLbDetalleNumAnt').text("Number");
        $('#pLbDetalleCentroCompraAnt').text("Purchase Center");
        $('#pLbDetalleProveedorAnt').text("Vendor");
        $('#pLbDetalleEmisionAnt').text("Issue date");
        $('#pLbDetalleEntregaAnt').text("Delivery date");
        $('#pLbDetalleEstadoAnt').text("Entering");
        $('#pLbDetalleValoracionAnt').text("Price");
        $('#pLbNuevoPedidoAnterior').text("> New Order");
        $('#pLbNuevoPedidoSelecioneAnterior').text(" > Based on...");


        $('#pTbCabDetalleNumAnt').text("Id");
        $('#pTbCabDetalleCodAnt').text("Id");
        $('#pTbCabDetalleArticuloAnt').text("Article");
        $('#pTbCabDetalleCantidadAnt').text("Quantity");
        $('#pTbCabDetalleCadenaLogisticaAnt').text("UOM/Log. Ch.");
        $('#pTbCabDetalleUnidadesAnt').text("Units");



        // NUEVO PEDIDO DETALLE
        $('#pLbDetalleNuevoPedido').text("> New Order");

        // MENU ARTICULOS POR FAMILIA	
        $('#pLbArticulosFamilia1').text("ITEMS BY FAMILY: ");
        $('#pLbArticulosFamilia2').text("ALL");
        $('#pBtnLimpiarFiltroFamilias').text("Remove Filter");
        $('#pBtnFiltroFamilias').text("Filter by Levels");
        $('#pLbFiltroPorFamiliasInsertar').text("Filter by family");
        localStorage.setItem('str_nivel1', 'Level 1: All');
        localStorage.setItem('str_nivel2', 'Level 2: All');
        localStorage.setItem('str_nivel3', 'Level 3: All');

        //MENU LATERAL
        $('#mpBtn1').text("Emited Orders");
        $('#mpBtn2').text("New Order");
        $('#mpBtn3').text("Drafts");
        $('#mpBtn4').text("Templates");

        $('#pBtnPedidosMenuInicio').text("Orders Menu");

        //NUEVO PEDIDO LISTA DE CENTRO Y PROVEEDOR
        $('#lbTituloCentrosDisponibles').text("Purchase Centers Available");
        localStorage.setItem('pLbCentrosDisponibles', 'Centers Available');
        localStorage.setItem('pLbProveedoresDisponibles', 'Available Vendors');

        // DIALOG INSERTAR PEDIDO
        $('#LbRefProvInsertarPedido').text("Vendor Ref.");
        $('#LbEANPrincipalInsertarPedido').text("Main UPC Code");
        $('#LbStockMinInsertarPedido').text("Min. Stock");
        $('#LbStockInsertarPedido').text("Stock");
        $('#LbUnidadesInsertarPedido').text("Units");
        $('#LbCadenaInsertarPedido').text("Logistic Chain");
        $('#LbTotalesInsertarPedido').text("Total");

        // MENU CABECERA DE PEDIDO
        $('#plbCentroCabecera').text("Center");
        $('#plbProveedorCabecera').text("Vendor");
        $('#plbZonaCabecera').text("Zone");
        $('#plbFechaEntregaCabecera').text("Issue date");
        $('#plbEstadoPedidoCabecera').text("Status");
        $('#plbFechaEmisionCabecera').text("Delivery date");
        $('#plbObservacionesCabecera').text("Remarks");
        $('#plbValoracionFinalCabecera').text("Total Amount");

        // BOTONES FOOTER
        localStorage.setItem('footer_btn_cancelar', 'Cancel');
        localStorage.setItem('footer_btn_eliminar', 'Delete');
        localStorage.setItem('footer_btn_pedido_base', 'Select as Base');
        localStorage.setItem('footer_btn_pedido_escaner', 'Global order based on scanner');
        localStorage.setItem('footer_btn_nuevo_pedido', 'New Order by Items');
        localStorage.setItem('footer_btn_guardar_borrador', 'Save Draft');
        localStorage.setItem('footer_btn_guardar_plantilla', 'Save template');
        localStorage.setItem('footer_btn_insertar_articulo', 'Add Item');
        localStorage.setItem('footer_btn_codigo_barras', 'Barcode');
        localStorage.setItem('footer_btn_finalizar', 'Finish');
        localStorage.setItem('footer_btn_finalizar_insercion', 'Finish Insert ');
        localStorage.setItem('footer_btn_quitar_filtro', 'Remove Filter');
        localStorage.setItem('footer_btn_aplicar_filtro', 'Apply Filter');
        localStorage.setItem('footer_btn_resumen', 'Summary');
        localStorage.setItem('footer_btn_enviar', 'Send');
        localStorage.setItem('footer_btn_modificar', 'Modify');
        localStorage.setItem('footer_btn_nuevo_blanco', 'New (blank)');



        /////////////////////////////////////////////////////////////
        // MENU HEADER
        localStorage.setItem('seccion_title_emitidos', 'Orders');
        localStorage.setItem('seccion_title_detalle', 'Order Detail');
        localStorage.setItem('seccion_title_nuevo_centros', 'New Order');
        localStorage.setItem('seccion_title_nuevo_proveedores', 'New Order');
        localStorage.setItem('seccion_title_alta_pedidos', 'New Order');
        localStorage.setItem('seccion_title_anterioresDetalle', 'New Order ');
        localStorage.setItem('seccion_title_pedidosDetalleNuevo', 'New Order');
        localStorage.setItem('seccion_title_pedidosModificacionPlantilla', 'Modify Template');

        localStorage.setItem('seccion_title_nuevo_pedido_plantilla', 'New Order from Template');

        // GRID ARTICULOS
        localStorage.setItem('stk', 'Stock');
        localStorage.setItem('todos', 'ALL');
        localStorage.setItem('ref_prov', 'Vendor Ref.');
        localStorage.setItem('uds', 'Uds.');
        localStorage.setItem('nom_art', 'Item Name');
        localStorage.setItem('totales', 'Totals');

        // GRID BORRADORES
        localStorage.setItem('str_centro', 'Purchase Center');
        localStorage.setItem('str_proveedor', 'Vendor');
        localStorage.setItem('str_fechayhora', 'Date and Time');
        localStorage.setItem('str_usuario', 'Username');
        $('#pLbNuevoPedidoBorradorProveedor').text("Vendor");
        $('#pLbNuevoPedidoBorradorCentro').text("Stock center");
        $('#pLbNuevoPedidoBorradorValoracion').text("Total Amount");
        $('#pLbNuevoPedidoBorradorFecha').text("Date/Time");


        // MENU PEDIDO EN BASE A ESCANER
        localStorage.setItem('str_filtro', 'Filter');

        //MENU LATERAL
        $('#mpBtn1').text("Show orders");
        $('#mpBtn2').text("New order");
        $('#mpBtn3').text("Draft");
        $('#mpBtn4').text("Templates");

        $('#pBtnPedidosMenuInicio').text("Main Menu");
        $('#mpBtnTitulo').text("Orders Menu");

        //////////////////////////////////////////////////////////////////
        //BOTONES DEL POPUP DE LOS FILTROS
        $('#pBtnPopUpAsc').text("Sort ascending");
        $('#pBtnPopUpDesc').text("Sort descending");
        $('#LbPopUpFiltro').text("Filter");
        $('#tituloPopUpFiltro').text("Column opcions: ");
        $('#LbpPopUpFiltroFechaD').text("Date from: ");
        $('#LbpPopUpFiltroFechaH').text("Date until: ");
        $('#pBtnFiltrar').text("Accept");

        localStorage.setItem('creacion', 'Date');


        // NOTIFICACIONES DE PEDIDO
        $('#pNotificacionesTxtNinguna').text("No pending Notifications");
        $('#pNotificacionesTxtPedidos').text("Orders pending to send");
        $('#pNotificacionesTxtBorradores').text("Pending Draft");
        $('#pNotificacionesTxtPlantillas').text("Templates pending to send");
        $('#pNotificacionesBtnCerrar').text("Cerrar");

        // POPUP DE GUARDAR PLANTILLA
        $('#pedidosPopUpTituloNombrePlantilla').text("Save Template ");
        $('#pedidosPopUpTextoNombrePlantilla').text("Template name ");
        $('#pedidosPopUpNombrePlantillaCancel').text("Cancel");
        $('#pedidosPopUpNombrePlantillaOk').text("Accept");

        // POPUP DE NOTIFICACIONES
        $('#pNotificacionesTitulo').text("Notifications");
        $('#pNotificacionesBtnCerrar').text("Close");

    } else {
        console.log("PEDIDOS GENERAL Idioma no definido");
    }

    console.log("XXXXXXXXXXXXXXXXXX INFO--->" + localStorage['info']);

}


function getPedidosAyuda(pantalla) {

    var lang = localStorage['language'];

    if (lang == "ES") {
        if (pantalla == "emitidos") {
            $('#LbTituloAyuda').text("Ayuda Pedidos Emitidos");
            $('#pLabTituloAyuda').text("Titulo Ayuda Pedidos Emitidos");
            $('#pLabTextoAyuda').text("EMITIDOS: asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidosDetalle") {
            $('#LbTituloAyuda').text("Ayuda Pedidos Emitidos Detalle");
            $('#pLabTituloAyuda').text("Titulo Ayuda Pedidos Detalle");
            $('#pLabTextoAyuda').text("DETALLE : asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "nuevo_pedido") {
            $('#LbTituloAyuda').text("Ayuda Nuevo Pedido");
            $('#pLabTituloAyuda').text("Titulo Ayuda Nuevo Pedido");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidosBorradores") {
            borradoresDetalle
            $('#LbTituloAyuda').text("Ayuda Borradores");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "borradoresDetalle") {
            $('#LbTituloAyuda').text("Ayuda Borradores Detalle");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores Detalle");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidoNuevoAnteriores") {
            $('#LbTituloAyuda').text("Ayuda Pedido Nuevo Anteriores");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores Detalle");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidos_plantillas") {
            $('#LbTituloAyuda').text("Ayuda Plantillas");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "nuevo_proveedores") {
            $('#LbTituloAyuda').text("Ayuda de Proveedores");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidos_plantillas_detalle") {
            $('#LbTituloAyuda').text("Ayuda Plantillas Detalle");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "ayudaPrincipal") {
            $('#mLbTituloAyuda').text("Pantalla Ayuda menú principal");
            $('#mLabTituloAyuda').text("Bienvenidos a MAMBO!");
            $('#mLabTextoAyuda').html("<p>MAMBO Stock (Mobile Areas Management Back Office) es la aplicación de soporte al circuito de reaprovisionamiento de mercancía en el centro, pensada para ser utilizada desde dispositivos móviles con el objetivo de realizar las tareas necesarias en el sistema in situ, sin necesidad de desplazarse al despacho y minimizando el uso del papel.</p>" + "<p>Con MAMBO Stock se pueden realizar las tareas de pedidos, recepciones, devoluciones, expediciones, mermas e inventario.</p>" + "<p>Aunque la aplicación está diseñada en modo WEB, conectada a los sistemas centrales mediante conexiones inalámbricas WIFI o 3G, utiliza una base de datos local    que permite trabajar en modo offline para poder realizar las tareas en entonos sin buena cobertura como almacenes, neveras,…etc. Los datos generados se enviarán a posteriori cuando las condiciones de cobertura lo permitan.</p>" + "<p>Por este motivo, se ha incorporado un sistema de notificaciones que informa de aquellos datos que no han sido enviados aun a los sistemas centrales. Es                                                                           importante estar atento a las notificaciones para garantizar que todas las tareas realizadas han sido tratadas correctamente.</p>" + "<p>Todas las pantallas de la aplicación incorporan su correspondiente documento de ayuda. Para cualquier incidencia o duda adicional puede utilizar la opción de alta de incidencia que encontrará en el menú sistema.</p>");

        } else {
            $('#LbTituloAyuda').text("Ayuda No definida");
            $('#pLabTituloAyuda').text("Titulo Ayuda No definido");
            $('#pLabTextoAyuda').text("NO DEFINIDO : asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        }

    } else if (lang == "EN") {
        if (pantalla == "emitidos") {
            $('#LbTituloAyuda').text("Help Orders");
            $('#pLabTituloAyuda').text("Title Help Orders");
            $('#pLabTextoAyuda').text("EMITIDOS (English) : asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidosDetalle") {
            $('#LbTituloAyuda').text("Help Order Detail");
            $('#pLabTituloAyuda').text("Title Help  Order Detail");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "nuevo_pedido") {
            $('#LbTituloAyuda').text("Help New Order");
            $('#pLabTituloAyuda').text("Title Help New Order");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidosBorradores") {
            $('#LbTituloAyuda').text("Help Draft");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "borradoresDetalle") {
            pedidoNuevoAnteriores
            $('#LbTituloAyuda').text("Help Detail Draft");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores Detalle");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidoNuevoAnteriores") {
            $('#LbTituloAyuda').text("Help New Order Anteriores");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores Detalle");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidos_plantillas") {
            $('#LbTituloAyuda').text("Help Templates");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "nuevo_proveedores") {
            $('#LbTituloAyuda').text("Help Providers");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "pedidos_plantillas_detalle") {
            $('#LbTituloAyuda').text("Help Detail Templates");
            $('#pLabTituloAyuda').text("Titulo Ayuda Borradores");
            $('#pLabTextoAyuda').text("DETALLE (English): asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        } else if (pantalla == "ayudaPrincipal") {
            $('#LbTituloAyuda').text("Main menu help screen");
            $('#mLabTituloAyuda').text("Welcome to Mambo!");
            $('#mLabTextoAyuda').html("<p>MAMBO Stock (Mobile Areas Management Back Office) is the application designed to manage the goods and merchandise replenishment circuit in the centers. This application has been created to be used on mobile devices in order to perform back office tasks on site, so that the user does not have to work in an office, as well as minimizing the use of paper.</p>" + "<p>MAMBO Stock allows you to enter purchase orders, deliveries, returns, transfers, wastes and inventory counts.</p>" + "<p>Although the application is web based  and it is connected with the core systems and central database through wireless connections (WiFi/4G), it also has a local database that allows you to work offline in order to perform any task in environments without  a good quality wireless signal, such as freezers, warehouses, basements, etc. In these cases, the data generated will be sent afterwards when the wifi coverage conditions allow.</p>" + "<p>For this reason, a notifications tool has been implemented. This tool warns the user about the data that has not been sent to the core systems and therefore has not been saved in the central database. It is important to pay special attention to the notifications in order to guarantee that all the tasks performed have been properly processed.</p>" + "<p>Every application screen has its own help documentation. In case of any issue or additional doubts you can use the “New ticket” option that you will find in the general system menu.</p>");

        } else {
            $('#LbTituloAyuda').text("Help Undifined");
            $('#pLabTituloAyuda').text("Tittle Help  No definido");
            $('#pLabTextoAyuda').text("NO DEFINIDO (English) : asdfjl aslkdjfas lskjdfsldkf. kalsjdkfajsdlfk. klsjdflkasjd flllksdfjl");

        }
    } else {
        console.log("PEDIDOS AYUDA Idioma no definido");
    }
}

function getPedidosTitulo() {

    var lang = localStorage['language'];
    var pantalla = localStorage['pantalla'];
    
    if (lang == "ES") {

        if (pantalla == "emitidos") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Pedidos Emitidos");
        } else if (pantalla == "pedidosDetalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Detalle de pedido");
            localStorage["pantalla_anterior"] = "pedidosDetalle";
        } else if (pantalla == "pedidoNuevoPlantillas") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Nuevo Pedido de Plantilla");
        } else if (pantalla == "alta_pedidos_plantillas_detalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Nuevo Pedido: Detalle plantilla");

        } else if (pantalla == "pedidos_plantillas") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Plantillas");
        } else if (pantalla == "pedidos_plantillas_detalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Detalle de plantilla");
            localStorage["pantalla_anterior"] = "pedidos_plantillas_detalle";
        } else if (pantalla == "nuevo_pedido" || pantalla == "nuevo_proveedores" || pantalla == "alta_pedidos" || pantalla == "pedidosDetalleAnterior" || pantalla == "pedidosDetalleNuevo") {

            if (localStorage["pantalla_anterior"] == "pedidos_plantillas_detalle")
            {
                $("#seccion_title").text("Modificar Plantillas");
                $("#seccion_title").val("plantilla");
            }
            else if (localStorage["pantalla_anterior"] == "borradoresDetalle")
            {
                $("#seccion_title").val("");
                $("#seccion_title").text("Modificar Borrador");
            }
            else
            {
                $("#seccion_title").val("");
                $("#seccion_title").text("Nuevo Pedido");
            }
        } else if (pantalla == "insertarArticulos") {
            $("#seccion_title").text("Insertar Articulo");
        } else if (pantalla == "pFiltroFamilias") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Filtro Por Familias");
        } else if (pantalla == "pedidos_cabecera") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Cabecera de Pedido");
        } else if (pantalla == "pedidosBorradores") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Borradores");
        } else if (pantalla == "borradoresDetalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Detalle del Borrador");
            localStorage["pantalla_anterior"] = "borradoresDetalle";
        } else if (pantalla == "pedidosDetalleNuevoEscaner") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Pedido Global");
            localStorage["pantalla_anterior"] = "nuevo_proveedores";
        } else {

        }
    } else if (lang == "EN") {
        if (pantalla == "emitidos") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Orders");
        } else if (pantalla == "pedidosDetalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Order Detail");
            localStorage["pantalla_anterior"] = "pedidosDetalle";
        } else if (pantalla == "pedidoNuevoPlantillas") {
            $("#seccion_title").val("");
            $("#seccion_title").text("New Order from Template");
        } else if (pantalla == "pedidos_plantillas") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Templates");
        } else if (pantalla == "pedidos_plantillas_detalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Template Detail");
            localStorage["pantalla_anterior"] = "pedidos_plantillas_detalle";
        } else if (pantalla == "alta_pedidos_plantillas_detalle") {
            $("#seccion_title").text("New Order: Template detail");
        } else if (pantalla == "nuevo_pedido" || pantalla == "nuevo_proveedores" || pantalla == "alta_pedidos" || pantalla == "pedidosDetalleAnterior" || pantalla == "pedidosDetalleNuevo") {
            $("#seccion_title").val("");
            if (localStorage["pantalla_anterior"] == "pedidos_plantillas_detalle")
            {
                $("#seccion_title").text("Modify Template");
                $("#seccion_title").val("plantilla");
            }
            else if (localStorage["pantalla_anterior"] == "borradoresDetalle")
            {
                $("#seccion_title").text("Modify Draft");
            }
            else
                $("#seccion_title").text("New order");
        } else if (pantalla == "insertarArticulos") {
            $("#seccion_title").text("Insert Article");
        } else if (pantalla == "pFiltroFamilias") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Filter by Family");
        } else if (pantalla == "pedidos_cabecera") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Order Header");
        } else if (pantalla == "pedidosBorradores") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Drafts");
        } else if (pantalla == "borradoresDetalle") {
            $("#seccion_title").val("");
            $("#seccion_title").text("Draft Detail");
            localStorage["pantalla_anterior"] = "borradoresDetalle";
        } else if (pantalla == "pedidosDetalleNuevoEscaner") {
            $("#seccion_title").val("");
            $("#seccion_title").text("GLobal Order");
            localStorage["pantalla_anterior"] = "nuevo_proveedores";
        } else {

        }
    } else {
        console.log("PEDIDOS TITULOS Idioma no definido");
    }

}