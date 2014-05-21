/////////////////////////////////////////////////////////////////////////////////
// Muestra todos los Borradores
function pMostrarTodosBorradores() {
	//console.log("ALTA-PEDIDO:  BD listando Plantillas, Proveedor: " + provider + "Centro: "+center);
	
	pBorrarParametrosLocales();
	
	db.transaction (function (transaction) 
	{

		var sql = "SELECT o.*, p.name as centro, o.reference,  v.name as proveedor, o.username as username FROM ordersDraft as o, vendors as v , purchaseCenters as p WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter ";
		
		console.log("CONSULTA MOSTRAR BORRADORES " + sql);
		
		transaction.executeSql (sql, undefined, 
			function (transaction, result)
			{
				
				var pJsonPedidos = [];
				n_reg=0;
				
					for (var i = 0; i < result.rows.length; i++) 
					{
						var rowDb = result.rows.item (i);
												
							pJsonPedidos.push({
								
								cod_pedid: rowDb.reference,
								centroCompra: rowDb.centro,
								proveedor: rowDb.proveedor,
								fecha: formatearFechaHoraKendo(rowDb.documentDate),
								idInternalOrder:rowDb.idInternalOrder, 
								idInternalOrderVendor:rowDb.idVendor,
								idInternalOrderCenter:rowDb.idPurchaseCenter,
								username:rowDb.username
								
						  });
						  
						 	n_reg++;	
						 	
					} 
								
					var grid = $("#pGridBorradores").data("kendoGrid");
          
          if(grid!=null){ //destruimos el grid asi cuando cargamos no se duplique botones
          	 grid.destroy();		
				  }
				  
			  	localStorage["pedidos_pag_act"]=1;
					localStorage["pedidos_pag_max_row"]=localStorage.getItem("max_row_per_pag");
					var mr =parseInt(localStorage["pedidos_pag_max_row"]);
					
					localStorage["pedidos_pag_last"]=	Math.ceil(n_reg / parseInt(localStorage["pedidos_pag_max_row"]) );
				  
					console.log("Numero max por pag TODOS BORRADORES: filas xpagina"+localStorage.getItem("max_row_per_pag") + " " + localStorage["pedidos_pag_act"] + " / " + localStorage["pedidos_pag_last"] + " = " + mr );
					console.log("Numero de Registros Encontrados " + n_reg);
					
					 //TRADUCCIONES GRID 
	 				var nume = localStorage.getItem('num');
					var infor = localStorage.getItem('info');
					var prove = localStorage.getItem('pro');
					var emit = localStorage.getItem('emi');
					var entr = localStorage.getItem('ent');
					var imag = localStorage.getItem('ima');
					var conteng = localStorage.getItem('contenga');
					var empiez = localStorage.getItem('igual');
					var col = localStorage.getItem('columns');
					var fil = localStorage.getItem('filtro');
					var asc = localStorage.getItem('asc');
					var desc = localStorage.getItem('desc');
					var filtit = localStorage.getItem('filtitulo');
					var filtro = localStorage.getItem('fil');
					var limp = localStorage.getItem('lim');
					var proveedor = "proveedor";
					var username = localStorage.getItem('str_usuario');
					
					$("#pGridBorradores").kendoGrid({
		            dataSource:{
		            	data: pJsonPedidos,
			            schema: {
							        model: {
							            fields: {
							                centroCompra: { type: "string" },
							                cod_centr: { type: "string" },
							                cod_proveedo: { type: "string" },
							                proveedor: { type: "string"},
							                fecha: { type: "date"},
							                username: { type: "string"}
							            }
							        }
							    },
							    pageSize: mr
						    },
		            filterable: true,
		            scrollable: false,
		            selectable: true,
		            pageable: true,
		            sortable:false,
		            columns: [{
		                field: "centroCompra",
		                headerTemplate: "<div style='position: relative; float: left;'><a onclick='pPopUpFiltroBorradores(\"pGridBorradores\",\"centroCompra\",\"" + localStorage["str_centro"] + "\")' data-role='button' role='button'> " + localStorage["str_centro"] +"</a></div>" +
                            "<div style='position: relative; float: right;'> <a onclick='pPopUpFiltroBorradores(\"pGridBorradores\",\"centroCompra\",\"" + localStorage["str_centro"] + "\")' data-role='button' role='button'>" +
                            "<img id='centroCompraBorra' src='./images/icno_ordenable_filtrable.png' > </a></div>",
		                filterable:false,
		                title: localStorage["str_centro"],
		                width: '30%'
		            } , 
		            {
		                field: "proveedor",
		                headerTemplate: "<div style='position: relative; float: left;'><a onclick='pPopUpFiltroBorradores(\"pGridBorradores\",\"proveedor\",\"" + localStorage["str_proveedor"] + "\")' data-role='button' role='button'> " + localStorage["str_proveedor"] +"</a></div>" +
                            "<div style='position: relative; float: right;'> <a onclick='pPopUpFiltroBorradores(\"pGridBorradores\",\"proveedor\",\"" + localStorage["str_proveedor"] + "\")' data-role='button' role='button'>" +
                            "<img id='proveedorBorra' src='./images/icno_ordenable_filtrable.png' > </a></div>",
		                filterable:false,
		                title: localStorage["str_proveedor"],
		                width: '30%'
		            }, {
		                field: "fecha",
		                headerTemplate:"<div style='position: relative; float: left'><a onclick='ordenacionBorradores(\"pGridBorradores\",\"fecha\",\"ordeBorradores1\")' data-role='button' role='button'> " + localStorage["str_fechayhora"] + 
		                                " <img id='ordeBorradores1' src='./images/sort_both.png' > </a> </div>",
		                filterable:false,
		                format: formatoFecha(true),
		                title: localStorage["str_fechayhora"], 
		                width: '30%'
		            }, {
		                field: "username",
		                headerTemplate:"<div style='position: relative; float: left'><a onclick='ordenacionBorradores(\"pGridBorradores\",\"username\",\"ordeBorradores2\")' data-role='button' role='button'> " + localStorage["str_usuario"] + 
		                                " <img id='ordeBorradores2' src='./images/sort_both.png' > </a> </div>",
		                filterable:false,
		                title: localStorage["str_usuario"], 
		                width: '10%'
		            }]            
          		});
          		
               
          $('.k-grid-pager').hide();  
           localStorage['sortgrid']="0";
          ordenacionBorradores("pGridBorradores","fecha","ordeBorradores1");
          
          displayBorradores(); 
					
			}, error);			

	});
	
}	

