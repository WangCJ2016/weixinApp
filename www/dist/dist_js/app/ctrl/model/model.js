angular.module('model-controller', [])
.controller('modelCtrl',['$scope', '$rootScope', 'ApiService', function($scope,$rootScope,ApiService){
	$scope.goback = function(){
	  $rootScope.$ionicGoBack();
	}

	ApiService.queryHostScenes({serverId:sessionStorage.getItem('serverId')}).success(function(res){
		if(res.success){
			var models = res.dataObject
			$scope.modelArray = models.filter(function(model,index){
					return   model.name.indexOf('情景') > -1;
				});
			$scope.modelCtrl = function(sceneId, index){
				$scope.activeIndex=index;

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
}]);
