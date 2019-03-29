const {resolve} = require('path');

const CSSModuleLoader = {
    loader: 'css-loader',
    options: {
        modules: true,
        sourceMap: true,
        localIdentName: '[hash:base64:16]',
    },
};

const postCSSLoader = {
    loader: 'postcss-loader',
    options: {
        ident: 'postcss',
        sourceMap: true,
    },
};

module.exports = {
    entry: resolve(__dirname, 'src', 'spoon.ts'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'spoon.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.scss', '.png'],
    },
    module: {
        rules: [
            {
                test: /\.png$/,
                exclude: /node_modules/,
                use: 'url-loader',
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    CSSModuleLoader,
                    postCSSLoader,
                    'sass-loader',
                ],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        useBabel: true,
                        babelCore: '@babel/core',
                    },
                },
            },
        ],
    },
};
