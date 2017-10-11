angular.module("colorPicker-controller", [])
  .controller("colorPickerCtrl", ['$scope', '$rootScope', 'ApiService', function($scope, $rootScope,ApiService) {
	$scope.color1 = ['red','green','blue','white'];
	$scope.color2 = ['yellow','pink','cornflowerblue','orange'];

  $scope.goback = function() {
    $rootScope.$ionicGoBack();
  };
	$scope.$on('rgbChange', function() {
	});
	var data = {
		deviceType: 'VIRTUAL_RGB_REMOTE',
		ip: '192.168.1.102'
	};
	ApiService.ctrlHostDeviceByType(data).success(function(res) {
		$scope.deviceId = res.dataObject[0].deviceId;
	});
	$scope.changeRgb = function() {
		var r = $scope.rgb[0];
		var g = $scope.rgb[1];
		var b = $scope.rgb[2];
		var rgb = 'r=' + r + '&g=' + g + '&b=' + b;
		var data = {
			houseId: sessionStorage.getItem('houseId'),
			deviceType: 'VIRTUAL_RGB_REMOTE',
			port: sessionStorage.getItem('port'),
			serverId: sessionStorage.getItem('serverId'),
			deviceId:$scope.deviceId,
			key: 'ON',
			rgb:rgb
		};
		ApiService.smartHostControl(data);
	};
    //关闭
	$scope.color = function(){
		var data = {
			houseId: sessionStorage.getItem('houseId'),
			deviceType: 'VIRTUAL_RGB_REMOTE',
			port: sessionStorage.getItem('port'),
			serverId: sessionStorage.getItem('serverId'),
			deviceId:$scope.deviceId,
			key: 'OFF',
			rgb:'*'
		};
		ApiService.smartHostControl(data);
	};
	$scope.colorSubmit = function(color){
		var key = color.slice(0,1).toUpperCase();
		var data = {
			houseId: sessionStorage.getItem('houseId'),
			deviceType: 'VIRTUAL_RGB_REMOTE',
			port: sessionStorage.getItem('port'),
			deviceId:$scope.deviceId,
			serverId: sessionStorage.getItem('serverId'),
			key: key,
			rgb:'*'
		};

		ApiService.smartHostControl(data).success(function(res){

		});
	};
}]);