//Construimos los popUps de los filtros segun la columna
//Segun si es un string una fecha o un icono
function pPopUpFiltroBorradores(Grid,nomColum,tituloColumna) {
		  
	  console.log("Estamos en: "+Grid+" "+ nomColum+" "+tituloColumna );
	  
	  var comp = pComprobarColumnaFiltrada(nomColum);
	  
	  console.log("Comparaciones es = "+comp);
	  
       var tituloCol = document.getElementById("tituloPopUpFiltro");
       tituloCol.innerHTML = localStorage["str_opciones_de_columna"] + tituloColumna;
        
        pMostrarIconoOrdenarBorra(Grid,nomColum, localStorage["tipoOrden"],"","");
        
        if(localStorage["columnaOrdena"]!=nomColum){
        	pMostrarIconoOrdenarBorra(Grid, nomColum, "0","","");
        	console.log("hemos cambiado de columna strings");
        }
         
        if( nomColum=="centroCompra" || nomColum== "proveedor" ){    
        	            
		        var dataSource = $("#"+Grid).data("kendoGrid").dataSource;
		        var filters = dataSource.filter();
		        var allData = dataSource.data();
		        var query = new kendo.data.Query(allData);
		        var dataa = query.filter(filters).data;
		
		        $("#pListaFiltroFechas").hide();
		        $("#pListaFiltroStrings").show();
		        $("#pListaFiltroEstados").hide();
				
						var contenedorPrincipal = document.getElementById("pListaFiltro");
		        $("#pListaFiltroStrings").empty();
		        var divp = document.createElement('div');
		        divp.id = 'pListaFiltroStrings';
		        contenedorPrincipal.appendChild(divp);
		
		        var contenedorFiltro = document.getElementById("pListaFiltroStrings");
		        var ul = document.createElement("ul");
		        ul.setAttribute("id", "pListaFiltros");
		        ul.setAttribute("data-role", "listview");
		        ul.setAttribute("data-theme", "a");
		        ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all ");
		
						//console.log("-----------------------");
						//console.log(dataa);
		
		        var datFiltrados = ordenarDatosLista(dataa, nomColum);
		        
		        //console.log("-----------------------");
						//console.log(datFiltrados);
						
						if (localStorage["columnaFiltrada"]!="") {
							var aux=JSON.parse(localStorage["columnaFiltrada"]);
							console.log( aux );
						}
						
		        for (var i = 0; i < datFiltrados.length; i++) {
		
		            var nombre = datFiltrados[i];
		            var li = document.createElement("li");
		            ul.appendChild(li);
		
		            var a = document.createElement("a");
		            a.setAttribute("href", "#");
		            		            
		            if ( filters != "undefined" && pComprobarColumnaFiltrada( nomColum )  ) {   
		            	 console.log("Limpiamos -------------------------------------------------");
		            	 a.setAttribute("onClick", "pLimpiarFiltroBorra('" + Grid + "','" + nomColum + "')"); 											 
		            }
		            else {		 
		            	console.log("Filtramos -------------------------------------------------");
		            	a.setAttribute("onClick", "pFiltroPersoBorra('" + Grid + "' , '" + nomColum + "',null,'" + nombre + "')"); 
		            }
		           
		            a.setAttribute("value","filtrar"+nomColum);
		            a.innerHTML = nombre;
		            li.appendChild(a);
		
		        }
		        
		        contenedorFiltro.appendChild(ul);
		        
		        $("#pListaFiltroStrings").trigger("create");
		        
		        var alt = $(window).height();
		        var altura = (alt) - 65 ;
		    
				    console.log("Altura: "+ altura+" altura pantalla: "+$(window).height);
				    
				    $('#pFiltroPopUpContent').css("max-height",(altura - 85)+"px");
				    $('#pFiltroPopUp').css("height",altura +"px");
		
		        $("#pFiltroPopUp").popup("open");

				}else {
								
	        $("#pListaFiltroFechas").hide();
	        $("#pListaFiltroStrings").hide();
	        $("#pListaFiltroEstados").hide();
	        
	        var alt = $(window).height();
	        var altura = (alt) - 125 ;
	    
			    console.log("Altura: "+ altura+" altura pantalla: "+$(window).height);
			    
			    $('#pFiltroPopUp').css("height",altura+"px");
							
				}
}

