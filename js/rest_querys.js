

var host = "http://bus.grupoareas.com:";
var port = "8083";		
var token = "token=aGxsZWlkYToxMzc3NjE5MDg5MDgzOjQ0ZTFlZjdiNzdjMjk4ZWRjNGI0ZjVlNWE5ZjEzOTkx";

function authentication() {
	var uri = "/sec/auth/login";
	var auth = make_basic_auth('thllobre','test');

	$.ajax({
		url:host+port+uri,
		dataType: "xml",
		method : 'GET', 

		beforeSend : function(req) {
	        req.setRequestHeader('Authorization', auth);
	    },

		error: ServiceFailed
		
	});

	console.log("URL: " + uri);
}


function restOrders() {
	var uri = "/om/sc/centrostock/proveedor/pedido/cabecera?";
	var date_init = "&inicio=2013-06-29";
	var date_final = "&fin=2013-07-05";

	$.ajax({
		url:host+port+uri+token+date_init+date_final,
		dataType: "xml",
		type:"GET",
		success:UpdateProgress,
		error: ServiceFailed
		
	});

	console.log("URL: " + uri);
}

function restDetails() {
	var uri = "/om/sc/centrostock/proveedor/pedido/detalle?";
	var date_init = "&inicio=2013-06-29";
	var date_final = "&fin=2013-07-05";

	$.ajax({
		url:host+port+uri+token+date_init+date_final,
		dataType: "xml",
		type:"GET",
		success:addDetallePedido,
		error: ServiceFailed
		function authentication() {
	var uri = "/sec/auth/login";
	var auth = make_basic_auth('thllobre','test');

	$.ajax({
		url:host+port+uri,
		dataType: "xml",
		method : 'GET',
	    beforeSend : function(req) {
	        req.setRequestHeader('Authorization', auth);
	    }

		error: ServiceFailed
		
	});

	console.log("URL: " + uri);
}
	});

	console.log("URL: " + uri);
}


 function ServiceFailed(result) {
        console.log('Service call failed: ' + result.status + '' + result.statusText + ' Posible token expirado');
        varType = null; varUrl = null; varData = null; varContentType = null; varDataType = null; varProcessData = null;
        insert(2,1,"Inicio login en MAMBO Stock Error",result.status);
    }