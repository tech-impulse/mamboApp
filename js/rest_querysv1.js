

function completedLoad(){
	$.mobile.loading( 'hide' );
	
}


function restOrders() {

	/*
	// var uri = "/om/sc/centrostock/proveedor/pedido/cabecera?";
	var uri = "/centro/proveedor/1431/pedido?";
	
	// http://localhost:8086/centro/1602/pedido
	// http://localhost:8086/centro/proveedor/1431/pedido
	
	var date_init = "&inicio=2013-08-05";
	var date_final = "&fin=2013-09-04";

	$.ajax({
		async: false,
		url:host+port+uri+token+date_init+date_final,
		dataType: "json",
		type:"GET",
		success:addPedidosCabecera,
		error: ServiceFailed
		
	});

	console.log("URL: " + uri);
	*/
}

function restDetails() {
	/*
	var uri = "/om/sc/centrostock/proveedor/pedido/detalle?";
	var date_init = "&inicio=2013-08-05";
	var date_final = "&fin=2013-09-05";

	$.ajax({
		async: false,
		url:host+port+uri+token+date_init+date_final,
		dataType: "json",
		type:"GET",
		success:addDetallePedido,
		error: ServiceFailed
	});

	

	console.log("URL: " + uri);
	*/
}

 








function loading() {

	$('<div>').simpledialog2({
    mode: 'blank',
    headerText: 'Some Stuff',
    headerClose: true,
    blankContent : 
      "<ul data-role='listview'><li>Some</li><li>List</li><li>Items</li></ul>"+
      // NOTE: the use of rel="close" causes this button to close the dialog.
      "<a rel='close' data-role='button' href='#'>Close</a>"
  })

}



