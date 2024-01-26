var dbobj
document.addEventListener('deviceready', onDeviceReady, false)

function onDeviceReady() {
    dbobj = window.sqlitePlugin.openDatabase({name: "worca", location: "default"})

    dbobj.transaction(
        function createSchema(tx){
            //tx.executeSql('DROP TABLE user_calendar')
            //tx.executeSql('DROP TABLE time_zone')
            tx.executeSql('CREATE TABLE IF NOT EXISTS user_calendar (user TEXT, date DATETIME, type INTEGER, name TEXT, character TEXT, description TEXT, color TEXT, bg_color TEXT, primary key (user, date))')
            tx.executeSql('CREATE TABLE IF NOT EXISTS time_zone (user TEXT, date DATETIME, start TIME, end TIME)')
            /*tx.executeSql(
                'PRAGMA table_info(user_calendar);',
                [],
                function success(tx, results){
                    const rowsLng = JSON.stringify(results.rows.length)

                    if(rowsLng >= 9 && results.rows.item(8).name == "horas_extra"){
                        console.log("Column already exists")
                    }else{
                        tx.executeSql("ALTER TABLE user_calendar ADD horas_extra INTEGER;")
                    }
                }
            )*/
        },
        
        function error(tx, error){
            console.log("Error to create schema "+ error.message)
        },

        function success(){
            //console.log("Schema creation successful")

            var script = document.createElement('script')
            script.src = 'js/script.js'
            script.setAttribute('defer', '')
            document.getElementById('header').appendChild(script)
        }
    );
}

function insert(user, date, type, name, character, description, color, bg_color, timezones, horas_extra){
    let empty_description = ""
    if(description != "NULL"){empty_description = description}
    dbobj.transaction(
        function insertRecord(tx){
            tx.executeSql(
                'INSERT INTO user_calendar (user, date, type, name, character, description, color, bg_color, horas_extra) VALUES("' + user + '","' + date + '", ' + type + ',"' + name + '","' + character + '","' + empty_description + '","' + color + '","' + bg_color + '", ' + horas_extra + ') ON CONFLICT(user, date) DO UPDATE SET name = "' + name + '", type = ' + type + ', character = "' + character + '", description = (CASE WHEN "' + description + '" = "NULL" THEN description else "' + description + '" END), color = "' + color + '", bg_color = "' + bg_color + '", horas_extra = (CASE WHEN ' + horas_extra + ' = "NULL" THEN horas_extra else ' + horas_extra + ' END)',

                [],

                function success(tx, result){
                    console.log("Last inserted ID = " + result.insertId)

                    tx.executeSql(
                        'DELETE FROM time_zone WHERE user = "' + user + '" AND date = "' + date + '"',
        
                        [],
        
                        function success(tx, result){
                            console.log("Row deleted: " + date)
                        },
        
                        function error(tx, error){
                            console.log("Error deleting row: " + date + 'DELETE FROM user_calendar WHERE date = "' + date + '"')
                        }
                    );

                    timezones.forEach(timezone => {
                        tx.executeSql(
                            'INSERT INTO time_zone (user, date, start, end) VALUES("' + user + '","' + date + '","' + timezone.start + '","' + timezone.end + '")',
            
                            [],
            
                            function success(tx, result){
                                console.log("Last inserted ID = " + result.insertId)
                            },
            
                            function error(tx, error){
                                console.log("Error processing SQL: "+ error.message + 'INSERT INTO time_zone (user, date, start, end) VALUES("' + user + '","' + date + '","' + timezone.start + '","' + timezone.end + '")')
                            }
                        );
                    })
                },

                function error(tx, error){
                    console.log("Error processing SQL: "+ error.message + 'INSERT INTO user_calendar (user, date, type, name, character, description, color, bg_color) VALUES("' + user + '","' + date + '","' + name + '","' + character + '","' + description + '","' + color + '","' + bg_color + '") ON CONFLICT(user, date) DO UPDATE SET name = "' + name + '", type = ' + type + ', character = "' + character + '", description = "' + description + '", color = "' + color + '", bg_color = "' + bg_color + '"')
                }
            );
        },

        function error(){
            console.log("Error to insert record")
        },

        function success(){
            console.log("Success to insert record")
        }
    ) 
}

