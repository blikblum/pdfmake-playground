import _ from 'underscore'
import { Component } from "basecomponent";

function fetchFont (fontURL) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', fontURL, true)
    request.responseType = 'arraybuffer'

    request.onload = function (e) {
      resolve(request.response)
    }

    request.onerror = reject

    request.send()
  })
}

const allStyles = ['normal', 'bold', 'italics', 'bolditalics']

class PdfFontLoader {
  constructor () {
    this.fontDefs = []
    this.vfs = {}
    this.fonts = {}
  }
  
  registerFont (fontDef) {
    this.fontDefs.push(fontDef)
  }  

  load () {    
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve()
      } else {
        const fetches = this.fontDefs.map(fontDef => {
          return fetchFont(fontDef.URL || fontDef.fileName).then((data) => {
            this.vfs[fontDef.fileName] = data
            const fontInfo = this.fonts[fontDef.name] || (this.fonts[fontDef.name] = {})
            const styles = fontDef.styles || allStyles
            styles.forEach(style => fontInfo[style] = fontDef.fileName)
          })
        })
        Promise.all(fetches).then(() => {
          this.loaded = true          
          resolve()
        }).catch(reject)
      }
    })
  }
}

let fontLoader = new PdfFontLoader()
let fontLoaderLoad
let pdfMake
let pdfMakeImport

export class PdfViewer extends Component {
  static properties = {
    data: {type: Object},
    mode: {type: String},
    delay: {type: Number}
  }

  static registerFont (fontDef) {
    fontLoader.registerFont(fontDef)
  }

  constructor () {
    super()
    if (!fontLoaderLoad) {      
      fontLoaderLoad = fontLoader.load()
      fontLoaderLoad.then(() => {
        this.requestUpdate()
      }).catch(err => {
        throw new Error(`Error loading fonts: ${err}`)
      })
    }
    if (!pdfMakeImport) {
      pdfMakeImport = import('pdfmake-lite/build/pdfmake')
      pdfMakeImport.then(module => {
        pdfMake = module.default
        pdfMake.vfs = fontLoader.vfs
        pdfMake.fonts = fontLoader.fonts
        this.requestUpdate()
      }).catch(err => {
        throw new Error(`Error loading pdfmake module: ${err}`)
      })
    }
  }
  
  createRenderRoot() {
    return this
  }

  updated(changedProperties) {
    this.pendingData = this.pendingData || changedProperties.has('data')
    if (this.pendingData && pdfMake && fontLoader.loaded) {
      this.pendingData = false
      const pdfDocGenerator = pdfMake.createPdf(this.data)
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.querySelector('iframe').src = dataUrl
      })
    }
  }

  render() {    
    if (!this.data) {
      return <div>Waiting for data...</div>
    } else if (!pdfMake || !fontLoader.loaded) {
      return <div>Loading component...</div>
    }
    return <iframe></iframe>
  }  
}

customElements.define('pdf-viewer', PdfViewer)