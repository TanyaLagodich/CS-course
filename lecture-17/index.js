const getCharIndex = require('./utils/get-char-index');

class TrieNode {
    constructor() {
        this.children = new Array(26).fill(-1);
        this.isEndOfWord = false;
    }
}

class TrieWrapper {
    constructor(trie, index) {
        this.trie = trie;
        this.index = index;
    }

    go(char) {
        const charIndex = getCharIndex(char);
        const nextIndex = this.trie[this.index].children[charIndex];

        if (nextIndex === -1) {
            throw new Error(`The char '${char}' doesn't exist in the trie`);
        }

        return new TrieWrapper(this.trie, nextIndex);
    }

    isWord() {
        return this.trie[this.index].isEndOfWord;
    }
}

class Trie {
    constructor() {
        this.trie = [new TrieNode()];
    }

    addWord(word) {
        let index = 0; // 1

        for (const char of word) { // i
            const charIndex = getCharIndex(char);

            if (this.trie[index].children[charIndex] === -1) {
                this.trie[index].children[charIndex] = this.trie.length;
                this.trie.push(new TrieNode());
            }
            index = this.trie[index].children[charIndex];
        }
        this.trie[index].isEndOfWord = true;
    }

    search(word) {
        let index = 0;

        for (const char of word) {
            const charIndex = getCharIndex(char);

            if (this.trie[index].children[charIndex] === -1) {
                return false;
            }

            index = this.trie[index].children[charIndex];
        }

        return this.trie[index].isEndOfWord;
    }

    go(char) {
        return new TrieWrapper(this.trie, 0).go(char);
    }
}

const trie = new Trie();
trie.addWord('hello');
trie.addWord('hi');

trie.go('h').go('e').go('l').go('l').go('o').isWord(); // true
trie.go('h').go('i').isWord(); // false
// console.log(trie.go('h').go('e').go('e').go('l').go('o').isWord()) // Error: The char 'e' doesn't exist in the trie

module.exports = Trie;

// hello

/* [
    { value: 'h', isEndOfWord: false, children: [1] },
    { value: 'e', isEndOfWord: false, children: [2] },
    { value: 'l', isEndOfWord: false, children: [3] },
    { value: 'l', isEndOfWord: false, children: [4] },
    { value: 'o', isEndOfWord: true, children: [] },
   ]

*/

/*
* [
*   {
*       isEndOfWord: false,
*       children: [-1, -1, -1, -1, -1, -1, -1, 1....]
*   }
*   {
*       isEndOfWord: false,
*       children: [-1, -1, -1, -1, 2, -1, -1, -1, 6],
*   }
*   {
*       isEndOfWord: false,
*       children: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3]
*    }
*    {
*       isEndOfWord: false,
*       children: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4]
*     }
*    {
*       isEndOfWord: false,
*       children: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 4]
*     }
* ]
*
* */
