import KMeans from '../src/kmeans';
import {
    animate,
    draw3DChart, drawChart,
    get3DData,
    getData,
    is3d,
    stopAnimation
} from './demoHelpers';

let chart = null;
let intervalId = null;

const run = (data, k) => {
    const km = new KMeans(data, k);
    km.run();
    // TODO: destroy chart if exist
    chart = is3d() ? draw3DChart() : drawChart();

    intervalId = animate({
        km,
        chart
    });
};

const initializeSelectHandler = (data) => {
    document.querySelector('#k-value-select')
        .addEventListener('change', (event) => {
            stopAnimation(intervalId);
            run(data, parseInt(event.target.value, 10));
        });
};

const initialize = (data) => {
    const k = 3;

    initializeSelectHandler([...data]);
    run(data, k);
};

document.addEventListener('DOMContentLoaded', () => {
    const dataPromise = is3d() ? get3DData() : getData();

    return dataPromise.then(initialize);
});
