<template>
	<div class="uk-dropdown-blank uk-panel uk-panel-box stdin-panel">
		<form class="uk-form" v-on:submit.prevent>
			<textarea rows="5" placeholder="輸入程式需讀入的資料" @keyup="updateStdin" v-model="stdin"></textarea>
		</form>
	</div>
</template>

<script>
import store from './../lib/store'

export default {
	data() {
		return {
			stdin: ''
		}
	},
	created() {
		store.onUpdateQ(() => {
			this.stdin = store.getStdin(this.$route.params.qn);
		});
	},
	methods: {
		updateStdin() {
			store.setStdin(this.$route.params.qn, this.stdin);
		}
	}
}
</script>

<style lang="stylus">
.stdin-panel
	padding 0
	box-shadow 0 2px 2px 0 rgba(0,0,0,.16),0 3px 1px -2px rgba(0,0,0,.2),0 2px 6px 0 rgba(0,0,0,.12),0 0 3px rgba(0,0,0,.4)
	background #FFF
	min-width 400px
	textarea
		width 100%
		border 0
</style>
