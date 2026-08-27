const operation = process.argv[2];
const num1 = Number(process.argv[3]);
const num2 = Number(process.argv[4]);

const green = "\x1b[32m";
const red = "\x1b[31m";
const yellow = "\x1b[33m";
const reset = "\x1b[0m";

if (operation === "add") {
    console.log(green + "Result: " + (num1 + num2) + reset);
}
else if (operation === "subtract") {
    console.log(green + "Result: " + (num1 - num2) + reset);
}
else if (operation === "multiply") {
    console.log(green + "Result: " + (num1 * num2) + reset);
}
else if (operation === "modulus") {
    console.log(green + "Result: " + (num1 % num2) + reset);
}
else if (operation === "divide") {
    if (num2 === 0) {
        console.log(red + "Cannot divide by zero" + reset);
    } else {
        console.log(green + "Result: " + (num1 / num2) + reset);
    }
}
else {
    console.log(yellow + "Invalid operation" + reset);
}