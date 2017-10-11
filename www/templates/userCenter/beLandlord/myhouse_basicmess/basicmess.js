angular.module('basicmess-controller', [])
  .controller('basicmessCtrl', function($scope,$rootScope) {
	$scope.goback = function(){
		$rootScope.$ionicGoBack();
	};
});
