const textbox = document.getElementById("textbox"); 
const toFahrenheit = document.getElementById("toFahrenheit"); 
const toCelcius = document.getElementById("toCelcius"); 
const result = document.getElementById("result");



function convert(){

    let temp = Number(textbox.value);

        if(toFahrenheit.checked){
            temp = (temp * (9/5)) + 32;
            result.textContent = temp.toFixed(1) + " ℉";
        }
        else if(toCelcius.checked){
            temp = (temp - 32) * 5/9;
            result.textContent = temp.toFixed(1) + " ℃"
        }
        else{
            result.textContent = "Select a Unit";
        }
    

}

function reload(){
    location.reload()
    // console.log(location.port);
}