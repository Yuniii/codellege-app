import Vue from 'vue'
import Resource from 'vue-resource'
Vue.use(Resource);

import { getNow } from './../util.js'

const store = {};
const api = 'https://codincat.cloudant.com/codellege/';
export default store;

store.groupId = 0;
store.qn = 0;
store.quizData = null;
store.onUpdateQListener = [];
store.onResetCodeListener = null;
store.userCode = [];
store.stdin = [];

store.setGroup = function (groupId) {
	if (groupId === this.groupId) {
		return;
	}
	this.groupId = groupId;
	this.loadQuizData(groupId);
}

store.loadQuizData = function (groupId) {
	var localCache = sessionStorage.getItem(groupId);
	if (localCache !== null) {
		this.quizData = JSON.parse(localCache);
		return;
	}
	var queryObj = {
		"selector": { "id": parseInt(groupId) }
	};

	Vue.http.post(api + '_find', JSON.stringify(queryObj), (data, status, req) => {
		if (data.docs.length !== 0) {
			this.quizData = data.docs[0].content;
			sessionStorage.setItem(groupId, JSON.stringify(this.quizData));
		}
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

store.addLog = function (title, code, stdin, data) {
	var log = {
		'time': getNow(),
		'title': title,
		'code': code,
		'stdin': stdin,
		'data': data
	};
	this.logs.push(log);
}

store.getLogs = function () {
	return this.logs;
}
