/**
 * Copyright 2023 Moxun<mxnstrive@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const pkg = require('./package.json')

const banner = '/*!\n' +
  ` * ${pkg.name} v${pkg.version}\n` +
  ` * (c) 2023 ${pkg.author}\n` +
  ` * Released under the ${pkg.license} License.\n` +
  ' */'

module.exports = {
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'vue-data-dict.js',
    library: 'VueDataDict',
    libraryExport: 'default',
    libraryTarget: 'this',
  },
  externals: {
    'vue': 'Vue',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner,
      raw: true,
      entryOnly: true,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
}
