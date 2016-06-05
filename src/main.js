import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'

import Main from './main.vue'
import App from './app.vue'
import Codepad from './components/codepad.vue'
import Answer from './components/answer.vue'
import List from './components/list.vue'
import Logs from './components/logs.vue'

Vue.use(Router);
Vue.use(Resource);

Vue.http.options.headers = {
	'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
};
Vue.http.options.emulateJSON = true;

var router = new Router();

router.map({
	'/:courseId': {
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
	'/': '/1-1/1',
	'/:courseId': '/:courseId/1'
});

router.start(Main, '#app');
