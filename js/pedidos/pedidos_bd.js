
function pBorrarParametrosLocales() {

	localStorage['pantalla_anterior']="";
}


function pMostrarPedidos(fEstado) {

		//pRefrescarNotificaciones ();

		pBorrarPedidosSinFinalizar();
		pBorrarParametrosLocales();

    var filtroEstado = ""; 

    if (fEstado != undefined && fEstado != "") {
        filtroEstado = 'AND s.name="' + fEstado + '"';

    } else {
    	
    	// EN caso de no estar filtrado por EStado borramos la cabecera 
    	localStorage["pfiltroEstadosActicado"]="";
    	localStorage["columnaOrdena"]="";
    	localStorage["columnaFiltrada"]="";
    	if ($("#pGridPedidos").data("kendoGrid")) { pPintarIconoCabeceraGrid("pGridPedidos","estado_pedid","0", "1"); }
    }

    db.transaction(function (transaction) {

        var sql = "SELECT o.reference, o.documentDate, o.deliveryDate , p.name as centro,  v.name as proveedor, s.icon, p.shortName, d.name as zona, status as tieneError FROM ordersPending as o, vendors as v , purchaseCenters as p,  status as s, deliveryZones as d   WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.idPurchaseCenter=d.idPurchaseCenter AND d.idDeliveryZone=o.idDeliveryZone AND o.status=s.id AND o.tipoInterno="+TIPO_TEMPORAL_ORDER+" " + filtroEstado + " AND o.username='" + localStorage['usuario'] + "' AND o.unfinished=0 " +
            " UNION ALL " +
            " SELECT o.reference, o.documentDate, o.deliveryDate , p.name as centro,  v.name as proveedor, s.icon, p.shortName, d.name as zona, 0 as tieneError FROM orders as o, vendors as v , purchaseCenters as p,  status as s, deliveryZones as d WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.idPurchaseCenter=d.idPurchaseCenter AND d.idDeliveryZone=o.idDeliveryZone AND o.status=s.id " + filtroEstado + " ";

        console.log("CONSULTA MOSTRAR PEDIDOS " + sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                var pJsonPedidos = [];

                for (var i = 0; i < result.rows.length; i++) {
                    var rowDb = result.rows.item(i);
                    if (rowDb.deliveryDate == undefined) {
                        rowDb.deliveryDate = "";
                        
                    }

                    pJsonPedidos.push({

                        cod_pedid: rowDb.reference,
                        cod_centr: rowDb.shortName,
                        cod_zona: rowDb.zona,
                        cod_proveedo: rowDb.proveedor,
                        fecha_emisio: formatearFechaHoraKendo(rowDb.documentDate),
                        fecha_entreg: formatearFechaKendo(rowDb.deliveryDate),
                        estado_pedid: rowDb.icon,
                        mensaje: rowDb.tieneError

                    });

                }
                
                var grid = $("#pGridPedidos").data("kendoGrid");
                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                     $("#pGridPedidos").data().kendoGrid.destroy();
		                    $("#pGridPedidos").empty();
                }


                var mr = parseInt(localStorage.getItem("max_row_per_pag"));

                
                //TRADUCCIONES GRID 
                var nume = localStorage.getItem('num');
                var infor = localStorage.getItem('info');
                var prove = localStorage.getItem('pro');
                var emit = localStorage.getItem('emi');
                var entr = localStorage.getItem('ent');
                var imag = localStorage.getItem('ima');
                var conteng = localStorage.getItem('contenga');
                var filtro = localStorage.getItem('fil');
                var limp = localStorage.getItem('lim');

								localStorage["Grid"]="pGridPedidos";

                $("#pGridPedidos").kendoGrid({
                    dataSource: {
                        data: pJsonPedidos,
                        schema: {
                            model: {
                                fields: {
                                    cod_pedid: {
                                        type: "string"
                                    },
                                    cod_centr: {
                                        type: "string"
                                    },
                                    cod_zona: {
                                        type: "string"
                                    },
                                    cod_proveedo: {
                                        type: "string"
                                    },
                                    fecha_emisio: {
                                        type: "date"
                                    },
                                    fecha_entreg: {
                                        type: "date"
                                    },
                                    estado_pedid: {
                                        type: "string"
                                    }
                                }
                            }
                        },
                        pageSize: mr
                    },
                    scrollable: false,
                    selectable: true,
                    resizable: false,
                    filterable: true,
                    pageable: true,
                    sortable: false,
                    columns: [{
                        field: "cod_pedid",
                        headerTemplate:"<div style='position: relative; float: left'><a onclick='sortDetEm()' data-role='button' role='button'> " + nume + " <img id='sortPedidosDetEmi' src='./images/sort_both.png' > </a> " +
                                            " </div> <div style='position: relative; float: right'> <a data-role='button' role='button'>" +
                                            "  </a></div>",
                        title: nume,
                        template: "<div class='ra'>#= cod_pedid #</div>",
                        filterable: false,
                        width: getAnchoCol("cod_pedid")
                    }, {
                        field: "cod_centr",
                        title: infor,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left;'><a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"cod_centr\",\"strings\",\"" + infor + "\")' data-role='button' role='button'> " + infor +"</a></div>" +
                            "<div style='position: relative; float: right;'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"cod_centr\",\"strings\",\"" + infor + "\")' data-role='button' role='button'>" +
                            "<img id='cod_centr' src='./images/icno_ordenable_filtrable.png' > </a></div>",
                        width: getAnchoCol("cod_centr")
                    }, {
                        field: "cod_zona",
                        title: "Zona",
                        filterable: false,
                        hidden: mostrarFila(),
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"cod_zona\",\"strings\",\"Zona\")' data-role='button' role='button'> " + "Zona" + " </a>" +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"cod_zona\",\"strings\",\"Zona\")' data-role='button' role='button'>" +
                            "<img id='cod_zona' src='./images/icno_ordenable_filtrable.png' > </a></div>",
                        width: getAnchoCol("cod_zona")
                    }, {
                        field: "cod_proveedo",
                        title: prove,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"cod_proveedo\",\"strings\",\"" + prove + "\")' data-role='button' role='button'> " +
                            prove + "</a>" +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"cod_proveedo\",\"strings\",\"" + prove + "\")' data-role='button' role='button'>" +
                            "<img id='cod_proveedo' src='./images/icno_ordenable_filtrable.png' > </a> </div>",
                        width: getAnchoCol("cod_proveedo")
                    }, {
                        field: "fecha_emisio",
                        title: emit,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'><a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"fecha_emisio\",\"date\",\"" + emit + "\")' data-role='button' role='button'> " + emit + " </a>" +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"fecha_emisio\",\"date\",\"" + emit + "\")' data-role='button' role='button'>" +
                            " <img id='fecha_emisio' src='./images/icno_ordenable_filtrable.png' > </a></div>",
                        //format: formatoFecha("fecha_emisio"),
                        format: formatoFecha(true),
                        //template: "#= kendo.toString(kendo.parseDate(fecha_emisio, 'yyyy-MM-dd HH:mm'), '"+kendoDateFormat()+" HH:mm') #",
                        width: getAnchoCol("fecha_emisio")
                    }, {
                        field: "fecha_entreg",
                        title: entr,
                        filterable: false,
                        headerTemplate: "<div style='position: relative; float: left'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"fecha_entreg\",\"date\",\"" + entr + "\")' data-role='button' role='button'> " + entr + "</a> " +
                            " </div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"fecha_entreg\",\"date\",\"" + entr + "\")' data-role='button' role='button'>" +
                            "<img id='fecha_entreg' src='./images/icno_ordenable_filtrable.png' > </a></div>",
                        //template: "#= kendo.toString(kendo.parseDate(fecha_emisio, 'yyyy-MM-dd HH:mm'), '"+kendoDateFormat()+"') #",
                        format: formatoFecha(),
                        width: getAnchoCol("fecha_entreg")
                    }, {
                        field: "estado_pedid",
                        headerTemplate: "<div style='position: relative; float: left'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"estado_pedid\",\"estado\",\"Estado\")' data-role='button' role='button'> " + "Sts."  +
                            "</div> <div style='position: relative; float: right'> <a onclick='pPopUpFiltroColumna(\"pGridPedidos\",\"estado_pedid\",\"estado\",\"Estado\")' data-role='button' role='button'>" +
                            " <img id='estado_pedid' src='./images/icno_ordenable_filtrable.png' > </a></div>",
                        filterable: false,
                        sortable: false,
                        width: getAnchoCol("estado_pedid"),
                        template: "#=getIconoStatus(estado_pedid)#"
                    },{
                        field: "mensaje",
                        filterable: false,
                        sortable: false
                    }]
                });


								console.log("FORMATO FECHA = " + formatoFecha("fecha_emisio"));

                $('.keyboard').blur(); //escondemos el teclado                    
                $('.k-grid-pager').hide(); //escondemos la paginacion de kendo  
                //$('#pGridPedidos .k-grid table').css("table-layout","fixed");
                
                var grid2 = $("#pGridPedidos").data("kendoGrid");
                
                grid2.hideColumn("mensaje");        
                
                
                ////////////////////////////////////////
                // NAVEGACION    
                $.mobile.changePage('#seccion_pedidos');
                localStorage["pedidos_pag_act"] = 1; // Alain, inicializamos la pagina actual
                localStorage["pedidos_pag_max_row"] = parseInt(localStorage["max_row_per_pag"]);
                localStorage["pedidos_pag_last"] = Math.ceil(result.rows.length / parseInt(localStorage["pedidos_pag_max_row"]));
                
                
               
								//pLimpiarFiltro("pGridPedidos","estado_pedid");
//pLimpiarFiltro('pGridPedidos','estado_pedid');

								pOrdenacionColumna("pGridPedidos", "fecha_emisio","desc", "date", formatoFecha("fecha_entreg") );
								
								//pPintarIconoCabeceraGrid("pGridPedidos","estado_pedid","0", "1");
								
                displayPedidosEmitidos(); // Show/hide Divs

            }, errorMostrar);


        localStorage.setItem('sortgrid', "0");

    });
    
}


function getIconoStatus(status) {
    return '<img src="./images/' + status + '">';
}

function errorMostrar() {
    //console.log("ERROR EN EL SELECT !!!!!!");
}

