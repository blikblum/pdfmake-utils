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
 * `pdfMake`: pdfMake instance (optional) 

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
*  `configurePdfMake`
   Configure pdfMake `vfs` and `fonts` properties with the loaded data. Accepts the pdfMake instance as argument   
*  `load`: loads the registered fonts / files and configure pdfMake if pdfMake property is assigned. Returns a promise that is
   resolved if all files loaded correctly or is rejected if any file fails to load.



##### Usage
```javascript
import pdfmake from 'pdfmake/build/pdfmake'
import { PdfAssetsLoader } from 'pdfmake-utils'

const assetsLoader = new PdfAssetsLoader()
pdfmake.fonts = assetsLoader.fonts
pdfmake.vfs = assetsLoader.vfs

// register Roboto font, normal variant. Roboto-Regular.woff must be in root path
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.woff', styles: ['normal']})
// register Roboto font, bolditalics variant using a custom file location
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-MediumItalic.woff', URL: 'fonts/Roboto-MediumItalic.woff', styles: ['bolditalics']})

// register a file to be loaded in the root path
assetsLoader.registerFile({name: 'MyLogo.png'})
// register a file with a custom location
assetsLoader.registerFile({name: 'MyHeader.png', URL: 'images/sunshine.png'})

assetsLoader.load().then(() => {
  console.log('assets loaded')
}).catch(errors => {
  // errors -> array with all file loading errors
  console.error('assets loading', errors);
})

```

##### Standard fonts

The [Pdf standard fonts](https://en.wikipedia.org/wiki/PDF#Standard_Type_1_Fonts_(Standard_14_Fonts)) can be loaded by setting `fileName` to
the font name without extension, e.g., 'Courier' or 'Courier-Bold'. By default, it will load the respective [*.afm file](https://github.com/foliojs/pdfkit/tree/master/lib/font/data) in root path.

> To use standard fonts is necessary to call `configurePdfMake`

##### Usage
```javascript
import pdfmake from 'pdfmake/build/pdfmake'
import { PdfAssetsLoader } from 'pdfmake-utils'

const assetsLoader = new PdfAssetsLoader()

// register a Times font that will use the standard Times-Roman font. Times-Roman.afm must be in root path
assetsLoader.registerFont({name: 'Times', fileName: 'Times-Roman', styles: ['normal']})
// registering standard Times-Italic with a custom afm file location
assetsLoader.registerFont({name: 'Times', fileName: 'Times-Italic', URL: 'fonts/Times-Italic.afm', styles: ['italics']})

// all possible standard fonts
PdfViewer.registerFont({name: 'Times', fileName: 'Times-Roman', styles: ['normal']})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-Italic', styles: ['italics']})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-Bold', styles: ['bold']})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-BoldItalic', styles: ['bolditalics']})

PdfViewer.registerFont({name: 'Courier', fileName: 'Courier', styles: ['normal']})
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier-Oblique', styles: ['italics']})
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier-Bold', styles: ['bold']})
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier-BoldOblique', styles: ['bolditalics']})

PdfViewer.registerFont({name: 'Helvetica', fileName: 'Helvetica', styles: ['normal']})
PdfViewer.registerFont({name: 'Helvetica', fileName: 'Helvetica-Oblique', styles: ['italics']})
PdfViewer.registerFont({name: 'Helvetica', fileName: 'Helvetica-Bold', styles: ['bold']})
PdfViewer.registerFont({name: 'Helvetica', fileName: 'Helvetica-BoldOblique', styles: ['bolditalics']})

PdfViewer.registerFont({name: 'Symbol', fileName: 'Symbol'})

PdfViewer.registerFont({name: 'ZapfDingbats', fileName: 'ZapfDingbats'})

assetsLoader.load().then(() => {
  assetsLoader.configurePdfMake(pdfMake)
}).catch(err => {
  // will fail if one of the files fails to load 
  // configure pdfMake with the files that loaded correctly
  assetsLoader.configurePdfMake(pdfMake)
  console.error('assets loading', err);
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

##### Usage
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

Copyright © 2019 Luiz Américo. This source code is licensed under the MIT license found in
the [LICENSE.txt](https://github.com/blikblum/pdfmake-utils/blob/master/LICENSE.txt) file.
The documentation to the project is licensed under the [CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
license.

---
Made with ♥ by Luiz Américo and [contributors](https://github.com/blikblum/pdfmake-utils/graphs/contributors)
