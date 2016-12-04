var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'client', 'bin');
var APP_DIR = path.resolve(__dirname, 'client', 'src');

var TRAVIS = process.env.TRAVIS ? JSON.parse(process.env.TRAVIS) : false;
var plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
];

if (TRAVIS) {
    console.log('TRAVIS mode (will fail on error)');
    plugins.push(new webpack.NoErrorsPlugin());
}

var config = {
    bail: TRAVIS,
    resolve: {
        alias: {
            jquery: path.join(APP_DIR, 'lib', 'jquery-3.1.1.min.js'),
            auth: path.join(APP_DIR, 'lib', 'auth.jsx')
        }
    },
    entry: path.join(APP_DIR, 'app.jsx'),
    plugins: plugins,
    output: {
        path: BUILD_DIR,
        filename: path.join('js', 'app.js'),
        publicPath: '/'
    },
    module : {
        loaders : [
            {
                test : /\.jsx/,
                include : APP_DIR,
                //exclude: path.join(APP_DIR, 'lib'),
                loader : 'babel'
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
                include: path.join(APP_DIR, 'css')
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file?name=./fonts/[name].[ext]',
                include : APP_DIR
            }
        ],
    }

};

module.exports = config;
