import Highcharts from 'highcharts';
import Highcharts3d from 'highcharts/highcharts-3d';

Highcharts3d(Highcharts);

export const is3d = () => window.location.search.includes('3d=true');

export const getData = (data = './data.json') => (
    fetch(data)
        .then(response => response.json())
        .catch(err => console.error(err))
);

export const get3DData = (data = './iris.json') => (
    fetch(data)
        .then(response => response.json())
        .then(response => response.map(item => item.slice(0, 3)))
        .catch(err => console.error(err))
);

export const updateChart = (chart, data) => {
    for (let i = data.length - 1; i >= 0; i -= 1) {
        chart.series[i].update(data[i], false);
    }

    chart.redraw();
};

export const drawChart = () => (
    Highcharts.chart('chart-container', {
        chart: {
            type: 'scatter'
        },
        // todo series count and series visibility
        series: [{
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }]
    })
);

export const draw3DChart = () => {
    const chart = Highcharts.chart('chart-container', {
        chart: {
            type: 'scatter3d',
            margin: 100,
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,
                viewDistance: 5,
                fitToPlot: false,
                frame: {
                    bottom: {
                        size: 1,
                        color: 'rgba(0,0,0,0.02)'
                    },
                    back: {
                        size: 1,
                        color: 'rgba(0,0,0,0.04)'
                    },
                    side: {
                        size: 1,
                        color: 'rgba(0,0,0,0.06)'
                    }
                }
            }
        },
        // todo series count and series visibility
        series: [{
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }, {
            data: []
        }]
    });

    (function (H) {
        function dragStart(eStart) {
            eStart = chart.pointer.normalize(eStart);

            var posX = eStart.chartX,
                posY = eStart.chartY,
                alpha = chart.options.chart.options3d.alpha,
                beta = chart.options.chart.options3d.beta,
                sensitivity = 5; // lower is more sensitive

            function drag(e) {
                // Get e.chartX and e.chartY
                e = chart.pointer.normalize(e);

                chart.update({
                    chart: {
                        options3d: {
                            alpha: alpha + (e.chartY - posY) / sensitivity,
                            beta: beta + (posX - e.chartX) / sensitivity
                        }
                    }
                }, undefined, undefined, false);
            }

            chart.unbindDragMouse = H.addEvent(document, 'mousemove', drag);
            chart.unbindDragTouch = H.addEvent(document, 'touchmove', drag);

            H.addEvent(document, 'mouseup', chart.unbindDragMouse);
            H.addEvent(document, 'touchend', chart.unbindDragTouch);
        }

        H.addEvent(chart.container, 'mousedown', dragStart);
        H.addEvent(chart.container, 'touchstart', dragStart);
    }(Highcharts));

    return chart;
};

export const drawIteration = (km, chart, index) => {
    const { clusters, means } = km.iteration(index);
    const chartData = clusters.filter(cluster => cluster).map(cluster => ({ data: cluster }));

    chartData.push({ name: 'Means', data: means.slice(0) });
    chartData.push({ name: 'Initial means', data: km.iteration(0).means.slice(0) });

    document.querySelector('#iteration_count').innerText = `${index}/${km.iterationCount() - 1}`;

    updateChart(chart, chartData);
};

export const stopAnimation = intervalId => clearInterval(intervalId);

export const animate = ({ km, chart }) => {
    let index = 0;

    const intervalId = setInterval(() => {
        index += 1;

        if (index === km.iterationCount()) {
            stopAnimation(intervalId);
            return;
        }

        drawIteration(km, chart, index);
    }, 500);

    return intervalId;
};
