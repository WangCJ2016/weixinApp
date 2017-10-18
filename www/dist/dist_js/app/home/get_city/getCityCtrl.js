angular.module('getCity-controller',[])
	.controller('getCityCtrl', ['$scope', '$ionicNativeTransitions', '$state', '$timeout', '$location', '$ionicScrollDelegate', '$timeout', '$anchorScroll', 'ApiService', function($scope,$ionicNativeTransitions,$state,$timeout,$location,$ionicScrollDelegate,$timeout,$anchorScroll,ApiService) {
		$scope.letters = ["A","B","C",,"D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
     //当前城市
		$scope.nowCity = sessionStorage.getItem("nowcity");
	  //获取城市数据
	 ApiService.getBussinessArea().success(function(res){
	 	var cityArr = [];
		for(var i = 0,len=res.length;i<len;i++){
			for(var j = 0,citylen=res[i].cities.length;j<citylen;j++){
				cityArr.push(res[i].cities[j].name);
			}
		}
		$scope.allcityArr = pySegSort(cityArr);
		//最近访问的城市
		if(localStorage.getItem("visited")){
			$scope.visitedCity = JSON.parse(localStorage.getItem("visited"));
		}else{
			$scope.visitedCity = [];
		}
		//搜索城市
       	$scope.Data = {
    		searchcity:""
    	};
		$scope.SearchCity = function(city){
       	sessionStorage.setItem("city",$scope.Data.searchcity);
			$scope.visitedCity.unshift($scope.Data.searchcity);
			for(var i=0;i<$scope.visitedCity.length;i++){
				var a = $scope.visitedCity[i];
				for(var j=i+1;j<$scope.visitedCity.length;j++){
					if($scope.visitedCity[j]==a){
						$scope.visitedCity.splice(j,1);
						j=j-1;
					}
				}
			}
			if($scope.visitedCity.length>3){
				$scope.visitedCity.pop();
			}
			localStorage.setItem("visited",JSON.stringify($scope.visitedCity));
		};
		//点击选择城市
		 $scope.cityChoose = function(city){
			sessionStorage.setItem("city",city);
			sessionStorage.setItem("nowcity",city);
			localStorage.setItem("city", city);
			$scope.visitedCity.unshift(city);
			for(var i=0;i<$scope.visitedCity.length;i++){
				var a = $scope.visitedCity[i];
				for(var j=i+1;j<$scope.visitedCity.length;j++){
					if($scope.visitedCity[j]==a){
						$scope.visitedCity.splice(j,1);
						j=j-1;
					}
				}
			}
			if($scope.visitedCity.length>3){
				$scope.visitedCity.pop();
			}
			localStorage.setItem("visited",JSON.stringify($scope.visitedCity));
		};
	 });
	 //当前、最近、热门
		$scope.now=["当前","最近","热门"];
		$scope.nowTouch=function(index){
			$location.hash("state_"+index);
			$ionicScrollDelegate.anchorScroll(true);
		};
		//热门城市
		$scope.hotCity=["北京市","上海市","广州市","深圳市","杭州市","重庆市","成都市","沈阳市","武汉"];
		$scope.hotCitycont = function(index){
			sessionStorage.setItem("city",$scope.hotCity[index]);
		};
		//选择热门城市
		$scope.hotCitycont = function(index){
			sessionStorage.setItem("city",$scope.hotCity[index]);
			localStorage.setItem('city',$scope.hotCity[index]);
		};
	  //按首字母排序函数
	     function pySegSort(arr) {
		    if(!String.prototype.localeCompare)
		        return null;
		    var letters = "*abcdefghjklmnopqrstwxyz".split('');
		    var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
		    var segs = [];
		    var curr;
		    letters.forEach(function(item,i){
		        curr = {letter: item, data:[]};
		        arr.forEach(function(item2){
		            if((!zh[i-1] || zh[i-1].localeCompare(item2) <= 0) && item2.localeCompare(zh[i]) == -1) {
		                curr.data.push(item2);
		            }
		        });
		        if(curr.data.length) {
		            segs.push(curr);
		            curr.data.sort(function(a,b){
		                return a.localeCompare(b);
		            });
		        }
		    });
		    return segs;
	}
	     //滚动条滚动问题
	    $scope.showMiddle=false;
	    $scope.mTouch=function(c){
		  	$scope.hint=c;
		  	$scope.showMiddle=true;
		$location.hash("city_"+$scope.hint);
		$ionicScrollDelegate.anchorScroll(true);
			 $timeout(function(){
	            $scope.showMiddle=false;
	        },300);
	};

		//城市搜搜
		$scope.search = {
			text:''
		};
		$scope.searchGo = function(){
			var data = $scope.search;

			$state.go('nearby');
			sessionStorage.setItem('city',$scope.search.text);
		};
	}]);