function remove(date){
    dbobj.transaction(
        function insertRecord(tx){
            tx.executeSql(
                'DELETE FROM user_calendar WHERE user = "local" AND date = "' + date + '"',

                [],

                function success(tx, result){
                    console.log("Row deleted: " + date)
                },

                function error(tx, error){
                    console.log("Error deleting row: " + date + 'DELETE FROM user_calendar WHERE date = "' + date + '"')
                }
            );
        },

        function error(){
            console.log("Error to remove record")
        },

        function success(){
            console.log("Success to remove record")
        }
    ) 
}

function removeUser(user){
    dbobj.transaction(
        function insertRecord(tx){
            tx.executeSql(
                'DELETE FROM user_calendar WHERE user = "' + user + '"',

                [],

                function success(tx, result){
                    console.log("User deleted: " + user)
                },

                function error(tx, error){
                    console.log("Error deleting row: " + user + 'DELETE FROM user_calendar WHERE user = "' + user + '"')
                }
            );
        },

        function error(){
            console.log("Error to remove record")
        },

        function success(){
            console.log("Success to remove record")
        }
    ) 
}

function getUsers(){
    dbobj.transaction(
        function selectRecords(tx){
            tx.executeSql(
                'SELECT DISTINCT(user) FROM user_calendar WHERE user != "local"',

                [],

                function success(tx, results){
                    document.getElementById('importedCalendar').innerHTML = ''
                    const rowsLng = JSON.stringify(results.rows.length)

                    if(rowsLng == 0){
                        document.getElementById('importedTitle').classList.add('d-none')
                    }else{
                        document.getElementById('importedTitle').classList.remove('d-none')
                    }

                    for (let i = 0; i < rowsLng; i++) {
                        var button = document.createElement('li')
                        button.id = 'btn-' + results.rows.item(i).user
                        button.classList.add('d-flex', 'align-center', 'justify-between')
                        button.addEventListener('click', e => {
                            changeCalendar(results.rows.item(i).user)
                        })

                        var text = document.createElement('p')
                        text.innerHTML = results.rows.item(i).user

                        var icon = document.createElement('i')
                        icon.classList.add('fa-solid', 'fa-ellipsis-v')
                        icon.addEventListener('click', e => {
                            e.stopPropagation()
                            const has = document.querySelectorAll('#btn-' + results.rows.item(i).user + ' ul')[0].classList.contains('open')
                            document.querySelectorAll('ul.open').forEach(element => {
                                element.classList.remove('open')
                            })

                            if(!has){
                                document.querySelectorAll('#btn-' + results.rows.item(i).user + ' ul')[0].classList.add('open')
                            }
                        })

                        var submenu = document.createElement('ul')
                        var del = document.createElement('li')
                        del.innerHTML = 'Borrar'
                        del.addEventListener('click', e => {
                            e.stopPropagation()
                            removeUser(results.rows.item(i).user)
                            getUsers()
                            changeCalendar('local')
                        })

                        submenu.appendChild(del)

                        button.appendChild(text)
                        button.appendChild(icon)
                        button.appendChild(submenu)

                        document.getElementById('importedCalendar').appendChild(button)
                    }
                },

                function error(tx, error){
                    console.log("Error processing SQL: "+ error.message)
                }
            );
        },

        function error(){
            console.log("Error to select records")
        },

        function success(){
            console.log("Success to select records")
        }
    );
}

