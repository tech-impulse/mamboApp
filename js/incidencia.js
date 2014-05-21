$(document).on('pageinit', '#Sistema', function () {
    var lang = localStorage['language'];
    console.log("Iniciamos Sistemas");
      if (lang == "ES") {
        $('#sTituloSistemas').text("Sistema");
        $('#sLbEnviarDb').text("Enviar Base de Datos");
        $('#sLbReportarIncidencia').text("Reportar Incidencia");
        $('#sLbCentro').text("Centro:");
        $('#sLbAsunto').text("Asunto:");
        $('#sLbDescripcion').text("Descripción:");
        $('#sLbPersona').text("Persona de contacto:");
        $('#sLbTelefono').text("Teléfono de contacto:");
      }
      if (lang == "EN") {

        $('#sTituloSistemas').text("System");
        $('#sLbEnviarDb').text("Send Data Base");
        $('#sLbReportarIncidencia').text("Report Incident");
        $('#sLbCentro').text("Center:");
        $('#sLbAsunto').text("Issue:");
        $('#sLbDescripcion').text("Description:");
        $('#sLbPersona').text("Contact Person:");
        $('#sLbTelefono').text("Contact Phone:");
      }



$('#btnSistemasHeaderBack').on('tap', function(){
    console.log("IIIIII");
                    
    if( $('#menuSistema').is(":visible"))
    {
        $.mobile.changePage("#menuPrincipal");
    }
    if ($('#reportarIncidencia').is(":visible"))
    {
        $('#sTituloSistemas').text("Sistema");
        $('#reportarIncidencia').hide(); 
        $('#menuSistema').show(); 
    }
                
});

$('#btnReportarIncidencia').on('tap', function(){

        if(navigator.onLine)
        {
            $('#sTituloSistemas').text("Reportar Incidencia");
            $('#menuSistema').hide();  
            $('#reportarIncidencia').show();    
            $('#enviarBD').hide();
            reportarIncidencia();
        }
        else
            console.log("Check Connection");
        
 });

});

function reportarIncidencia() {
    
    var online = localStorage['conectado'];
    console.log("Online? "+online);
        
    if(online == "true"){
        
        $("#DialogIncidenciaOffLine").popup("close");   
        
        db.transaction(function (transaction) {

        //var sql = "SELECT  p.shortName FROM ordersPending as o, vendors as v , purchaseCenters as p,  status as s, deliveryZones as d WHERE o.idVendor=v.idVendor AND o.idPurchaseCenter=p.idPurchaseCenter AND d.idDeliveryZone=o.idDeliveryZone AND o.status=s.id AND o.username='" + localStorage['usuario'] + "' AND o.unfinished=0 "
        //setTimeout( function(){$("#Asunto").focus();},500);
        
        
        var sql = "SELECT p.shortName FROM  purchaseCenters as p "

            
        console.log("CONSULTA  " + sql);

        transaction.executeSql(sql, undefined,
            function (transaction, result) {
                
                var aux = [];

              for (var i = 0; i < result.rows.length; i++) {
                
                  var rowDb = result.rows.item(i);
                  
                  aux.push({
                      cod_centr: rowDb.shortName
                  });

              }
              
              function onClose() {
                  var centro = $('#listaCentrosIncidencia').val();
                  setTimeout(function(){$('#Asunto').focus();},100);
                  console.log("Valor de la lista es: "+centro);
              };
              
              var lista = $('#listaCentrosIncidencia').kendoDropDownList({
	              dataSource:{ 
	                    data: aux
	                },
	                dataTextField: 'cod_centr',
	                dataValueField: 'cod_centr',
	                optionLabel: "-- Selec. --",
                close: onClose
              }).data ("kendoDropDownList");
              
             
			  $('#Descripcion').on('focus', function() {  
				$(this).blur();
				   setTimeout(function(){$("#listaCentrosIncidencia").data("kendoDropDownList").focus();},200);
			   });
                                        
              var asunto = $('#Asunto').val();
              var descripcion = $('#Descripcion').val();
              var persona = $('#Persona').val();
              var telf = $('#Telf').val();
                         
            });
    });
        
    }else{
        $("#DialogIncidenciaOffLine").popup("open");        
    }

        
    
}