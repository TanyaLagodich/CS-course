class BinaryHeap {
    #lastIndex = -1;
    #buffer = [];

    constructor(comparator) {
        this.comparator = comparator;
    }

    get head() {
        return this.#buffer[0];
    }

    get size() {
        return this.#lastIndex + 1;
    }

    get buffer() {
        return this.#buffer.slice(0, this.#lastIndex + 1);
    }

    push(value) {
        this.#lastIndex++;
        this.#buffer[this.#lastIndex] = value;
        this.#fromBottom();
    }

    pop() {
        const head = this.head;

        if (this.#lastIndex > 0) {
            this.#buffer[0] = this.#buffer[this.#lastIndex];
            this.#buffer[this.#lastIndex] = undefined;
            this.#lastIndex--;
            this.#toBottom();
        } else {
            this.#buffer[0] = undefined;
            this.#lastIndex = -1;
        }

        return head;
    }

    #fromBottom() {
        const value = this.#buffer[this.#lastIndex]; // 10

        let cursor = this.#lastIndex; // 1

        while (cursor > 0) {
            const parentIndex = this.#getParentIndex(cursor);
            const parent = this.#buffer[parentIndex]; // 1

            if (this.comparator(value, parent) <= 0) break; // 10 - 0 <= 0 ? false

            this.#buffer[cursor] = parent;
            cursor = parentIndex;
        }

        this.#buffer[cursor] = value;
    }

    #toBottom() { // [9, 3, 2, 5, 6, 8, 4, 10, 7, undefined]
        const value = this.#buffer[0]; // 9

        let cursor = 0;
        let leftIndex = this.#getLeftIndex(cursor); // 1
        let rightIndex = this.#getRightIndex(cursor); // 2

        while (leftIndex <= this.#lastIndex) {  // 1 <= 8
            let childIndex;

            const left = this.#buffer[leftIndex]; // 3
            const right = this.#buffer[rightIndex]; // 2

            if (right === undefined) {
                childIndex = leftIndex;
            } else {
                childIndex = this.comparator(left, right) > 0 ? leftIndex : rightIndex; // 1
            }

            const child = this.#buffer[childIndex]; // 3
            if (this.comparator(value, child) >= 0) break;

            this.#buffer[cursor] = child;
            cursor = childIndex;

            leftIndex = this.#getLeftIndex(cursor);
            rightIndex = this.#getRightIndex(cursor);
        }

        this.#buffer[cursor] = value;
    }


    #getLeftIndex(current) {
        return current * 2 + 1;
    }

    #getRightIndex(current) {
        return current * 2 + 2;
    }
    #getParentIndex (current) {
        return Math.floor((current - 1) / 2);
    }
}

const queue = new BinaryHeap((a, b) => b - a);
queue.push(1);
queue.push(10);
queue.push(2);
queue.push(9);
queue.push(3);
queue.push(8);
queue.push(4);
queue.push(7);
queue.push(5);
queue.push(6);

console.log(queue.buffer); // [ 1, 3, 2, 5, 6, 8, 4, 10, 7, 9 ]

// Сортировка in-place, но на binaryHeap выделяется доп место
const sort = (arr) => {
    const binaryHeap = new BinaryHeap((a, b) => a - b);

    for (let i = 0; i < arr.length; i++) {
        binaryHeap.push(arr[i]);
    }

    let i = arr.length - 1;

    while (binaryHeap.size && i >= 0) {
        arr[i] = binaryHeap.pop();
        i--;
    }

    return arr;
}

const heapSort = (arr) => { // [1, 10, 2, 9, 3, 8, 4, 7, 5, 6]
    const heapify = (arr, length, i) => {
        let largest = i;
        let left = i * 2 + 1;
        let right = i * 2 + 2;

        if (left < length && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < length && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            const swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            heapify(arr, length, largest);
        }
    }

    const buildHeap = (arr) => { // [1, 10, 2, 9, 3, 8, 4, 7, 5, 6] length = 10
        const start = Math.floor(arr.length / 2) - 1; // 4
        const length = arr.length

        for (let i = start; i >= 0; i--) { // 3
            heapify(arr, length, i);
        }

        for (let i = length - 1; i > 0; i--) {
            const temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            heapify(arr, i, 0)
        }
    }

    buildHeap(arr);

    return arr;
}

console.log(heapSort([4, 10, 3, 5, 1])); // [ 1, 3, 4, 5, 10 ]

console.log(heapSort([4, 10, 6, 3, 4, 9, 111, 3, 5, 1])); // [  1, 3, 3,  4,   4, 5, 6, 9, 10, 111]
