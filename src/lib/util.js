export function getNow() {
	var now = new Date();
	return '' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
}