function select(where){
    //console.log(where)
    //where = ''
    console.log('SELECT * FROM user_calendar ' + where + ' ORDER BY date')

    dbobj.transaction(
        function selectRecords(tx){
            tx.executeSql(
                'SELECT * FROM user_calendar ' + where + ' ORDER BY date',

                [],

                function success(tx, results){
                    const rowsLng = JSON.stringify(results.rows.length)

                    for (let i = 0; i < rowsLng; i++) {
                        //alert(JSON.stringify(results.rows.item(i)))

                        var day = parseInt(results.rows.item(i).date.split('-')[2])
                        document.getElementById('day' + day).style.background = results.rows.item(i).bg_color
                        document.getElementById('day' + day).style.color = results.rows.item(i).color

                        document.querySelectorAll('#day' + day + ' h1')[0].innerHTML = results.rows.item(i).character.toUpperCase()
                        document.querySelectorAll('#day' + day + ' h3')[0].style.borderColor = results.rows.item(i).color

                        if(results.rows.item(i).description != ""){
                            document.querySelector('#day' + day).style.setProperty('--tag-color', results.rows.item(i).color)
                        }
                        if(results.rows.item(i).horas_extra != null && results.rows.item(i).horas_extra > 0){
                            document.querySelector('#day' + day + ' span').classList.remove("d-none")
                        }

                        console.log(JSON.stringify(results.rows.item(i)))
                    }
                },

                function error(tx, error){
                    console.log("Error processing SQL: "+ error.message)
                }
            );
        },

        function error(error){
            console.log("Error to select records: " + error.message)
        },

        function success(){
            console.log("Success to select records")
        }
    );
}

function selectByDay(where){
    //console.log(where)
    //where = ''
    console.log('SELECT * FROM user_calendar ' + where + ' ORDER BY date')

    dbobj.transaction(
        function selectRecords(tx){
            tx.executeSql(
                'SELECT * FROM user_calendar ' + where + ' ORDER BY date',

                [],

                function success(tx, results){
                    if(JSON.stringify(results.rows.length) > 0){
                        var day = results.rows.item(0)

                        let mth = minuteToHour(0)
                        console.log(day.horasExtra)
                        if(day.horas_extra != null){
                            mth = minuteToHour(day.horas_extra)
                            console.log(mth)
                        }

                        if(mth[0] < 10){
                            mth[0] = "0" + mth[0]
                        }
                        if(mth[1] < 10){
                            mth[1] = "0" + mth[1]
                        }

                        document.querySelector('input[name="selected-day-type"][value="' + day.type + '"]').checked = true
                        document.getElementById("selected-day-turno-name").value = day.name
                        document.getElementById("selected-day-turno-character").value = day.character
                        document.getElementById("selected-day-turno-description").value = day.description
                        document.getElementById("selected-day-turno-color").value = day.color
                        document.getElementById("selected-day-turno-bg-color").value = day.bg_color
                        document.getElementById("selected-day-turno-horas-extra").value = mth[0] + ':' + mth[1]
                        document.getElementById("selected-day-timezones").innerHTML = ""
    
                        tx.executeSql(
                            'SELECT * FROM time_zone ' + where,
            
                            [],
            
                            function success(tx, results){
                                const rowsLng = JSON.stringify(results.rows.length)
                                for (let i = 0; i < rowsLng; i++) {
                                    var timezone = results.rows.item(i)
                                    
                                    var tr = document.createElement('tr')
                                    tr.id = "dtz_" + i
                                    var tdStart = document.createElement('td')
                                    tdStart.innerHTML = timezone.start
                                    var tdEnd = document.createElement('td')
                                    tdEnd.innerHTML = timezone.end
                                    tr.appendChild(tdStart)
                                    tr.appendChild(tdEnd)

                                    tr.addEventListener('click', function(){
                                        SELECTED_TIMEZONE = tr.id
                                    })
                                    tr.addEventListener('mouseout', function(){
                                        setTimeout(function(){SELECTED_TIMEZONE = ""}, 5);
                                    })

                                    document.getElementById("selected-day-timezones").appendChild(tr)
                                    
                                    console.log(JSON.stringify(results.rows.item(i)))
                                }
                            },
            
                            function error(tx, error){
                                console.log("Error processing SQL: "+ error.message)
                            }
                        );
                    }else{
                        document.getElementById("selected-day-radio-work").checked = true
                        document.getElementById("selected-day-turno-name").value = ""
                        document.getElementById("selected-day-turno-character").value = ""
                        document.getElementById("selected-day-turno-description").value = ""
                        document.getElementById("selected-day-turno-color").value = "#ffffff"
                        document.getElementById("selected-day-turno-bg-color").value = "#000000"
                        document.getElementById("selected-day-turno-horas-extra").value = '00:00'
                        document.getElementById("selected-day-timezones").innerHTML = ""
                    }
                },

                function error(tx, error){
                    console.log("Error processing SQL: "+ error.message)
                }
            );
        },

        function error(error){
            console.log("Error to select records: " + error.message)
        },

        function success(){
            console.log("Success to select records")
        }
    );
}