function mostrarFila() {
    var usuario = localStorage['multiplesZonasEntrega'];
    if ((usuario == "0")) {
        return 'true';
    } else if ((usuario == "1")) {
        return false;
    }
}
 
function sortDetEm() {

    var aux = localStorage.getItem('sortgrid');
    var grid = $("#pGridPedidos").data("kendoGrid");
    
    switch (aux) {
    case "0":
        grid.dataSource.sort({
            field: "cod_pedid",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosDetEmi').attr("src", "./images/sort_desc.png");

        break;
    case "1":
        grid.dataSource.sort({
            field: "cod_pedid",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosDetEmi').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidos").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosDetEmi').attr("src", "./images/sort_both.png");
        break;
    }
}


//Construimos los popUps de los filtros segun la columna
//Segun si es un string una fecha o un icono
function pPopUpFiltroColumna(Grid, nomColum, tipo, tituloColumna) {
		  
	  //console.log("Estamos en la columna: " + nomColum +" tipo: "+tipo );
	  
	  var comp = pComprobarColumnaFiltrada(nomColum);
	  
	  //console.log("Comparaciones es = "+comp);
	  
    switch (tipo) {
    	
    	case "strings":
    	
        var tituloCol = document.getElementById("tituloPopUpFiltro");
        tituloCol.innerHTML = localStorage["str_opciones_de_columna"] + tituloColumna;
        
        pMostrarIconoOrdenar(Grid,nomColum, localStorage["tipoOrden"],"","");
        
        if(localStorage["columnaOrdena"]!=nomColum){
        	pMostrarIconoOrdenar(Grid, nomColum, "0","","");
        }
         
        if(nomColum=="cod_proveedo" || nomColum== "cod_centr"|| nomColum== "cod_zona"){                
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

        var datFiltrados = ordenarDatosLista(dataa, nomColum);
        				
				if (localStorage["columnaFiltrada"]!="") {
					var aux=JSON.parse(localStorage["columnaFiltrada"]);
					//console.log( aux );
				}
				
        for (var i = 0; i < datFiltrados.length; i++) {

            var nombre = datFiltrados[i];
            var li = document.createElement("li");
            ul.appendChild(li);

            var a = document.createElement("a");
            a.setAttribute("href", "#");
            
            if (filters != null && pComprobarColumnaFiltrada( nomColum )  ) {    a.setAttribute("onClick", "pLimpiarFiltro('" + Grid + "','" + nomColum + "')"); 											 }
            else 									{		 a.setAttribute("onClick", "pFiltroPerso('" + Grid + "' , '" + nomColum + "',null,'" + nombre + "')"); }
           
            a.setAttribute("value","filtrar"+nomColum);
            a.innerHTML = nombre;
            li.appendChild(a);

        }
        
        contenedorFiltro.appendChild(ul);
        
        $("#pListaFiltroStrings").trigger("create");
        
        var alt = $(window).height();
        var altura = (alt) - 65 ;
    
		    //console.log("Altura: "+ altura+" altura pantalla: "+$(window).height);
		    
		    $('#pFiltroPopUpContent').css("max-height",(altura - 85)+"px");
		    $('#pFiltroPopUp').css("height",altura +"px");

        $("#pFiltroPopUp").popup("open");

			}else {
								
        $("#pListaFiltroFechas").hide();
        $("#pListaFiltroStrings").hide();
        $("#pListaFiltroEstados").hide();
        
        var alt = $(window).height();
        var altura = (alt) - 125 ;
    
		    //console.log("Altura: "+ altura+" altura pantalla: "+$(window).height);
		    
		    $('#pFiltroPopUp').css("height",altura+"px");
								
			}
        break;

     case "date":
     		
        pMostrarIconoOrdenar(Grid,nomColum, localStorage["tipoOrden"],"","");
     		
     		if(localStorage["columnaOrdena"]!=nomColum){
        	pMostrarIconoOrdenar(Grid, nomColum, "0","","");
        	$(".k-datepicker input").val('');
        }
        
        //pMostrarIconoOrdenar(Grid,nomColum, localStorage["tipoOrden"],"","");

        var tituloCol = document.getElementById("tituloPopUpFiltro");
        tituloCol.innerHTML = localStorage["str_opciones_de_columna"] + tituloColumna;
        
        localStorage['fila'] = nomColum;
        $("#pListaFiltroFechas").show();
        $("#pListaFiltroStrings").hide();
        $("#pListaFiltroEstados").hide();

        $("#pListaFiltroFechasInicio").kendoDatePicker({
            format: "dd-MM-yyyy"
        }).data("kendoDatePicker");

        $("#pListaFiltroFechasFin").kendoDatePicker({
            format: "dd-MM-yyyy"
        }).data("kendoDatePicker");

        $("#pFiltroPopUp").popup("open");

        break;

     case "estado":
     
     		pMostrarIconoOrdenar(Grid,nomColum, localStorage["tipoOrden"],"","");
     		
     		if(localStorage["columnaOrdena"]!=nomColum){
        	pMostrarIconoOrdenar(Grid, nomColum, "0","","");
        }

        var tituloCol = document.getElementById("tituloPopUpFiltro");
        tituloCol.innerHTML = localStorage["str_opciones_de_columna"] + tituloColumna;

        $("#pListaFiltroFechas").hide();
        $("#pListaFiltroStrings").hide();
        $("#pListaFiltroEstados").show();

        db.transaction(function (transaction) {

            var sql = "SELECT o.reference, o.documentDate, o.deliveryDate , p.name as centro,  v.name as proveedor, s.icon, p.shortName, d.name as zona FROM ordersPending as o, vendors as v , purchaseCenters as p,  status as s, deliveryZones as d WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND d.idDeliveryZone=o.idDeliveryZone AND o.status=s.id AND o.username='" + localStorage['usuario'] + "' AND o.unfinished=0 " +
                " UNION ALL " +
                " SELECT o.reference, o.documentDate, o.deliveryDate , p.name as centro,  v.name as proveedor, s.icon, p.shortName, d.name as zona FROM orders as o, vendors as v , purchaseCenters as p,  status as s, deliveryZones as d WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND d.idDeliveryZone=o.idDeliveryZone AND o.status=s.id ";

            //console.log("CONSULTA MOSTRAR PEDIDOS " + sql);

            transaction.executeSql(sql, undefined,
                function (transaction, result2) {

                    var Aux = [];
                    for (var k = 0; k < result2.rows.length; k++) {
                        var rowDb = result2.rows.item(k);
                        Aux.push(rowDb.icon);
                    }

                    var datFiltrados = ordenarDatosLista(Aux, null);

                    var sql = "SELECT s.name,s.icon FROM status as s ORDER BY name";

                    transaction.executeSql(sql, undefined,
                        function (transaction, result) {
                            var listaOK = [];

                            for (var i = 0; i < result.rows.length; i++) {

                                var item = result.rows.item(i);

                                for (var j = 0; j < datFiltrados.length; j++) {
                                    var n = 0;
                                    var n = datFiltrados[j].localeCompare(item.icon);

                                    //console.log("COMPARANDO = " + datFiltrados[j] + " " + item.icon);

                                    if (n == 0) {
                                        listaOK.push({
                                            nom: item.name,
                                            ico: item.icon
                                        });
                                        break;
                                    }
                                }
                            }

                            listaOK = listaOK.sort();

                            var contenedorPrincipal = document.getElementById("pListaFiltro");
                            $("#pListaFiltroEstados").empty();
                            var divp = document.createElement('div');
                            divp.id = 'pListaFiltroEstados';
                            contenedorPrincipal.appendChild(divp);

                            var contenedorFiltroEstados = document.getElementById("pListaFiltroEstados");
                            var ul = document.createElement("ul");
                            ul.setAttribute("id", "pListaFiltrosUL");
                            ul.setAttribute("data-role", "listview");
                            ul.setAttribute("data-theme", "a");
                            ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all");
														contenedorFiltroEstados.appendChild(ul);

														var ini=0;
                            for (var x = 0; x < listaOK.length; x++) {

                                var nombre = listaOK[x].nom;
                                var li = document.createElement("li");
                                //ul.appendChild(li);

                                var img = document.createElement("img");
                                img.setAttribute("src", "./images/" + listaOK[x].ico);
                                //li.appendChild(img);

                                var a = document.createElement("a");
                                var imgClick = document.createElement("img");

                                //console.log(" AQUI ==> " + localStorage["pfiltroEstadosActicado"] + "==" + nombre);
												
                                if ( localStorage["pfiltroEstadosActicado"] == nombre) {

                                		var l='<li style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #bfc0c3; border-top-width: 0; border-left-width: 0; border-right-width: 0; padding-bottom: 5px; padding-top:10px">'+
                                					'<div class="ui-grid-b"> '+
                                					'<div class="ui-block-a" style="width:10%; text-align:left;"><a href="#" class="pLinkFiltroEstados" onclick="pLimpiarFiltro(\''+Grid+'\',\'estado_pedid\')" value="'+nombre+'"> <img src="./images/'+listaOK[x].ico+'"> </a></div>'+
                                					'<div class="ui-block-b" style="width:70%; text-align:left;"><a href="#" class="pLinkFiltroEstados" onclick="pLimpiarFiltro(\''+Grid+'\',\'estado_pedid\')" value="'+nombre+'" style="text-decoration: none; ">'+listaOK[x].nom+'</a> </div> '+
                                					'<div class="ui-block-c" style="width:20%;"><a href="#" class="pLinkFiltroEstados" onclick="pLimpiarFiltro(\'estado_pedid\')" value="'+nombre+'"><img src="./images/icno_chec.png"> </a> </div>'+
                                					'</div>'+
                                					'</li>';
                                		
                                	
                                    //console.log("ENTRA 1");
                                    
																		$("#pListaFiltrosUL").append(l);
																		
                                } else {
                                    //console.log("ENTRA 2");
                                  	var l='<li style="border-style: solid; border-bottom-width: 1px; border-bottom-color: #bfc0c3; border-top-width: 0; border-left-width: 0; border-right-width: 0; padding-bottom: 5px; padding-top:10px; ">'+
                                  	'<div class="ui-grid-b"  >'+
	                                  	'<div class="ui-block-a" style="width:10%; text-align:left; " ><a href="#" class="pLinkFiltroEstados" onclick="pFiltroPerso(\''+Grid+'\',\'estado_pedid\', null, \''+nombre+'\' )" value="0" > <img src="./images/'+listaOK[x].ico+'"></a> </div> '+
	                                  	'<div class="ui-block-b" style="width:70%; text-align:left;"><a href="#" class="pLinkFiltroEstados" onclick="pFiltroPerso(\''+Grid+'\',\'estado_pedid\', null, \''+nombre+'\' )" value="0" style="text-decoration: none; color:grey">'+listaOK[x].nom+'</a>  </div>'+
	                                  	'<div class="ui-block-c" style="width:20%;"> &nbsp; </div>'+
                                  	'</div>';
                                  	'</li>';
                                		                                    
                                     //console.log("DESACIVADOOOOOOO " + l);
                                    $("#pListaFiltrosUL").append(l);
                                   
                                }
                            }		        
                            $("#pFiltroPopUp").popup("open");
                        });
                });
        });
        break;

    }
}


function pComprobarColumnaFiltrada(nombreColumna){
	
	  var aux = [];
	  var col = false;
	  if(localStorage["columnaFiltrada"]!=""){
	    aux = JSON.parse(localStorage["columnaFiltrada"]);
	    
	    for(var i=0;i<aux.length;i++){
	    	
	    	if(aux[i].columna==nombreColumna) col=true;
	    	
	      //console.log("Buscando coincidencias "+aux[i].columna+" "+nombreColumna+" "+col);
	    	
	    }
		}
		
		//console.log("Esta columna es: "+col);
		return col;
	
	}

//limpia los filtros creados en kendo 



function pLimpiarFiltro(Grid,nomColum,operator) {
	  //Eliminar unicamente el filtro que nos pasant
	 
	  //console.log("pLimpiarFiltro => "+Grid+" "+nomColum);
    var grid = $("#"+Grid).data("kendoGrid");

    if (nomColum == "undefined") {

        //var nomColum = localStorage["columnaOrdena"];
        Grid = "pGridPedidos";
        var nomColum = localStorage.getItem('fila');
        //console.log("Limpiamos la columna: "+nomColum+" "+operator);
        var grid = $("#"+Grid).data("kendoGrid");
        //$(".k-datepicker input").val('');
        
       $("#pListaFiltroFechasInicio").val('');
         $("#pListaFiltroFechasFin").val('');

    } else if (nomColum == "estado_pedid") {
    	
        localStorage["pfiltroEstadosActicado"]="";
        
        var aux = [];
        
				aux = JSON.parse(localStorage["columnaFiltrada"]);
				var longitud = aux.length;
				//console.log("LONGITUD "+aux.length);
				
				var x="";
			  
			  for(var j = 0 ;j<longitud ; j++){
			  	
			  		if (aux[j].columna == nomColum) {
			  			x=aux[j].columna;
			  			//console.log( aux );
			  			pPintarIconoCabeceraGrid(Grid, x,"0", 1);
			  			aux.splice(j,1);
			  			localStorage["columnaFiltrada"]=JSON.stringify(aux);
			  		}
			  		
			  }
        pMostrarPedidos();
    }

    
    var datasource = $("#"+Grid).data("kendoGrid").dataSource;
    var filtro = datasource.filter();
    
		datasource.filter([]);
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

		//Para la paginación
    var dataSource = $("#"+Grid).data("kendoGrid").dataSource;
    var allData = dataSource.data();

    localStorage["pedidos_pag_act"] = 1;
    var maxRowPag = localStorage.getItem("max_row_per_pag");
    localStorage["pedidos_pag_last"] = Math.ceil(allData.length / maxRowPag);

    displayPedidosEmitidos();
    localStorage['pValorFiltroGrid'] = "0";
    
    var aux = [];
        
  	aux = JSON.parse(localStorage["columnaFiltrada"]);
  	var longitud = aux.length;
  	//console.log("LONGITUD "+aux.length);
  	
		var x="";
    
    for(var j = 0 ;j<longitud ; j++){
    	
    		if (aux[j].columna == nomColum) {
    			x=aux[j].columna;
    			//console.log( aux );
    			pPintarIconoCabeceraGrid(Grid, x,"0", 1);
    			aux.splice(j,1);
    			localStorage["columnaFiltrada"]=JSON.stringify(aux);
    		}
    		
    }
    

}

//////////////////////////////////////////////////////////////////////////////////////////////
//Inicializa los botones de ordenacion
function pMostrarIconoOrdenar(Grid, nomColum, tipoOrden, tipoColumna, formatColumna) {
	
	  //console.log("pMostrarIconoOrdenar => "+Grid+" "+nomColum+" "+tipoOrden+" "+tipoColumna+" "+formatColumna);

    var btnAsc = document.getElementById("pBtnPopUpAsc");
    var btnDesc = document.getElementById("pBtnPopUpDesc");
    var imgDesc = document.getElementById("pImgDesc");
    var imgAsc = document.getElementById("pImgAsc");
    
    //var tipoOrden = localStorage["tipoOrden"];

    if (tipoOrden == "asc") {
    	
        //imgAsc.setAttribute("src", './images/icno_chec.png');
        imgAsc.src = './images/icno_chec.png';
        imgDesc.src='./images/blancoOrdenacion.png';
        btnAsc.setAttribute("onClick", "pOrdenacionColumna('" + Grid + "','" + nomColum + "' , '0' , '" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value","asc"+nomColum);
        btnDesc.setAttribute("onClick", "pOrdenacionColumna('" + Grid + "','" + nomColum + "', 'desc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value","0");
        //console.log("Ordenado de manera asc y el value es = "+btnAsc.getAttribute("value"));
        //localStorage["tipoOrden"]="asc";
        pPintarIconoCabeceraGrid(Grid,nomColum,tipoOrden);
        
    } else if (tipoOrden == "desc") {
    	
        //imgDesc.setAttribute("src", './images/icno_chec.png');
        imgDesc.src ='./images/icno_chec.png';
        imgAsc.src='./images/blancoOrdenacion.png';
        btnDesc.setAttribute("onClick", "pOrdenacionColumna('" + Grid + "','" + nomColum + "', '0' , '" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value","desc"+nomColum);
        btnAsc.setAttribute("onClick", "pOrdenacionColumna('" + Grid + "','" + nomColum + "', 'asc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value","0");
        //console.log("Ordenado de manera desc y el value es = "+btnDesc.getAttribute("value"));
        //localStorage["tipoOrden"]="desc";
        pPintarIconoCabeceraGrid(Grid,nomColum,tipoOrden);
        
    } else if ((tipoOrden == "0")) {
    	
    		imgAsc.src='./images/blancoOrdenacion.png';
        imgDesc.src='./images/blancoOrdenacion.png';
        btnAsc.setAttribute("onClick", "pOrdenacionColumna('" + Grid + "','" + nomColum + "', 'asc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnAsc.setAttribute("value","0");
        btnDesc.setAttribute("onClick", "pOrdenacionColumna('" + Grid + "','" + nomColum + "', 'desc' ,'" + tipoColumna + "','" + formatColumna + "')");
        btnDesc.setAttribute("value","0");
        //localStorage["tipoOrden"]="0";
        pPintarIconoCabeceraGrid(Grid,nomColum,tipoOrden);
        //console.log("Desordenadoooooooooooooooooooo");
    }

}

function pPintarIconoCabeceraGrid(nombreGrid,nombreColumna,ordenacion, limpiado) {
	
	$('#pFiltroPopUpContent').trigger('create');
	
		//console.log("pPintarIconoCabeceraGrid => "+nombreGrid+" "+nombreColumna+" "+ordenacion+ " " + localStorage['columnaFiltrada'] );

    var filtroEstado = localStorage['pValorFiltroGrid'];
    var imgGridHeader = document.getElementById(nombreColumna);
    
    if ((localStorage["columnaFiltrada"]!="")){
    	var aux = JSON.parse(localStorage["columnaFiltrada"]);
	    for(var j = 0;j<aux.length;j++){
	       if(aux[j].columna==nombreColumna){ 
	       		var imgGridHeader = document.getElementById(nombreColumna);
	       		if (nombreColumna=="estado_pedid" ) {
	       				imgGridHeader.src = './images/icno_filtrado.png';
	       		} else if (limpiado != null) {
                //imgGridHeader.setAttribute("src", './images/icno_ordenable_filtrable.png');
                imgGridHeader.src = './images/icno_ordenable_filtrable.png';
	       		} else if (ordenacion == "0" ) {
		            //imgGridHeader.setAttribute("src", './images/icno_filtrado.png');
		            imgGridHeader.src = './images/icno_filtrado.png';
		            //console.log("Hemos entrado al estado sin filtrar");
		        } else if (ordenacion == "desc") {
		            //imgGridHeader.setAttribute("src", './images/icno_filtroOrdenarDescOn.png');
		            imgGridHeader.src = './images/icno_filtroOrdenarDescOn.png';
		        } else if (ordenacion == "asc") {
		            //imgGridHeader.setAttribute("src", './images/icno_filtroOrdenarAscOn.png');
		            imgGridHeader.src = './images/icno_filtroOrdenarAscOn.png';
		        } 
		     } 
	    }  
	    	
    }else {
    	var imgGridHeader = document.getElementById(nombreColumna);
    	if (ordenacion == "0") {
            //imgGridHeader.setAttribute("src", './images/icno_ordenable_filtrable.png');
            imgGridHeader.src="./images/icno_ordenable_filtrable.png";
            //console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " + filtroEstado + " " + ordenacion);
      } else if (ordenacion == "desc") {
          //imgGridHeader.setAttribute("src", './images/icno_filtrado_ascendente.png');
          imgGridHeader.src="./images/icno_filtrado_ascendente.png";
          //console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " + filtroEstado + " " + ordenacion);
      } else if (ordenacion == "asc") {
          //imgGridHeader.setAttribute("src", './images/icno_filtrado_descendente.png');
          imgGridHeader.src="./images/icno_filtrado_descendente.png";
          //console.log("HEMOS ENTRADO A CAMBIAR EL ICONO " + filtroEstado + " " + ordenacion);
      } else {
      		//console.log("KAKAKAKAKAAK");
      } 
      
      //console.log("AQUI!!!!");
    }
    

}

////////////////////////////////////////////////////////////////////////////////////////
//Ordenacion ascendentes/descendentes 
function pOrdenacionColumna(Grid, nombreColumna,tipoOrdenacion, tipoColumna, formatColumna) {
	
	  //console.log("pOrdenacionColumna => "+Grid+" "+nombreColumna+" "+tipoOrdenacion+" "+tipoColumna+" "+formatColumna);
	  
	  if(localStorage["columnaOrdena"]=="") localStorage["columnaOrdena"]=nombreColumna;
	
    switch (tipoOrdenacion) {
    	
    case "asc":
    
    		if(localStorage["columnaOrdena"]!=nombreColumna){
        	pPintarIconoCabeceraGrid(Grid,localStorage["columnaOrdena"],"0");
        	//console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        }
        
    		//console.log("Ordenacion ascendente");
        var grid = $("#"+Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumna,
            type: tipoColumna,
            format: formatColumna,
            dir: "asc"
        });
        
				localStorage["columnaOrdena"]=nombreColumna;
				localStorage["tipoOrden"]=tipoOrdenacion;
				pPintarIconoCabeceraGrid(Grid, nombreColumna,"asc");
				pMostrarIconoOrdenar(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);
				
				$("#pFiltroPopUp").popup("close");
        break;
   	 case "desc":
    
    		if(localStorage["columnaOrdena"]!=nombreColumna){
        	
        	pPintarIconoCabeceraGrid(Grid,localStorage["columnaOrdena"],"0");
        	//console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        	
        }
        //console.log("Ordenacion descendente");
        var grid = $("#"+Grid).data("kendoGrid");
        grid.dataSource.sort({
            field: nombreColumna,
            type: tipoColumna,
            format: formatColumna,
            dir: "desc"
        });
                
				localStorage["columnaOrdena"]=nombreColumna;
				localStorage["tipoOrden"]=tipoOrdenacion;
				pPintarIconoCabeceraGrid(Grid, nombreColumna,"desc");
				pMostrarIconoOrdenar(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);
							
				$("#pFiltroPopUp").popup("close");
        break;
    case "0":
    		
    		if(localStorage["columnaOrdena"]!=nombreColumna){
        	
        	pPintarIconoCabeceraGrid(Grid,localStorage["columnaOrdena"],"0");
        	//console.log("ADIOSSSSSSSSSSSSSSSSSSSSSSSSS");
        	
        }
    		
        //console.log("Ordenacion 0");
        $("#"+Grid).data("kendoGrid").dataSource.sort({
            field: nombreColumna
        });
        
        localStorage["columnaOrdena"]=nombreColumna;
        localStorage["tipoOrden"]="0";
        pPintarIconoCabeceraGrid(Grid, nombreColumna,"0");
        pMostrarIconoOrdenar(Grid, nombreColumna, tipoOrdenacion, tipoColumna, formatColumna);
        				        
        $("#pFiltroPopUp").popup("close");
        
        break;
    }

}

//////////////////////////////////////////////////////////////////////////
//Creamos nustros propios filtros para la Grid de Kendo
function pFiltroPerso(Grid,pFila,pTipoFiltro,itemSeleccionado) {
	
	  //var filterString=[];
	  //var filterFecha=[];
	 
	  var ultimoFiltro=[];
	  var ultimoFiltro2=[];
	  var extra=0;
	 	//console.log("pFiltroPerso => "+Grid+" "+pFila+" "+pTipoFiltro+" "+itemSeleccionado);


 		$("#pFiltroPopUp").popup("close");
 		var operador="";
 		var operador2="";
 		var valor="";
 		var valor2="";
 		
    if ((pFila == "cod_centr" || pFila == "cod_proveedo" || pFila == "cod_pedid" || pFila == "cod_zona" )) { //nuevoooooooooooooooooooooooooooooooooooooooo filtrooooooooooooooooooooooooooo

		     ultimoFiltro =  { 
		              field: pFila,
		              operator: "eq",
		              value: itemSeleccionado
		     };
		     
				 //console.log("ENTRA EN STRING => "+itemSeleccionado);
       
    } else if (pFila == "fecha_entreg" || pFila == "fecha_emisio") {

        var mindatetime = $('#pListaFiltroFechasInicio').data("kendoDatePicker").value();
        var maxdatetime = $('#pListaFiltroFechasFin').data("kendoDatePicker").value();

        //console.log("FECHA DE INICIO " + mindatetime + " " + maxdatetime);
           
    
        if (mindatetime != null) {
        	ultimoFiltro={
                field: pFila,
                operator: "gte",
                value: mindatetime
            };
        	
        }
        
        if (maxdatetime != null) {
        	
        	if (ultimoFiltro.length == 0) {
        		ultimoFiltro=  {
		                field: pFila,
		                operator: "lte",
		                value: maxdatetime
		            };
		        
        	} else {
        		extra=1;
        		
        		ultimoFiltro2=  {
		                field: pFila,
		                operator: "lte",
		                value: maxdatetime
		            };
        	}
        }
    }else if (pFila == "estado_pedid") {

				localStorage["pfiltroEstadosActicado"]=itemSeleccionado;
	
        $("#pFiltroPopUp").popup("close");

        pMostrarPedidos(itemSeleccionado);

        localStorage['pValorFiltroGrid'] = "1";
        
        
        var aux = [];
        
	      if(localStorage["columnaFiltrada"]!=""){
		      aux = JSON.parse(localStorage["columnaFiltrada"]);
		      aux.push({columna: pFila});

        } else 	aux.push({columna: pFila});
        	
      	localStorage["columnaFiltrada"] = JSON.stringify(aux);
        
        pPintarIconoCabeceraGrid(Grid,pFila,localStorage["tipoOrden"]);
        
        return;
        
    } else {
        //console.log("XXXXXXXXXXXXXXXXXXXXXX>>> NOOOOOOOOOOOOOOO");
    }
    
		//console.log(ultimoFiltro);
		
		if ( pFila == "cod_centr" || pFila == "cod_proveedo"|| pFila == "cod_pedid" || pFila == "fecha_entreg" || pFila == "fecha_emisio" || pFila == "cod_zona" ) { 
				////////////////////////////////////////////////////////
				// Revisamos si existe el filtro, si es asi lo Borramos 
		    var dataSource = $("#pGridPedidos").data("kendoGrid").dataSource;
		    var filters = dataSource.filter();
		    
		    //console.log("Tots els filtres");
		    //console.log(filters);
		    
		    if (filters != undefined ) {
		    
			    for(var j = 0 ; j < filters.filters.length ; j++){
			    	
			    		if (filters.filters[j].field == pFila) {
			    			//x=aux[j].columna;
			    			////console.log( aux );
			    			//pPintarIconoCabeceraGrid(Grid, x,"0", 1);
			    			
			    			//console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXX " + j + " --> " +filters.filters[j].field);
			    			//console.log(filters.filters);
			    			filters.filters.splice(j,1);
			    			//console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYY " + j + "  " );
			    			//console.log(filters.filters);
			    			j--;
			    		}
			    		
			    }
			  }
		    
		    //console.log("Filtres sense repetir");
		    //console.log(filters);
				////////////////////////////////////////////////////////
			
		
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
				
				//console.log("Filtres final");
				//console.log(filters);
		
		    dataSource.filter(filters);
		    
		    var allData = dataSource.data();
		      
		    var query = new kendo.data.Query(allData);
		    var dataa = query.filter(filters).data;
		    
		    ////console.log("DATOSSSSS PAGINAAAA FILTROOOOOO " + dataa.length);
		
		    //Refrescamos los botones de paginaci�n
		    localStorage["pedidos_pag_act"] = 1;
		    var maxRowPag = localStorage.getItem("max_row_per_pag");
		    ////console.log("MAXXXXXXXXXXXXX ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  " + maxRowPag);
		    localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);
		    ////console.log("LASSSSSTTTTTTTTTTT PAGEEEEEEEEEEEEEEEEEEEEE  " + localStorage["pedidos_pag_last"]);
		
		        //Refrescamos los botones de paginaci�n
		        localStorage["pedidos_pag_act"] = 1;
		        var maxRowPag = localStorage.getItem("max_row_per_pag");
		        ////console.log("MAXXXXXXXXXXXXX ROWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW  " + maxRowPag);
		        localStorage["pedidos_pag_last"] = Math.ceil(dataa.length / maxRowPag);
		        ////console.log("LASSSSSTTTTTTTTTTT PAGEEEEEEEEEEEEEEEEEEEEE  " + localStorage["pedidos_pag_last"]);
		
		        displayPedidosEmitidos();
		        //localStorage['pValorFiltroGrid'] = "1";
		          
		        var aux = [];
		        
			      if(localStorage["columnaFiltrada"]!=""){
				      aux = JSON.parse(localStorage["columnaFiltrada"]);
				      aux.push({columna: pFila});
		
		        } else 	aux.push({columna: pFila});
		        	
		      	localStorage["columnaFiltrada"] = JSON.stringify(aux);
		        
		        pPintarIconoCabeceraGrid(Grid,pFila,localStorage["tipoOrden"]);
    }
      
}



function pMostrarPedidosMaxReg() {
    db.transaction(function (transaction) {
        var sql = "SELECT COUNT(*) as n FROM Orders, Providers , Centers WHERE Centers.cod_center=Orders.cod_centro AND Providers.codPro=Orders.cod_proveedor ";
        //console.log(sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length) {

                    var rowDb = result.rows.item(0);

                    $('#pedidos_max_row').val(parseInt(rowDb.n));



                } else {
                    $('#pedidos_max_row').val(0);
                }
            }, error);
    });
}


/*
modo= 

*/

function pMostrarDetallePedido(data, modo, show) {
	var estadoPedido;
    db.transaction(function (transaction) {
        //console.log("Inicio pMostrarDetallePedido");

        localStorage['pDetalleAnterior'] = data;

        //var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado FROM orders as o,  vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=o.status AND o.reference='"+data+"'";

        if (data.substr(0, 3) == "Tmp") {

            var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado,s.icon as icono, o.idInternalOrder as idOrder, message as error_men FROM ordersPending as o,  vendors as v , purchaseCenters as p,  status as s LEFT OUTER JOIN ordersPendingErrors as e ON e.idOrder=o.idInternalOrder  WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.reference='" + data + "' AND o.tipoInterno="+TIPO_TEMPORAL_ORDER+" AND o.username='" + localStorage['usuario'] + "' ";

        } else {

            var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado,s.icon as icono, '' as error_men FROM orders as o,  vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.reference='" + data + "' ";

        }

				//console.log(sql);
				
        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length) {
                    var mensageError = [];
                    var preu;
                    var idOrderXD;
                    if (result.rows.length == 1) {
                        var rowDb = result.rows.item(0);
                        idOrderXD = rowDb.idOrder;
                        $("#txtCodPedido").val(rowDb.reference);
                        $("#txtCodCentro").val(rowDb.centro);
                        $("#txtNomProveedor").val(rowDb.proveedor);
                        // Nom proveedor será combo
                        //var f = rowDb.documentDate.substring(8, 10) + "/" + rowDb.documentDate.substring(5, 7) + "/" + rowDb.documentDate.substring(0, 4) + " " + rowDb.documentDate.substring(11, 13) + ":" + rowDb.documentDate.substring(14, 16);
                        $("#txtFechaEmision").val(darFormatoSegunWS(rowDb.documentDate,true));
                        console.log("---------Fechas de Detalle-----------");
                        console.log(rowDb.documentDate);
                        console.log(darFormatoSegunWS(rowDb.documentDate,true));
                        //f = rowDb.deliveryDate.substring(8, 10) + "/" + rowDb.deliveryDate.substring(5, 7) + "/" + rowDb.deliveryDate.substring(0, 4);
                        $("#txtFechaEntrega").val(darFormatoSegunWS(rowDb.deliveryDate));
                        
                        if (rowDb.observaciones!="undefined") { $("#txtObservaciones").val(rowDb.observaciones);        }
												else{ $("#txtObservaciones").val("");            }
                        
                        if (rowDb.observaciones!="undefined") {
							$("#txtObservaciones").val(rowDb.observaciones);
						}
						else
						{
							$("#txtObservaciones").val("");
						}
                        
                        //$("#txtEstadoPedido2").css('background', 'url(./images/'+rowDb.icono+') no-repeat scroll 20px 20px').val();
                                                    estadoPedido = rowDb.icono;
                        
                        $("#txtEstadoPedido2").val(rowDb.estado);
                        $("#txtEstadoPedido2").css('display', 'inside');
                        $("#txtEstadoPedido2").css('padding-left', '15px');
                        
                         $("#imagenEstado").attr("src", './images/'+rowDb.icono);
                        //$("#txtEstadoPedido").html('<img src="./images/'+rowDb.icono+'"/>'+rowDb.estado);
                        //var imagen = '<img src="./images/'+rowDb.icono+'" >';
                        //$("#txtEstadoPedido2").html(imagen);

                        preu = Math.round(rowDb.amount * 100) / 100;
                        
                        //var s = "$";

                        /*if (rowDb.currency == "EUR") {
                            s = '';
                        }*/

												var formatPrecio = formatearMoneda(preu);
                    		/*if (localStorage['language']=="EN") { formatPrecio = "$"+formatPrecio;}
												else if (localStorage['language']=="ES") { formatPrecio = formatPrecio+"€";}*/
													
                        $("#txtValorPedido").val(formatPrecio);

		                     /*   
		            				//console.log("Mensaje de error: " + mensageError[0]);
		            				
		            				if ( rowDb.error_men != undefined  && rowDb.error_men != "" ) {
		            						$("#pedidosDialogAText").text(rowDb.error_men);
                            $("#DialogPedisoDetalleErrorQuery").popup("open");	
		            				}
		            				   */         				

                    } else {
                     	//console.log("ERROR DE INTEGRIDAD DE DATOS");
                    }

/*

                    if (data.substr(0, 3) == "Tmp") {
                        var sqlItem = "SELECT DISTINCT d.*, i.*, c.logisticChainName as desCantidad, c.ordinalType as numUds, d.idInternalOrder as idOrder FROM ordersPendingDetail as d , items as i, logisticChains as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + "  AND d.idInternalOrder='" + idOrderXD + "' ";
                    } else {
                        var sqlItem = "SELECT DISTINCT d.*, i.*, c.logisticChainName as desCantidad, c.ordinalType as numUds FROM ordersDetail as d, items as i, logisticChains as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + "  AND d.idOrder='" + rowDb.idOrder + "' ";
                    }                   
*/									
										if (data.substr(0, 3) == "Tmp") {
											
                        var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad, d.ordinalType as numUds, d.idInternalOrder as idOrder, message as error_row, i.itemUnitName " + 
                        " FROM ordersPendingDetail as d LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + rowDb.idVendor + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
                        " WHERE d.idInternalOrder='" + idOrderXD + "' ";
                        
                    } else {
                        var sqlItem = "SELECT *, null as error_row FROM ordersDetail WHERE idOrder='" + rowDb.idOrder + "' ";
                   	}
                    
                    //console.log("----------------------------------------");
                    //console.log("SQL-------------------------------------");
                    
                    //console.log(sqlItem);
                    
                  
                    
                    transaction.executeSql(sqlItem, undefined,
                        function (transaction, result) {
                            if (result.rows.length) {

                                var n_reg = 0;
                                var pJsonPedidosDet = [];
                                var rowDb = [];
                                var t = 0;
                                
                                  var total=0.0;

                                for (var i = 0; i < result.rows.length; i++) {
                                	
                                    rowDb = result.rows.item(i);
                                    
                                    
                                    
                                    //rowDb.quantity=2;
                                    	
                                    total=parseFloat(rowDb.quantity) * parseFloat(rowDb.ordinalType) ;
                                    
                                    
                                    
                                    if (typeof total === 'number' && total.toString().indexOf(".") > 0 ) {
                                    	
                                    	total=total.toString().substring(0,total.toString().indexOf(".")+3);
                                    	total=formatearMoneda(total);
                                    } 
                                    
                                    
                                    
                                    
                                    
                                    //console.log("DANI => q="+(Math.round(rowDb.total))+" logistic "+rowDb.ordinalType+ " = " +parseFloat(rowDb.ordinalType) + " pf "+ parseFloat((rowDb.ordinalType))+ " Tital = "+ total + "tipo ="+(typeof total));
									
                                    //total = parseFloat(rowDb.quantity) * parseFloat(rowDb.numUds);
                                    
                                    pJsonPedidosDet.push({

                                        cod_articulo: rowDb.idItem,
                                        nom_articulo: rowDb.itemName,
                                        cant_pedida: rowDb.quantity,
                                        cadena_logistica: rowDb.logisticsChainName,
                                        unidades_total: total,
                                        mensaje: rowDb.error_row,
                                        item_error: rowDb.itemStatus,
                                        cadena_error: rowDb.logisticsChainStatus

                                    });
                                    ////console.log("ERRORRRRRRR es: "+rowDb.error_row);
                                    
                                    n_reg = n_reg + 1;
                                }
																	
																//var mensajeDetalle = pJsonPedidosDet.mensaje;
																	
                                localStorage["pedidos_detalle_pag_act"] = 1;
                                if (show == true) {
                                    localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_min"]);
                                    //console.log("Menos Detalle " + localStorage["pedidos_detalle_pag_max_row_min"]);
                                } else {
                                    localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_max"]);
                                    //console.log("Mas Detalle " + localStorage["pedidos_detalle_pag_max_row_max"]);
                                }

                                localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / localStorage["pedidos_detalle_pag_max_row"]);


                                var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
                                mr = mr;
                                //console.log("maximas filas en detalle pedido" + mr);

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

                                var grid = $("#pGridPedidosDet").data("kendoGrid");

                                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                                    $("#pGridPedidosDet").data().kendoGrid.destroy();
		                    						$("#pGridPedidosDet").empty();
                                }


                                $("#pGridPedidosDet").kendoGrid({

                                    dataSource: {
                                        data: pJsonPedidosDet,
                                        schema: {
                                            model: {
                                                fields: {
                                                    cod_articulo: {
                                                        type: "string"
                                                    },
                                                    nom_articulo: {
                                                        type: "string"
                                                    },
                                                    cant_pedida: {
                                                        type: "string"
                                                    },
                                                    cadena_logistica: {
                                                        type: "string"
                                                    },
                                                    unidades_total: {
                                                        type: "string"
                                                    }
                                                }
                                            }
                                        },
                                        pageSize: mr
                                    },
                                    scrollable: false,
                                    selectable: true,
                                    sortable: false,
                                    filterable: true,
                                    pageable: true,
                                    resizable: true,
                                    rowTemplate: '<tr class="#:item_error==1? \"colorRowGridErrorItem\" : cadena_error==1? \"colorRowGridErrorLog\" : \"white\"#"><td class="ra">#=cod_articulo# </td><td>#=nom_articulo#</td><td class="ra">#=cant_pedida#</td>'+
				                                            '<td>#=cadena_logistica#</td><td class="ra">#=unidades_total#</td></tr>',
                                    columns: [{
                                        field: "cod_articulo",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet1()' data-role='button' role='button'> " + cod + " <img id='sortPedidosDet1' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        template: "<div class='ra'>#= cod_articulo #</div>",
                                        title: cod,
                                        width: '7%'
                                    }, {
                                        field: "nom_articulo",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet2()' data-role='button' role='button'> " + des + " <img id='sortPedidosDet2' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        title: des,
                                        width: '50%'
                                    }, {
                                        field: "cant_pedida",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet3()' data-role='button' role='button'> " + cant + " <img id='sortPedidosDet3' src='./images/sort_both.png' > </a> " +
                                            " </div> </div>",
                                        filterable: false,
                                        template: "<div class='ra'>#= cant_pedida #</div>",
                                        title: cant,
                                        width: '9%'
                                    }, {
                                        field: "cadena_logistica",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet4()' data-role='button' role='button'> " + cade + " <img id='sortPedidosDet4' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        title: cade,
                                        width: '14%'
                                    }, {
                                        field: "unidades_total",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet5()' data-role='button' role='button'> " + unid + " <img id='sortPedidosDet5' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        template: "<div class='ra'>#= unidades_total #</div>",
                                        title: unid,
                                        width: '7%'
                                    },{
                                        field: "mensaje",
                                        filterable: false,
                                        title: "Mensaje",
                                        width: '7%'
                                    }]
                                });

                                $('.k-grid-pager').hide();
                                var grid = $("#pGridPedidosDet").data("kendoGrid");
                                grid.hideColumn("mensaje");

                                displayDetail(estadoPedido);
								
								
                                //console.log("Detalle Pedidos INCIO pag_act=" + localStorage["pedidos_detalle_pag_act"] + "| max_row_per_pag=" + localStorage["pedidos_detalle_pag_max_row"] + " | LAST PAGE " + localStorage["pedidos_detalle_pag_last"]);

                                       
                            } 
                            
                        }, error);
                } else {
                    //console.log("ESTE PEDIDO NO TIENE DETALLE");
                }

            }, error);
        //console.log("Fin pMostrarDetallePedido");


    });
}


