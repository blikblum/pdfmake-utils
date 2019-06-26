import { LitElement, html, css } from 'lit-element'
import { assetsLoader } from './utils';
import pdfMake from 'pdfmake/build/pdfmake';

const pdfData = {
  defaultStyle: {
    fontSize: 15    
  },
  content: [
    'Simple image',
    {
      image: 'bee.png'
    },
    {
      bold: true,
      text: 'Bold text'
    },
    {
      italics: true,
      text: 'Italics text'
    },
    {
      font: 'Courier',
      text: 'Text with standard font'
    },
    {
      font: 'Courier',
      bold: true,
      text: '(Bold) text with standard font'
    }
  ]
}


class PdfMakeUtilsExample extends LitElement {  
  static get properties() {
    return {
      error: {type: String},
      componentVisible: {type: Boolean},
      assetsLoaded: {type: Boolean}
    }
  }

  static get styles() {
    return css`
      #pdf-content, pdf-viewer {
        width: 600px;
        height: 800px;
      }
      .layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    `;
  }   

  loadAssets() {
    assetsLoader.load()
      .then(() => { 
        console.log('Assets loaded')
        this.assetsLoaded = true
      })
      .catch((e) => { 
        this.error = `Assets load fail: ${e}`
        console.error('Assets load fail', e)
      })
  }

  toggleWebComponent() {
    this.componentVisible = !this.componentVisible    
  }

  generatePdf() {
    try {      
      const pdfDocGenerator = pdfMake.createPdf(pdfData)
      pdfDocGenerator.getDataUrl(dataUrl => {
       this.renderRoot.querySelector('#pdf-content').src = dataUrl
       this.error = null
      })        
    } catch (error) {
      this.error = `Error creating pdf: ${error}`
      console.error('Error creating pdf:', error)
    }
  }

  render() {
    return html`
      ${this.error ? html`<div class="error">${this.error}</div>` : ''}
      <div class="layout">
        <div>
          <div>PdfAssetsLoader standalone usage</div>
          <div class="button-bar">
            <button @click=${this.loadAssets} ?disabled=${this.assetsLoaded}>Load Assets</button>
            <button @click=${this.generatePdf} ?disabled=${!this.assetsLoaded}>Generate Pdf</button>
          </div>                
          <iframe id="pdf-content"></iframe>
        </div>
        <div>
          <div>PdfViewer web component (pdf-viewer)</div>
          <div class="button-bar">
            <button @click=${this.toggleWebComponent}>${this.componentVisible ? 'Hide' : 'Show'}</button>
          </div>
          ${this.componentVisible ? html`<pdf-viewer .data=${pdfData}></pdf-viewer>` : ''}
        </div>    
      </div>
      
    `
  }
}

customElements.define('pdfmake-utils-example', PdfMakeUtilsExample)