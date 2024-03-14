function* fizzbuzz() {
    let number = 1n;

    while(true) {
        if (number % 3n === 0n && number % 5n === 0n) yield 'FizzBuzz';
        else if (number % 3n === 0n) yield 'Fizz';
        else if (number % 5n === 0n) yield 'Buzz';
        else yield number;
        number += 1n;
    }
}

const myFizzBazz = fizzbuzz();

console.log(myFizzBazz.next()); // { value: 1n, done: false }
console.log(myFizzBazz.next()); // { value: 2n, done: false }
console.log(myFizzBazz.next()); // { value: 'Fizz', done: false }
console.log(myFizzBazz.next()); // { value: 4n, done: false }
console.log(myFizzBazz.next()); // { value: 'Buzz', done: false }
