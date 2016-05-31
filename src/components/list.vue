<template>
	<div class="list-container">
		<h1>List</h1>
		<ul>
			<li v-for="q in qList"><a v-link="{ path: '/' + $route.params.courseId + '/' + q.seq }">{{ q.title }}</a></li>
		</ul>
	</div>
</template>

<script>
import store from './../lib/store'

export default {
	data() {
		return {
			qList: []
		}
	},

	route:{
		data() {
			// make sure quizData is initiated
			store.updateQ(this.$route.params.qn, (data) => {
				this.qList = store.getQuizData();
			});
		}
	}
}
</script>

<style lang="stylus">
@require './../styles/vars'

.list-container
	padding content-page-padding
	overflow auto
	height full-height
</style>
