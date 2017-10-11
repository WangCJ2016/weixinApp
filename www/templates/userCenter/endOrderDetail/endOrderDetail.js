angular.module('endOrderDetail-controller', [])
  .controller('endOrderDetailCtrl', function($scope,$stateParams) {
    var house
    $scope.order = $stateParams.data;
    if($scope.order.mark){
      $scope.order.hotelsx.map(function(hotel){
        house = hotel.houses.map(function(house){
                house.mark = $scope.order.mark
              })
      })
    }
  })
