angular.module('starter.directives', [])

  .directive('dateSelect', function($rootScope) {
    return {
      restrict: 'EA',
      template: '<div class="months" month="date.attr_month" ng-repeat="date in dates">' +
        '<div class="month">{{date.month|date:"yyyy-MM"}}</div>' +
        '<div><div class="date" ng-repeat="week in date.weeks"><div>{{week}}</div></div></div>' +
        '<div><div class="day" ng-repeat="day in date.lastmonth track by $index ">{{day}}</div>' +
        '<div class="date" ng-repeat="day in date.thismonth track by $index" ng-class={selectColor:day.selRow} ng-disabled={{day.disabled}} ng-click="day.disabled||ngshowif(date,$index,date.attr_month);"><div>{{day.today||day.k}}</div><p>¥{{day.datePrice||day.defaultPrice}}</p></div></div>' +
        '</div>',
      link: function(scope, ele, attr) {
        scope.count = 0;
        // var attr_month = attr.month ? parseInt(attr.month, 10) : 0;
        var attr_months = [0, 1, 2];
        var year, month;
        var todayMonth = new Date().getMonth();
        scope.dates = [];
        for (var i = 0; i < attr_months.length; i++) {
          var attr_month = attr_months[i];
          getDate();
        }

        scope.changedate.forEach(function(month, i) {
          month.forEach(function(date) {
            if (date.slice(-4) !== 'null') {
              var k = parseInt(date.slice(8, 10), 10) - 1;
              scope.dates[i].thismonth[k].datePrice = date.slice(11);
            }
          });
        });
        scope.ngshowif = function(date, i, attr_month) {

          date.thismonth[i].selRow = true;
          scope.count++;
          if (scope.count == 1) {
            first_attrmonth = date.attr_month;
            scope.firsti = i;
            date.thismonth[scope.firsti].k = '入住';
            scope.firtseclectday = [i, attr_month];
            sessionStorage.setItem('inday', year + '-' + (todayMonth + 1 + attr_month) + '-' + (scope.firsti + 1) + ' ' + '00:00:00');
          }

          if (scope.count == 2) {
            if (i == scope.firtseclectday[0] && attr_month == scope.firtseclectday[1]) {
              date.thismonth[i].selRow = false;
              date.thismonth[scope.firsti].k = scope.firtseclectday[0] + 1;
              scope.count = 0;
              return;
            }
            last_attrmonth = date.attr_month;
            if (first_attrmonth == last_attrmonth) {
              date.thismonth[i].k = '离开';
              scope.lasti = i;
              if (scope.lasti < scope.firsti) {
                scope.lasti = scope.firsti;
                scope.firsti = i;
              }
              date.thismonth[scope.firsti].k = '入住';
              date.thismonth[scope.lasti].k = '离开';
              for (var j = scope.firsti; j < scope.lasti; j++) {
                date.thismonth[j].selRow = true;
              }
              sessionStorage.setItem('inday', year + '-' + (todayMonth + 1 + attr_month) + '-' + (scope.firsti + 1) + ' ' + '00:00:00');
              sessionStorage.setItem('outday', year + '-' + (todayMonth + 1 + attr_month) + '-' + (scope.lasti + 1) + ' ' + '00:00:00');
              window.history.go(-1);
            } else if (first_attrmonth < last_attrmonth) {
              for (var j1 = scope.firsti; j1 < scope.dates[first_attrmonth].thismonth.length; j1++) {
                scope.dates[first_attrmonth].thismonth[j1].selRow = true;
              }
              last_attrmonth = date.attr_month;
              scope.lasti = i;
              for (var j2 = 0; j2 < scope.lasti; j2++) {
                scope.dates[last_attrmonth].thismonth[j2].selRow = true;
              }
              scope.dates[last_attrmonth].thismonth[scope.lasti].k = '离开';
              sessionStorage.setItem('outday', year + '-' + (todayMonth + last_attrmonth + 1) + '-' + (scope.lasti + 1) + ' ' + '00:00:00');
              window.history.go(-1);
            } else if (first_attrmonth > last_attrmonth) {
              last_attrmonth = first_attrmonth;
              first_attrmonth = date.attr_month;
              scope.lasti = scope.firsti;
              scope.firsti = i;
              for (var j3 = scope.firsti; j3 < scope.dates[first_attrmonth].thismonth.length; j3++) {
                scope.dates[first_attrmonth].thismonth[j3].selRow = true;
              }
              for (var j4 = 0; j4 < scope.lasti; j4++) {
                scope.dates[last_attrmonth].thismonth[j4].selRow = true;
              }
              scope.dates[last_attrmonth].thismonth[scope.lasti].k = '离开';
              scope.dates[first_attrmonth].thismonth[scope.firsti].k = '入住';
              sessionStorage.setItem('outday', year + '-' + (todayMonth + 1 + last_attrmonth) + '-' + (scope.lasti + 1) + ' ' + '00:00:00');
              sessionStorage.setItem('inday', year + '-' + (todayMonth + 1 + first_attrmonth) + '-' + (scope.firsti + 1) + ' ' + '00:00:00');
              window.history.go(-1);
            }
            if (Math.abs(first_attrmonth - last_attrmonth) > 1) {
              var min = Math.min(first_attrmonth, last_attrmonth);
              var max = Math.max(first_attrmonth, last_attrmonth);
              for (var k = min + 1; k < max; k++) {
                for (var j5 = 0; j5 < scope.dates[k].thismonth.length; j5++) {
                  scope.dates[k].thismonth[j5].selRow = true;
                }
              }
            }

          }
          if (scope.count > 2) {
            scope.count = 0;
            for (var k1 = 0; k1 < attr_months.length; k1++) {
              for (var j6 = 0; j6 < scope.dates[k1].thismonth.length; j6++) {
                scope.dates[k1].thismonth[j6].selRow = false;
              }
            }
            scope.dates[last_attrmonth].thismonth[scope.lasti].k = scope.lasti + 1;
            scope.dates[first_attrmonth].thismonth[scope.firsti].k = scope.firsti + 1;
            date.thismonth[i].selRow = true;
            scope.count++;
            first_attrmonth = date.attr_month;
            scope.firsti = i;
            date.thismonth[scope.firsti].k = '入住';
            sessionStorage.clear();
            sessionStorage.setItem('inday', year + '-' + (todayMonth + 1 + first_attrmonth) + '-' + (scope.firsti + 1) + ' ' + '00:00:00');
            // window.history.go(-1);
          }
        };

        function getDate() {

          scope.settings = {
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          };
          var now = new Date();
          year = year ? year : now.getFullYear();
          month = (now.getMonth() + attr_month);
          now = attr_month > 0 ? now = new Date(year, month, 1) : now;
          var firstday = get_first_date(year, month).getDay();
          var lastday = get_last_date(year, month).getDay();
          var lastdate = get_last_date(year, month).getDate();
          var today = now.getDate();
          year = now.getFullYear();
          month = now.getMonth();
          var lastmonth = [];
          var thismonth = [];
          var d = 0;
          if (firstday !== 0) { //如果第一天不是星期天，补上上个月日期
            var last_month_lastdate = get_last_date(year, month - 1).getDate();
            var last_month_last_sunday = last_month_lastdate - firstday;
            for (var j = last_month_last_sunday + 1; j <= last_month_lastdate; j++) {
              lastmonth.push('');
              d++;
            }

          }

          for (var k = 1; k <= today - 1; k++) {
            thismonth.push({
              'k': k
            });
            d++;
            if (d == 7) {
              d = 0;

              if (lastday != 6) {

              }
            }
          }
          if (attr_month === 0) {
            thismonth.push({
              'k': today,
              'today': '今天'
            });
            for (var k2 = today + 1; k2 <= lastdate; k2++) {
              thismonth.push({
                'k': k2
              });
              d++;
              if (d == 7) {
                d = 0;

                if (lastday != 6) {

                }
              }
            }
          }else{
            for (var k2 = today; k2 <= lastdate; k2++) {
              thismonth.push({
                'k': k2
              });
              d++;
              if (d == 7) {
                d = 0;

                if (lastday != 6) {

                }
              }
            }
          }
          for (var i = 0; i < thismonth.length; i++) {
            thismonth[i].selRow = false;
            thismonth[i].disabled = false;
            thismonth[i].defaultPrice = scope.defaultPrice;
          }
          if (attr_month === 0) {
            for (var i1 = 0; i1 < thismonth.length; i1++) {
              if (thismonth[i1].k < today) {
                thismonth[i1].disabled = true
              }
            }
          }
          scope.lastmonth = lastmonth;
          scope.thismonth = thismonth;

          var aMonth = {
            'month': now,
            'weeks': scope.settings.weeks,
            'attr_month': attr_month,
            'lastmonth': scope.lastmonth,
            'thismonth': scope.thismonth
          };
          scope.dates.push(aMonth);
        }
        function get_first_date(year, month) {
          return new Date(year, month, 1);
        }

        function get_last_date(year, month) {
          return new Date(year, month + 1, 0);
        }
      }
    };
  })

  .directive('dateAccount', function(ApiService, $rootScope) {
    return {
      restrict: 'EA',

      template: '<div class="day" ng-repeat="day in settings.weeks ">{{day}}</div>' +
        '<div class="day" ng-repeat="day in lastmonth ">{{day}}</div>' +
        '<div class="date" ng-repeat="day in thismonth " ng-class="{rented:indexi==$index}" ng-click="ngshowif(day,$index);"><div class="">{{day}}</div></div>',
      link: function(scope, ele, attr) {
        scope.ngshowif = function(day, i) {
          scope.selectDate = true;
          scope.indexi = i;
          var month = scope.month < 10 ? '0' + scope.month : scope.month;
          var day1 = day < 10 ? '0' + day : day;
          var data = {
            customerId: localStorage.getItem('customerId'),
            date: scope.year + '-' + month + '-' + day1
          };
          ApiService.landlordDayIncome(data).success(function(res) {
            $rootScope.DayIncomes = res.dataObject;
            $rootScope.$broadcast('DayIncomes');
          });
        };
        var attr_month = attr.month ? parseInt(attr.month, 10) : 0;
        var attr_year = attr.year ? parseInt(attr.year, 10) : 0;

        scope.$watch('year+month', function() {
          attr_month = scope.month;
          attr_year = scope.year;
          getCalenda();

        });

        function getCalenda() {
          scope.settings = {
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          };
          var now = new Date();
          var year = attr_year;
          var month = attr_month - 1;
          now = new Date(year, month, 1);
          var firstday = get_first_date(year, month).getDay();
          var lastday = get_last_date(year, month).getDay();
          var lastdate = get_last_date(year, month).getDate();
          var today = now.getDate();
          year = now.getFullYear();
          var lastmonth = [];
          var thismonth = [];
          var d = 0;
          if (firstday !== 0) { //如果第一天不是星期天，补上上个月日期
            var last_month_lastdate = get_last_date(year, month - 1).getDate();
            var last_month_last_sunday = last_month_lastdate - firstday;

            for (var j = last_month_last_sunday + 1; j <= last_month_lastdate; j++) {
              lastmonth.push(j);
              d++;
            }

          }
          for (var k = 1; k <= today - 1; k++) {
            thismonth.push(k);
            d++;
            if (d == 7) {
              d = 0;

              if (lastday != 6) {

              }
            }
          }

          for (var k3 = today; k3 <= lastdate; k3++) {
            thismonth.push(k3);
            d++;
            if (d == 7) {
              d = 0;

              if (lastday != 6) {

              }
            }
          }

          scope.lastmonth = lastmonth;
          scope.thismonth = thismonth;
        }


        function get_first_date(year, month) {
          return new Date(year, month, 1);
        }

        function get_last_date(year, month) {
          return new Date(year, month + 1, 0);
        }
      }
    };
  })
  .directive('datepick', function($rootScope) {
    return {
      restrict: 'EA',
      template: '<div class="months" month="date.attr_month" ng-repeat="date in dates">' +
        '<div class="month">{{date.month|date:"yyyy-MM"}}</div>' +
        '<div><div class="date" ng-repeat="week in date.weeks"><div>{{week}}</div></div></div>' +
        '<div><div class="day" ng-repeat="day in date.lastmonth track by $index ">{{day}}</div>' +
        '<div class="date" ng-repeat="day in date.thismonth track by $index" ng-class={selectColor:day.selRow} ng-disabled={{day.disabled}} ng-click="day.disabled||ngshowif(day,date.month,date.attr_month,$index);"><div>{{day.today||day.k}}</div><p>¥{{day.datePrice}}</p></div></div>' +
        '</div>',
      link: function(scope, ele, attr) {
        scope.count = 0;
        var attr_months = [0, 1, 2];
        var year, month;
        scope.dates = [];
        for (var i = 0; i < attr_months.length; i++) {
          var attr_month = attr_months[i];
          getDate();
        }
        $rootScope.dates = scope.dates;
        scope.changedate.forEach(function(month, i) {
          month.forEach(function(date) {
            if (date.slice(-4) !== 'null') {
            var k = parseInt(date.slice(8, 10), 10) - 1;
            scope.dates[i].thismonth[k].datePrice = date.slice(11);
          }
          });
        });
        scope.$on('datesChange', function() {});
        var changedates = [];
        var attr_months = [];
        var $index = [];
        scope.ngshowif = function(day, month, attr_month, index) {
          day.selRow = !day.selRow;
          time_month = (month.getMonth() + 1) < 10 ? '0' + (month.getMonth() + 1) : (month.getMonth() + 1);
          time_day = day.k < 10 ? '0' + day.k : day.k;
          var time = month.getFullYear() + '-' + time_month + "-" + time_day;
          if (day.selRow) {
            changedates.push(time);
            attr_months.push(attr_month);
            $index.push(index);
          } else {
            var index22 = changedates.indexOf(time);
            changedates.splice(index22, 1);
            var index1 = attr_months.indexOf(attr_month);
            attr_months.splice(index1, 1);
            var index2 = $index.indexOf(parseInt(index, 10));
            $index.splice(index2, 1);
          }
          $rootScope.changedates = changedates;
          localStorage.setItem('changedates', changedates);
          localStorage.setItem('attr_months', attr_months);
          localStorage.setItem('$index', $index);
        };

        function getDate() {

          scope.settings = {
            weeks: ['日', '一', '二', '三', '四', '五', '六'],
            month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          };
          var now = new Date();
          year = year ? year : now.getFullYear();
          month = (now.getMonth() + attr_month);
          var now = attr_month > 0 ? now = new Date(year, month, 1) : now;
          var firstday = get_first_date(year, month).getDay();
          var lastday = get_last_date(year, month).getDay();
          var lastdate = get_last_date(year, month).getDate();
          var today = now.getDate();
          year = now.getFullYear();
          month = now.getMonth();
          var lastmonth = [];
          var thismonth = [];
          var d = 0;
          if (firstday != 0) { //如果第一天不是星期天，补上上个月日期
            var last_month_lastdate = get_last_date(year, month - 1).getDate();
            var last_month_last_sunday = last_month_lastdate - firstday;
            for (var j = last_month_last_sunday + 1; j <= last_month_lastdate; j++) {
              lastmonth.push('');
              d++;
            }

          }

          for (var k = 1; k <= today - 1; k++) {
            thismonth.push({
              'k': k
            });
            d++;
            if (d == 7) {
              d = 0;

              if (lastday != 6) {

              }
            }
          }
          if (attr_month === 0) {
            thismonth.push({
              'k': today,
              'today': '今天'
            });
            for (var k = today + 1; k <= lastdate; k++) {
              thismonth.push({
                'k': k
              });
              d++;
              if (d == 7) {
                d = 0;

                if (lastday != 6) {

                }
              }
            }
          } else {
            for (var k = today; k <= lastdate; k++) {
              thismonth.push({
                'k': k
              });
              d++;
              if (d == 7) {
                d = 0;

                if (lastday != 6) {

                }
              }
            }
          }

          for (var i = 0; i < thismonth.length; i++) {
            thismonth[i].selRow = false;
            thismonth[i].datePrice = scope.defaultPrice;
            thismonth[i].disabled = false;
          }
          if (attr_month === 0) {
            for (var i1 = 0; i1 < thismonth.length; i1++) {
              if (thismonth[i1].k < today) {
                thismonth[i1].disabled = true
              }
            }
          }
          scope.lastmonth = lastmonth;
          scope.thismonth = thismonth;
          var aMonth = {
            'month': now,
            'weeks': scope.settings.weeks,
            'attr_month': attr_month,
            'lastmonth': scope.lastmonth,
            'thismonth': scope.thismonth,

          };
          scope.dates.push(aMonth);
        }
        function get_first_date(year, month) {
          return new Date(year, month, 1);
        }

        function get_last_date(year, month) {
          return new Date(year, month + 1, 0);
        }
      }
    };
  })
  .directive('picshow', function() {
    return {
      restrict: 'EA',
      template: '<div  ><img ng-repeat="imgsrc in allImgs" ng-click="ngshowif($index)" src="{{imgsrc}}"></div>' +
        '<div class="mask" ng-if="maskShow" ng-click="maskShow1();" ng-class="{fade:true}"><img animate ng-class="{fade1:show}" ng-swipe-left="changeImgplus();" ng-swipe-left="changeImgminus();"   ng-src={{largeImg}}></div>',
      link: function(scope, ele, attr) {
        //  scope.imgsrcs = ['../imgs/wcj/home/slide_1.png', '../imgs/wcj/home/slide_2.png', '../imgs/wcj/home/slide_3.png', '../imgs/wcj/home/slide_4.png'];
        scope.maskShow = false;

        scope.ngshowif = function(i) {
          scope.maskShow = true;
          scope.largeImg = scope.imgsrcs[i];
          scope.index = i;
        };
        scope.maskShow1 = function() {

          scope.maskShow = false;
        };
        scope.changeImgplus = function() {
          scope.index++;
          if (scope.index < scope.imgsrcs.length) {
            scope.largeImg = scope.imgsrcs[scope.index];
          }
        };
        scope.changeImgminus = function() {
          scope.index--;
          if (scope.index >= 0) {
            scope.largeImg = scope.imgsrcs[scope.index];
          }
        };
      }
    };
  })
  .directive('qrCode', function() {
    return {
      restrict: 'EA',
      link: function(scope, ele, attr) {
        new QRCode(ele[0], {
          text: localStorage.getItem('customerId'),
          width: 500,
          height: 500,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H

        });
      }
    };
  })
  .directive('hmsPctSelect', function(ApiService) {
    var TAG = 'hmsPCTSelectDirective';
    return {
      restrict: 'EA',
      scope: {
        default: '=defaultdata'
      },
      replace: true,
      transclude: true,
      template: '<div class="cityPicker" style="font-size: 14px;" ng-click="toSetDefaultPosition();">' +
        '{{selectedAddress.province+selectedAddress.city+selectedAddress.town}}<span class="right_arr"><span> ' +
        '</div>',
      controller: function($scope, ApiService, $element, $attrs, $ionicModal, $http, $ionicSlideBoxDelegate, $timeout, $rootScope, $ionicScrollDelegate) {
        var selectedAddress = {};
        var addressData;
        this.$onInit = function() {
          selectedAddress = {};
          $scope.selectedAddress = {};


          ApiService.getCityPicker().success(function(res) { //调取城市选择器的接口获取城市数据
            addressData = res;
            $scope.provincesData = addressData['86'];
          }).error(function(err) {});

          $ionicModal.fromTemplateUrl('hmsPCTSelect-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.PCTModal = modal;
          });
        };

        $scope.lockSlide = function() {
          $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').enableSlide(false);
        };

        $scope.$watch('default', function(newValue) {
          if (newValue) {
            $scope.selectedAddress = newValue;
          }
        });

        $scope.toSetDefaultPosition = function() {
          $scope.showBackBtn = false;
          $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').slide(0);
          $ionicScrollDelegate.$getByHandle('PCTSelectProvince').scrollTop();
          $scope.PCTModal.show();
        };

        //选择省
        $scope.chooseProvince = function(selectedProvince) {
          var selectedProvinceIndex;

          angular.forEach($scope.provincesData, function(item, index) {
            if (item === selectedProvince) {
              selectedProvinceIndex = index;
              return;
            }
          });


          selectedAddress = {};
          $scope.showBackBtn = true;
          $scope.citiesData = addressData['' + selectedProvinceIndex + ''];


          $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').next();
          $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').update();
          $ionicScrollDelegate.$getByHandle('PCTSelectCity').scrollTop();
          selectedAddress.province = selectedProvince;
        };

        //选择市
        $scope.chooseCity = function(selectedCity) {
          var selectedCityIndex;

          angular.forEach($scope.citiesData, function(item, index) {
            if (item === selectedCity) {
              selectedCityIndex = index;
              return;
            }
          });

          $scope.townData = addressData['' + selectedCityIndex + ''];

          selectedAddress.city = selectedCity;
          if (!$scope.townData) {
            selectedAddress.town = '';
            $scope.selectedAddress = selectedAddress;
            sessionStorage.setItem('detailAddress', JSON.stringify($scope.selectedAddress));
            $rootScope.$broadcast('PCTSELECT_SUCCESS', {
              result: $scope.selectedAddress
            });

            $timeout(function() {
              $scope.PCTModal.hide();
            }, 200);
          } else {
            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').next();
            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').update();
            $ionicScrollDelegate.$getByHandle('PCTSelectTown').scrollTop();
          }
        };

        //选择县
        $scope.chooseTown = function(selectedTown) {
          selectedAddress.town = selectedTown;
          $scope.selectedAddress = selectedAddress;
          sessionStorage.setItem('detailAddress', JSON.stringify($scope.selectedAddress));
          $rootScope.$broadcast('PCTSELECT_SUCCESS', {
            result: $scope.selectedAddress
          });

          $timeout(function() {
            $scope.PCTModal.hide();
          }, 200);
        };

        //slide返回上一级
        $scope.goBackSlide = function() {
          var currentIndex = $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').currentIndex();
          if (currentIndex > 0) {
            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').previous();
          }
          if (currentIndex === 1) {
            $scope.showBackBtn = false;
          }
        };

        $scope.$on('$destroy', function() {
          $scope.PCTModal.remove();
        });
      }
    };
  })
  .directive('getHeight', function($rootScope) {
    return {
      restrict: 'EA',
      link: function(scope, ele, attr) {
        //var height = angular.element(document.querySelector('.houseDetail_header')).width();
        $rootScope.offsetHeight = ele[0].offsetHeight;
        $rootScope.$broadcast('getHeight');
      }
    };
  })
  .directive('cityPicker', function(cityPickerData, $ionicModal, $timeout, $ionicScrollDelegate, $rootScope) {
    return {
      restrict: 'EA',
      scope: true,
      template: '<div ng-click="modalShow()" class="cityPicker">' +
        '{{city_province+city_city+city_towns}}' +
        '<span class="right_arr"><span></div>',
      link: function(scope, ele, attr) {
        scope.cityData = cityPickerData;
        $ionicModal.fromTemplateUrl("lib/templates/city-picker.html", {
          scope: scope,
          animation: "slide-in-up"
        }).then(function(modal) {
          scope.modal = modal;
        });

        scope.modalShow = function() {
          scope.modal.show();
          var inner_height = document.getElementById('city_picker_inner').offsetHeight;
          scope.li_height = inner_height / 5;
        };
        scope.complete = function() {
          scope.modal.hide();
        };
        //Cleanup the modal when we are done with it!
        scope.$on("$destroy", function() {
          scope.modal.remove();
        });
        // Execute action on hide modal
        scope.$on("modal.hidden", function() {
          // Execute action
        });
        // Execute action on remove modal
        scope.$on("modal.removed", function() {
          // Execute action
        });

        var topValue = 0, // 上次滚动条到顶部的距离
          timer = null; // 定时器
        var oldTop_pro = newTop_pro = 0;
        var oldTop_city = newTop_city = 0;
        var oldTop_town = newTop_town = 0;
        //city_picker_inner高

        //  var inner_height = document.getElementById('city_picker_inner').offsetHeight
        //console.log(inner_height)
        scope.subCitys = scope.cityData[0].sub;
        scope.subTowns = scope.subCitys[0].sub;
        scope.provinceSelet = function() {
          provinceLog();
        };
        scope.citySelet = function() {
          cityLog();

        };
        scope.townSelet = function() {
          townLog();
        };

        function townLog() {
          if (timer) {
            $timeout.cancel(timer);
          }
          newTop_town = $ionicScrollDelegate.$getByHandle('townScroll').getScrollPosition().top;
          if (newTop_town === oldTop_town) {
            $timeout.cancel(timer);
            scope.provinceSeletTop = $ionicScrollDelegate.$getByHandle('townScroll').getScrollPosition().top;
            var index = scope.provinceSeletTop / scope.li_height;
            if (index == Math.ceil(index)) {
              if (scope.subTowns) {
                $rootScope.city_towns = scope.subTowns[Math.floor(index)].name;
                $rootScope.$broadcast('cityPickerChange');
              }
            } else {
              if (index >= (Math.floor(index) + 0.5)) {
                $ionicScrollDelegate.$getByHandle('townScroll').scrollTo(0, scope.li_height * (Math.floor(index) + 1), true);
              } else {
                $ionicScrollDelegate.$getByHandle('townScroll').scrollTo(0, scope.li_height * (Math.floor(index)), true);
              }
            }

          } else {
            oldTop_town = newTop_town;
            timer = $timeout(townLog, 100);
          }
        }

        function cityLog() {
          if (timer) {
            $timeout.cancel(timer);
          }
          newTop_city = $ionicScrollDelegate.$getByHandle('cityScroll').getScrollPosition().top;
          if (newTop_city === oldTop_city) {
            $timeout.cancel(timer);
            scope.provinceSeletTop = $ionicScrollDelegate.$getByHandle('cityScroll').getScrollPosition().top;
            var index = scope.provinceSeletTop / scope.li_height;
            if (index == Math.ceil(index)) {
              scope.subTowns = scope.subCitys[Math.floor(index)].sub;
              $ionicScrollDelegate.$getByHandle('townScroll').scrollTop();
              $rootScope.city_city = scope.subCitys[Math.floor(index)].name;
              $rootScope.$broadcast('cityPickerChange');
            } else {
              if (index >= (Math.floor(index) + 0.5)) {
                $ionicScrollDelegate.$getByHandle('cityScroll').scrollTo(0, scope.li_height * (Math.floor(index) + 1), true);
                scope.subTowns = scope.subCitys[Math.floor(index)].sub;
              } else {
                $ionicScrollDelegate.$getByHandle('cityScroll').scrollTo(0, scope.li_height * (Math.floor(index)), true);
                scope.subTowns = scope.subCitys[Math.floor(index)].sub;
              }
            }

          } else {
            oldTop_city = newTop_city;
            timer = $timeout(cityLog, 100);
          }
        }

        function provinceLog() {
          if (timer) {
            $timeout.cancel(timer);
          }
          newTop_pro = $ionicScrollDelegate.$getByHandle('provinceScroll').getScrollPosition().top;
          if (newTop_pro === oldTop_pro) {
            $timeout.cancel(timer);
            scope.provinceSeletTop = $ionicScrollDelegate.$getByHandle('provinceScroll').getScrollPosition().top;
            var index = scope.provinceSeletTop / scope.li_height;
            if (index == Math.ceil(index)) {
              scope.subCitys = scope.cityData[Math.floor(index)].sub;
              $ionicScrollDelegate.$getByHandle('cityScroll').scrollTop();
              $rootScope.city_province = scope.cityData[Math.floor(index)].name;
              scope.city_province = scope.cityData[Math.floor(index)].name;
              $rootScope.$broadcast('cityPickerChange');
              cityLog();
            } else {
              if (index >= (Math.floor(index) + 0.5)) {
                $ionicScrollDelegate.$getByHandle('provinceScroll').scrollTo(0, scope.li_height * (Math.floor(index) + 1), true);
                scope.subCitys = scope.cityData[Math.floor(index)].sub;
              } else {
                $ionicScrollDelegate.$getByHandle('provinceScroll').scrollTo(0, scope.li_height * (Math.floor(index)), true);
                scope.subCitys = scope.cityData[Math.floor(index)].sub;
              }

            }

          } else {
            oldTop_pro = newTop_pro;
            timer = $timeout(provinceLog, 100);
          }
        }

      }
    };
  })
  .directive('getPoselevator', function($rootScope) {
    return {
      link: function(scope, ele, attr) {
        var posL = ele[0].offsetLeft;
        var posR = ele[0].offsetLeft + ele[0].offsetWidth;
        var posT = ele[0].offsetTop;
        var posB = ele[0].offsetTop + ele[0].offsetHeight;
        var pos = [posL, posR, posT, posB];
        $rootScope.poselevator = pos;
        $rootScope.$broadcast('getPos');
      }
    };
  })
  .directive('getPosdoor', function($rootScope) {
    return {
      link: function(scope, ele, attr) {
        var posL = ele[0].offsetLeft;
        var posR = ele[0].offsetLeft + ele[0].offsetWidth;
        var posT = ele[0].offsetTop;
        var posB = ele[0].offsetTop + ele[0].offsetHeight;
        var pos = [posL, posR, posT, posB];
        $rootScope.posdoor = pos;
        $rootScope.$broadcast('getPos');
      }
    };
  })
  .directive('getPosstream', function($rootScope) {
    return {
      link: function(scope, ele, attr) {
        var posL = ele[0].offsetLeft;
        var posR = ele[0].offsetLeft + ele[0].offsetWidth;
        var posT = ele[0].offsetTop;
        var posB = ele[0].offsetTop + ele[0].offsetHeight;
        var pos = [posL, posR, posT, posB];
        $rootScope.posstream = pos;
        $rootScope.$broadcast('getPos');
      }
    };
  })
  .directive('getPoskey', function($rootScope) {
    return {
      link: function(scope, ele, attr) {
        var posL = ele[0].offsetLeft;
        var posT = ele[0].offsetTop;
        var width = ele[0].offsetWidth;
        $rootScope.poskey = [posL + width / 2, posT];

        $rootScope.$broadcast('getPos');
      }
    };
  })
  .directive("canvas", function($rootScope) {
    return {
      restrict: "EA",
      link: function(scope, ele, attr) {
        var ctx = ele[0].getContext("2d");
        var dpr = document.getElementsByTagName('html')[0].getAttribute('data-dpr');
        ele[0].width = screen.width * 0.75 * dpr;
        ele[0].height = ele[0].width;
        ele[0].style.marginLeft = -ele[0].width / 2 + 'px';
        var img = new Image();
        img.src = 'imgs/wcj/colorPicker/colorPicker.png';
        img.onload = function() {
          ctx.drawImage(img, 0, 0, ele[0].width, ele[0].width);
          ele.bind('click', function(e) {
            var canvasOffsetTop = ele[0].offsetTop;
            var canvasOffsetLeft = ele[0].offsetLeft;
            var canvasX = Math.floor(e.pageX - canvasOffsetLeft);
            var canvasY = Math.floor(e.pageY - canvasOffsetTop);
            var imgData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imgData.data;
            $rootScope.rgb = pixel;
            $rootScope.$broadcast('rgbChange');
            document.getElementById('pot').style.left = e.pageX + 'px';
            document.getElementById('pot').style.top = e.pageY + 'px';
            //document.getElementById('dd').style.backgroundColor = "rgba(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + "," + pixel[3] + ")";
          });
        };

      }
    };
  })
  .directive('myTouchstart', [function() {
    return function(scope, element, attr) {
      element.on('touchstart', function(event) {
        scope.$apply(function(event) {
          scope.$eval(attr.myTouchstart);
        });
      });
    };
  }])
  .directive('myTouchmove', ['$rootScope', function($rootScope) {
    return function(scope, element, attr) {
      element.on('touchmove', function(event) {
        var left = event.touches[0].pageX || event.touches[0].clientX;
        var top = event.touches[0].pageY || event.touches[0].clientY;
        var width = element[0].offsetHeight;
        $rootScope.posEnd = [left, top, width];
        $rootScope.$broadcast('getPosEnd');
        element.css({
          'top': (top - width / 2) + 'px',
          'left': (left) + 'px'
        });
      });
    };
  }])
  .directive('myTouchend', ['$rootScope', function($rootScope) {
    return function(scope, element, attr) {
      scope.$on('getPos', function() {});
      element.on('touchend', function(event) {
        element.css({
          'top': $rootScope.poskey[1] + 'px',
          'left': $rootScope.poskey[0] + 'px'
        });
        scope.$apply(function() {
          scope.$eval(attr.myTouchend);
        });
      });
    };
  }])
  .directive("mouseUp", function() {
    return {
      restrict: "EA",
      scope: {
        subfn: '&',
        myValue: '@myValue'
      },
      link: function(scope, ele, attr) {
        ele.bind('touchend', function() {
          scope.subfn();
        });
      }
    };
  })
  .directive('passwordConfirm', function() {
    return {
      link: function(scope, ele, attr) {
        var ds = /^[0-9a-zA-Z]*$/;
        ele.bind('keyup', function(e) {
          e.target.value = e.target.value.replace(/[^0-9a-zA-Z]/g, '');
        });

      }
    };
  })
  .directive('numberConfirm', function() {
    return {
      link: function(scope, ele, attr) {
        var ds = /^[0-9]*$/;
        ele.bind('keyup', function(e) {

          e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

      }
    };
  })
  .directive('chineseConfirm', function() {
    return {
      link: function(scope, ele, attr) {
        var ds = /^[0-9a-zA-Z]*$/;
        ///[^\u4e00-\u9fa5]$/;
        ele.bind('keyup', function(e) {
          e.target.value = e.target.value.replace(/[^\u4e00-\u9fa5]/g, '');
        });

      }
    };
  })
  .directive('sildeAnimation', function() {
    return {
      link: function(scope, ele, attr) {
        if (sessionStorage.getItem('checkInTop')) {
          ele[0].style.height = sessionStorage.getItem('checkInTop') + 'px';
        }
        ele.bind('touchmove', function(e) {
          ele[0].style.height = e.changedTouches[0].clientY + 'px';

        });
        ele.bind('touchend', function(e) {
          ele[0].style.height =(e.changedTouches[0].clientY-100)+'px' ;
          sessionStorage.setItem('checkInTop', e.changedTouches[0].clientY);

        });
      }
    };
  })
  .directive('ctrlBtn',function($state){
    return{
      link:function(scope,ele,attr){
        ele.bind('touchstart',function(){
          ele.addClass('ctrlOnBig')
        })
        ele.bind('touchend',function($state){
         ele.removeClass('ctrlOnBig');
        })
        scope.$on('ctrlStateEnter',function(){
          ele.addClass('ctrlOnSmall')
        })
        scope.$on('ctrlStateOut',function(){
          ele.removeClass('ctrlOnSmall')
        })
      }
    }
  })
