angular.module('discover-controller', [])
  .controller('discoverCtrl', function($scope, $state,$ionicModal,$cordovaInAppBrowser) {
	// if (ionic.Platform.isIOS()) {
	// 	cordova.ThemeableBrowser.open('http://m.amap.com/around/?locations=116.470098,39.992838&keywords=美食,KTV,地铁站,公交站&defaultIndex=3&defaultView=&searchRadius=5000&key=db834b40077df1a9574a3faf3cd17f72', '_blank', {
	// 		statusbar: {
	// 			color: '#ffffffff'
	// 		},
	// 		toolbar: {
	// 			height: 24,
	// 			color: '#222635ff'
	// 		},
	// 		title: {
	// 			color: '#000000',
	// 			staticText:'',
	// 			showPageTitle: false
	// 		},
	// 		closeButton: {
	// 			image: 'www/imgs/wcj/close.png',
	// 			imagePressed: 'www/imgs/wcj/close.png',
	// 			align: 'left',
	// 			event: 'closePressed'
	// 		},
	// 		backButtonCanClose: true
	// 	}).addEventListener('closePressed', function(e) {
  //       $state.go('tab.home')
	// 	});
	// }
  var defaultOptions = {
    location: 'no',
     clearcache: 'yes',
     toolbar: 'yes'
};
//$cordovaInAppBrowserProvider.setDefaultOptions(options);
var lng = sessionStorage.getItem('longitude');
var lat = sessionStorage.getItem('latitude');
$cordovaInAppBrowser.open('http://m.amap.com/around/?locations='+lng+','+lat+'&keywords=美食,KTV,地铁站,公交站&defaultIndex=3&defaultView=&searchRadius=5000&key=db834b40077df1a9574a3faf3cd17f72', '_blank', defaultOptions)
    .then(function(event) {
      $state.go('tab.home')
      // success
    })
    .catch(function(event) {
      // error
    });
});
