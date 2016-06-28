<template>
	<div class="quiz-sider-container">
		<div class="description-container uk-panel">
			<div class="description">{{{ description }}}</div>
		</div>
		<div class="stdout-container uk-panel uk-flex">
			<pre class="stdout">{{ stdout }}</pre>
		</div>
	</div>
</template>

<script>
import store from './../lib/store'

export default {
	data() {
		return {
			description: "",
			stdout: ""
		}
	},

	created() {
		store.onUpdateQ((data) => {
			this.description = data.description;
			
			if (data.stdout.includes('>>>')) {
				this.stdout = ''
			} else {
				this.stdout = data.stdout;
			}
		});
	}
}
</script>

<style lang="stylus">
@require './../styles/vars'

.quiz-sider-container
	display flex
	flex-direction column
	height full-height
	width quiz-sider-width-large
	border-right light-border
	@media screen and (max-width: 1600px)
		width quiz-sider-width-medium
	@media screen and (max-width: 1100px)
		width quiz-sider-width-small
	.description-container
		overflow-y auto
		border-bottom light-border
		padding 8px 0 0 16px
		height 60%
	.description pre
		background none
	.stdout-container
		flex-direction column
		flex 1
	.stdout
		overflow auto
		flex 1
		margin-top 0
		font-size 14px

</style>
