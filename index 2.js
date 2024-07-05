const crypto = require('crypto');

function casino(bedrag, inzetten) {
    let nummer = crypto.randomInt(0, 37);

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const isRed = redNumbers.includes(nummer);

    const row1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
    const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    const row3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

    let winnings = 0;

    inzetten.forEach(inzet => {
        switch (inzet.type) {
            case 'rood':
                if (isRed) winnings += inzet.bedrag * 2;
                break;
            case 'zwart':
                if (!isRed && nummer !== 0) winnings += inzet.bedrag * 2;
                break;
            case 'even':
                if (nummer !== 0 && nummer % 2 === 0) winnings += inzet.bedrag * 2;
                break;
            case 'oneven':
                if (nummer % 2 !== 0) winnings += inzet.bedrag * 2;
                break;
            case '1-12':
                if (nummer >= 1 && nummer <= 12) winnings += inzet.bedrag * 3;
                break;
            case '13-24':
                if (nummer >= 13 && nummer <= 24) winnings += inzet.bedrag * 3;
                break;
            case '25-36':
                if (nummer >= 25 && nummer <= 36) winnings += inzet.bedrag * 3;
                break;
            case 'rij1':
                if (row1.includes(nummer)) winnings += inzet.bedrag * 3;
                break;
            case 'rij2':
                if (row2.includes(nummer)) winnings += inzet.bedrag * 3;
                break;
            case 'rij3':
                if (row3.includes(nummer)) winnings += inzet.bedrag * 3;
                break;
        }
    });

    winnings -= bedrag;

    return {
        nummer: nummer,
        winnings: winnings
    };
}

// Example usage:
let inzetten = [
    { type: 'rood', bedrag: 10 },
    { type: 'even', bedrag: 5 },
    { type: '1-12', bedrag: 15 },
    { type: 'rij1', bedrag: 20 }
];

let totaalIngezet = inzetten.reduce((acc, inzet) => acc + inzet.bedrag, 0);

let resultaat = casino(totaalIngezet, inzetten);
console.log("Het gedraaide nummer is:", resultaat.nummer);
console.log("Netto gewonnen/verloren bedrag:", resultaat.winnings);
