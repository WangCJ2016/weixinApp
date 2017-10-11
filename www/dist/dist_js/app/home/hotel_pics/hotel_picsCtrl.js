angular.module('hotelPicsCtrl-controller', [])
  .controller('hotelPicsCtrl', ['$scope', '$rootScope', '$ionicNativeTransitions', '$ionicHistory', '$ionicSlideBoxDelegate', 'hotelPics', '$stateParams', '$state', function($scope,$rootScope,$ionicNativeTransitions,$ionicHistory,$ionicSlideBoxDelegate, hotelPics, $stateParams,$state) {
    //back
	$scope.back = function(){
		$ionicNativeTransitions.stateGo('houseDtail',{id:sessionStorage.getItem('currentId')},{},{
			"type": "slide",
			"direction": "right"// 'left|right|up|down', default 'left' (which is like 'next')
		});
	};
	$scope.picShow = false;
	$scope.index = 1;
	$scope.imgsrcs = [];

	$scope.outView = [];
	$scope.hall = [];
	$scope.restaurant = [];
	$scope.restArea = [];
	$scope.proscenium = [];
	$scope.other = [];

	for (var i = 0; i < hotelPics.pics.length; i++) {
		$scope.imgsrcs.push(hotelPics.pics[i].pictures.split(','));

		switch (hotelPics.pics[i].type) {
		case 0:
			$scope.outView=hotelPics.pics[i].pictures.split(',');
			break;
		case 1:
			$scope.hall=hotelPics.pics[i].pictures.split(',');
			break;
		case 2:
			$scope.restaurant=hotelPics.pics[i].pictures.split(',');
			break;
		case 3:
			$scope.restArea=hotelPics.pics[i].pictures.split(',');
			break;
		case 4:
			$scope.proscenium=hotelPics.pics[i].pictures.split(',');
			break;
		case 5:
			$scope.other=hotelPics.pics[i].pictures.split(',');
			break;
		default:
			break;
		}
	}
	$scope.imgall=[];
	for(var i=0;i<$scope.imgsrcs.length;i++){
		for(var j=0;j<$scope.imgsrcs[i].length;j++){
			$scope.imgall.push($scope.imgsrcs[i][j]);
		}
	}
	$scope.hotelPics = [{
		imgsrcs: '全部',
		all: $scope.imgall
	}, {
		imgsrcs: '外观',
		all: $scope.outView
	}, {
		imgsrcs: '餐厅',
		all: $scope.hall
	}, {
		imgsrcs: '大厅',
		all: $scope.restaurant
	}, {
		imgsrcs: '休息区域',
		all: $scope.restArea
	}, {
		imgsrcs: '前台',
		all: $scope.proscenium
	}, {
		imgsrcs: '其他',
		all: $scope.other
	}, ];
	$scope.allImgs = $scope.imgall;
	$scope.indexi = 0;

	$scope.changeColor = function(i, pics) {
		$scope.indexi = i;
		$scope.allImgs = pics;

	};
	$scope.ngshowif = function(i) {
		$scope.maskShow = true;
		$scope.index = i;
		$ionicSlideBoxDelegate.slide($scope.index);
		var data = {
			imgsrcs:$scope.allImgs,
			index:i
		};
		$state.go('picShow',{data:data});
	};

	$scope.switch = function() {
		$scope.maskShow = false;
	};
}]);
