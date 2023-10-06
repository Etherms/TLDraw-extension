import * as CopyPlugin from 'copy-webpack-plugin'
import * as path from 'path'
import { Configuration } from 'webpack'

const webpackConfig: Configuration = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', 
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/icons', to: 'icons' },
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/index.html', to: 'index.html' },
        { from: 'src/bundle.js', to: 'bundle.js' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
}

export default webpackConfig
