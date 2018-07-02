// Utility functions

// perform element-wise operations on two vertices
function vertF(u, v, f) {
    if (u.length !== v.length) {
        console.log('err: vert lengths differ');
    }

    let ans = [];

    for (let i = 0; i < Math.min(u.length, v.length); i++) {
        ans.push(f(u[i], v[i]));
    }

    return ans;
}

// add two vertices
function vertAdd(u, v) {
    return vertF(u, v, (u_, v_) => u_ + v_);
}

// subtract two vertices
function vertSub(u, v) {
    return vertF(u, v, (u_, v_) => u_ - v_);
}

// euclidean distance between 2 vertices
function euclideanDist(u, v) {
    return Math.sqrt(vertSub(u, v).map(x => Math.pow(x, 2)).reduce((a, v) => a + v));
}

// gen random integer (min and max inclusive)
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
