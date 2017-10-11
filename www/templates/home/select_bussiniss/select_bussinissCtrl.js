angular.module('select_bussiniss-controller', [])
  .controller('select_bussinissCtrl', ["$scope","ApiService",'$state',function($scope,ApiService,$state) {
  	 //页面渲染
	$scope.metroshow = false;
	$scope.listshow = false;
	$scope.contentList = false;
	$scope.metroContList = false;
	$scope.selectShow = function(index){
		showSelect(index);
	};
	function showSelect(index){
		$scope.i = index;
		if(index==2){
			$scope.metroshow = true;
			$scope.contentList = false;
			$scope.metrochecked($scope.metroArr[0]);
		}else if(index==3){
			$scope.metroshow = false;
			$scope.contentList = true;
			$scope.metroContList = false;
			$scope.maplistArr = pySegSort($scope.businissArea);
		}else {
			$scope.metroshow = false;
			$scope.contentList = true;
			$scope.metroContList = false;
			maplist(index);
		}
	}
     //showSelect('0');
  		//获取地铁线路
	 		var CityReg = /市$/;
	$scope.metroArr = [];
	var nowcity = sessionStorage.getItem("city");
	if(CityReg.test(nowcity)){
		nowcity = nowcity.substring(0,nowcity.length-1);
	}
	ApiService.getMetro().success(function(data){
		for(var i = 0,len = data.length;i<len;i++){
			if(data[i].city==nowcity){
				for(var j = 0, length = data[i].linedata.length;j<length;j++){
					$scope.metroArr.push(data[i].linedata[j].line);
				}
			}
		}
		if($scope.metroArr.length==0){
			$scope.selectArr = ["景区","车站|机场","商圈","行政圈","医院","学校","特色"];
			$scope.selectShow = function(index){
				$scope.i = index;
						     		$scope.metroshow = false;
						     		$scope.contentList = true;
						     		$scope.metroContList = false;
						     		maplist(index);
						     	};
					    }else{
					    		$scope.selectArr = ["景区","车站|机场","地铁路线","商圈","行政圈","医院","学校","特色"];
					    }
		showSelect(0);
	});

    //获取地图列表
	function maplist(index) {
     		var Arr = [];
     		$scope.maplistArr=[];
		var placeSearchOptions = { //构造地点查询类
			pageSize: 30,
			pageIndex: 1,
			city: sessionStorage.getItem("city") //城市
		};
		var placeSearch = new AMap.PlaceSearch(placeSearchOptions);
				//关键字查询，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
		placeSearch.search($scope.selectArr[index], callback);
		var placeSearchRender = new Lib.AMap.PlaceSearchRender();
		function callback(status, result) {
			var length = result.poiList.pois.length;
			for(i = 0;i < length;i++){
				Arr.push(result.poiList.pois[i].name);
			}
			for(var i=0;i<Arr.length;i++){
				var a = Arr[i];
				for(var j=i+1;j<Arr.length;j++){
					if(Arr[j]==a){
						Arr.splice(j,1);
						j=j-1;
					}
				}
			}
			$scope.maplistArr = pySegSort(Arr);
			$scope.$apply(function(){
				$scope.maplistArr;
			});
		}
	}
     //按首字母排序函数
	function pySegSort(arr){
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
 	//获取地铁线路
	$scope.metrochecked = function(line){
		$scope.metroContList = true;
		var nowcity = sessionStorage.getItem("city");
		if(CityReg.test(nowcity)){
			nowcity = nowcity.substring(0,nowcity.length-1);
		}
		var arr=[];
	     		$scope.maplistArr=[];
		ApiService.getMetro().success(function(data){
			for(var i = 0,len = data.length;i<len;i++){
				if(data[i].city==nowcity){
					for(var j = 0, length = data[i].linedata.length;j<length;j++){
						if(data[i].linedata[j].line==line){
							for(var k = 0;k<data[i].linedata[j].linestation.length;k++){
								arr.push(data[i].linedata[j].linestation[k]);
							}
						}
					}
				}
			}
			$scope.maplistArr = pySegSort(arr);
		});
	};
      //获取商圈数据
	ApiService.getBussinessArea().success(function(res){
		var selectCity = sessionStorage.getItem("city");
		var data = res;
		var businessCounties = [];
		$scope.businissArea = [];
		for(var i=0;i<data.length;i++){
			for(var j=0;j<data[i].cities.length;j++){
				if(selectCity==data[i].cities[j].name){
					businessCounties = data[i].cities[j].counties;
				}
			}
		}
		for(var i=0;i<businessCounties.length;i++){
			$scope.businissArea.push(businessCounties[i].name);
		}
	});

      //跳转nearby
	$scope.goNearby = function(data){
		$state.go('nearby',{city:data});
    sessionStorage.setItem('searchType','1')
	};

  //最上方搜索框
  $scope.searchText = {
    text:''
  };
  $scope.submitSearch = function(){
    $state.go('nearby',{city:$scope.searchText.text})
    sessionStorage.setItem('searchType','2')
  }

}]);
