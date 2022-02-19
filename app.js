//Probando Lazi Loading
if ("loading" in HTMLImageElement.prototype) {

} else {
    console.log("`lazy-loading` no soportado...");
}

if ("loading" in HTMLImageElement.prototype) {
    // Si el navegador soporta lazy-load, tomamos todas las imágenes que tienen la clase
    // `lazyload`, obtenemos el valor de su atributo `data-src` y lo inyectamos en el `src`.
    const images = document.querySelectorAll("img.lazyload");
    images.forEach((img) => {
        img.src = img.dataset.src;
    });
    // Muestra mensaje
    console.log("El navegador soporta `lazy-loading`...");
} else {
    // Importamos dinámicamente la libreria `lazysizes`
    let script = document.createElement("script");
    script.async = true;
    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js";
    document.body.appendChild(script);
    console.log("Lazi loading no soportado, incorpora Libreria lazysizes.min.js");
}


/// Inicializar CLOUDINARI para la carga de imagenes.
const cloudName = 'muchosregistros';      // Mi cuenta
const unsignedUploadPreset = 'bbisdqo0';  // Mi almacen publico

// URL que invoca el recuadro para elegir la imagen de INPUT de abajo
var fileSelect = document.getElementById("fileSelect");
// Es el INPUT de tipo file para cargar un archivo
var fileElem = document.getElementById("fileElem");

/**Texto de los botones*/
const addToList = 'Agregar a la lista';
const cancel = 'Cancelar';

// Constantes formulario
const miArticulo = document.getElementById('articulo'),
    miCantidad = document.getElementById('cantidad'),
    miNota = document.getElementById('nota'),
    miImagen = document.getElementById('imagen');

var miBoton = document.getElementById('boton');

const urlImagenDefault = 'https://res.cloudinary.com/muchosregistros/image/upload/w_100,c_scale/v1644423533/hyfqmzt4ppv3awfbuo0e.png';

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();

//Controla la accion del boton enviar
const form = document.getElementById('form');
// controlar Funcion Submit del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarOrCancelar();
});

form.addEventListener('change', (event) => {
    console.log("Hubo cambios");

    if (checkInputsVer2() === true) {
        console.log("campos Vacios");
        setSubmitDisable(miBoton);
    } else {
        console.log("Sin campos vacios");
        setSubmitEnable(miBoton);
    }
})


// Deshabilita el boton al iniciar y con campos vacios
setSubmitDisable(miBoton);

function setSubmitDisable(boton) {
    boton.disabled = true;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = 'inactivo enviar';
}

function setSubmitEnable(boton) {
    boton.disabled = false;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = ' enviar';
}


// Carga Imagen por default
setImagenPorDefault(urlImagenDefault);

/**Carga una imagen por default para un producto*/
function setImagenPorDefault(url) {
    // Coloca Url por default
    document.getElementById('imagen').value = url;
    // Agrega Imagen por default a la galeria 
    let imgDefault = new Image(); // HTML5 Constructor
    imgDefault.src = url;  /**Asigna el nuevo URL reconfigurado con escala*/
    imgDefault.alt = 'Imagen de articulo por default';  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(imgDefault); /**Agrega a la Galeria la imagen recien creada*/
}


// Valida que los campos esten llenos
function checkInputsVer2() {
    // Obtiene los valores desde los inputs
    const articuloValue = miArticulo.value.trim();
    const cantidadValue = miCantidad.value.trim();
    const notaValue = miNota.value.trim();
    const imagenValue = miImagen.value.trim();

    let haveAnError = false;

    if (articuloValue === '') {
        haveAnError = true;
    }
    if (cantidadValue === '') {
        haveAnError = true;
    }
    if (notaValue === '') {
        haveAnError = true;
    }
    return haveAnError;
}




// Valida que los campos esten llenos
function checkInputs() {
    // Obtiene los valores desde los inputs
    const articuloValue = miArticulo.value.trim();
    const cantidadValue = miCantidad.value.trim();
    const notaValue = miNota.value.trim();
    const imagenValue = miImagen.value.trim();

    let haveAnError = false;

    if (articuloValue === '') {
        // Show Error
        setErrorFor(miArticulo, 'Nombre del articulo no puede quedar vacio');
        haveAnError = true;
    } else {
        setSuccessFor(miArticulo);
    }
    if (cantidadValue === '') {
        // Show Error
        setErrorFor(miCantidad, 'La cantidad no puede quedar vacio');
        haveAnError = true;
    } else {
        setSuccessFor(miCantidad);
    }
    if (notaValue === '') {
        // Show Error
        setErrorFor(miNota, 'La nota no puede quedar vacia');
        haveAnError = true;
    } else {
        setSuccessFor(miNota);
    }
    return haveAnError;
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;  // .form-control
    const small = formControl.querySelector('small');

    // agrega el mensaje4 de error dentro de Small 
    small.innerText = message;
    // Agrega la clase error
    formControl.className = 'form-control error';
}


function setInicialFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase por defecto o inicial
    formControl.className = 'form-control inicial';
}

function setSuccessFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase error
    formControl.className = 'form-control success';
}

// Cambia la funcion del Boton Guardar
function guardarOrCancelar() {  /// Esta podria ir dentro de la funcion Guardar
    var texto = document.getElementById('boton').innerHTML;

    switch (texto) {
        case cancel:
            //Limpia el Formulario
            resetFormulario();
            // Suprime el boton de Guardar cambios               
            document.getElementById('guardar-edicion').style.display = 'none';
            break;
        case addToList:
            //Valida los campos y escribe en Firebase mediante guardar()
            if (checkInputs() === false) {
                console.log('No hubo errores, envia los datos');
                guardar();
                //  resetFormulario();
            } else {
                console.log('Hubo errores, no envies los datos');
            }
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            console.log('Ningun texto coincide');
            document.getElementById('boton').innerHTML = addToList;
            break;
    }
}


/**Validaciones inmediatas de campos*/
miArticulo.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});

miArticulo.addEventListener('focusout', (event) => {
    event.target.style.background = '';

    if (miArticulo.value.trim() === '') {
        // Show Error
        setErrorFor(miArticulo, 'Nombre del articulo no puede quedar vacio');
        haveAnError = true;
        console.log("El campo esta vacio")

    } else {
        console.log("El campo esta lleno")
        setSuccessFor(miArticulo);
    }
});

/**Validaciones inmediatas de campos*/
miCantidad.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});

miCantidad.addEventListener('focusout', (event) => {
    event.target.style.background = '';

    if (miCantidad.value.trim() === '') {
        // Show Error
        setErrorFor(miCantidad, 'Nombre del articulo no puede quedar vacio');
        haveAnError = true;
        console.log("El campo esta vacio")

    } else {
        console.log("El campo esta lleno")
        setSuccessFor(miCantidad);
    }
});

/**Validaciones inmediatas de campos*/
miNota.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});

miNota.addEventListener('focusout', (event) => {
    event.target.style.background = '';

    if (miNota.value.trim() === '') {
        // Show Error
        setErrorFor(miNota, 'Nombre del articulo no puede quedar vacio');
        haveAnError = true;
        console.log("El campo esta vacio")

    } else {
        console.log("El campo esta lleno")
        setSuccessFor(miNota);
    }
});



//console.log("Saludos Querido");
function process() {
    // referencia el input donde carga la imagen
    const file = document.querySelector("#upload").files[0];
    /**Crea un Lector de archivos*/
    const reader = new FileReader();

    // SI el input esta vacio finaliza la funcion
    if (!file) {
        console.log("No se ha seleccionado ninguna Imagen");
        return
    };
    /**readAsDataURL es usado para leer el contenido del especificado Blob o File */
    reader.readAsDataURL(file);
    /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
    reader.onload = function (event) {
        /**Crea un nuevo elemento tipo imagen*/
        const imgElement = document.createElement("img");
        /**Le asigna una fuente a la iamgen*/
        imgElement.src = event.target.result;
        /**result en  readAsDataURL() -> Es una cadena con una URL que 
         * representa los datos del archivo. result data: */
        document.querySelector("#input").src = event.target.result;

        /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
        imgElement.onload = function (e) {
            /**La etiqueta HTML5 <canvas> se utiliza para 
             * dibujar gráficos, sobre la marcha, con JavaScript.*/
            const canvas = document.createElement("canvas");
            // Ancho que ha de tener el grafico a crear
            const MAX_WIDTH = 400;
            /**Tamaño de la escala es  400px / 1200px = 1*(400)/3(400) = 1/3 = ratio Compresor 66%  */
            const scaleSize = MAX_WIDTH / e.target.width;
            /**Al grafico Canva le asigna el ancho que le indicamos*/
            canvas.width = MAX_WIDTH;
            /**Al alto del grafico le asignamos el alto original multiplicado por la escala*/
            /**Ejemplo Original Height 900 Canva.height = 900*1/3 = 900/1*1/3 = 900/3 = 300*/
            /**Esto mantiene simpre la relacion*/
            canvas.height = e.target.height * scaleSize;

            /**canvas CanvasElement.getContext() retorna un contexto de dibujo en el lienzo,
             *  o null si el identificador del contexto no está soportado.*/
            /**"2d", dando lugar a la creación de un objeto CanvasRenderingContext2D 
             * que representa un contexto de renderizado de dos dimensiones. */
            const ctx = canvas.getContext("2d");
            /**Aqui dibuja la imagen => void ctx.drawImage(image, dx, dy, dWidth, dHeight);*/
            ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
            /**Con la informacion codificada crea la ruta de la imagen resultado */
            const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
            /**Agrega la imagen creada al div con id output*/
            document.querySelector("#output").src = srcEncoded;
            /**Imprime la ruta de la imagen resultado*/
            console.log(srcEncoded);
            // return srcEncoded;
            uploadFile(srcEncoded);
        };
    };
};

