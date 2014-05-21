
function nowBD(){
	var d = new Date();
	
	var m = (d.getMonth() + 1 );
	if (m < "10" ) { m="0"+m; }
	
	var day = (d.getDate() );
	if (day < "10" ) { day="0"+day; }
	
	var h = (d.getHours());
	if (h < "10" ) { h="0"+h; }
	
	var min = (d.getMinutes() );
	if (min < "10" ) { min="0"+min; }
	
	var s = (d.getSeconds());
	if (s < "10" ) { s="0"+s; }

	return d.getFullYear()+"-"+m+"-"+day+" "+h+":"+min+":"+s;
}

function formatearMoneda(n) {
	
	var formatPrecio="";
	var simbMil = localStorage['THOUSANDS_MARK'];
	var simbDec = localStorage['DECIMAL_MARK'];
	var simboloMod = localStorage['CURRENCY'];
	var numDec = localStorage['NUMBER_OF_DECIMALS'];
	var posSimbolo = localStorage['CURRENCY_SIGN_PLACE'];
	
	var formateada = formatearMonedaIdioma(n,numDec,simbMil,simbDec);
	
	switch(simboloMod){
		case "\u0024":
				if(posSimbolo=="Before"){   formatPrecio = '\u0024'+formateada;	break;	}
				if(posSimbolo=="After"){  formatPrecio = formateada+'\u0024';	break;	}
		case "\u20AC":
				if(posSimbolo=="Before"){   formatPrecio = '\u20AC'+formateada;	break;	}
				if(posSimbolo=="After"){  formatPrecio = formateada+'\u20AC';	break;	}
	
	}
	return formatPrecio;
	
	/*if (localStorage['language']=="EN") {
		var formateada = formatearMonedaIdioma(n, 2, ".", ",");
		formatPrecio = '\u0024'+formateada;
		return formatPrecio;
	} else if (localStorage['language']=="ES") {
		var formateada = formatearMonedaIdioma(n, 2, ".", ",");
		var formatPrecio = formateada+'\u20AC';
		return formatPrecio;
	} else {
		console.log("sin idioma");
		var formateada = formatearMonedaIdioma(n, 2, ".", ",");
		formatPrecio = formateada+'\u20AC';
		return formatPrecio;
	}*/
	
	}

function resizeGrid(grid) {
			console.log("La grid con el resize es: #"+grid)
	    var gridElement = $("#"+grid);
	    var dataArea = gridElement.find(".k-grid-content");
	    var newHeight = gridElement.parent().innerHeight() - 2;
	    var diff = gridElement.innerHeight() - dataArea.innerHeight();
	    gridElement.height(newHeight);
	    dataArea.height(newHeight - diff);
}


function formatearMonedaIdioma(n, decPlaces, thouSeparator, decSeparator) {
   
   decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
   decSeparator = decSeparator == undefined ? "." : decSeparator;
   thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
   var sign = n < 0 ? "-" : "";
   var i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "";
   var j = (j = i.length) > 3 ? j % 3 : 0;
   return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
}

/* 
La fecha de entrada ha de ser en formato BD AAAA/MM/DD
*/
function formatearFechaPantalla(f) {
	
	var r="";
	if (localStorage['language']=="EN") {
		r=f;
		
	} else if (localStorage['language']=="ES") {
		r=f.substr(8,2)+"-"+f.substr(5,2)+"-"+f.substr(0,4)+" "+f.substr(11,5);
	
	} else {
		console.log("sin idioma");
		r=f.substr(8,9)+"-"+f.substr(5,6)+"-"+f.substr(0,3)+" "+f.substr(11,15);
		
	}
	return r;
}

function formatoFecha(mostrarHora/*, columna*/){
	
	/*var r="";
	if(columna=="fecha_emisio"){
		
		if (localStorage['language']=="EN") {r="{0:MM-dd-yyyy HH:mm}";} 
		else if (localStorage['language']=="ES") {r="{0:dd-MM-yyyy HH:mm}";} 
	
	}else if (columna=="fecha_entreg"){
		
		if (localStorage['language']=="EN") {r="{0:MM-dd-yyyy}";} 
		else if (localStorage['language']=="ES") {r="{0:dd-MM-yyyy}";} 
	
	}else if (columna=="fecha"){
		
		if (localStorage['language']=="EN") {r="{0:MM-dd-yyyy HH:mm}";} 
		else if (localStorage['language']=="ES") {r="{0:dd-MM-yyyy HH:mm}";} 
	
	}
	return r;*/
	var formatoFechas = localStorage['DATE_FORMAT'];
	var fechaDevuelta= "";
	
	switch(formatoFechas){
		case "DD/MM/YYYY":
				if(mostrarHora==true){
					fechaDevuelta="{0:dd-MM-yyyy HH:mm}"; 
					break;
				}else{
					fechaDevuelta= "{0:dd-MM-yyyy}";     
					break;
				}
		case "MM/DD/YYYY":
				if(mostrarHora==true){
					fechaDevuelta= "{0:MM-dd-yyyy HH:mm}";  
					break;
				}else{
					fechaDevuelta= "{0:MM-dd-yyyy}";  
					break;
				}
	}
	return fechaDevuelta;
	
}

