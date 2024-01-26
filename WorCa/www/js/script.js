window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

var DATE = alterDate(0, new Date())
var TURNOS = getTurnos()
var SELECTED_DAYS = []
var MODE = 'read'
var FIRSTSELECT = false
var USER = 'local'
var SELECTED_TIMEZONE = ""
var SELECTED_DATE = ""

document.getElementById('month-selector').style.display = 'none'
document.getElementById('year-selector').style.display = 'none'
document.getElementById('selectors').style.display = 'none'

if(screen.width <= 992){
    document.getElementById('structure').classList.remove('menu-open')
}

document.getElementById('content').addEventListener('click', e => {
    document.getElementById('structure').classList.remove('settings-open')
    document.getElementById('structure').classList.remove('menu-open')
    document.getElementById('turnos').classList.add('d-none')
    //document.getElementById('selected-day').classList.add('d-none')
    
    document.querySelectorAll('ul.open').forEach(element => {
        element.classList.remove('open')
    })
})

document.getElementById('menu').addEventListener('click', function(){
    document.querySelectorAll('ul.open').forEach(element => {
        element.classList.remove('open')
    })
})

document.getElementById('menu-icon').addEventListener('click', e => {
    e.stopPropagation()
    document.getElementById('structure').classList.toggle('menu-open')
})
document.getElementById('settings-icon').addEventListener('click', e => {
    e.stopPropagation()
    document.getElementById('structure').classList.toggle('settings-open')
})

document.getElementById('selectors').addEventListener('click', function(){
    document.getElementById('month-selector').style.display = 'none'
    document.getElementById('year-selector').style.display = 'none'
    document.getElementById('selectors').style.display = 'none'
    document.getElementById('month-selector').classList.remove('show')
    document.getElementById('year-selector').classList.remove('show')
})
document.getElementById('calendar-title').addEventListener('click', function(){
    document.getElementById('month-selector').style.display = 'initial'
    document.getElementById('selectors').style.display = 'flex'
    document.getElementById('month-selector').classList.add('show')
})
document.getElementById('calendar-subtitle').addEventListener('click', function(){
    document.getElementById('year-selector').style.display = 'initial'
    document.getElementById('selectors').style.display = 'flex'
    document.getElementById(DATE.getFullYear()).scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
    })
    document.getElementById('year-selector').classList.add('show')
})

document.getElementById('btn-prev').addEventListener('click', function(){
    DATE = alterDate(-1, DATE)

    if(!document.getElementById("resume").classList.contains("d-none")){
        document.querySelectorAll(".resume-header div").forEach(element => {
            element.classList.remove("selected")
        })
        document.getElementById('btn-month').classList.add("selected")
        changeResume()
    }

    generateCalendar()
})
document.getElementById('btn-next').addEventListener('click', function(){
    DATE = alterDate(1, DATE)

    if(!document.getElementById("resume").classList.contains("d-none")){
        document.querySelectorAll(".resume-header div").forEach(element => {
            element.classList.remove("selected")
        })
        document.getElementById('btn-month').classList.add("selected")
        changeResume()
    }
    
    generateCalendar()
})

document.getElementById('app-name').addEventListener('click', e => {
    e.stopPropagation()
    document.getElementById('structure').classList.remove('settings-open')
    document.getElementById('resume').classList.add('d-none')
    document.getElementById('calendar-body').classList.remove('d-none')
})

document.getElementById('btn-calendar').addEventListener('click', e => {
    e.stopPropagation()
    document.getElementById('structure').classList.remove('settings-open')
    document.getElementById('resume').classList.add('d-none')
    document.getElementById('calendar-body').classList.remove('d-none')
})

