<template>
	<navbar></navbar>
	<div class="uk-flex main-body">
		<quiz-sider></quiz-sider>
		<div id="mainContent" class="main-content">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import Navbar from './components/navbar.vue'
import QuizSider from './components/quiz-sider.vue'
import store from './lib/store'
import { getParameter } from './lib/util.js'

export default {
	created() {
		store.setCourseId(this.$route.params.courseId);
		store.setUser(getParameter('user_id'));
		store.setClassId(getParameter('class_id'));
		if (store.getUser() === 0 || store.getClassId() === 0 || store.getClassId().toString().charAt(4) === '5') window.location='./403.html';
	},

	components: {
		Navbar,
		QuizSider
	}
}
</script>

<style lang="stylus">
@require './styles/vars'
@require './styles/basic'

.main-content
	flex 1
	height "calc(100vh - %s)" % navbar-height
</style>
