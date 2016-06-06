<template>
	<nav class="uk-navbar navbar">
		<div class="navbar-nav uk-container-center">
			<ul class="uk-navbar-nav">
				<li class="run-btn"><a href="javascript:void(0)" @click="runCode">執行 <i class="uk-icon-play"></i></a></li>
				<li><a v-link="{ path: '/' + $route.params.courseId + '/' + $route.params.qn, exact: true}">程式撰寫</a></li>
				<li><a v-link="{ path: '/' + $route.params.courseId + '/' + $route.params.qn + '/logs' }">編譯記錄</a></li>
				<li><a href="javascript:void(0)" @click="reset">重設此題</a></li>
				<li class="uk-parent" data-uk-dropdown="{mode:'click'}">
					<a href="javascript:void(0)">Input <i class="uk-icon-caret-down"></i></a>
					<stdin></stdin>
				</li>
				<li class="uk-parent" data-uk-dropdown="{mode:'click'}">
					<a href="javascript:void(0)">{{ lang[currentLang] }} <i class="uk-icon-caret-down"></i></a>
					<div class="uk-dropdown uk-dropdown-navbar language-dropdown">
						<ul class="uk-nav uk-nav-navbar">
							<li v-for="l in lang">
								<a href="javascript:void(0)" @click="setLang($index)">{{ l }}</a>
							</li>
						</ul>
					</div>
				</li>
			</ul>
			<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li><a href="javascript:void(0)" @click="checkPrev"><i class="uk-icon-arrow-left"></i> 上一題</a>
					</li>
					<li><a v-link="{ path: '/' + $route.params.courseId + '/' + $route.params.qn + '/list' }">題目清單</a></li>
					<li><a href="javascript:void(0)" @click="checkNext">下一題 <i class="uk-icon-arrow-right"></i></a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
/* global UIkit */
import store from './../lib/store'
import Stdin from './stdin.vue'
import { checkAnswer } from './../lib/util.js'

const COMPILE_SERVER = 'http://140.125.90.231:8889/compile';
const SUBMIT_SERVER = 'http://140.125.90.231:8888/submit'
//const SUBMIT_SERVER = 'http://localhost:8888/submit'

export default {
	data() {
		return {
			lang: [
				'Python',
				'Ruby',
				'Clojure',
				'PHP',
				'JavaScript',
				'Scala',
				'Go',
				'C/C++',
				'Java',
				'VB.NET',
				'C#',
				'Bash',
				'Objective-C'
			],
			currentLang: 8
		}
	},
	methods: {
		runCode() {
			var qn = this.$route.params.qn,
				userCode = store.getUserCode(qn),
				stdin = store.getStdin(qn),
				lang = this.currentLang;

			if (typeof userCode === 'undefined') {
				return;
			}
			var codeData = {
				code: userCode,
				stdin: stdin,
				language: lang
			};

			this.$http.post(COMPILE_SERVER, codeData).then((response) => {
				var result = checkAnswer(response.data.output, store.getQuizData(qn).stdout),
					loggedIn = store.isLoggedIn();
				store.addLog(store.getQuizData(qn).title, userCode, stdin, response.data.output + response.data.errors, result);
				
				if (!loggedIn) {
					console.log()
					UIkit.notify('警告：未正確登入，練習結果將不會儲存。', {status: 'warning'});
				}

				if (result && loggedIn) {
					this.submit(userCode);
				}

				this.$route.router.go('/' + this.$route.params.courseId + '/' + qn + '/logs');
			});
		},

		submit(code) {
			var classId = store.getClassId(),
				courseId = this.$route.params.courseId.split('-')[0],
				lessonId = this.$route.params.courseId.split('-')[1],
				qn = this.$route.params.qn;

			var submitData = {
				code,
				uid: store.getUser()
			};

			try {
				this.$http.post(`${SUBMIT_SERVER}/${classId}/${courseId}/${lessonId}/${qn}`, submitData).then((response) => {
					if (response.data === 'ok') {
						UIkit.notify('練習結果已成功儲存！', {status: 'success'});
					} else {
						UIkit.notify('練習結果儲存失敗！', {status: 'danger'})
					}
				});
			} catch (e) {UIkit.notify('與伺服器連線失敗，練習結果無法儲存！', {status: 'danger'})}
		},

		reset() {
			UIkit.modal.confirm('確定要將此題清除重寫？', () => {
				store.resetCode(this.$route.params.qn);
			});
		},

		checkPrev() {
			if (parseInt(this.$route.params.qn) === 1) {
				alert('這已經是第一題了！');
				this.$route.router.go('/' + this.$route.params.courseId + '/1');
				return false;
			}
			let courseId = this.$route.params.courseId,
				qn = parseInt(this.$route.params.qn) - 1;

			this.$route.router.go(`/${courseId}/${qn}`);
		},
		checkNext() {
			if (parseInt(this.$route.params.qn) === store.getQuizCount()) {
				alert('這已經是最後一題了！');
				this.$route.router.go('/' + this.$route.params.courseId + '/' + store.getQuizCount());
				return false;
			}
			let courseId = this.$route.params.courseId,
				qn = parseInt(this.$route.params.qn) + 1;

			this.$route.router.go(`/${courseId}/${qn}`);
		},

		setLang(index) {
			this.currentLang = index
		}
	},

	components: {
		Stdin
	}
}
</script>

<style lang="stylus">
@require './../styles/vars'
@require './../styles/functions'

.navbar
	background main-color
	color #FFF
	height navbar-height
	box-shadow  0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 7px 0 rgba(0,0,0,.12)
	position relative
	z-index 300
	.run-btn
		margin-right 22px
	li a
		color #FFF
		font-size 16px
		height navbar-height
		line-height navbar-height
		@media screen and (max-width: 1100px)
			font-size 14px
		&:hover, &:focus, &:active
			background whiteA(.10)
			color #FFF
		i
			font-size 14px
			@media screen and (max-width: 1100px)
				font-size 12px
	li a.v-link-active
		background whiteA(.20)
	li.uk-open a
		&:hover, &:focus, &:active
			color #444
			background #f5f5f5
			
	.language-dropdown
		box-shadow 0 2px 2px 0 rgba(0,0,0,.16),0 3px 1px -2px rgba(0,0,0,.2),0 2px 6px 0 rgba(0,0,0,.12),0 0 3px rgba(0,0,0,.4)
		padding 5px 15px
		a
			color #444
			line-height 20px
			height @line-height
			&:hover, &:focus, &:active
				background #E5E5E5!important

.navbar-nav
	width navbar-width
	@media screen and (max-width: 1100px)
		width 100vw

.uk-notify-message
	box-shadow 1px 2px 16px #888
</style>
