// Part A
function calculateBMI(mass, height) {
    return mass / (height * height);
}

const lucas = {
    mass: 78,
    height: 1.69,
};
const peter = {
    mass: 92,
    height: 1.95,
};

lucas.bmi = calculateBMI(lucas.mass, lucas.height);
peter.bmi = calculateBMI(peter.mass, peter.height);

const lucasHigherOrEqualBMI = lucas.bmi >= peter.bmi;

const messageA = `The BMI of Peter is ${peter.bmi}. The BMI of Lucas is ${lucas.bmi}. Peter's BMI is higher than Lucas's BMI: ${!lucasHigherOrEqualBMI}`;
console.log(messageA);
document.getElementById('a').textContent = messageA;

// Part B
const tempC = 24;
const messageB1 = `${tempC}\u00B0C is ${(9/5 * tempC) + 32}\u00B0F`;
console.log(messageB1);
const tempF = 66;
const messageB2 = `${tempF}\u00B0F is ${(5/9) * (tempF-32)}\u00B0C`
console.log(messageB2);
document.getElementById('b').innerHTML = [messageB1, messageB2].join('<br>');

// Part C
let bmiComparison;
if (lucas.bmi === peter.bmi) {
    bmiComparison = 'equal to';
}
else if (lucas.bmi > peter.bmi) {
    bmiComparison = 'greater than';
}
else {
    bmiComparison = 'less than';
} 
const messageC = `Lucas's BMI (${lucas.bmi.toFixed(2)}) is ${bmiComparison} Peter's (${peter.bmi.toFixed(2)})!`;
console.log(messageC);
document.getElementById('c').textContent = messageC;

// Part D
const convertCelsiusToFahrenheit = (tempC) => {
    const tempF = (9/5 * tempC) + 32;
    const message = `${tempC}\u00B0C is ${tempF}\u00B0F`
    console.log(message);
    document.getElementById('d').innerHTML += message + '<br>';
};
convertCelsiusToFahrenheit(100);
convertCelsiusToFahrenheit(0);
convertCelsiusToFahrenheit(10);

const convertFahrenheitToCelsius = (tempF) => {
    const tempC = (5/9) * (tempF-32);
    const message = `${tempF}\u00B0F is ${tempC}\u00B0C`;
    console.log(message);
    document.getElementById('d').innerHTML += message + '<br>';
};
convertFahrenheitToCelsius(32);
convertFahrenheitToCelsius(10);
convertFahrenheitToCelsius(102);