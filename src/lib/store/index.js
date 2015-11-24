import Vue from 'vue'
import Resource from 'vue-resource'
Vue.use(Resource);

const store = {};
const api = 'https://codincat.cloudant.com/codellege/';
export default store;

store.groupId = 0;
store.qn = 0;
store.quizData = null;
store.onUpdateQListener = [];

store.setGroup = function (groupId) {
	if (groupId === this.groupId) {
		return;
	}
	this.groupId = groupId;
	console.log(groupId);
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

store.getQuizData = function () {
	return this.quizData;
}

store.updateQ = function (qn, cb) {
	// Waiting for loadQuizData
	if (this.quizData === null) {
		setTimeout(() => {this.updateQ(qn, cb)}, 200);
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

store.logs = [];

store.addLog = function (padname, code, data) {
	var log = {
		'time': getNow(),
		'padname': padname,
		'code': code,
		'data': data
	};
	this.logs.push(log);
}

store.getLogs = function () {
	return this.logs;
}
