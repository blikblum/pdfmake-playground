import { Route } from 'marionette.routing'
import { ApplicationView } from './view'

const ApplicationRoute = Route.extend({
  activate (transition) {
    
  },

  viewClass: ApplicationView,

  viewOptions () {
    return {

    }
  }
})

export { ApplicationRoute }