function pLimpiarFiltroBorra(Grid,nomColum,operator) {
	  //Eliminar unicamente el filtro que nos pasant
	 
	  console.log("pLimpiarFiltroBorra => "+Grid+" "+nomColum);

    var datasource = $("#"+Grid).data("kendoGrid").dataSource;
    var filtro = datasource.filter();
    
		datasource.filter([]);
		console.log(filtro);
		
		for (var i=0; i < filtro.filters.length; i++ ) {

				if (filtro.filters[i].field==nomColum) {
					if( filtro.filters[i].operator==operator ){
						filtro.filters.splice(i, 1);
          	datasource.filter(filtro);
				  } else if(filtro.filters[i].operator!=operator){
					filtro.filters.splice(i, 1);
          datasource.filter(filtro);
          }
				}      
    }
    
    //limpiamos el filtro
    $("#pFiltroPopUp").popup("close");

		//Para la paginaci�n
    var dataSource = $("#"+Grid).data("kendoGrid").dataSource;
    var allData = dataSource.data();

    localStorage["pedidos_pag_act"] = 1;
    var maxRowPag = localStorage.getItem("max_row_per_pag");
    localStorage["pedidos_pag_last"] = Math.ceil(allData.length / maxRowPag);

    displayBorradores();
    localStorage['pValorFiltroGrid'] = "0";
    
    var aux = [];
        
  	aux = JSON.parse(localStorage["columnaFiltrada"]);
  	var longitud = aux.length;
  	console.log("LONGITUD "+aux.length);
  	
		var x="";
    
    for(var j = 0 ;j<longitud ; j++){
    		if (aux[j].columna == nomColum) {
    			x=aux[j].columna;
    			console.log( aux );
    			pPintarIconoCabeceraGridBorra(Grid, x,localStorage["tipoOrden"], 1);
    			aux.splice(j,1);
    			localStorage["columnaFiltrada"]=JSON.stringify(aux);
    		}
    }
    
}

//////////////////////////////////////////////////////////////////////////////////////////////
//Inicializa los botones de ordenacion
function pMostrarIconoOrdenarBorra(Grid, nomColum, tipoOrden, tipoColumna, formatColumna) {
	
	  console.log("pMostrarIconoOrdenar => "+Grid+" "+nomColum+" "+tipoOrden+" "+tipoColumna+" "+formatColumna);

    var btnAsc = document.getElementById("pBtnPopUpAsc");
    var btnDesc = document.getElementById("pBtnPopUpDesc");
    var imgDesc = document.getElementById("pImgDesc");
    var imgAsc = document.getElementById("pImgAsc");
    
    //var tipoOrden = localStorage["tipoOrden"];

    if (tipoOrden == "asc") {
    	
        imgAsc.setAttribute("src", './images/icno_chec.png');
        imgDesc.setAttribute("src", '');
        btnAsc.setAttribute("onClick", "pOrdenacionColumnaBorra('" + Grid + "','" + nomColum + "' , '0' , '" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value","asc"+nomColum);
        btnDesc.setAttribute("onClick", "pOrdenacionColumnaBorra('" + Grid + "','" + nomColum + "', 'desc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value","0");
        console.log("Ordenado de manera asc y el value es = "+btnAsc.getAttribute("value"));
        localStorage["tipoOrden"]="asc";
        pPintarIconoCabeceraGridBorra(Grid,nomColum,tipoOrden);
        
    } else if (tipoOrden == "desc") {
    	
        imgDesc.setAttribute("src", './images/icno_chec.png');
        imgAsc.setAttribute("src", '');
        btnDesc.setAttribute("onClick", "pOrdenacionColumnaBorra('" + Grid + "','" + nomColum + "', '0' , '" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value","desc"+nomColum);
        btnAsc.setAttribute("onClick", "pOrdenacionColumnaBorra('" + Grid + "','" + nomColum + "', 'asc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value","0");
        console.log("Ordenado de manera desc y el value es = "+btnDesc.getAttribute("value"));
        localStorage["tipoOrden"]="desc";
        pPintarIconoCabeceraGridBorra(Grid,nomColum,tipoOrden);
        
    } else if ((tipoOrden == "0")) {
    	
    		imgAsc.setAttribute("src", '');
        imgDesc.setAttribute("src", '');
        btnAsc.setAttribute("onClick", "pOrdenacionColumnaBorra('" + Grid + "','" + nomColum + "', 'asc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value","0");
        btnDesc.setAttribute("onClick", "pOrdenacionColumnaBorra('" + Grid + "','" + nomColum + "', 'desc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value","0");
        localStorage["tipoOrden"]="0";
        pPintarIconoCabeceraGridBorra(Grid,nomColum,tipoOrden);
        console.log("Desordenadoooooooooooooooooooo");
    }

}

function pFiltroPersoBorra(Grid,pFila,pTipoFiltro,itemSeleccionado) {
	
	  var ultimoFiltro=[];
	  var ultimoFiltro2=[];
	  var extra=0;
	 	console.log("pFiltroPerso => "+Grid+" "+pFila+" "+pTipoFiltro+" "+itemSeleccionado);


 		$("#pFiltroPopUp").popup("close");
 		var operador="";
 		var operador2="";
 		var valor="";
 		var valor2="";
 		
	   ultimoFiltro =  { 
        field: pFila,
        operator: "eq",
        value: itemSeleccionado
	   };
	   
		 console.log("ENTRA EN STRING => "+itemSeleccionado);
    
		console.log(ultimoFiltro);
		
		if ( pFila == "centroCompra" || pFila == "proveedor" ) { 
				////////////////////////////////////////////////////////
				// Revisamos si existe el filtro, si es asi lo Borramos 
		    var dataSource = $("#"+Grid).data("kendoGrid").dataSource;
		    var filters = dataSource.filter();
		    
		    console.log("Tots els filtres");
		    console.log(filters);
		    
		    if (filters != undefined ) {
		    
			    for(var j = 0 ; j < filters.filters.length ; j++){
			    	
			    		if (filters.filters[j].field == pFila) {
			    			
			    			console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX " + j + " --> " +filters.filters[j].field);
			    			console.log(filters.filters);
			    			filters.filters.splice(j,1);
			    			console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYY " + j + "  " );
			    			console.log(filters.filters);
			    			j--;
			    		}
			    		
			    }
			  }
		    		
		    if (filters!=null) filters.filters.push(ultimoFiltro);
				else {
					
					filters={
		            logic: "and",
		            filters:  [ ultimoFiltro ]
		            };
				}
		
				if (extra==1) {
						filters.filters.push(ultimoFiltro2);
				}
				
				console.log("Filtros final");
				console.log(filters);
		
		    dataSource.filter(filters);
		    
		    var allData = dataSource.data();
		      
		    var query = new kendo.data.Query(allData);
		    var dataa = query.filter(filters).data;
		    
		    //console.log("DATOSSSSS PAGINAAAA FILTROOOOOO " + dataa.length);
		
		    //Refrescamos los botones de paginaci?n
		    localStorage["pedidos_pag_act"] = 1;
		    var maxRowPag = localStorage.getItem("max_row_per_pag");
		    //console.log("MAXXXXXXXXXXXXX ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  " + maxRowPag);
		    localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);
		    //console.log("LASSSSSTTTTTTTTTTT PAGEEEEEEEEEEEEEEEEEEEEE  " + localStorage["pedidos_pag_last"]);
		
	      //Refrescamos los botones de paginaci?n
	      localStorage["pedidos_pag_act"] = 1;
	      var maxRowPag = localStorage.getItem("max_row_per_pag");
	      //console.log("MAXXXXXXXXXXXXX ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  " + maxRowPag);
	      localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);
	      //console.log("LASSSSSTTTTTTTTTTT PAGEEEEEEEEEEEEEEEEEEEEE  " + localStorage["pedidos_pag_last"]);
	
	      displayBorradores();
	      //localStorage['pValorFiltroGrid'] = "1";
	        
	      var aux = [];
	      
	      if(localStorage["columnaFiltrada"]!=""){
		      aux = JSON.parse(localStorage["columnaFiltrada"]);
		      aux.push({columna: pFila});
	
	      } else 	aux.push({columna: pFila});
	      	
	    	localStorage["columnaFiltrada"] = JSON.stringify(aux);
	      
	      pPintarIconoCabeceraGridBorra(Grid,pFila,localStorage["tipoOrden"]);
    }
      
}

