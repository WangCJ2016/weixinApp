angular.module('nearby-controller', [])
  .controller('nearbyCtrl' ,function($scope, $ionicHistory,$stateParams,ApiService, $ionicBackdrop, $ionicModal) {
    $scope.nowcity = sessionStorage.getItem('city');
    $scope.searchInfo = $stateParams.city;
    if ($scope.searchInfo) {
      $scope.nowcity += '(' + $scope.searchInfo + ')';
    }
    $scope.pageNo = 1;

    //初始刷新
    $scope.typedata1 = $stateParams.city;
    if(sessionStorage.getItem('searchType')==='1'){

      ApiService.queryHotelsPage({
        address: encodeURI(sessionStorage.getItem('city')+'-'+$scope.typedata1, "UTF-8"),
        pageNo: $scope.pageNo,
        type:'mark',
        pageSize: 5
      }).success(function(res) {
        $scope.type = 1
        if (res.success) {
          $scope.hotels = res.result;
          $scope.pageNo++
        }
      });
    }else if(sessionStorage.getItem('searchType')==='2'){
      ApiService.queryHotelsPage({
        address: encodeURI(sessionStorage.getItem('city')+'-'+$scope.typedata1, "UTF-8"),
        pageNo: $scope.pageNo,
        type:'keyWord',
        pageSize: 5
      }).success(function(res) {
        $scope.type = 1
        if (res.success) {
          $scope.hotels = res.result;
          $scope.pageNo++
        }
      });
    }

    //显示筛选
    $scope.flag = false;
    $scope.show = function() {
      $scope.sort = false;
      $scope.flag = !$scope.flag;
      //$ionicBackdrop.retain();
    };

    /*左边渲染*/
    //商圈
    $scope.business = true;
    //价格
    $scope.price = true;
    //地铁
    $scope.metro = true;
    //附近
    $scope.neighbour = true;
    //区域
    $scope.arealist = true;
    $scope.screenlist = ["附近", "商圈", "区域", "地铁"];
    $scope.screenlistClass = function(index) {
      $scope.i = index;
      if (index == 0) {
        $scope.business = true;
        $scope.price = true;
        $scope.metro = true;
        $scope.neighbour = true;
        $scope.arealist = true;
      } else if (index == 1) {
        $scope.price = true;
        $scope.metro = true;
        $scope.neighbour = false;
        $scope.business = false;
        $scope.arealist = true;
        maplist();
      } else if (index == 2) {
        $scope.price = true;
        $scope.metro = true;
        $scope.neighbour = false;
        $scope.business = true;
        $scope.arealist = false;
        areacont();
      } else if (index == 3) {
        $scope.business = true;
        $scope.price = true;
        $scope.neighbour = false;
        $scope.metro = false;
        $scope.arealist = true;
        $scope.metrolist();
      } else if (index == 4) {
        $scope.business = true;
        $scope.metro = true;
        $scope.neighbour = false;
        $scope.price = false;
        $scope.arealist = true;
      } else if (index == 5) {

      }
    };
    /*右边渲染*/
    //附近
    $scope.searchData = '';
    $scope.neighbouringlist = [ "1公里", "3公里", "5公里", "10公里"];
    $scope.neighbouringClass = function(index, data) {
      $scope.j = index;
      $scope.searchData = data;
    };

    //显示排序
    $scope.sort = false;
    $scope.sortshow = function() {
      $scope.flag = false;
      $scope.sort = !$scope.sort;
    };
    $scope.sortlist = ["默认排序", "价格最高", "价格最低", "评分最高", "评分最低", "评价数量最少", "评价数量最多"];
    $scope.sortlistclass = function(index, data) {
      $scope.i = index;
      $scope.searchData = data;
      $scope.sort = false;

      var type = '';
      var orderBy = '';
      switch (data) {
        case '价格最低':
          type = 'price', orderBy = 'desc'
          break;
        case '价格最高':
          type = 'price', orderBy = 'asc'
          break;
        case '评分最低':
          type = 'stars', orderBy = 'desc'
          break;
        case '评分最高':
          type = 'stars', orderBy = 'asc'
          break;
        case '评价数量最少':
          type = 'count', orderBy = 'desc'
          break;
        case '评价数量最多':
          type = 'count', orderBy = 'asc'
          break;
        default:type = 'price', orderBy = 'asc'
      }
      $scope.type2 = type;
      $scope.orderBy = orderBy;
      $scope.pageNo =1;
      //$scope.moreDataCanBeLoaded = true;
      ApiService.queryNearbySearch({type:$scope.type2,orderBy:$scope.orderBy,pageNo: 1,
      pageSize: 7}).success(function(res){
        $scope.type = 2;
        if(res.success){
          $scope.hotels = res.result;
          $scope.pageNo++;
          $scope.moreDataCanBeLoaded = true;
        }
      })
    };
    $scope.maplistClass = function(index, data) {
      $scope.j = index;
      $scope.searchData = data;
    };
    //地图搜索 获取地图返回数据
    function maplist() {
      $scope.businessArr = ["不限"];
      var placeSearchOptions = { //构造地点查询类
        pageSize: 20,
        pageIndex: 1,
        city: sessionStorage.getItem("city") //城市
      };
      var placeSearch = new AMap.PlaceSearch(placeSearchOptions);
      //关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
      placeSearch.search("商圈", callback);
      var placeSearchRender = new Lib.AMap.PlaceSearchRender();

      function callback(status, result) {
        var length = result.poiList.pois.length;
        for (var i = 0; i < length; i++) {
          $scope.businessArr.push(result.poiList.pois[i].name);
        }
        for (var i = 0; i < $scope.businessArr.length; i++) {
          var a = $scope.businessArr[i];
          for (var j = i + 1; j < $scope.businessArr.length; j++) {
            if ($scope.businessArr[j] == a) {
              $scope.businessArr.splice(j, 1);
              j = j - 1;
            }
          }
        }
        $scope.businessClass = function(index, data) {
          $scope.k = index;
          $scope.searchData = data;
        };
        $scope.$apply(function() {
          $scope.businessArr;
        });
      }
      //
    }
    //区域获取
    function areacont() {
      $scope.areaArr = ["不限"];
      var city = sessionStorage.getItem("city");
      if (city == "北京" || city == "上海" || city == "重庆" || city == "天津") {
        city = city + "市市辖区";
      }
      var districtSearch = new AMap.DistrictSearch({
        level: 'city',
        subdistrict: 2
      });
      districtSearch.search(city, function(status, result) {
        var res = result.districtList[0].districtList;
        for (var i = 0, len = res.length; i < len; i++) {
          $scope.areaArr.push(res[i].name);
        }
        $scope.areacontClass = function(index, data) {
          $scope.t = index;
          $scope.searchData = data;
        };
        $scope.$apply(function() {
          $scope.areaArr;
        });
      });
    }
    //地铁线路获取
    var CityReg = /市$/;
    $scope.metrolist = function() {
      $scope.metrolistArr = [];
      var nowcity = sessionStorage.getItem("city");
      if (CityReg.test(nowcity)) {
        nowcity = nowcity.substring(0, nowcity.length - 1);
      }
      ApiService.getMetro().success(function(data) {
        for (var i = 0, len = data.length; i < len; i++) {
          if (data[i].city == nowcity) {
            for (var j = 0, length = data[i].linedata.length; j < length; j++) {
              $scope.metrolistArr.push(data[i].linedata[j].line);
            }
          }
        }
      });
    };
    //metrolist();
    //地铁线路选中
    $scope.metrochecked = function(index, line) {
      $scope.a = index;
      $scope.searchData = line;
      $scope.maplistArr = ["不限"];
      var nowcity = sessionStorage.getItem("city");
      if (CityReg.test(nowcity)) {
        nowcity = nowcity.substring(0, nowcity.length - 1);
      }
      ApiService.getMetro().success(function(data) {
        for (var i = 0, len = data.length; i < len; i++) {
          if (data[i].city == nowcity) {
            for (var j = 0, length = data[i].linedata.length; j < length; j++) {
              if (data[i].linedata[j].line == line) {
                for (var k = 0; k < data[i].linedata[j].linestation.length; k++) {
                  $scope.maplistArr.push(data[i].linedata[j].linestation[k]);
                }
              }
            }
          }
        }
      });
    };


    $ionicModal.fromTemplateUrl("map-modal.html", {
      scope: $scope,
      animation: "slide-in-up"
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we are done with it!
    $scope.$on("$destroy", function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on("modal.hidden", function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on("modal.removed", function() {
      // Execute action
    });
    $scope.mapshow = function() {
      $scope.modal.show();
      //加载地图
      var map = new AMap.Map('HouseOnMap', {
        resizeEnable: true
      });
      //将列表的房子标记到地图
      var lnglats = [
        ["116.4123", "39.906422"],
        ["116.4352", "39.906933"],
        ["116.445435", "39.9054345"]
      ];
      var data = [{
        "price": "￥345",
        "name": "爱居客西溪店"
      }, {
        "price": "￥340",
        "name": "爱居客西溪店"
      }, {
        "price": "￥945",
        "name": "爱居客西溪店"
      }];
      for (var i = 0; i < data.length; i++) {
        var div = document.createElement('div');
        div.className = 'circle';
        div.innerHTML = data[i].name + "<br/>" + data[i].price;
        var marker = new AMap.Marker({
          content: div,
          title: data[i].name,
          position: lnglats[i],
          map: map,
          //offset: new AMap.Pixel(-24, 5),
          zIndex: 300
        });
      }
      map.setFitView();
    };

    $scope.search = function() {
      if ([ "1公里", "3公里", "5公里", "10公里"].indexOf($scope.searchData)>-1) {
        $scope.pageNo = 1
        //$scope.moreDataCanBeLoaded = true;
        $scope.flag = false;
        ApiService.queryNearbySearch({
          type:'distance',
          longitude:120.070041,
          latitude:30.286377,
          distance:$scope.searchData.slice(0,-2),
          pageNo: 1,
          pageSize: 7
        }).success(function(res){
          $scope.type = 4
          if(res.success){
            $scope.hotels = res.result;
            $scope.pageNo++;
            $scope.moreDataCanBeLoaded = true;
          }
        })
      }else{
        $scope.pageNo = 1
        //$scope.moreDataCanBeLoaded = true;
        $scope.flag = false;
        $scope.typedata3 = $scope.nowcity + '-' + $scope.searchData;
        ApiService.queryHotelsPage({
          address: encodeURI($scope.typedata3, "UTF-8"),
          pageNo: 1,
          pageSize: 7
        }).success(function(res) {
          $scope.type = 3
          if (res.success) {
            $scope.hotels = res.result;
            $scope.pageNo++;
            $scope.moreDataCanBeLoaded = true;
          }
        });
      }
    };

    //加载更多
    var pageNo = 1;
    $scope.moreDataCanBeLoaded = true;
    $scope.loadMoreData = function() {
      switch ($scope.type) {
        case 1:
        ApiService.queryHotelsPage({
          address: encodeURI($scope.typedata1, "UTF-8"),
          pageNo:$scope.pageNo,
          pageSize:7
        }).success(function(res) {
          if (res.success && res.result.length > 0) {
            for (var i = 0; i < res.result.length; i++) {
              $scope.hotels.push(res.result[i]);
            }
          $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.pageNo++;
          } else {
            $scope.moreDataCanBeLoaded = false;
          }
        });
          break;
        case 2:
        ApiService.queryNearbySearch({type:$scope.type2,orderBy:$scope.orderBy,pageNo: $scope.pageNo,
        pageSize: 7}).success(function(res){
          if (res.success && res.result.length > 0) {
            for (var i = 0; i < res.result.length; i++) {
              $scope.hotels.push(res.result[i]);
            }
          $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.pageNo++;
          } else {
            $scope.moreDataCanBeLoaded = false;
          };
        });
          break;
        case 3:
        ApiService.queryHotelsPage({
          address: encodeURI($scope.typedata3, "UTF-8"),
          pageNo:$scope.pageNo,
          pageSize:7
        }).success(function(res) {
          if (res.success && res.result.length > 0) {
            for (var i = 0; i < res.result.length; i++) {
              $scope.hotels.push(res.result[i]);
            }
          $scope.$broadcast("scroll.infiniteScrollComplete");
            $scope.pageNo++;
          } else {
            $scope.moreDataCanBeLoaded = false;
          }
        });
          break;
        case 4:
        ApiService.queryNearbySearch({
          type:'distance',
          longitude:120.070041,
          latitude:30.286377,
          distance:$scope.searchData.slice(0,-2),
          pageNo: $scope.pageNo,
          pageSize: 7
        }).success(function(res){
          $scope.type = 4
          if(res.success&&res.result.length > 0){
            for (var i = 0; i < res.result.length; i++) {
              $scope.hotels.push(res.result[i]);
            }
            $scope.pageNo++;
              $scope.$broadcast("scroll.infiniteScrollComplete");
          }else{
            $scope.moreDataCanBeLoaded = false;
          }
        })
          break;
        default:
         break;
       }
    };

  });
