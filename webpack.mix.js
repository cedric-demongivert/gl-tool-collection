const mix = require('laravel-mix')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const pckg = require('./package.json')

const externals = []

for (const name in pckg.dependencies) {
  externals.push(new RegExp(`^${name}(\\/.+)?$`))
}

mix.ts('./src/index.ts', 'dist')
   .copy('LICENSE.md', 'dist')
   .copy('package.json', 'dist')
   .copy('README.md', 'dist')
   .setPublicPath('dist')
   .disableNotifications()
   .webpackConfig({
     'externals': externals,
     'optimization': {
    		'minimize': false
     },
     'output': {
       'library': pckg.name,
       'libraryTarget': 'umd',
       'globalObject': 'this' // webpack bug
     },
     'plugins': [
       new TypedocWebpackPlugin({ 'target': 'es6', 'mode': 'file' }, './src')
     ]
   })
