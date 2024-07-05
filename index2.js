const crypto = require('node:crypto');

function casino(bedrag, nummers, evenOnEven, roodZwart, thirdBet) {
    let nummer = Math.floor(Math.random() * 37); // crypto.randomInt(0, 37);

    // Define the red numbers in roulette
    const redNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];

    // Check if the random number is red (true/false)
    let isRed = redNumbers.includes(nummer);

    // Initialize winnings to zero
    let winnings = 0;

    // Check for number bet
    if (nummers?.length) {
        for (let i = 0; i < nummers.length; i++) {
            let nummers1 = nummers[i];
            if (nummers1.nummers.includes(nummer)) {
                // Calculate the winnings for this number bet
                winnings += nummers1.bedrag * (36 / nummers1.nummers.length);
            }
        }
    }

    // Check for even/odd bet
    if (evenOnEven !== undefined && nummer !== 0) {
        if ((evenOnEven === 'even' && nummer % 2 === 0) || (evenOnEven === 'odd' && nummer % 2 !== 0)) {
            // Payout for even/odd bet is 1:1
            winnings += bedrag * 2;
        }
    }

    // Check for red/black bet
    if (roodZwart !== undefined) {
        if ((roodZwart === 'red' && isRed) || (roodZwart === 'black' && !isRed && nummer !== 0)) {
            // Payout for red/black bet is 1:1
            winnings += bedrag * 2;
        }
    }

    // Define third bets (dozens)
    let thirdBets = [[1, 12], [13, 24], [25, 36]];

    // Check for third bet (dozens)
    if (thirdBet !== undefined) {
        let chosenThirdBet = thirdBets[thirdBet];
        if (nummer >= chosenThirdBet[0] && nummer <= chosenThirdBet[1]) {
            // Payout for third bet is 2:1
            winnings += bedrag * 3;
        }
    }

    // Subtract the initial bet amount since it is spent in the game
    winnings -= bedrag;

    return winnings;
}

let alleDingen = []

let totaalOvergeslagen = 0;

let totaalEvenOnEvenGewonnen = 0;
let totaalEvenOnEvenVerloren = 0;
let totaalThirdBetGewonnen = 0;
let totaalThirdBetVerloren = 0;
let totaalNummersGewonnen = 0;
let totaalNummersVerloren = 0;

for (let j = 0; j < 100000; j++) {
    let maxRounds = 999; // deelbaar door 3 want betting strategy heeft 3 stappen
    let eersteBedrag = 4;
    let saldo = 1000;
    let overslaan = 0;

    // ------
    let laatsteUitslag = 0;
    let bedragOver = saldo;
    // ------

    let laatsteOpties = [];

    for (let i = 0; i < maxRounds; i++) {
        if(overslaan > 0) {
            overslaan -= 1;
            totaalOvergeslagen += 1;
            // console.log('overgeslagen')
            continue;
        }
        let bedragomInTeLeggen = 2;
        let nummers = []; // [{ bedrag: 1, nummers: [0,1,2,3,4,5,...]}]
        let evenOnEven = undefined; // even / odd
        let roodZwart = undefined; // red / black
        let eenDerde = undefined; // 0 / 1 / 2
        // ----------------

        if (i === 0) {
            evenOnEven = 'even';
            bedragomInTeLeggen = 4;
        }

        if (i !== 0) {
            if (laatsteUitslag > 0 || laatsteOpties.includes('nummers')) {
                bedragomInTeLeggen = 4;
                evenOnEven = 'even';
            } else {
                if (laatsteOpties.includes('eenDerde')) {
                    nummers = [
                        { bedrag: 1, nummers: [1, 2, 3, 4] },
                        { bedrag: 1, nummers: [5, 6, 7, 8] }
                    ];
                } else {
                    eenDerde = 0;
                    bedragomInTeLeggen = 3;
                }
            }
        }

        // ----------------

        laatsteOpties = [];
        if (nummers.length) laatsteOpties.push('nummers');
        if (evenOnEven) laatsteOpties.push('evenOnEven');
        if (roodZwart) laatsteOpties.push('roodZwart');
        if (eenDerde !== undefined) laatsteOpties.push('eenDerde');

        let gewonnen = casino(bedragomInTeLeggen, nummers, evenOnEven, roodZwart, eenDerde);
        bedragOver += gewonnen;
        laatsteUitslag = gewonnen;
        if(gewonnen > 0 && laatsteOpties.includes('evenOnEven')) overslaan = 2;
        else if(gewonnen > 0 && laatsteOpties.includes('eenDerde')) overslaan = 1;

        if(gewonnen > 0) {
            if(laatsteOpties.includes('nummers')) totaalNummersGewonnen += 1;
            else if(laatsteOpties.includes('evenOnEven')) totaalEvenOnEvenGewonnen += 1;
            else if(laatsteOpties.includes('eenDerde')) totaalThirdBetGewonnen += 1;
        }
        if(gewonnen < 0) {
            if(laatsteOpties.includes('nummers')) totaalNummersVerloren += 1;
            else if(laatsteOpties.includes('evenOnEven')) totaalEvenOnEvenVerloren += 1;
            else if(laatsteOpties.includes('eenDerde')) totaalThirdBetVerloren += 1;
        }
        // console.log(`Ronde: ${i}, Gewonnen: ${gewonnen}, Bedrag Over: ${bedragOver}, Overslaan: ${overslaan}`)
    }

    alleDingen.push(bedragOver);
}

console.log(alleDingen, gemiddelde(alleDingen), alleDingen.length, alleDingen.filter(x => x > 1000).length, alleDingen.filter(x => x < 1000).length, totaalOvergeslagen / 999);
console.log(totaalNummersGewonnen / (totaalNummersGewonnen + totaalNummersVerloren), totaalEvenOnEvenGewonnen / (totaalEvenOnEvenGewonnen + totaalEvenOnEvenVerloren), totaalThirdBetGewonnen / (totaalThirdBetGewonnen + totaalThirdBetVerloren))

function gemiddelde(numbers) {
    if (numbers.length === 0) return 0;

    let sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}
