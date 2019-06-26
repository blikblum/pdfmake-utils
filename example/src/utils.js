import { PdfAssetsLoader } from '../../src/assetsloader'
import { PdfViewer } from "../../src/pdf-viewer";
import pdfMake from 'pdfmake/build/pdfmake';

// configure standalone loader
export const assetsLoader = new PdfAssetsLoader()
assetsLoader.pdfMake = pdfMake

assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.ttf', URL: 'fonts/Roboto-Regular.ttf', styles: ['normal']})
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Italic.ttf', URL: 'fonts/Roboto-Italic.ttf', styles: ['italics']})
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-Medium.ttf', URL: 'fonts/Roboto-Medium.ttf', styles: ['bold']})
assetsLoader.registerFont({name: 'Roboto', fileName: 'Roboto-MediumItalic.ttf', URL: 'fonts/Roboto-MediumItalic.ttf', styles: ['bolditalics']})

// standard fonts
assetsLoader.registerFont({name: 'Courier', fileName: 'Courier', URL: 'fonts/Courier.afm', styles: ['normal']})
assetsLoader.registerFont({name: 'Courier', fileName: 'Courier-Oblique', URL: 'fonts/Courier-Oblique.afm', styles: ['italics']})
assetsLoader.registerFont({name: 'Courier', fileName: 'Courier-Bold', URL: 'fonts/Courier-Bold.afm', styles: ['bold']})
assetsLoader.registerFont({name: 'Courier', fileName: 'Courier-BoldOblique', URL: 'fonts/Courier-BoldOblique.afm', styles: ['bolditalics']})

assetsLoader.registerFile({name: 'bee.png', URL: 'images/bee.png'})

// configure custom element
PdfViewer.getPdfMake = () => pdfMake

PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.ttf', URL: 'fonts/Roboto-Regular.ttf', styles: ['normal']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Italic.ttf', URL: 'fonts/Roboto-Italic.ttf', styles: ['italics']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Medium.ttf', URL: 'fonts/Roboto-Medium.ttf', styles: ['bold']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-MediumItalic.ttf', URL: 'fonts/Roboto-MediumItalic.ttf', styles: ['bolditalics']})

// standard fonts
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier', URL: 'fonts/Courier.afm', styles: ['normal']})
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier-Oblique', URL: 'fonts/Courier-Oblique.afm', styles: ['italics']})
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier-Bold', URL: 'fonts/Courier-Bold.afm', styles: ['bold']})
PdfViewer.registerFont({name: 'Courier', fileName: 'Courier-BoldOblique', URL: 'fonts/Courier-BoldOblique.afm', styles: ['bolditalics']})

PdfViewer.registerFile({name: 'bee.png', URL: 'images/bee.png'})

customElements.define('pdf-viewer', PdfViewer)