document.getElementById('btn-resume').addEventListener('click', e => {
    e.stopPropagation()
    document.querySelector(".resume-range-dates").classList.add("d-none")
    document.getElementById('structure').classList.remove('settings-open')
    document.getElementById('calendar-body').classList.add('d-none')
    document.getElementById('resume').classList.remove('d-none')
    document.querySelectorAll(".resume-header div").forEach(element => {
        element.classList.remove("selected")
    })
    document.getElementById('btn-month').classList.add("selected")

    changeResume()
})
document.getElementById('btn-year').addEventListener('click', e => {
    e.stopPropagation()
    document.querySelector(".resume-range-dates").classList.add("d-none")
    document.querySelectorAll(".resume-header div").forEach(element => {
        element.classList.remove("selected")
    })
    document.getElementById('btn-year').classList.add("selected")

    changeResume()
})
document.getElementById('btn-month').addEventListener('click', e => {
    e.stopPropagation()
    document.querySelector(".resume-range-dates").classList.add("d-none")
    document.querySelectorAll(".resume-header div").forEach(element => {
        element.classList.remove("selected")
    })
    document.getElementById('btn-month').classList.add("selected")
    
    changeResume()
})
document.getElementById('btn-range').addEventListener('click', e => {
    e.stopPropagation()
    document.querySelector(".resume-range-dates").classList.remove("d-none")
    document.querySelectorAll(".resume-header div").forEach(element => {
        element.classList.remove("selected")
    })
    
    document.getElementById("resume-tbody").innerHTML = ""
    document.getElementById('btn-range').classList.add("selected")
})
document.getElementById('resume-range-start').addEventListener('change', e => {
    e.stopPropagation()
    if(document.getElementById('resume-range-start').value != "" && document.getElementById('resume-range-end').value != ""){
        changeResume()
    }
})
document.getElementById('resume-range-end').addEventListener('change', e => {
    e.stopPropagation()
    if(document.getElementById('resume-range-start').value != "" && document.getElementById('resume-range-end').value != ""){
        changeResume()
    }
})

document.getElementById('turnos').addEventListener('click', e => {
    document.getElementById('turnos').classList.add('d-none')
    document.getElementById('turnos-container').classList.remove('show')
})
document.getElementById('turnos-container').addEventListener('click', e => {
    e.stopPropagation()
})
document.getElementById('btn-turnos').addEventListener('click', e => {
    e.stopPropagation()
    document.getElementById('structure').classList.remove('settings-open')
    document.getElementById('turnos').classList.remove('d-none')
    document.getElementById('turnos-container').classList.add('show')

    document.getElementById('turno-radio-work').checked = true
    document.getElementById('turno-select').value = '0'
    document.getElementById('turno-name').value = ''
    document.getElementById('turno-character').value = ''
    document.getElementById('turno-color').value = '#ffffff'
    document.getElementById('turno-bg-color').value = '#000000'
    document.getElementById("timezones").innerHTML = ''
})
document.getElementById("turnos-close").addEventListener("click", function(){
    document.getElementById('turnos').classList.add('d-none')
});

document.getElementById('btn-clear-turnos').addEventListener('click', function(){
    document.getElementById('turno-radio-work').checked = true
    document.getElementById('turno-select').value = '0'
    document.getElementById('turno-name').value = ''
    document.getElementById('turno-character').value = ''
    document.getElementById('turno-color').value = '#ffffff'
    document.getElementById('turno-bg-color').value = '#000000'
    document.getElementById("timezones").innerHTML = ''
})
document.getElementById('btn-save-turnos').addEventListener('click', function(){
    var timezones = []
    for (var i = 0, row; row = document.getElementById("timezones").rows[i]; i++) {
        timezones.push({'start': row.cells[0].innerHTML, 'end': row.cells[1].innerHTML})
    }

    const day_type = document.querySelector('input[name="turno-type"]:checked').value
    TURNOS[document.getElementById('turno-name').value] = {'type': day_type,'name': document.getElementById('turno-name').value, 'character': document.getElementById('turno-character').value, 'colorLetra': document.getElementById('turno-color').value, 'colorFondo': document.getElementById('turno-bg-color').value, 'timezones': timezones}

    document.getElementById('turno-radio-work').checked = true
    document.getElementById('turno-select').value = '0'
    document.getElementById('turno-name').value = ''
    document.getElementById('turno-character').value = ''
    document.getElementById('turno-color').value = '#ffffff'
    document.getElementById('turno-bg-color').value = '#000000'
    document.getElementById("timezones").innerHTML = ''

    setTurnos()
    fillTurnosSelect()
})

