angular.module('tv-controller', [])
.controller('tvCtrl',function($scope,ApiService,$rootScope,$stateParams){
	$scope.goback = function(){
	  $rootScope.$ionicGoBack();
	}
 
	var data = {
		houseId: sessionStorage.getItem('houseId')
	};
	
	ApiService.queryTvDevices(data).success(function(res){
		console.log(res)
		$scope.tvArrays = res.dataObject
		for(var i in $scope.tvArrays) {
			$scope.tvArrays[i].tv_status = 'OFF'
		}
		$scope.length = Object.keys($scope.tvArrays).length
		$scope.title = Object.keys(Object.values($scope.tvArrays)[0])[0].replace(/[0-9$]/g, '')
		more()
		console.log($scope.length)
		$scope.tvswitch = false;
		//电视机开
		$scope.tvon = function(tv, status, index){
		$scope.tvswitch = !$scope.tvswitch;
		  var status ;
			if (status === 'OFF') {
				setOrder('ON', tv);
				status = 'ON'
			}else{
				setOrder('OFF', tv);
				status = 'OFF'
			}
			for(var i in $scope.tvArrays) {
				//console.log(i, index)
				if (i == index + 1) {
					$scope.tvArrays[i].tv_status = status
				}
			}
		};

			//电视加
		$scope.tvAdd = function(tv){
			setOrder('VOL_PLUS', tv);
		};
			 //电视减
		$scope.tvMunis = function(tv){
			setOrder('VOL_SUB', tv);
		};
			 //机顶盒开
		$scope.tvboxswitch = false;
		$scope.tvBoxOn = function(tv){
			$scope.tvboxswitch = !$scope.tvboxswitch;
			if($scope.tvboxswitch){
			setOrder_box('ON',tv)
		}else{
			setOrder_box('OFF',tv);
		}
		};

			 //机顶盒静音
		$scope.tvBoxMute = function(tv){
			setOrder_box('MUTE',tv);
		};
			 //机顶盒返回
		$scope.tvBoxReturn = function(tv){
			setOrder_box('RETURN',tv);
		};
			 //机顶盒up
		$scope.tvBoxUp = function(tv){
			setOrder_box('UP',tv);
		};
			 //机顶盒down
		$scope.tvBoxDown = function(tv){
			setOrder_box('DOWN',tv);
		};
			 //机顶盒left
		$scope.tvBoxLeft = function(tv){
			setOrder_box('LEFT',tv);
		};
			 //机顶盒right
		$scope.tvBoxRight = function(tv){
			setOrder_box('RIGHT',tv);
		};
			 //机顶盒ok
		$scope.tvBoxOk = function(tv){
			setOrder_box('OK',tv);
		};
			 //机顶盒right
		$scope.tvBoxRight = function(tv){
			setOrder_box('RIGHT',tv);
		};
			 //机顶盒num
		$scope.tvBoxNum = function(num, tv){
			setOrder_box(num,tv);
		};
		function setOrder(key, tv) {
			var deviceId = ''
			for(var i in tv){
	      if (i.indexOf('电视机')>-1) {
	        deviceId = tv[i]
	      }
   	  }
				var data = {
					houseId : sessionStorage.getItem('houseId'),
					deviceType : 'VIRTUAL_TV_DVD_REMOTE',
					deviceId : deviceId,
					key : key,
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId')
				};
			ApiService.smartHostControl(data).success(function(res){console.log(res);});
				}
	});
	function setOrder_box(key, tv) {
			var deviceId = ''
			for(var i in tv){
	      if (i.indexOf('机顶盒')>-1) {
	        deviceId = tv[i]
	      }
   	  }
				var data = {
					houseId : sessionStorage.getItem('houseId'),
					deviceType : 'VIRTUAL_TV_DVD_REMOTE',
					deviceId : deviceId,
					key : key,
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId')
				};
			ApiService.smartHostControl(data).success(function(res){console.log(res);});
	}
	$scope.tvon = function(){
		$scope.tvswitch = !$scope.tvswitch;
	}
 // 多台电视机
	function more() {
		$scope.potArray = []
		if ($scope.length > 1) {
			for (var i = $scope.length - 1; i >= 0; i--) {
			$scope.potArray.push(i)
		}
		}
		$scope.perWidth = 100 / $scope.length
	  $scope.tvState = 0
	}
	
	//向右滑
	$scope.onSwipeRight = function() {
		if ($scope.tvState > 0) {
			$scope.tvState--
			$scope.title = Object.keys(Object.values($scope.tvArrays)[$scope.tvState])[0].replace(/[0-9$]/g, '')

		}
	}
	//向左滑
	$scope.onSwipeLeft = function() {
		if ($scope.tvState < $scope.length - 1) {
			$scope.tvState++
			$scope.title = Object.keys(Object.values($scope.tvArrays)[$scope.tvState])[0].replace(/[0-9$]/g, '')
		}
	}
});
