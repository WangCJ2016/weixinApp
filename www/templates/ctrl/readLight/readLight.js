angular.module("readLight-controller",[])
.controller("readLightCtrl",function($scope,$rootScope,ApiService){
	$scope.goback = function(){
	  $rootScope.$ionicGoBack();
	}
	$scope.check = {
		white:false,
		warm:false
	};
	$scope.brightness = {
		value1:50,
		value2:50
	};
	var data = {
		deviceType:'DIMMER',
		ip:sessionStorage.getItem('ip')
	};
	ApiService.ctrlHostDeviceByType(data).success(function(res){
		if(res.dataObject){
			var whiteLight = res.dataObject[0].ways.filter(function(data){
				return data.name == '调光白光';
			});
			var warmLight = res.dataObject[0].ways.filter(function(data){
				return data.name == '调光暖黄';
			});
			$scope.whiteService = function(){
				var type = $scope.check.white?'OPEN':'CLOSE';
				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'SWITCH',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					actionType:type,
					wayId:whiteLight[0].wayId,
					brightness:90
				};
				ApiService.smartHostControl(data);
			};
			$scope.warmService = function(){
				var type = $scope.check.warm?'OPEN':'CLOSE';
				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'SWITCH',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					actionType:type,
					wayId:warmLight[0].wayId,
					brightness:90
				};
				ApiService.smartHostControl(data);
			};

			$scope.changeSubmit = function(brightness,type){
				var wayId = type =='调光白光'?whiteLight[0].wayId:warmLight[0].wayId;
				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'SWITCH',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					actionType:'OPEN',
					wayId:wayId,
					brightness:brightness
				};
				ApiService.smartHostControl(data);
			};
		}
	});
});
