angular.module('maintain-controller', [])
.controller('maintainCtrl',['$scope', '$rootScope', 'ApiService', '$stateParams', '$ionicLoading', '$timeout', function($scope,$rootScope,ApiService,$stateParams,$ionicLoading,$timeout){
	$scope.goback = function(){
	  $rootScope.$ionicGoBack();
	}
	var data = {
		hotelId:sessionStorage.getItem('serviceHotelId'),
		customerId:localStorage.getItem('customerId'),
		houseId:sessionStorage.getItem('serviceHouseId'),
		type:$stateParams.id
	}
	$scope.waitingStatus = false;
	$scope.handleStatus = false;
	$scope.completeStatus = false;
	ApiService.serviceHandleRecords(data).success(function(res){
		if (res.success) {
			if (res.result.length==0) {
				$scope.contenSwitch=true;
			}else {
				$scope.contenSwitch=false;
				switch (res.result[0].content) {
					case '等待':
						$scope.waitingStatus = true;
						break;
					case '正在':
						$scope.handleStatus = true;
						break;
					case '完成':
						$scope.completeStatus = true;
						break;
					default:
						break
				}
			}
		}
	})
	$scope.contenSwitch=true;
	$scope.timeSwitch = false;
	$scope.repairThings = ['空调','电视机','灯','门锁','窗帘','其他'];
	$scope.selectApplication = $scope.repairThings[0];
	$scope.selectRepair = function(id,thing){
		$scope.index = id;
		$scope.timeSwitch = false;
		$scope.selectApplication = thing;
	};
	$scope.changeRepair=function(){
		$scope.timeSwitch = true;
	};
	$scope.timeSwitch1 = function(){
		$scope.timeSwitch = false;
	};
	//提交维修申请
	$scope.submitRepair = function(){
		var maintainData = {
			hotelId:sessionStorage.getItem('serviceHotelId'),
			customerId:localStorage.getItem('customerId'),
			houseId:sessionStorage.getItem('serviceHouseId'),
			content:encodeURI($scope.selectApplication),
			type:2
		}
		ApiService.customerCallService(maintainData).success(function(res){
			if (res.success) {

				$scope.contenSwitch=false;
				$ionicLoading.show({
					template:'提交成功'
				})
				$timeout(function(res){
					$ionicLoading.hide();
				})
			}
		})
	}
}]);
