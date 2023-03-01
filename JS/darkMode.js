let btnToggle = document.getElementById("darkModeBtn")

if(localStorage.getItem("modoOscuro")){
    if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
        btnToggle.innerText = `Modo claro`
        btnToggle.className = `btn btn-light`
    }
}else{
    localStorage.setItem("modoOscuro", false)
}

btnToggle.addEventListener("click", ()=>{
    document.body.classList.toggle("estiloDarkMode")

    if(JSON.parse(localStorage.getItem("modoOscuro")) == false){
        btnToggle.innerText = `Modo claro`
        btnToggle.className = `btn btn-light`
        localStorage.setItem("modoOscuro", true)
    }else{
        btnToggle.innerText = `Modo oscuro`
        btnToggle.className = `btn btn-dark`
        localStorage.setItem("modoOscuro", false)
    }
})