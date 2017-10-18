angular.module("service-controller", []).controller("serviceCtrl", ['$scope', '$rootScope', 'ApiService', function($scope,$rootScope, ApiService) {
  $scope.goback = function() {
    $rootScope.$ionicGoBack();
  }
  
  $scope.check = {
    dnd: 'CLOSE',
    clean: 'CLOSE'
  };
  var data = {
    ip: sessionStorage.getItem('ip'),
    deviceType: 'SWITCH',
    houseId: sessionStorage.getItem('houseId')
  };

  ApiService.querySmartDeviceWays(data).success(function(res) {
    console.log(res)
    if (res && res.success) {
      if (res.dataObject.ways) {

        var dnd = res.dataObject.ways.filter(function(data) {
          return data.name == '请勿打扰';
        });
        var clean = res.dataObject.ways.filter(function(data) {
          return data.name == '请即清理';
        });
        $scope.modelClick = function(type) {
        	var way,_type;
        	if (type === 'qingli') {
        		$scope.check.clean === 'CLOSE'? 
        			$scope.check = {
						    dnd: 'CLOSE',
						    clean: 'OPEN'
						  } : 
						  $scope.check = {
						    dnd: 'CLOSE',
						    clean: 'CLOSE'
						  }
						way = clean;
						_type = $scope.check.clean
        	}
        	if (type === 'darao') {
        		$scope.check.dnd === 'CLOSE'? 
        			$scope.check = {
						    dnd: 'OPEN',
						    clean: 'CLOSE'
						  } : 
						  $scope.check = {
						    dnd: 'CLOSE',
						    clean: 'CLOSE'
						  }
						way = dnd
						_type = $scope.check.dnd
        	}
        	var data = {
            houseId: sessionStorage.getItem('houseId'),
            deviceType: 'SWITCH',
            port: sessionStorage.getItem('port'),
            serverId: sessionStorage.getItem('serverId'),
            actionType: _type,
            wayId: way[0].wayId,
            brightness: 90
          };
          ApiService.smartHostControl(data).success(function(res) {
          	console.log(res)
          });
        }
    
      }
    }
  });
}]);
