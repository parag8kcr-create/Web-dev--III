const crypto = require("crypto");
const fs = require("fs");

let history = "";

for (let i = 1; i <= 5; i++) {
    const dice = crypto.randomInt(1, 7);

    console.log("Dice Rolled:", dice);

    history += `Dice Rolled: ${dice}\n`;
}

fs.appendFile("dice-history.txt", history, (err) => {
    if (err) {
        console.log("Error saving dice history:", err);
        return;
    }

    console.log("Dice history saved successfully.");
});