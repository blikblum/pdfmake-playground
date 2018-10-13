import { View } from 'backbone.marionette'
import { Header } from './Header';
import { SideBar } from './SideBar';
import { RouterLink } from 'marionette.routing';

function getDefinition(str) {
  var result = eval(`${str}; dd;`)
  return result
}

const basicContent = `var dd = {
	content: [
		'First paragraph',
		'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
	]	
}`

const ApplicationView = View.extend({  
  behaviors: [RouterLink],
  
  regions: {
    outlet: '.application__content'
  },

  initialize () {
    
  },

  events: {
    'change code-editor': 'codeEditorChange'
  },

  codeEditorChange() {    
    const content = this.editorEl.getValue()
    this.pdfViewerEl.data = getDefinition(content)
  },

  onRender() {
    if (!this.pdfViewerEl) {
      this.pdfViewerEl = this.$('pdf-viewer')[0]
    }
    if (!this.editorEl) {
      this.editorEl = this.$('code-editor')[0]
      this.editorEl.addEventListener('change', (e) => {
        console.log('codeeditor change')
      })
      this.editorEl.initialContent = localStorage.getItem('ddContent') || basicContent      
    }    
  },

  template () {
    return ([      
      <section class="content application__content">        
        <code-editor></code-editor>
        <pdf-viewer></pdf-viewer>
      </section>
    ])
  }  
})

export { ApplicationView }
