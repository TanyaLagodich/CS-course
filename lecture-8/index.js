class Vector {
    constructor(typeArrayConstructor, options = { capacity: 2 }) {
        this.vector = new typeArrayConstructor(options.capacity);
        this.options = options;
        this.length = 0;
    }

    push(value) {
        if (this.length === this.capacity) {
            this.capacity *= 2;

            const temp = this.vector;
            this.vector = new this.vector.constructor(this.capacity);
            this.vector.set(temp);
        }
        this.vector[this.length] = value;
        this.length++;
        return this.length;
    }

    pop() {
        const lastElement = this.vector[this.length - 1];
        this.vector[this.length - 1] = 0;
        this.length--;
        return lastElement;
    }

    shrinkToFit(capacity) {
        if (this.capacity === capacity || this.capacity < capacity) return;

        const temp = this.vector;

        this.capacity = capacity;
        this.vector = new this.vector.constructor(capacity);
        this.vector.set(temp.slice(0, capacity));
        this.length = this.length - (this.length - capacity);
        return this.capacity;
    }

    get buffer() {
        return this.vector;
    }

    get capacity() {
        return this.options.capacity;
    }

    set capacity(value) {
        this.options.capacity = value;
    }

}


const vec = new Vector(Int32Array, {capacity: 4});

console.log(vec.push(1)); // Возвращает длину - 1
console.log(vec.push(2)); // 2
console.log(vec.push(3)); // 3
console.log(vec.push(4)); // 4
console.log(vec.push(5)); // 5
console.log(vec.pop()); // 5
console.log(vec.shrinkToFit(4)); // 4
console.log(vec.buffer); // Int32Array(4) [ 1, 2, 3, 4 ]
console.log(vec.capacity); // 4