//console.log("Saludos Querido");
function processModified(file) {
    // referencia el input donde carga la imagen
    // const file = document.querySelector("#upload").files[0];
    /**Crea un Lector de archivos*/
    const reader = new FileReader();

    // SI el input esta vacio finaliza la funcion
    if (!file) {
        console.log("No se ha seleccionado ninguna Imagen");
        return
    };
    /**readAsDataURL es usado para leer el contenido del especificado Blob o File */
    reader.readAsDataURL(file);
    /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
    reader.onload = function (event) {
        /**Crea un nuevo elemento tipo imagen*/
        const imgElement = document.createElement("img");
        /**Le asigna una fuente a la iamgen*/
        imgElement.src = event.target.result;
        /**result en  readAsDataURL() -> Es una cadena con una URL que 
         * representa los datos del archivo. result data: */
        /**VISUAL*///        document.querySelector("#input").src = event.target.result;

        /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
        imgElement.onload = function (e) {
            /**La etiqueta HTML5 <canvas> se utiliza para 
             * dibujar gráficos, sobre la marcha, con JavaScript.*/
            const canvas = document.createElement("canvas");
            // Ancho que ha de tener el grafico a crear
            const MAX_WIDTH = 400;
            /**Tamaño de la escala es  400px / 1200px = 1*(400)/3(400) = 1/3 = ratio Compresor 66%  */
            const scaleSize = MAX_WIDTH / e.target.width;
            /**Al grafico Canva le asigna el ancho que le indicamos*/
            canvas.width = MAX_WIDTH;
            /**Al alto del grafico le asignamos el alto original multiplicado por la escala*/
            /**Ejemplo Original Height 900 Canva.height = 900*1/3 = 900/1*1/3 = 900/3 = 300*/
            /**Esto mantiene simpre la relacion*/
            canvas.height = e.target.height * scaleSize;

            /**canvas CanvasElement.getContext() retorna un contexto de dibujo en el lienzo,
             *  o null si el identificador del contexto no está soportado.*/
            /**"2d", dando lugar a la creación de un objeto CanvasRenderingContext2D 
             * que representa un contexto de renderizado de dos dimensiones. */
            const ctx = canvas.getContext("2d");
            /**Aqui dibuja la imagen => void ctx.drawImage(image, dx, dy, dWidth, dHeight);*/
            ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
            /**Con la informacion codificada crea la ruta de la imagen resultado */
            const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
            /**Agrega la imagen creada al div con id output*/
            /**VISUAL*///   document.querySelector("#output").src = srcEncoded;
            /**Imprime la ruta de la imagen resultado*/
            console.log(srcEncoded);
            // regresa la imagen reducida a 400 de ancho
            //return srcEncoded;
            uploadFile(srcEncoded);
        };
    };
};


var manejarFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        processModified(files[i]);
        ///             uploadFile(files[i]); // call the function to upload the file
        //     var imagen = process();
        //uploadFile(picture);
    }
};

/**Como se precarga la imagen que va a Cloudinary*/
/**SELECCION DE IMAGEN*/
/** Pasos
 *  1. Al hacer Click en el Link "Elige imagen" invoca funcion(e) anonima
 *  2. La funcion anonima evalua si existe la variable "fileElem" 
 *  3. fileElem es la invocacion  de un input de tipo archivo que esta oculto
 *  4. Al existir fileElem la funcion simula un Click en el campo y despliega 
 *     la ventana para elegir.   
 */
fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
        fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

/**Se invoca desde el campo tipo FILE al percibir un cambio*/
// *********** Handle selected files ******************** //
var handleFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        uploadFile(files[i]); // call the function to upload the file
    }
};

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    /**Limpia de la Galeria la Imagen Anterior*/
    document.getElementById('gallery').innerHTML = '';
    // Reset the upload progress bar
    document.getElementById('progress').style.width = 0;

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {

        document.getElementById('porcentaje').innerHTML = ``; /*Resetea el porcentaje*/
        /**Calcula el progeso de la carga*/
        var progress = Math.round((e.loaded * 100.0) / e.total);
        /**Incrementa el ancho del progreso*/
        document.getElementById('progress').style.width = progress + "%";

        /**Crea y agrega la etiqueta que contiene el avance en Numero*/
        var newLabel = document.createElement('label');
        newLabel.innerHTML = `${progress} %`;
        document.getElementById('porcentaje').appendChild(newLabel);

        console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);

        console.log(progress);
        if (progress === 100) {
            /**Cambia de color al finalizar la carga*/
            document.getElementById('progress').style.background = "lime";
        }

    });

    /**Area barra de progreso*/
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg

            /**Extrae la URL del JSON respuesta*/
            var url = response.secure_url;
            console.log(url); /**URL extraida de la respuesta */

            // Create a thumbnail of the uploaded image, with 150px width
            var tokens = url.split('/'); /**DIVIDE LA URL y su delimitador es */

            console.log(tokens); /**Arreglo de strings con el resultado de la division. */

            tokens.splice(-2, 0, 'w_100,c_scale'); /**Inserta elemento dos posiciones antes ultimo*/
            // w=width y h=height --> 150=150 px                 

            var img = new Image(); // HTML5 Constructor
            img.src = tokens.join('/');  /**Asigna el nuevo URL reconfigurado con escala*/
            img.alt = response.public_id;  /**Por si no se muestra la imagen*/

            document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

            // Agregar url del Thumbnail al formulario
            document.getElementById('imagen').value = img.src;
            /**Muestra la opcion para cambiar Imagen*/
            document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';
        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
} // Fin de upload FILE

// Agregar documentos
function guardar() {
    //Tres varaibles para la tarea
    var articulo = document.getElementById('articulo').value,
        cantidad = document.getElementById('cantidad').value,
        nota = document.getElementById('nota').value,
        imagen = document.getElementById('imagen').value;

    //var timeStamp = firebase.firestore.Timestamp.fromDate.now();
    // var timeStamp= document.getElementById('date').value;
    let timeStamp = new Date(Date.now());
    //timeStamp = timeStamp.toString();

    db.collection("compras").add({
        articulo: articulo,
        cantidad: cantidad,
        nota: nota,
        imagen: imagen,
        fechaHoraCreacion: timeStamp,
        fechaHoraModificacion: timeStamp,

    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            //Restaura el formulario
            resetFormulario();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

/// Ya no se USA
function actualizar() {
    // El ID no va a cambiar
    var compraRef = db.collection("compras").doc(id);
    // Capturar los cambios en los Textfield si los hubo
    var articuloEditado = document.getElementById('articulo').value;
    var cantidadEditada = document.getElementById('cantidad').value;
    var notaEditada = document.getElementById('nota').value;
    var imagenEditada = document.getElementById('imagen').value;
    let timeStamp = new Date(Date.now());

    // realiza la actualizacion
    return compraRef.update({
        articulo: articuloEditado,
        cantidad: cantidadEditada,
        nota: notaEditada,
        imagen: imagenEditada,
        fechaHoraModificacion: timeStamp,
    })
        .then(() => {
            console.log("Document successfully updated!");
            //Limpia el formulari
            resetFormulario();
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

// LEER Documentos
// Creamos una var de donde queremos pintar la tabla
var table = document.getElementById('table');

//  Visualizacion en Tiempo Real
/** Cambios 
 * Remplaza get()  por onSnapshot()
 * Se Elimina .get().then((querySnapshot)...) y queda .onSnapshot((querySnapshot)...) 
 */

var comprasRef = db.collection("compras");
comprasRef.orderBy("fechaHoraModificacion", "desc").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().fechaHora}`);
        table.innerHTML += `
        <tr>
        <td>${doc.data().articulo}</td>
        <td>${doc.data().cantidad}</td>
        <td>${doc.data().fechaHoraModificacion}</td>
        </tr>
        <tr>
        <td><img src="${doc.data().imagen}" alt="${doc.data().imagen}"></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().articulo}','${doc.data().cantidad}','${doc.data().nota}','${doc.data().imagen}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>
        <tr></tr>        
        <tr></tr>                
        `
    });
});

/** 
db.collection("compras").onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().articulo}`);
        table.innerHTML += `
        <tr>
        <td>${doc.data().articulo}</td>
        <td>${doc.data().cantidad}</td>
        <td>${doc.data().nota}</td>
        </tr>
        <tr>
        <td><img src="${doc.data().imagen}" alt="${doc.data().imagen}"></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().articulo}','${doc.data().cantidad}','${doc.data().nota}','${doc.data().imagen}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>
        <tr></tr>        
        <tr></tr>                
        `
    });
});

