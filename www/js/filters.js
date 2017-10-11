angular.module('starter.filters', [])
	.filter('MMdd', function() {
		return function(time) {
			return time.split(' ')[0].slice(5);
		};
	})
	.filter('YYMMdd', function() {
		return function(time) {
			var fds = time.split(' ')[0].split('-');
			return fds.join('.');
		};
	})
	.filter('MMyueddri', function() {
		return function(time) {
			var data = time.split('-');
			return data[1]+'月'+data[2].split(' ')[0]+'日';
		};
	})
	.filter('ant', function() {
		return function(num) {
			var data = num + '';
			 data = data.split('.');
			return data[0];
		};
	});
