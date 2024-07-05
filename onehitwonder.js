// Function to simulate a single round of roulette
function playRoulette(betNumber, betAmount) {
    let randomNumber = Math.floor(Math.random() * 37);

    if (randomNumber === betNumber) {
        return betAmount * 36; // Win 36 times the bet amount for a correct guess
    } else {
        return -betAmount; // Lose the entire bet amount for an incorrect guess
    }
}

// Function to calculate the expected value
function calculateExpectedValue(betNumber, betAmount, numberOfSimulations) {
    let totalExpectedValue = 0;

    for (let i = 0; i < numberOfSimulations; i++) {
        let result = playRoulette(betNumber, betAmount);
        // Calculate net gain/loss for this simulation
        let netGain = result - betAmount;
        // Add net gain/loss to total expected value
        totalExpectedValue += netGain;
    }

    // Calculate expected value per game
    let expectedValuePerGame = totalExpectedValue / numberOfSimulations;

    return {
        totalSimulations: numberOfSimulations,
        expectedValuePerGame: expectedValuePerGame
    };
}

// Example usage:
let yourBet = 17; // Change this to the number you want to bet on
let betAmount = 100; // Change this to the amount of money you want to bet on each game
let numberOfSimulations = 10000;
let expectedValueResult = calculateExpectedValue(yourBet, betAmount, numberOfSimulations);

console.log(`Expected value calculation for betting $${betAmount} on number ${yourBet} over ${numberOfSimulations} simulations:`);
console.log(`Expected value per game: $${expectedValueResult.expectedValuePerGame.toFixed(2)}`);
