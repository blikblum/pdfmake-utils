import { RawElement } from 'raw-element'
import { PdfAssetsLoader } from './assetsloader'

let pdfViewerAssetsLoader
let loadedPdfMake
let dependenciesLoaded = false

export class PdfViewer extends RawElement {
  static get properties () {
    return {
      data: { type: Object },
      mode: { type: String },
      delay: { type: Number }
    }
  }

  static get assetsLoader () {
    if (!pdfViewerAssetsLoader) {
      pdfViewerAssetsLoader = new PdfAssetsLoader()
    }
    return pdfViewerAssetsLoader
  }

  static set assetsLoader (value) {
    if (!value) {
      console.warning(`PdfViewer.assetsLoader: trying to set instance to an invalid value ${value}`)
      return
    }
    if (pdfViewerAssetsLoader) {
      console.warning('PdfViewer.assetsLoader: overriding previously set instance')
    }
    pdfViewerAssetsLoader = value
  }

  static registerFont (fontDef) {
    this.assetsLoader.registerFont(fontDef)
  }

  static registerFile (fileDef) {
    this.assetsLoader.registerFile(fileDef)
  }

  static getPdfMake () {
    return window.pdfMake
  }

  constructor () {
    super()
    this.style.display = 'block'
    this.iframeEl = null
    const { assetsLoader } = this.constructor
    if (!dependenciesLoaded) {
      dependenciesLoaded = true
      const loadAssets = assetsLoader.load()
      loadAssets.catch(err => {
        throw new Error(`Error loading fonts: ${err}`)
      })
      const getPdfMake = Promise.resolve(this.constructor.getPdfMake())
      getPdfMake.catch(err => {
        throw new Error(`Error loading pdfmake module: ${err}`)
      })
      Promise.all([getPdfMake, loadAssets]).then(([pdfMake]) => {
        loadedPdfMake = pdfMake.__esModule ? pdfMake.default : pdfMake
        assetsLoader.configurePdfMake(loadedPdfMake)
        this.requestUpdate()
      })
    }
  }

  createRenderRoot () {
    return this
  }

  updated (changedProperties) {
    const { assetsLoader } = this.constructor
    this.pendingData = this.pendingData || changedProperties.has('data')
    if (this.pendingData && loadedPdfMake && assetsLoader.ready) {
      this.pendingData = false
      try {
        const pdfDocGenerator = loadedPdfMake.createPdf(this.data)
        pdfDocGenerator.getDataUrl(dataUrl => {
          this.iframeEl.src = dataUrl
        })
      } catch (error) {
        console.warn(`PdfViewer: error creating pdf: ${error}`)
      }
    }
  }

  render () {
    const { assetsLoader } = this.constructor
    if (!this.data) {
      this.innerHTML = '<div>Waiting for data...</div>'
    } else if (!loadedPdfMake || !assetsLoader.ready) {
      this.innerHTML = '<div>Loading component...</div>'
    } else {
      if (!this.iframeEl) {
        this.innerHTML = '<iframe style="width: 100%; height: 100%;"></iframe>'
        this.iframeEl = this.querySelector('iframe')
      }
    }
  }
}