////////////////////////////////////////////////////////////////////////////////////////
//Filtros ascendentes/descendentes tabla pedidos detalle
function sortDet1() {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "cod_articulo",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosDet1').attr("src", "./images/sort_desc.png");

        break;
    case "1":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "cod_articulo",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosDet1').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidosDet").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosDet1').attr("src", "./images/sort_both.png");
        break;
    }
}

//Filtros ascendentes/descendentes tabla pedidos detalle
function sortDet2() {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "nom_articulo",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosDet2').attr("src", "./images/sort_desc.png");

        break;
    case "1":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "nom_articulo",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosDet2').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidosDet").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosDet2').attr("src", "./images/sort_both.png");
        break;
    }
}

//Filtros ascendentes/descendentes tabla pedidos detalle
function sortDet3() {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "cant_pedida",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosDet3').attr("src", "./images/sort_desc.png");

        break;
    case "1":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "cant_pedida",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosDet3').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidosDet").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosDet3').attr("src", "./images/sort_both.png");
        break;
    }
}

//Filtros ascendentes/descendentes tabla pedidos detalle
function sortDet4() {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "cadena_logistica",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosDet4').attr("src", "./images/sort_desc.png");

        break;
    case "1":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "cadena_logistica",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosDet4').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidosDet").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosDet4').attr("src", "./images/sort_both.png");
        break;
    }
}

