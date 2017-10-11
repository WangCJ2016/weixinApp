angular.module('myaccount-controller', [])
  .controller('myaccountCtrl', function($scope,$state,ApiService,DuplicateLogin,systemBusy,$timeout,$ionicLoading, $filter) {
	$scope.select = true;

	$scope.now = new Date();
	var year = $scope.now.getFullYear();
	var month = $scope.now.getMonth();
	var select_year = "",
		select_month = "";
	var monthIncome_month = month+1;
	var  monthIncome_year = year;
	$scope.year = year;
	$scope.month = month + 1;
	$scope.dataswitch = false;
	$scope.years = [year - 1, year];
	$scope.months = [];
	$scope.openDatePicker = function() {
		$scope.dataswitch = true;
	};
	$scope.monthSelect = function(year, i) {
		$scope.year = year;
		select_year = year;
		$scope.indexi = i;
		$scope.months = [];
		monthIncome_year = year;
		if ($scope.now.getFullYear() === year) {
			for (var i = 1; i <= month + 1; i++) {
				$scope.months.push(i);
			}
		} else {
			$scope.months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		}

	};
	$scope.daySelect = function(month, i) {
		select_month = month;
		monthIncome_month = month;
		select_month = select_month < 10 ? "0" + select_month : select_month;
		$scope.indexii = i;
		$scope.month = month;
		$scope.dataswitch = false;
		$scope.monthIncome();
    yueshouru();
	};
	$scope.$on('DayIncomes', function() {

	});

    //日收入
	$scope.dayIncome = function(){
		$scope.select = true;
	};
  yueshouru();
  function yueshouru(){
    $scope.monthIncomes = 0;
    var monthIncome = monthIncome_year+'-'+(monthIncome_month<10?'0'+(monthIncome_month):(monthIncome_month+1));
    ApiService.landlordMonthIncome({customerId:localStorage.getItem('customerId'),month:monthIncome})
    .success(function(res){
      if(res.success){
        $scope.incomeOrders = res.dataObject;
        $scope.incomeOrders.forEach(function(order){
          $scope.monthIncomes = $scope.monthIncomes+parseFloat(order.totalFee,10)
        })
          $scope.monthIncomes = $scope.monthIncomes.toFixed(2);
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
  }
  //月收入

  //var now
	$scope.monthIncome = function(){
		$scope.select = false;
	};
});
