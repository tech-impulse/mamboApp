
//Variable Global para hacer una unica conexión a la BD
var db; 

// cod_pedido: 'CP', 
var aDataSet;

var aDataSetDetalle;

/*
Creacion conexion BD
*/
function initDB() {
	
  console.log("Inicializando DB");
  try {
    if (!window.openDatabase) {
      //alert('Aplicacion no soportada en este Navegador');
      getDescripcionAviso("NavegadorNoSoportado");
      $("#pedidosDialogAC").popup("open");
    }
    else {
    	
    	//Creación de la conexión con la BD
      db = openDatabase ("Mambo_v1", "1.0", "Mambo_v1", 52428800);
      
      //Inicialización de la BD
      
      //deleteDB(); //Borramos el contenido de las tablas, excepto de la tabla log
      
      //CREAMOS TODAS TABLAS
      _createTable();
      
      
      
      //////////////////////////
			
    }
  }

  catch (e) {
    if (e == 2) {
      console.log("Invalid database version.");
    } else {
      console.log("Unknown Error " + e + ".");
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
// Crear tablas

function _createTable(){
	//TABLAS INTERNAS
  _createTableUser(); // habra que borrarla ALAIN Es para el Login de momento
	_createTableLog();
	_createTableTest();
	_createTableSecurity();
	_createTableScope();	
	_createTableEstructuraTablas();
	
	
	//Tablas datos
	_createTablePurchaseCenters();
	_createTableDeliveryZones();
	_createTablePurchaseCentersVendors();
	
	_createTableVendor();
	
	_createTableRelArticulos();
	_createTableRelCatalog();
	
	_createTableLogisticChains();
	
	_createTableItems();
	_createTableFamilies();
	
	_createTableOrders();
	_createTableOrderDetails();
	_createTableOrdersTemplate();
  _createTableOrderTemplatesDetails();
  
  _createTableOrdersPending();
  _createTableOrdersDraft();
  _createTableEstados();
  
  _createTableEANS();
	
  _createTableOrdersError(); 
  
  _createTableSettings();
	

}


function _createTableEstructuraTablas() {
	
	var sql = "CREATE TABLE IF NOT EXISTS tablas " +
        "(nombre VARCHAR(100) PRIMARY KEY)";
	

  db.transaction (function (transaction) 
  {
    transaction.executeSql (sql, undefined, function ()
	  { 
	    //alert ("Table created");
	  }, error);
  });
	
}

function insertEstructuraTablas(nombre) {
	 db.transaction (function (transaction) 
	  {
	  	sql="INSERT OR IGNORE INTO tablas (nombre) VALUES ('"+nombre+"' )";
	    transaction.executeSql (sql, undefined, function () { });
	  });
}

function _createTableSecurity(backUp) {
	
	
	var sql = "CREATE TABLE IF NOT EXISTS security " +
        "(username VARCHAR(100) NOT NULL, " + 
        "module VARCHAR(50) NOT NULL, " + 
        "action VARCHAR(50) NOT NULL)";
	
	if (backUp != undefined) exportTable(sql);
	else {
	
		  console.log("Creando tabla security");
		  db.transaction (function (transaction) 
		  {
		    transaction.executeSql (sql, undefined, function ()
			  { 
			    //alert ("Table created");
			  }, error);
		  });
	}
}


function _createTableOrdersError(backUp) {
	
	
	var sql = "CREATE TABLE IF NOT EXISTS ordersPendingErrors " +
        "( idOrder int NOT NULL, " + 
        "  message VARCHAR(250) );";
        
	var sql2 = "CREATE TABLE IF NOT EXISTS ordersPendingDetailErrors " +
        "( idOrder int NOT NULL, " + 
        "  lineNumber int NOT NULL, " + 
        "  message VARCHAR(250) );";
	
	if (backUp != undefined)  exportTable(sql); 
	else {
	
		  console.log("Creando tabla security");
		  db.transaction (function (transaction) 
		  {
		    transaction.executeSql (sql, undefined, function ()
			  { 
			    //alert ("Table created");
			  }, error);
		  });
	}
	
	if (backUp != undefined)  exportTable(sql2); 
	else {
	
		  console.log("Creando tabla security");
		  db.transaction (function (transaction) 
		  {
		    transaction.executeSql (sql2, undefined, function ()
			  { 
			    //alert ("Table created");
			  }, error);
		  });
	}
}


function _createTableScope(backUp) {
  //console.log("Creando tabla Scopes");
  
  var sql = "CREATE TABLE IF NOT EXISTS scopes " +
        "(username VARCHAR(100) NOT NULL, " + 
        "scope VARCHAR(10) NOT NULL)";
        
  if (backUp != undefined) exportTable(sql);
	else {
  
	  db.transaction (function (transaction) 
	  {
	   	
	    
	    transaction.executeSql (sql, undefined, function ()
		  { 
		    //alert ("Table created");
		  }, error);
	  });
	 }
}

function _createTableTest(backUp){
	
	var sql = "CREATE TABLE IF NOT EXISTS Tiempos " +
        " (	Fin INT NOT NULL, " +
        "		Tiempo DATETIME default CURRENT_DATE )";
	
	if (backUp != undefined) exportTable(sql);
	else {
	
	  db.transaction (function (transaction) 
	
	  {
	    
	        
	    transaction.executeSql (sql, undefined, function ()
	    { 
	      //alert ("Table created");
	    }, error);
	  });	
	}
}


function _createTableLog(backUp){
	
	//console.log("Creando tabla ARticles");
	var sql = "CREATE TABLE IF NOT EXISTS Log " +
        "( tiempo DATETIME default CURRENT_DATE, " +
        "tipo INTEGER NOT NULL, " +
        "descripcion VARCHAR(150) NOT NULL, " +  
        "usuario VARCHAR(50) NOT NULL, " +
        "data VARCHAR(300) NOT NULL, " + 
        "categoria INTEGER NOT NULL, " + 
        "transactionCode VARCHAR(100) NOT NULL, " +  
		"device INTEGER NOT NULL " + 
        ")";
	
	if (backUp != undefined) exportTable(sql);
	else {
	
	  db.transaction (function (transaction) 
	
	  {
	    
	    transaction.executeSql (sql, undefined, function ()
	    { 
	      //alert ("Table created");
	    }, error);
	  });
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
// DELETE

function deleteDB() {
  console.log("Eliminando Db");
  db.transaction (function (transaction) 
  {
  	var sql="";
  	
  	if (localStorage['recargaTotal']=="") {
  	
	  	sql = "DROP TABLE IF EXISTS scopes"
	    transaction.executeSql (sql, undefined, function ()
	    { 
	    }, error); 
	   
	  }
    sql = "DROP TABLE IF EXISTS security"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
  	
    sql = "DROP TABLE IF EXISTS Tiempos"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 

    sql = "DROP TABLE IF EXISTS Status"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error);  
    
    
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    sql = "DROP TABLE IF EXISTS purchaseCenters "
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    
    sql = "DROP TABLE IF EXISTS deliveryZones "
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    
    sql = "DROP TABLE IF EXISTS catalog"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    
    sql = "DROP TABLE IF EXISTS logisticChains"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    
     
    sql = "DROP TABLE IF EXISTS families"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS ordersDetail"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS ordersTemplates"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    
    
    sql = "DROP TABLE IF EXISTS ordersTemplatesDetail"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS relItems"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS relPurchaseCenter_Vendors"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS status"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS vendors"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 

		 sql = "DROP TABLE IF EXISTS ordersPending";
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
     sql = "DROP TABLE IF EXISTS ordersPendingDetail";
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS ordersDraft";
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    sql = "DROP TABLE IF EXISTS ordersDraftDetail";
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
	  
	sql = "DROP TABLE IF EXISTS settings";
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
  });
  
  
}


function trunkDB() {
  console.log("Eliminando Db");
  db.transaction (function (transaction) 
  {
  	var sql="";
  	if (localStorage['recargaTotal']=="" || localStorage['recargaTotal']==undefined) {
	  	sql = "DELETE FROM scopes"
	    transaction.executeSql (sql, undefined, function ()
	    { 
	    }, error); 
	    
	    console.log("BORRAMOS SCOPES");
	    
    }
    
    sql = "DELETE FROM security"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
  	
    sql = "DELETE FROM Tiempos"
    transaction.executeSql (sql, undefined, function ()
    { 
    }, error); 
    
    
    sql = "SELECT * FROM tablas";
    transaction.executeSql (sql, undefined, function (transaction, res)
    { 
    	for (var i =0; i < res.rows.length; i++) {
    		
    		sql = "DELETE FROM "+res.rows.item(i).nombre;
    		
    		console.log(sql);
		    transaction.executeSql (sql, undefined, function ()
		    { 
		    }, error);
    		
    	} 
    	
    }, error); 
    

    
  });
  
  
}


function insertLog(tipo,categoria,descrpcion,data) {
	
  //console.log("Insertando Log");
	
	
	var dispositivo;
	if (navigator.userAgent.match(/Android/i))
	{
		dispositivo = 1;
	}
	else if (navigator.userAgent.match(/iPhone/i))
	{
		dispositivo = 2;
	}
	else if (navigator.userAgent.match(/iPad/i))
	{
		dispositivo = 3;
	}
	else if (navigator.userAgent.match(/iPod/i))
	{
		dispositivo = 4;
	}
	else if (navigator.userAgent.match(/BlackBerry/i))
	{
		dispositivo = 5;
	}
	else if (navigator.userAgent.match(/Windows Phone/i))
	{
		dispositivo = 6;
	}
	else if (navigator.userAgent.match(/webOS/i))
	{
		dispositivo = 7;
	}
	else
	{
		dispositivo = 8;
	}
  
  db.transaction (function (transaction) 
  {
      	
    var sql = "INSERT INTO Log (tiempo, tipo, descripcion, usuario, data, categoria, transactionCode, device) VALUES ( '"+nowBD()+"','" + tipo +"', '" + descrpcion +"', '" + localStorage.username +"', '" + data +"', '" + categoria +"', '0', '" + dispositivo +"' )";

    transaction.executeSql (sql, null, function ()
    { 
    }, error);
   
     
   });

}


function insertTiempos(data, ini) {
	
  //console.log("Insertando Articulos");

  db.transaction (function (transaction) 
  {
      	
    var sql = "INSERT INTO Tiempos ( Fin ) VALUES ( ? )";
    transaction.executeSql (sql, [1] , function ()
    { 

      //alert ("Order inserted");
      //pMostrarPedidos();
    }, error);
   
   });
   
  if (data==1) {
   	
   	db.transaction (function (transaction) 
	  {   
	
	    var sql = "SELECT * FROM Tiempos ORDER BY Tiempo ASC  ";
	 
	    transaction.executeSql (sql, undefined, 
	    function (transaction, result)
	    {
	      
	      for (var i = 0; i < result.rows.length; i++) 
	      {
	          var t = result.rows.item (i);
	
	          console.log("TIEMPOS ======> Fin =" + t.Fin + " HORA " + t.Tiempo );
	            
	      }
	      
	      console.log("Llamando a list ORders desde proceso Cabecera proceso  ");
			 	
				//pMostrarPedidos();
					 	
				completedLoad();
				
				var fin= new Date().getTime();
				
				var ms = (fin - ini) / 1000; 
		
				console.log(ms+" = "+fin+" - "+ini );
				
				
				var m = Math.floor(ms / 60);
				var s = (ms - m * 60); 
				
		
				localStorage['pantalla']="menuPrincipal";
				
				$.mobile.changePage('#menuPrincipal');		

				
	    }, error);
	
	  });
   	
   	
  } else{
  	//$.mobile.changePage('#progressPage');		
  	
  	//console.log("CAMBIO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  	/*
  	for (i = 0; i < 100000; i++) {
  		 // code to be executed
  		 console.log(i);
  	}
  	*/
  	return new Date().getTime();
  	
  }
  
  
  
}


function insertUserData(usuario, pass) {
	
  //console.log("Insertando Articulos");
  
  db.transaction (function (transaction) 
  {    
    var currentdate = new Date();
		var tiempo = currentdate.getFullYear() + "/"+(currentdate.getMonth() + 1)
				+ "/" + currentdate.getDate() + " " 
				+ currentdate.getHours() + ":" 
				+ currentdate.getMinutes() + ":" + currentdate.getSeconds(); 	
    var sql = "INSERT INTO User (tiempo, usuario, pass) VALUES ( ? , ? , ? )";
    
    console.log(sql);	

    transaction.executeSql (sql, [tiempo, localStorage.getItem('usuario').toString(), localStorage.getItem('pass').toString()], function ()
    { 
    }, error);
   
     
   });

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Control de errores

function ok ()
{
}


function error (transaction, err ) 
{
	
	var t = DumpObject(transaction);
  console.log("DB error : " + err.message + " => " );
  return false;
}




function DumpObject(obj)
{
  var od = new Object();
  var result = "";
  var len = 0;

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        value = "[ " + value + " ]";
      }
      else
      {
        var ood = DumpObject(value);
        value = "{ " + ood.dump + " }";
      }
    }
    result += "'" + property + "' : " + value + ", ";
    len++;
  }
  od.dump = result.replace(/, $/, "");
  od.len = len;

  return od;
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BD 
function _createTableEstados(backUp){
	
	
 var sql = "CREATE TABLE IF NOT EXISTS status " +
    "( id INTEGER NOT NULL PRIMARY KEY, " +
    " name VARCHAR(25) NOT NULL, " +
    " icon VARCHAR(150) NOT NULL )";
	
	if (backUp != undefined) exportTable(sql);
	else {
	
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    { 
	    	
	    	var sqlInsert = "INSERT OR IGNORE INTO status ( id , name, icon) values (?, ?, ?)";
		    transaction.executeSql (sqlInsert, [ '9','Anulado','status_anulado.png'], function () {  },error, aqui);
		    transaction.executeSql (sqlInsert, [ '7','Emitido confirmado','status_emitido_confirmado.png'], function () { }, error, aqui);
		    transaction.executeSql (sqlInsert, [ '6','Emitido pendiente confirmar','status_emitido_pend_conf.png'], function () { });
		    transaction.executeSql (sqlInsert, [ '8','Entregado','status_entregado.png'], function () { });
		    transaction.executeSql (sqlInsert, [ '5','Finalizado','status_finalizado.png'], function () { }); 
		    transaction.executeSql (sqlInsert, [ '1','Pendiente de completar','status_corregir.png'], function () { });
				transaction.executeSql (sqlInsert, [ '3','Pendiente enviar','status_enviando.png'], function () { }); 					
				transaction.executeSql (sqlInsert, [ '2','Borrador','status_borrador.png'], function () { });
				transaction.executeSql (sqlInsert, [ '4','Error','icno_status_error.png'], function () { });
	    	
	    });
	    			
	  });
	}
	
}


