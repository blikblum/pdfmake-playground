import { View } from 'backbone.marionette'
import { Header } from './Header';
import { SideBar } from './SideBar';
import { RouterLink } from 'marionette.routing';

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

  codeEditorChange(e) {
    console.log('code editor changed', e.currentTarget.getValue())
  },

  template () {
    return ([      
      <section class="content application__content">        
        <code-editor></code-editor>
      </section>
    ])
  }  
})

export { ApplicationView }