document.getElementById('turno-select').addEventListener('change', function(){
    document.getElementById("timezones").innerHTML = ""
    if(document.getElementById('turno-select').value != '0'){
        document.querySelector('input[name="turno-type"][value="' + TURNOS[document.getElementById('turno-select').value].type + '"]').checked = true
        document.getElementById('turno-name').value = TURNOS[document.getElementById('turno-select').value].name
        document.getElementById('turno-character').value = TURNOS[document.getElementById('turno-select').value].character
        document.getElementById('turno-color').value = TURNOS[document.getElementById('turno-select').value].colorLetra
        document.getElementById('turno-bg-color').value = TURNOS[document.getElementById('turno-select').value].colorFondo

        var count = 0
        console.log(TURNOS)
        TURNOS[document.getElementById('turno-select').value].timezones.forEach(row => {
            var tr = document.createElement('tr')
            tr.id = "tz_" + count
            var tdStart = document.createElement('td')
            tdStart.innerHTML = row.start
            var tdEnd = document.createElement('td')
            tdEnd.innerHTML = row.end
            tr.appendChild(tdStart)
            tr.appendChild(tdEnd)

            tr.addEventListener('click', function(){
                SELECTED_TIMEZONE = tr.id
            })
            tr.addEventListener('mouseout', function(){
                setTimeout(function(){SELECTED_TIMEZONE = ""}, 5);
            })

            document.getElementById("timezones").appendChild(tr)
            count++
        })
    }
})
document.getElementById('edit-turno-select').addEventListener('change', function(){
    if(document.getElementById('edit-turno-select').value != '0'){
        var turno = TURNOS[document.getElementById('edit-turno-select').value]
        SELECTED_DAYS.forEach(day => {
            var dp = ''
            var dp2 = ''

            if(day.split('-')[1] < 10){dp = '0'}
            if(day.split('-')[0] < 10){dp2 = '0'}

            day = day.split('-')[2] + "-" + dp + day.split('-')[1] + "-" + dp2 + day.split('-')[0]
            insert(USER, day, turno.type, turno.name, turno.character, "NULL", turno.colorLetra, turno.colorFondo, turno.timezones, "NULL")
        })
        document.getElementById('edit-turno-select').value = '0'
        generateCalendar()
    }
})

document.getElementById('check-icon').addEventListener('click', function(){
    SELECTED_DAYS = []
    MODE = 'read'
    document.getElementById('settings-icon').classList.remove('d-none')
    document.getElementById('check-icon').classList.add('d-none')
    document.getElementById('edit-turno-select-container').classList.add('d-none')
    Array.prototype.forEach.call(document.getElementsByClassName('day'), function(element) {
        element.classList.remove('selected')
    });
})

document.getElementById('turno_remove').addEventListener('click', function(){
    if(document.getElementById('turno-select').value != '0'){
        delete TURNOS[document.getElementById('turno-select').value]
        
        document.getElementById('turno-select').value = '0'
        document.getElementById('turno-name').value = ''
        document.getElementById('turno-character').value = ''
        document.getElementById('turno-color').value = '#ffffff'
        document.getElementById('turno-bg-color').value = '#000000'
        document.getElementById("timezones").innerHTML = ''

        setTurnos()
        fillTurnosSelect()
    }
})
document.getElementById('day_remove').addEventListener('click', function(){
    SELECTED_DAYS.forEach(day => {
        var dp = ''
        var dp2 = ''

        if(day.split('-')[1] < 10){dp = '0'}
        if(day.split('-')[0] < 10){dp2 = '0'}

        day = day.split('-')[2] + "-" + dp + day.split('-')[1] + "-" + dp2 + day.split('-')[0]
        remove(day)
    })
    generateCalendar()
})