function aqui (tx, error) {
		console.log("error ==> " + error.message);
}

function _createTablePurchaseCenters(backUp){

	//console.log("Creando tabla Relacion Centros compra -> Proveedores ");
	var sql = "CREATE TABLE IF NOT EXISTS purchaseCenters " +
	        " (  idPurchaseCenter INT PRIMARY KEY, " + 
	        "    name VARCHAR(100), " +
	        "    shortName VARCHAR(100), " +
	        "    currency VARCHAR(5), " +
	        "   type VARCHAR(1) )";
	
	insertEstructuraTablas("purchaseCenters");
	
	if (backUp != undefined) exportTable(sql);
	else {
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
	
}

function getQueryInsertPurchaseCenter(data) {
	
   return 'INSERT OR IGNORE INTO purchaseCenters (idPurchaseCenter,name, shortName, type, currency) VALUES ('+data.id+',"'+ data.nombre+'","'+ data.shortName+'","'+ data.tipo+'", "'+data.currency+'")'; 
     
}


//Delivery Zones
function _createTableDeliveryZones(backUp){
	
	var sql = "CREATE TABLE IF NOT EXISTS deliveryZones " +
        " (  idDeliveryZone VARCHAR(10), " + 
        "    idPurchaseCenter INT NOT NULL, " + 
        "    name VARCHAR(100), type VARCHAR(1) )";
  
  insertEstructuraTablas("deliveryZones");
        
	if (backUp != undefined) exportTable(sql);
	else {

	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	} 
	
}

function getQueryInsertDeliveryZones(data) {
	
  return 'INSERT OR IGNORE INTO deliveryZones (idDeliveryZone,idPurchaseCenter,name, type) VALUES ("'+data.idDeliveryZone+'",'+ data.idPurchaseCenter+', "'+ data.name+'","'+ data.type+'")';
    
}


function _createTablePurchaseCentersVendors(backUp){

	//console.log("Creando tabla Relacion Centros compra -> Proveedores ");
	var sql = "CREATE TABLE IF NOT EXISTS relPurchaseCenter_Vendors " +
        " (idPurchaseCenter INT NOT NULL, " + 
        " idVendor INT NOT NULL, " +
        " vendorCommunicationType VARCHAR(50) )";
	
	insertEstructuraTablas("relPurchaseCenter_Vendors");
	
	if (backUp != undefined) exportTable(sql);
	else {
	  db.transaction (function (transaction) 
	  {
	    
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
}

function getQueryInsertRelPurchaseCentersVendors(data) {
	
  return 'INSERT OR IGNORE INTO relPurchaseCenter_Vendors (idPurchaseCenter, idVendor, vendorCommunicationType) VALUES ('+data.idCentroVenta+',"'+ data.idProveedor+'" , "'+ data.vendorCommunicationType+'" )';
   
}

//VENDORS 
function _createTableVendor(backUp){

	var sql = "CREATE TABLE IF NOT EXISTS vendors " +
	        " (idVendor INT NOT NULL PRIMARY KEY, " + 
	        " name VARCHAR(100) NOT NULL, " + 
	        " phone VARCHAR(12) )";

	insertEstructuraTablas("vendors");
	
	if (backUp != undefined) exportTable(sql);
	else {

	  db.transaction (function (transaction) 
	  {
	    
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
}

function _createTableUser(backUp){
	
	//console.log("Creando tabla User");
	
	var sql = "CREATE TABLE IF NOT EXISTS User " +
        "( tiempo DATETIME default CURRENT_DATE, " +
        "usuario VARCHAR(50) NOT NULL, " + 
        "pass VARCHAR(50) NOT NULL " + 
        ")";
	
	
	
	
	if (backUp != undefined) exportTable(sql);
	else {
	
	  db.transaction (function (transaction) 
	  {
	    
	    transaction.executeSql (sql, undefined, function ()
	    { 
	      //alert ("Table created");
	     // insertUserData();
	      
	    }, error);
	  });
	}
}

function getQueryInsertVendor(data) {
	
  return 'INSERT OR IGNORE INTO vendors (idVendor, name, phone) VALUES ('+data.idVendor+',"'+ data.name+'","'+ data.phone+'")';
  
}


function _createTableRelArticulos(backUp){

	//console.log("Creando tabla Relacion Centros compra -> Proveedores ");
	var sql = "CREATE TABLE IF NOT EXISTS relItems " +
        " (idItem INT NOT NULL, " + 
        " idPurchaseCenter INT NOT NULL, " +
        "idVendor INT NOT NULL)";
        
	if (backUp != undefined) exportTable(sql);
	else {
	
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
}

function getQueryInsertRelItems(data) {
	
  return 'INSERT OR IGNORE INTO relItems (idItem, idPurchaseCenter, idVendor) VALUES ('+data.idArticulo+',"'+ data.idCentroVenta+'","'+ data.idProveedor+'")';
   
}

function _createTableRelCatalog(backUp){
	 
	 var sql = 
        "  CREATE TABLE IF NOT EXISTS catalog " +
        " (idItem INT NOT NULL, " +
        "  idPurchaseCenter INT , "+
        "  idVendor INT NOT NULL, " +
        "  idLogisticsChains VARCHAR(16), " +
 				"  vendorReference VARCHAR(15), " +
 				"  vendorStatus  TINYINT, " + 
 				"  primaryVendorId INT ," +
    		"  isElectronicVendor TINYINT, " + 
    		"  isByEmailVendor TINYINT, " +  
 				"  theoreticalStock INT , " +
 				"  isAuthorizedVendor INT , " +
 				"  isPrimaryVendor TINYINT , " +
 				"  priceType VARCHAR(1), " +
 				"  grossPrice DECIMAL (8,3) , " + 
 				"  netPrice DECIMAL (8,3) , " +
 				"  sizeId VARCHAR(4), " + 
 				"  onCourseStock TINYINT, " + 
    		"  inTransitStock TINYINT, " +
 				"  matQ1 INT , " +
 				"  matQ2 INT , " +
 				"  matQ3 INT , " +
 				"  matQ4 INT , " +
 				"  matQ5 INT , " +
 				"  matQ6 INT , " +
 				"  matQ7 INT , " +
 				"  matQ8 INT , " +
 				"  matQ9 INT , " +
 				"  matQ10 INT , " +
 				"  matQ11 INT , " +
 				"  matQ12 INT , " +
 				"  matQ13 INT , " +
 				"  currency VARCHAR(4), " + 
 				"  warehouseId INT , " +
 				"  allowsPerUnitRequest INT, " + 
        "  purchaseCenterItemStatus INT, " +
        "  documentInterfaceType TINYINT, " +
        "  itemUnitName VARCHAR(50), " +
        "  itemStatus TINYINT)";

	insertEstructuraTablas("catalog");

	if (backUp != undefined) exportTable(sql);
	else {

	  db.transaction (function (transaction) 
	  {
	 
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
}

function getQueryInsertCatalog(data) {
	
	var q='INSERT OR IGNORE INTO catalog ( idItem , idPurchaseCenter , idVendor , idLogisticsChains ,  vendorReference , vendorStatus  , primaryVendorId , isElectronicVendor , isByEmailVendor , theoreticalStock ,  isAuthorizedVendor , ' +
 				' isPrimaryVendor ,  priceType , grossPrice , netPrice , sizeId , onCourseStock, inTransitStock , matQ1 , matQ2 , matQ3 , matQ4 , matQ5 , matQ6 , ' +
 				' matQ7 , matQ8 , matQ9 , matQ10 , matQ11 , matQ12 , matQ13 , '+
 				' currency , warehouseId , allowsPerUnitRequest ,   purchaseCenterItemStatus , itemStatus, documentInterfaceType , itemUnitName) '+
				' VALUES ("'+ data.itemId+'", "'+ data.purchaseCenterId+'", "'+ data.vendorId+'", "'+ data.logisticsChainId+'", "'+ data.vendorReference+'", "'+ data.vendorStatus+'", "'+ data.primaryVendorId+'", "'+ data.isElectronicVendor+'", "'+ data.isByEmailVendor+'", "'+ data.theoreticalStock+'", "'+ data.isAuthorizedVendor+'", '+
				' "'+ data.isPrimaryVendor+'", "'+ data.priceType+'", "'+ data.grossPrice+'", "'+ data.netPrice+'", "'+ data.sizeId+'", "'+ data.onCourseStock+'", "'+ data.inTransitStock+'", "'+ data.matQ1+'", "'+ data.matQ2+'", "'+ data.matQ3+'", "'+ data.matQ4+'", "'+ data.matQ5+'", "'+ data.matQ6+'", '+
				' "'+ data.matQ7+'", "'+ data.matQ8+'", "'+ data.matQ9+'", "'+ data.matQ10+'", "'+ data.matQ11+'", "'+ data.matQ12+'", "'+ data.matQ13+'", '+
				' "'+ data.currency+'", "'+ data.warehouseId+'", "'+ data.allowsPerUnitRequest+'", "'+ data.purchaseCenterItemStatus+'", "'+ data.itemStatus+'", "'+ data.documentInterfaceType+'", "'+ data.itemUnitName+'" )';

  return q;
  
}


function _createTableFamilies(backUp){
	
	 var sql = "CREATE TABLE IF NOT EXISTS families " +
	        " (idFirstFamily INT NOT NULL, " +
	        "  firstFamilyName VARCAR(50), " +
	        "  idSecondFamily INT , " +
	        "  secondFamilyName VARCAR(50), " +
	        "  idThirdFamily INT , " +
	        "  thirdFamilyName VARCAR(50) ) ";
	
	
	insertEstructuraTablas("families");
	
	if (backUp != undefined) exportTable(sql);
	else {
		
		db.transaction (function (transaction) 
	  {
	   
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
}

function getQueryInsertFamilies(data) {
	
  return 'INSERT OR IGNORE INTO families (idFirstFamily, firstFamilyName, idSecondFamily, secondFamilyName, idThirdFamily, thirdFamilyName) ' +
   ' VALUES ("'+ data.idFirstFamily+'", "'+ data.firstFamilyName+'", "'+ data.idSecondFamily+'",' + '"'+ data.secondFamilyName+'", "'+ data.idThirdFamily+'", "'+ data.thirdFamilyName+'")';
   
}


function getQueryInsertStatus(data) {
	
  return 'INSERT OR IGNORE INTO status (idStatus, description)  VALUES ('+ data.idStatus+', "'+ data.description+'")';
   
}

            
function _createTableOrders(backUp) {
  //console.log("Creando tabla Orders");
  
  var sql = "CREATE TABLE IF NOT EXISTS orders " +
        "(idOrder INTEGER NOT NULL PRIMARY KEY , " +
        "idVendor INT NOT NULL, " + 
        "idPurchaseCenter INT NOT NULL, " + 
        "idDeliveryZone VARCHAR(5), " + 
        "reference VARCHAR(15), " + 
				"status TINYINT NOT NULL, " + 
				"deliveryDate DATE, " + 
        "documentDate DATE, " + 
        "amount DECIMAL(10,3) DEFAULT 0, " + 
        "currency VARCHAR(5) DEFAULT '' , " +
        "number INT NOT NULL, " +
        "sourceId VARCHAR(1), " +  
        "type VARCHAR(1), " +
        "observaciones VARCHAR(150) DEFAULT '' )";
  
  insertEstructuraTablas("orders");
  
  if (backUp != undefined) exportTable(sql);
	else {
  	
	  db.transaction (function (transaction) 
	  {
	   	
	   	/*
	   	"number": 1072,  //?????
	    "sourceId": "T", //?????
	    "type": "P", //?????
	   	*/
	
	    
	    //console.log(sql)    ;
	    transaction.executeSql (sql, undefined, function ()
	    { 
	      //alert ("Table created");
	    }, error);
	  });
	}
}


function getQueryInsertOrder(data) {
	
	var tabla="orders";
	
	//if (localStorage['pModoCargaParcial']=="PO" || localStorage['pModoCargaParcial']=="TOTAL") { tabla="back_orders"; console.log("AQUI!!!! ") }
	
  var q= 'INSERT OR IGNORE INTO '+tabla+' (idOrder, idVendor, idPurchaseCenter , idDeliveryZone, reference , status , deliveryDate , documentDate , amount , currency , observaciones,  number , sourceId, type ) ' + 
  				'VALUES ('+ data.idInternal+', "'+ data.idVendor+'", "'+ data.idPurchaseCenter+'", "'+ data.idDeliveryZone+'", "'+ data.reference+'", "'+ data.status+'", "'+ data.deliveryDate+'", "'+ data.documentDate+'", "'+ data.amount+'", "'+ data.currency+'", "'+ data.observaciones+'", "'+ data.number+'","'+ data.sourceId+'","'+ data.type+'")';
  
  //console.log(localStorage['pModoCargaParcial']+"-->"+q);
  
  return q; 
}


function _createTableOrderDetails(backUp) {
	
  //console.log("Creando tabla Detalles");
 
 	var q = " CREATE TABLE IF NOT EXISTS ordersDetail ( " +
							" idOrder INT NOT NULL, "+
							" lineNumber SMALLINT NOT NULL, " + 
        " idItem INT NOT NULL, " +
				" itemName VARCHAR(150) NOT NULL, " +
				" itemStatus VARCHAR(1) NOT NULL, " +
				" quantity DECIMAL (10,3)  NOT NULL, "+
				" firstSizeId INT  DEFAULT 0, " + 
				" secondSizeId INT  DEFAULT 0, "+
				" unitType SMALLINT , "+
				" ordinalType SMALLINT , "+
				" idLogisticsChain VARCHAR(10) NOT NULL, " +
				" logisticsChainName VARCHAR(150) NOT NULL, " +
				" logisticsChainStatus VARCHAR(1) NOT NULL)";
 
 	insertEstructuraTablas("ordersDetail");
 	
 	if (backUp != undefined) exportTable(sql);
	else {
	  db.transaction (function (transaction) 
	  {						  
	    transaction.executeSql ( q, undefined, function ()
	    { 
	      //alert ("Table created");
	    }, error);
	  });
	}
}

function getQueryInsertOrderDetail(data) {
	
	var tabla="ordersDetail";
	//if (localStorage['pModoCargaParcial']=="PO" || localStorage['pModoCargaParcial']=="TOTAL") tabla="tmp_ordersDetail";  	
	
  var q= 'INSERT OR IGNORE INTO '+tabla+' (idOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus ) ' + 
  				'VALUES ('+ data.idOrder+', "'+ data.lineNumber+'", "'+ data.idItem+'", "'+ data.quantity+'", "'+ data.unitType+'", "'+ data.idLogisticsChain+'","'+ data.firstSizeId+'","'+ data.secondSizeId+'","'+ data.ordinalType+'","'+ data.itemName+'","'+ data.itemStatus+'","'+ data.logisticsChainName+'","'+ data.logisticsChainStatus+'")';
  		
  return q;
   
}

//////////////////////////////////////////////////////////////
function _createTableOrdersPending(backUp) {
  //console.log("Creando tabla Orders");
  
  var sql = "CREATE TABLE IF NOT EXISTS ordersPending " +
        "(idInternalOrder INTEGER NOT NULL PRIMARY KEY , " +
        "idVendor INT NOT NULL, " + 
        "idPurchaseCenter INT NOT NULL, " + 
        "idDeliveryZone VARCHAR(5), " + 
        "reference VARCHAR(15), " + 
				"status TINYINT , " + 
				"documentDate DATE, " + 
				"deliveryDate DATE, " + 
        "amount DECIMAL(10,3) DEFAULT 0, " + 
        "currency VARCHAR(5) DEFAULT '' , " +
        "number INT, " +
        "sourceId VARCHAR(1), " +  
        "type VARCHAR(1), " +
        "observaciones VARCHAR(150) DEFAULT '', "+
        "send VARCHAR(1), " +
        "unfinished BOOL DEFAULT TRUE, " +
        "username VARCHAR(50), " +
        "error VARCHAR(300) DEFAULT '', " +
        "lastSend DATE, " +
        "tipoInterno INT DEFAULT 0, " +
        "operacion VARCHAR(1), " +
       	"transactionCode VARCHAR(100) )";
  
  
  if (backUp != undefined)  { exportTable(sql); _createTableOrderPendingDetails(1); }
	else {
	  db.transaction (function (transaction) 
	  {
	   	
			//tipoInterno 0 = Order, 1=Template, 2=Draft
			//operaction  N = new, D = delete, M =modify
	   
	    transaction.executeSql (sql, undefined, function ()
	    { 
	    }, error);
	    
	    _createTableOrderPendingDetails();
	  });
	}
}


function getQueryInsertOrderPending(data, tipo, operacion) {
	
	if (tipo==undefined) { tipo=0; }
	if (operacion==undefined) { operacion="" } ;
	
  return 'INSERT OR IGNORE INTO ordersPending (idInternalOrder, idVendor, idPurchaseCenter , idDeliveryZone, reference , status , documentDate , amount , currency , observaciones,  number , sourceId, type, username, tipoInterno, operacion ) ' + 
  				'VALUES ('+ data.idInternal+', "'+ data.idVendor+'", "'+ data.idPurchaseCenter+'", "'+ data.idDeliveryZone+'", "'+ data.reference+'", "'+ data.status+'", "'+ data.documentDate+'", "'+ data.amount+'", "'+ data.currency+'", "'+ data.observaciones+'", "'+ data.number+'","'+ data.sourceId+'","'+ data.type+'", "'+localStorage['usuario']+'", "'+tipo+'", "'+operacion+'")';
   
}


function _createTableOrderPendingDetails(backUp) {
	
  console.log("Creando tabla Detalles");
  
  var q = " CREATE TABLE IF NOT EXISTS ordersPendingDetail ( " +
							" idInternalOrder INT NOT NULL, "+
							" lineNumber SMALLINT NOT NULL, " + 
        " idItem INT NOT NULL, " +
				" itemName VARCHAR(150) NOT NULL, " +
				" itemStatus VARCHAR(1) NOT NULL, " +
				" quantity DECIMAL (10,3)  NOT NULL, "+
				" firstSizeId INT  DEFAULT 0, " + 
				" secondSizeId INT  DEFAULT 0, "+
				" unitType SMALLINT , "+
				" ordinalType SMALLINT , "+
				" idLogisticsChain VARCHAR(10) , " +
				" logisticsChainName VARCHAR(150) , " +
				" logisticsChainStatus VARCHAR(1) )";
  
 	if (backUp != undefined) exportTable(sql);
	else {
	  db.transaction (function (transaction) 
	  {
	 				  
	    transaction.executeSql ( q, undefined, function ()
	    { 
	      //alert ("Table created");
	    }, error);
	  });
	}
}

function getQueryInsertOrderPendingDetail(data) {
	
  return 'INSERT OR IGNORE INTO ordersPendingDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus ) ' + 
  				'VALUES ('+ data.idOrder+', "'+ data.lineNumber+'", "'+ data.idItem+'", "'+ data.quantity+'", "'+ data.unitType+'", "'+ data.idLogisticsChain+'","'+ data.firstSizeId+'","'+ data.secondSizeId+'","'+ data.ordinalType+'","'+ data.itemName+'","'+ data.itemStatus+'","'+ data.logisticsChainName+'","'+ data.logisticsChainStatus+'")';
   
}


////////////////////////////////////////////////////////////////////////////////////
//BORRADORES
//////////////////////////////////////////////////////////////
function _createTableOrdersDraft(backUp) {
  //console.log("Creando tabla Orders");
  
  var sql = "CREATE TABLE IF NOT EXISTS ordersDraft " +
        "(idInternalOrder INTEGER NOT NULL PRIMARY KEY , " +
        "idVendor INT NOT NULL, " + 
        "idPurchaseCenter INT NOT NULL, " + 
        "idDeliveryZone VARCHAR(5), " + 
        "reference VARCHAR(15), " + 
				"status TINYINT NOT NULL, " + 
				"documentDate DATE, " + 
        "amount DECIMAL(10,3) DEFAULT 0, " + 
        "currency VARCHAR(5) DEFAULT '' , " +
        "number INT NOT NULL, " +
        "sourceId VARCHAR(1), " +  
        "type VARCHAR(1), " +
        "observaciones VARCHAR(150) DEFAULT '', "+
        "isGlobalScanner INT DEFAULT 0, " + 
        "username VARCHAR(50) )";
  
  if (backUp != undefined) { exportTable(sql); _createTableOrderDraftDetails(1); }
	else {
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    { 
	    }, error);
	    
	    _createTableOrderDraftDetails();
	    
	  });
	}
}


function getQueryInsertOrderDraft(data, param) {
  
  var global = param;
  console.log("Nos ha llegado un " + global + " para añadir como borrador");

  if (global=="1")
  return 'INSERT OR IGNORE INTO ordersDraft (idInternalOrder, idVendor, idPurchaseCenter , idDeliveryZone, reference , status , documentDate , amount , currency , observaciones,  number , sourceId, type, username, isGlobalScanner ) ' + 
          'VALUES ('+ data.idInternal+', "'+ data.idVendor+'", "'+ data.idPurchaseCenter+'", "'+ data.idDeliveryZone+'", "'+ data.reference+'", "'+ data.status+'", "'+ data.documentDate+'", "'+ data.amount+'", "'+ data.currency+'", "'+ data.observaciones+'", "'+ data.number+'","'+ data.sourceId+'","'+ data.type+'", "'+localStorage['usuario']+'", "1")';
   
	else
  return 'INSERT OR IGNORE INTO ordersDraft (idInternalOrder, idVendor, idPurchaseCenter , idDeliveryZone, reference , status , documentDate , amount , currency , observaciones,  number , sourceId, type, username ) ' + 
  				'VALUES ('+ data.idInternal+', "'+ data.idVendor+'", "'+ data.idPurchaseCenter+'", "'+ data.idDeliveryZone+'", "'+ data.reference+'", "'+ data.status+'", "'+ data.documentDate+'", "'+ data.amount+'", "'+ data.currency+'", "'+ data.observaciones+'", "'+ data.number+'","'+ data.sourceId+'","'+ data.type+'", "'+localStorage['usuario']+'")';
   
}


function _createTableOrderDraftDetails(backUp) {
	
  //console.log("Creando tabla Detalles");
  var q = " CREATE TABLE IF NOT EXISTS ordersDraftDetail ( " +
						" idInternalOrder INT NOT NULL, "+
						" lineNumber SMALLINT NOT NULL, " + 
        " idItem INT NOT NULL, " +
				" itemName VARCHAR(150) NOT NULL, " +
				" itemStatus VARCHAR(1) NOT NULL, " +
				" quantity DECIMAL (10,3)  NOT NULL, "+
				" firstSizeId INT  DEFAULT 0, " + 
				" secondSizeId INT  DEFAULT 0, "+
				" unitType SMALLINT , "+
				" ordinalType SMALLINT , "+
				" idLogisticsChain VARCHAR(10) NOT NULL, " +
				" logisticsChainName VARCHAR(150) NOT NULL, " +
				" logisticsChainStatus VARCHAR(1) NOT NULL)";
						
  if (backUp != undefined) { exportTable(sql); }
	else {
 
	  db.transaction (function (transaction) 
	  {
						  
	    transaction.executeSql ( q, undefined, function ()
	    { 
	    });
	  });
	}
}

function getQueryInsertOrderDraftDetail(data) {
	
  return 'INSERT OR IGNORE INTO ordersDraftDetail (idInternalOrder, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName , itemStatus , logisticsChainName , logisticsChainStatus  ) ' + 
  				'VALUES ('+ data.idOrder+', "'+ data.lineNumber+'", "'+ data.idItem+'", "'+ data.quantity+'", "'+ data.unitType+'", "'+ data.idLogisticsChain+'","'+ data.firstSizeId+'","'+ data.secondSizeId+'","'+ data.ordinalType+'","'+ data.itemName+'","'+ data.itemStatus+'","'+ data.logisticsChainName+'","'+ data.logisticsChainStatus+'")';
   
}

/////////////////////////////////////////////////////////////
function _createTableOrdersTemplate(backUp) {
  //console.log("Creando tabla Orders");
   var sql = "CREATE TABLE IF NOT EXISTS ordersTemplates " +
	        "(idTemplate INTEGER NOT NULL PRIMARY KEY , " +
	        "idVendor INT NOT NULL, " + 
	        "idPurchaseCenter INT NOT NULL, " + 
	        "idDeliveryZone VARCHAR(5), " + 
	        "reference VARCHAR(15), " + 
	        "documentDate DATE, " + 
	        "amount DECIMAL(10,3) DEFAULT 0, " + 
	        "currency VARCHAR(5) DEFAULT '' , " +
	        "number INT NOT NULL, " +
	        "sourceId VARCHAR(1), " +  
	        "type VARCHAR(1), " +
	        "status INT, " +
	        "name VARCHAR(150) DEFAULT '' )";
	
	insertEstructuraTablas("ordersTemplates");
	        
  if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	   
	    transaction.executeSql (sql, undefined, function ()
	    { 
	      
	    });
	  });
	}
}


function getQueryInsertOrdersTemplates(data) {
	
	if (data.status==undefined) { data.status=7; }
	
  return 'INSERT OR IGNORE INTO ordersTemplates (idTemplate, idVendor, idPurchaseCenter , idDeliveryZone, reference , name, amount , currency , name, documentDate , number, sourceId, type, status ) ' + 
   				'VALUES ('+ data.idTemplate+', "'+ data.idVendor+'", "'+ data.idPurchaseCenter+'", "'+ data.idDeliveryZone+'", "'+ data.reference+'", "'+ data.name+'", "'+ data.amount+'", "'+ data.currency+'", "'+ data.name+'", "'+ data.documentDate+'", "'+ data.number+'", "'+ data.sourceId+'", "'+ data.type+'", "'+ data.status+'" )';
   
}



function _createTableOrderTemplatesDetails(backUp) {
   var sql = " CREATE TABLE IF NOT EXISTS ordersTemplatesDetail " +
        "( idTemplate INT NOT NULL, " + 
       " lineNumber SMALLINT NOT NULL, " + 
        " idItem INT NOT NULL, " +
				" itemName VARCHAR(150) NOT NULL, " +
				" itemStatus VARCHAR(1) NOT NULL, " +
				" quantity DECIMAL (10,3)  NOT NULL, "+
				" firstSizeId INT  DEFAULT 0, " + 
				" secondSizeId INT  DEFAULT 0, "+
				" unitType SMALLINT , "+
				" ordinalType SMALLINT , "+
				" idLogisticsChain VARCHAR(10) NOT NULL, " +
				" logisticsChainName VARCHAR(150) NOT NULL, " +
				" logisticsChainStatus VARCHAR(1) NOT NULL)";
        
  
  insertEstructuraTablas("ordersTemplatesDetail");
        
  if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    { 
	      //alert ("Table created");
	    }, error);
	  });
	}
}


function getQueryInsertOrdersTemplatesDetail(data) {
	
  return 'INSERT OR IGNORE INTO ordersTemplatesDetail (idTemplate, lineNumber, idItem , quantity ,  unitType , idLogisticsChain, firstSizeId, secondSizeId,  ordinalType , itemName, itemStatus, logisticsChainName, logisticsChainStatus ) ' + 
  				'VALUES ('+ data.idTemplate+', "'+ data.lineNumber+'", "'+ data.idItem+'", "'+ data.quantity+'", "'+ data.unitType+'", "'+ data.idLogisticsChain+'","'+ data.firstSizeId+'","'+ data.secondSizeId+'","'+ data.ordinalType+'","'+ data.itemName+'","'+ data.itemStatus+'","'+ data.logisticsChainName+'","'+ data.logisticsChainStatus+'" )';
   
}



function _createTableItems(backUp) {
  //console.log("Creando tabla Detalles");
  
  var sql = " CREATE TABLE IF NOT EXISTS items " +
        "( idItem INT NOT NULL PRIMARY KEY, " + 
        "name VARCHAR(150), " + 
        "idFirstFamily VARCHAR(10), " + 
        "firstFamilyName VARCHAR(100), " + 
        "idSecondFamily VARCHAR(10), " + 
        "secondFamilyName VARCHAR(100), " + 
        "idThirdFamily VARCHAR(10), " + 
        "thirdFamilyName VARCHAR(100), " + 
        "status SMALLINT NOT NULL, " + 
        "artEsp SMALLINT, " + 
        "desArtEsp VARCHAR(25), " + 
        "desEstArt VARCHAR(25), " + 
        "desUdsFmt VARCHAR(25), " + 
        "type VARCHAR(1), " + 
        "typeName VARCHAR(25), " + 
        "itemUnitName VARCHAR(25), " + 
        "udsFmt VARCHAR(10))";
  
  insertEstructuraTablas("items");
  
  if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    { 
	    });
	  });
	}
}

