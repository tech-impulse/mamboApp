function traducir() {

    getTraduccionMenuPrincipal();

    getTraduccionPedidos();

}

// Funcion que traduce los dialogos de la aplicación
// CODIGO loginOfflinePregunta: DIALOGOS ACEPTAR/CANCELAR
function getDescripcionAviso(codigo, accion) {
	
    var lang = localStorage['language'];
    document.getElementById('btnPedidosDialogOkAC').style.visibility="visible";

    console.log("IDIOMA EN DESCRIPCIÓN AVISO ==>" + lang);

    if (lang == "ES") {

        switch (codigo) {
        case "loginOfflinePregunta":
            document.getElementById('loginDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('loginDialogTextAC').innerHTML = "¿Desea continuar sin actualizar la base de datos?";
            $("#div_pass").hide();
            document.getElementById('btnloginDialogOkAC').innerHTML = "Si";
            document.getElementById('btnloginDialogCancelAC').innerHTML = "No";
            document.getElementById("loginDialogIconoAC").src = "images/amarillo.png";
            break;
        case "cancelarPedido":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>¿Desea cancelar el Pedido actual?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Aceptar";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cancelar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            if (accion != null)
                document.getElementById("pedidosDialogACOrden").innerHTML = accion;
            else
                document.getElementById("pedidosDialogACOrden").innerHTML = "";

            break;
        case "SinArticulos":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "No hay artículos para este pedido";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "NoSePuedeRecargar":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "No se puede recargar sin conexión";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "NavegadorNoSoportado":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Navegador no soportado";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "CredencialesErroneas":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Credecenciales no válidas";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;         
        case "errorEAN":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>El EAN que ha seleccionado no existe</center>";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "NoSePuedeRecargarNoInternet":
            document.getElementById('mDialogATitulo').innerHTML = "Aviso";
            document.getElementById('mDialogAText').innerHTML = "No se puede recargar sin conexión";

            document.getElementById('mDialogAOk').innerHTML = "Aceptar";

            break;

        case "NuncaCargado":
            document.getElementById('cargaDialogATitulo').innerHTML = "Aviso";
            document.getElementById('cargaDialogAText').innerHTML = "No hay BD para este usuario. Vuelva a logarse";

            document.getElementById('btnCargaDialogAOk').innerHTML = "Aceptar";

            break;

		case "proveedorManual":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>No se pueden seleccionar artículos del proveedor "+localStorage["proveedor_seleccionado"]+" ya que solo pèrmite el envío de pedidos de forma manual</center>";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "errorSinConexion":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "No es posible recargar los datos sin conexióna";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cerrar";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;        
        case "loginOfflineNoData":
            document.getElementById('loginDialogTituloA').innerHTML = "Información";
            document.getElementById('loginDialogTextA').innerHTML = "Para iniciar la aplicación debes estar conectado";
            document.getElementById('btnloginDialogOkA').innerHTML = "Aceptar";
            document.getElementById("loginDialogIconoA").src = "images/verde.png";
            break;
        case "loginSinCredenciales":
            document.getElementById('loginDialogTituloA').innerHTML = "Información";
            document.getElementById('loginDialogTextA').innerHTML = "Debes introducir tus credenciales";
            document.getElementById('btnloginDialogOkA').innerHTML = "Aceptar";
            document.getElementById("loginDialogIconoA").src = "images/verde.png";
            break;
        case "loginIncorrecto":
            document.getElementById('loginDialogTituloA').innerHTML = "Error";
            document.getElementById('loginDialogTextA').innerHTML = "El Usuario y/o Password es incorrecto";
            document.getElementById('btnloginDialogOkA').innerHTML = "Aceptar";
            document.getElementById("loginDialogIconoA").src = "images/rojo.png";
            break;
        case "loginOfflineUserError":
            document.getElementById('loginDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('loginDialogTextAC').innerHTML = "Solo el usuario " + localStorage.getItem('ultimo_usuario') + " puede entrar en la aplicación sin conexión al servidor";
            $("#div_pass").show();
            document.getElementById('btnloginDialogOkAC').innerHTML = "Aceptar";
            document.getElementById('btnloginDialogCancelAC').innerHTML = "Cancelar";
            document.getElementById("loginDialogIconoAC").src = "images/amarillo.png";
            break;
        case "loginOnline":
            document.getElementById('loginDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('loginDialogTextAC').innerHTML = "¿Desea actualizar la base de datos?";
            $("#div_pass").hide();
            document.getElementById('btnloginDialogOkAC').innerHTML = "No";
            document.getElementById('btnloginDialogCancelAC').innerHTML = "Si";
            document.getElementById("loginDialogIconoAC").src = "images/amarillo.png";
            break;
        case "menuNoDisponible":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Información";
            document.getElementById('pedidosDialogTextA').innerHTML = "Menú temporalmente no disponible";
            document.getElementById('btnPedidosDialogA').innerHTML = "Aceptar";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";

            break;
        case "filtroFamiliaNoSeleccionado":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>¿Continuar sin filtrar?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "";
            break;
        case "articuloSeleccionado":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Información";
            document.getElementById('pedidosDialogTextA').innerHTML = "Este Articulo ya ha sido seleccionado";
            document.getElementById('btnPedidosDialogA').innerHTML = "Aceptar";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "seleccionarFecha":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Información";
            document.getElementById('pedidosDialogTextA').innerHTML = "Para poder continuar debes seleccionar una fecha";
            document.getElementById('btnPedidosDialogA').innerHTML = "Aceptar";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;
        case "seleccionarZona":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Información";
            document.getElementById('pedidosDialogTextA').innerHTML = "Para poder continuar debes seleccionar una Zona";
            document.getElementById('btnPedidosDialogA').innerHTML = "Aceptar";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "pedidoVacio":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Información";
            document.getElementById('pedidosDialogTextA').innerHTML = "El pedido está vacío";
            document.getElementById('btnPedidosDialogA').innerHTML = "Aceptar";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "refrescar":
            document.getElementById('pedidosDialogTituloRefrescar').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextRefrescar').innerHTML = "¿Está seguro que quiere actualizar la página?";
            document.getElementById('btnPedidosDialogRefrescarOk').innerHTML = "Aceptar";
            document.getElementById('btnPedidosDialogRefrescarCancel').innerHTML = "Cancelar";
            document.getElementById("pedidosDialogIconoRefrescar").src = "images/amarillo.png";
            break;

        case "insertarArticulo":
            document.getElementById('btnInsertarPedidoCancelar').innerHTML = "Cancelar";
            document.getElementById('btnInsertarPedidoOk').innerHTML = "Aceptar";
            document.getElementById('pedidosDialogInsertarOrden').innerHTML = "Insertar";
			$('#InUnidadesInsertarPedido').val("1");
            break;

        case "modificarArticulo":
            document.getElementById('btnInsertarPedidoCancelar').innerHTML = "Cancelar";
            document.getElementById('btnInsertarPedidoOk').innerHTML = "Guardar";
            document.getElementById('pedidosDialogInsertarOrden').innerHTML = "Modificar";
            break;

        case "accionNoDisponible":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Información";
            document.getElementById('pedidosDialogTextA').innerHTML = "Accion temporalmente no disponible";
            document.getElementById('btnPedidosDialogA').innerHTML = "Aceptar";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "recargarBaseDeDatos":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>¿Desea actualizar la base de datos?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "actualizar";
            break;

        case "pedidoGLobalEscaner":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Información";
            document.getElementById('pedidosDialogTextAC').innerHTML = "El pedido en base a escaner genera pedidos en borrador para los distintos proveedores de los artículos seleccionados. <br> <br> Una vez finalizada la seleccion de artículos mediante escaner, debería ir a la pantalla de borradores para informar los datos de cabecera y finalizar los pedidos que ha generado el sistema";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Empezar";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cancelar";
            document.getElementById("pedidosDialogIconoAC").src = "images/verde.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "pMostrarDetalleEscaner";
            break;

        case "pedidoEscaner":
            //document.getElementById('LbTituloDialogEscaner').innerHTML = "Selección de artículos por escaner";
            document.getElementById('LbDetalleNuevoArticulo').innerHTML = "Escanee el código de barras del artículo";
            document.getElementById("btnpDialogInsertEanok").innerHTML = "Finalizar";
            break;

        case "borradoresGuardados":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Información";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Una vez generados los borradores, deberá informar cada borrador con los datos de cabecera para finalizar y emitir los pedidos. ¿Desea generar ahora los borradores?";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Aceptar";
			document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cancelar";
            document.getElementById("pedidosDialogIconoAC").src = "images/verde.png";
			document.getElementById("pedidosDialogACOrden").innerHTML = "borradoresGuardados";
            break;

        case "existenBorradores":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Información";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Existen otros borradores generados previamente en base a escáner. ¿Desea añadir los nuevos artículos a estos borradores?";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/verde.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "existenBorradores";
            break;
            
        case "guardarBorrador":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "¿Esta seguro de que desea guardar el pedido como borrador?";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogACOrden").innerHTML = "guardarBorrador";
            break;

        case "eliminarBorrador":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>¿Desea eliminar el borrador actual?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "eliminarBorrador";
            break;

        case "eliminarPedido":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>¿Desea eliminar el pedido actual?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "eliminarPedido";
            break;
		case "actualizarArticulo":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Aviso";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>Artículo ya seleccionado anteriormente. ¿Desea modificar la cantidad introducida?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Si";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "actualizarArticulo";
            break;
		case "refrescarPrincipal":
            document.getElementById('mDialogACTitulo').innerHTML = "Aviso";
            document.getElementById('mDialogACTexto').innerHTML = "¿Está seguro que quiere actualizar la página?";
            document.getElementById('mBtnDialogACOk').innerHTML = "Aceptar";
            document.getElementById('mBtnDialogACCancel').innerHTML = "Cancelar";
            document.getElementById("pedidosDialogIconoRefrescar").src = "images/amarillo.png";
            break;        default:
            return "Texto Dialogo";
        }

    } else if (lang == "EN") {

        switch (codigo) {
        case "loginOfflinePregunta":
            document.getElementById('loginDialogTituloAC').innerHTML = "Warning";
            document.getElementById('loginDialogTextAC').innerHTML = "Do you want to continue without uptade the database?";
            document.getElementById('btnloginDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnloginDialogCancelAC').innerHTML = "No";
            document.getElementById("loginDialogIconoAC").src = "images/amarillo.png";
            $("#div_pass").hide();
            break;

        case "cancelarPedido":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>Do you want to cancel the current order?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Accept";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cancel";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;

        case "loginOfflineNoData":
            document.getElementById('loginDialogTituloA').innerHTML = "Information";
            document.getElementById('loginDialogTextA').innerHTML = "To start the application you must be online";
            document.getElementById('btnloginDialogOkA').innerHTML = "Accept";
            document.getElementById("loginDialogIconoA").src = "images/verde.png";
            break;
        case "NoSePuedeRecargar":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "You can not reload offline";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "NavegadorNoSoportado":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Unsupported browser";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;  
        case "CredencialesErroneas":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Invalid credentials";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;      
        case "SinArticulos":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "No items to this order";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;    
        case "errorEAN":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>The EAN you selected does not exist</center>";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
		case "proveedorManual":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>You can not select items of "+localStorage["proveedor_seleccionado"]+" supplier, as it only allows sending orders manually";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;
        case "errorSinConexion":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Unable to refresh the offline data";
            document.getElementById('btnPedidosDialogOkAC').style.visibility="hidden";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Close";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;    
        case "loginSinCredenciales":
            document.getElementById('loginDialogTituloA').innerHTML = "Information";
            document.getElementById('loginDialogTextA').innerHTML = "You need to type your username and password.";
            document.getElementById('btnloginDialogOkA').innerHTML = "Accept";
            document.getElementById("loginDialogIconoA").src = "images/verde.png";
            break;
        case "loginIncorrecto":
            document.getElementById('loginDialogTituloA').innerHTML = "Error";
            document.getElementById('loginDialogTextA').innerHTML = "Invalid user or password";
            document.getElementById('btnloginDialogOkA').innerHTML = "Accept";
            document.getElementById("loginDialogIconoA").src = "images/rojo.png";
            break;


        case "loginOfflineUserError":
            document.getElementById('loginDialogTituloAC').innerHTML = "Warning";
            document.getElementById('loginDialogTextAC').innerHTML = "Only " + localStorage.getItem('ultimo_usuario') + " is allowed to login in the app without internet.";
            $("#div_pass").show();
            document.getElementById('btnloginDialogOkAC').innerHTML = "Accept";
            document.getElementById('btnloginDialogCancelAC').innerHTML = "Cancel";
            document.getElementById("loginDialogIconoAC").src = "images/amarillo.png";
            break;
        case "loginOnline":
            document.getElementById('loginDialogTituloAC').innerHTML = "Warning";
            document.getElementById('loginDialogTextAC').innerHTML = "¿Do you want to update the database?";
            $("#div_pass").hide();
            document.getElementById('btnloginDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnloginDialogCancelAC').innerHTML = "No";
            document.getElementById("loginDialogIconoAC").src = "images/amarillo.png";
            break;

        case "menuNoDisponible":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Information";
            document.getElementById('pedidosDialogTextA').innerHTML = "Option not running";
            document.getElementById('btnPedidosDialogA').innerHTML = "Accept";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "filtroFamiliaNoSeleccionado":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>Continue without filter?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            break;

        case "articuloSeleccionado":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Information";
            document.getElementById('pedidosDialogTextA').innerHTML = "This Item is already selected";
            document.getElementById('btnPedidosDialogA').innerHTML = "Accept";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;


        case "seleccionarFecha":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Information";
            document.getElementById('pedidosDialogTextA').innerHTML = "To continue, you must select a date";
            document.getElementById('btnPedidosDialogA').innerHTML = "Accept";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;
        case "seleccionarZona":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Information";
            document.getElementById('pedidosDialogTextA').innerHTML = "To continue, you must select a Zone";
            document.getElementById('btnPedidosDialogA').innerHTML = "Accept";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "pedidoVacio":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Information";
            document.getElementById('pedidosDialogTextA').innerHTML = "The order is empty";
            document.getElementById('btnPedidosDialogA').innerHTML = "Accept";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "refrescar":
            document.getElementById('pedidosDialogTituloRefrescar').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextRefrescar').innerHTML = "Are you sure you want to refresh the page?";
            document.getElementById('btnPedidosDialogRefrescarOk').innerHTML = "Accept";
            document.getElementById('btnPedidosDialogRefrescarCancel').innerHTML = "Cancel";
            document.getElementById("pedidosDialogIconoRefrescar").src = "images/amarillo.png";
            break;

        case "insertarArticulo":
            document.getElementById('btnInsertarPedidoCancelar').innerHTML = "Cancel";
            document.getElementById('btnInsertarPedidoOk').innerHTML = "Accept";
            document.getElementById('pedidosDialogInsertarOrden').innerHTML = "Insertar";
			$('#InUnidadesInsertarPedido').val("1");
            break;

        case "modificarArticulo":
            document.getElementById('btnInsertarPedidoCancelar').innerHTML = "Cancel";
            document.getElementById('btnInsertarPedidoOk').innerHTML = "Save";
            document.getElementById('pedidosDialogInsertarOrden').innerHTML = "Modificar";
            break;

        case "accionNoDisponible":
            document.getElementById('pedidosDialogTituloA').innerHTML = "Information";
            document.getElementById('pedidosDialogTextA').innerHTML = "Action temporarily Unavailable";
            document.getElementById('btnPedidosDialogA').innerHTML = "Accept";
            document.getElementById("pedidosDialogIconoA").src = "images/verde.png";
            break;

        case "recargarBaseDeDatos":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>Do you want to update the database?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "actualizar";
            break;

        case "pedidoGLobalEscaner":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Information";
            document.getElementById('pedidosDialogTextAC').innerHTML = "The global order based on scanner option generates several purchase orders, one for each primary vendor of each item scanned. After finish scanning the items, you must finalize the generated orders by going to the draft orders menu option and filling out the available header fields. ";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Start";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cancel";
            document.getElementById("pedidosDialogIconoAC").src = "images/verde.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "pMostrarDetalleEscaner";
            break;

         case "pedidoEscaner":
            //document.getElementById('LbTituloDialogEscaner').innerHTML = "Article selection by Bar-Code";
            document.getElementById('LbDetalleNuevoArticulo').innerHTML = "Scan item barcode";
            document.getElementById("btnpDialogInsertEanok").innerHTML = "Finish";
            break;

        case "borradoresGuardados":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Information";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Drafts generated correctly. You must finish each draft with the header data to complete orders";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Accept";
			document.getElementById('btnPedidosDialogCancelAC').innerHTML = "Cancel";
            document.getElementById("pedidosDialogIconoAC").src = "images/verde.png";
			document.getElementById("pedidosDialogACOrden").innerHTML = "borradoresGuardados";
            break;

        case "existenBorradores":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Information";
            document.getElementById('pedidosDialogTextAC').innerHTML = "There are other drafts previously generated based scanner. Want to add new items to these drafts?";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/verde.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "existenBorradores";
            break;
         case "NoSePuedeRecargarNoInternet":
                                 document.getElementById('mDialogATitulo').innerHTML = "Warning";
                                 document.getElementById('mDialogAText').innerHTML = "It is not possible to reload without internet.";

                                 document.getElementById('mDialogAOk').innerHTML = "Accept";

                                 break;

           case "NuncaCargado":
                      document.getElementById('cargaDialogATitulo').innerHTML = "Warning";
                      document.getElementById('cargaDialogAText').innerHTML = "There is not DB for this user. Try to login again.";

                      document.getElementById('btnCargaDialogAOk').innerHTML = "Accept";

                      break;

         case "guardarBorrador":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "Are you sure you want to save as a draft order?";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogACOrden").innerHTML = "guardarBorrador";
            break;
				
		case "actualizarArticulo":
            document.getElementById('pedidosDialogTituloAC').innerHTML = "Warning";
            document.getElementById('pedidosDialogTextAC').innerHTML = "<center>Article selected. Do you want to change the amount entered?</center>";
            document.getElementById('btnPedidosDialogOkAC').innerHTML = "Yes";
            document.getElementById('btnPedidosDialogCancelAC').innerHTML = "No";
            document.getElementById("pedidosDialogIconoAC").src = "images/amarillo.png";
            document.getElementById("pedidosDialogACOrden").innerHTML = "actualizarArticulo";
            break;

				case "refrescarPrincipal":
            document.getElementById('mDialogACTitulo').innerHTML = "Warning";
            document.getElementById('mDialogACTexto').innerHTML = "Are you sure you want to refresh the page?";
            document.getElementById('mBtnDialogACOk').innerHTML = "Accept";
            document.getElementById('mBtnDialogACCancel').innerHTML = "Cancel";
            document.getElementById("pedidosDialogIconoRefrescar").src = "images/amarillo.png";
            break;
            
        default:
            return "Dialog Text";
        }

    } else {
        console.log("IDIOMA NO DEFINIDO!!!!!!");
    }
}


function getTraduccionMenuPrincipal() {

    var lang = localStorage['language'];

    if (lang == "ES") {
        $('#mTextoIndicePedidos').text("Pedidos");
        $('#mTextoIndiceRecepciones').text("Recepciones");
        $('#mTextoIndiceDevoluciones').text("Devoluciones");
        $('#mTextoIndiceActualizacion').text("Actualizar Datos");
        $('#mTextoIndiceExpedicion').text("Expediciones");
        $('#mTextoIndiceInventario').text("Inventario");
        $('#mTextoIndiceMermas').text("Mermas");
        $('#mTextoIndiceSistema').text("Sistema");
        $('#tituloPrincipal').text("Menú Principal");
        $('#tituloCargando').text("Cargando");
        $('#mLabelUsuario').text("Usuario:");
        $('#mLabelLastData').text("Última Carga:");
		$("#cabeceraPrincipalUsuario").text("Usuario Conectado:");

    } else if (lang == "EN") {
        $('#mTextoIndicePedidos').text("Orders");
        $('#mTextoIndiceRecepciones').text("Deliveries");
        $('#mTextoIndiceDevoluciones').text("Returns");
        $('#mTextoIndiceActualizacion').text("Refresh Data");
        $('#mTextoIndiceExpedicion').text("Transfers");
        $('#mTextoIndiceInventario').text("Inventory");
        $('#mTextoIndiceMermas').text("Wastes");
        $('#mTextoIndiceSistema').text("System");
        $('#tituloPrincipal').text("Main Menu");
        $('#tituloCargando').text("Loading");
        $('#mLabelUsuario').text("User:");
        $('#mLabelLastData').text("Last Data Load:");
		$("#cabeceraPrincipalUsuario").text("Logged User:");

    } else {
        console.log("MENU PRINCIPAL Idioma no definido");
    }
}


function getStepCarga(accion, lang2) {

    var lang = localStorage['language'];

    if (lang == "ES") {

        switch (accion) {
        case 1:
            return "Cargando Centro de compra";
            break;
        case 2:
            return "Cargando Zonas de entrega";
            break;
        case 3:
            return "Cargando Proveedores por centro de compra";
            break;
        case 4:
            return "Cargando Proveedores";
            break;
        case 5:
            return "Cargando Catalogo";
            break;
        case 6:
            return "Cargando Articulos";
            break;
        case 7:
            return "Cargando EANs";
            break;
        case 8:
            return "Cargando Cadenas logisticas";
            break;
        case 9:
            return "Cargando Pedidos";
            break;
        case 10:
            return "Cargando Plantillas";
            break;
        case 11:
            return "Cargando Familias";
            break;
        case 12:
            return "Cargando Estados";
            break;
        default:
            return "";
        }

    } else if (lang == "EN") {

        switch (accion) {
        case 1:
            return "Loading Purchase Centers";
            break;
        case 2:
            return "Loading Delivery Zones";
            break;
        case 3:
            return "Loading Vendors by Purchase Center";
            break;
        case 4:
            return "Loading Vendors";
            break;
        case 5:
            return "Loading Catalog";
            break;
        case 6:
            return "Loading Items";
            break;
        case 7:
            return "Loading UPC Codes";
            break;
        case 8:
            return "Loading Logistic chains";
            break;
        case 9:
            return "Loading Orders";
            break;
        case 10:
            return "Loading Templates";
            break;
        case 11:
            return "Loading Families";
            break;
        case 12:
            return "Loading Status";
            break;

        default:
            return "";
        }

    } else {
        console.log("STEP CARGA Idioma no definido");
    }

}


function getEstadoCargaPor(accion) {

    switch (accion) {
    case 1:
        return 2;
        break;
    case 2:
        return 5;
        break;
    case 3:
        return 10;
        break;
    case 4:
        return 20;
        break;
    case 5:
        return 30;
        break;
    case 6:
        return 50;
        break;
    case 7:
        return 60;
        break;
    case 8:
        return 75;
        break;
    case 9:
        return 85;
        break;
    case 10:
        return 95;
        break;
    case 11:
        return 98;
        break;
    case 12:
        return 99;
        break;
    default:
        return 0;
    }
}


function getEstadoCargaAsincrono(estado) {


    var lang = localStorage['language'];
    var text = "";
    var paso = "";
    var res = "";
    for (i = 1; i <= 12; i++) {

        if (estado == i) {
            paso = 'cargaPaso' + i;

            estado = parseInt(localStorage[paso]);

            if (lang == "ES") {

                switch (estado) {
                case 0:
                    res = "Cargando";
                    break;
                case 1:
                    res = "OK";
                    break;

                }

            } else if (lang == "EN") {

                switch (estado) {
                case 0:
                    res = "Loading";
                    break;
                case 1:
                    res = "OK";
                    break;

                }

            } else {
                console.log("ESTADO CARGA  Idioma no definido");
            }

            //console.log("Asincrono "+paso+" --> " +estado + " --> "+ res);
            if (res == "OK") {
                localStorage['textoCargaInicial'] = getStepCarga(i, lang) + "...... " + res + "<br>" + localStorage['textoCargaInicial'];
            }
        }
    }

    return localStorage['textoCargaInicial'];
}