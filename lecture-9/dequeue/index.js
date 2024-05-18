class DequeueNode {
    constructor(arrayType, capacity) {
        this.buffer = new arrayType(capacity);
        this.capacity = capacity;
        this.length = 0;
        this.next = null;
        this.prev = null;
    }
}



class Dequeue {
    constructor(arrayType, capacity) {
        this.arrayType = arrayType;
        this.capacity = capacity;
        this.length = 0;
        this.head = new DequeueNode(arrayType, capacity);
        this.tail = this.head;
        this.first = Math.floor(capacity / 2);
        this.last = this.first;
    }

    pushLeft(value) {
        if (this.first === 0) {
            const node = new DequeueNode(this.arrayType, this.capacity);
            this.first = Math.floor(this.capacity / 2);
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }

        if (this.head.length < this.capacity) {
            this.head.buffer[--this.first] = value;
        }
        this.head.length++;
        this.length++;
        return this.length;
    }

    pushRight(value) {
        if (this.last >= this.capacity) {
            const node = new DequeueNode(this.arrayType, this.capacity);
            const temp = this.tail;
            this.tail.next = node;
            node.prev = temp;
            this.tail = node;

            this.last = Math.floor(this.capacity / 2);
        }
        this.tail.buffer[this.last++] = value;
        this.tail.length++;
        this.length++;
        return this.length;
    }

    popLeft() {
        if (this.length === 0) return null;

        if (this.first < Math.floor(this.capacity / 2)) {
            const temp = this.head.buffer[this.first];
            this.head.buffer[this.first] = 0;
            this.head.length--;
            this.first++;

            if (this.head.length === 0) {
                const next = this.head.next;
                this.head = next;
                this.first = 0;
            }

            this.length--;
            return temp;
        }
    }

    popRight() {
        console.log('right', this.last)
        if (this.length === 0) return null;

        const temp = this.tail.buffer[--this.last];
        this.tail.buffer[this.last] = 0;
        this.tail.length--;

        if (this.tail.length === 0) {
            if (this.tail.prev) {
                const prev = this.tail.prev;
                prev.next = null;
                this.tail = prev;
                this.last = this.capacity;
            } else {
                this.tail = null;
                this.head = null;
            }
        }

        this.length--;


        return temp;
    }

}

const dequeue = new Dequeue(Uint8Array, 4);
dequeue.pushLeft(1); // 1
dequeue.pushLeft(2); // 2
dequeue.pushLeft(3); // 3
dequeue.pushLeft(4); // 4
dequeue.popLeft(); // 3
dequeue.popLeft(); // 2
dequeue.popLeft(); // 1
dequeue.popLeft(); // 0
//
dequeue.pushRight(4); // 1
dequeue.pushRight(5); // 2
dequeue.pushRight(6); // 3
dequeue.pushRight(7); // 4
dequeue.pushRight(8); // 5

dequeue.popRight(); // 4
dequeue.popRight(); // 3
dequeue.popRight(); // 2
dequeue.popRight(); // 1
dequeue.popRight(); // 0
console.log(dequeue.head, dequeue.length, dequeue.last);
