import _ from 'underscore'
import { Component } from "basecomponent";
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'

let editorCount = 0

export class CodeEditor extends Component {
  static properties = {
    theme: {type: String},
    mode: {type: String},
    delay: {type: Number}
  }

  constructor () {
    super()
    this.editorId = editorCount++
    this.mode = 'javascript'
    this.theme = 'monokai'
    this.delay = 200
  }

  getEditorSelector() {
    return `ace-editor-${this.editorId}`
  }

  createRenderRoot() {
    return this
  }

  firstUpdated () {
    this.editor = ace.edit(this.getEditorSelector())
    this.editor.setTheme(`ace/theme/${this.theme}`);
    const session = this.editor.getSession()
    session.setMode(`ace/mode/${this.mode}`)
    session.on('change', _.debounce(() => {
      const event = new CustomEvent('change', {
        bubbles: true
      })
      this.dispatchEvent(event)
    }, this.delay))
    session.setValue(this.initialContent || '')
  }

  render() {
  return ([    
    <div class="editor" id={this.getEditorSelector()}></div>    
   ])
  }

  getValue () {
    return this.editor.getSession().getValue()
  }

  setValue (content) {
    this.editor.getSession().setValue(content)
  }  
}

customElements.define('code-editor', CodeEditor)