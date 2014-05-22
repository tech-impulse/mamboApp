
function authentication() {
	
	localStorage.setItem('pantalla',"dialogoLogin") ;		

	var usuario = document.getElementById('user_txt').value;
	var password = document.getElementById('pass_txt').value;
	var passMD5 = CryptoJS.MD5(password).toString();	
	var auth = make_basic_auth(usuario, password);	
	token="";
	localStorage.setItem('auth',auth);
	localStorage.setItem('usuario',usuario);
	localStorage.setItem('pass',passMD5);
	
	console.log("login. usuario="+usuario+" password="+passMD5);
	if (usuario=="" || password=="")
	{
		getDescripcionAviso("loginSinCredenciales"); 
		$( "#loginDialogA" ).popup( "open" );
	}
	else 	//Autenticación Offline
			checkInicio(); // Miramos si estamos online o no
}

function getToken(){
		// var uri = "/sec/auth/login";
		var uri = "/security/login";
			console.log("getToken");
			$.support.cors = true;
        $.ajax({
            async: false,
            url : host+uri,
            dataType : "json",
            crossDomain: true,
            //method : 'POST',
            type : 'POST',
            //data : { Application: "APP_REPLENISHMENT", Authorization: "Basic dGVzdDp0ZXN0" }, 
            //data : { Application: "APP_REPLENISHMENT" },
            beforeSend : function(req) {           
            req.setRequestHeader('Authorization', localStorage.getItem('auth'));
            //req.setRequestHeader('Areas-Application', "APP_REPLENISHMENT");
          },
            success: parseTokenJSON, // modificado
            error: ServiceLoginFailed
           
        });

		console.log("URL: " + uri);
}


function make_basic_auth(user, password){
  var tok = user + ':' + password;
  var hash = Base64.encode(tok);
  return "Basic " + hash;
}

//Pensiente de ver si es necesario
function parseToken(response){		

  console.log("parseToken");
  console.log(" JSON retornado del login " + response);
    // var $events = $(response).find("token");
	var token = JSON.stringify(response.body.tokenValue);
	localStorage['token']= JSON.stringify(response.body.tokenValue);

	console.log(" este es el token " + token);				

	/*
	if (token!=null) {
		//$.mobile.changePage('#progressPage');
		//progress(0, $('#progressBar')); 
		restOrders();
		restDetails();
		
	};
		*/
  completedLoad();

}

function progress(percent, textoProgreso) {

    var progressBarWidth = percent * $('#progressBar').width() / 100;

		$('#progressBar').find('div').animate({ width: progressBarWidth }, 500); 
    $('#progressBar').find('div').html(percent + "%&nbsp;");
    
    document.getElementById('progress-msg').innerHTML = textoProgreso;	
    
    //console.log("BARRA ---> "+percent + " TEXTO =" +textoProgreso );

}

function checkInicio() 
{
   
	if (navigator.onLine) // Estamos Online
	{
		getToken(); // proceso getToken --> parseTokenJSON --> loginOnline
	}
	else
	{
		traducir();
		loginOffline();
	}
}

function loginOnline(res)
{
	localStorage["cargaDeDatos"]="";

	if (localStorage.getItem('ultimo_usuario')!=null)
	{
		db.transaction (function (transaction) 
		{  
			var sql = "SELECT * FROM User"; 
			transaction.executeSql (sql, undefined, 
			function (transaction, result)
			{ 
				progress(1, "" );  
				var ambito=1;
				var usuario = localStorage.getItem('usuario');
				var pass = localStorage.getItem('pass'); 
				if (result.rows.length > 0)
				{
					for (var i = 0; i < result.rows.length; i++) 
					{
						var u = result.rows.item (i);
						var usuarioAnterior = u.usuario;
						var passAnterior = u.pass;
						}
					if ((usuarioAnterior == usuario) && (passAnterior==pass)) // Es el mismo usuario y password que el anterior
					{
                        if (compareTime()>tiempoRecargaBD) //Si no han pasado 6 horas
						{
							var currentdate = new Date(); 
							localStorage["ultima_carga"] = currentdate.getTime(); // guardamos otra vez la ultima vez para recalcular las 6h
                            console.log("Usuario y password identicos, tiempo menor a 6h");
                            localStorage.setItem('checkUsuario',"1") ;		
                            getDescripcionAviso("loginOnline"); // Desea actualizar la base de datos? SI -> getToken / NO -> pMostrarPedido
                            $( "#loginDialogAC" ).popup( "open" );
						}
                        else // Debe recargar la base de datos
                        {
                            console.log("Usuario y password identicos, tiempo MAYOR a 6h");
                           	trunkDB();
							window.setTimeout(restServices(res), 500);	
                        }
                        
						//$.mobile.changePage('#loginDialogAC', 'pop', true, true);
					}
					else 
					{
							console.log("No es del mismo ambito, no coincide con el usuario anterior, debe recargar");
							//localStorage.setItem('checkUsuario',"1");		
							trunkDB();
							window.setTimeout(restServices(res), 500);													
					}					
			  }					
			},error);
		});
	}
	else { // No hay información del usuario anterior.
		trunkDB();
		window.setTimeout(restServices(res), 500);	
	}
}

