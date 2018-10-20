# PdfMake Utils

[![NPM version](http://img.shields.io/npm/v/pdfmake-utils.svg?style=flat-square)](https://www.npmjs.com/package/pdfmake-utils)
[![NPM downloads](http://img.shields.io/npm/dm/pdfmake-utils.svg?style=flat-square)](https://www.npmjs.com/package/pdfmake-utils)
[![Dependency Status](http://img.shields.io/david/dev/blikblum/pdfmake-utils.svg?style=flat-square)](https://david-dm.org/blikblum/pdfmake-utils#info=devDependencies)

> PdfMake Utils provides helper classes to use with PdfMake


### Features

&nbsp; &nbsp; ✓ Custom element class to display pdf document<br>
&nbsp; &nbsp; ✓ Load assets dynamically<br>


### Documentation

#### PdfAssetsLoader

A class to load dynamically fonts and arbitrary files

##### Properties
 * `ready`: Becomes true when assets loading is done
 * `vfs`: a hash containing loaded files data
 * `fonts`: a hash containing loaded fonts data

##### Methods
* `registerFile`
   Register a file to be loaded. Accepts a hash with following properties:
   * `name`: the file name
   * `URL`: URL where the file should be loaded from. If not set it will use `name`
 * `registerFont`
   Register a font to be loaded. Accepts a hash with following properties:
   * `name`: the font name
   * `fileName`: the font file name
   * `URL`: URL where the file should be loaded from. If not set it will use `fileName`
   * `styles`: an array with the styles that this file will be associated with
*  `load`: loads the registered fonts / files



#### Usage
```javascript
import pdfmake from 'pdfmake/build/pdfmake'
import { PdfAssetsLoader } from 'pdfmake-utils'

const assetsLoader = new PdfAssetsLoader()
pdfmake.fonts = assetsLoader.fonts
pdfmake.vfs = assetsLoader.vfs

assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.woff', styles: ['normal']})
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Italic.woff', styles: ['italics']})
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Medium.woff', styles: ['bold']})
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-MediumItalic.woff', URL: 'fonts/Roboto-MediumItalic.woff', styles: ['bolditalics']})

assetsLoader.registerFile({name: 'MyLogo.png'})
assetsLoader.registerFile({name: 'MyHeader.png', URL: 'images/sunshine.png'})

assetsLoader.load().then(() => {
  console.log('assets loaded')
})

```

#### PdfViewer

A Custom Element class that creates and displays a pdf in an iframe

 > The assets and the pdfmake packages are loaded dyanamically the first time an instance is created

 > By default, [pdfmake-lite](https://github.com/blikblum/pdfmake/tree/lite) package is used. Adjust your bundler (e.g. webpack) to use main pdfmake package instead

 > To style the element use CSS with the `pdf-viewer iframe` selector

##### Properties
 * `data`
   The PdfMake document definition from the pdf which is generated 

##### Static Methods
 * `registerFile`
   Register a file to be loaded  
 * `registerFont`
   Register a font to be loaded

#### Usage
```javascript
import pdfmake from 'pdfmake/build/pdfmake'
import { PdfViewer } from 'pdfmake-utils'

PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.woff', styles: ['normal']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Italic.woff', styles: ['italics']})
PdfViewer.registerFile({name: 'MyLogo.png'})

customElements.define('pdf-viewer', PdfViewer)

// use pdf-viewer element with, e.g, lit-html:
// <pdf-viewer .data=${docDefinition}></pdf-viewer>

```

### License

Copyright © 2018 Luiz Américo. This source code is licensed under the MIT license found in
the [LICENSE.txt](https://github.com/blikblum/pdfmake-utils/blob/master/LICENSE.txt) file.
The documentation to the project is licensed under the [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
license.

---
Made with ♥ by Luiz Américo and [contributors](https://github.com/blikblum/pdfmake-utils/graphs/contributors)
