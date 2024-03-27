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
        // это чтобы класть в this.numbers числа по порядке слева направо
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
        if (index < 0) {
            index = this.length + index;
        }
        if (index >= this.length || index < 0) return -1;
        const level = Math.floor(index / this.#BCD_SIZE);
        const space = Math.floor(index % this.#BCD_SIZE);
        // считаем длину числа, к-ая должна быть у числа именно по этому индексу
        // если level не последний, значит там длина макс - 7
        // если последний, то считает this.length % 7
        const lengthOfLevel = this.length > this.#BCD_SIZE ?
            level < this.numbers.length - 1 ?  this.#BCD_SIZE : Math.floor(this.length % 7)
    : this.length;
        const mask = createMask(4, lengthOfLevel * 4 - (space * 4));
        return (this.numbers[level] & mask) >>> ((Math.abs(lengthOfLevel - space - 1)) * 4);
    }
}

const n = new BCD(65536);
console.log(n.valueOf(), n.valueOf().toString(2).padStart(32, '0')); // 415030n 00000000000001100101010100110110
console.log(n.get(0), n.get(1), n.get(2), n.get(3), n.get(4), n.get(5)); // 6 5 5 3 6 -1
console.log(n.get(-1), n.get(-2), n.get(-3), n.get(-4), n.get(-5), n.get(-6)); // 6 3 5 5 6 -1

const short = new BCD(123);
console.log(short.valueOf(), short.valueOf().toString(2).padStart(32, '0')); // 291n 00000000000000000000000100100011
console.log(short.get(0), short.get(1), short.get(2), short.get(3)); // 1 2 3 -1
console.log(short.get(-1), short.get(-2), short.get(-3), short.get(-4)); // 3 2 1 -1

const big = new BCD(12345678);
console.log(big.valueOf(), big.valueOf().toString(2).padStart(32, '0')); // 305419896n 00010010001101000101011001111000
console.log('big', big.get(0), big.get(1), big.get(2), big.get(3), big.get(4), big.get(5), big.get(6), big.get(7), big.get(8)); // 1 2 3 4 5 6 7 8 -1
console.log('big', big.get(-1), big.get(-2), big.get(-3), big.get(-4), big.get(-5), big.get(-6), big.get(-7), big.get(-8), big.get(-9)); // 8 7 6 5 4 3 2 1 -1

