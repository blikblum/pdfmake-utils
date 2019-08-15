function createFetchError(fileURL, error) {
  const result = new Error(`Fetching "${fileURL}" failed: ${error}`)
  result.name = 'FetchError'
  return result
}

function fetchFile (fileURL, isRaw) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', fileURL, true)
    request.responseType = isRaw ? 'text' : 'arraybuffer'

    request.onload = function (e) {
      if (request.status === 200) {
        resolve(request.response)
      } else {
        reject(createFetchError(fileURL, request.statusText))
      }
    }

    request.onerror = (error) => reject(createFetchError(fileURL, error))

    request.send()
  })
}

const allStyles = ['normal', 'bold', 'italics', 'bolditalics']

const standardFonts = [
  'Times-Roman', 'Times-Bold', 'Times-Italic', 'Times-BoldItalic',
  'Courier', 'Courier-Bold', 'Courier-Oblique', 'Courier-BoldOblique',
  'Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Helvetica-BoldOblique',
  'Symbol',
  'ZapfDingbats'
]

export class PdfAssetsLoader {
  constructor () {
    this.fileDefs = []
    this.fontDefs = []
    this.vfs = {}
    this.fonts = {}    
    this.ready = false
    this.fetchesPromise = undefined
  }

  registerFont (fontDef) {
    this.fontDefs.push(fontDef)
  }

  registerFile (fileDef) {
    this.fileDefs.push(fileDef)
  }

  storeFileData (fileName, data) {
    this.vfs[fileName] = data    
  }

  load () {
    if (this.fetchesPromise) {
      return this.fetchesPromise
    }

    const fetches = []
    this.fontDefs.forEach(fontDef => {
      const isStandard = standardFonts.indexOf(fontDef.fileName) !== -1
      const vfsPath = isStandard ? `data/${fontDef.fileName}.afm` : fontDef.fileName
      let fontURL = fontDef.URL
      if (!fontURL) {
        fontURL = isStandard ? `${fontDef.fileName}.afm` : fontDef.fileName
      }
      const fontFetch = fetchFile(fontURL, isStandard).then(data => {
        const fontInfo = this.fonts[fontDef.name] || (this.fonts[fontDef.name] = {})
        const styles = fontDef.styles || allStyles
        styles.forEach(style => {
          fontInfo[style] = fontDef.fileName
        })
        this.storeFileData(vfsPath, data)
      })
      fetches.push(fontFetch)
    })

    this.fileDefs.forEach(fileDef => {
      const fileURL = fileDef.URL || fileDef.name
      const fileFetch = fetchFile(fileURL, fileDef.raw).then(data => {
        this.storeFileData(fileDef.name, data)
      })
      fetches.push(fileFetch)
    })

    this.fetchesPromise = new Promise((resolve, reject) => {
      const errors = []
      let fulfilledCount = 0
      fetches.forEach(promise => {
        promise.then(() => {
          fulfilledCount++
          if (fulfilledCount >= fetches.length) {
            this.ready = true
            if (this.pdfMake) this.configurePdfMake(this.pdfMake)
            if (errors.length) {
              reject(errors)
            } else {
              resolve()
            }
          }
        }).catch(err => {
          fulfilledCount++
          errors.push(err)
          if (fulfilledCount >= fetches.length) {
            this.ready = true
            if (this.pdfMake) this.configurePdfMake(this.pdfMake)
            reject(errors)
          }
        })
      })
    })

    return this.fetchesPromise
  }

  configurePdfMake (pdfMake) {
    pdfMake.vfs = Object.assign(pdfMake.vfs || {}, this.vfs)
    pdfMake.fonts = Object.assign(pdfMake.fonts || {}, this.fonts)
  }
}
