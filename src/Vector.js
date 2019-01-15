class Vector {
    constructor(components) {
        if (!components) {
            throw new Error('Must specify at least one component.');
        }

        this.components = components;
    }

    getComponent(index) {
        return this.components[index];
    }

    getComponents() {
        return this.components;
    }

    getDimension() {
        return this.components.length;
    }

    toArray() {
        return this.components;
    }

    each(fn) {
        this.components.forEach(fn);
    }

    map(fn) {
        return new Vector(this.components.map(fn));
    }

    reduce(fn, memo = 0) {
        this.each((c) => {
            memo = fn(c, memo);
        });
        return memo;
    }

    getMagnitude() {
        return Math.sqrt(this.reduce((c, memo) => memo + (c ** 2)));
    }

    getDistanceTo(vector) {
        return this.subtract(vector).getMagnitude();
    }

    getInverse() {
        return this.map(c => c * -1);
    }

    add(vector) {
        if (this.getDimension() !== vector.getDimension()) {
            throw new Error('Cannot add 2 vectors of different dimensions.');
        }

        return this.map((component, index) => component + vector.getComponent(index));
    }

    subtract(vector) {
        return this.add(vector.getInverse());
    }

    multiply(scalar) {
        if (Number.isNaN(scalar)) {
            throw new Error('Should be number');
        }

        return this.map(component => scalar * component);
    }

    divide(scalar) {
        return this.multiply(1 / scalar);
    }

    getVariance(vectors) {
        const sum = vectors.reduce((acc, item) => (
            // eslint-disable-next-line no-use-before-define
            acc + (this.getDistanceTo(vectorify(item)) ** 2)
        ), 0);

        return sum / vectors.length;
    }
}

export const vectorify = (components) => {
    if (typeof components !== 'Vector') {
        return new Vector(components);
    }
    return components;
};

export const getBoundingBox = (vectors) => {
    const minBoundary = [...vectorify(vectors[0]).getComponents()];
    const maxBoundary = [...vectorify(vectors[0]).getComponents()];

    vectors.forEach((vector) => {
        vectorify(vector).each((component, index) => {
            if (component < minBoundary[index]) {
                minBoundary[index] = component;
            }
            if (component > maxBoundary[index]) {
                maxBoundary[index] = component;
            }
        });
    });

    return {
        min: vectorify(minBoundary),
        max: vectorify(maxBoundary)
    };
};

export const getCentroid = (vectors) => {
    let sum = vectorify(vectors[0]);
    vectors.forEach((vector) => {
        sum = sum.add(vectorify(vector));
    });

    return sum.divide(vectors.length);
};
