export function getNow() {
	var now = new Date();
	var h = now.getHours(),
		m = now.getMinutes(),
		s = now.getSeconds();
	if (h < 10) h = '0' + h;
	if (m < 10) m = '0' + m;
	if (s < 10) s = '0' + s;

	return '' + h + ':' + m + ':' + s;
}

export function checkAnswer(user, std) {
	if (user === std || user.trim() === std.trim())
		return true;
	return false;
}