//Filtros ascendentes/descendentes tabla pedidos detalle
function sortDet5() {

    var aux = localStorage.getItem('sortgrid');

    switch (aux) {
    case "0":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "unidades_total",
            type: "string",
            dir: "desc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "1");
        $('#sortPedidosDet5').attr("src", "./images/sort_desc.png");

        break;
    case "1":
        var grid = $("#pGridPedidosDet").data("kendoGrid");
        grid.dataSource.sort({
            field: "unidades_total",
            type: "string",
            dir: "asc"
        });
        grid.refresh();
        localStorage.setItem('sortgrid', "2");
        $('#sortPedidosDet5').attr("src", "./images/sort_asc.png");
        break;
    case "2":
        $("#pGridPedidosDet").data("kendoGrid").dataSource.sort({});
        localStorage.setItem('sortgrid', "0");
        $('#sortPedidosDet5').attr("src", "./images/sort_both.png");
        break;
    }
}

////////////////////////////////////////////////////////////////////////////////////////
//Filtros ascendentes/descendentes tabla Emitidos
function pfiltroDet1() {

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    var datos = grid.dataSource.data();

    var fila = "cod_articulo";
    localStorage.setItem('fila', fila);

    pPopupDet(fila);
    //event.stopPropagation();
    var filtrar = localStorage.getItem('filtrar');
    var limpiar = localStorage.getItem('limpiar');
    var cancelar = localStorage.getItem('cancelar');
    var aceptar = localStorage.getItem('aceptar');

    document.getElementById('pFiltrar').innerHTML = filtrar;
    document.getElementById('pLimpiar').innerHTML = limpiar;
    document.getElementById('pCancelar').innerHTML = cancelar;

}

