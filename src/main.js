import './setup/main'
import Radio from 'backbone.radio'
import { Region } from 'backbone.marionette'
import { createRouter, middleware } from 'marionette.routing'
import { ApplicationRoute } from './application/route';


const router = createRouter({log: true, logError: true})

router.rootRegion = new Region({el: 'main.application'})

router.map(function (route) {  
  route('app', {path: '/', routeClass: ApplicationRoute}, function () {
  })
});


Radio.channel('router').on('transition:error', (transition, err) => {
  console.error(err)
})

router.use(middleware);

router.listen();

