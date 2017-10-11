angular.module('starter', ['ionic', 'starter.controllers', 'starter.filters', 'starter.services', 'starter.directives', 'ngCordova','ngAnimate', 'ionic-native-transitions'])
  .constant('AJKUrl', 'http://www.live-ctrl.com/aijukex/')
  .constant('AJKIp','http://192.168.0.109:8100/#')
  .constant('DuplicateLogin','你的账号在另一台手机登录,请重新登录')
  .constant('systemBusy','系统正忙,请稍后操作')
  .run(function($ionicPlatform, $ionicPopup,ApiService,$ionicHistory,$location,$cordovaGeolocation,$rootScope,$cordovaAppVersion) {
	$ionicPlatform.ready(function() {
    //cordova定位
 //var convertFrom =  new AMap.convertFrom(lnglat:[120.065375,30.292008],type:"GPS",function(status,result));
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      ApiService.lngLat({
          locations:long +','+lat,
          coordsys:'gps',
          output:'JSON',
          key:'1cbf5e5ac9b4588d974214856a289ec6'
        }).success(function(res){
          var lnglat = res.locations.split(',');
          sessionStorage.setItem('longitude',lnglat[0]);
          sessionStorage.setItem('latitude',lnglat[1]);
        })
    }, function(err) {
      // error
      console.log(err);
    });
    if(!ionic.Platform.isIOS()){
      MobileAccessibility.setTextZoom(100);
    }
		$rootScope.$broadcast('ionio', function() {
		});
		if (!localStorage.getItem("city")) {
			localStorage.setItem("city", "杭州");
			sessionStorage.setItem("city", "杭州");
		} else {
			sessionStorage.setItem("city", localStorage.getItem("city"));
		}
		var map, geolocation;
      //加载地图，调用浏览器定位服务
		map = new AMap.Map('container', {
			resizeEnable: true
		});
		map.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: true,
				timeout: 10000,
				//buttonOffset: new AMap.Pixel(10, 20),
				zoomToAccuracy: true,
			});
			map.addControl(geolocation);
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
			AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
        //获取当前城市信息  例如：杭州市

        //sessionStorage.setItem("city", result.city);

			// var citysearch = new AMap.CitySearch();
   //      //自动获取用户IP，返回当前城市
			// citysearch.getLocalCity(function(status, result) {
			// 	if (status === 'complete' && result.info === 'OK') {
   //        //sessionStorage.setItem('_city', JSON.stringify(result))
			// 		var cityinfo = result.city;
          
			// 		if (localStorage.getItem("city") !== cityinfo) {
			// 			var myPopup = $ionicPopup.show({
			// 				template: '是否切换城市到' + cityinfo,
			// 				cssClass: 'ajk',
			// 				buttons: [{
			// 					text: '取消'
			// 				}, {
			// 					text: '<b>确定</b>',
			// 					onTap: function(e) {
			// 						localStorage.setItem("city", cityinfo);
			// 						sessionStorage.setItem("city", cityinfo);
			// 						$rootScope.$broadcast('cityChange');
			// 					}}
			// 				]}
   //            );}
			// 		sessionStorage.setItem("nowcity", cityinfo);
			// 	}
			// });

		});

		function onComplete(data) {
      console.log(data)
      if (data.info === "SUCCESS") {
         // sessionStorage.setItem('_city', JSON.stringify(result))
         var cityinfo 
          if (data.addressComponent.district !== '') {
            cityinfo = data.addressComponent.district
          } else {
            cityinfo = data.addressComponent.city
          }
          
          
          if (localStorage.getItem("city") !== cityinfo) {
            var myPopup = $ionicPopup.show({
              template: '是否切换城市到' + cityinfo,
              cssClass: 'ajk',
              buttons: [{
                text: '取消'
              }, {
                text: '<b>确定</b>',
                onTap: function(e) {
                  localStorage.setItem("city", cityinfo);
                  sessionStorage.setItem("city", cityinfo);
                  $rootScope.$broadcast('cityChange');
                }}
              ]}
              );}
          sessionStorage.setItem("nowcity", cityinfo);
        }
			sessionStorage.setItem("longitude", data.position.getLng());
			sessionStorage.setItem("latitude", data.position.getLat());
		}
      //解析定位错误信息
		function onError(data) {

		}



      //退出应用
		$ionicPlatform.registerBackButtonAction(function (e) {
			e.preventDefault();
			function showConfirm() {
				var confirmPopup = $ionicPopup.show({
					template: '你确定要退出应用吗?',
					buttons: [{
						text: '确定',
						onTap:function(){
							return 1;
						}}, {
							text: '取消'
						}],
					cssClass: 'ajk',
				});

				confirmPopup.then(function (res) {
					if (res) {
						ionic.Platform.exitApp();
					}
					else {
            // Don't close
					}
				});
			}

      // Is there a page to go back to?
			if ($location.path() == '/tab/home' ) {
				showConfirm();
			} else if ($ionicHistory.backView()) {
				$ionicHistory.goBack();
			} else {
        // This is the last page: Show confirmation popup
				showConfirm();
			}

			return false;
		}, 101);

		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
    //检查更新
     //checkUpdate();
    function checkUpdate() {
            var serverAppVersion = "1.0.0"; //从服务端获取最新版本
            //获取版本
            $cordovaAppVersion.getAppVersion().then(function (version) {
                //如果本地与服务端的APP版本不符合
                if (version != serverAppVersion) {
                    showUpdateConfirm();
                }
            });
        }
        function onHardwareMenuKeyDown() {
              $ionicActionSheet.show({
                  titleText: '检查更新',
                  buttons: [
                      { text: '关于' }
                  ],
                  destructiveText: '检查更新',
                  cancelText: '取消',
                  cancel: function () {
                      // add cancel code..
                  },
                  destructiveButtonClicked: function () {
                      //检查更新
                      checkUpdate();
                  },
                  buttonClicked: function (index) {

                  }
              });
              $timeout(function () {
                  hideSheet();
              }, 2000);
          };
          // 显示是否更新对话框
         function showUpdateConfirm() {
             var confirmPopup = $ionicPopup.confirm({
                 title: '版本升级',
                 template: '1.xxxx;</br>2.xxxxxx;</br>3.xxxxxx;</br>4.xxxxxx', //从服务端获取更新的内容
                 cancelText: '取消',
                 okText: '升级'
             });
             confirmPopup.then(function (res) {
                 if (res) {
                     $ionicLoading.show({
                         template: "已经下载：0%"
                     });
                     var url = "http://192.168.1.50/1.apk"; //可以从服务端获取更新APP的路径
                     var targetPath = "file:///storage/sdcard0/Download/1.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                     var trustHosts = true
                     var options = {};
                     $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                         // 打开下载下来的APP
                         $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                         ).then(function () {
                                 // 成功
                             }, function (err) {
                                 // 错误
                             });
                         $ionicLoading.hide();
                     }, function (err) {
                         alert('下载失败');
                     }, function (progress) {
                         //进度，这里使用文字显示下载百分比
                         $timeout(function () {
                             var downloadProgress = (progress.loaded / progress.total) * 100;
                             $ionicLoading.show({
                                 template: "已经下载：" + Math.floor(downloadProgress) + "%"
                             });
                             if (downloadProgress > 99) {
                                 $ionicLoading.hide();
                             }
                         })
                     });
                 } else {
                     // 取消更新
                 }
             });
         }
	});

})
  .config(function($ionicConfigProvider, $ionicNativeTransitionsProvider,$cordovaInAppBrowserProvider) {
	// 防止滑动白屏
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.backButton.text('');        
  $ionicConfigProvider.backButton.previousTitleText(false);
  var defaultOptions = {
		location: 'no',
		clearcache: 'no',
		toolbar: 'no'
	};
	$cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions);
  //$ionicConfigProvider.scrolling.jsScrolling(false);

	$ionicConfigProvider.tabs.style('standard').position('bottom');
	$ionicConfigProvider.views.transition('no');
	$ionicConfigProvider.navBar.alignTitle('center');
	$ionicNativeTransitionsProvider.setDefaultOptions({
		duration: 200, // in milliseconds (ms), default 400,
		slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
		iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
		androiddelay: -1, // same as above but for Android, default -1
		winphonedelay: -1, // same as above but for Windows Phone, default -1,
		fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
		fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
		triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
		backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
	});
	$ionicNativeTransitionsProvider.setDefaultTransition({
		type: 'slide',
		direction: 'left'
	});
})
  .config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
	$stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
	url: '/tab',
	abstract: true,
	templateUrl: 'templates/tabs/tabs.html'
})

      // Each tab has its own nav history stack:

      .state('tab.home', {
	url: '/home',
	nativeTransitions: null,
  cache: false,
	views: {
		'tab-home': {
			templateUrl: 'templates/home/home.html',
			controller: 'homeCtrl',
			resolve: {
				mainADs: function(ApiService) {
					return ApiService.getHomePageBanner({
						level: 0
					}).success(function(res) {
						return res.result;
					});

				}
			}
		}
	}
})
.state('tab.ctrl', {
	url: '/ctrl',
	//nativeTransitions: {type:'fade'},
	cache:false,
	views: {
		'tab-ctrl': {
			templateUrl: 'templates/ctrl/ctrl.html',
			controller: 'ctrl'
		}
	 },
  onEnter: function($rootScope){
        $rootScope.$broadcast('ctrlStateEnter');
   },
   onExit: function($rootScope){
       $rootScope.$broadcast('ctrlStateOut');
   }
})
      .state('tab.discover', {
	url: '/discover',
	nativeTransitions: null,
  cache:false,
	views: {
		'tab-discover': {
			templateUrl: 'templates/discover/discover.html',
			controller: 'discoverCtrl'
		}
	}
})
      .state('tab.shopCar', {
	url: '/shopCar',
	nativeTransitions: null,
	views: {
		'tab-shopCar': {
			templateUrl: 'templates/shopCar/shopCar.html',
			controller: 'shopCarCtrl'
		}
	},
	cache: false
})
      .state('tab.userCenter', {
	url: '/userCenter',
	nativeTransitions: null,
	cache: false,
	views: {
		'tab-userCenter': {
			templateUrl: 'templates/userCenter/userCenter.html',
			controller: 'userCenter'
		}
	}
})
      .state('qrCode', {
	url: '/qrCode',
	params: {
		person: {}
	},
	templateUrl: 'templates/userCenter/qrCode/qrCode.html',
	controller: 'qrCodeCtrl'
})
.state('futrue', {
url: '/futrue',
cache:false,
templateUrl: 'templates/home/futrue/futrue.html',
controller:'futrueCtrl'
})
      .state('ctrlDetail', {
	url: '/ctrlDetail',
	templateUrl: 'templates/ctrl/ctrlDetail/ctrlDetail.html'
})
      .state('inHouse', {
	url: '/inHouse',
	params: {
		data: {}
	},
	cache: false,
	templateUrl: 'templates/ctrl/inHouse/inHouse.html',
	controller: 'inHouseCtrl'
})
      .state('checkIn', {
	url: '/checkIn',
	params: {
		data: {}
	},
  cache:false,
	templateUrl: 'templates/ctrl/CheckIn/checkIn.html',
	controller: 'checkInCtrl'
})
      .state('light', {
	url: '/light',
	cache:false,
	templateUrl: 'templates/ctrl/light/light.html',
	controller:"lightCtrl"
})
      .state('curtain', {
	url: '/curtain',
  cache:false,
	templateUrl: 'templates/ctrl/curtain/curtain.html',
	controller:'curtainCtrl'
})
      .state('readLight', {
	url: '/readLight',
	templateUrl: 'templates/ctrl/readLight/readLight.html',
	controller:'readLightCtrl'
})
      .state('model', {
	url: '/model',
  cache:false,
	templateUrl: 'templates/ctrl/model/model.html',
	controller:'modelCtrl'
})
      .state('tv', {
	url: '/tv',
  cache:false,
	templateUrl: 'templates/ctrl/tv/tv.html',
	controller:'tvCtrl'
})
      .state('airCondition', {
	url: '/airCondition',
  cache:false,
	templateUrl: 'templates/ctrl/airCondition/airCondition.html',
	controller:"airCtrl"
})
      .state('lock', {
	url: '/lock/:name',
	cache:false,
	templateUrl: 'templates/ctrl/lock/lock.html',
	controller:"lockCtrl"
})
      .state('colorPicker', {
	url: '/colorPicker',
	templateUrl: 'templates/ctrl/colorPicker/colorPicker.html',
	controller:'colorPickerCtrl'
})
      .state('sweepTime', {
	url: '/sweepTime/:id',
	templateUrl: 'templates/ctrl/sweepTime/sweepTime.html',
	controller:'sweepTimeCtrl'
})
      .state('maintain', {
	url: '/maintain/:id',
	templateUrl: 'templates/ctrl/repair/repair.html',
	controller:'maintainCtrl'
})
      .state('service', {
	url: '/service',
  cache:false,
	templateUrl: 'templates/ctrl/service/service.html',
	controller:'serviceCtrl'
})
      .state('houseDtail', {
	url: '/houseDtail/:id',
  cache:false,
	templateUrl: 'templates/home/house_detail/house_detail.html',
	controller: 'houseDetailCtrl'
})
      .state('hotelService', {
	url: '/hotelService',
	cache: false,
	params: {
		hotelDetail: null
	},
	templateUrl: 'templates/home/hotelService/hotelService.html',
	controller:'hotelService'
})
      .state('picShow', {
	url: '/picShow',
	params: {
		data: {}
	},
	nativeTransitions:{
		"type": "fade",
		"duration": 500, // in milliseconds (ms), default 400
	},
	templateUrl: 'templates/home/picShow/picShow.html',
	controller: 'picShowCtrl'
})
      .state('nearby', {
	url: '/nearby/:city',
	cache:false,
	templateUrl: 'templates/home/nearby/nearby.html',
	controller: 'nearbyCtrl'
})
      .state('myCollect', {
	url: '/myCollect',
	cache:false,
	templateUrl: 'templates/home/my_collect/my_collect.html',
	controller: 'collectCtrl'
})
      .state('comment', {
	url: '/comment/:id/:stars',
	templateUrl: 'templates/home/comment/comment.html',
	controller: 'commentCtrl'
})
      .state('map', {
	url: '/map',
	params:{destination:null},
  cache:false,
	templateUrl: 'templates/home/map/map.html',
	controller: 'mapCtrl'
})
      .state('getCity', {
	url: '/getCity',
	cache:false,
	nativeTransitions: {
		"type": "slide",
		"direction": "up"
	},
	templateUrl: 'templates/home/get_city/get_city.html',
	controller: 'getCityCtrl'
})
      .state('selectBussiniss', {
	url: '/selectBussiniss',
	cache:false,
	nativeTransitions: {
		"type": "slide",
		"direction": "up"
	},
	templateUrl: 'templates/home/select_bussiniss/select_bussinss.html',
	controller: 'select_bussinissCtrl',
})

      .state('selectDate', {
	url: '/selectDate',
	cache: false,
  params:{data:null},
	templateUrl: 'templates/home/select_date/select_date.html',
	controller:'selectDateCtrl',
  resolve: {
		roomPrice: function(ApiService, $stateParams, $ionicLoading, $timeout) {
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner>'
			});
      var year = new Date().getFullYear();
      var month = new Date().getMonth()+1;
      var m1 = month>9?month:'0'+month;
      var m2 = month+1>9?month+1:'0'+(month+1);
      var m3 = month+2>9?month+2:'0'+(month+2);
			return ApiService.queryRoomCalendar({
				houseId: $stateParams.data.id,
				month: year+'-'+m1+','+year+'-'+m2+','+year+'-'+m3
			}).success(function(res) {
        $ionicLoading.hide();
        if(res.success){
          $timeout(function() {
  					$ionicLoading.hide();
  				}, 1000);
        }else{
          if (res.msg=='非法请求') {
            $ionicLoading.hide();
            $state.go('login')
          }
        }
				return res.dataObject;
			});
		}
	}
})
      .state('beLandlord', {
	url: '/beLandlord',
  cache:false,
	templateUrl: 'templates/userCenter/beLandlord/be_landlord.html',
	controller: 'beLandlord'
})
      .state('joinUs', {
	url: '/joinUs',
	templateUrl: 'templates/userCenter/beLandlord/joinUs/join_us.html',
	controller: 'joinUsCtrl'
})
.state('accountDetail', {
url: '/accountDetail',
params:{data:null},
templateUrl: 'templates/userCenter/beLandlord/account_detail/account_detail.html',
controller: 'accountDetailCtrl'
})
      .state('landlordProfit', {
	url: '/landlordProfit',
	cache: false,
	templateUrl: 'templates/userCenter/beLandlord/landlord_profit/landlord_profit.html',
	controller: 'landlordProfitCtrl'
})
      .state('waitCheck', {
	url: '/waitCheck',
	templateUrl: 'templates/userCenter/beLandlord/waitCheck/wait_check.html'
})
      .state('myHouse', {
	url: '/myHouse',

	templateUrl: 'templates/userCenter/beLandlord/my_house/my_house.html',
	controller: 'myHouseCtrl',
	cache: false
})
      .state('seeHouse', {
	url: '/seeHouse/:id',
	cache: false,
	templateUrl: 'templates/userCenter/beLandlord/see_myhouse/see_myhouse.html',
	controller: 'seeHouseCtrl',
	resolve: {
		hotel: function(ApiService, $stateParams, $ionicLoading,$state) {
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner>'
			});
			return ApiService.viewLandlordHotel({
				hotelId: $stateParams.id
			}).success(function(res) {
				if (res.success) {
					$ionicLoading.hide();
					return res.dataObject;
				}else{
          $ionicLoading.hide();
          //$state.go('login')
        }
			});

		}
	}
})
      .state('myhouseDetail', {
	url: '/myhouseDetail/:id',
  params:{houseName:''},
	cache:false,
	templateUrl: 'templates/userCenter/beLandlord/myhouse_detail/myhouse_detail.html',
	controller: 'myHouseDetailCtrl'
})
      .state('hotelPics', {
	url: '/hotelPics',
	params: {
		pics: [],
		id: 0
	},
	templateUrl: 'templates/home/hotel_pics/hotel_pics.html',
	controller: 'hotelPicsCtrl'
})
      .state('myhouseIntr', {
	url: '/myhouseIntr/:id',

	templateUrl: 'templates/userCenter/beLandlord/myhouse_intr/myhouse_intr.html',
	controller: 'myhouseIntrCtrl',
	resolve: {
		house: function(ApiService, $stateParams) {
			var data = {
				houseId: $stateParams.id
			};
			return ApiService.viewLandlordHotelHouse(data).success(function(res) {
				return res.dataObject;
			});
		}
	}
})
      .state('myOrderForm', {
	url: '/myOrderForm/:id',
  cache:false,
	templateUrl: 'templates/userCenter/beLandlord/my_orderform/my_orderform.html',
	controller: 'myOrderFormCtrl'
})
      .state('orderFormDetail', {
	url: '/orderFormDetail',
	templateUrl: 'templates/userCenter/beLandlord/orderform_detail/orderform_detail.html',
	controller: 'orderFormDetail'
})
      .state('tradeRule', {
	url: '/tradeRule',
	templateUrl: 'templates/userCenter/beLandlord/trade_rule/trade_rule.html',
	controller:'tradeRuleCtrl'

})
      .state('myhouseChangePrice', {
	url: '/myhouseChangePrice/:id/:name/:price',
	cache: false,
	templateUrl: 'templates/userCenter/beLandlord/myhouse_changeprice/myhouse_changeprice.html',
	controller: 'myhouseChangepriceCtrl',
	resolve: {
		roomPrice: function(ApiService, $stateParams, $ionicLoading, $timeout) {
			$ionicLoading.show({
				template: '<ion-spinner icon="ios"></ion-spinner>'
			});
      var year = new Date().getFullYear();
      var month = new Date().getMonth()+1;
      var m1 = month>9?month:'0'+month;
      var m2 = month+1>9?month+1:'0'+(month+1);
      var m3 = month+2>9?month+2:'0'+(month+2);
			return ApiService.queryRoomCalendar({
				houseId: $stateParams.id,
				month: year+'-'+m1+','+year+'-'+m2+','+year+'-'+m3
			}).success(function(res) {
        if (res.success) {
          $timeout(function() {
  					$ionicLoading.hide();
  				}, 1000);
        }else{
          if (res.msg=='非法请求') {
            $ionicLoading.hide();
            $state.go('login')
          }
        }
				return res.dataObject;


			});
		}
	}

})
      .state('myaccount', {
	url: '/myaccount',
  cache:false,
	templateUrl: 'templates/userCenter/beLandlord/myaccount/myaccount.html',
	controller: 'myaccountCtrl'

})
      .state('login', {
	url: '/login',
	cache: false,
	templateUrl: 'templates/userCenter/login/login.html',
	controller: 'loginCtrl'
})
      .state('register', {
	url: '/register',
	templateUrl: 'templates/userCenter/register/register.html',
	controller: 'registerCtrl'
})
      .state('hotelDetail', {
	url: '/hotelDetail',
	cache: false,
	params: {
		hotelDetail: null
	},
	templateUrl: 'templates/home/hotel_detail/hotel_detail.html',
	controller: 'hotelDetailCtrl'
})
      .state('house_intr', {
	url: '/house_intr/:id',
	templateUrl: 'templates/home/house_intr/house_intr.html',
	controller: 'houseIntrCtrl',
	resolve: {
		houseIntr: function(ApiService, $stateParams) {
			return ApiService.getHotelHousesDetail({
				houseId: $stateParams.id
			}).success(function(res) {
				return res.dataObject;

			});

		}
	}
})
      .state('RetrievePwd', {
	url: '/RetrievePwd',
	cache:false,
	templateUrl: 'templates/userCenter/RetrievePwd/RetrievePwd.html',
	controller: 'RetrievePwdCtrl'
})
      .state('ChangePwd', {
	url: '/ChangePwd',
	cache: false,
	templateUrl: 'templates/userCenter/ChangePwd/ChangePassword.html',
	controller: "ChangePwdCtrl"
})
      .state('setPwd', {
	url: '/setPwd',
	templateUrl: 'templates/userCenter/setPwd/setPwd.html',
	controller: 'setPwdCtrl'
})
      .state('bindingPhone', {
	url: '/bindingPhone',
	templateUrl: 'templates/userCenter/bindingPhone/bindingPhone.html',
	controller: 'bindingPhoneCtrl'
})
      .state('setting', {
	url: '/setting',
	templateUrl: 'templates/userCenter/setting/setting.html',
	controller: 'settingCtrl'
})
      .state('Nopay', {
	url: '/Nopay',
  cache:false,
	templateUrl: 'templates/userCenter/Nopay/Nopay.html',
	controller: 'NopayCtrl'
})
      .state('Pay', {
	url: '/Pay',
	cache: false,
	templateUrl: 'templates/userCenter/Pay/Pay.html',
	controller: 'PayCtrl'
})
      .state('Noevaluate', {
	url: '/Noevaluate',
	cache:false,
	templateUrl: 'templates/userCenter/Noevaluate/Noevaluate.html',
	controller: 'NoevaluateCtrl'
})
      .state('lose-efficacy', {
	url: '/lose-efficacy',
  cache:false,
	templateUrl: 'templates/userCenter/lose-efficacy/lose-efficacy.html',
	controller: 'loseEfficacyCtrl'
})
.state('endOrderDetail', {
url: '/endOrderDetail',
cache:false,
params:{data:null},
templateUrl: 'templates/userCenter/endOrderDetail/endOrderDetail.html',
controller: 'endOrderDetailCtrl'
})
      .state('Consume', {
	url: '/Consume',
	templateUrl: 'templates/userCenter/Consume/Consume.html',
	controller: 'ConsumeCtrl'
})
      .state('status', {
	url: '/status/:id',
	templateUrl: 'templates/userCenter/status/status.html',
	controller: "statusCtrl"
})
      .state('Order-form', {
	url: '/Order-form/:id',
  cache:false,
	templateUrl: 'templates/userCenter/Order-form/Order-form.html',
	controller: 'OrderformCtrl'
})
      .state('evaluate', {
	url: '/evaluate',
	params:{data:null},
	templateUrl: 'templates/userCenter/evaluate/evaluate.html',
	controller:'evaluateCtrl'
})
      .state('clean', {
	url: '/clean',
	params: {
		data: null
	},
  cache:false,
	templateUrl: 'templates/ctrl/clean/clean.html',
	controller: 'cleanCtrl'
})
      .state('repair', {
	url: '/repair',
	templateUrl: 'templates/userCenter/repair/repair.html'
})
      .state('binding', {
	url: '/binding',
	templateUrl: 'templates/userCenter/binding/binding.html',
	controller: 'bindingCtrl'
})
      .state('orderDetail', {
	url: '/orderDetail',
	params: {
		'order': {}
	},
	cache: false,
	templateUrl: 'templates/shopCar/orderDetail/orderDetail.html',
	controller: 'orderDetailCtrl'
})
      .state('invoice', {
	url: '/invoice',
	params: {
		order: null
	},
	templateUrl: 'templates/shopCar/invoice/invoice.html',
	controller: 'invoceCtrl'
});
    // if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/home');


    // if none of the above states are matched, use this as the fallback
});
