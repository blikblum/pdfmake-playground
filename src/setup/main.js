import '../main.scss'
import './components'
import {View} from 'backbone.marionette'
import createRenderer from 'marionette.renderers/snabbdom'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
}

const renderer = createRenderer([
  require('snabbdom/modules/attributes').default,
  require('snabbdom/modules/eventlisteners').default,  
  require('snabbdom/modules/props').default,
  require('snabbdom/modules/class').default,  
  require('snabbdom/modules/style').default,
  require('snabbdom/modules/dataset').default
])

View.setRenderer(renderer)
    