document.getElementById("btn-exportar").addEventListener("click", function(){
   var permissions = cordova.plugins.permissions

    permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
        if ( !status.hasPermission ) {
            permissions.requestPermissions(
                permissions.WRITE_EXTERNAL_STORAGE,
                function(status) {
                    if( !status.hasPermission ) error()
                },
                error
            )
        }else{
            selectExport()
        }
    })
});

document.getElementById("file-import").addEventListener("change", function(){
    loadFile()
    var permissions = cordova.plugins.permissions

    permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, function( status ){
        if ( !status.hasPermission ) {
            permissions.requestPermissions(
                permissions.READ_EXTERNAL_STORAGE,
                function(status) {
                    if( !status.hasPermission ) error()
                },
                error
            )
        }else{
            loadFile()
        }
    })
});

document.getElementById("btn-local").addEventListener("click", function(){
    document.querySelectorAll('#menu li').forEach(element => {
        element.classList.remove('selected')
    })
    document.getElementById('btn-local').classList.add('selected')
    changeCalendar('local')
});

document.getElementById("timezoneAdd").addEventListener("click", function(){
    document.getElementById("timezoneStart").value = ''
    document.getElementById("timezoneEnd").value = ''

    document.getElementById("timezoneAdd").classList.add('d-none')
    document.getElementById("timezoneRemove").classList.add('d-none')
    document.getElementById("timezoneSave").classList.remove('d-none')
    document.getElementById("timezoneCancel").classList.remove('d-none')
    document.getElementById("turnoTimes").classList.remove('d-none')
});
document.getElementById("timezoneRemove").addEventListener("click", function(){
    document.getElementById(SELECTED_TIMEZONE).remove()

});
document.getElementById("timezoneSave").addEventListener("click", function(){
    if(document.getElementById("timezoneStart").value != '' && document.getElementById("timezoneEnd").value != ''){
        var tr = document.createElement('tr')
        tr.id = "tz_" + document.getElementById("timezones").childElementCount
        var tdStart = document.createElement('td')
        tdStart.innerHTML = document.getElementById("timezoneStart").value
        var tdEnd = document.createElement('td')
        tdEnd.innerHTML = document.getElementById("timezoneEnd").value
        tr.appendChild(tdStart)
        tr.appendChild(tdEnd)

        tr.addEventListener('click', function(){
            SELECTED_TIMEZONE = tr.id
        })
        tr.addEventListener('mouseout', function(){
            setTimeout(function(){SELECTED_TIMEZONE = ""}, 5);
        })

        document.getElementById("timezones").appendChild(tr)
    }

    document.getElementById("timezoneAdd").classList.remove('d-none')
    document.getElementById("timezoneRemove").classList.remove('d-none')
    document.getElementById("timezoneSave").classList.add('d-none')
    document.getElementById("timezoneCancel").classList.add('d-none')
    document.getElementById("turnoTimes").classList.add('d-none')
});
document.getElementById("timezoneCancel").addEventListener("click", function(){
    document.getElementById("timezoneAdd").classList.remove('d-none')
    document.getElementById("timezoneRemove").classList.remove('d-none')
    document.getElementById("timezoneSave").classList.add('d-none')
    document.getElementById("timezoneCancel").classList.add('d-none')
    document.getElementById("turnoTimes").classList.add('d-none')
});

