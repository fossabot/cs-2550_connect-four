$(function() {
	$('#title').setText('msg');
	$('.msg').setText('inDiv');
});

$.beforeUnload(function() {
	return 'Hello Message One!';
});

$.beforeUnload(function() {
	return 'Hello Message Two!';
});
