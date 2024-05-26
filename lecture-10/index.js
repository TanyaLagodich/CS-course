class Memory {
    constructor(totalSize, options = {}) {
        this.buffer = new ArrayBuffer(totalSize);
        this.totalSize = totalSize;
        this.stackSize = options.stack ? options.stack : Math.floor(totalSize / 2);
        this.heapSize = options.heap ? options.heap : totalSize - this.stackSize;

        if (this.stackSize + this.heapSize > this.totalSize) {
            throw new Error('Stack and heap sizes exceed total memory size');
        }

        this.stackPointer = null;
        this.heapPointer = null;

        this.allocations = [];
    }

    push(arrayBuffer) {
        const { byteLength } = arrayBuffer;

        if (this.stackPointer && this.stackPointer.size + byteLength > this.stackSize) {
            throw new Error('Stack overflow');
        }

        this.stackPointer = new Pointer(this, this.stackPointer ? this.stackPointer.size + this.stackPointer.offset : 0, byteLength);
        new Uint8Array(this.buffer, this.stackPointer.offset, byteLength).set(new Uint8Array(arrayBuffer));

        this.allocations.push(this.stackPointer);
        return this.stackPointer;
    }

    pop() {
        if (!this.stackPointer) {
            throw new Error('Stack is empty');
        }

        const { offset, size } = this.stackPointer;
        new Uint8Array(this.buffer, offset, size).fill(0);

        const lastPointer = this.allocations.pop();

        if (this.allocations.length === 0) {
            this.stackPointer = null;
        } else {
            this.stackPointer = this.allocations[this.allocations.length - 1];
        }

        return lastPointer;
    }

    alloc(size) {
        if (this.heapPointer && this.heapPointer.size + this.heapPointer.offset + size > this.totalSize) {
            throw new Error("Heap overflow");
        }

        const offset = this.heapPointer ? this.heapPointer.offset + this.heapPointer.size : 0;

        this.heapPointer = new Pointer(this, offset, size);
        return this.heapPointer;
    }
}

// вспомогательный класс для указателя
class Pointer {
    constructor(memory, offset, size) {
        this.memory = memory;
        this.offset = offset;
        this.size = size;
    }

    change(arrayBuffer) {
        const { byteLength } = arrayBuffer;
        if (byteLength > this.size) {
            throw new Error('New data exceeds allocated size');
        }
        new Uint8Array(this.memory.buffer, this.offset, byteLength)
            .set(new Uint8Array(arrayBuffer));
    }

    deref() {
        return new Uint8Array(this.memory.buffer, this.offset, this.size);
    }

    free() {
        new Uint8Array(this.memory.buffer, this.offset, this.size).fill(0);
        this.size = 0;
        this.offset = 0;
    }
}

const buffer1 = new Uint8Array([1, 2, 3, 4]).buffer;
const buffer2 = new Uint8Array([5, 6, 7, 8]).buffer;
const buffer3 = new Uint8Array([9, 10, 11, 12]).buffer;
const buffer4 = new Uint8Array([4, 3, 2, 1]).buffer;


const mem = new Memory(100 * 1024, {stack: 10 * 1024});

const pointer1 = mem.push(buffer1); // Pointer { Memory:{ buffer: [01, 02, 03, 04 ....] ....}, offset: 0, size: 4 }
const pointer2 = mem.push(buffer2); // Pointer { Memory: { buffer: 01, 02, 03, 04, 05, 06, 07, 08....} offset: 4, size: 4 }
const pointer3 = mem.push(buffer3); // Pointer { Memory: { buffer: 01 02 03 04 05 06 07 08 09 0a 0b 0c 0, } offset: 8, size: 4 }
console.log(pointer1.deref()); // Uint8Array(4) [ 1, 2, 3, 4 ]
console.log(pointer2.deref()); // Uint8Array(4) [ 5, 6, 7, 8 ]
console.log(pointer3.deref()); // Uint8Array(4) [ 9, 10, 11, 12 ]


pointer1.change(buffer4);
console.log(pointer1.deref()) // Uint8Array(4) [ 4, 3, 2, 1 ]

console.log(mem.pop()); // Pointer { Memory: { buffer: 04 03 02 01 05 06 07 08 , } offset: 8, size: 4 } Memory уже обновлен
console.log(mem.pop());
console.log({ mem }); // buffer: 04 03 02 01,  stackPointer: Pointer { memory: [Circular *1], offset: 4, size: 4 },

// Куча
const pointer4 = mem.alloc(128);
console.log(pointer4); // memory: <ref *1> Memory {buffer: ArrayBuffer {[Uint8Contents]: <04 03 02 01 ... >}}, offset: 0, size: 128 }
pointer4.change(buffer1);
console.log(pointer4); //  <01 02 03 04 ... > offset: 0 size: 128


const pointer5 = mem.alloc(8); // memory: buffer: 01, 02, 03, 04...., offset: 128, size: 8
const pointer6 = mem.alloc(4); // memory the same, offset: 136, size: 4
const pointer7 = mem.alloc(5 * 1024); // memory the same, offset: 140, size: 5120
console.log(pointer7);

pointer5.free(); // offset: 0, size: 0,
console.log(pointer5);

