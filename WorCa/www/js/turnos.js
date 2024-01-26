function getTurnos(){
    if(localStorage.getItem('turnos') != null){
        return JSON.parse(localStorage.getItem('turnos'))
    }else{
        return {}
    }
}

function setTurnos(){
    localStorage.setItem('turnos', JSON.stringify(TURNOS))
}

function fillTurnosSelect(){
    Array.prototype.forEach.call(document.getElementsByClassName('turno-select'), function(element) {
        element.innerHTML = ''
    
        var option = document.createElement('option')
        option.setAttribute('value', '0')
        option.innerHTML = '--Turnos--'
    
        element.appendChild(option)
    
        Object.keys(TURNOS).forEach(turno => {
            var option = document.createElement('option')
            option.setAttribute('value', TURNOS[turno].name)
            option.setAttribute('style', '--bg-color:' + TURNOS[turno].colorFondo + "; --color:" + TURNOS[turno].colorLetra + ";")
            option.innerHTML = TURNOS[turno].character + ": " + TURNOS[turno].name
    
            element.appendChild(option)
        })
    })
}