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
	//alert('estoy en onBodyLoad');
}

function onDeviceReady(){
	mkLog("Aplicación cargada y lista");
	//alert('Aplicación cargada y lista');
    //navigator.notification.alert("PhoneGap is working");
	
	existe_db = window.localStorage.getItem("existe_db");
	db = window.openDatabase("servicios", "1.0", "DB del curso Phonegap", 200000);
	if(existe_db == null){
		//alert('voy al metodo creaDB');
		creaDB();
	}else{
		//alert('voy al metodo cargaDatos');
		cargaDatos();
	}
	
	
	$("#btn_guardar").click(function(e){
		if($.id == -1){
		 	//alert('voy al metodo saveNewForm');
		 	if($("#alta_nombre").val() == "" || $("#alta_telefono").val() == "" || $("#alta_email").val() == "" || $("#alta_domicilio").val() == "" || $("#alta_nota").val() == ""){
		 		alert('Hay campos vacíos. Agregue información.');
		 	}else{
				saveNewForm();
			}
		 }
	 });

	$("#btn_actualizar").click(function(e){
		if($.id != -1){
			//alert('voy al metodo saveEditForm');
			if($("#act_nombre").val() == "" || $("#act_telefono").val() == "" || $("#act_email").val() == "" || $("#act_domicilio").val() == "" || $("#act_nota").val() == ""){
		 		alert('Hay campos vacíos. Agregue información.');
		 	}else{
		 		var opcion = confirm("¿Desea Actualizar?");
	    		if (opcion == true) {
		 			saveEditForm();
		 		} else {
		    
				}
		 	}
		 }
	 });

	$("#btn_eliminar").click(function(e){
		//alert('voy al metodo saveDeleteForm');
	    var opcion1 = confirm("¿Desea Eliminarlo?");
	    if (opcion1 == true) {
	    	saveDeleteForm();
		} else {
		    
		}
		
	 });

	$("#btn_cancelar1").click(function(e){
		//alert('voy al metodo cancelProcess1');
		var opcion2 = confirm("¿Desea Cancelar?");
	    if (opcion2 == true) {
			cancelProcess1();
		} else {
		    
		}
	 });

	$("#btn_cancelar2").click(function(e){
		//alert('voy al metodo cancelProcess2');
		var opcion3 = confirm("¿Desea Cancelar?");
	    if (opcion3 == true) {
			cancelProcess2();
		} else {
		    
		}
	 });

	$("#img_1").click(function(e){
		window.open('https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=72HS92PWABTAS', '_system');
	 });

	$("#img_2").click(function(e){
		window.open('https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=3TLZ38P5FAZF4', '_system');
	 });

	$("#img_3").click(function(e){
		window.open('https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=59U5VRBRZLFF6', '_system');
	 });

	// Take photo from camera
            $('#but_take').click(function(){
                navigator.camera.getPicture(onSuccess(), onFail, { quality: 20,
                    destinationType: Camera.DestinationType.FILE_URL 
                });
            });

            // Select from gallery 
            $("#but_select").click(function(){
                navigator.camera.getPicture(onSuccess(), onFail, { quality: 50,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
                    allowEdit: true,
                    destinationType: Camera.DestinationType.FILE_URI
                });
            });

            // Change image source
            function onSuccess(imageData) {
                var image = document.getElementById('img5');
                image.src = imageData + '?' + Math.random();;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
}


/* 
* creación de la base de datos
*/
function creaDB(){
	db.transaction(creaNuevaDB, errorDB, creaSuccess);
	
}

function creaNuevaDB(tx){
	mkLog("Creando base de datos");
	//alert('creando base de datos');
	
	tx.executeSql('DROP TABLE IF EXISTS servicios');
	
	var sql = "CREATE TABLE IF NOT EXISTS servicios ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"nombre VARCHAR(50), " +
		"imagen VARCHAR(50), " +
		"telefono VARCHAR(30), " +
		"email VARCHAR(30), " +
		"domicilio VARCHAR(200), " +
		"categoria VARCHAR(200), " + 
		"nota VARCHAR(30) )";
		
	tx.executeSql(sql);
	
	tx.executeSql("INSERT INTO servicios (id,nombre,imagen,telefono,email,domicilio,categoria,nota) VALUES (1,'Ejemplo1','','6699900970','ejemplo@mail.com','granadas 258','carpinteria','soy el mejor yeah!')");

	//alert('inserte el predeterminado');
}

function creaSuccess(){
	window.localStorage.setItem("existe_db", 1);
	cargaDatos();
}

function errorDB(err){
	mkLog("Error procesando SQL " + err.code);
	//navigator.notification.alert("Error procesando SQL " + err.code);
	//alert("Error procesando SQL " + err.code);
}

/* 
* carga de datos desde la base de datos
*/
function cargaDatos(){
	db.transaction(cargaRegistros, errorDB);
}

function cargaRegistros(tx){
	mkLog("Cargando registros de la base de datos");
	//alert('cargando registros de la base de datos');
	tx.executeSql('SELECT * FROM servicios', [], cargaDatosSuccess, errorDB);
}

function cargaDatosSuccess(tx, results){
	mkLog("Recibidos de la DB " + results.rows.length + " registros");
	//alert("Recibidos de la DB " + results.rows.length + " registros");
	if(results.rows.length == 0){
		mkLog("No se han recibido registros");
		alert("No hay Registros en la Base de Datos");
		//navigator.notification.alert("No hay contactos en la base de datos");
	}
	//alert("Voy a cargar registros");
	for(var i=0; i<results.rows.length; i++){
		var persona = results.rows.item(i);
		var selector = $("#lista_" + persona.categoria + " ul");
		var foto = persona.imagen;
		if(foto == ""){
			foto = "assets/no_foto.png";
		}
		selector.append('<li id="li_'+persona.id+'"><a href="#detalle" data-uid='+persona.id+' class="linkDetalles"><div class="interior_lista"><img src="'+ foto +'" class="img_peq"/><span>' + persona.nombre + '</span></div></a><a href="#ActualizarEliminarServicio"  data-theme="a" data-uid='+persona.id+'  class="linkForm">Predet.</a></li>').listview('refresh');
	}
	
	$(".linkDetalles").click(function(e){
		$.id = $(this).data("uid");
	});
	
	$(".linkForm").click(function(e){
		$.id = $(this).data("uid");
	});
}

$(document).on("pagebeforeshow", "#AgregarServicio", function(){
	mkLog('ID recuperado en vista AgregarServicio: ' + $.id);
	//alert('ID recuperado en vista AgregarServicio: ' + $.id);
	initForm();
});

function initForm(){
	$.imageURL = "assets/no_foto.png";
	
	$("#alta_imagen").attr("src", $.imageURL);
	$("#alta_nombre").val("");
	$("#alta_telefono").val("");
	$("#alta_email").val("");
	$("#alta_domicilio").val("");
	$("#alta_nota").val("");
		
	$("#cat_administrador").trigger("click").trigger("click");
	$("#alta_nota").val("");
}


/*
* vista detalle
*/

$(document).on("pagebeforeshow", "#detalle", function(){
	if(db != null){
		db.transaction(queryDBFindByID, errorDB);
	}
});



function queryDBFindByID(tx) {
    tx.executeSql('SELECT * FROM servicios WHERE id='+$.id, [], queryDetalleSuccess, errorDB);
    //alert("pase la consulta");
}

function queryDetalleSuccess(tx, results) {
	mkLog("Recibidos de la DB en vista detalle" + results.rows.length + " registros");
	//alert("Recibidos de la DB en vista detalle" + results.rows.length + " registros");
	if(results.rows.length == 0){
		mkLog("No se han recibido registros para la vista detalle");
		//navigator.notification.alert("No hay detalles para ese elemento");
		alert("No hay detalles para ese elemento");
	}
	//alert("voy a cargar los detalles");
	$.registro = results.rows.item(0);
	$("#categoria").html($.registro.categoria);
		var _foto = $.registro.imagen;
		if(_foto == ""){
			_foto = "assets/no_foto.png";
		}
		$("#foto_img").attr("src", _foto);
		$("#nombre").html($.registro.nombre);
		$("#telefono").html($.registro.telefono);
		$("#email").html($.registro.email);
		$("#domicilio").html($.registro.domicilio);
		$("#nota").html($.registro.nota);
		
}

/*
* vista detalle
*/
//vista de la página de edición
$(document).on('pagebeforeshow', '#ActualizarEliminarServicio', function(){ 
	mkLog('ID recuperado en vista ActualizarEliminarServicio: ' + $.id);
	//alert('ID recuperado en vista ActualizarEliminarServicio: ' + $.id);
	
	initForm2();
	if(db != null && $.id != -1){
		db.transaction(queryDBFindByIDForm, errorDB);
	}
});

function queryDBFindByIDForm(tx) {
    tx.executeSql('SELECT * FROM servicios WHERE id='+$.id, [], queryFormSuccess, errorDB);
    //alert('estoy en la 2da consulta');
}

function queryFormSuccess(tx, results) {
	mkLog("Recibidos de la DB en vista Form" + results.rows.length + " registros");
	//alert("Recibidos de la DB en vista Form" + results.rows.length + " registros");
	if(results.rows.length == 0){
		mkLog("No se han recibido registros para la vista form");
		//navigator.notification.alert("No hay detalles para ese elemento");
		alert("No hay detalles para ese elemento");
	}
	//alert("voy a cargar los datos para editar");
	$.registro = results.rows.item(0);
	
		$.imageURL = $.registro.imagen;
		if($.imageURL == ""){
			$.imageURL = "assets/no_foto.png";
		}
		$("#act_imagen").attr("src", $.imageURL);
		$("#act_nombre").val($.registro.nombre);
		$("#act_telefono").val($.registro.telefono);
		$("#act_email").val($.registro.email);
		$("#act_domicilio").val($.registro.domicilio);
		$("#cat2_"+$.registro.categoria).trigger("click").trigger("click");
		$("#act_nota").val($.registro.nota);
}

$(document).on('pagebeforeshow', '#inicio', function(){ 
	$.id = -1;
	//alert('el id vale: ' + $.id);
});

function initForm2(){
	$.imageURL = "assets/no_foto.png";
	
	$("#act_imagen").attr("src", $.imageURL);
	$("#act_nombre").val("");
	$("#act_telefono").val("");
	$("#act_email").val("");
	$("#act_domicilio").val("");
	$("#act_nota").val("");
		
	$("#cat_administrador2").trigger("click").trigger("click");
	$("#act_nota").val("");
}

//cancelar de AgregarServicio
function cancelProcess1(){
	initForm();
	$.mobile.changePage("#inicio");
}

//cancelar de ActualizarEliminarServicio
function cancelProcess2(){
	initForm2();
	$.mobile.changePage("#inicio");
}

/*
* eliminando registros
*/
function saveDeleteForm(){
	if(db != null){
		db.transaction(queryDBDeleteForm, errorDB);
	}
}

function queryDBDeleteForm(tx){
	tx.executeSql('DELETE FROM servicios WHERE id='+$.id);
	$("#li_"+$.id).remove();
	$.mobile.changePage("#inicio");
	alert('Se ha Eliminado Correctamente');
}

/*
* modificando registros
*/
function saveEditForm(){
	if(db != null){
		db.transaction(queryDBUpdateForm, errorDB, updateFormSuccess);
	}
}

function queryDBUpdateForm(tx){
	var cat = $("#lista_categoria2").find("input:checked").val();
	tx.executeSql('UPDATE servicios SET nombre="'+$("#act_nombre").val()+'",imagen = "'+$.imageURL+'",telefono="'+$("#act_telefono").val()+'",email="'+$("#act_email").val()+'",domicilio="'+$("#act_domicilio").val()+'",categoria="'+cat+'",nota="'+$("#act_nota").val()+'" WHERE id='+$.id);
}
function updateFormSuccess(tx) {
	var selector = $("#li_"+$.id);
	
	var selector = $("#li_"+$.id).clone(true);
	selector.find("img").attr("src", $.imageURL);
	selector.find("a:first").find("span").html($("#act_nombre").val());
	
	
	$("#li_"+$.id).remove();
	
	var cat = $("#lista_categoria2").find("input:checked").val();
	var lista = $("#lista_" + cat + " ul")
	lista.append(selector).listview('refresh');
	
	$.mobile.changePage("#inicio");
	alert('Se ha Actualizado Correctamente');
}

/*
* creando registros
*/
function saveNewForm(){
	if(db != null){
		db.transaction(queryDBInsertForm, errorDB);
	}
}

function queryDBInsertForm(tx){
	var cat = $("#lista_categoria").find("input:checked").val();
	
	tx.executeSql("INSERT INTO servicios (nombre,imagen,telefono,email,domicilio,categoria,nota) VALUES ('"+$("#alta_nombre").val()+"','"+$.imageURL+"','"+$("#alta_telefono").val()+"','"+$("#alta_email").val()+"','"+$("#alta_domicilio").val()+"','"+cat+"','"+$("#alta_nota").val()+"')", [], newFormSuccess, errorDB);
}
function newFormSuccess(tx, results) {
	var cat = $("#lista_categoria").find("input:checked").val();
	var lista = $("#lista_" + cat + " ul")
	
	
	var obj = $('<li id="li_'+results.insertId+'"><a href="#detalle" data-uid='+results.insertId+' class="linkDetalles"><div class="interior_lista"><img src="'+ $.imageURL +'" class="img_peq"/><span>' + $("#alta_nombre").val() + '</span></div></a><a href="#ActualizarEliminarServicio"  data-theme="a" data-uid='+results.insertId+'  class="linkForm">Predet.</a></li>');
	obj.find('.linkDetalles').bind('click', function(e){
		$.id = $(this).data('uid');
	});
	
	obj.find('.linkForm').bind('click', function(e){
		$.id = $(this).data('uid');
	});
	lista.append(obj).listview('refresh');
	
	
	$.mobile.changePage("#inicio");
	alert('Se ha Agregado Correctamente');
}