document.getElementById('selected-day-turno-select').addEventListener('change', function(){
    document.getElementById("selected-day-timezones").innerHTML = ""
    if(document.getElementById('selected-day-turno-select').value != '0'){
        console.log('input[name="selected-day-type"][value="' + TURNOS[document.getElementById('selected-day-turno-select').value].type + '"]')
        document.querySelector('input[name="selected-day-type"][value="' + TURNOS[document.getElementById('selected-day-turno-select').value].type + '"]').checked = true
        document.getElementById('selected-day-turno-name').value = TURNOS[document.getElementById('selected-day-turno-select').value].name
        document.getElementById('selected-day-turno-character').value = TURNOS[document.getElementById('selected-day-turno-select').value].character
        document.getElementById('selected-day-turno-color').value = TURNOS[document.getElementById('selected-day-turno-select').value].colorLetra
        document.getElementById('selected-day-turno-bg-color').value = TURNOS[document.getElementById('selected-day-turno-select').value].colorFondo

        var count = 0
        console.log(TURNOS)
        TURNOS[document.getElementById('selected-day-turno-select').value].timezones.forEach(row => {
            var tr = document.createElement('tr')
            tr.id = "dtz_" + count
            var tdStart = document.createElement('td')
            tdStart.innerHTML = row.start
            var tdEnd = document.createElement('td')
            tdEnd.innerHTML = row.end
            tr.appendChild(tdStart)
            tr.appendChild(tdEnd)

            tr.addEventListener('click', function(){
                SELECTED_TIMEZONE = tr.id
            })
            tr.addEventListener('mouseout', function(){
                setTimeout(function(){SELECTED_TIMEZONE = ""}, 5);
            })

            document.getElementById("selected-day-timezones").appendChild(tr)
            count++
        })
    }
})
document.getElementById("selected-day-timezoneAdd").addEventListener("click", function(){
    document.getElementById("selected-day-timezoneStart").value = ''
    document.getElementById("selected-day-timezoneEnd").value = ''

    document.getElementById("selected-day-timezoneAdd").classList.add('d-none')
    document.getElementById("selected-day-timezoneRemove").classList.add('d-none')
    document.getElementById("selected-day-timezoneSave").classList.remove('d-none')
    document.getElementById("selected-day-timezoneCancel").classList.remove('d-none')
    document.getElementById("selected-day-turnoTimes").classList.remove('d-none')
});
document.getElementById("selected-day-timezoneRemove").addEventListener("click", function(){
    document.getElementById(SELECTED_TIMEZONE).remove()

});
document.getElementById("selected-day-timezoneSave").addEventListener("click", function(){
    if(document.getElementById("selected-day-timezoneStart").value != '' && document.getElementById("selected-day-timezoneEnd").value != ''){
        var tr = document.createElement('tr')
        tr.id = "tz_" + document.getElementById("selected-day-timezones").childElementCount
        var tdStart = document.createElement('td')
        tdStart.innerHTML = document.getElementById("selected-day-timezoneStart").value
        var tdEnd = document.createElement('td')
        tdEnd.innerHTML = document.getElementById("selected-day-timezoneEnd").value
        tr.appendChild(tdStart)
        tr.appendChild(tdEnd)

        tr.addEventListener('click', function(){
            SELECTED_TIMEZONE = tr.id
        })
        tr.addEventListener('mouseout', function(){
            setTimeout(function(){SELECTED_TIMEZONE = ""}, 5);
        })

        document.getElementById("selected-day-timezones").appendChild(tr)
    }

    document.getElementById("selected-day-timezoneAdd").classList.remove('d-none')
    document.getElementById("selected-day-timezoneRemove").classList.remove('d-none')
    document.getElementById("selected-day-timezoneSave").classList.add('d-none')
    document.getElementById("selected-day-timezoneCancel").classList.add('d-none')
    document.getElementById("selected-day-turnoTimes").classList.add('d-none')
});
document.getElementById("selected-day-timezoneCancel").addEventListener("click", function(){
    document.getElementById("selected-day-timezoneAdd").classList.remove('d-none')
    document.getElementById("selected-day-timezoneRemove").classList.remove('d-none')
    document.getElementById("selected-day-timezoneSave").classList.add('d-none')
    document.getElementById("selected-day-timezoneCancel").classList.add('d-none')
    document.getElementById("selected-day-turnoTimes").classList.add('d-none')
});
document.getElementById("selected-day-close").addEventListener("click", function(){
    document.getElementById("selected-day").classList.add('d-none')
});