function getQueryInsertItem(data){
	
	return 'INSERT OR IGNORE INTO items ( idItem, name , idFirstFamily , firstFamilyName, idSecondFamily , secondFamilyName , idThirdFamily , thirdFamilyName, status, artEsp , desArtEsp , desEstArt , desUdsFmt , type , typeName, udsFmt, itemUnitName ) ' +
				 'VALUES ("' + data.idItem +'","' + data.name +'","' + data.idFirstFamily +'","' + data.firstFamilyName +'","' + data.idSecondFamily +'","' + data.secondFamilyName +'","' + data.idThirdFamily +'","' + data.thirdFamilyName +'","' + 
				 data.status +'","' + data.artEsp +'","' + data.desArtEsp +'","' + data.desEstArt +'","' + data.desUdsFmt +'","' + data.type +'","' + data.typeName +'","' + data.udsFmt +'", "' + data.itemUnitName +'")' ;
	
}

function _createTableOrdersTemporal(backUp) {
  //console.log("Creando tabla Orders Temporal");
   var sql = "CREATE TABLE IF NOT EXISTS orders " +
	        "(idOrder INTEGER NOT NULL PRIMARY KEY , " +
	        "idVendor INT NOT NULL, " + 
	        "idPurchaseCenter INT NOT NULL, " + 
	        "idDeliveryZone VARCHAR(5), " + 
	        "reference VARCHAR(15), " + 
					"status TINYINT NOT NULL, " + 
					"deliveryDate DATE, " + 
	        "documentDate DATE, " + 
	        "amount DECIMAL(10,3) DEFAULT 0, " + 
	        "currency VARCHAR(5) DEFAULT '' , " +
	        "isTemplate BOOL  , " +
	        "number INT NOT NULL, " +
	        "sourceId VARCHAR(1), " +  
	        "type VARCHAR(1), " +
	        "send VARCHAR(1), " +
	        "observaciones VARCHAR(150) DEFAULT '' )";
  if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (sql, undefined, function ()
	    {  
	    });
	  });
	}
}