function loginOffline(){
	
	if (localStorage.getItem('ultimo_usuario')!=null)
	{
		db.transaction (function (transaction) 
		{  
			var sql = "SELECT * FROM User"; 
			transaction.executeSql (sql, undefined, 
			function (transaction, result)
			{   
				var ambito=1;
				var usuario = localStorage.getItem('usuario');
				var pass = localStorage.getItem('pass'); 
				if (result.rows.length > 0) // Hay usuario guardado
				{
					for (var i = 0; i < result.rows.length; i++) 
					{
						var u = result.rows.item (i);
						var usuarioAnterior = u.usuario;
						var passAnterior = u.pass;
						}
					if ((usuarioAnterior == usuario) && (passAnterior==pass))
					{
                        // Usuario Coincide, Desea continuar sin actualizar la base de datos?
                        localStorage.setItem('checkUsuario',"3");	
                        getDescripcionAviso("loginOfflinePregunta");
                        $( "#loginDialogAC" ).popup( "open" );			
					}
					else
					{
                        // Usuario no coincide, Solo el usuario anterior puede conectarse
                        localStorage.setItem('checkUsuario',"2");	
                        getDescripcionAviso("loginOfflineUserError");
                        $( "#loginDialogAC" ).popup( "open" );	
					}					
			  }					
			},error);
		});	
	}
	else
	{
        // Usuario no coincide, Para iniciar la aplicación debes estar conectado
		localStorage.setItem('checkUsuario',"2") ;
		getDescripcionAviso("loginOfflineNoData");
		$( "#loginDialogAC" ).popup( "open" );
	}
	
}

function checkScopes(res){
	console.log("Respuesta del servicio completa " + JSON.stringify(res));
	transactionId = res.body.transactionId;
	var scopes;
	var contService = 0;
	var contDb = 0;
	$.each(res, function() { // cogemos los scopes del webservice del usuario que se ha logado
		if (this.scopes!=undefined) 
		{
			scopes= this.scopes;
			console.log("Scope: " + this.scopes);
		}
	});
	db.transaction (function (transaction) 
		{  
			var sql = "SELECT * FROM scopes";  // cogemos los scopes del ultimo usuario logado
			transaction.executeSql (sql, undefined, 
			function (transaction, result)
			{   
				if (result.rows.length > 0)
				{
					for (var i = 0; i < result.rows.length; i++) 
					{
						var u = result.rows.item (i);
						for (var j = 0; j < scopes.length; j++)
						{
							if (u.scope == scopes[j])
								contService++;

						}
						contDb++;
						
					}
					if ((contDb == contService) && (scopes.length==result.rows.length))
					{
						if (compareTime()>tiempoRecargaBD) // 360 son 6 horas
						{
							console.log("Mismos Scopes, tiempo MAYOR a 6h");
							var currentdate = new Date(); 
							localStorage["ultima_carga"] = currentdate.getTime(); // guardamos otra vez la ultima vez para recalcular las 6h
							localStorage.setItem('checkUsuario',"1") ;
							getDescripcionAviso("loginOfflinePregunta");
							//checkInicio();
							$( "#loginDialogAC" ).popup( "open" );  
						}
						else
						{
                            if (localStorage["cargaDeDatos"]=="completa")
                            {
                               console.log("Mismos Scopes, tiempo menor a 6h");
                               localStorage['pantalla'] = "menuPrincipal";
                               $.mobile.changePage('#menuPrincipal');
                            }
                            else
                            {
                               loginOnline(res);
                            }
						}
               		}
							
					else
					{
                        console.log("Los Scopes no coinciden --> Comprobamos Usuario");
						loginOnline(res);
					}
				}
				else {
					loginOnline(res); // No hay Scopes
                }			
			},error);
		});	
}

function parseTokenJSON(response){	
                          
  //console.log(JSON.stringify(response));
    var accion = $('#pedidosDialogACOrden').text();
	token = response.body.tokenValue;
	console.log(" Token de la session " + token);
	localStorage["token"] = token;	
	if (accion !="actualizar"){
        
        if (token!=null) 
        {

            localStorage['language']=response.body.language;
            localStorage['transactionId']=response.body.transactionId;
            console.log("IDIOMA DEL WS ---->|"+localStorage['language']+"|" );
            traducir();		// Traducimos la App según el idioma del ws
            checkScopes(response); // comprobamos los scopes
            //loginOnline(response);

        }	else {
            console.log("credenciales no validas");
            getDescripcionAviso("CredencialesErroneas");
            $("#pedidosDialogAC").popup("open");
        }
    }

}

	
	