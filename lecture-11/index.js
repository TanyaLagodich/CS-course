const LinkedList = require('./LinkedList');

class HashMap {
    constructor(capacity) {
        this.buffer = new Array(capacity);
        this.capacity = capacity;

        this.size = 0;
        this.loadFactor = 0.6; // % заполненности буфера для расширения

        this.stringKeyHash = new Map();
        this.objectHashCache = new WeakMap();
    }

    set(key, value) {
        if (this.size / this.capacity >= this.loadFactor) {
            this._resize();
        }

       const hash = this._getHash(key);
       if (this.buffer[hash]) {
           this.buffer[hash].push({ key, value });
       } else {
           this.buffer[hash] = new LinkedList({ key, value });
       }

        this.size++;
    }

    get(key) {
        const hash = this._getHash(key);
        if (this.buffer[hash]) {
            let current = this.buffer[hash].head;
            while (current) {
                if (current.value.key === key) {
                    return current.value.value;
                }
                current = current.next;
            }
        }
        return undefined;
    }

    has(key) {
        const hash = this._getHash(key);
        if (this.buffer[hash]) {
            let current = this.buffer[hash].head;
            while (current) {
                if (current.value.key === key) {
                    return true;
                }
                current = current.next;
            }
        }
        return false;
    }

    delete(key) {
        if (this.has(key)) {
            const hash = this._getHash(key);
            let current = this.buffer[hash].head;
            let index = 0;

            while (current) {
                if (current.value.key === key) {
                    const removed = this.buffer[hash].remove(index);

                    this._removeFromCurrentHash(key);
                    return removed.value.value;
                }
                index++;
                current = current.next;
            }
            this.size--;
        }
        return undefined;
    }

    _resize() {
        const oldBuffer = this.buffer;
        this.capacity *= 2;
        this.buffer = new Array(this.capacity);
        this.size = 0;

        for (const linkedList of oldBuffer) {
            if (linkedList) {
                let current = linkedList.head;

                while (current) {
                    this.set(current.value.key, current.value.value);
                    current = current.next;
                }
            }
        }
    }

    _getHash(key) {
        if (typeof key === 'number') {
            return key % this.capacity;
        }
        if (typeof key === 'string') {
            if (!this.stringKeyHash.has(key)) {
                this.stringKeyHash.set(key, this._getStringHash(key));
            }
            return this.stringKeyHash.get(key);
        }
        if (typeof key === 'object' && key !== null) {
            if (!this.objectHashCache.has(key)) {
                this.objectHashCache.set(key, this._getStringHash(JSON.stringify(key)));
            }
            return this.objectHashCache.get(key);
        }
    }

    _getStringHash(string) {
        let hash = 0;
        const PRIME = 31;
        for (let i = 0; i < string.length; i++) {
            hash = (hash * PRIME + string.charCodeAt(i)) % this.capacity;
        }
        return hash;
    }

    _removeFromCurrentHash(key) {
        if (typeof key === 'string') {
            this.stringKeyHash.delete(key);
        }
    }
}

const document = { id: 1 };
const map = new HashMap(4);
map.set('foo', 1);
map.set(42, 10);
map.set(document, 100);

console.log(map.buffer);
// HashMap {
//   buffer: [
//         <2 empty items>,
//         LinkedList { head: [Node], tail: [Node], length: 1 },
//         <1 empty item>
//   ],
//   capacity: 4,
//   size: 3
//   loadFactor: 0.6
//   stringKeyHash: Map(1) { 'foo' => 54 },
//   objectHashCache: WeakMap { <items unknown> }
// }

console.log(map.get('foo')); // 1
console.log(map.get(42)); // 10

console.log(map.has(document)); // true

// console.log(map.objectHashCache);
console.log(map.delete(document)); // 100
// console.log(map.objectHashCache);
console.log(map.has(document)); // false

console.log(map.delete('foo')); // 1


console.log(map.has(41412)); // false