function _createTableOrderDetailsTemporal(backUp) {
	
  console.log("Creando tabla Detalles Temporales");
 	
 	var q = " CREATE TABLE IF NOT EXISTS ordersDetail ( " +
							" idOrder INT NOT NULL, "+
							" lineNumber SMALLINT NOT NULL, " + 
        " idItem INT NOT NULL, " +
				" itemName VARCHAR(150) NOT NULL, " +
				" itemStatus VARCHAR(1) NOT NULL, " +
				" quantity DECIMAL (10,3)  NOT NULL, "+
				" firstSizeId INT  DEFAULT 0, " + 
				" secondSizeId INT  DEFAULT 0, "+
				" unitType SMALLINT , "+
				" ordinalType SMALLINT , "+
				" idLogisticsChain VARCHAR(10) NOT NULL, " +
				" logisticsChainName VARCHAR(150) NOT NULL, " +
				" logisticsChainStatus VARCHAR(1) NOT NULL)";
 	
 	if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
				  
	    transaction.executeSql ( q, undefined, function ()
	    { 
	    });
	  });
	}
}


function _createTableLogisticChains(backUp){
	
	var sql = "CREATE TABLE IF NOT EXISTS logisticChains " +
        " (idVendor INT NOT NULL , " +
        "  idItem INT NOT NULL , " +
        "  idLogisticsChains VARCHAR(16) , " +
        "  logisticChainName VARCHAR(50), " +
        "  isPrimary INT , " +
        "  isAuthorizedVendor INT , " +
        "  ordinalType DECIMAL (10,3) , " +
        "  vendorReference VARCHAR(15), " +
        "  unitType INT , "+
        "  PRIMARY KEY (idVendor, idItem,  idLogisticsChains) )";

	insertEstructuraTablas("logisticChains");
	
	if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	    
	        
	    transaction.executeSql (sql, undefined, function ()
	    {       
	    }, error);
	  });
	}
}

