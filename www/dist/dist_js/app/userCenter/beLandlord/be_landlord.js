angular.module('beLandlord-controller', [])
    .controller('beLandlord', ['$scope', 'ApiService', '$state', function($scope,ApiService,$state) {
      $scope.select = false;
      ApiService.getCustomerInfo({customerId: localStorage.getItem('customerId')})
      .success(function(res){
         console.log(res)
         if (res.success) {
           if (res.dataObject.type===1) {
             $scope.select = true
           }
         }
      })
	$scope.figureDatas = [{ img: 'my_account', figcaption: '我的收入' }, { img: 'join_us', figcaption: '我的收入' }, { img: 'my_house', figcaption: '我的收入' }];
	$scope.active = function() {
		$scope.select = true;
	};
  $scope.goNext = function(url){
    $state.go(url)
  }
}]);