function pfiltroDet2() {

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    var datos = grid.dataSource.data();

    var fila = "nom_articulo";
    localStorage.setItem('fila', fila);

    pPopupDet(fila);
    //event.stopPropagation();
    var filtrar = localStorage.getItem('filtrar');
    var limpiar = localStorage.getItem('limpiar');
    var cancelar = localStorage.getItem('cancelar');
    var aceptar = localStorage.getItem('aceptar');

    document.getElementById('pFiltrar').innerHTML = filtrar;
    document.getElementById('pLimpiar').innerHTML = limpiar;
    document.getElementById('pCancelar').innerHTML = cancelar;

}

function pfiltroDet3() {

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    var datos = grid.dataSource.data();

    var fila = "cant_pedida";
    localStorage.setItem('fila', fila);

    pPopupDet(fila);
    //event.stopPropagation();
    var filtrar = localStorage.getItem('filtrar');
    var limpiar = localStorage.getItem('limpiar');
    var cancelar = localStorage.getItem('cancelar');
    var aceptar = localStorage.getItem('aceptar');

    document.getElementById('pFiltrar').innerHTML = filtrar;
    document.getElementById('pLimpiar').innerHTML = limpiar;
    document.getElementById('pCancelar').innerHTML = cancelar;

}

function pfiltroDet4() {

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    var datos = grid.dataSource.data();

    var fila = "cadena_logistica";
    localStorage.setItem('fila', fila);

    pPopupDet(fila);
    //event.stopPropagation();
    var filtrar = localStorage.getItem('filtrar');
    var limpiar = localStorage.getItem('limpiar');
    var cancelar = localStorage.getItem('cancelar');
    var aceptar = localStorage.getItem('aceptar');

    document.getElementById('pFiltrar').innerHTML = filtrar;
    document.getElementById('pLimpiar').innerHTML = limpiar;
    document.getElementById('pCancelar').innerHTML = cancelar;

}