function getQueryInsertLogisticChain(data) {
	
  var q= 'INSERT OR IGNORE INTO logisticChains (idItem, idVendor, idLogisticsChains, logisticChainName, isAuthorizedVendor, ordinalType, vendorReference, unitType, isPrimary ) VALUES ('+ data.idArticulo+', '+ data.idProveedor+', "'+ data.idCadenaLogistica+'",' +    
  '"'+ data.desCantidad+'", "'+ data.isAuthorizedVendor+'", "'+ data.ordinalType+'", "'+ data.vendorReference+'", "'+ data.unitType+'", "'+ data.isPrimary+'")';

  return q;
}

///////////////////////////////////////////////////////////////////////////////////////////////
// EANS

function _createTableEANS(backUp) {
  //console.log("Creando tabla Scopes");
  
  var q = " CREATE TABLE IF NOT EXISTS EANS ( " +
							" idEAN VARCHAR(20), "+
							" idItem INT NOT NULL, "+
							" idLogisticsChain VARCHAR(10) NOT NULL, "+
							" sizeId VARCHAR(10), "+
							" isMain BOOL, " +
							" status VARCHAR(1))";
							
							
  insertEstructuraTablas("EANS");
  							
  if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (q, undefined, function ()
		  { 
		  }, error);
  	});
  }
}


