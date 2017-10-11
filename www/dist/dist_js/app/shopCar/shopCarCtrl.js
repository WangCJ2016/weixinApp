angular.module('shopCar-controller', [])
  .controller('shopCarCtrl', ['$scope', 'ApiService', '$state', 'DuplicateLogin', '$ionicViewSwitcher', '$ionicViewSwitcher', '$ionicListDelegate', '$ionicLoading', '$timeout', function($scope, ApiService, $state,DuplicateLogin,$ionicViewSwitcher, $ionicViewSwitcher, $ionicListDelegate, $ionicLoading, $timeout) {
    //关闭所有选项按钮
	$scope.closeDelete = function() {
		$ionicListDelegate.closeOptionButtons();
	};
    //获取购物车列表
	if (!localStorage.getItem('customerId')) {
    $ionicLoading.hide();

    $timeout(function(res){
      $state.go('login');
    //  $ionicLoading.hide();
  },50);
	} else {
		sessionStorage.setItem('inday', '');
		sessionStorage.setItem('outday', '');
		$scope.data = {
			customerId: localStorage.getItem('customerId')
		};

		ApiService.shopCarList($scope.data).success(function(res) {
      if (!res.success) {
        if (res.msg==='非法请求') {
          $ionicLoading.show({
            template: DuplicateLogin
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('login')
          },2000)
        }
      }
			$scope['list'] = res.dataObject;
			$scope.list.forEach(function(hotel) {
				hotel.hotelCheck = false;
				hotel.carts.forEach(function(house) {
					house.houseCheck = false;
				});
			});
			var list = $scope['list'].slice();

        //删除按钮
			$scope.delBtn = function(id,$event) {
				$event.stopPropagation();
				$scope.hid = {
					cartIds: id
				};
				$scope.list.splice();
				ApiService.shopCardel($scope.hid).success(function(res) {
          if(!res.success){
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
				ApiService.shopCarList($scope.data).success(function(res) {
          if (res.success) {
            $scope.list = res.dataObject;
            $scope.allcheck = false;
            $scope.allPrice = 0;
  					$scope.list.forEach(function(order, index) {
  						if (order.carts.length == 0) {
  							order = {};
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

        //单全选按钮
			$scope.checked = false;
			$scope.batchcheck = false;
			$scope.isbatchcheck = function(index) {
				$scope.j = index;
			};
			$scope.allcheck = false;
        //购物车选择按钮
			$scope.allPrice = 0;
			$scope.ischcked = function(e,roomList, hotel) {

				e.stopPropagation();
				roomList.houseCheck = !roomList.houseCheck;
				var isHotelCheck = true;
				var isAll = true;
				hotel.carts.forEach(function(house) {
					if (house.houseCheck == false) {
						isHotelCheck = false;
					}
				});
				hotel.hotelCheck = isHotelCheck;
				$scope.list.forEach(function(hotel) {
					if (hotel.hotelCheck == false) {
						isAll = false;
					}
				});
				$scope.allcheck = isAll;
				getAllPrice();
				getOrderDetail();
			};
			$scope.isbatchcheck = function(list) {
				list.hotelCheck = !list.hotelCheck;
				var isAll = true;
				list.carts.forEach(function(house) {
					house.houseCheck = list.hotelCheck;
				});
				$scope.list.forEach(function(hotel) {
					if (hotel.hotelCheck == false) {
						isAll = false;
					}
				});
				$scope.allcheck = isAll;
				getAllPrice();
				getOrderDetail();
			};
			$scope.isallcheck = function() {
				$scope.allcheck = !$scope.allcheck;
				$scope.list.forEach(function(list) {
					list.hotelCheck = $scope.allcheck == true ? true : false;
					list.carts.forEach(function(house) {
						house.houseCheck = $scope.allcheck == true ? true : false;
					});
				});
				getAllPrice();
				getOrderDetail();
			};
        //计算总价格
			function getAllPrice() {
				$scope.allPrice = 0;
				$scope.list.forEach(function(hotel) {
					hotel.carts.forEach(function(house) {
						if (house.houseCheck) {
							$scope.allPrice = $scope.allPrice + parseInt(house.totalFeel, 10);
						}
					});
				});
			}
        //去酒店详情页面
			$scope.goHotel = function(id) {
				$state.go('houseDtail', {
					id: id
				});
			};
        //去房间详情页面
			$scope.goHouse = function(id) {
				$state.go('house_intr', {
					id: id
				});
			};
        //计算订单参数
			var order = {
				customerId: localStorage.getItem('customerId'),
				hotelIds: '',
				houseIds: '',
				inTimes: '',
				leaveTimes: '',
				totalFees: '',
				depositFees: ''
			};

			var hotels = [];

			function getOrderDetail() {


          // list = $scope.list.slice(0);
				for (var i = 0; i < $scope.list.length; i++) {
					hotels[i] = {};
				}
				for (var i = 0; i < $scope.list.length; i++) {
					hotels[i].hotelName = $scope.list[i].hotelName;
					hotels[i].carts = [];
				}

				$scope.list.forEach(function(hotel, index) {
					hotel.carts.forEach(function(house, index2) {
						if (house.houseCheck) {

							hotels[index].carts.push(house);

						}
					});
				});
			}
        //提交订单
			$scope.goOrderDetail = function() {
        hotels =  hotels.filter(function(hotel){return hotel.carts.length>0})
				if (hotels && hotels.length > 0) {
					$state.go('orderDetail', {
						'order': hotels
					});
				} else {
					$ionicLoading.show({
						template: "请先选择房间",
						noBackdrop: 'true',

					});
					$timeout(function() {
						$ionicLoading.hide();

					}, 1000);
				}

			};
		});
	}
}]);
