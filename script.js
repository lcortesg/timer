// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

// global object
var T = {};
T.timerDiv = document.getElementById('timer');
last_time = document.getElementById('last_timer');
lap_show = document.getElementById('lap_number');
var x = document.getElementById("show_start");
var y = document.getElementById("show_stop");
y.style.display = "none";
//show_button = document.getElementById("state_stop").innerHTML="";
var running = 0;
var vuelta = 1;
var tiempo;
var inicio;
var fin;
var safe_time = 0;
var acum_time = 0;
var max_time = 600;
lap1_time = document.getElementById('lap1_timer');
lap2_time = document.getElementById('lap2_timer');
lap3_time = document.getElementById('lap3_timer');
best_time = document.getElementById('best_timer');
var best_time_ever = "99:99:999";
const autoSave = true;
const alerts = true;
const needReset = true;
var data='\r**********************************************\r\n' + '\r  Log Timer Competencia Robótica UTFSM 2020 \r\n' + '\r**********************************************\r\n\n' + '\rLog Started: '+  fecha(new Date().getTime()) +'\r\n' + '\rLap |   Time    |  Start Time  |   End Time\r\n';


function displayTimer() {
    // initilized all local variables:
    var hours='00', minutes='00',
    miliseconds=0, seconds='00',
    time = '',
    timeNow = new Date().getTime(); // timestamp (miliseconds)

    T.difference = timeNow - T.timerStarted;

    // milliseconds
    if(T.difference > 10) {
        miliseconds = Math.floor((T.difference % 1000) );
        if(miliseconds < 100) {
            if(miliseconds < 10) {
                miliseconds = '00'+String(miliseconds);
            }
            if(miliseconds > 10) {
                miliseconds = '0'+String(miliseconds);
            }
        }
    }
    // seconds
    if(T.difference > 1000) {
        seconds = Math.floor(T.difference / 1000);
        if (seconds > 59) {
            seconds = seconds % 60;
        }
        if(seconds < 10) {
            seconds = '0'+String(seconds);
        }
    }

    // minutes
    if(T.difference > 60000) {
        minutes = Math.floor(T.difference/60000);
        if (minutes > 59) {
            minutes = minutes % 60;
        }
        if(minutes < 10) {
            minutes = '0'+String(minutes);
        }
    }


    // hours
    if(T.difference > 3600000) {
        hours = Math.floor(T.difference/3600000);
        // if (hours > 24) {
        // 	hours = hours % 24;
        // }
        if(hours < 10) {
            hours = '0'+String(hours);
        }
    }

    //time  =  hours   + ':'
    time = minutes + ':'
    time += seconds + ','
    time += miliseconds;
    T.timerDiv.innerHTML = time;
    if ((acum_time + T.difference/1000 >= 15)&alerts) {maxedTimer();}
}


function startTimer() {
    if (running < 3){
        T.timerStarted0 = new Date().getTime()
        if (((T.timerStarted0 - T.timerStoped)/1000 <2)&running==2&alerts)  {invalidTimer();}
        else if (running == 0 || running == 2) {
            x.style.display = "none";
            y.style.display = "block";
            T.timerStarted = new Date().getTime()
            if (running == 2) {clearTimer();}
            // save start time
            //T.timerStarted = new Date().getTime()
            inicio = T.timerStarted
            running = 1;
            //console.log('Timer Start: '+hora(inicio))
            if (T.difference > 0) {
                T.timerStarted = T.timerStarted - T.difference
            }
            // update timer periodically
            T.timerInterval = setInterval(function() {
                displayTimer()
            }, 10);  
            if (vuelta == 1){
                lap1_time.innerHTML = "-";
                lap2_time.innerHTML = "-";
                lap3_time.innerHTML = "-";  
            }
        }
    }
}



function stopTimer() {
    
    T.timerStoped = new Date().getTime()
    if (running == 1){
        x.style.display = "block";
        y.style.display = "none";
        // save stop time
        clearInterval(T.timerInterval); // stop updating the timer
        fin = inicio + T.difference;
        acum_time += T.difference/1000
        running = 2;
        tiempo = document.getElementById('timer').innerHTML;
        if (tiempo < best_time_ever){ best_time_ever=tiempo; best_time.innerHTML= tiempo;}
        data += '\r '+vuelta+'  | ' + tiempo + ' | ' + hora(inicio) + ' | ' + hora(fin) + '\r\n '
        if (vuelta == 3){
            data +='\r----------------------------------------------\r\n';
            vuelta = 1;
            lap3_time.innerHTML = tiempo;
            if (needReset){running = 3;}
            acum_time = 0;
            if(autoSave){saveFile();}
        }
        else if (vuelta == 2){
            lap2_time.innerHTML = tiempo;
            vuelta=3;
        }
        else if (vuelta == 1){
            lap1_time.innerHTML = tiempo;
            vuelta = 2;
        }
    }   
}

