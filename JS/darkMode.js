const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', ()=>{
  document.body.classList.toggle('dark')
  
    if(JSON.parse(localStorage.getItem("modoOscuro")) == true){
    
    localStorage.setItem("modoOscuro", true)
    }else{
        
        localStorage.setItem("modoOscuro", false)
    }
})