*/

// BORRAR documentos
function eliminar(id) {
    db.collection("compras").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// EDITAR documento
function editar(id, articulo, cantidad, nota, imagen) {
    //Limpia la galeria de la imagen por default
    limpiaGaleria()

    // Escribe en los campos los valores del renglon seleccionado
    document.getElementById('articulo').value = articulo;
    document.getElementById('cantidad').value = cantidad;
    document.getElementById('nota').value = nota;
    document.getElementById('imagen').value = imagen;
    // Muestra la imagen en Galery para que pueda ser editada.
    var img = new Image(); // HTML5 Constructor
    img.src = imagen;  /**Asigna el nuevo URL reconfigurado con escala*/
    img.alt = imagen;  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

    //Edita el texto del boton
    document.getElementById('boton').innerHTML = cancel;

    /**Cambia el Texto por si el User quiere cambiar la imagen */
    document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';

    var btnGuardarEdicion = document.getElementById('guardar-edicion');
    btnGuardarEdicion.style.display = 'unset';
    // Crea una funcion anonima para ejecutar cuando se haga click

    btnGuardarEdicion.onclick = function () {

        // El ID no va a cambiar
        var compraRef = db.collection("compras").doc(id);
        // Capturar los cambios en los Textfield si los hubo
        var articuloEditado = document.getElementById('articulo').value;
        var cantidadEditada = document.getElementById('cantidad').value;
        var notaEditada = document.getElementById('nota').value;
        var imagenEditada = document.getElementById('imagen').value;
        let timeStamp = new Date(Date.now());

        // realiza la actualizacion
        return compraRef.update({
            articulo: articuloEditado,
            cantidad: cantidadEditada,
            nota: notaEditada,
            imagen: imagenEditada,
            fechaHoraModificacion: timeStamp,
        })
            .then(() => {
                console.log("Document successfully updated!");
                //Limpia el formulario
                resetFormulario();
                //Vuelve a ocultar el de edicion
                btnGuardarEdicion.style.display = 'none';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}

function resetFormulario() {
    // Si exito Regresa al boton su texto original
    document.getElementById('boton').innerHTML = addToList;
    // Limpia los campos
    document.getElementById('articulo').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('nota').value = '';
    document.getElementById('imagen').value = '';

    /**Limpia la Galeria*/
    limpiaGaleria();
    /**Resetea la barra de progreso*/
    document.getElementById('progress').style.width = 0;
    /**Borra el porcentaje en numero*/
    document.getElementById('porcentaje').innerHTML = '';
    // Regresa el texto original
    document.getElementById('fileSelect').innerHTML = 'Elije una imagen';
    //Restablece la imagen Por Default
    setImagenPorDefault(urlImagenDefault);
    /**Deshabilita el Boton */
    setSubmitDisable(miBoton);
}

function limpiaGaleria() {
    document.getElementById('gallery').innerHTML = '';
}


form.addEventListener('submit', (event) => {
    console.log('El formulario ha sido enviado');
    setInicialFor(miArticulo, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miCantidad, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miNota, 'Nombre del articulo no puede quedar vacio');
});

function resetValidaciones() {
    miArticulo.className = 'form-control inicial';
    miCantidad.className = 'form-control inicial';
    miNota.className = 'form-control inicial';
    miImagen.className = 'form-control default';

    /**Ejecute  */
    console.log('Ejecute el reset de las validaciones');

}

