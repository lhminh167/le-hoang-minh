var sum_to_n_a = function (n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
        if (sum >= Number.MAX_SAFE_INTEGER) {
            throw new Error("Result exceeds Number.MAX_SAFE_INTEGER");
        }
    }
    return sum;
};

var sum_to_n_b = function (n) {
    const result = (n * (n + 1)) / 2;
    if (result >= Number.MAX_SAFE_INTEGER) {
        throw new Error("Result exceeds Number.MAX_SAFE_INTEGER");
    }
    return result;
};

var sum_to_n_c = function (n, currentSum = 0) {
    if (n === 0) return currentSum;
    const nextSum = currentSum + n;
    if (nextSum >= Number.MAX_SAFE_INTEGER) {
        throw new Error("Result exceeds Number.MAX_SAFE_INTEGER");
    }
    return sum_to_n_c(n - 1, nextSum);
};