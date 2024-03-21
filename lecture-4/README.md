# Write a class that represents numbers in BCD 841 format
Digits should be encoded inside JS numbers.
Each number should consist of 7 digits in BCD format for efficient encoding in SMI.

```typescript
class BCD {
    private numbers: number[] = [];
    
    constructor(num: number) {
        // ...
    }
}

const n = new BCD(65536);

console.log(n.valueOf()); // 0b01100101010100110110 or 415030

console.log(n.get(0)); // 6
console.log(n.get(1)); // 5

console.log(n.get(-1)); // 6
console.log(n.get(-2)); // 5

```
## Add support for negative numbers
The algorithm for converting BCD to a negative number is called "complement to 9".

https://www.youtube.com/watch?v=zm4Ni7Kxjxc
```typescript
const n = new BCD(-65536);

console.log(n.get(0)); // 6
console.log(n.get(1)); // 3

console.log(n.isNegative); // true

```
## Add support for addition and subtraction
### Summing numbers in BCD 8421 can be implemented with the following algorithm:

1. First, convert each decimal number into its BCD equivalent. To do this, each digit of the number is translated into a four-bit binary representation. For example, the number 925. In BCD, it would be: 1001 (for 9), 0010 (for 2), and 0101 (for 5).

2. Then, perform a regular binary addition for each pair of BCD numbers, starting with the least significant digit.

3. If the result of the addition does not exceed 9 (in binary form 1001), nothing changes. This is a perfectly correct BCD number.

4. In case the result of the addition exceeds 9, add 6 to the intermediate result (in binary form this is 0110). This is because numbers from 10 to 15 are not used in BCD. Adding 6 provides a shift to the higher digit.

5. If there was a carry-over in the addition, it should also be considered. If the carry-over results in an increase in value in the higher digit to more than 9, then 6 is also added to this digit.

6. Repeat these steps for each subsequent digit until all addition operations are completed.

### More about binary addition:

The algorithm for binary addition using bitwise operators relies on two main operations: bitwise AND (&) and bitwise OR/XOR (^).

Use bitwise XOR (^) to add two numbers. This will give you the sum without considering carry-over bits. Intuitively, if both bits are 1, this leads to a sum of 2, which in binary is 10. But XOR ignores the higher bit in this case and only outputs the lower bit.

Use bitwise AND (&) to determine where there will be carry-over bits. This operation will return 1 only when both bits are 1, which will be the carry-over bits.

Shift the result of the AND operation one digit to the left. This shifts the carry-over bits to where they will be added in the next digit.

Repeat these steps until there are no carry-over bits.

For example, for numbers 12 (1100) and 14 (1110):

Sum without carry-overs: 12 ^ 14 = 2 (0010)
Carry-over bits: 12 & 14 = 12 (1100), shift one digit to the left = 24 (01100)

Sum without carry-overs: 2 ^ 24 = 26 (11010)
Carry-over bits: 2 & 24 = 0 (shift one digit to the left not required, carry-over present)
No carry-over bits, end iteration, final sum 26 (11010).

```typescript
const n = new BCD(10);

console.log(n.add(15)); // 0b00100101 or 37

console.log(n.subtract(10)); // 0b00010000 or 16

console.log(n.subtract(-10)); // 0b00100101 or 37 because minus by minus gives a plus

```
## Add support for multiplication and division
### The multiplication algorithm is expressed through addition.

### The division algorithm for BCD numbers provides for the bitwise division of two BCD numbers similarly to how we do it in decimal arithmetic.

Here's an example of the division algorithm for BCD numbers:

1. Start with the most significant digit (left) of the BCD number.

2. Check if the digit of the divisor is greater or equal to the divisor. If so, subtract the divisor from the current digit of the dividend and record the result, also increment the current quotient value by one.

3. If the current digit of the divisor is less than the divisor, we simply record it in the result and move to the next digit of the dividend; in this case, the quotient value remains unchanged.

4. After we have processed the current digit of the dividend, we move to the next digit to the right and repeat the process, starting from step 2, until all digits of the dividend are processed.

```typescript
const n = new BCD(10);

console.log(n.multiply(2)); // 0b00100000 or 32
console.log(n.divide(2));   // 0b00010000 or 16

```
