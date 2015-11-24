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

export default {
	created() {
		store.setGroup(this.$route.params.groupId);
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
