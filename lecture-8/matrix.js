class Matrix {
    constructor(typeArrayConstructor, ...dimensions) {
        const totalLength = dimensions.reduce((acc, num) => acc * num, 1);
        this.dimensions = dimensions;
        this.array = new typeArrayConstructor(totalLength);
    }

    #getIndex(...indexes) {
        let index = 0;
        let product = 1;
        for (let i = this.dimensions.length - 1; i >= 0; i--) {
            index += indexes[i] * product;
            product *= this.dimensions[i];
        }
        return index;
    }

    set(...args) {
        const value = args[args.length - 1];
        const indexes = args.slice(0, args.length - 1);
        this.array[this.#getIndex(...indexes)] = value;

    }

    get(...indexes) {
        return this.array[this.#getIndex(...indexes)];
    }

    *values() {
        for (let i = 0; i < this.array.length; i++) {
            yield this.array[i];
        }
    }

    [Symbol.iterator]() {
        return this.values();
    }

    get buffer() {
        return this.array;
    }

}

const matrix3n4n5 = new Matrix(Int32Array, 2, 2, 2);
matrix3n4n5.set(0, 0, 0, 1);
matrix3n4n5.set(0, 1, 0, 2);
matrix3n4n5.set(0, 0, 1, 3);
matrix3n4n5.set(0, 1, 1, 4);

matrix3n4n5.set(1, 0, 0, 5);
matrix3n4n5.set(1, 1, 0, 6);
matrix3n4n5.set(1, 0, 1, 7);
matrix3n4n5.set(1, 1, 1, 8);
console.log(matrix3n4n5.buffer); // [1, 3, 2, 4,5, 7, 6, 8]


console.log(matrix3n4n5.get(0, 0, 0)); // 1
console.log(matrix3n4n5.get(0, 1, 0)); // 2
console.log(matrix3n4n5.get(0, 0, 1)); // 3
console.log(matrix3n4n5.get(0, 1, 1)); // 4

console.log(matrix3n4n5.get(1, 0, 0)); // 5
console.log(matrix3n4n5.get(1, 1, 0)); // 6
console.log(matrix3n4n5.get(1, 0, 1)); // 7
console.log(matrix3n4n5.get(1, 1, 1)); // 8


console.log(Array.from(matrix3n4n5.values())); // [1, 3, 2, 4, 5, 7, 6, 8]

