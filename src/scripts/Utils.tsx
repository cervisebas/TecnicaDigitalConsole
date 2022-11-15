export function startTimer(duration: number, callback: (time: string)=>void, timeLenght?: number) {
    var timer = duration, minutes, seconds;
    var interval = setInterval(()=>{
        minutes = parseInt(String(timer / 60), 10);
        seconds = parseInt(String(timer % 60), 10);
        minutes = (minutes < 10)? "0" + minutes : minutes;
        seconds = (seconds < 10)? "0" + seconds : seconds;
        callback(`${minutes}:${seconds}`);
        if (--timer < 0) clearInterval(interval); //timer = duration;
    }, (timeLenght)? timeLenght: 1000);
}