function  getQueryInsertEANS(data) {

  var q ='INSERT OR IGNORE INTO EANS (idEAN, idItem, idLogisticsChain , sizeId ,  isMain , status ) ' + 
  				'VALUES ("'+ data.idEAN+'", "'+ data.idItem+'", "'+ data.idLogisticsChain+'",  "'+ data.sizeId+'", "'+ data.isMain+'", "'+ data.status+'")';

  return q; 
}

function _createTableSettings(backUp) {
  console.log("Creando tabla Settings");
  
  var q = " CREATE TABLE IF NOT EXISTS settings ( " +
							" reference INT NOT NULL, "+
							" name VARCHAR(50), "+
							" value VARCHAR(20) NOT NULL)";
							
							
  insertEstructuraTablas("settings");
  							
  if (backUp != undefined) { exportTable(sql); }
	else {
  
	  db.transaction (function (transaction) 
	  {
	    transaction.executeSql (q, undefined, function ()
		  { 
		  }, error);
  	});
  }
}



function getValidarUsuario(usuario, pass){

	console.log("Usuario y password " + usuario + " " + pass);
  db.transaction (function (transaction) 
  {   

    var sql = "SELECT * FROM User WHERE usuario='"+usuario+"' AND pass='"+pass+"'";
 
    transaction.executeSql (sql, undefined, 
    function (transaction, result)
    {
      
      if (result.rows.length > 0)
      {
      //localStorage["ultimo_usuario"]=localStorage["usuario"]; // Guardamos el ultimo usuario que se ha logado
			//pMostrarPedidos();   
				//$.mobile.changePage($('#menu_principal'));	
      localStorage['pantalla']="menuPrincipal";
		  $.mobile.changePage('#menuPrincipal');	
      }
      else
      document.getElementById('loginDialogACmsg').innerHTML = "Error de autenticacion";	
 
    }, error);
   
  });
  
}