function pPintarIconoCabeceraGridBorra(nombreGrid,nombreColumna,ordenacion, limpiado) {
	
		console.log("pPintarIconoCabeceraGrid => "+nombreGrid+" "+nombreColumna+" "+ordenacion+ " " + localStorage['columnaFiltrada'] );

    if ((localStorage["columnaFiltrada"]!="")){
    	var aux = JSON.parse(localStorage["columnaFiltrada"]);
	    for(var j = 0;j<aux.length;j++){
	       if(aux[j].columna==nombreColumna){ 
	       	
	       		if (limpiado != null) {
	       				var imgGridHeader = document.getElementById(nombreColumna+"Borra");
                imgGridHeader.setAttribute("src", './images/icno_ordenable_filtrable.png');
	       		} else if (ordenacion == "0") {
		            var imgGridHeader = document.getElementById(nombreColumna+"Borra");
		            imgGridHeader.setAttribute("src", './images/icno_filtrado.png');
		            console.log("Hemos entrado al estado filtrar");
		        } else if (ordenacion == "desc") {
		            var imgGridHeader = document.getElementById(nombreColumna+"Borra");
		            imgGridHeader.setAttribute("src", './images/icno_filtroOrdenarDescOn.png');
		        } else if (ordenacion == "asc") { 
		            var imgGridHeader = document.getElementById(nombreColumna+"Borra");
		            imgGridHeader.setAttribute("src", './images/icno_filtroOrdenarAscOn.png');
		        } 
		     } 
	    }  
	    	
    }else {
    	if (ordenacion == "0") {
            var imgGridHeader = document.getElementById(nombreColumna+"Borra");
            imgGridHeader.setAttribute("src", './images/icno_ordenable_filtrable.png');
            console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " );
      } else if (ordenacion == "desc") {
          var imgGridHeader = document.getElementById(nombreColumna+"Borra");
          imgGridHeader.setAttribute("src", './images/icno_filtrado_descendente.png ');
          console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " );
      } else if (ordenacion == "asc") {
          var imgGridHeader = document.getElementById(nombreColumna+"Borra");
          imgGridHeader.setAttribute("src", './images/icno_filtrado_ascendente.png');
          console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " );
      } else {
      		console.log("KAKAKAKAKAAK");
      } 
      
      console.log("AQUI!!!!");
    }
    	 
}

