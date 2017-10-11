angular.module('light-controller', [])
.controller('lightCtrl',['$scope', '$rootScope', '$stateParams', '$rootScope', 'ApiService', '$state', '$timeout', function($scope,$rootScope,$stateParams,$rootScope,ApiService,$state,$timeout){
$scope.goback = function(){
  $rootScope.$ionicGoBack();
  //$state.go('checkIn');
}
  //跳转彩灯
	$scope.goColorLight = function(){
		$state.go('colorPicker');
	};
  $scope.tab_navs = ['卧室', '卫生间', '走廊', '其他']
   //获取情景模式
	// ApiService.queryHostScenes({serverId:sessionStorage.getItem('serverId')})
 //  .success(function(res){
	// 	$scope.models = res.dataObject;
	// 	$scope.models.map(function(model){
	// 		model.bgSelect = false;
	// 	});
	// });
	var data = {
		deviceType:'SWITCH',
		ip:sessionStorage.getItem('ip')
	};
   //获取主机路线
   function getways(){
     ApiService.ctrlHostDeviceByType(data)
      .success(function(res){
     if(res.success){
      console.log(res)
       $scope.lights=[];
       for(var i=0;i<res.dataObject.length;i++){
         $scope.lights = $scope.lights.concat(res.dataObject[i].ways);
       }
       $scope.allLights = $scope.lights.filter(function(light,index){
         return light.name.indexOf('灯')>-1;
       });
       $scope.tabClick('卧室', 0)
     }
   })
   }
   getways();
   //切换tab
   $scope.tabClick = function(type, index) {
      $scope.lights = $scope.allLights.filter(function(light,index){
         return light.name.indexOf(type)>-1;
       });

       $scope.lights.forEach(function(light) {
         return light.name = light.name.replace(type, '')
       })
      $scope.tabIndex = index
   }
       //灯控制
		$scope.lightCtrl = function(light){
			var status = light.status=='ON'?"CLOSE":'OPEN';
			light.status=light.status=='ON'?"OFF":'ON';
			var data = {
				houseId:sessionStorage.getItem('houseId'),
				port:sessionStorage.getItem('port'),
				deviceType:'SWITCH',
				serverId:sessionStorage.getItem('serverId'),
				actionType:status,
				wayId:light.wayId,
				brightness:90
			};
			ApiService.smartHostControl(data).success(function(res){
        console.log(res)
      });
		};
       //模式控制
		$scope.modelCtrl = function(type){
			var model = $scope.models.filter(function(model){
				return  model.name == type;
			});
			var ds='';
			switch(type){
			case 'homeon':
				ds='yellow';
				$scope.red=false;
				break;
			case 'homeoff':
				ds = 'red';
				$scope.yellow=false;
				break;
			case 'ledon':
				ds = 'blue';
				$scope.green=false;
				break;
			case 'ledoff':
				ds = 'green';
				$scope.blue=false;
				break;
			}
			var data = {
				houseId:sessionStorage.getItem('houseId'),
				deviceType:'SCENE',
				port:sessionStorage.getItem('port'),
				serverId:sessionStorage.getItem('serverId'),
				sceneId:model[0].sceneId
			};
			ApiService.smartHostControl(data).success(function(res){
				$scope[ds] = !$scope[ds];
        $timeout(function(){
          alert('msg');
          getways()
        },10000)
			});
		};

}]);
