//tienda de videojuegos

//clase constructora
class Juego {
    constructor(id, titulo, consola, precio, imagen,){
        this.id = id,
        this.titulo = titulo,
        this.consola = consola,
        this.precio = precio,
        this.imagen = imagen,
        this.cantidad = 1

    }
    
    sumarUnidad(){
        this.cantidad += 1
    }
    restarUnidad(){
        this.cantidad = this.cantidad - 1
        return this.cantidad
    }
}


let catalogoCompleto = []

const cargarCatalogo = async () => {
    const response = await fetch("juegos.json")
    const data = await response.json()
    for (let juego of data){
         let nuevoJuego = new Juego(juego.id, juego.titulo, juego.consola, juego.precio, juego.imagen)
         catalogoCompleto.push(nuevoJuego)
    }
    localStorage.setItem("catalogoCompleto", JSON.stringify(catalogoCompleto))
}

    if(localStorage.getItem("catalogoCompleto")){
    catalogoCompleto = JSON.parse(localStorage.getItem("catalogoCompleto"))
    
    for(let juego of JSON.parse(localStorage.getItem("catalogoCompleto"))){
        let juegoStorage = new Juego(juego.id, juego.titulo, juego.consola, juego.precio, juego.imagen)
        catalogoCompleto.push(juegoStorage)
    }
    console.log(catalogoCompleto)
}

    else{
        cargarCatalogo()
        console.log(catalogoCompleto)
}
