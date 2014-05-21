// INICIALIZACION DE LA WEB ********************************************

/*



function addPedidosCabecera(response){

	alert( JSON.stringify(response.body[0].codCst) );
	
	for (i=0; i<response.body.length; i++ ) {

		var pedido = {};
		var r=response.body[i];

		pedido.CodPedido=JSON.stringify(r.coiDoc);
		pedido.CodCentro=JSON.stringify(r.codCst);
		pedido.CodProveedor=JSON.stringify(r.codPro);
		pedido.FechaEmision=JSON.stringify(r.fecDoc);
		pedido.HoraEmision=JSON.stringify(r.fecDoc);
		pedido.FechaEntrega=JSON.stringify(r.fecRec);
		pedido.HoraEntrega=JSON.stringify(r.fecRec);
		pedido.EstadoPedido=JSON.stringify(r.sitDoc);
		pedido.Observaciones=JSON.stringify(r.desObs);
		pedido.ValorPedido=JSON.stringify(r.impDoc);
		pedido.CodigoMoneda=JSON.stringify(r.codMon);
		
		insertOrder(pedido);

	};
	
	console.log("Guardando Pedidos");
}


function addDetallePedido(response){		

	var $events = $(response).find("row");
	
	$events.each(function(index, event){
	var $event = $(event);
	var articulo = {};
	
	$event.children("row_attribute").each(function(index, event) {
		var elm = $(this);
		// console.log("Index Detalle " + index);
		switch(elm.attr("name"))
		{
		
			case "cod_pedido": articulo.CodPedido=elm.text(); break;
			case "num_linia": articulo.NumLinia=elm.text(); break;
			case "cod_articulo": articulo.CodArticulo=elm.text(); break;
			case "nom_articulo": articulo.NomArticulo=elm.text(); break;
			case "ref_proveedor": articulo.RefProveedor=elm.text(); break;
			case "cant_pedida": articulo.CantPedida=elm.text(); break;
			case "unidades_cadena": articulo.UnidadesCadena=elm.text(); break;
			case "tipo_unidad": articulo.TipoUnidad=elm.text(); break;
			case "cadena_logistica": articulo.CadenaLogistica=elm.text(); break;
			case "unidades_total": articulo.UnidadesTotal=elm.text(); break;
			case "precio_articulo": articulo.PrecioArticulo=elm.text(); break;
			case "codigo_moneda": articulo.CodigoMoneda=elm.text(); break;
		
		}
	});
	
	// Lookups
	insertDetail(articulo);
	
	});
}


function showPedido(data) {

	// Mostrar online u offline
	var a=navigator.onLine;
	var onlineoffline = $('#onlineoffline');
	onlineoffline.empty();
	
	if(a){
		onlineoffline.append('Online');
	}
	else{
		onlineoffline.append('Offline');
	}

	// Cargar artículo en la tabla
    var tbody = $('#tbodyFilas');

	// Buscar fila:
    var row = $('tr[value="' + data.CodPedido + '"]');

    if (row.length > 0) {
		row.empty();
    }

    else {
        row = $('<tr id='+ data.CodPedido +' value="' + data.CodPedido + '">');
		row.on('tap', function() {
			var element = this;
			
			//do stuff
			var id = this.id;
			//console.log(id);
			$.mobile.changePage('#detalle');
			
				$("#txtCodPedido").val(data.CodPedido);
				$("#txtCodCentro").val(data.CodCentro);
				$("#txtNomProveedor").val(data.nomPro);
				
				// sera una combo $("#txtNomCentro")
				$("#txtCodProveedor").val(data.CodProveedor);
				// Nom proveedor será combo
				$("#txtFechaEmision").val(data.FechaEmision);
				$("#txtHoraEmision").val(data.HoraEmision);
				$("#txtFechaEntrega").val(data.FechaEntrega);
				$("#txtEstadoPedido").val(data.EstadoPedido);
				$("#txtValorPedido").val(data.ValorPedido);
				showArticulos(data.CodPedido);
				
		});
	
    }

    var td1 = $('<td>' + data.CodPedido + '</td>');
    var td2 = $('<td>' + data.NomCentro + ' (' + data.CodCentro + ')' + '</td>');
    var td3 = $('<td>' + data.CodProveedor + '</td>');
    var td4 = $('<td>' + data.FechaEmision + '</td>');
    var td5 = $('<td>' + data.HoraEmision + '</td>');
    var td6 = $('<td>' + data.FechaEntrega + '</td>');
    var td7 = $('<td>' + data.EstadoPedido + '</td>');

   // console.log("Mostrando elemento en tabla");

    row.append(td1);
    row.append(td2);
    row.append(td3);
    row.append(td4);
    row.append(td5);
    row.append(td6);
    row.append(td7);

    tbody.append(row);
  

} 


function showArticulos(data) {


    	var tbodyd = $('#tbodyFilasDetalle');

	    var rowd = $('tr[value="' + data.CodPedido + '"]');
	
	    var tdd1 = $('<td>' + data.CodArticulo + ' &nbsp; &nbsp; &nbsp;</td>');
	    var tdd2 = $('<td>' + data.CodCentro + ' (' + data.CodCentro + ')' + ' &nbsp; &nbsp; &nbsp;</td>');
	    var tdd3 = $('<td>' + data.RefProveedor + ' &nbsp; &nbsp; &nbsp;</td>');
	    var tdd4 = $('<td>' + data.Cantidad + ' &nbsp; &nbsp; &nbsp;</td>');
	    var tdd5 = $('<td>' + data.Cadena + ' &nbsp; &nbsp; &nbsp;</td>');
	    var tdd6 = $('<td>' + data.Unidades + ' &nbsp; &nbsp; &nbsp;</td>');
	    rowd.append(tdd1);
	    rowd.append(tdd2);
	    rowd.append(tdd3);
	    rowd.append(tdd4);
	    rowd.append(tdd5);
	    rowd.append(tdd6);
	
	    tbodyd.append(rowd);

}
*/


