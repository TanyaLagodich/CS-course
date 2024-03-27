const { createMask } = require('./helpers');

const BCD_ENCODING = {
    0: 0b0000,
    1: 0b0001,
    2: 0b0010,
    3: 0b0011,
    4: 0b0100,
    5: 0b0101,
    6: 0b0110,
    7: 0b0111,
    8: 0b1000,
    9: 0b1001,
}

class BCD {
    #BCD_SIZE = 7;
    numbers = [];

    constructor(num) {
        this.length = this._getNumberLength(num);
        this._convertToBCD(num);
    }

    _getNumberLength(num) {
        return Math.floor(Math.log10(Math.abs(num))) + 1;
    }

    _convertToBCD(num) {
        this.numbers.push(0)
        const customLength = this._getNumberLength(num);
        let x = customLength < this.#BCD_SIZE ? num : Math.floor(num / 10 ** (customLength - this.#BCD_SIZE));
        const left = customLength < this.#BCD_SIZE ? 0 : Math.floor(num % 10 ** (customLength - this.#BCD_SIZE))
        let shift = 0;
        while (x > 0) {
            let digit = x % 10;
            x = Math.floor(x / 10);
            this.numbers[this.numbers.length - 1] |= BCD_ENCODING[digit] << (shift  * 4);
            shift++;
        }
        if (left > 0) {
            this._convertToBCD(left);
        }
    }

    valueOf() {
        return BigInt(this.numbers.reduce((acc, num, index) => acc << (4 * index) | num, 0));
    }

    // 0000_0000_0000_0000_0000_0001_0010_0011
    // 1111_0000_0000_0000_0000_0000_0000_0000
    // [00010010001101000101011001110000, 00000000000000000000000000001000]
    get(index) {
        if (index >= this.length) return -1;
        const level = Math.floor(index / this.#BCD_SIZE);
        const space = Math.floor(index % this.#BCD_SIZE);
        const lengthOfLevel = this.length > this.#BCD_SIZE ?
            level < this.numbers.length - 1 ?  this.#BCD_SIZE : Math.floor(this.length % 7)
    : this.length;
        const mask = createMask(4, lengthOfLevel * 4 - (space * 4));
        return (this.numbers[level] & mask) >>> ((Math.abs(lengthOfLevel - space - 1)) * 4);
    }
}
//
const n = new BCD(65536);
console.log(n.valueOf()); // 415030n 0110_0101_0101_0011_0110
console.log(n.get(0), n.get(1), n.get(2), n.get(3), n.get(4), n.get(5)); // 6 5 5 3 6 -1
// console.log(n.get(-1), n.get(-2), n.get(-3), n.get(-4), n.get(-5), n.get(-6)); // 6 3 5 5 6 -1

const short = new BCD(123);
console.log(short.valueOf()); // 291n 0001_0010_0011
console.log(short.get(0), short.get(1), short.get(2), short.get(3)); // 1 2 3 -1
// console.log(short.get(-1), short.get(-2), short.get(-3), short.get(-4)); // 3 2 1 -1

const big = new BCD(12345678);
console.log(big.valueOf(), big.valueOf().toString(2)); // 305419896 10010001101000101011001111000
console.log('big', big.get(0), big.get(1), big.get(2), big.get(3), big.get(4), big.get(5), big.get(6), big.get(7), big.get(8)); // 3 4 5 6 7 8 -1
// console.log('big', big.get(0))


function binary(num) {
    const str = new Uint32Array([num])[0].toString(2);
    return "0b" + str.padStart(32, "0").replace(/(.{4})(?!$)/g, "$1_");
}
// console.log(binary(123));

// 2 << 8 | 9 << 4 | 7 =>

// (~0 << 28 >>> 24)
// ~0 => 1111_1111_1111_1111_1111_1111_1111_1111
// ~0 << 28 => 1111_0000_0000_0000_0000_0000_0000_0000
// ~0 << 28 >>> 24 => 0000_0000_0000_0000_0000_0000_1111_0000