function selectResume(user, start_date, end_date){
    console.log('SELECT user_calendar.*, IFNULL(time_zone.start, 0) AS start, IFNULL(time_zone.end, 0) AS end, CASE WHEN start IS NULL AND end IS NULL THEN 0 WHEN ((strftime("%s", time_zone.end || ":00") - strftime("%s", time_zone.start || ":00")) / 60) >= 0 THEN ((strftime("%s", time_zone.end || ":00") - strftime("%s", time_zone.start || ":00")) / 60) ELSE 1440 + ((strftime("%s", time_zone.end || ":00") - strftime("%s", time_zone.start || ":00")) / 60) END AS timediff FROM user_calendar LEFT JOIN time_zone ON user_calendar.user = time_zone.user AND user_calendar.date = time_zone.date WHERE user_calendar.user = "' + user + '" AND user_calendar.date >= "' + start_date + '" AND user_calendar.date <= "' + end_date + '" ORDER BY user_calendar.name')

    dbobj.transaction(
        function selectRecords(tx){
            tx.executeSql(
                'SELECT user_calendar.*, IFNULL(time_zone.start, 0) AS start, IFNULL(time_zone.end, 0) AS end, CASE WHEN start IS NULL AND end IS NULL THEN 0 WHEN ((strftime("%s", time_zone.end || ":00") - strftime("%s", time_zone.start || ":00")) / 60) >= 0 THEN ((strftime("%s", time_zone.end || ":00") - strftime("%s", time_zone.start || ":00")) / 60) ELSE 1440 + ((strftime("%s", time_zone.end || ":00") - strftime("%s", time_zone.start || ":00")) / 60) END AS timediff FROM user_calendar LEFT JOIN time_zone ON user_calendar.user = time_zone.user AND user_calendar.date = time_zone.date WHERE user_calendar.user = "' + user + '" AND user_calendar.date >= "' + start_date + '" AND user_calendar.date <= "' + end_date + '" ORDER BY user_calendar.name',

                [],

                function success(tx, results){
                    const rowsLng = JSON.stringify(results.rows.length)
                    let data = {}
                    let dates = []

                    let totalTime = 0
                    let totalDays = 0
                    let horasExtra = 0
                    let totalExtraDays = 0
                    for (let i = 0; i < rowsLng; i++) {
                        const row = results.rows.item(i)
                        totalTime += row.timediff
                        if(!Object.keys(data).includes(row.name)){
                            if(row.start == 0 && row.end == 0){
                                data[row.name] = {
                                    type: row.type,
                                    color: row.color,
                                    bg_color: row.bg_color,
                                    timezones: [],
                                    days: 1,
                                    minutes: ""
                                }
                            }else{
                                data[row.name] = {
                                    type: row.type,
                                    color: row.color,
                                    bg_color: row.bg_color,
                                    timezones: ["(" + row.start + " - " + row.end + ")"],
                                    days: 1,
                                    minutes: row.timediff
                                }
                            }

                            if(row.horas_extra != null && row.horas_extra > 0){
                                horasExtra += row.horas_extra
                                totalExtraDays += 1
                            }

                            dates.push(row.date)

                            if(row.type == 0){
                                totalDays += 1
                            }
                        }else{
                            if(!dates.includes(row.date)){
                                dates.push(row.date)
                                data[row.name].days = data[row.name].days + 1
                                if(row.type == 0){
                                    totalDays += 1
                                }
                                if(row.horas_extra != null && row.horas_extra > 0){
                                    horasExtra += row.horas_extra
                                    totalExtraDays += 1
                                }
                            }

                            if(row.timediff != 0){
                                data[row.name].minutes = data[row.name].minutes + row.timediff
                            }

                            if(!(row.start == 0 && row.end == 0) && !data[row.name].timezones.includes("(" + row.start + " - " + row.end + ")")){
                                data[row.name].timezones.push("(" + row.start + " - " + row.end + ")")
                            }
                        }
                        
                        console.log(JSON.stringify(results.rows.item(i)))
                    }

                    document.getElementById("resume-total-days").innerHTML = totalDays + " D&iacute;as"
                    const mth = minuteToHour(totalTime + horasExtra)
                    document.getElementById("resume-total-time").innerHTML = mth[0] + 'h ' + mth[1] + 'm'
                    document.getElementById("resume-tbody").innerHTML = ""

                    Object.keys(data).forEach(turno => {
                        let tr = document.createElement("tr")

                        let n = document.createElement("td")
                        n.innerHTML = turno
                        n.style.color = data[turno].color
                        n.style.background = data[turno].bg_color

                        let t = document.createElement("td")
                        data[turno].timezones.forEach(turno_tz => {
                            let tz = document.createElement("p")
                            tz.innerHTML = turno_tz
                            t.appendChild(tz)
                        })

                        let d = document.createElement("td")
                        d.innerHTML = data[turno].days

                        let m = document.createElement("td")

                        if(data[turno].type == 1){
                            m.innerHTML = "Libre"
                        }else if(data[turno].timezones.length == 0){
                            m.innerHTML = "Completo"
                        }else{
                            const mth = minuteToHour(data[turno].minutes)
                            m.innerHTML = mth[0] + 'h ' + mth[1] + 'm'
                        }

                        tr.appendChild(n)
                        tr.appendChild(t)
                        tr.appendChild(d)
                        tr.appendChild(m)

                        document.getElementById("resume-tbody").appendChild(tr)
                    })

                    if(horasExtra > 0){
                        let tr = document.createElement("tr")

                        let n = document.createElement("td")
                        n.innerHTML = "Extra"
                        n.style.color = "black"

                        let t = document.createElement("td")

                        let d = document.createElement("td")
                        d.innerHTML = totalExtraDays

                        let m = document.createElement("td")
                        const mth = minuteToHour(horasExtra)
                        m.innerHTML = mth[0] + 'h ' + mth[1] + 'm'

                        tr.appendChild(n)
                        tr.appendChild(t)
                        tr.appendChild(d)
                        tr.appendChild(m)

                        document.getElementById("resume-tbody").appendChild(tr)
                    }
                                        
                    console.log(JSON.stringify(data))
                    console.log(totalDays)
                    console.log(totalTime)
                },

                function error(tx, error){
                    console.log("Error processing SQL: "+ error.message)
                }
            );
        },

        function error(error){
            console.log("Error to select records: " + error.message)
        },

        function success(){
            console.log("Success to select records")
        }
    );
}

