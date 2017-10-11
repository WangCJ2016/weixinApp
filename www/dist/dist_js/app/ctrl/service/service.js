angular.module("service-controller",[]).controller("serviceCtrl",['$scope', '$rootScope', 'ApiService', function($scope,$rootScope,ApiService){
	$scope.goback = function(){
	  $rootScope.$ionicGoBack();
	}
	$scope.check = {
		dnd:false,
		clean:false
	};
	$scope.dndService = function(){

	};
	var data = {
		ip: sessionStorage.getItem('ip'),
		deviceType: 'SWITCH'
	};
	ApiService.querySmartDeviceWays(data).success(function(res){
		if(res.dataObject){

			var dnd = res.dataObject.filter(function(data){
				return data.name == '请勿打扰';
			});
			var clean = res.dataObject.filter(function(data){
				return data.name == '请即清理';
			});

			$scope.dndService = function(){
				var type = $scope.check.dnd?'OPEN':'CLOSE';
				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'SWITCH',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					actionType:type,
					wayId:dnd[0].wayId,
					brightness:90
				};

				ApiService.smartHostControl(data).success(function(res){});
			};
			$scope.cleanService = function(){
				var type = $scope.check.clean?'OPEN':'CLOSE';
				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'SWITCH',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					actionType:type,
					wayId:clean[0].wayId,
					brightness:90
				};
				ApiService.smartHostControl(data).success(function(res){});
			};
		}
	});
}]);
