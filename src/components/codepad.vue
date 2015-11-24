<template>
	<div class="editor-container">
		<div id="editor" class="editor"></div>
	</div>
</template>

<script>
import store from './../lib/store'

export default {
	data() {
		return {
			codeMirror: {},
			isInit: false
		}
	},

	ready() {
		this.codeMirror = CodeMirror(document.getElementById('editor'), {
			mode: "text/x-java",
			matchBrackets: true,
			lineNumbers: true,
			indentUnit: 4,
			viewportMargin: Infinity
		});
		store.setGroup(this.$route.params.groupId);
		this.loadQuiz();
		this.isInit = true;
	},

	route: {
		data(transition) {
			if (this.isInit === false) return;
			this.loadQuiz();
		}
	},

	methods: {
		loadQuiz() {
			store.updateQ(this.$route.params.qn, (data) => {
				if (typeof data === 'undefined') {
					console.log('沒題目了！');
					return;
				}
				if (typeof data !== 'undefined' && typeof data.part !== 'undefined') {
					this.codeMirror.setValue(data.part);
				} else {
					this.codeMirror.setValue(data.ans);
				}
			});
		}
	}
}
</script>

<style lang="stylus">
@require './../styles/vars'

.editor-container
	display flex

.editor, .CodeMirror
	flex 1
	height "calc(100vh - %s)" % navbar-height
	pre
		font-family Roboto Mono, monospace

</style>
