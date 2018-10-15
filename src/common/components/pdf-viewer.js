import _ from 'underscore'
import { Component } from "basecomponent";

function fetchFont (fontURL, isStandard) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', fontURL, true)
    request.responseType = isStandard ? 'text' : 'arraybuffer'

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


class PdfAssetsLoader {
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
          const isStandard = standardFonts.indexOf(fontDef.fileName) !== -1
          const vfsPath = isStandard ? `../font/data/${fontDef.fileName}.afm` : fontDef.fileName
          let fontURL = fontDef.URL
          if (!fontURL) {
            fontURL = isStandard ? `${fontDef.fileName}.afm` : fontDef.fileName
          }
          return fetchFont(fontURL, isStandard).then(data => {            
            const fontInfo = this.fonts[fontDef.name] || (this.fonts[fontDef.name] = {})
            const styles = fontDef.styles || allStyles
            styles.forEach(style => fontInfo[style] = fontDef.fileName)
            this.vfs[vfsPath] = data
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

let assetsLoader = new PdfAssetsLoader()
let assetsLoaderLoad
let pdfMake
let pdfMakeImport

export class PdfViewer extends Component {
  static properties = {
    data: {type: Object},
    mode: {type: String},
    delay: {type: Number}
  }

  static registerFont (fontDef) {
    assetsLoader.registerFont(fontDef)
  }

  constructor () {
    super()
    if (!assetsLoaderLoad) {      
      assetsLoaderLoad = assetsLoader.load()
      assetsLoaderLoad.then(() => {
        this.requestUpdate()
      }).catch(err => {
        throw new Error(`Error loading fonts: ${err}`)
      })
    }
    if (!pdfMakeImport) {
      pdfMakeImport = import('pdfmake-lite/build/pdfmake')
      pdfMakeImport.then(module => {
        pdfMake = module.default
        pdfMake.vfs = assetsLoader.vfs
        pdfMake.fonts = assetsLoader.fonts
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
    if (this.pendingData && pdfMake && assetsLoader.loaded) {
      this.pendingData = false
      try {
        const pdfDocGenerator = pdfMake.createPdf(this.data)
        pdfDocGenerator.getDataUrl((dataUrl) => {
          this.querySelector('iframe').src = dataUrl
        })        
      } catch (error) {
        console.warn('Error creating pdf:', error)
      }      
    }
  }

  render() {    
    if (!this.data) {
      return <div>Waiting for data...</div>
    } else if (!pdfMake || !assetsLoader.loaded) {
      return <div>Loading component...</div>
    }
    return <iframe></iframe>
  }  
}

customElements.define('pdf-viewer', PdfViewer)