function pfiltroDet5() {

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    var datos = grid.dataSource.data();

    var fila = "unidades_total";
    localStorage.setItem('fila', fila);

    pPopupDet(fila);
    //event.stopPropagation();
    var filtrar = localStorage.getItem('filtrar');
    var limpiar = localStorage.getItem('limpiar');
    var cancelar = localStorage.getItem('cancelar');
    var aceptar = localStorage.getItem('aceptar');

    document.getElementById('pFiltrar').innerHTML = filtrar;
    document.getElementById('pLimpiar').innerHTML = limpiar;
    document.getElementById('pCancelar').innerHTML = cancelar;

}

//////////////////////////////////////////////////////////////////////
//Ventana de PopUp de los filtros detalle pedido de kendo
function pPopupDet(pNombreColumna, filtrotipos) {

    //console.log("ENTRA!!!!!!!!!!!!!!!!!!! " + pNombreColumna);

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    var datos = grid.dataSource.data();
    $("#pGridPedidosDet").data("kendoGrid").dataSource.sort({});

    var datosFiltrados = []
    datosFiltrados = ordenarDatosLista(datos, pNombreColumna);


    var lista1 = $('#pLista1').kendoDropDownList({
        dataSource: {
            data: datosFiltrados
        },
        optionLabel: "-- Selec. --"
    }).data("kendoDropDownList");

    var pVentanaDet = $("#pVenFiltro").data("kendoWindow");
    pVentanaDet.open();
    //ESCODEMOS LOS DEMAS COMBOBOX		 
    $('#filtroPedidosA').show();
    $('#filtroPedidosB').hide();
    $('#filtroPedidosC').hide();
    $('#filtroPedidosD').hide();
    $('#filtroPedidosE').hide();
    $('#filtroPedidosF').hide();
    $('#filtroPedidosG').hide();
    $('#filtroPedidosH').hide();

    //MOSTRAMOS LOS BOTONES PARA CADA FILTRO	
    $('#btnPedidosDetA').show();
    $('#btnPedidosDetB').show();
    $('#btnPedidosDetC').show();

}