////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes 
function pOrdenacionColumnaBorra(Grid, nombreColumna,tipoOrdenacion, tipoColumna, formatColumna) {
	
	  console.log("pOrdenacionColumna => "+Grid+" "+nombreColumna+" "+tipoOrdenacion+" "+tipoColumna+" "+formatColumna);
	  
	  if(localStorage["columnaOrdena"]=="") localStorage["columnaOrdena"]=nombreColumna;
	
    switch (tipoOrdenacion) {
    	
    case "asc":
    
    		if(localStorage["columnaOrdena"]!=nombreColumna){
        	pPintarIconoCabeceraGridBorra(Grid,localStorage["columnaOrdena"],"0");
        	console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        }
        
    		console.log("Ordenacion ascendente");
        var grid = $("#"+Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumna,
            type: tipoColumna,
            format: formatColumna,
            dir: "asc"
        });
        
				localStorage["columnaOrdena"]=nombreColumna;
				localStorage["tipoOrden"]=tipoOrdenacion;
				pPintarIconoCabeceraGridBorra(Grid, nombreColumna,"asc");
				pMostrarIconoOrdenarBorra(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);
				
				$("#pFiltroPopUp").popup("close");
        break;
   	 case "desc":
    
    		if(localStorage["columnaOrdena"]!=nombreColumna){
        	
        	pPintarIconoCabeceraGridBorra(Grid,localStorage["columnaOrdena"],"0");
        	console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        	
        }
        console.log("Ordenacion descendente");
        var grid = $("#"+Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumna,
            type: tipoColumna,
            format: formatColumna,
            dir: "desc"
        });
                
				localStorage["columnaOrdena"]=nombreColumna;
				localStorage["tipoOrden"]=tipoOrdenacion;
				pPintarIconoCabeceraGridBorra(Grid, nombreColumna,"desc");
				pMostrarIconoOrdenarBorra(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);
							
				$("#pFiltroPopUp").popup("close");
        break;
    case "0":
    		
    		if(localStorage["columnaOrdena"]!=nombreColumna){
        	
        	pPintarIconoCabeceraGridBorra(Grid,localStorage["columnaOrdena"],"0");
        	console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        	
        }
    		
        console.log("Ordenacion 0");
        $("#"+Grid).data("kendoGrid").dataSource.sort({
            field: nombreColumna
        });
        
        localStorage["columnaOrdena"]=nombreColumna;
        localStorage["tipoOrden"]="0";
        pPintarIconoCabeceraGridBorra(Grid, nombreColumna,"0");
        pMostrarIconoOrdenarBorra(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);
        				        
        $("#pFiltroPopUp").popup("close");
        
        break;
    }

}


////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes tabla borradores
function ordenacionBorradores(Grid,nombreColumna,idImagen) {
	
	var aux = localStorage.getItem('sortgrid'); 	
	
		switch (aux) {
			  case "0":
			    var grid = $("#"+Grid).data("kendoGrid");
						grid.dataSource.sort({
							field: nombreColumna, 
							type: "string",
							dir: "desc" 
					});
					grid.refresh();
					localStorage.setItem('sortgrid',"1");
					$('#'+idImagen).attr("src","./images/sort_desc.png");
			    break;
			  case "1":
			    var grid = $("#"+Grid).data("kendoGrid");
						grid.dataSource.sort({
							field: nombreColumna, 
							type: "string",
							dir: "asc" 
					});
					grid.refresh();
					localStorage.setItem('sortgrid',"2");
					$('#'+idImagen).attr("src","./images/sort_asc.png");
			    break;
			  case "2":
			    $("#"+Grid).data("kendoGrid").dataSource.sort({});
			    localStorage.setItem('sortgrid',"0");
			    $('#'+idImagen).attr("src","./images/sort_both.png");
			    break;
		}
				
}

