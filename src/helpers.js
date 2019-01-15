export const compareArrays = (a, b) => {
    // if the other array is a falsy value, return
    if (!a) {
        return false;
    }

    // compare lengths - can save a lot of time
    if (b.length !== a.length) {
        return false;
    }

    for (let i = 0, l = b.length; i < l; i += 1) {
        // Check if we have nested arrays
        if (b[i] instanceof Array && a[i] instanceof Array) {
            // recurse into the nested arrays
            if (!compareArrays(a[i], b[i])) {
                return false;
            }
        } else if (b[i] !== a[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }

    return true;
};

export default compareArrays;
