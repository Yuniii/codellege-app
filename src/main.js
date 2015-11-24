import Vue from 'vue'
import Router from 'vue-router'

import Main from './main.vue'
import App from './app.vue'
import Codepad from './components/codepad.vue'
import Answer from './components/answer.vue'
import List from './components/list.vue'
import Logs from './components/logs.vue'

Vue.config.debug = true;
Vue.use(Router);

var router = new Router();

router.map({
	'/:groupId': {
		component: App,
		subRoutes: {
			'/:qn': {
				component: Codepad
			},
			'/:qn/answer': {
				component: Answer
			},
			'/:qn/list': {
				component: List
			},
			'/:qn/logs': {
				component: Logs
			}
		}
	}
});

router.redirect({
	'/': '/1/1',
	'/:groupId': '/:groupId/1'
});

router.start(Main, '#app');
