//variables

let divJuegos = document.getElementById("juegos")
let botonGuardarJuego = document.getElementById("btnGuardar")
let inputBusqueda = document.querySelector("#barraBusqueda")
let coincidencia = document.getElementById("coincidencia")
let bodyCarrito = document.getElementById("modal-bodyCarrito")
let botonCarrito = document.getElementById("botonCarrito")
let precioTotal = document.getElementById("precioTotal")
let loader = document.getElementById("loader")
let reloj = document.getElementById("reloj")
let botonFinalizarCompra = document.getElementById("botonFinalizarCompra")

let productosEnCarrito = []
if(localStorage.getItem("carrito")){
    for(let juego of JSON.parse(localStorage.getItem("carrito"))){
        let cantidadStorage = juego.cantidad
        let juegosStorage = new Juego(juego.id, juego.tituto, juego.consola, juego.precio, juego.imagen)
        juegosStorage.cantidad = cantidadStorage
        productosEnCarrito.push(juegosStorage)

    }
}else{
    productosEnCarrito = []
    localStorage.setItem("carrito", productosEnCarrito)}

//FUNCIONES
function agregarAlCarrito(juego){
    let juegoAgregado = productosEnCarrito.find((elem)=> elem.id == juego.id)
    if(juegoAgregado == undefined){
        productosEnCarrito.push(juego)
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
        Swal.fire({
            title: 'Ha agregado un juego al carrito',
            text: `${juego.titulo} para la consola ${juego.consola} ha sido agregado`,
            icon: "success",
            confirmButtonText: "Continuar comprando",
            confirmButtonColor: "green",
            imageUrl: `assets/${juego.imagen}`,
            imageHeight: 100 
        })

    }else{
            Swal.fire({
            text: `Este producto ya existe en el carrito, elija cantidad en carrito de compras`,
            icon: "warning",
            timer: 3000,
            showConfirmButton: false
        })
    }

}

function cargarProductosCarrito(array){
    bodyCarrito.innerHTML = ""
    array.forEach((productoCarrito)=>{
        
        bodyCarrito.innerHTML += `
        <div id ="productoCarrito${productoCarrito.id}"class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="assets/${productoCarrito.imagen}" class="img-fluid rounded-start" alt="${productoCarrito.titulo}">
                </div>
                <div class="col-md-6">
                <div class="card-body">
                    <h5 class="card-title">${productoCarrito.titulo}</h5>
                    <h5 class="card-text">Consola: ${productoCarrito.consola}</h5>
                    <p class="card-text">Total de unidades: ${productoCarrito.cantidad}</p>
                    <p class="card-text"><small class="text-muted">Sub Total: $${productoCarrito.precio * productoCarrito.cantidad}</small></p>
                </div>
                </div>
                    <div class="col-md-2">
                    <button class= "btn btn-success mt-3" id="botonSumarUnidad${productoCarrito.id}"><i class=""></i>+1</button>
                    <button class= "btn btn-danger mt-1" id="botonEliminarUnidad${productoCarrito.id}"><i class=""></i>-1</button>
                    <button class= "btn btn-danger mt-1" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
            </div>
        </div>
        `
        })
        array.forEach((productoCarrito)=>{
            document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", ()=>{
                
                //borrar del DOM
                let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
                cardProducto.remove()
                //buscar juego eliminar y borrarlo del array
                let eliminarDelCarrito = array.find(juego => juego.id == productoCarrito.id)
                let posicion = array.indexOf(eliminarDelCarrito)
                array.splice(posicion, 1)
                localStorage.setItem("carrito", JSON.stringify(array))
                compraTotal(array)
            })
             //Sumar unidad
            document.getElementById(`botonSumarUnidad${productoCarrito.id}`).addEventListener("click", ()=>{
            productoCarrito.sumarUnidad()
            localStorage.setItem("carrito", JSON.stringify(array))
            cargarProductosCarrito(array)
        })
        
            //Restar unidad
            document.getElementById(`botonEliminarUnidad${productoCarrito.id}`).addEventListener("click", ()=>{
            let cantidad = productoCarrito.restarUnidad()
            
            if(cantidad < 1){
            let cardProducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cardProducto.remove()
            let posicion = array.indexOf(productoCarrito)
            array.splice(posicion, 1)
            localStorage.setItem("carrito", JSON.stringify(array))
            compraTotal(array)
            }else{
                localStorage.setItem("carrito", JSON.stringify(array))
            }
            cargarProductosCarrito(array)
        })

        })
    compraTotal(array)
}

//funcion compra total con ternario
function compraTotal(array){
    let total = array.reduce((acc, productoCarrito)=> acc + (productoCarrito.precio * productoCarrito.cantidad) ,0)
    total == 0 ? precioTotal.innerHTML = `No hay productos en el carrito` :
    precioTotal.innerHTML = `El precio total de su compra es ${total}`
    return total
}

