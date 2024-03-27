const createMask = (len, pos) => {
    let r = ~0;
    r <<= 32 - len;
    r >>>= 32 - pos;
    return r;
}

module.exports = { createMask };
