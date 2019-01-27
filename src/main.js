import './setup/main'
import Radio from 'backbone.radio'
import { Router } from 'marionette.routing'
import { ApplicationRoute } from './application/route';


const router = new Router({log: true, logError: true}, 'main.application')

router.map(function (route) {  
  route('app', {path: '/', routeClass: ApplicationRoute}, function () {
  })
});


Radio.channel('router').on('transition:error', (transition, err) => {
  console.error('router:transition', err)
})


router.listen();

