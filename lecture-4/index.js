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

// 123456789 -> 876543210
// 1000_0111_0110_0101_0100_0011_0010_0001_0000

class BCD {
    #BCD_SIZE = 7;
    MASK = 0b1111 << 28;
    numbers = [];
    isNegative = false;

    constructor(num) {
        if (num < 0) {
            this.isNegative = true;
            this.numbers.push(0);
            this.numbers[0] |= 1 << 31;
            num = this._applyNineComplement(Math.abs(num));

        } else {
            this.numbers.push(0);
            this.numbers[0] |= 0 << 31;
        }
        this.length = this._getNumberLength(num);
        this._convertToBCD(num);
    }

    _getNumberLength(num) {
        return Math.floor(Math.log10(Math.abs(num))) + 1;
    }

    _applyNineComplement(num) {
        let result = 0;
        let x = num;
        let place = 1;
        while (x > 0) {
            let digit = x % 10;
            x = Math.floor(x / 10);
            result += (9 - digit) * place;
            place *= 10;
        }

        return result;
    }

    _convertToBCD(num) {
        const customLength = this._getNumberLength(num);
        // это чтобы класть в this.numbers числа по порядку слева направо
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
            this.numbers.push(0);
            this._convertToBCD(left);
        }
    }

    isNegativeBCD() {
        const mask = 0b1111 << 28;
        return (this.numbers[0] & mask) !== 0;
    }

    valueOf() {
        // 0x0FFFFFFF === 0000 1111 1111 1111 1111 1111 1111 1111
        // Инициализируем acc как BigInt для корректной обработки больших чисел
        let acc = BigInt(0);

        // Преобразуем каждое число в BigInt и выполняем операции
        this.numbers.forEach((num, index) => {
            acc = (acc << (BigInt(4) * BigInt(index))) | (BigInt(num) & BigInt(0x0FFFFFFF));
        });

        if (this.isNegativeBCD()) {
            // Если число отрицательное, нужно добавить бит знака в начало
            // Важно: в JavaScript операция сдвига на BigInt ограничена 31 битом, так что используем умножение
            acc = ((BigInt(1) << BigInt(31)) | acc);
        }

        return acc;
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
        const num = (this.numbers[level] & mask) >>> ((Math.abs(lengthOfLevel - space - 1)) * 4);

        return this.isNegative ? 9 - num : num;
    }
}

module.exports = BCD;

const negative = new BCD(-123);
console.log(negative.valueOf(), negative.valueOf().toString(2).padStart(32,'0')); // 2147485814n 10000000000000000000100001110110
console.log(negative.get(-1), negative.get(1), negative.get(2), negative.get(9))
