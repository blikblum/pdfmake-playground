import 'components/code-editor'
import {PdfViewer} from 'components/pdf-viewer'

PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Regular.woff', styles: ['normal']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Italic.woff', styles: ['italics']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-Medium.woff', styles: ['bold']})
PdfViewer.registerFont({name: 'Roboto', fileName: 'Roboto-MediumItalic.woff', styles: ['bolditalics']})
PdfViewer.registerFont({name: 'FA', fileName: 'FontAwesome-Regular.woff'})