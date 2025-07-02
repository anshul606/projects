// Dice roll programme

function rollDice(){
    const numOfDice = document.getElementById("number").value;
    const diceResult = document.getElementById("result");
    const diceImages = document.getElementById("images");
    const values = [];
    const images = [];

    for(i = 0; i < numOfDice; i++){
        const value = Math.floor(Math.random() * 6) + 1
        values.push(value);
        images.push(`<img src="images/${value}.png" alt="Dice ${value}">`)
    }

    diceResult.textContent = `Dice : ${values.join(', ')}`
    diceImages.innerHTML = images.join('');
}