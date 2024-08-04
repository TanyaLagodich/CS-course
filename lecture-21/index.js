// Необходимо написать итератор для генерации случайных чисел по заданным параметрам

const random = (min, max) => {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return {
                done: false,
                value: Math.floor(Math.random() * (max - min) + min),
            }
        },
    }
}

const randomInt1 = random(0, 100);

// console.log(randomInt1.next());
// console.log(randomInt1.next());
// console.log(randomInt1.next());
// console.log(randomInt1.next());


// Необходимо написать функцию take, которая принимает любой Iterable объект и возвращает итератор по заданному количеству его элементов

const take = (iterable, limit) => {
    let cursor = 0;
    const iterator = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return {
                next() {
                    const done = cursor >= limit;

                    if (done) {
                        return {
                            value: undefined,
                            done,
                        }
                    }

                    const result = iterator.next();
                    cursor++;

                    return {
                        done: false,
                        value: result.value,
                    }
                }
            };
        },
    }
}

const randomInt2 = random(0, 100);

console.log([...take(randomInt2, 15)]);

// Необходимо написать функцию filter, которая принимает любой Iterable объект и функцию-предикат. И возвращает итератор по элементам которые удовлетворяют предикату.
const filter = (iterable, callback) => {
    const iterator = iterable[Symbol.iterator]();
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    while (true) {
                        const cursor = iterator.next();

                        if (cursor.done) {
                            return {
                                done: true,
                                value: undefined,
                            }
                        }

                        if (callback(cursor.value)) {
                            return {
                                done: false,
                                value: cursor.value,
                            }
                        }
                    }
                }
            }
        }
    }
}

const randomInt3 = random(0, 100);
console.log([...take(filter(randomInt3, (el) => el > 30), 15)]);

// Необходимо написать функцию enumerate, которая принимает любой Iterable объект и возвращает итератор по парам (номер итерации, элемент)
const enumerate = (iterable) => {
    let cursor = 0;
    const iterator = iterable[Symbol.iterator]();
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    const { done, value } = iterator.next();

                    if (done) {
                        return {
                            done,
                            value: undefined,
                        }
                    }

                    return {
                        done: false,
                        value: [cursor++, value],
                    }
                }
            }
        }
    }
}

// const randomInt4 = random(0, 100);
//
// console.log([...take(enumerate(randomInt4), 3)]);


// Необходимо написать класс Range, который бы позволял создавать диапазоны чисел или символов,
// а также позволял обходить элементы Range с любого конца

class Range {
    constructor(min, max) {
        this.range = [];
        this.fillTheRange(min, max);
    }

    fillTheRange(min, max) {
        if (typeof min === 'string' && typeof max === 'string') {
            const diff = max.charCodeAt() - min.charCodeAt(); // 102 - 97 = 5

            for (let i = 0; i <= diff; i++) {
                this.range.push(String.fromCharCode(min.charCodeAt() + i));
            }
        } else if (typeof min === 'number' && typeof max === 'number') {
            const diff = max - min; // 6

            for (let i = 0; i <= diff; i++) {
                this.range.push(min + i);
            }
        } else {
            throw new Error('Unsupported argument types');
        }
    }

    [Symbol.iterator]() {
        const that = this;
        let cursor = 0;
        return {
            next() {
                if (cursor < that.range.length) {
                    return {
                        done: false,
                        value: that.range[cursor++],
                    }
                } else {
                    return {
                        done: true,
                        value: undefined,
                    }
                }
            }
        }
    }

    reverse() {
        const that = this;
        return {
            [Symbol.iterator]() {
                let cursor = that.range.length - 1;
                return {
                    next() {
                        if (cursor >= 0) {
                            return {
                                done: false,
                                value: that.range[cursor--],
                            }
                        } else {
                            return {
                                done: true,
                                value: undefined,
                            }
                        }
                    }
                }
            }
        }
    }
}

const symbolRange = new Range('a', 'f');
console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Range(-5, 1);
console.log(Array.from(numberRange));

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]

// Необходимо написать функцию seq, которая бы принимала множество Iterable объектов и возвращала итератор по их элементам
const seq = (...iterables) => {
    const iteratorOfIterables = iterables[Symbol.iterator]();
    let currentIterator = null;
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    while (true) {
                        if (!currentIterator) {
                            const { value, done } = iteratorOfIterables.next();
                            if (done) {
                                return { done: true, value: undefined };
                            }
                            currentIterator = value[Symbol.iterator]();
                        }

                        const { value, done } = currentIterator.next();
                        if (!done) {
                            return { done: false, value };
                        }
                        currentIterator = null;
                    }
                }
            }
        }
    }
}


console.log([...seq([1, 2], new Set([3, 4]), 'bla')]); // 1, 2, 3, 4, 'b', 'l', 'a'


// Необходимо написать функцию zip, которая бы принимала множество Iterable объектов и
// возвращала итератор по кортежам их элементов

const zip = (...iterables) => {
    const iterators = iterables.map(iterable => iterable[Symbol.iterator]());
    let currentIterator = null;
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    const results = iterators.map(iterator => iterator.next());

                    if (results.some(result => result.done)) {
                        return { done: true, value: undefined };
                    }

                    const values = results.map(result => result.value);
                    return { done: false, value: values };
                }
            }
        }
    }
}
console.log(...zip([1, 2], new Set([3, 4]), 'bl')); // [[1, 3, b], [2, 4, 'l']]

// Необходимо написать функцию, которая принимала бы любой Iterable объект и Iterable с функциями и
// возвращала итератор где каждому элементу левого Iterable последовательно применяются все функции из правого

const mapSeq = (iterable, functions) => {
    return {
        [Symbol.iterator]() {
            const iterator = iterable[Symbol.iterator]();
            const funcs = [...functions];

            return {
                next() {
                    const { value, done } = iterator.next();
                    if (done) {
                        return { done: true, value: undefined };
                    }

                    let result = value;
                    for (const func of funcs) {
                        result = func(result);
                    }

                    return { done: false, value: result };

                }
            }
        }
    }
}

console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5)
