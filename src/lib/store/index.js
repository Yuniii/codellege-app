import Vue from 'vue'
import Resource from 'vue-resource'
Vue.use(Resource);

import { getNow } from './../util.js'

const store = {};
//const api = 'http://localhost:8888/course';
const api = 'http://140.125.90.231:8888/course';
export default store;

store.courseId = 0;
store.lessonId = 0;
store.qn = 0;
store.uid = 0;
store.quizData = null;
store.onUpdateQListener = [];
store.onResetCodeListener = null;
store.userCode = [];
store.stdin = [];

store.setCourseId = function (courseId) {
	if (courseId === this.courseId) {
		return;
	}
	[this.courseId, this.lessonId] = courseId.split('-');
	this.loadQuizData(courseId);
}

store.setUser = function (uid) {
	this.uid = uid;
}

store.getUser = function () {
	return this.uid;
}

store.loadQuizData = function (courseId) {
	var localCache = sessionStorage.getItem(courseId);
	if (localCache !== null) {
		this.quizData = JSON.parse(localCache);
		return;
	}

	Vue.http.get(`${api}/${this.courseId}/${this.lessonId}`).then((response) => {
		var quizData;
		try {
			quizData = response.data;
		} catch (e) {
			alert('無法載入指定課程');
		}
		this.quizData = quizData;
		sessionStorage.setItem(courseId, JSON.stringify(response.data));
	});
}

store.getQuizData = function (qn) {
	if (typeof qn === 'undefined') {
		return this.quizData;
	} else {
		return this.quizData[qn - 1];
	}
}

store.updateQ = function (qn, cb) {
	// Waiting for loadQuizData
	if (this.quizData === null) {
		setTimeout(() => {this.updateQ(qn, cb)}, 200);
		return;
	}
	if (parseInt(qn) <= 0 || parseInt(qn) > this.getQuizCount()) {
		return;
	}
	this.qn = parseInt(qn);
	var data = this.quizData[parseInt(qn)-1];
	cb(data);
	for (var i = 0; i < this.onUpdateQListener.length; i++) {
		this.onUpdateQListener[i](data);
	}
}

store.onUpdateQ = function (cb) {
	this.onUpdateQListener.push(cb);
}

store.getQuizCount = function () {
	return this.quizData.length;
}

store.setUserCode = function (qn, code) {
	this.userCode[qn] = code;
}

store.onResetCode = function (fn) {
	this.onResetCodeListener = fn;
}

store.resetCode = function (qn) {
	var qData = this.getQuizData(qn);
	if (typeof qData.part !== 'undefined') {
		this.userCode[qn] = qData.part;
	} else {
		this.userCode[qn] = qData.ans;
	}
	this.onResetCodeListener(this.userCode[qn]);
}

store.getUserCode = function (qn) {
	return this.userCode[qn];
}

store.setStdin = function (qn, val) {
	this.stdin[qn] = val;
}

store.getStdin = function (qn) {
	return this.stdin[qn] || '';
}

store.logs = [];

store.addLog = function (title, code, stdin, data, passed) {
	var log = {
		'time': getNow(),
		'title': title,
		'code': code,
		'stdin': stdin,
		'data': data,
		'passed': passed
	};
	this.logs.push(log);
}

store.getLogs = function () {
	return this.logs;
}