// checkUsuario (1): NO HAY DATOS // USUARIO DISTINTO Y MODO OFFLINE
// checkUsuario (2): EL USUARIO ES DISTINTO Y ESTAMOS ONLINE
// checkUsuario (3): EL USUARIO ES IGUAL, MODO ONLINE
// checkUsuario (4): EL USUARIO ES IGUAL, MODO OFFLINE

function checkUsuario(){	  
			console.log("Check Usuario");
	  	db.transaction (function (transaction) 
				{  
				var sql = "SELECT * FROM User"; 
		    transaction.executeSql (sql, undefined, 
		    function (transaction, result)
		    {   
		    	var usuario = localStorage.getItem('usuario');
					var pass = localStorage.getItem('pass'); 
		      if (result.rows.length > 0)
		      {
		       // Hay datos
		       console.log("HAY DATOS");
		      	for (var i = 0; i < result.rows.length; i++) 
    			  {
    			  	var u = result.rows.item (i);
    			  	var usuarioAnterior = u.usuario;
		      		var passAnterior = u.pass;
    			  }
		      	if ((usuarioAnterior == usuario) && (passAnterior==pass))
		      	{ //son iguales
		      		console.log("Datos coinciden");
							if ( localStorage['online']==1 )
							{ //estamos online DONE
								console.log("MODO ONLINE 3");
							localStorage.setItem('checkUsuario',"3") ;		
							getDescripcionAviso("loginOnline");
							$.mobile.changePage('#loginDialogAC', 'pop', true, true);
							}
							else
							{ // Offline DONE
							console.log("MODO OFFLINE 4");
							localStorage.setItem('checkUsuario',"4") ;	
							getDescripcionAviso("loginOfflinePregunta");
							$.mobile.changePage('#loginDialogAC', 'pop', true, true);	
							}
						}
						else if (passAnterior!=pass &&  localStorage['online']==0)
							errorCheckInicial(0);
						else
							errorCheckInicial(1);
		      }
		      else
		      {		     	
					errorCheckInicial(0);
					}
		 
		    },error);
	    });


}

function errorCheckInicial(val){
			if(val==0)
			{	 //DONE
				console.log("NO HAY DATOS 1");
			localStorage.setItem('checkUsuario',"1") ;
			getDescripcionAviso("loginOfflineNoData");
			$.mobile.changePage('#dialogA', 'pop', true, true);
			}
			else if(val==1)
			{	
				if ( localStorage['online']==1)
				{ 
					console.log("EL USUARIO ES DISTINTO Y ESTAMOS ONLINE 5");
					localStorage.setItem('checkUsuario',"5") ;	
					getDescripcionAviso("loginOnline");
					$.mobile.changePage('#loginDialogAC', 'pop', true, true);
				}
				else
				{ //DONE
					console.log("USUARIO DISTINTO Y MODO OFFLINE 2");
					localStorage.setItem('checkUsuario',"2") ;	
					getDescripcionAviso("loginOfflinePregunta");
					$.mobile.changePage('#loginDialogAC', 'pop', true, true);	
				}
			}

}




function exportDatabase() {
	
	$('#enviarBDTexto').val("Generando BD");
	$('#enviarBDTo').val("daniel.diaz@tech-impulse.com");
	$('#enviarBDSubject').val("Volcado BD");
	$('#enviarBDSubmit').css("visibility", "hidden");
	
	
	localStorage['bdDumpNTotal']=4;
	
	localStorage['bdDump']="";
	localStorage['bdDumpN']=0;
	
	_createTableUser(1); 
	_createTableLog(1);
	_createTableSecurity(1);
	_createTableScope(1);	
	/*
	_createTablePurchaseCenters(1);
	_createTableDeliveryZones(1);
	_createTablePurchaseCentersVendors(1);
	_createTableVendor(1);
	_createTableRelArticulos(1);
	_createTableRelCatalog(1);
	_createTableLogisticChains(1);
	_createTableItems(1);
	_createTableFamilies(1);
	_createTableOrders(1);
	_createTableOrderDetails(1);
	_createTableOrdersTemplate(1);
	_createTableOrderTemplatesDetails(1);
	_createTableOrdersPending(1);
	_createTableOrdersDraft(1);
	_createTableEstados(1);
	//_createTableEANS(1);
	
	*/
	
	
	//Hace falta esperar para obtener el resultado
	//console.log("----------------------------------");
	//console.log(localStorage['bdDump']);
	//console.log("----------------------------------");
	
	
	 //setTimeout(finalizarExportBD(), 6000) ;
	
}

