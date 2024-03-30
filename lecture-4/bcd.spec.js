const BCD = require('./');

describe('positive small number less than 7 digits', () => {
    const n = new BCD(65536);

    it('return right value in valueOf()', () => {
        const value = n.valueOf();
        expect(value).toEqual(415030n);
        expect(value.toString(2).padStart(32, '0')).toEqual('00000000000001100101010100110110');
    })

    it('return right value by positive index', () => {
        expect(n.get(0)).toEqual(6);
        expect(n.get(1)).toEqual(5);
        expect(n.get(2)).toEqual(5);
        expect(n.get(3)).toEqual(3);
        expect(n.get(4)).toEqual(6);
        expect(n.get(5)).toEqual(-1);
    })

    it('return right value by negative index', () => {
        expect(n.get(-1)).toEqual(6);
        expect(n.get(-2)).toEqual(3);
        expect(n.get(-3)).toEqual(5);
        expect(n.get(-4)).toEqual(5);
        expect(n.get(-5)).toEqual(6);
        expect(n.get(-6)).toEqual(-1);
    })
})

describe('positive number greater than 7 digits', () => {
    const n = new BCD(12345678);

    it('return right value in valueOf()', () => {
        const value = n.valueOf();

        expect(value).toEqual(305419896n);
        expect(value.toString(2).padStart(32, '0')).toEqual('00010010001101000101011001111000');
    })

    it('return right value in method get with positive index', () => {
        expect(n.get(0)).toEqual(1);
        expect(n.get(1)).toEqual(2);
        expect(n.get(2)).toEqual(3);
        expect(n.get(3)).toEqual(4);
        expect(n.get(4)).toEqual(5);
        expect(n.get(5)).toEqual(6);
        expect(n.get(6)).toEqual(7);
        expect(n.get(7)).toEqual(8);
        expect(n.get(8)).toEqual(-1);
    })

    it('return right value in method get with negative index', () => {
        expect(n.get(-1)).toEqual(8);
        expect(n.get(-2)).toEqual(7);
        expect(n.get(-3)).toEqual(6);
        expect(n.get(-4)).toEqual(5);
        expect(n.get(-5)).toEqual(4);
        expect(n.get(-6)).toEqual(3);
        expect(n.get(-7)).toEqual(2);
        expect(n.get(-8)).toEqual(1);
        expect(n.get(-9)).toEqual(-1);
    })
});

describe('negative number less than 7 digits', () => {
    const n = new BCD(-123);

    it('get right value in valueOf method', () => {
        const value = n.valueOf();

        expect(value).toEqual(2147485814n);
        expect(value.toString(2).padStart(32, '0')).toEqual('10000000000000000000100001110110');
    })

    it('get right value in GET method with positive index', () => {
        expect(n.get(0)).toEqual(1);
        expect(n.get(1)).toEqual(2);
        expect(n.get(2)).toEqual(3);
    })

    it('get right value in GET method with negative index', () => {
        expect(n.get(-1)).toEqual(3);
        expect(n.get(-2)).toEqual(2);
        expect(n.get(-3)).toEqual(1);
    })
});

describe('negative number greater than 7 digits', () => {
    const n = new BCD(-123456789);

    it('get right value in valueOf method', () => {
        const value = n.valueOf();

        expect(value).toEqual(2271560496n);
        expect(value.toString(2).padStart(32, '0')).toEqual('10000111011001010100001100110000');
    })

    it('get right value in GET method with positive index', () => {
        expect(n.get(0)).toEqual(1);
        expect(n.get(1)).toEqual(2);
        expect(n.get(2)).toEqual(3);
        expect(n.get(3)).toEqual(4);
        expect(n.get(4)).toEqual(5);
        expect(n.get(5)).toEqual(6);
        expect(n.get(6)).toEqual(7);
        expect(n.get(7)).toEqual(8);
        expect(n.get(8)).toEqual(9);
        expect(n.get(9)).toEqual(-1);
    })

    it('get right value in GET method with negative index', () => {
        expect(n.get(-1)).toEqual(9);
        expect(n.get(-2)).toEqual(8);
        expect(n.get(-3)).toEqual(7);
        expect(n.get(-4)).toEqual(6);
        expect(n.get(-5)).toEqual(5);
        expect(n.get(-6)).toEqual(4);
        expect(n.get(-7)).toEqual(3);
        expect(n.get(-8)).toEqual(2);
        expect(n.get(-9)).toEqual(1);

    })
});


