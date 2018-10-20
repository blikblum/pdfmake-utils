import { RawElement } from 'raw-element'
import { PdfAssetsLoader } from './assetsloader'

const assetsLoader = new PdfAssetsLoader()
let pdfMake
let dependenciesLoaded = false

export class PdfViewer extends RawElement {
  static get properties () {
    return {
      data: {type: Object},
      mode: {type: String},
      delay: {type: Number}
    }    
  }

  static registerFont (fontDef) {
    assetsLoader.registerFont(fontDef)
  }

  static registerFile (fileDef) {
    assetsLoader.registerFile(fileDef)
  }  

  constructor () {
    super()
    this.iframeEl = null
    if (!dependenciesLoaded) {
      dependenciesLoaded = true
      const assetsLoaderLoad = assetsLoader.load()
      assetsLoaderLoad.catch(err => {
        throw new Error(`Error loading fonts: ${err}`)
      })
      const pdfMakeImport = import('pdfmake-lite/build/pdfmake')
      pdfMakeImport.catch(err => {
        throw new Error(`Error loading pdfmake module: ${err}`)
      })
      Promise.all([pdfMakeImport, assetsLoaderLoad]).then(([module]) => {
        pdfMake = module.default
        pdfMake.vfs = assetsLoader.vfs
        pdfMake.fonts = assetsLoader.fonts
        if (pdfMake.fs) {
          assetsLoader.rawFiles.forEach(file => {
            pdfMake.fs.writeFileSync(file.name, file.data)
          })
        }
        this.requestUpdate()
      })
    }
  }
  
  createRenderRoot() {
    return this
  }

  updated(changedProperties) {
    this.pendingData = this.pendingData || changedProperties.has('data')
    if (this.pendingData && pdfMake && assetsLoader.ready) {
      this.pendingData = false
      try {
        const pdfDocGenerator = pdfMake.createPdf(this.data)
        pdfDocGenerator.getDataUrl(dataUrl => {
         this.iframeEl.src = dataUrl
        })        
      } catch (error) {
        console.warn('Error creating pdf:', error)
      }      
    }
  }

  render() {    
    if (!this.data) {
      this.innerHTML = '<div>Waiting for data...</div>'
    } else if (!pdfMake || !assetsLoader.ready) {
      this.innerHTML = '<div>Loading component...</div>'
    } else {
      if (!this.iframeEl) {
        this.innerHTML = '<iframe></iframe>'
        this.iframeEl = this.querySelector('iframe')
      }
    }    
  }  
}