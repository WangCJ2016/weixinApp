angular.module('lock-controller', [])
  .controller('lockCtrl', function($scope,ApiService,$rootScope, $stateParams) {
    console.log($stateParams)
    $scope.name = $stateParams.name.replace(/[^0-9]/g, '')
    $scope.goback = function(){
      $rootScope.$ionicGoBack();
    }
  $scope.$on('getPos', function() {
	});
	$scope.$on('getPosEnd',function(){

	});
	$scope.touchStart = function($event) {
	};

	$scope.touchEnd = function($event) {
		var pos = [];
		pos.push($scope.poselevator);
		pos.push($scope.posdoor);
		pos.push($scope.posstream);
		pos.forEach(function(pos,index){
			if($scope.posEnd[0]>=pos[0]&&$scope.posEnd[0]<=pos[1]&&$scope.posEnd[1]>=pos[2]&&$scope.posEnd[1]<=pos[3]){
				$scope.index = index;
			}
		});
		switch($scope.index){
		case 0:
			$scope.elevator = true;
			$scope.door=false;
			$scope.stream = false;
			break;
		case 1:
			$scope.elevator = false;
			$scope.door=true;
			$scope.stream = false;
			break;
		case 2:
			$scope.elevator = false;
			$scope.door=false;
			$scope.stream = true;
			break;
		}

	};

    //获取锁
	var data = {
		ip: sessionStorage.getItem('ip'),
		deviceType: 'FINGERPRINT_LOCK'
	};
	ApiService.ctrlHostDeviceByType(data).success(function(res){
		console.log(res)
		var deviceId = res.dataObject[0].deviceId;
		if(res.dataObject){
			$scope.touchStart = function($event) {

			};
			$scope.touchEnd = function($event) {
				var pos = [];
				pos.push($scope.poselevator);
				pos.push($scope.posdoor);
				pos.push($scope.posstream);

				pos.forEach(function(pos,index){
					if($scope.posEnd[0]>=pos[0]&&$scope.posEnd[0]<=pos[1]&&$scope.posEnd[1]>=pos[2]&&$scope.posEnd[1]<=pos[3]){
						$scope.index = index;
					}
				});
				switch($scope.index){
				case 0:
					$scope.elevator = true;
					$scope.door=false;
					$scope.stream = false;
					break;
				case 1:
					$scope.elevator = false;
					$scope.door=true;
					$scope.stream = false;
					break;
				case 2:
					$scope.elevator = false;
					$scope.door=false;
					$scope.stream = true;
					break;
				}
				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'FINGERPRINT_LOCK',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					deviceId:deviceId,
					subOrderCode:sessionStorage.getItem('subOrderCode')
				};

				ApiService.smartHostControl(data).success(function(res){
					console.log(res)
				});
			};
		}
	});
});