document.getElementById("btn-delete-day").addEventListener("click", function(){
    document.getElementById("selected-day").classList.add('d-none')
    remove(SELECTED_DATE)
    generateCalendar()
});
document.getElementById("btn-save-day").addEventListener("click", function(){
    document.getElementById("selected-day").classList.add('d-none')

    var timezones = []
    for (var i = 0, row; row = document.getElementById("selected-day-timezones").rows[i]; i++) {
        timezones.push({'start': row.cells[0].innerHTML, 'end': row.cells[1].innerHTML})
    }

    const day_type = document.querySelector('input[name="selected-day-type"]:checked').value
    let horas_extra = document.getElementById("selected-day-turno-horas-extra").value

    if(horas_extra == ""){
        horas_extra = "00:00"
    }
    horas_extra = parseInt(horas_extra.split(':')[0]) * 60 + parseInt(horas_extra.split(':')[1])
    console.log(horas_extra)

    insert(USER, SELECTED_DATE, day_type, document.getElementById("selected-day-turno-name").value, document.getElementById("selected-day-turno-character").value, document.getElementById("selected-day-turno-description").value, document.getElementById("selected-day-turno-color").value, document.getElementById("selected-day-turno-bg-color").value, timezones, horas_extra)

    generateCalendar()
});

function getDateData(date) {
    var data = {'year': date.getFullYear(), 'month': date.toLocaleString('default', { month: 'long' }), 'days': new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), 'spacing': 0}

    switch(new Date(date.getFullYear(), date.getMonth(), 1).getDay()){
        case 0:
            data.spacing = 6
            break
        case 1:
            data.spacing = 0
            break
        case 2:
            data.spacing = 1
            break
        case 3:
            data.spacing = 2
            break
        case 4:
            data.spacing = 3
            break
        case 5:
            data.spacing = 4
            break
        case 6:
            data.spacing = 5
            break
    }

    return data;
}

function alterDate(numOfMonths, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
    return date;
}