function finalizarExportBD(){
	
	console.log("FINALL!!!!!");
	
	$('#enviarBDContenido').val(localStorage['bdDump']);

	//alert("llega aqui!!!!");

	//document.enviarBDForm.submit();
	
	
	
}


function exportTable(sql) {
     
   var t=sql.replace("CREATE TABLE IF NOT EXISTS","").trim();
   var tabla=t.substr(0,t.indexOf(" "));
   
   t=t.substr(t.indexOf("(") + 1).trim();

   var campos=[];
   var i=0;
   var index=0;
   
   while ( t.length > 0  && i < 10 ) {
   	
			   	
   		index=t.indexOf(" ");
   		if (index) {
   			
   			campos[i]=t.substr(0,index);
   			
   			t=t.substr(index + 1);
   			
   			//SI es de tipo decimal tiene una coma de mas
   			if ( t.substr(0,t.indexOf("(")).trim()=="DECIMAL" ) {
   					t=t.substr(t.indexOf(",")+1).trim();	
   			}
   			
   			
   			index=t.indexOf(",");
   
   			if ( index > 0 )  {
   				t=t.substr(t.indexOf(",")+1).trim();
   			} else {
   				//TERMINAR
   				t="";
   			}  
   			
   			i++;
   		} 
   		
   		//t="";		
   	
   }
   
   
   //PREPARAMOS LA CABECERA DEL INSERT
   
   var insert1="INSERT INTO "+tabla+" (";
		for (var j = 0; j < campos.length; j++) 
		{
				insert1=insert1+""+campos[j]+", ";
		}
		
		insert1=insert1.substr(0,insert1.length - 2)+") VALUES ";
   
   db.transaction (function (transaction) 
		{
	
			var sqlS = "SELECT * FROM "+tabla;
			var rowDb={};
			var l ="";
				
			transaction.executeSql (sqlS, undefined, 
				function (transaction, result)
				{
						for (var i = 0; i < result.rows.length; i++) 
						{
							rowDb = result.rows.item (i);
							l = "(";
							for (var j = 0; j < campos.length; j++) 
							{
									nomCampo=campos[j];
									
									l=l+"\""+rowDb[nomCampo]+"\", ";
									
							}
							
							
							
							l=l.substr(0,l.length - 2)+"), ";
							insert1+=l;
							//console.log(l);
						}
						
						insert1=insert1.substr(0,insert1.length - 2);
						//console.log("INSERT ==> " + insert1);
						
						localStorage['bdDump']=  localStorage['bdDump'] + " " + sql +"; " + insert1 +";";
						
						localStorage['bdDumpN']=parseInt(localStorage['bdDumpN'])+1;
						
						console.log("NUMERO ITERACION ==> "+localStorage['bdDumpN'] + " " + tabla) ;
						
						if (parseInt(localStorage['bdDumpN'])==parseInt(localStorage['bdDumpNTotal'])) {
							finalizarExportBD();
						}
						
				});
		});		

} 

function xxx() {
	
}


function recargaTotal() {
	
	//Cambiamos el nombre a tablas actuales	
	
	if(  localStorage['online']== 0 ) {
		
		getDescripcionAviso("errorSinConexion");
		$("#pedidosDialogA").popup("open");
		//alert("No es posible recargar los datos sin conexión");
	}
	
	
	
  else {
		var sqlS = "SELECT DISTINCT(nombre) as nombre FROM tablas";
	
		db.transaction ( 
		function (transaction) 
		{
			
			localStorage['recargaTotal']="recargaTotal";
			localStorage['errorEnCarga']=0;
			
			transaction.executeSql (sqlS, undefined, 
			function (transaction, result)
			{
				for (var i = 0; i < result.rows.length; i++) 
				{
					nombre = result.rows.item(i).nombre;
					
					console.log("ALTER TABLE "+nombre+" RENAME TO back_"+nombre);
					transaction.executeSql ("ALTER TABLE "+nombre+" RENAME TO back_"+nombre, [],  function (tx ) { } , errorAqui);
				}
			});
			
			
	       
				
		});
		setInterval(initDB(),200);
			
		//Hacemos la recarga
		setInterval(restServices(),300);		
	}		
			
	
				
	//ALTER TABLE personal RENAME TO personales;
	
	
	
	
}

function finalizarRecargaTotal() {
	
		var sqlS = "SELECT * FROM tablas";
		var nombre="";
		db.transaction ( 
		function (transaction) 
		{
			transaction.executeSql (sqlS, undefined, 
			function (transaction, result)
			{
	
	/*
				if (localStorage['errorEnCarga'] > localStorage['erroresCargaInicial'] ) {
					// Se ha producido algun error durante la carga Volvemos a la version antigua
					console.log("Se ha producido algun error durante la carga ==> "+localStorage['errorEnCarga']);
					
					
					for (var i = 0; i < result.rows.length; i++) 
							{
								nombre = result.rows.item(i).nombre;
								
								console.log("DROP TABLE "+nombre);
								transaction.executeSql ("DROP TABLE "+nombre, [],  function (transaction ) { 
									
									console.log("ALTER TABLE back_"+nombre+" RENAME TO "+nombre);
									
									transaction.executeSql ("ALTER TABLE back_"+nombre+" RENAME TO "+nombre, [],  function (tx ) { });
								});
								
							}
					
				} else {
					//TODO ok ==> Borrar el back!!
		*/			
							for (var i = 0; i < result.rows.length; i++) 
							{
								nombre = result.rows.item(i).nombre;
								
								console.log("DROP TABLE back_"+nombre);
										
										transaction.executeSql ("DROP TABLE back_"+nombre, [],  function () {
										
											//console.log("BORRADO !!!!");
										}, errorAqui);
								
							}
			//	}
			});
				
		});		
		
		console.log("Proceso de recarga todo OK!!!!");
	
	
}

function errorAqui(tx, error) {
	
		console.log(error);
}

function pBorrarPedidosPendientes() {


	if (localStorage["pantalla"] == "pedidosDetalleNuevoEscaner") // Eliminar todos los pedidos temporales en base a escaner
	{

		 pEliminarPedidoTemporal();

	} else { // Elimina el pedido actual

		db.transaction(function (transaction) {
			var sql = "";

			sql = "DELETE FROM ordersPending WHERE error=0 AND transactionCode='' "
			transaction.executeSql(sql, undefined, function () {
				sql = "DELETE FROM ordersPendingDetail WHERE ordersPendingDetail.idInternalOrder NOT IN (SELECT ordersPendingDetail.idInternalOrder FROM ordersPending  WHERE ordersPendingDetail.idInternalOrder=ordersPending.idInternalOrder)"
				transaction.executeSql(sql, undefined, function () {}, error);
			}, error);
		});

	}

}


function restaurarCopia(param) {
 //deleteDB();   

    console.log("EMPIEZA A RESTAURAR LA COPIA -----------------------------------");

		db.transaction ( 
		function (transaction) 
		{
            
      var sqlS = "SELECT DISTINCT(nombre) as nombre FROM tablas";
			
      localStorage['recargaTotal']="recargaTotal";
			localStorage['errorEnCarga']=0;
			
			transaction.executeSql (sqlS, undefined, 
			function (transaction, result)
			{
                
                //BORRAMOS LAS TABLAS 
				for (var i = 0; i < result.rows.length; i++) 
				{
					var t = "DROP TABLE IF EXISTS "+ result.rows.item(i).nombre;
				    console.log("BORRAMOS ==> "+t);
                    
                    transaction.executeSql ( t , [],  function (tx  ) { 
                        console.log("HECHO ");
  
                    } , errorAqui);

                    var q="ALTER TABLE back_"+result.rows.item(i).nombre+" RENAME TO "+result.rows.item(i).nombre;

                    console.log(q);

                    transaction.executeSql ( q, [],  function (tx ) {  console.log("HECHO 2222 "); } , errorAqui);
                      
				}
            });
	
		}); 

    
}
