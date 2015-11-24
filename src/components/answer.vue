<template>
	<pre class="refAnswer">{{ answer }}</pre>
</template>

<script>
import store from './../lib/store'

export default {
	data() {
		return {
			answer: ""
		}
	},

	route:{
		data() {
			store.updateQ(this.$route.params.qn, (data) => {
				this.answer = data.ans;
			});
		}
	}
}
</script>

<style lang="stylus">
.refAnswer
	overflow auto
</style>