function handleError(error) {
    alert(error);
}

/*
function UpdateProgressOld(result) {
	$(document).ready(function() {  
		 var start = Date.now();

  		//console.log(start);
		//$.mobile.changePage('#progressPage'); 
	    var progressbar = $('#progressbar'),  
	        max = progressbar.attr('max'),  
	        time = (1000/max)*5,      
	        value = progressbar.val();  
	  
	    var loading = function() {  
	        value += 1;  
	        addValue = progressbar.val(value);  
	          
	        $('.progress-value').html(value + '%');  
	  
	        if (value == max) {  
	            clearInterval(animate); 
	            var end = Date.now(); 
	            var elapsed =(end - start) /1000;
	           // console.log("Ha pasado " + elapsed);
	            // addPedidosCabecera(result);
	            // $.mobile.changePage('#emitidos');                    
	        }  
	       
	    };  
	  
	    var animate = setInterval(function() {  
	        loading();  
	    }, time);  
	});
} 
*/

/*
function UpdateProgress(data) {
	
	$(document).ready(function() {  
		  var start = Date.now();
		  prog = prog + data;

	    var progressbar = $('#progressbar'),  
	        max = progressbar.attr('max'),  
	        time = (1000/max)*5,      
	        value = progressbar.val();  
	
	  
	    var loading = function() {  
	       // value += 1;  
	        addValue = progressbar.val(prog);  
	          
	        $('.progress-value').html(value + '%');  
	
	        if (value == max) {  
	            clearInterval(animate); 
	            var end = Date.now(); 
	            var elapsed =(end - start) /1000;
	           // console.log("Ha pasado " + elapsed);
	            // addPedidosCabecera(result);
	            // $.mobile.changePage('#emitidos');                    
	        }  
	       
	    };  
	  
	    var animate = setInterval(function() {  
	        loading();  
	    }, time);  
	});
} 
*/