function generateCalendar(){
    MODE = 'read'
    SELECTED_DAYS = []
    
    document.getElementById('settings-icon').classList.remove('d-none')
    document.getElementById('check-icon').classList.add('d-none')
    document.getElementById('edit-turno-select-container').classList.add('d-none')

    document.getElementById('calendar-body').innerHTML = ''

    var data = getDateData(DATE)

    document.getElementById('calendar-title').innerHTML = data.month
    document.getElementById('calendar-subtitle').innerHTML = data.year

    var dayName = document.createElement('h1')
    dayName.innerHTML = 'L'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)
    dayName = document.createElement('h1')
    dayName.innerHTML = 'M'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)
    dayName = document.createElement('h1')
    dayName.innerHTML = 'X'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)
    dayName = document.createElement('h1')
    dayName.innerHTML = 'J'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)
    dayName = document.createElement('h1')
    dayName.innerHTML = 'V'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)
    dayName = document.createElement('h1')
    dayName.innerHTML = 'S'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)
    dayName = document.createElement('h1')
    dayName.innerHTML = 'D'
    dayName.classList.add("unselectable")
    document.getElementById('calendar-body').appendChild(dayName)

    for (let i = 1; i <= data.spacing; i++) {
        var spacing = document.createElement('h1')
        document.getElementById('calendar-body').appendChild(spacing)
    }

    for (let i = 1; i <= data.days; i++) {
        var day = document.createElement('div')
        day.id = 'day' + i
        var dayNote = document.createElement('span')
        var dayTitle = document.createElement('h3')
        var daySubtitle = document.createElement('h1')

        day.classList.add('day');
        day.setAttribute('data-long-press-delay', 400)

        dayNote.innerHTML = '+'
        dayTitle.innerHTML = i
        daySubtitle.innerHTML = ''

        dayNote.classList.add("d-none")
        dayNote.classList.add("unselectable")
        dayTitle.classList.add("unselectable")
        daySubtitle.classList.add("unselectable")

        day.appendChild(dayNote)
        day.appendChild(dayTitle)
        day.appendChild(daySubtitle)

        day.addEventListener('long-press', e => {
            if(USER == 'local'){
                MODE = 'edit'
                FIRSTSELECT = false
                document.getElementById('day' + i).classList.toggle('selected')
    
                if(SELECTED_DAYS.includes(i + "-" + (DATE.getMonth() + 1) + "-" + DATE.getFullYear())){
                    SELECTED_DAYS = SELECTED_DAYS.filter(item => (item != (DATE.getFullYear() + "-" + (DATE.getMonth() + 1) + "-" + i)));
                }else{
                    SELECTED_DAYS.push(i + "-" + (DATE.getMonth() + 1) + "-" + DATE.getFullYear())
                }
    
                document.getElementById('settings-icon').classList.add('d-none')
                document.getElementById('check-icon').classList.remove('d-none')
                document.getElementById('edit-turno-select-container').classList.remove('d-none')
                fillTurnosSelect()
            }
        });
        day.addEventListener('mousedown', e => {
            e.stopPropagation()
            if(MODE == 'edit' && FIRSTSELECT && USER == 'local'){
                document.getElementById('day' + i).classList.toggle('selected')
    
                if(SELECTED_DAYS.includes(i + "-" + (DATE.getMonth() + 1) + "-" + DATE.getFullYear())){
                    SELECTED_DAYS = SELECTED_DAYS.filter(item => (item != (i + "-" + (DATE.getMonth() + 1) + "-" + DATE.getFullYear())));
                }else{
                    SELECTED_DAYS.push(i + "-" + (DATE.getMonth() + 1) + "-" + DATE.getFullYear())
                }
    
                document.getElementById('settings-icon').classList.add('d-none')
                document.getElementById('check-icon').classList.remove('d-none')
            }else if(MODE == 'read' && USER == 'local'){
                var dp = ''
                var dp2 = ''

                if(DATE.getMonth() + 1 < 10){dp = '0'}
                if(i < 10){dp2 = '0'}

                selectDay(DATE.getFullYear() + '-' + dp + (DATE.getMonth() + 1) + '-' + dp2 + i)
            }
            FIRSTSELECT = true
        });
        
        document.getElementById('calendar-body').appendChild(day)
    }

    var d = alterDate(1, new Date(DATE))
    var dp = ''
    var dp2 = ''

    if(DATE.getMonth() + 1 < 10){dp = '0'}
    if(d.getMonth() + 1 < 10){dp2 = '0'}

    select('WHERE user = "' + USER + '" AND date >= "' + DATE.getFullYear() + '-' + dp + (DATE.getMonth() + 1) + '-01" AND date < "' + d.getFullYear() + '-' + dp2 + (d.getMonth() + 1) + '-01"')
}

var getMonth = function(idx) {
    var objDate = new Date();
    objDate.setDate(1);
    objDate.setMonth(idx-1);
  
    return objDate.toLocaleString('default', { month: 'long' }).substring(0,3);
}

function generateMonthSelector(){
    document.getElementById('month-selector-body').innerHTML = ''

    for (let i = 1; i <= 12; i++) {
        var month = document.createElement('h1')
        month.innerHTML = getMonth(i)
        month.addEventListener('click', function(){
            DATE.setMonth(i - 1)

            if(!document.getElementById("resume").classList.contains("d-none")){
                document.querySelectorAll(".resume-header div").forEach(element => {
                    element.classList.remove("selected")
                })
                document.getElementById('btn-month').classList.add("selected")
                changeResume()
            }

            generateCalendar()
        })
        document.getElementById('month-selector-body').appendChild(month)
    }
}

