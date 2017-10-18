angular.module('orderDetail-controller', [])
	.controller('orderDetailCtrl', ['$scope', '$state', '$stateParams', 'systemBusy', 'DuplicateLogin', '$timeout', 'ApiService', '$ionicLoading', function($scope, $state,$stateParams,systemBusy,DuplicateLogin,$timeout,ApiService, $ionicLoading) {
		//是否是ios
		if (ionic.Platform.isIOS()) {
			$scope.platform = true;
		} else if (ionic.Platform.isAndroid()) {
			$scope.platform = false;
		}
			//订单信息
		$scope.hotels = $stateParams.order;
		//发票页面
		$scope.goInvoice = function(){
			$state.go('invoice',{order:$stateParams.order});
		};
		//选择时间
		$scope.arriveTime = ['14:00', '15:00', '16:00', '17:00', '18:00'];
		$scope.indexi = 2;
		$scope.time = $scope.arriveTime[$scope.indexi];
		$scope.time_select = false;
		$scope.select = function(i) {
			$scope.indexi = i;
			$scope.time = $scope.arriveTime[$scope.indexi];
		};
		$scope.time_submit = function() {
			$scope.time_select = false;
		};
			//合计总价
		// $scope.total = 0;
		// for (var i = 0; i < $scope.hotels.length; i++) {
		// 	for (var j = 0; j < $scope.hotels[i].carts.length; j++) {
		// 		$scope.total += parseInt($scope.hotels[i].carts[j].totalFeel, 10)+parseInt($scope.hotels[i].carts[j].depositFee,10);
		// 	}
		// }
		$scope.total = 0;
		for (var i = 0; i < $scope.hotels.length; i++) {
			for (var j = 0; j < $scope.hotels[i].carts.length; j++) {
				$scope.total += parseFloat($scope.hotels[i].carts[j].totalFeel)+parseFloat($scope.hotels[i].carts[j].depositFee,10);
			}
		}
		$scope.total = $scope.total.toFixed(2)
		//提交
		$scope.submit = function() {
			var data = {
					houseIds: '',
					inTimes: '',
					leaveTimes: ''
				},
				data2 = {
					customerId: localStorage.getItem('customerId'),
					hotelIds: '',
					houseIds: '',
					inTimes: '',
					leaveTimes: '',
					totalFees: ''
				};
			var houseIds = [],
				inTimes = [],
				leaveTimes = [],
				hotelIds = [],
				totalFees = [],
				depositFees = [];
			$scope.hotels.forEach(function(hotel) {
				hotel.carts.forEach(function(house) {
					houseIds.push(house.houseId);
					inTimes.push(house.inTime.split(' ')[0]);
					leaveTimes.push(house.leaveTime.split(' ')[0]);
					hotelIds.push(house.hotelId);
					totalFees.push(house.totalFeel);
					depositFees.push(house.depositFee);

				});
			});
			data.houseIds = houseIds.join(',');
			data.inTimes = inTimes.join(',');
			data.leaveTimes = leaveTimes.join(',');
			data2.houseIds = houseIds.join(',');
			data2.inTimes = inTimes.join(',');
			data2.leaveTimes = leaveTimes.join(',');
			data2.hotelIds = hotelIds.join(',');
			data2.totalFees = totalFees.join(',');
			data2.depositFees = depositFees.join(',');
			ApiService.checkHouseWhetherReserve(data).success(function(res) {
				if (res.success == true) {
					ApiService.submitOrder(data2).success(function(res) {
						if(res.success){
							//删除购物车内容
							var carIds = '';
						 $stateParams.order[0].carts.forEach(function(house){
							 carIds+=house.id+',';
						 });
						 carIds = carIds.slice(0,-1);
							ApiService.shopCardel({cartIds:carIds}).success(function(res){
							});
							var tradeNo = res.dataObject.orderCode;
							var orderDetail = res.dataObject;
							if (res.success) {
								ApiService.getOrderInfo({orderCode: tradeNo, fee: $scope.total})
								.success(function(res) {
									console.log(res)
									_AP.pay('https://mapi.alipay.com/gateway.do?' + res.dataObject);
								})
							}
						}else{
							$ionicLoading.show({
		            template: res.msg
		          });
		          $timeout(function(){
		            $ionicLoading.hide();
		            $state.go('tab.home')
		          },2000)
						}
					});
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
            $state.go('tab.home')
          },2000)
        }
				}
			});
		};
	}]);
