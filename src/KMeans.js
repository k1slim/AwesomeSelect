import { vectorify, getCentroid, getBoundingBox } from './Vector';
import { compareArrays } from './helpers';

const generateMeansFromClusters = clusters => (
    clusters.map(cluster => (
        cluster.length === 0
            ? null
            : getCentroid(cluster).getComponents()
    ))
);

class KMeans {
    constructor(observations, k = 3) {
        this.observations = observations;
        this.k = k;
        // collection of iteration objects {means: [], clusters: [], variances: []}
        this.iterations = [];
    }

    run() {
        // iterate until generated means converged
        while (this._iterate()) {
            console.log('Iteration ' + this.iterationCount() + ' means');
            console.log(this._lastIteration().means);
            console.log('Iteration ' + this.iterationCount() + ' variances');
            console.log(this._lastIteration().variances);
        }
        return this._lastIteration();
    }

    iterationCount() {
        return this.iterations.length;
    }

    iteration(i) {
        return this.iterations[i];
    }

    _lastIteration() {
        return this.iterations[this.iterations.length - 1];
    }

    _generateClusters(means) {
        // Initialize clusters data structure
        const clusters = [];
        // For each observation, find out which mean is closest to him and put him in a
        // corresponding cluster
        this.observations.forEach((point) => {
            let clusterIndex = 0;

            let minDistance = 0;
            means.forEach((mean, index) => {
                const distance = vectorify(point).getDistanceTo(vectorify(mean));

                if (index === 0) {
                    minDistance = distance;
                }
                if (distance < minDistance) {
                    minDistance = distance;
                    clusterIndex = index;
                }
            });

            if (!clusters[clusterIndex]) {
                clusters[clusterIndex] = [];
            }
            clusters[clusterIndex].push(point);
        });

        return clusters;
    }

    _generateMeansRandomly() {
        const boundaries = getBoundingBox(this.observations);
        const means = [];

        for (let i = 0; i < this.k; i += 1) {
            const mean = [];
            // Generate a random vector component for each dimension
            boundaries.min.each((minComponent, vectorIndex) => {
                const maxComponent = boundaries.max.getComponent(vectorIndex);
                // number between min-max
                const c = minComponent + Math.random() * (maxComponent - minComponent);
                mean.push(c);
            });
            means.push(mean);
        }
        return means;
    }

    _iterate() {
        // 1. Grab some means
        let means;
        if (this.iterations.length === 0) {
            means = this._generateMeansRandomly();
        } else {
            means = generateMeansFromClusters(this._lastIteration().clusters);

            // If some clusters were empty, try generated a null mean
            // In this case, keep mean from last iteration
            for (let i = 0; i < means.length; i += 1) {
                const mean = means[i];
                if (!mean) {
                    means[i] = this._lastIteration().means[i];
                }
            }

            // If means are identical to last iteration, we reached the end
            if (compareArrays(means, this._lastIteration().means)) {
                return false;
            }
        }

        // 2. Form clusters around means
        const clusters = this._generateClusters(means);

        // 3. Get variance for each mean/cluster pair
        const variances = clusters.map((cluster, index) => (
            vectorify(means[index]).getVariance(cluster)
        ));

        this.iterations.push({
            means,
            clusters,
            variances
        });

        return true;
    }
}

export default KMeans;
