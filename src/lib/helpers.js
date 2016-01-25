export function sum(a, b){
	return a+b;
}

export function bound(x, min, max) {
    return Math.max(min, Math.min(max, x));
}

export function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

