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
			viewportMargin: Infinity,
			lineWrapping: true
		});
		this.codeMirror.on('changes',() => {
			store.setUserCode(this.$route.params.qn, this.codeMirror.getValue());
		});
		store.setGroup(this.$route.params.groupId);
		store.onResetCode((partCode) => {
			this.codeMirror.setValue(partCode);
		});
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

				var userCode = store.getUserCode(this.$route.params.qn);
				if (typeof userCode !== 'undefined') {
					this.codeMirror.setValue(userCode);
				}
				else if (typeof data.part !== 'undefined') {
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
	height full-height
	pre
		font-family Roboto Mono, monospace

</style>
