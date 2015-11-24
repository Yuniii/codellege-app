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
@require './../styles/vars'

.refAnswer
	height full-height
	overflow auto
	margin 0
	box-sizing border-box
	font-family 'Roboto Mono', '微軟正黑體'
	font-size 14px
	line-height 1.75
</style>
