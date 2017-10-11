angular.module('houseIntrCtrl-controller', [])
    .controller('houseIntrCtrl', ['$scope', 'AJKIp', '$location', 'DuplicateLogin', 'systemBusy', '$ionicScrollDelegate', '$stateParams', '$rootScope', 'ApiService', '$ionicLoading', '$timeout', 'houseIntr', '$state', '$ionicActionSheet', '$ionicViewSwitcher', function($scope,AJKIp,$location,DuplicateLogin,systemBusy,$ionicScrollDelegate,$stateParams,$rootScope, ApiService, $ionicLoading,$timeout,houseIntr, $state, $ionicActionSheet,$ionicViewSwitcher) {

	$scope.houseIntr = houseIntr.data.dataObject;
	$scope.back = function(){
		$rootScope.$ionicGoBack();
	};
  $scope.defaultPrice1 = $scope.houseIntr.defaultPrice;
        // 房间设施
	$scope.assorts = $scope.houseIntr.assort.split(',');
	$scope.assorts = $scope.assorts.map(function(assort,index){
		assort = assort.split(':');
		var sheshi = assort[0].split('-')[0];
		var url = 'http:'+assort[1];
		return [sheshi,url];
	});
            //微信风享
	$scope.share = function() {
		var hideSheet = $ionicActionSheet.show({
			buttons: [{
				text: '微信好友'
			}, {
				text: '朋友圈'
			}, ],

			titleText: '分享',
			cancelText: '取消',
			buttonClicked: function(index) {
				hideSheet();
				Wechat.share({
					message: {
						title: $scope.houseIntr.name,
						description: $scope.houseIntr.profiles,
						thumb: $scope.houseIntr.housePictures[0],
						media: {
							type: Wechat.Type.WEBPAGE,
							webpageUrl: AJKIp+$location.path()
						}
					},
					scene: index // share to Timeline
				}, function() {

				}, function(reason) {

				});

			}
		});
	};
  function godataselect(){
    var data = {id:$scope.houseIntr.id,defaultPrice:$scope.defaultPrice1}
    $state.go('selectDate',{data:data})
  }
  $scope.selectDate = function(){
    godataselect()
  }
            //加入购物车
	$scope.joinShopCar = function() {
		if (!localStorage.getItem('customerId')) {
			$state.go('login');
			$ionicViewSwitcher.nextDirection("forward");
		} else {
			if (sessionStorage.getItem('inday') && sessionStorage.getItem('outday')) {
				var data = {
					houseId: $scope.houseIntr.id,
					customerId: localStorage.getItem('customerId'),
					inTime: sessionStorage.getItem('inday'),
					leaveTime: sessionStorage.getItem('outday')
				};

				ApiService.addshopCar(data).success(function(res) {
					if (res.success === true) {
						$state.go('tab.shopCar');
						$ionicViewSwitcher.nextDirection("forward");
						sessionStorage.getItem('inday',''),
            sessionStorage.getItem('outday','');
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


			} else {
				godataselect()
			}
		}
	};
        //滚动置顶
	$scope.$on('getHeight', function() {

	});
	$scope.swipe = function(){
		var scrollTop = $ionicScrollDelegate.getScrollPosition().top;

          //var opacity = angular.element(document.querySelector('#fixed'))[0].style.opacity
		angular.element(document.querySelector('#fixedScroll'))[0].style.opacity = scrollTop*0.005;
		angular.element(document.querySelector('#fixedDefault'))[0].style.opacity =1 - scrollTop*0.005*2;
	};
}]);
