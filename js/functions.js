// JavaScript Document

/* 
* sistema de logs 
*/
var i_log = 0;
function mkLog(text){
	var date = new Date();
	var txt = i_log + " - " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ": " + text;
	i_log++;
	console.log(txt);
	//$("#log").append(txt  + "<br>");
}


/* 
* variables de la aplicación
*/
	var existe_db
	var db
	


/* 
* carga inicial de la app
*/
function onBodyLoad() {    
	document.addEventListener("deviceready", onDeviceReady(), false);
	//alert('LLEGUE AL ONBODYLOAD()');
}

function onDeviceReady(){
	//alert('LLEGUE AL onDeviceReady()');
	mkLog("Aplicación cargada y lista");
	//alert('Aplicación cargada y lista');
    //navigator.notification.alert('PhoneGap is working','','','');

    
	
	existe_db = window.localStorage.getItem("existe_db");
	alert(existe_db);
	db = window.openDatabase("servicios", "1.0", "Catalogo de servicios", 200000);
	if(existe_db == null){
		alert('CREAR BASE DE DATOS');
		creaDB();
		
	}else{
		alert('CARGAR LA BASE DE DATOS');
		cargaDatos();
	}
	
	$('#btn_guardar').click(function(e){
		if($.id != -1){
			alert('SAVE EDIT FORM');
		 	saveEditForm();
		 }else{
		 	alert('SAVE NEW FORM');
			saveNewForm();
		 }
	 });
}

/* 
* creación de la base de datos
*/
function creaDB(){
	db.transaction(creaNuevaDB, errorDB, creaSuccess());
	
}

function creaNuevaDB(tx){
	mkLog("Creando base de datos");
	alert('Creando base de datos');
	
	tx.executeSql('DROP TABLE IF EXISTS servicios');
	
	var sql = "CREATE TABLE IF NOT EXISTS servicios ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"nombre VARCHAR(50), " +
		"imagen VARCHAR(50), " +
		"telefono VARCHAR(30), " +
		"email VARCHAR(30), " +
		"domicilio VARCHAR(30), " +
		"categoria VARCHAR(30), " +  
		"nota VARCHAR(50) )";
		
	alert('Se creo la base de datos');

	tx.executeSql(sql);
	
	tx.executeSql("INSERT INTO servicios (nombre,imagen,telefono,email,domicilio,categoria,nota) VALUES ('Ejemplo1','imagen1','6699900970','ejemplo@mail.com','granadas','lista_administrador','soy el mejor yeah')");

	alert('YA INSERTE');
}

function creaSuccess(){
	window.localStorage.setItem("existe_db", 1);
	alert('VOY A CARGAR datos: ');
	cargaDatos();
}

function errorDB(err){
	mkLog("Error procesando SQL " + err.code);
	alert('Error procesando SQL: ' + err.code);
	//navigator.notification.alert("Error procesando SQL " + err.code);
	//alert('Error procesando SQL');

}

/*
* creando registros
*/
function saveNewForm(){
	if(db != null){
		db.transaction(queryDBInsertForm, errorDB);
	}

	//$.mobile.changePage("#inicio");
}

function queryDBInsertForm(tx){
	var cat = $("#lista_categoria").find("input:selected").val();
	
	tx.executeSql("INSERT INTO servicios (nombre,imagen,telefono,email,domicilio,categoria,nota) VALUES ('"+$("#nombre").val()+"','"+$("#imagen").val()+"','"+$("#telefono").val()+"','"+$("#email").val()+"','"+$("#domicilio").val()+"','"+cat+"','"+$("#nota").val()+"')", [], newFormSuccess, errorDB);
	lert('INSERTE DE NUEVO');
}
function newFormSuccess(tx, results) {
	var cat = $("#lista_categoria").find("input:selected").val();
	var lista = $("#lista_" + cat + " ul")
	
	// <img src="'+ $.imageUR +'" class="img_peq"/> esto va antes de nombre
	
	var obj = $('<li id="li_'+results.insertId+'"><a href="#detalle" data-uid='+results.insertId+' class="linkDetalles"><div class="interior_lista"><span>' + $("#nombre").val() + " " + $("#imagen").val()+ '</span></div></a><a href="#form"  data-theme="a" data-uid='+results.insertId+'  class="linkForm">Predet.</a></li>');
	obj.find('.linkDetalles').bind('click', function(e){
		$.id = $(this).data('uid');
	});
	
	obj.find('.linkForm').bind('click', function(e){
		$.id = $(this).data('uid');
	});
	lista.append(obj).listview('refresh');
	
	
	$.mobile.changePage("#inicio");
}

/* 
* carga de datos desde la base de datos
*/
function cargaDatos(){
	db.transaction(cargaRegistros, errorDB);
	alert('ya carge datos');
	
}

function cargaRegistros(tx){
	mkLog("Cargando registros de la base de datos");
	tx.executeSql('SELECT * FROM servicios', [], cargaDatosSuccess, errorDB);
}

function cargaDatosSuccess(tx, results){
	mkLog("Recibidos de la DB " + results.rows.length + " registros");
	if(results.rows.length == 0){
		mkLog("No se han recibido registros");
		navigator.notification.alert("No hay contactos en la base de datos");
	}
	
	for(var i=0; i<results.rows.length; i++){
		var persona = results.rows.item(i);
		var selector = $("#lista_" + persona.categoria + " ul");
		var foto = persona.foto;
		if(foto == ""){
			//foto = "assets/no_foto.png";
		}
		selector.append('<li id="li_'+persona.id+'"><a href="#detalle" data-uid='+persona.id+' class="linkDetalles"><div class="interior_lista"><img src="'+ foto +'" class="img_peq"/><span>' + persona.nombre + ' ' + persona.imagen + '</span></div></a><a href="#form"  data-theme="a" data-uid='+persona.id+'  class="linkForm">Predet.</a></li>').listview('refresh');
	}
	
	$(".linkDetalles").click(function(e){
		$.id = $(this).data("uid");
	});
	
	$(".linkForm").click(function(e){
		$.id = $(this).data("uid");
	});
}

