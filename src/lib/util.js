export function getNow() {
	var now = new Date();
	return '' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}

export function checkAnswer(user, std) {
	if (user === std || user === std + '\n')
		return true;
	return false;
}
