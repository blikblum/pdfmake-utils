function fetchFile (fileURL, isRaw) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', fileURL, true)
    request.responseType = isRaw ? 'text' : 'arraybuffer'

    request.onload = function (e) {
      resolve(request.response)
    }

    request.onerror = reject

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
    this.rawFiles = []
    this.ready = false
    this.fetchesPromise = undefined
  }

  registerFont (fontDef) {
    this.fontDefs.push(fontDef)
  }

  registerFile (fileDef) {
    this.fileDefs.push(fileDef)
  }

  storeFileData (fileName, data, raw) {
    if (raw) {
      this.rawFiles.push({
        name: fileName,
        data: data
      })
      this.vfs[fileName] =  window.btoa(data+'');
    } else {
      this.vfs[fileName] = data
    }
  }

  load () {
    if (this.fetchesPromise) {
      return this.fetchesPromise
    }

    const fetches = []
    this.fontDefs.forEach(fontDef => {
      const isStandard = standardFonts.indexOf(fontDef.fileName) !== -1
      const vfsPath = isStandard ? `../font/data/${fontDef.fileName}.afm` : fontDef.fileName
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
        this.storeFileData(vfsPath, data, isStandard)
      })
      fetches.push(fontFetch)
    })

    this.fileDefs.forEach(fileDef => {
      const fileURL = fileDef.URL || fileDef.name
      const fileFetch = fetchFile(fileURL, fileDef.raw).then(data => {
        this.storeFileData(fileDef.name, data, fileDef.raw)
      })
      fetches.push(fileFetch)
    })

    this.fetchesPromise = Promise.all(fetches).then(() => {
      this.ready = true
    }).catch(err => {
      this.ready = true
      console.warn(`Error fetching pdf assets`, err)
    })

    return this.fetchesPromise
  }
}
