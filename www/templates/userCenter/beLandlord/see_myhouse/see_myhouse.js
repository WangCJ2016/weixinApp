angular.module('seeHouse-controller', [])
	.controller('seeHouseCtrl', function($scope, ApiService, $state, $stateParams, hotel) {
		$scope.hotel = hotel.data.dataObject;
		$scope.pics = [];
		hotel.data.dataObject.pictures.forEach(function(pic,index){
			var picArray = pic.pictures.split(',');
			for (var i = 0; i < picArray.length; i++) {
				$scope.pics.push(picArray[i]);
			}
		});
	});
