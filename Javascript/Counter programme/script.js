let count = 0;

document.getElementById("decrease").onclick = function(){
    count = count - 1;
    document.getElementById("counter").textContent = count;
}
document.getElementById("increase").onclick = function(){
    count = count + 1;
    document.getElementById("counter").textContent = count;
}
document.getElementById("reset").onclick = function(){
    count = 0;
    document.getElementById("counter").textContent = count;
}