function getCurrentTime() {

  var currentdate = new Date(); 
  
  var m=(currentdate.getMonth()+1);
  if (m < 10 ) {	m="0"+m; }
  
  var h=(currentdate.getHours());
  if (h < 10 ) {	h="0"+h; }
  
  var min=(currentdate.getMinutes());
  if (min < 10 ) {	min="0"+min; }
  
  var s=(currentdate.getSeconds());
  if (s < 10 ) {	s="0"+s; }
  
  var d=currentdate.getDate();
  if (d < 10 ) {	d="0"+d; }
  
  
  if (localStorage['language']=="ES") {
  	var datetime = d + "-" +  m + "-" + currentdate.getFullYear() + " " + h + ":"  + min + ":" + s;
  	
  	
  } else {
  	var datetime = currentdate.getFullYear() + "-" +  m + "-" +  d + " "+ h + ":"  + min + ":" + s;
  }
  

  return datetime;         
}


function parseDate(str) {
    if(!/^(\d){8}$/.test(str)) return "invalid date";
    var y = str.substr(0,4),
        m = str.substr(4,2),
        d = str.substr(6,2);

    return new Date(y,m,d);
}

function compareTime()
{

	var d1 = new Date();
	var t2 = localStorage["ultima_carga"];
    var t1 = d1.getTime();

    return Math.abs(parseInt((t2-t1)/(60*1000)));

}

function InsertEanTest() {

    db.transaction(function (transaction) {

        var sql = 'INSERT INTO catalog (idItem, idVendor, idPurchaseCenter) VALUES (9999,5011,1603)';

        //var sql = "SELECT DISTINCT e.idItem FROM EANS as e, catalog as c WHERE c.idItem=e.idItem AND e.idEAN='"+codigoEan+"'";

        console.log("INSERTAR ARTICULO CON EAN PARA TEST CATALOG " + sql)
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                console.log("ok");

                db.transaction(function (transaction) {

                    var sql2 = 'INSERT OR IGNORE INTO EANS (idEAN, idItem, idLogisticsChain , sizeId ,  isMain , status ) ' + 
  				'VALUES ("0000", "9999", "000",  "0", "0", "0")';

                    //var sql = "SELECT DISTINCT e.idItem FROM EANS as e, catalog as c WHERE c.idItem=e.idItem AND e.idEAN='"+codigoEan+"'";

                    console.log("INSERTAR ARTICULO CON EAN PARA TEST EAN" + sql2)
                    transaction.executeSql(sql2, undefined,
                        function (transaction, result) {
                            console.log("ok2");



                        });
                },error);



            });
    },error);

}

function formatearFechaWS(fecha){
	
	var date = new Date();
	var f = fecha;
	f = f.substring(0, 4)+"-"+f.substring(5,7)+"-"+f.substring(8, 10)+"T"+f.substring(11, 13)+":"+f.substring(14, 16)+":"+f.substring(17,20);
	var timeZone = ((date.getTimezoneOffset())/(-60));
	timeZone = timeZone.toString();
	if(timeZone.length<2)  f = f+"+0"+timeZone+"00"
	else  f = f+"+"+timeZone+":"+"00"
		
	return f;
}


function formatearFechaKendo(f){
	
	if (f != null) return new Date(f.substring(0, 4),(f.substring(5,7) - 1),f.substring(8, 10));
	else {return new Date(0,0,0); }

}


function kendoDateFormat() {
	
	return localStorage['DATE_FORMAT'].replace("DD","dd").replace("YYYY","yyyy");
	
}

function formatearFechaHoraKendo(f){
	
	if (f != null){ return new Date(f.substring(0, 4),(f.substring(5,7) - 1),f.substring(8, 10),f.substring(11, 13), f.substring(14, 16), 00, 00);             }
	else {            return new Date(0,0,0,0, 0, 00, 00);                                                                                        }
	
}

	/*
Las fechas tienen que recibirse en formato BB.DD YYYY/MM/DD HH:mm
*/
function darFormatoSegunWS(f,mostrarHora){
	
	var fechaDevolver="";
	var formatoFecha = localStorage['DATE_FORMAT'];
	
	switch(formatoFecha){
		case "DD/MM/YYYY":
				if(mostrarHora==true){
						if (f != null){   
							fechaDevolver = f.substring(8,10)+"-"+(f.substring(5,7))+"-"+f.substring(0,4)+" "+f.substring(11, 13)+":"+f.substring(14, 16);
							break;  }
						else {            
							fechaDevolver =  new Date(0,0,0,0, 0, 00, 00);                                                                                     
							 break;       }
				}else{
						if (f != null){ 	
							fechaDevolver =  f.substring(8,10)+"-"+(f.substring(5,7))+"-"+f.substring(0,4);                                               
						 break;    }
						else { 						
							fechaDevolver =  new Date(0,0,0);                                                                                                   
							break;      }
				}
		case "MM/DD/YYYY":
				console.log("Hemos entrado en el formato MM/DD/YYYY");
				if(mostrarHora==true){
					if (f != null){   
						fechaDevolver =  f.substring(5,7)+"-"+f.substring(8, 10)+"-"+f.substring(0, 4)+" "+f.substring(11, 13)+":"+f.substring(14, 16); 
						break;  }
					else {            
						fechaDevolver =  new Date(0,0,0,0, 0, 00, 00);                                                                                          
						break;   }
				}else{
					if (f != null){   
						fechaDevolver =  f.substring(5,7)+"-"+f.substring(8, 10)+"-"+f.substring(0, 4);                                                    
						break;   }
					else {            
						fechaDevolver =  new Date(0,0,0);                                                                                                         
						break;    }
				}
	}
	return fechaDevolver;	
	
}


function parseNumberLogisticChain(n) {
	
	var valor = n.toString();
	var encuentra = valor.indexOf(",");
  if (encuentra>0) valor = valor.replace(',','.');
	if (valor.substr(0,1)=="." ) valor="0"+valor;
	return parseFloat(valor); 
	
}
