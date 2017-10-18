angular.module('checkIn-controller', [])
  .controller('checkInCtrl', function($scope,$rootScope,$stateParams,$interval,encode64 ,ApiService, $state, $ionicViewSwitcher) {
    $scope.goack = function() {
      $rootScope.$ionicGoBack();
    };
	$scope.goClean = function() {
		$state.go('clean', {
			data: $stateParams.data
		});
		$ionicViewSwitcher.nextDirection("forward");
	};
	
	$scope.figures = [
    {name:'curtain',title:'窗帘',path:'curtain'},
    {name:'lock',title:'门锁',path:'lock'},
    {name:'light',title:'灯',path:'light'},
    {name:'tv',title:'电视',path:'tv'},
    {name:'service',title:'服务',path:'service'},
    {name:'air',title:'空调',path:'airCondition'},
    {name:'model',title:'情景',path:'model'}
   ]
   $scope.activeIndex = 0
   var timer = $interval(function() {
      $scope.activeIndex = ($scope.activeIndex + 1)%7
    },3900)

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
			sessionStorage.setItem('ctrl_houseName', res.dataObject.name);
		}
	});

	

	// 退出时取消interval 事件
	$scope.$on("$destroy", function() {
    $interval.cancel(timer);      
   })
});
