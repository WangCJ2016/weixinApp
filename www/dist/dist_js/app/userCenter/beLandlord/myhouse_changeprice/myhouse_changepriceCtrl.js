angular.module('myhouseChangePrice-controller', [])
  .controller('myhouseChangepriceCtrl', ['$scope', '$stateParams', '$state', '$rootScope', '$ionicLoading', 'DuplicateLogin', 'systemBusy', 'roomPrice', '$stateParams', 'ApiService', '$ionicPopup', '$timeout', '$rootScope', function($scope,$stateParams,$state,$rootScope,$ionicLoading,DuplicateLogin,systemBusy, roomPrice, $stateParams, ApiService, $ionicPopup, $timeout, $rootScope) {
    $scope.houseName = $stateParams.name
    $scope.defaultPrice = $stateParams.price;
  $scope.changedate = [];
	if (roomPrice.data.success == true) {
		roomPrice.data.dataObject.forEach(function(month) {
			$scope.changedate.push(month);
		});

	}
	$scope.price = '200';
	$scope.changePrice = function() {


		$scope.data = {};

      // 调用$ionicPopup弹出定制弹出框
		$ionicPopup.show({
			template: "<input type='number' ng-model='data.price'>",
			title: "请输入修改价格",
			scope: $scope,
			buttons: [{
				text: '确定',
				onTap:function(){
					return $scope.data.price;
				}
			}, {
				text: '取消'
			}],
			cssClass: 'ajkChange',
		})
        .then(function(res) {
	changedates = localStorage.getItem('changedates');
	$scope.pricedata = {
		houseId: $stateParams.id,
		dates: changedates,
		price: ''
	};
	$scope.pricedata.price = res;

	ApiService.landlordModifyHousePrice($scope.pricedata).success(function(res) {

		if (res.success) {
      localStorage.setItem('changedates','');
			var attr_months = localStorage.getItem('attr_months').split(',');
			var $index = localStorage.getItem('$index').split(',');
			for (var i=0;i<attr_months.length;i++) {
				$scope.dates[attr_months[i]].thismonth[$index[i]].datePrice = $scope.pricedata.price;
			}
      //location.reload() ;
			$rootScope.$broadcast('datesChange');
			$ionicLoading.show({
				template: '修改成功'
			});
			$timeout(function() {
				$ionicLoading.hide();
			}, 1000);
		}else{
      if (res.msg==='非法请求') {
          $ionicLoading.show({
            template: DuplicateLogin
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('login')
          },2000)
        }else {
          $ionicLoading.show({
            template: res.msg
          });
          $timeout(function(){
            $ionicLoading.hide();
          },2000)
        }
    }
	});
});

	};

	$scope.submit = function() {
		$scope.data.startDate = $scope.startTime;
		$scope.data.endDate = $scope.endTime;

	};
   //返回
	$scope.back = function(){
		$rootScope.$ionicGoBack();
	};
}]);
