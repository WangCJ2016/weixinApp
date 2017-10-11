angular.module('orderDetail-controller', [])
	.controller('orderDetailCtrl', function($scope, $state,$stateParams,systemBusy,DuplicateLogin,$timeout,ApiService, $ionicLoading) {
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

								var alipayClass = navigator.alipay;
								var rsa = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALsXrEde04Keg+sUjV9CVnjb/vyckb1//8OUQucblzg45TPxcDy9KS5sj3d9aFjp9uPrc8p92BYs56ndD5A3NisLR8FhmC1EJcrC97YJeee48O5D75Qk4n5MbnlgmpVwxM3hBacwzS6PDVW5jvS+uDRylEF773cvx4Z9EcOyGhu3AgMBAAECgYEAqEeTsqItNohjeVeEDRF6+7xM7mPZhowRvZWmU37yliQ+rGjWnhs6ZkJJDJ3k9EyEv95wyMpGSTPcr2FhdULj2WvbE1z4c5z2R2463Xwa8Aj9m/MAsRMsxsDZiX3KlG2e5/oPEyXih3b8sMWg5XRazXpIm/2TsNmwlFLFeg0JvQkCQQDa2uOvPy9DWq6ZGBt4ae5n7BwcIi8KTL4fVD1k+IIkF47U0v0tkcBf3AysZr1ymAf5a/90bG7OMDOCBXJs4cXNAkEA2ti4eCHPGSCGLycyjOQybzUwGRyl3HXtJN8XZ97ZSDTaxmLE86NkqH0VL/Ht+bE48ha97B5J+7Ewt9aoVZSjkwJBAMZJoBS9mKLb3GlVED6PK7P4lpde2WPpmDBmcKG1DqSIu55T85OABN5VTx48j9TtrfvsP61KOTKTNXfOW5gPDtkCQFTHF88R6dRmERU7Lg3+aLtD83oG6wnYdSGPetW2Mp4SO54WrQ1lAp1ytz53jiToTpMZ1EEgCrECF0lgUp20kxkCQAtOx3vxz8/IQ6C4whf6HIX/kpD2IbuHcaJVmG8+Vtb697m087a/QX1hlIchQxUaLssl0702BLtz6QqJzZvKRaY=";
								var pubRsa = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB";
								alipayClass.pay({
									"partner": "2088521191418291", //商户ID
									"rsa_private": rsa, //私钥
									"rsa_public": pubRsa, //公钥
									"seller": "2088521191418291", //收款支付宝账号或对应的支付宝唯一用户号
									"subject": "爱居客", //商品名称
									"body": "支付宝支付", //商品详情
									"price": $scope.total, //金额
									"tradeNo": tradeNo,
									"timeout": "30m", //超时设置
									"notifyUrl": "http://www.live-ctrl.com/aijukex/op/op_notifyOrder"
								}, function(res) {
									$state.go('tab.shopCar');
								}, function(res) {

								});
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
	});
