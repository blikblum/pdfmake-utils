'use strict'

const del = require('del')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const pkg = require('../package.json')

let promise = Promise.resolve()

let dependencies = Object.assign({}, pkg.dependencies || {}, pkg.peerDependencies || {})

// Clean up the output directory
promise = promise.then(() => del(['dist/*']))

const outputName = pkg.name

const exportName = pkg.name

const formats = ['es']

// Compile source code into a distributable format with Babel
formats.forEach((format) => {
  promise = promise.then(() => rollup.rollup({
    input: 'src/index.js',
    external: Object.keys(dependencies),
    plugins: [babel({
      exclude: 'node_modules/**'
    })]
  }).then(bundle => bundle.write({
    file: `dist/${format === 'es' ? outputName : outputName + '.umd'}.js`,
    format,
    sourcemap: true,
    name: format === 'umd' ? exportName : undefined
  })))
})

promise.catch(err => {
  console.error(err.stack) // eslint-disable-line no-console
  process.exit(1)
})
