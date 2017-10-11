angular.module('futrue-controller', [])
  .controller('futrueCtrl', ['$scope', 'ApiService', '$cordovaInAppBrowser', '$state', function($scope,ApiService,$cordovaInAppBrowser,$state) {
    var map = new AMap.Map("container", {
       resizeEnable: true
   });
   AMap.service(["AMap.PlaceSearch"], function() {
       var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
           pageSize: 10,
           pageIndex: 1,
           city: "杭州", //城市
           map: map//,
           //panel: "panel"
       });
       //关键字查询
       var lng = sessionStorage.getItem('longitude');
       var lat = sessionStorage.getItem('latitude')
       var pont = [120.065375,30.292008];
       placeSearch.searchNearBy("爱居客", pont, 5000, function(status, result) {
    if (status === 'complete' && result.info === 'OK') {
      console.log(result);
    }
});
   });
  }])
