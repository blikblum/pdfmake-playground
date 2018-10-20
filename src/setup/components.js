import 'components/code-editor'
import {PdfViewer} from 'pdfmake-utils'

PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.woff', styles: ['normal']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Italic.woff', styles: ['italics']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Medium.woff', styles: ['bold']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-MediumItalic.woff', styles: ['bolditalics']})
PdfViewer.registerFont({name: 'FA', fileName: 'FontAwesome-Regular.woff'})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-Roman', styles: ['normal']})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-Italic', styles: ['italics']})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-Bold', styles: ['bold']})
PdfViewer.registerFont({name: 'Times', fileName: 'Times-BoldItalic', styles: ['bolditalics']})
PdfViewer.registerFont({name: 'ZapfDingbats', fileName: 'ZapfDingbats'})

customElements.define('pdf-viewer', PdfViewer)