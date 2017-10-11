angular.module('Noevaluate-controller', [])
.controller('NoevaluateCtrl',function($scope,$state,ApiService,DuplicateLogin,systemBusy,$timeout,$ionicLoading){
	 if(!localStorage.getItem('customerId')){
		$state.go('login');
	 }else{
		 $scope.pageNo=1;
		 $scope.moreDataCanBeLoaded = true;
		 ApiService.queryJudgeOrders({
			 customerId:localStorage.getItem('customerId'),
			 pageNo: $scope.pageNo,
			 pageSize: 5
		 }).success(function(res){

			 if (res.success) {
				 $scope.hotels = res.result;
  			 $scope.pageNo++;
  			 $scope.goevaluate = function(hotelId,houseId,hotelName,picture,subOrderCode){
  				 var data = {hotelId:hotelId,houseId:houseId,hotelName:hotelName,picture:picture,subOrderCode:subOrderCode};
  				 
  				 $state.go('evaluate',{data:data});
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
		 //加载
		 $scope.loadMoreData = function() {
			 ApiService.queryJudgeOrders({
				 customerId:localStorage.getItem('customerId'),
				 pageNo: $scope.pageNo,
				 pageSize: 5
			 }).success(function(res) {
				 if (res.success) {
					 if(res.result.length > 0){
						 for (var i = 0; i < res.result.length; i++) {
							 $scope.hotels.push(res.result[i]);
						 }
							$scope.$broadcast("scroll.infiniteScrollComplete");
						 $scope.pageNo++;
					 }else {
					 	$scope.moreDataCanBeLoaded = false;
					 }

				 } else {
					 $scope.moreDataCanBeLoaded = false;
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
	 }
});
