"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sum = sum;
exports.bound = bound;
exports.timestamp = timestamp;
function sum(a, b) {
    return a + b;
}

function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}