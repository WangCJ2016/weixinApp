angular.module('basicmess-controller', [])
  .controller('basicmessCtrl', ['$scope', '$rootScope', function($scope,$rootScope) {
	$scope.goback = function(){
		$rootScope.$ionicGoBack();
	};
}]);
