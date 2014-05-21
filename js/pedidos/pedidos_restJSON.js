function createTemporalTables(bloque) {
	
	if (bloque=="PO" || bloque=="") {
		
	 
  	 	
	  db.transaction (function (transaction) 
	  {
	  
	  	var q = "ALTER TABLE orders RENAME TO back_orders";
	  	var q0 = "ALTER TABLE ordersDetail RENAME TO back_ordersDetail";
	  	
	    var q1 = "CREATE TABLE IF NOT EXISTS orders " +
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
	        
  	  var q2 =" CREATE TABLE IF NOT EXISTS ordersDetail ( " +
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
	  	
	  	
	  	transaction.executeSql (q, undefined, function (transaction) { 
	  		
	  		transaction.executeSql (q1, undefined, function () { });
	  		
	  	});
	  	transaction.executeSql (q0, undefined, function (transaction) { 
	  		transaction.executeSql (q2, undefined, function () { })
	  	});
	  
	    //setTimeout(transaction.executeSql (q1, undefined, function () { }),500);
	    //setTimeout(transaction.executeSql (q2, undefined, function () { }),500);
	    
	  });
	}
}


function pCargarParcialPedidos() {
	
	if (localStorage['online']==1 ) {

        localStorage['pModoCargaParcial']="PO";
        localStorage['cargaError']=0;

        createTemporalTables("PO");


        console.log("MODO CARGA PARCIAL 1111111 "+localStorage['pModoCargaParcial']);
        $('#pCargaDatos').html('<img src="./images/loading.gif"> ');
        restAllOrdersJSON();
    }
	
}

function pFinalizarCargaParcial(){
	
	
	//alert("FINAL CARGAR");
	var q = [ ];
	var q1 = [ ];
	var i=0;
	if (localStorage['cargaError']=="0") {
		
		//TODO OK!!!!
		
		if (localStorage['pModoCargaParcial']=="PO") {
			
			//alert("DENTRO");
			
			
			var f_ini=nowBD().substr(0,10);
	
			var f_fin="";
			var n_meses_short=1;

			var a=f_ini.substr(0,4);
			var m=parseInt( f_ini.substr(5,2) ) - n_meses_short;
			var d=f_ini.substr(8,2);
			
			if ( m < 0 ) {
				m= (  12 + m );
				a=parseInt(a) - 1;	
			} 
			
			if (m < 10 ) m="0"+m;

			f_fin=a+"-"+m+"-"+d;
			
			
			
			q.push("INSERT OR IGNORE INTO orders SELECT * FROM back_orders WHERE documentDate < '"+f_fin+"'");	
			q.push("INSERT OR IGNORE INTO ordersDetail SELECT d.* FROM back_orders as o , back_ordersDetail as d WHERE o.idOrder=d.idOrder AND documentDate < '"+f_fin+"'");	
			
  		q1.push("DROP TABLE back_orders ");    
  	  q1.push("DROP TABLE back_ordersDetail ");

  	  
  	 	var qa;
		  
		  setTimeout(db.transaction (function (transaction) 
		  {
		  	console.log("INSERTAMOS LOS ANTIGUO");
		  	
		  	for (i=0; i < q.length; i++) {  	
			    	
			    	qa=q[i];
			    	
			    	console.log(qa);
				    
				    transaction.executeSql (qa, [],  function (tx) { 
				    	
				    	
				    }, errorAqui );
				    
				    //
		    }
		    
		    
		  }), 5000);
		  
		  
		  setTimeout( db.transaction (function (transaction) 
		  {
		  	
		  	console.log("BORRAMOS LAS TABLAS");
		  	
		  	for (i=0; i < q1.length; i++) {  	
			    	
			    	qa1=q1[i];
			    	
			    	console.log(qa1);
				    
				    transaction.executeSql (qa1, [],  function (tx) { 
				    	
				    	
				    }, errorAqui );
				    
				    //
		    }
		    
		    
		    var sql="SELECT o.idInternalOrder FROM ordersPending as o, ordersPendingErrors as e WHERE e.idOrder=o.idInternalOrder AND  SUBSTR(message,0,11) ='|(COD_TRN):'";
                console.log(sql);

                transaction.executeSql (sql, [],  function (transaction, result )
                {
                        var i=0;
                        var id=0;
                        for (var i = 0; i < result.rows.length; i++) {

                            id = result.rows.item(i).idInternalOrder;

                            q=" DELETE FROM ordersPendingDetailErrors WHERE  idOrder='"+id+"' ";
                            console.log(q);
                            transaction.executeSql (q, [],  function ()	{});

                            q=" DELETE FROM ordersPendingErrors WHERE  idOrder='"+id+"' ";
                            console.log(q);
                            transaction.executeSql (q, [],  function ()	{});

                            q=" DELETE FROM ordersPendingDetail WHERE  idInternalOrder='"+id+"' ";
                            console.log(q);
                            transaction.executeSql (q, [],  function ()	{});

                            q=" DELETE FROM ordersPending WHERE  idInternalOrder='"+id+"' ";
                            console.log(q);
                            transaction.executeSql (q, [],  function ()	{});

                        }

                });  

		    
		    
		    
		  }), 10000);
		  
		  
		  //transaction.executeSql (qa1, [],  function (tx) { }, errorAqui ),1500);
		  
			localStorage['pModoCargaParcial']="";
			
			//console.log("AQUI!!!!!!!!!!!!!!!");
			
			if (localStorage['pantalla']=="emitidos") { setTimeout(pMostrarPedidos(),10000); }
			
			setTimeout( $('#pCargaDatos').html('<img src="./images/btn_refresh.png">') , 11000 );
			
			setTimeout( localStorage['pModoCargaParcial']="", 10000 );
			
			
		}

	} else {
		console.log("error en la carga parcial");
		
		q.push("DROP TABLE orders ");    
  	q.push("DROP TABLE ordersDetail ");
  	
	  q.push("ALTER TABLE back_orders RENAME TO orders");
  	q.push("ALTER TABLE back_ordersDetail RENAME TO ordersDetail");
  	  
  	 	var qa;
		  db.transaction (function (transaction) 
		  {
		  	for (i=0; i < q.length; i++) {  	
			    	
			    	qa=q[i];
			    	console.log(qa);
				    setTimeout(transaction.executeSql (qa, [],  function (tx) { }, errorAqui ),200);
		    }
		    
		    
		  });
		//dropTemporalTables(localStorage['pModoCargaParcial']);
	}
	
}