function generateYearSelector(){
    document.getElementById('year-selector-body').innerHTML = ''

    for (let i = -10; i <= 10; i++) {
        var year = document.createElement('h1')
        year.id = new Date().getFullYear() + i
        year.innerHTML = new Date().getFullYear() + i

        year.addEventListener('click', function(){
            document.querySelectorAll('#year-selector-body h1').forEach(element => {
                element.style.background = 'inherit'
                element.style.color = 'white'
            })

            document.getElementById(new Date().getFullYear() + i).style.color = 'black'
            document.getElementById(new Date().getFullYear() + i).style.background = 'linear-gradient(to right, #3a3a3a, white, white, white, white, white, white, #3a3a3a)'

            DATE.setFullYear(new Date().getFullYear() + i)

            if(!document.getElementById("resume").classList.contains("d-none")){
                document.querySelectorAll(".resume-header div").forEach(element => {
                    element.classList.remove("selected")
                })
                document.getElementById('btn-year').classList.add("selected")
                changeResume()
            }

            generateCalendar()
        })
        
        document.getElementById('year-selector-body').appendChild(year)

        if(i == 0){
            document.getElementById(new Date().getFullYear() + i).style.color = 'black'
            document.getElementById(new Date().getFullYear() + i).style.background = 'linear-gradient(to right, #3a3a3a, white, white, white, white, white, white, #3a3a3a)'
        }
    }
}

function saveFile(fileName, fileData) {
    console.log("si")
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

        console.log('file system open: ' + fs.name);
        createFile(fs.root, fileName, fileData);
    
    }, function (evt) {
        alert("Error: Could not access file system, " + evt.target.error.code);
    });
}

function createFile(dirEntry, fileName, fileData) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

        writeFile(fileEntry, null, fileData);

    }, function (error) {
        alert("Error: Could not create file writer, " + error.code);
    });

}

function writeFile(fileEntry, dataObj, fileData) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            shareFileCordova(fileEntry.nativeURL);
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob([JSON.stringify(fileData)], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function shareFileCordova(fullPath) {
    console.log(fullPath);
    var options = {
      files: [fullPath],
      chooserTitle: 'Select an app'
    }
    window.plugins.socialsharing.shareWithOptions(options, (result) => {
      console.log(result);
    }, (msg) => {
      toastr.error(msg, "Something went wrong!");
    });
}

function loadFile() {
    let file = document.getElementById('file-import').files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
        insertImport(file.name.split('.')[0], JSON.parse(reader.result))
        getUsers()
    };

    reader.onerror = function() {
        console.log(reader.error);
    };
}

function changeCalendar(user){
    document.querySelectorAll('.menu ul li').forEach(element => {
        element.classList.remove('selected')
    })
    document.getElementById("btn-" + user).classList.add('selected')
    console.log(user)

    USER = user
    generateCalendar()
    document.getElementById('structure').classList.remove('menu-open')
}

function error() {
    console.log('Storage permission is not turned on')
}

function selectDay(date){
    SELECTED_DATE = date
    document.getElementById('selected-day-turno-select').value = 0
    document.getElementById('selected-day').classList.remove('d-none')
    document.getElementById('selected-day').classList.add('show')
    selectByDay('WHERE user = "' + USER + '" AND date = "' + date + '"')
}

function loadResume(start_date, end_date){
    selectResume(USER, start_date, end_date)
}

function changeResume(){
    let start_date
    let end_date

    switch(document.querySelector(".resume-header div.selected").id){
        case 'btn-year':
            start_date = DATE.getFullYear() + "-01-01"
            end_date = DATE.getFullYear() + "-12-31"
            break
        case 'btn-month':
            var dp = ''
            if((DATE.getMonth() + 1) < 10){dp = '0'}

            start_date = DATE.getFullYear() + '-' + dp + (DATE.getMonth() + 1) + '-01'
            end_date = DATE.getFullYear() + '-' + dp + (DATE.getMonth() + 1) + '-31'
            break
        case 'btn-range':
            start_date = document.getElementById("resume-range-start").value
            end_date = document.getElementById("resume-range-end").value

            console.log(start_date)
            console.log(end_date)
            break
    }

    loadResume(start_date, end_date)
}

generateMonthSelector()
generateYearSelector()
fillTurnosSelect()

getUsers()
generateCalendar()