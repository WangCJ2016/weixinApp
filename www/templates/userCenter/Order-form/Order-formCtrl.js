angular.module('Orderform-controller', [])
    .controller('OrderformCtrl', function($scope, $stateParams, ApiService,DuplicateLogin,systemBusy,$ionicLoading, $timeout, $state,$ionicPopup) {
    
	ApiService.viewOrderDetail({
		orderCode: $stateParams.id
	}).success(function(res) {
		if (res.success) {
			$scope.order = res.dataObject;
            //支付订单

		$scope.pay = function() {
      var tradeNo = res.dataObject.orderCode
			var alipayClass = navigator.alipay;
      var price = res.dataObject.totalFee;
			var rsa = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALsXrEde04Keg+sUjV9CVnjb/vyckb1//8OUQucblzg45TPxcDy9KS5sj3d9aFjp9uPrc8p92BYs56ndD5A3NisLR8FhmC1EJcrC97YJeee48O5D75Qk4n5MbnlgmpVwxM3hBacwzS6PDVW5jvS+uDRylEF773cvx4Z9EcOyGhu3AgMBAAECgYEAqEeTsqItNohjeVeEDRF6+7xM7mPZhowRvZWmU37yliQ+rGjWnhs6ZkJJDJ3k9EyEv95wyMpGSTPcr2FhdULj2WvbE1z4c5z2R2463Xwa8Aj9m/MAsRMsxsDZiX3KlG2e5/oPEyXih3b8sMWg5XRazXpIm/2TsNmwlFLFeg0JvQkCQQDa2uOvPy9DWq6ZGBt4ae5n7BwcIi8KTL4fVD1k+IIkF47U0v0tkcBf3AysZr1ymAf5a/90bG7OMDOCBXJs4cXNAkEA2ti4eCHPGSCGLycyjOQybzUwGRyl3HXtJN8XZ97ZSDTaxmLE86NkqH0VL/Ht+bE48ha97B5J+7Ewt9aoVZSjkwJBAMZJoBS9mKLb3GlVED6PK7P4lpde2WPpmDBmcKG1DqSIu55T85OABN5VTx48j9TtrfvsP61KOTKTNXfOW5gPDtkCQFTHF88R6dRmERU7Lg3+aLtD83oG6wnYdSGPetW2Mp4SO54WrQ1lAp1ytz53jiToTpMZ1EEgCrECF0lgUp20kxkCQAtOx3vxz8/IQ6C4whf6HIX/kpD2IbuHcaJVmG8+Vtb697m087a/QX1hlIchQxUaLssl0702BLtz6QqJzZvKRaY=";
			var pubRsa = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDI6d306Q8fIfCOaTXyiUeJHkrIvYISRcc73s3vF1ZT7XN8RNPwJxo8pWaJMmvyTn9N4HQ632qJBVHf8sxHi/fEsraprwCtzvzQETrNRwVxLO5jVmRGi60j8Ue1efIlzPXV9je9mkjzOmdssymZkh2QhUrCmZYI/FCEa3/cNMW0QIDAQAB";
			alipayClass.pay({
				"partner": "2088521191418291", //商户ID
				"rsa_private": rsa, //私钥
				"rsa_public": pubRsa, //公钥
				"seller": "2088521191418291", //收款支付宝账号或对应的支付宝唯一用户号
				"subject": "爱居客", //商品名称
				"body": "支付宝支付", //商品详情
				"price": price, //金额
				"tradeNo": tradeNo,
				"timeout": "30m", //超时设置
				"notifyUrl": "http://www.live-ctrl.com/aijukex/op/op_notifyOrder"
			}, function(resultStatus) {
        $state.go('tab.ctrl');
			}, function(message) {

			});
		};
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
            template: systemBusy
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('tab.home')
          },2000)
        }
  }
	});

        //取消订单
	$scope.cancelOrder = function() {
		$ionicPopup.confirm({
			template: "确定要取消订单吗",
			buttons: [{
				text: '确定',
				onTap: function(e) {
					return 1;
				}
			}, {
				text: '取消'
			}],
			cssClass: 'ajk'
		})
    .then(function(res) {
	if (res) {
		ApiService.cancelOrder({
			orderCode: $stateParams.id
		}).success(function(res) {
      if(res.success){
        $ionicLoading.show({
  				template: '取消成功'
  			});
  			$timeout(function() {
  				$ionicLoading.hide();
  			}, 2000);
  			$state.go('Nopay');
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
            template: systemBusy
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('tab.home')
          },2000)
        }
      }
		});
	} else {

	}
});

	};

});