function clearTimer() {
    if (running == 2){
        clearInterval(T.timerInterval);
        T.timerDiv.innerHTML = "00:00,000"; // reset timer to all zeros
        T.difference = 0;
        if (vuelta == 1){acum_time = 0;}
    }
}

function resetTimer() {
    if (running == 2 || running == 3){
        x.style.display = "block";
        y.style.display = "none";
        if (vuelta == 1) {
            data += '\r                  TIMER RESET\r\n ' + '\r----------------------------------------------\r\n';
        }
        if (vuelta!=1){
            data += '\r '+vuelta+'  |             TIMER RESET\r\n ' + '\r----------------------------------------------\r\n';
        }
        running = 0;
        clearInterval(T.timerInterval);
        T.timerDiv.innerHTML = "00:00,000"; // reset timer to all zeros
        T.difference = 0;
        vuelta = 1;
        lap1_time.innerHTML = "-";
        lap2_time.innerHTML = "-";
        lap3_time.innerHTML = "-";
    }
}


function invalidTimer(){
    data += '\r '+vuelta+'  |             INVALID LAP\r\n '
    //data += '\r '+vuelta+'  | INVALID LAP  ' + hora(T.timerStoped) + ' | ' + hora(T.timerStarted) + '\r\n '
    if (vuelta == 3){
        data +='\r----------------------------------------------\r\n';
        vuelta=1;
        lap3_time.innerHTML = "Vuelta inválida";
        if(autoSave){saveFile();}
    }
    
    else if (vuelta == 2){
        
        vuelta=3;
        lap2_time.innerHTML = "Vuelta Inválida";
    }

    clearTimer();
    alert('TIEMPO MÍNIMO DE ESPERA NO REALIZADO');
}

function maxedTimer(){
    data += '\r '+ vuelta +'  |        MAXIMUM TIME EXCEEDED\r\n ' + '\r----------------------------------------------\r\n';
    vuelta=1;
    acum_time = 0;
    x.style.display = "block";
    y.style.display = "none";
    running = 3;
    clearInterval(T.timerInterval);
    T.difference = 0;
    //stopTimer();
    alert('TIEMPO MÁXIMO PERMITIDO SUPERADO');
    if(autoSave){saveFile();}

}


document.onkeypress =  keyPressFunction;
function keyPressFunction(e){
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    console.log(charCode);
    if(charCode == 97 || charCode == 65) {startTimer();}  // "a or A"
    if(charCode == 115 || charCode == 83) {stopTimer();}  // "s or S"
    if(charCode == 100 || charCode == 68) {resetTimer();} // "d or D"
    if(charCode == 102 || charCode == 70) {saveFile();}   // "f or F"
}




function saveFile(){
    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], { type: 'text/plain' });
    const sFileName = 'log.txt'; // File to save the data.

    let newLink = document.createElement("a");
    newLink.download = sFileName;

    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
    //alert('Descargando LOG!');
}

function fecha(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    //var month = months[a.getMonth()];
    var month = a.getMonth();
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var msec = UNIX_timestamp%1000;
    if (month < 10) {month = '0'+month;}
    if (date < 10) {date = '0'+date;}
    if (hour < 10) {hour = '0'+hour;}
    if (min < 10) {min = '0'+min;}
    if (sec < 10) {sec = '0'+sec;}
    if (msec < 100) {
        if (msec < 10){msec = '00'+msec;}
        if (msec > 10){msec = '0'+msec;}
    }
    var time = year+'/'+month+'/'+date + ' - ' + hour + ':' + min + ':' + sec+','+msec;
    return time;
}


function hora(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var msec = UNIX_timestamp%1000;
    if (hour < 10) {hour = '0'+hour;}
    if (min < 10) {min = '0'+min;}
    if (sec < 10) {sec = '0'+sec;}
    if (msec < 100) {
        if (msec < 10){msec = '00'+msec;}
        if (msec > 10){msec = '0'+msec;}
    }
    var time = hour+':'+min+':'+sec+','+msec;
    return time;
}