function pMostrarDetalleBorrador(data, show)
{
	
  db.transaction (function (transaction) 
  {
		
		localStorage["pantalla_anterior"]="borradores";
		
		localStorage['pDetallePlantilla']=data;
		
    var sql = "SELECT DISTINCT o.*, v.name as proveedor, p.name as centro  FROM ordersDraft as o,  vendors as v , purchaseCenters as p WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.idInternalOrder='"+data+"'";
 		
 		var grid = $("#pGridDetalleBorrador").data("kendoGrid");
 		
 		if(grid!=null)
 		{//destruimos el grid asi cuando cargamos no se duplique botones
    	 grid.destroy();
    	 //$("#pGridPedidosAnteriores").remove();
    	 console.log("Destruidaaaaaaaaaaaaaaaaaaaaaaa");				
		}
									  
    transaction.executeSql (sql, undefined, 
    function (transaction, result)
    {
      
      if (result.rows.length)
      {
      	
				var preu;
			        
        for (var i = 0; i < result.rows.length; i++) 
        {
	    		var rowDb = result.rows.item (i);
	    		
	    		var formatPrecio = formatearMoneda(rowDb.amount);
      		/*if (localStorage['language']=="EN") { formatPrecio = "$"+formatPrecio;}
					else if (localStorage['language']=="ES") { formatPrecio = formatPrecio+"€";}*/
	   
	        $("#pTxtNuevoPedidoBorradorValoracion").val(formatPrecio); 
	        $("#pTxtNuevoPedidoBorradorProveedor").val(rowDb.proveedor);	        
	        $("#pTxtNuevoPedidoBorradorCentro").val(rowDb.centro);
	        $("#pTxtNuevoPedidoBorradorFecha").val(darFormatoSegunWS(rowDb.documentDate,true));             
        } 
         
         //Listado de articulos
	       //var sqlItem = "SELECT d.*, i.*, c.desCantidad FROM ordersDetail as d, items as i, catalog as c WHERE  d.idItem=i.idItem AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor="+rowDb.idVendor+ "  AND d.idOrder='"+data+"' "; 
	       //var sqlItem = "SELECT d.*, i.*, c.logisticChainName as desCantidad FROM ordersDraftDetail as d, items as i, catalog as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor="+rowDb.idVendor+ "  AND d.idInternalOrder='"+rowDb.idInternalOrder+"' ";
	       var sqlItem = "SELECT d.*, i.*, c.logisticChainName as desCantidad FROM ordersDraftDetail as d, items as i, logisticChains as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor="+rowDb.idVendor+ "  AND d.idInternalOrder='"+rowDb.idInternalOrder+"' ";
	       //as d LEFT OUTER JOIN items as i ON d.idItem=i.idItem  LEFT OUTER JOIN logisticChains as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND
	       
	       
	       
	       var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad, d.ordinalType as numUds, null as error_row, i.itemUnitName " +
                        " FROM ordersDraftDetail as d , items as i  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + rowDb.idVendor +  
                        " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
                        " WHERE d.idItem=i.idItem AND d.idInternalOrder='" + rowDb.idInternalOrder + "' ";
	       
	       console.log(" BORRADORES DETALLE SQL => "+sqlItem);
	       
	       transaction.executeSql (sqlItem, undefined, 
	          function (transaction, result)
	          {
	              if (result.rows.length)
	              {
	              	
							       		
										localStorage["pTemplateDetailIdItem"] = result.rows.item(0).idItem;
						        localStorage["pTemplateDetailQuantity"] = result.rows.item(0).quantity;
						        localStorage["pTemplateDetailIdLogisticsChain"] = result.rows.item(0).idLogisticsChain;
						        
						        console.log("DATOSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS "+ result.rows.item(0).idItem +" "+result.rows.item(0).quantity+ " " + result.rows.item(0).idLogisticsChain );
	              	
	              	  var n_reg=0;
										var pJsonPedidosDet = [];		
										var total=0;
										
                    for (var i = 0; i < result.rows.length; i++) 
                    {
                        var rowDb = result.rows.item (i);
                        
                        
                        if (rowDb.desCantidad==null || rowDb.desCantidad=="") { cadena=rowDb.itemUnitName; }
                        else cadena=rowDb.desCantidad;
                        	
                        total = parseFloat(rowDb.quantity) * parseFloat(rowDb.numUds);	
                        //total = parseInt(rowDb.quantity) * parseInt(rowDb.numUds);
                                                                 			
                  			pJsonPedidosDet.push({
							
														cod_articulo: rowDb.idItem,
														nom_articulo: rowDb.name,
														cant_pedida: rowDb.quantity,
														cadena_logistica: cadena,
														unidades_total: total
														
											  });
                  			n_reg=n_reg+1;      			
                    }
             
             				localStorage["pedidos_detalle_pag_act"]=1;
										if(show==true)
             				{
										localStorage["pedidos_detalle_pag_max_row"]=parseInt(localStorage["max_row_per_pag"]-3);
										console.log("Menos Borradores " + 	localStorage["pedidos_detalle_pag_max_row"]);
										}
										else
										{
										localStorage["pedidos_detalle_pag_max_row"]=parseInt(localStorage["max_row_per_pag"]-1);
										console.log("Mas Borradores " + 	localStorage["pedidos_detalle_pag_max_row"]);
										}
										localStorage["pedidos_detalle_pag_last"]=	Math.ceil(n_reg / parseInt(localStorage["pedidos_detalle_pag_max_row"]) );
             
            				var mr=parseInt(localStorage["pedidos_detalle_pag_max_row"]);
				  		
	 				 
					 					//TITULOS DE LA GRID 
						 				var codi = localStorage.getItem('cod');
										var des = localStorage.getItem('art');
										var prov = localStorage.getItem('ref');
										var cant = localStorage.getItem('can');
										var cade = localStorage.getItem('cad');
										var unid = localStorage.getItem('uni');
						 				 
						 				var cod = localStorage.getItem('cod');
						 				 
						 				var col = localStorage.getItem('columns');
										var fil = localStorage.getItem('filtro');
										var asc = localStorage.getItem('asc');
										var desc = localStorage.getItem('desc');
										
										var comienza = localStorage.getItem('comienza');
										var igual = localStorage.getItem('igual');
										var diferente = localStorage.getItem('diferente');
										
										var filtit = localStorage.getItem('filtitulo');
										
										var filtro = localStorage.getItem('fil');
										var limp = localStorage.getItem('lim');
					
					
										$("#pGridDetalleBorrador").kendoGrid({
					            
					            dataSource: {
					            	data: pJsonPedidosDet,
					            	schema: {
										        model: {	
										            fields: {
										                cod_articulo: { type: "integer" },
										                nom_articulo: { type: "string" },
										                cant_pedida: { type: "integer" },
										                cadena_logistica: {type: "string"},
										                unidades_total: {type: "integer"}
										            }
									        	}
									      },
					            	pageSize: mr
					            },
					            scrollable: false,
					            sortable: false,
					            filterable:true,
					            resizable: true,
					            pageable: true,
					            columns: [{
					                field: "cod_articulo",
					                headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDetalleBorrador(\"pGridDetalleBorrador\",\"cod_articulo\",\"integer\",\"sortDetBorr1\")' data-role='button' role='button'> " 
		                                 + cod + " <img id='sortDetBorr1' src='./images/sort_both.png' > </a> ", 
				                  title: cod,
				                  template: "<div class='ra'>#= cod_articulo #</div>",
				                  filterable: false,
					                width: '7%'
					            }, {
					                field: "nom_articulo",
					                headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDetalleBorrador(\"pGridDetalleBorrador\",\"nom_articulo\",\"string\",\"sortDetBorr2\")' data-role='button' role='button'> " 
		                                 + des + " <img id='sortDetBorr2' src='./images/sort_both.png' > </a> ", 
				                  title: des,
				                  filterable: false,
					                width: '50%'
					            }, 
					             {
					                field: "cant_pedida",
					                headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDetalleBorrador(\"pGridDetalleBorrador\",\"cant_pedida\",\"integer\",\"sortDetBorr3\")' data-role='button' role='button'> " 
		                                 + cant + " <img id='sortDetBorr3' src='./images/sort_both.png' > </a> ", 
				                  title: cant,
				                  template: "<div class='ra'>#= cant_pedida #</div>",
				                  filterable: false,
					                width: '7%'
					            }, {
					                field: "cadena_logistica",
					                headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDetalleBorrador(\"pGridDetalleBorrador\",\"cadena_logistica\",\"string\",\"sortDetBorr4\")' data-role='button' role='button'> " 
		                                 + cade + " <img id='sortDetBorr4' src='./images/sort_both.png' > </a> ", 
				                  title: cade,
				                  filterable: false,
					                width: '16%'
					            },{
					                field: "unidades_total",
					                headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDetalleBorrador(\"pGridDetalleBorrador\",\"unidades_total\",\"integer\",\"sortDetBorr5\")' data-role='button' role='button'> " 
		                                 + unid + " <img id='sortDetBorr5' src='./images/sort_both.png' > </a>", 
				                  title: unid,
				                  template: "<div class='ra'>#= unidades_total #</div>",
				                  filterable: false,
					                width: '7%'
					            }]
					          });
					          
					          $('.k-grid-pager').hide();
					          
                		//if (localStorage["pantalla"]=="pedidos_plantillas") { displayPlantillasDetalle();	} 
										//else { displayPedidoPlantillasDetalle(); }

 										displayDetalleBorradores();
        						
	              }
	
	          }, error);
	       	
	         
      } else {
      	
      	console.log("No falta algun dato");
      }
 
    }, error);

  
  });
  
  
}

function sortDetalleBorrador(grid,fila,tipo,imag) {

    var aux = localStorage.getItem('sortgrid');
    var grid = $("#"+grid).data("kendoGrid");
    
    switch (aux) {
    case "0":
        grid.dataSource.sort({
            field: fila,
            type: tipo,
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#'+imag).attr("src", "./images/sort_desc.png");

        break;
    case "1":
        grid.dataSource.sort({
            field: fila,
            type: tipo,
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#'+imag).attr("src", "./images/sort_asc.png");
        break;
    case "2":
        grid.dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#'+imag).attr("src", "./images/sort_both.png");
        break;
    }
    
}

function pGeneraTodosPedidosGlobalesBorradores(){
	
	var grid = $("#pGridNuevoPedido").data("kendoGrid");

		if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
			console.log("Destruida");
			$('#pGridNuevoPedido').data().kendoGrid.destroy();
			$('#pGridNuevoPedido').empty();
		}
	
	var IdBorrador = [];
	db.transaction(function (transaction) {
    var sql = "SELECT * FROM ordersDraft as d WHERE d.isGlobalScanner=1 GROUP BY idVendor ";   
    console.log("SQL ---> " + sql);
    transaction.executeSql(sql, undefined,
        function (transaction, result) {
            var i = 0;
			
            for (var i = 0; i < result.rows.length; i++) 
					{
						var rowDb = result.rows.item (i);
						IdBorrador.push({
							id:rowDb.idInternalOrder								
						  });
						pGuardarBorradorComoPedidoTemporal(rowDb.idInternalOrder,2,"no");
						console.log("Creamos los siguientes pedidos en base a los borradores globales" + i);
						
					}
			pGeneraTodosArticulosGlobalesBorradores(IdBorrador);
			updateFiltroProveedor();
        }, error6);
    });	
	
}

function pGeneraTodosArticulosGlobalesBorradores(Pedidos){
	


	db.transaction (function (transaction) 
	{
		var pos = 0;
		for (pos = 0; pos < Pedidos.length; pos++) {

			var sql = "SELECT * FROM ordersDraftDetail as d WHERE d.idInternalOrder='" + Pedidos[pos].id + "' ";   
			console.log("SQL ---> " + pos + " "  + sql);
			transaction.executeSql(sql, undefined,
				function (transaction, result) {
					var i = 0;
					var pJsonArticulos = [];
					var n_reg=0;

					for (var i = 0; i < result.rows.length; i++) 
						{
							var rowDb = result.rows.item (i);
							var cadena;
							var total = 0;
							if (rowDb.desCantidad==null || rowDb.desCantidad=="") { cadena=rowDb.itemUnitName; }
                        	else cadena=rowDb.desCantidad;
							total = parseInt(rowDb.quantity) * parseInt(rowDb.numUds);

								pJsonArticulos.push({
									//idReal: pos + parseInt(localStorage['pLastInternalOrder']);
									idItem: rowDb.idItem,
									nom_articulo: rowDb.name,
									cant_pedida: rowDb.quantity,
									cadena_logistica: cadena,
									unidades_total: total

							  });
							console.log("Añadimos los siguientes para el pedido con id: " + pos + " el articulo: " + rowDb.idItem );
							//pNuevoPedidoInsertarArticuloTemporal(rowDb.idItem, rowDb.quantity, cadena);
							var idReal = pos + parseInt(localStorage['pLastInternalOrder']);
						
							
							n_reg++;	

						} 

				}, error6);
		}
		
		pListaTodosArticulosGlobalesBorradores();
		
	});	
	
}



function pListaTodosArticulosGlobalesBorradores(){

		
	db.transaction (function (transaction) 
	{
			
 			var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad, d.ordinalType as numUds, null as error_row, i.itemUnitName " +
                        " FROM ordersPendingDetail as d , items as i  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains"+
                        " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idPurchaseCenter=" + localStorage["pNuevoPedidoIdCentro"] +  
                        " WHERE d.idItem=i.idItem";
			console.log("CONSULTA MOSTRAR DETALLE BORRADORES GLOBALES" + sqlItem);


			transaction.executeSql (sqlItem, undefined, 
				function (transaction, result)
				{

					var pJsonArticulos = [];
					var n_reg=0;

						for (var i = 0; i < result.rows.length; i++) 
						{
							var rowDb = result.rows.item (i);
							var cadena;
							var total = 0;
							if (rowDb.desCantidad==null || rowDb.desCantidad=="") { cadena=rowDb.itemUnitName; }
                        	else cadena=rowDb.desCantidad;
							total = parseInt(rowDb.quantity) * parseInt(rowDb.numUds);

								pJsonArticulos.push({

									cod_articulo: rowDb.idItem,
									nom_articulo: rowDb.name,
									cant_pedida: rowDb.quantity,
									cadena_logistica: cadena,
									unidades_total: total

							  });
							console.log("Añadimos los siguientes para el pedido con id: " + i + " el articulo: " + rowDb.idItem );
							//pNuevoPedidoInsertarArticuloTemporal(rowDb.idItem, rowDb.quantity, cadena);
							n_reg++;	

						} 
						
					/*
						localStorage["pedidos_detalle_pag_act"] = 1;
						localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"];
						localStorage["pedidos_detalle_pag_last"] = Math.ceil(1 / localStorage["pedidos_detalle_pag_max_row"]);
						*/
						localStorage["pedidos_detalle_pag_act"] = 1;
            localStorage["pedidos_detalle_pag_max_row"] =  Math.ceil(localStorage["pedidos_detalle_pag_max_row_min"]);
						localStorage["pedidos_detalle_pag_last"] = Math.ceil(pJsonArticulos.length / localStorage["pedidos_detalle_pag_max_row"]);
						$('#pLbCentroSeleccionado').text(" > "+localStorage.getItem('centro_seleccionado')+" > ");
						$('#pLbProveedorSeleccionado').text(localStorage.getItem('proveedor_seleccionado'));

						var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
						console.log("maximas filas en detalle pedido" + mr);

						//TITULOS DE LA GRID 
						var codi = localStorage.getItem('cod');
						var des = localStorage.getItem('art');
						var prov = localStorage.getItem('ref');
						var cant = localStorage.getItem('can');
						var cade = localStorage.getItem('cad');
						var unid = localStorage.getItem('uni');

						var cod = localStorage.getItem('cod');

						var col = localStorage.getItem('columns');
						var fil = localStorage.getItem('filtro');
						var asc = localStorage.getItem('asc');
						var desc = localStorage.getItem('desc');

						var comienza = localStorage.getItem('comienza');
						var igual = localStorage.getItem('igual');
						var diferente = localStorage.getItem('diferente');

						var filtit = localStorage.getItem('filtitulo');

						var filtro = localStorage.getItem('fil');
						var limp = localStorage.getItem('lim');
						
					
						var grid = $("#pGridNuevoPedido").data("kendoGrid");
					
						if ( grid != null ) { //destruimos el grid asi cuando cargamos no se duplique botones
							 console.log("Destruida");
							$('#pGridNuevoPedido').data().kendoGrid.destroy();
							$('#pGridNuevoPedido').empty();
						} else {
							 console.log("Destruida NOOOO"); 
						}
					
					
						$("#pGridNuevoPedido").kendoGrid({

							dataSource: {
					            	data: pJsonArticulos,
					            	schema: {
										        model: {	
										            fields: {
										                cod_articulo: { type: "string" },
										                nom_articulo: { type: "string" },
										                cant_pedida: { type: "string" },
										                cadena_logistica: {type: "string"},
										                unidades_total: {type: "string"}
										            }
									        	}
									      },
					            	pageSize: mr
					            },
							scrollable: false,
							sortable: true,
							filterable: true,
							pageable: true,
							columns: [{
								field: "cod_articulo",
								filterable: false,
								title: cod,
								width: '7%'
							}, {
								field: "nom_articulo",
								filterable: false,
								title: des,
								width: '50%'
							}, {
								field: "cant_pedida",
								filterable: false,
								title: cant,
								width: '7%'
							}, {
								field: "cadena_logistica",
								filterable: false,
								title: cade,
								width: '16%'
							}, {
								field: "unidades_total",
								filterable: false,
								title: unid,
								width: '7%'
							}, {
								field: "Eliminar",
								headerTemplate: "<div style='position: relative; float: center'> <a onclick='inactivo()' data-role='button' role='button'> " + "<img id='sortPedidosVendors' src='./images/papelera.png'> ",
								template: "<input type='checkbox' class='checkbox' />",
								filterable: false,
								title: "Eliminar",
								width: '7%'
							}]
						});


						$('.k-grid-pager').hide();

						/* ------------------------------------------------------------------
									Preparar entorno grafico
								*/
						//activate_buttons_header(1 , "Detalle de pedidos", 1);
						$("#tblDetallePedido_paginate").hide();
						$("#tblDetallePedido_filter").css("display", " none");
	
						displayDetalleNuevoPedidoEscaner();
						

				}, error);

		
  });
	
}