function selectExport(){
    dbobj.transaction(
        function selectRecords(tx){
            tx.executeSql(
                'SELECT * FROM user_calendar WHERE user = "local"',

                [],

                function success(tx, results){
                    const rowsLng = JSON.stringify(results.rows.length)
                    var data = []

                    for (let i = 0; i < rowsLng; i++) {
                        var day = results.rows.item(i)
                        data.push(day)

                        tx.executeSql(
                            'SELECT * FROM time_zone WHERE user = "local" AND date = "' + day.date + '"',
            
                            [],
            
                            function success(tx, results2){
                                var timezones = []
                                const rowsLng2 = JSON.stringify(results2.rows.length)
                                for (let j = 0; j < rowsLng2; j++) {
                                    timezones.push(results2.rows.item(j))
                                }
                                data[i]['timezones'] = timezones
                            },
            
                            function error(tx, error){
                                console.log("Error processing SQL: "+ error.message)
                            }
                        );
                    }

                    var filename = prompt("Establece un nombre para el calendario:", "")

                    if(filename != null){
                        saveFile(filename + '.txt', data)
                    }
                },

                function error(tx, error){
                    console.log("Error processing SQL: "+ error.message)
                }
            );
        },

        function error(){
            console.log("Error to select records")
        },

        function success(){
            console.log("Success to select records")
        }
    );
}

function insertImport(user, rows){
    removeUser(user)
    rows.forEach(row =>{
        insert(user, row.date, row.type, row.name, row.character, row.description, row.color, row.bg_color, row.timezones, row.horas_extra)
    })
}

function minuteToHour(minutes){
    return [Math.trunc(minutes / 60), (minutes - Math.trunc(minutes / 60) * 60)]
}