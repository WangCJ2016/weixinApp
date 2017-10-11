angular.module('checkIn-controller', [])
  .controller('checkInCtrl', ['$scope', '$rootScope', '$stateParams', 'ApiService', '$state', '$ionicViewSwitcher', function($scope,$rootScope,$stateParams, ApiService, $state, $ionicViewSwitcher) {
    $scope.goack = function() {
      $rootScope.$ionicGoBack();
    };
	$scope.goClean = function() {
		$state.go('clean', {
			data: $stateParams.data
		});
		$ionicViewSwitcher.nextDirection("forward");
	};

	var houseId = $stateParams.data.houseId;
	ApiService.viewHouseHostInfo({
		houseId: houseId
	}).success(function(res) {
		console.log(res)
		if (res.success) {
			sessionStorage.setItem('houseId', encode64(houseId + ''));
			sessionStorage.setItem('serverId', res.dataObject.serverId);
			sessionStorage.setItem('port', res.dataObject.port);
			sessionStorage.setItem('ip', res.dataObject.ip);
			$scope.goLight = function() {
				$state.go('light');
			};
			$scope.goModel = function() {
				$state.go('model');
			};
			$scope.goairCondition = function() {
				$state.go('airCondition');
			};
			$scope.goTv = function() {
				$state.go('tv');
			};
			$scope.goCurtain = function() {
				$state.go('curtain');
			};
			$scope.goLock = function() {
				$state.go('lock', {name: res.dataObject.name});
			};
			$scope.goService = function() {
				$state.go('service');
			};
		}
	});
 //base64加密
	function encode64(input) {
		var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/" + "=";
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return output;
	}
}]);
