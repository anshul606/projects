// Password Generator

function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols){
    
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let allowedChars = "";
    let password = "";

    allowedChars += includeLowercase ? lowercaseChars : "";
    allowedChars += includeUppercase ? uppercaseChars : "";
    allowedChars += includeNumbers ? numbers : "";
    allowedChars += includeSymbols ? symbols : "";
    
    // console.log(allowedChars);
    if(length <= 0){
        return `(password length must be atleast 1)`;
    }
    if(allowedChars.length === 0){
        return `(Atleast one set of characters should be selected)`;
    }

    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
    }

    checkPasswordStrength(password);

    return `${password}`;
}



function passwordbutton(){

    const passwordLength = document.getElementById("length").value;
    const includeLowercase = document.getElementById("Lowercase").checked;
    const includeUppercase = document.getElementById("Uppercase").checked;
    const includeNumbers = document.getElementById("Numbers").checked;
    const includeSymbols = document.getElementById("Symbols").checked;

    const password = generatePassword(passwordLength, 
                                  includeLowercase,
                                  includeUppercase,
                                  includeNumbers, 
                                  includeSymbols);

    const result = document.getElementById("result");
    result.textContent = `Generated password : ${password}`;
}
// console.log(`Generated Password : ${password}`);

const strengthDisplay = document.getElementById('strengthDisplay');
const strengthMeter = document.getElementById('strengthMeter');

function checkPasswordStrength(password) {
    let strength = 0;

    const length = password.length;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (hasUpper) strength += 1;
    if (hasLower) strength += 1;
    if (hasNumber) strength += 1;
    if (hasSymbol) strength += 1;

    // Give bonus point only if it's long enough
    if (length >= 12) strength += 1;

    // Penalize for short length
    if (length < 6) {
        strength = 0;
    } else if (length < 8 && strength > 2) {
        strength = 2;
    }

    // Update display
    let strengthText = '';
    let meterValue = 0;

    switch (strength) {
        case 0:
        case 1:
            strengthText = 'Very Weak';
            meterValue = 20;
            break;
        case 2:
            strengthText = 'Weak';
            meterValue = 40;
            break;
        case 3:
            strengthText = 'Moderate';
            meterValue = 60;
            break;
        case 4:
            strengthText = 'Strong';
            meterValue = 80;
            break;
        case 5:
            strengthText = 'Very Strong';
            meterValue = 100;
            break;
    }

    strengthDisplay.textContent = `Strength : ` + strengthText;
    strengthMeter.value = meterValue;
}
