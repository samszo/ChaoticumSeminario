let displayCrono = document.getElementById('chrono');
let btnGo = document.getElementById('btnGoChrono');
let btnStop = document.getElementById('btnStopChrono');
let heure = 0;
let minute = 0;
let seconde = 0;
let pauseChrono;

function defilerchrono(){
    seconde = parseInt(seconde);
    minute = parseInt(minute);
    heure = parseInt(heure);

    seconde++;
    if(seconde === 60){
        minute++;
        seconde = 0;
    }

    if(minute === 60){
        heure++;
        minute = 0;
    }

//Formatter l'affichage du chrono

    if(seconde < 10) {
        seconde = "0" + seconde;
    }

    if(minute < 10){
        minute = "0" + minute;
    }

    if(heure < 10){
        heure = "0" + heure;
    }

    displayCrono.textContent = heure + ":" +  minute + ":" + seconde;
    pauseChrono = setTimeout(defilerchrono, 1000);
}

function  demarreChrono () {
    defilerchrono();
}

function stopChrono (){
    clearTimeout(pauseChrono);
}
// Ajout des listener
btnGo.addEventListener("click", demarreChrono );
btnStop.addEventListener("click",stopChrono );
