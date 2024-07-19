const Trie = require('./index');

const match = (pattern, strings) => {
    const STATE = Object.freeze({
        INITIAL: 'INITIAL',
        WORD: 'WORD',
        ANY_SYMBOL: 'ANY_SYMBOL',
        END_OF_STRING: 'END_OF_STRING',
    });


    const patterns = pattern.split('.');
    const results = [];

    strings.forEach(string => {
        const substrings = string.split('.');
        let state = STATE.INITIAL;
        let patternIndex = 0;
        let stringIndex = 0;

        while (patternIndex < patterns.length && stringIndex < substrings.length) {
            switch (state) {
                case STATE.INITIAL:
                    if (patterns[patternIndex] === '*') {
                        state = STATE.ANY_SYMBOL;
                    } else if (patterns[patternIndex] === '**') {
                        state = STATE.END_OF_STRING;
                    } else {
                        state = STATE.WORD;
                    }
                    break;

                case STATE.WORD:
                    if (patterns[patternIndex] !== substrings[stringIndex]) return;

                    patternIndex++;
                    stringIndex++;

                    if (patternIndex < patterns.length) {
                        if (patterns[patternIndex] === '*') {
                            state = STATE.ANY_SYMBOL;
                        } else if (patterns[patternIndex] === '**') {
                            state = STATE.END_OF_STRING;
                        }
                    }
                    break;

                case STATE.ANY_SYMBOL:
                    stringIndex++;
                    patternIndex++;

                    if (patternIndex < patterns.length) {
                        if (patterns[patternIndex] === '**') {
                            state = STATE.END_OF_STRING;
                        }
                    }
                    break;

                case STATE.END_OF_STRING:
                    results.push(string);
                    return;

            }
        }
        if (patternIndex === patterns.length && stringIndex === substrings.length) {
            results.push(string);
        }
    });

    return results;

}

console.log(match('hello.*.**', ['hello', 'hello.world', 'hello.my.world', 'hi.world'])) // [ 'hello.my.world' ]
console.log(match('foo.bla.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla'])); // [ 'foo.bla.bar.baz' ]
console.log(match('foo.bag.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla'])); // [ 'foo.bag.bar.ban.bla' ]
console.log(match('foo.*.bar.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla'])); // ['foo.bla.bar.baz', 'foo.bag.bar.ban.bla']