function finalizarCompra(array){
        Swal.fire({
        title: 'Está seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then( (result)=> {
            if(result.isConfirmed){
                let totalFinalizar = compraTotal(array)
                Swal.fire({
                    title: 'Compra realizada',
                    icon: 'success',
                    confirmButtonColor: 'green',
                    text: `Muchas gracias por su compra. Por un total de ${totalFinalizar}`,
                    })
                productosEnCarrito = []
                localStorage.removeItem("carrito")    
                
            }else{
                Swal.fire({
                    title: 'Compra cancelada',
                    icon: 'info',
                    text: `La compra ha sido cancelada! Atención sus productos siguen en el carrito :D`,
                    confirmButtonColor: 'green',
                    timer:3500
                })
            }
    })

}


function mostrarCatalogo(array){
    divJuegos.innerHTML = ""
    for(let juego of array){
        let nuevodivJuegos = document.createElement("div")
        nuevodivJuegos.className = "col-12 col-md-6 col-lg-4 my-3"
        nuevodivJuegos.innerHTML = `
        <div id="${juego.id}" class="card card-dark" style="width: 18rem;">
            <img class="card-img-top img-fluid" style="height: 200px;"src="assets/${juego.imagen}" alt="${juego.titulo} de ${juego.consola}">
            <div class="card-body">
                <h4 class="card-title">${juego.titulo}</h4>
                <p>Consola: ${juego.consola}</p>
                <p class="">Precio: ${juego.precio} ARS</p>
                <button id="agregarBtn${juego.id}" class="btn btn-outline-success">Agregar al carrito</button>
            </div>
        </div> 
        `
        divJuegos.appendChild(nuevodivJuegos)
        let agregarBtn = document.getElementById(`agregarBtn${juego.id}`)
           agregarBtn.onclick = ()=>{
           agregarAlCarrito(juego)
        }
    }
}


function cargarJuego(array){
    let inputTitulo = document.getElementById("tituloInput")
    let inputConsola = document.getElementById("consolaInput")
    let inputPrecio = document.getElementById("precioInput")
    
    const nuevoJuego = new Juego(array.length+1, inputTitulo.value, inputConsola.value,parseInt(inputPrecio.value), "juego.jpeg")
    array.push(nuevoJuego)
    localStorage.setItem("catalogoCompleto", JSON.stringify(array))
    mostrarCatalogo(array)
    let formAgregarJuego = document.getElementById("formAgregarJuego")
    formAgregarJuego.reset()
    Swal.fire({
        icon: "success",
        timer: 1500,
        showConfirmButton: false
    })
 }


function buscarJuego(juegoBuscado, array){
    
    let catalogoFiltrado = array.filter(
            (juego) => juego.consola.toLowerCase().includes(juegoBuscado.toLowerCase()) || juego.titulo.toLowerCase().includes(juegoBuscado.toLowerCase())
            )
            if(catalogoFiltrado.length == 0){
                coincidencia.innerHTML = `<h3>Este juego no se encuentra en stock</h3>`
                mostrarCatalogo(catalogoFiltrado)
            }else{
                coincidencia.innerHTML = ""
                mostrarCatalogo(catalogoFiltrado)
            }
        }
        
    inputBusqueda.addEventListener("input", ()=>{
    buscarJuego(inputBusqueda.value, catalogoCompleto)
})


function ordenarPrecioMenor(array){
    const precioMenor = [].concat(array)
    precioMenor.sort((a, b)=> a.precio - b.precio)
    mostrarCatalogo(precioMenor)
}

function ordenarPrecioMayor(array){
    const precioMayor = [].concat(array)
    precioMayor.sort((a, b)=> b.precio - a.precio)
    mostrarCatalogo(precioMayor)
}

function ordenarAlfabeticamente(array){
    const ordenadoAlfabeticamente = [].concat(array)
    
    ordenadoAlfabeticamente.sort((a, b) => {
        if (a.titulo > b.titulo) {
          return 1
        }
        if (a.titulo < b.titulo) {
          return -1
        }
        return 0
      })
      mostrarCatalogo(ordenadoAlfabeticamente)
}


//EVENTOS

//boton "guardar juego"
btnGuardar.addEventListener("click", ()=>{
    cargarJuego(catalogoCompleto)
 })

//boton "carrito"
botonCarrito.addEventListener("click", ()=>{
    cargarProductosCarrito(productosEnCarrito)
})

// selector ordenar
selectOrden.addEventListener("change", ()=>{
    
    if(selectOrden.value == "1"){
        ordenarPrecioMenor(catalogoCompleto)
    }else if(selectOrden.value =="2"){
        ordenarPrecioMayor(catalogoCompleto)
    }else if(selectOrden.value == "3"){
        ordenarAlfabeticamente(catalogoCompleto)
    }else{
        mostrarCatalogo(catalogoCompleto)
    }
})

//boton "finalizar compra"
botonFinalizarCompra.addEventListener("click", ()=>{
    finalizarCompra(productosEnCarrito)
})


//CODIGO
setTimeout(()=>{
    loader.innerText =""
    loader.remove()
    mostrarCatalogo(catalogoCompleto)
},1000)


// luxon

const DateTime = luxon.DateTime
const fechaHoy = DateTime.now()
let fecha = document.getElementById("fecha")
let fechaMostrar = fechaHoy.toLocaleString(DateTime.DATE_FULL)
fecha.innerHTML = `${fechaMostrar}`

setInterval(()=>{
    let horaActual = DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS)
    reloj.innerHTML = `${horaActual}`
}, 1000)

