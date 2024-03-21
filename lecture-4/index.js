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
// 0110_0101_0101_0011_0110
class BCD {

    constructor(num) {
        this.number = num;
    }

    valueOf() {
        let x = this.number;
        let result = 0;
        let shift = 0;
        while (x > 0) {
            let digit = x % 10;
            x = Math.floor(x / 10);
            result += BCD_ENCODING[digit] << (shift * 4);
            shift++;
        }

        return result;
    }

    get(index) {
        const length = Math.floor(Math.log10(this.number)) + 1;
        if (Math.abs(index) >= length) return -1;
        if (index >= 0) {
            const indexFromRight = length - index - 1;
            return Math.floor(this.number / Math.pow(10, indexFromRight)) % 10;
        } else {
            return Math.floor(this.number / Math.pow(10, Math.abs(index))) % 10;
        }
    }
}

const n = new BCD(65536);
console.log(n.valueOf(), n.valueOf().toString(2)); // 415030 1100101010100110110
console.log(n.get(0), n.get(1), n.get(2), n.get(3), n.get(4), n.get(5)); // 6 5 5 3 6 -1
console.log(n.get(-1), n.get(-2), n.get(-3), n.get(-4), n.get(-5)); // 3 5 5 6 -1
