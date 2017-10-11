angular.module('model-controller', [])
.controller('modelCtrl',function($scope,$rootScope,$stateParams,ApiService){
	$scope.goback = function(){
	  $rootScope.$ionicGoBack();
	}
  // $scope.modelArray = ['起床','睡眠','阅读','外出','影视','迎宾'];
	ApiService.queryHostScenes({serverId:sessionStorage.getItem('serverId')}).success(function(res){
		if(res.success){
			console.log(res)
			var models = res.dataObject
			$scope.modelArray = models.filter(function(model,index){
					return   model.name.indexOf('情景') > -1;
				});
			console.log($scope.modelArray)
			$scope.modelCtrl = function(sceneId, index){
				$scope.index=index;

				var data = {
					houseId:sessionStorage.getItem('houseId'),
					deviceType:'SCENE',
					port:sessionStorage.getItem('port'),
					serverId:sessionStorage.getItem('serverId'),
					sceneId: sceneId
				};
				ApiService.smartHostControl(data).success(function(res){
					console.log(res)
				});
			};
		}
	});
});
