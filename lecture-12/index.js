const binarySearch = (arr, compareFn, findFirst = true) => {
    if (arr.length === 0) return -1;

    let left = 0;
    let right = arr.length - 1;

    let result = -1;

    while (right >= left) {
        const middle = Math.floor((right + left) / 2);
        const target = compareFn(arr[middle]);


        if (target === 0) {
            result = middle;
            if (findFirst) right = middle - 1;
            else left = middle + 1;
        } else if (target < 0) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return result;
}

const indexOf = (arr, compareFn) => binarySearch(arr, compareFn, true);

const lastIndexOf = (arr, compareFn) => binarySearch(arr, compareFn, false);

const arr = [
    {age: 12, name: 'Bob'},
    {age: 42, name: 'Ben'},
    {age: 42, name: 'Jack'},
    {age: 42, name: 'Sam'},
    {age: 56, name: 'Bill'},
];

console.log(indexOf(arr, ({age}) => age - 42)); // 1
console.log(indexOf(arr, ({age}) => age - 12)); // 0
console.log(indexOf(arr, ({age}) => age - 56)); // 4
console.log(indexOf(arr, ({age}) => age - 57)); // -1

console.log(lastIndexOf(arr, ({age}) => age - 42)); // 3
console.log(lastIndexOf(arr, ({age}) => age - 12)); // 0
console.log(lastIndexOf(arr, ({age}) => age - 56)); // 4
console.log(lastIndexOf(arr, ({age}) => age - 57)); // -1