function pFiltroPersoDet(pFila, pTipoFiltro) {

    var grid = $("#pGridPedidosDet").data("kendoGrid");
    grid.dataSource.filter({});

    var item = $("#pLista1").val();
    //console.log("DATOS A FILTRAR " + item);

    grid.dataSource.filter({
        filters: [{
            logic: "or",
            field: pFila,
            operators: "eq",
            value: item
        }]
    });

    //Calculamos el numero de item que quedan despues de filtrar
    var dataSource = $("#pGridPedidosDet").data("kendoGrid").dataSource;
    var filters = dataSource.filter();
    var allDataDet = dataSource.data();
    var query = new kendo.data.Query(allDataDet);
    var dataa = query.filter(filters).data;

    //console.log("DATOSSSSS PAGINAAAA FILTROOOOOO" + " " + dataa.length);

    //Refrescamos los botones de paginacion
    localStorage["pedidos_detalle_pag_act"] = 1;
    localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"];
    localStorage["pedidos_detalle_pag_last"] = Math.ceil(allDataDet.length / localStorage["pedidos_detalle_pag_max_row"]);

    displayDetail();

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Pendiente de saber si son necesarias
function checkDetailTable() {

    db.transaction(function (transaction) {

        var sql = "SELECT * FROM Detail WHERE id='1'";

        transaction.executeSql(sql, undefined,
            function (transaction, result) {

                if (result.rows.length) {

                    //progress(100, $('#progressBar'));

                }

            }, error);
        //console.log("Comprobacion Finalizada");

    });

}

function deleteOrder() {

    //console.log("eliminar!");

    db.transaction(function (transaction) {
        //console.log("Ejecutado delete " + txtCodPedido.value);
        var sql = "DELETE FROM Orders WHERE cod_pedido='" + txtCodPedido.value + "';";
        transaction.executeSql(sql, undefined,
            function () {

                //alert ("Order inserted");
                //pMostrarPedidos();
            }, error);
    });
    //pMostrarPedidos();
}


function ordenarDatosLista(datos, pNombreColumna) {

    var auxdatos = [];
    var i, t, out = [],
        obj = {};
		
    //Obtenemos los datos de la columna donde queremos aplicar el filtro	
    if (pNombreColumna != null) {
        for (t = 0; t < datos.length; t++) {
            auxdatos.push(datos[t][pNombreColumna]);
        }
    } else auxdatos = datos;

    //eliminamos duplicados
    for (i = 0; i < auxdatos.length; i++) {
        obj[auxdatos[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }

    var datosOk = [];

    //los ordenamos			
    datosOk = out.sort();

    return datosOk;

}


function errorTX(er) {
    //alert("ERROR 11111");
    //console.log(er);

}

function errorTX2(er) {
    //alert("ERROR 22222");
    //console.log(er);
}


function pModificarPedidosConError(data) {

    $('#pLbCentroSeleccionado').text(" > "+localStorage.getItem('centro_seleccionado')+" > ");
    $('#pLbProveedorSeleccionado').text(localStorage.getItem('proveedor_seleccionado'));
    //console.log(localStorage.getItem('centro_seleccionado'));
    //console.log(localStorage.getItem('proveedor_seleccionado'));
    var grid = $("#pGridPedidoDetMod").data("kendoGrid");

    /*if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
        //console.log("Destruida!!!!!!!!!!!!!!!!!!!!!!!!!!!! con codigo " + data);
        $('#pGridPedidoDetModi').data().kendoGrid.destroy();
        $('#pGridPedidoDetModi').empty();
    }*/
    
    db.transaction(function (transaction) {

        localStorage['pDetalleAnterior'] = data;

        //var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado FROM orders as o,  vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=o.status AND o.reference='"+data+"'";

        if (data.substr(0, 3) == "Tmp") {

            var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado,s.icon as icono, o.idInternalOrder as idOrder, message as error_men FROM ordersPending as o,  vendors as v , purchaseCenters as p,  status as s LEFT OUTER JOIN ordersPendingErrors as e ON e.idOrder=o.idInternalOrder  WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.reference='" + data + "' AND o.tipoInterno="+TIPO_TEMPORAL_ORDER+" AND o.username='" + localStorage['usuario'] + "' ";

        } else {

            var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado,s.icon as icono, '' as error_men FROM orders as o,  vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=s.id AND o.reference='" + data + "' ";

        }

				//console.log(sql);
				
        transaction.executeSql(sql, undefined,
            function (transaction, result) {

								var rowDb = result.rows.item(0);
								 var idOrderXD = rowDb.idOrder;
                if (result.rows.length) {
                    

					if (data.substr(0, 3) == "Tmp") {
						//console.log("WILlY 1");					
                        var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad,l.vendorReference, d.ordinalType as numUds, d.idInternalOrder as idOrder, message as error_row, i.itemUnitName " + 
                        " FROM ordersPendingDetail as d LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + rowDb.idVendor + 
                        " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
                        " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
                        " WHERE d.idInternalOrder='" + idOrderXD + "' ";
                        
                    } else {
						//console.log("WILlY 2");
                        var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad,l.vendorReference, d.ordinalType as numUds, null as error_row, i.itemUnitName " +
                        " FROM ordersDetail as d , items as i  " + 
                        " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND c.idVendor=" + rowDb.idVendor +  
                        " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
                        " WHERE d.idItem=i.idItem AND d.idOrder='" + rowDb.idOrder + "' ";
                   	}
                    
                    //console.log("-------------------------------------");
                    //console.log("SQL-------------------------------------");
                    
                    //console.log(sqlItem);
                    
                    transaction.executeSql(sqlItem, undefined,
                        function (transaction, result) {
                            if (result.rows.length) {

                                var n_reg = 0;
                                var pJsonPedidosDetMod = [];
                                var rowDb = [];
                                var t = 0;

                                for (var i = 0; i < result.rows.length; i++) {
                                	
                                    rowDb = result.rows.item(i);
                                    
                                    if (rowDb.desCantidad==null || rowDb.desCantidad=="") { cadena=rowDb.itemUnitName; }
                                    else cadena=rowDb.desCantidad;
                                    	
                                    total = parseInt(rowDb.quantity) * parseInt(rowDb.numUds);
                                    ////console.log(rowDb.quantity + " * " + rowDb.numUds + " = " + total);
																		//if (total=="NaN" || total==undefined) { total=0; }
                                    pJsonPedidosDetMod.push({

                                        cod_articulo: rowDb.idItem,
                                        reference: rowDb.vendorReference,
                                        nom_articulo: rowDb.name,
                                        cant_pedida: rowDb.quantity,
                                        cadena_logistica: cadena,
                                        unidades_total: total,
                                        mensaje:rowDb.error_row

                                    });
                                    ////console.log("ERRORRRRRRR es: "+rowDb.error_row);
                                    
                                    n_reg = n_reg + 1;
                                }
																	
																//var mensajeDetalle = pJsonPedidosDet.mensaje;
																	
                                localStorage["pedidos_detalle_pag_act"] = 1;
                                localStorage["pedidos_detalle_pag_max_row"] = parseInt(localStorage["pedidos_detalle_pag_max_row_max"]);
                                //console.log("Mas Detalle " + localStorage["pedidos_detalle_pag_max_row_max"]);
                               

                                localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / localStorage["pedidos_detalle_pag_max_row"]);


                                var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
                                mr = mr;
                                //console.log("maximas filas en detalle pedido" + mr);

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

                                var grid = $("#pGridPedidosDet").data("kendoGrid");

                                if (grid != null) { //destruimos el grid asi cuando cargamos no se duplique botones
                                  
                                    
                                    $("#pGridPedidosDet").data().kendoGrid.destroy();
		                    						$("#pGridPedidosDet").empty();
                                }


                                $("#pGridPedidoDetMod").kendoGrid({

                                    dataSource: {
                                        data: pJsonPedidosDetMod,
                                        schema: {
                                            model: {
                                                fields: {
                                                    cod_articulo: {
                                                        type: "string"
                                                    },
                                                    reference: {
                                                        type: "string"
                                                    },
                                                    nom_articulo: {
                                                        type: "string"
                                                    },
                                                    cant_pedida: {
                                                        type: "string"
                                                    },
                                                    cadena_logistica: {
                                                        type: "string"
                                                    },
                                                    unidades_total: {
                                                        type: "string"
                                                    }/*,
                                                    precios: {
                                                        type: "number"
                                                    }*/,
                                                    mensaje: {
                                                        type: "string"
                                                    }
                                                }
                                            }
                                        },
                                        pageSize: mr
                                    },
                                    scrollable: false,
                                    sortable: false,
                                    filterable: true,
                                    selectable:true,
                                    pageable: true,
                                    rowTemplate: '<tr class="#:mensaje!=null? \"colorRowGrid\" : \"white\"#"><td class="ra">#=cod_articulo#</td><td class="ra">#=reference#</td><td class="ra">#=nom_articulo#</td><td class="ra">#=cant_pedida#</td>'+
				                                          '<td>#=cadena_logistica#</td> <td class="ra">#=unidades_total#</td> <td><input type="checkbox" class="checkbox"></td> </tr>',
                                    columns: [{                            /*<td class="ra">#=precios#</td><td class="ra">#=mensaje#</td>'*/
                                        field: "cod_articulo",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet1()' data-role='button' role='button'> " + cod + " <img id='sortPedidosDet1' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        template: "<div class='ra'>#= cod_articulo #</div>",
                                        title: cod,
                                        width: '7%'
                                    }, {
                                        field: "reference",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet()' data-role='button' role='button'> " + "Reference" + " <img id='sortPedidosDet2' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        title: "Reference",
                                        width: '10%'
                                    }, {
                                        field: "nom_articulo",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet2()' data-role='button' role='button'> " + des + " <img id='sortPedidosDet2' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        title: des,
                                        width: '30%'
                                    }, {
                                        field: "cant_pedida",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet3()' data-role='button' role='button'> " + cant + " <img id='sortPedidosDet3' src='./images/sort_both.png' > </a> " +
                                            " </div> </div>",
                                        filterable: false,
                                        template: "<div class='ra'>#= cant_pedida #</div>",
                                        title: cant,
                                        width: '9%'
                                    }, {
                                        field: "cadena_logistica",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet4()' data-role='button' role='button'> " + cade + " <img id='sortPedidosDet4' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        title: cade,
                                        width: '14%'
                                    }, {
                                        field: "unidades_total",
                                        headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet5()' data-role='button' role='button'> " + unid + " <img id='sortPedidosDet5' src='./images/sort_both.png' > </a> " +
                                            " </div> ",
                                        filterable: false,
                                        template: "<div class='ra'>#= unidades_total #</div>",
                                        title: unid,
                                        width: '7%'
                                    },/*{
								                        field: "precios",
								                        headerTemplate: "<div style='position: relative; float: left'>"+
													                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridPedidoDetMod\",\"precios\",\"ordenacionNuevoPed9\")' data-role='button' role='button'> " 
										                                 + "Precios" + " <img id='ordenacionNuevoPed9' src='./images/sort_both.png' > </a> ",
								                        filterable: false,
								                        template: "<div class='ra'>#= precios #</div>",
								                        title: "Precios",
								                        width: '10%'
								                    },{
								                        field: "mesaje",
								                        headerTemplate: "<div style='position: relative; float: left'>"+
													                "<a onclick='pOrdenacionGridNuevoPedido(\"pGridPedidoDetMod\",\"mensaje\",\"ordenacionNuevoPed8\")' data-role='button' role='button'> " 
										                                 + "Precios" + " <img id='ordenacionNuevoPed8' src='./images/sort_both.png' > </a> ",
								                        filterable: false,
								                        title: "Mensaje",
								                        width: '10%'
								                    },*/{
										                    field: "eliminar",
										                    headerTemplate: "<div style='position: relative;'> <a data-role='button' role='button'> <img src='./images/papelera.png'> ",
										                    template: "<input id='checkboxMod' type='checkbox' class='checkbox' >",
										                    filterable: false,
										                    //title: "Eliminar",
										                    width: '3%'
										                }]
                                });

                                $('.k-grid-pager').hide();
                                displayDetalleNuevoPedidoMod();
  															grid = $("#pGridPedidoDetMod").data("kendoGrid");
																grid.hideColumn("precios");
                                grid.hideColumn("mesaje");

																grid.table.on("click",".checkbox", function (e) {
																	
								                    var grid2 = $("#pGridPedidoDetMod").data("kendoGrid");
								                    var row2 = $(this).closest("tr");
								                    var rowIdx2 = $("tr", grid2.tbody).index(row2);
								                    localStorage['numFilaSeleccionada']=rowIdx2;
								                    var row = $(e.target).closest("tr");
    																var item = grid2.dataItem(row);
								                    localStorage.setItem('itemCheckGridNuevoPedido', item.cod_articulo);
								                    $("#pDialogEliminarNuevoArticulo").popup("open");
								
								                });


                                       
                            } 
                            
                        }, error);
                } else {
                    //console.log("ESTE PEDIDO NO TIENE DETALLE");
                }

            }, error);
        //console.log("Fin pMostrarDetallePedido");


    });
   
   /*db.transaction(function (transaction) { 
     transaction.executeSql(sql, undefined,
      function (transaction, result) {

			if (result.rows.length) {
			var mensageError = [];
			var preu;
			var idOrderXD;
			if (result.rows.length == 1) {
			    var rowDb = result.rows.item(0);
			    idOrderXD = rowDb.idOrder;
			    $("#txtCodPedido").val(rowDb.reference);
			    $("#txtCodCentro").val(rowDb.centro);
			    $("#txtNomProveedor").val(rowDb.proveedor);
			    // Nom proveedor será combo
			    var f = rowDb.documentDate.substring(8, 10) + "/" + (parseInt(rowDb.documentDate.substring(5, 7)) + 1) + "/" + rowDb.documentDate.substring(0, 4) + " " + rowDb.documentDate.substring(11, 13) + ":" + rowDb.documentDate.substring(14, 16);
			    $("#txtFechaEmision").val(f);
			    f = rowDb.documentDate.substring(8, 10) + "/" + (parseInt(rowDb.documentDate.substring(5, 7)) + 1) + "/" + rowDb.documentDate.substring(0, 4);
			    $("#txtFechaEntrega").val(f);
			    $("#txtEstadoPedido2").css('background', 'url(./images/'+rowDb.icono+') no-repeat scroll 15px 15px').val();
			    $("#txtEstadoPedido2").css('padding', '0 0 0 35px').val(rowDb.estado);
			    //$("#txtEstadoPedido").html('<img src="./images/'+rowDb.icono+'"/>'+rowDb.estado);
			    //var imagen = '<img src="./images/'+rowDb.icono+'" >';
			    //$("#txtEstadoPedido2").html(imagen);
			    preu = Math.round(rowDb.amount * 100) / 100;
			    
			    var s = "$";
			
			    if (rowDb.currency == "EUR") {
			        s = '?';
			    }
			
			    $("#txtValorPedido").val(formatearMoneda(preu) + " " + s);
			
			        
					//console.log("Mensaje de error: " + mensageError[0]);
					
					if ( rowDb.error_men != undefined  && rowDb.error_men != "" ) {
							$("#pedidosDialogAText").text(rowDb.error_men);
			        $("#DialogPedisoDetalleErrorQuery").popup("open");	
					}
					            				
			
			} else {
			 	alert("ERROR DE INTEGRIDAD DE DATOS");
			}



        if (data.substr(0, 3) == "Tmp") {
            var sqlItem = "SELECT DISTINCT d.*, i.*, c.logisticChainName as desCantidad, c.ordinalType as numUds, d.idInternalOrder as idOrder FROM ordersPendingDetail as d , items as i, logisticChains as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + "  AND d.idInternalOrder='" + idOrderXD + "' ";
        } else {
            var sqlItem = "SELECT DISTINCT d.*, i.*, c.logisticChainName as desCantidad, c.ordinalType as numUds FROM ordersDetail as d, items as i, logisticChains as c WHERE  d.idItem=i.idItem  AND d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + "  AND d.idOrder='" + rowDb.idOrder + "' ";
        }             
    

        localStorage['pDetalleAnterior'] = data;
        //console.log("Reference : "+data);

        //var sql = "SELECT o.*, v.name as proveedor, p.name as centro , s.name as estado FROM orders as o,  vendors as v , purchaseCenters as p,  status as s WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND o.status=o.status AND o.reference='"+data+"'";

        if (data.substr(0, 3) == "Tmp") {
											
          var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad, d.ordinalType as numUds, d.idInternalOrder as idOrder, message as error_row, i.itemUnitName " + 
          " FROM ordersPendingDetail as d LEFT OUTER JOIN items as i ON d.idItem=i.idItem  " + 
          " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND l.idVendor=" + rowDb.idVendor + 
          " LEFT OUTER JOIN ordersPendingDetailErrors as e ON e.idOrder=d.idInternalOrder AND e.lineNumber=d.lineNumber  "+ 
          " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
          " WHERE d.idInternalOrder='" + idOrderXD + "' ";
          
      } else {
          var sqlItem = "SELECT d.*, i.*, l.logisticChainName as desCantidad, d.ordinalType as numUds, null as error_row, i.itemUnitName " +
          " FROM ordersDetail as d , items as i  " + 
          " LEFT OUTER JOIN logisticChains as l ON d.idItem=l.idItem AND d.idLogisticsChain=l.idLogisticsChains AND c.idVendor=" + rowDb.idVendor +  
          " LEFT OUTER JOIN catalog as c ON d.idItem=c.idItem AND d.idLogisticsChain=c.idLogisticsChains AND c.idVendor=" + rowDb.idVendor + " AND c.idPurchaseCenter=" + rowDb.idPurchaseCenter +  
          " WHERE d.idItem=i.idItem AND d.idOrder='" + rowDb.idOrder + "' ";
     	}
        
        transaction.executeSql(sql, undefined,
            function (transaction, result) {
            	
                var n_reg = 0;
            	  var pJsonPedidosDetMod=[];
							  var rowDb = [];
                var t = 0;

                for (var i = 0; i < result.rows.length; i++) {
                	
                    rowDb = result.rows.item(i);
                    
                    if (rowDb.desCantidad==null || rowDb.desCantidad=="") { cadena=rowDb.itemUnitName; }
                    else cadena=rowDb.desCantidad;
                    	
                    total = parseInt(rowDb.quantity) * parseInt(rowDb.numUds);
                    ////console.log(rowDb.quantity + " * " + rowDb.numUds + " = " + total);
										//if (total=="NaN" || total==undefined) { total=0; }
                    pJsonPedidosDetMod.push({

                        cod_articulo: rowDb.idItem,
                        nom_articulo: rowDb.name,
                        cant_pedida: rowDb.quantity,
                        cadena_logistica: cadena,
                        unidades_total: total,
                        mensaje:rowDb.error_row

                    });
                    
                    n_reg = n_reg + 1;
                }
								
								//console.log(pJsonPedidosDetMod);
							  localStorage["pedidos_detalle_pag_act"] = 1;
							  localStorage["pedidos_detalle_pag_max_row"] = localStorage["max_row_per_pag"];
							  localStorage["pedidos_detalle_pag_last"] = Math.ceil(n_reg / localStorage["pedidos_detalle_pag_max_row"]);
							
							
							  var mr = parseInt(localStorage["pedidos_detalle_pag_max_row"]);
							  mr = mr - 7;
							  //console.log("maximas filas en detalle pedido" + mr);
							
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
							
							
							   $("#pGridPedidoDetMod").kendoGrid({

                  dataSource: {
                      data: pJsonPedidosDetMod,
                      schema: {
                          model: {
                              fields: {
                                  cod_articulo: {
                                      type: "string"
                                  },
                                  nom_articulo: {
                                      type: "string"
                                  },
                                  cant_pedida: {
                                      type: "string"
                                  },
                                  cadena_logistica: {
                                      type: "string"
                                  },
                                  unidades_total: {
                                      type: "string"
                                  }
                              }
                          }
                      },
                      pageSize: mr
                  },
                  scrollable: false,
                  selectable: false,
                  sortable: false,
                  filterable: true,
                  pageable: true,
                  columns: [{
                      field: "cod_articulo",
                      headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet1()' data-role='button' role='button'> " + cod + " <img id='sortPedidosDet1' src='./images/sort_both.png' > </a> " +
                          " </div> ",
                      filterable: false,
                      template: "<div class='ra'>#= cod_articulo #</div>",
                      title: cod,
                      width: '7%'
                  }, {
                      field: "nom_articulo",
                      headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet2()' data-role='button' role='button'> " + des + " <img id='sortPedidosDet2' src='./images/sort_both.png' > </a> " +
                          " </div> ",
                      filterable: false,
                      title: des,
                      width: '50%'
                  }, {
                      field: "cant_pedida",
                      headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet3()' data-role='button' role='button'> " + cant + " <img id='sortPedidosDet3' src='./images/sort_both.png' > </a> " +
                          " </div> </div>",
                      filterable: false,
                      template: "<div class='ra'>#= cant_pedida #</div>",
                      title: cant,
                      width: '9%'
                  }, {
                      field: "cadena_logistica",
                      headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet4()' data-role='button' role='button'> " + cade + " <img id='sortPedidosDet4' src='./images/sort_both.png' > </a> " +
                          " </div> ",
                      filterable: false,
                      title: cade,
                      width: '14%'
                  }, {
                      field: "unidades_total",
                      headerTemplate: "<div style='position: relative; float: left'><a onclick='sortDet5()' data-role='button' role='button'> " + unid + " <img id='sortPedidosDet5' src='./images/sort_both.png' > </a> " +
                          " </div> ",
                      filterable: false,
                      template: "<div class='ra'>#= unidades_total #</div>",
                      title: unid,
                      width: '7%'
                  },{
	                    field: "Eliminar",
	                    headerTemplate: "<div style='position: relative; float: left'> <a onclick='inactivo()' data-role='button' role='button'> " + "<img id='sortPedidosVendors' src='./images/papelera.png'> ",
	                    template: "<input type='checkbox' class='checkbox' />",
	                    filterable: false,
	                    title: "Eliminar",
	                    width: '7%'
	                }]
                 });

              $('.k-grid-pager').hide();
              
              displayDetalleNuevoPedidoMod();
					  });
		  
		}); */
}

function pBorrarPedidosSinFinalizar() {
	
	db.transaction(function (transaction) {
	
		var sql="DELETE FROM ordersPendingDetail  WHERE EXISTS (SELECT * FROM ordersPending as o WHERE unfinished='TRUE' AND o.idInternalOrder=ordersPendingDetail.idInternalOrder)";
		transaction.executeSql(sql, undefined,
	  	function (transaction) {
	  		
	  		sql="DELETE FROM ordersPending  WHERE unfinished='TRUE' ";
	  		transaction.executeSql(sql, undefined, function (transaction) {});
	  	
	  });
	 });
	 
	 db.transaction(function (transaction) {
	
		var sql="DELETE FROM ordersPending  WHERE NOT EXISTS (SELECT * FROM ordersPendingDetail as o WHERE o.idInternalOrder=ordersPendingDetail.idInternalOrder)";
		transaction.executeSql(sql, undefined,
	  	function (transaction) {
	  		
	  		
	  	
	  });
	 });

		
}