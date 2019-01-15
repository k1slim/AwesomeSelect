const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        src: path.join(__dirname, 'demo/index.js')
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};
