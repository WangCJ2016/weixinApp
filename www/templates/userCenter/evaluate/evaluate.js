angular.module("evaluate_controller",[])
.controller("evaluateCtrl",function($scope,$stateParams,$state,ApiService,DuplicateLogin,systemBusy,$ionicLoading,$timeout){

	$scope.hotelName = $stateParams.data.hotelName;
	$scope.picture = $stateParams.data.picture;
	$scope.star=5;
	$scope.message = {
		content:''
	};
	$scope.stars = ['star_full','star_full','star_full','star_full','star_full'];
	$scope.selectStar=function(num){
		var num = num+1;
		var star_full=[],star = [];
		for(var i=0;i<num;i++){
			star_full.push('star_full');
		}
		for(var i=0;i<5-num;i++){
			star.push('star');
		}
		$scope.stars = star_full.concat(star);

		$scope.star = num;
	};
	$scope.submit = function(){
		var data = {
			hotelId:$stateParams.data.hotelId,
			houseId:$stateParams.data.houseId,
			customerId:localStorage.getItem('customerId'),
			content:encodeURI($scope.message.content),
			stars:$scope.star,
			subOrderCode:$stateParams.data.subOrderCode,
			picture:''
		};
		ApiService.customerFeedBack(data).success(function(res){
			
			if(res.success){

				$ionicLoading.show({
					template:'评价成功'
				});
				$timeout(function(res){
					$ionicLoading.hide();
					$state.go('Noevaluate');
				},2000)
			}else {
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
	};
});
