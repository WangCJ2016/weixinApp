angular.module('setting-controller', [])
  .controller('settingCtrl', function($scope, $ionicPlatform, $cordovaFileTransfer, ApiService, $ionicLoading, DuplicateLogin, systemBusy, $cordovaCamera, $ionicViewSwitcher, $ionicActionSheet, $ionicPopup, $cordovaImagePicker, $state, $timeout) {
    $scope.imghead = localStorage.getItem('imghead') ? localStorage.getItem('imghead') : "imgs/kwn/logo.png";
    // 二维码
    $scope.qrCode = function() {

      var person = {
        id: localStorage.getItem('customerId'),
        head: $scope.imghead
      };
      $state.go('qrCode', {
        person: person
      }, {
        cache: false
      });
    };
    $scope.changeHeadPic = function() {

      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '拍照'
        }, {
          text: '从图库中获取'
        }, ],
        cancelText: '取消',

        buttonClicked: function(index) {
          hideSheet();
          if (index == 1) {
            // statement
            var options = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
            };

            $cordovaImagePicker.getPictures(options)
              .then(function(results) {
                for (var i = 0; i < results.length; i++) {
                  $scope.imghead = results[i];
                }
                $ionicLoading.show({
                  template: '<ion-spinner icon="ios"></ion-spinner>'
                });
                var url = "http://www.live-ctrl.com/aijukex/op/op_imgUpload";
                var targetPath = $scope.imghead;
                var trustHosts = true;
                var options = {};
                $cordovaFileTransfer.upload(url, targetPath, options)
                  .then(function(result) {
                    // Success!
                    var result = result.response.split(':');
                    var img = result[3].slice(1) + ':' + result[4].slice(0, -2);
                    ApiService.modifyHeadPicture({
                      customerId: localStorage.getItem('customerId'),
                      pciture: img
                    }).success(function(res) {

                      if (res.success) {
                        $ionicLoading.hide();
                        localStorage.setItem('imghead', img);
                        $ionicLoading.show({
                          template: "更换头像成功",
                          noBackdrop: 'true',
                        });
                        $timeout(function() {
                          $ionicLoading.hide();

                        }, 2000);
                      } else {
                        if (res.msg === '非法请求') {
                          $ionicLoading.show({
                            template: DuplicateLogin
                          });
                          $timeout(function() {
                            $ionicLoading.hide();
                            $state.go('login')
                          }, 2000)
                        } else {
                          $ionicLoading.show({
                            template: systemBusy
                          });
                          $timeout(function() {
                            $ionicLoading.hide();
                            $state.go('tab.home')
                          }, 2000)
                        }
                      }
                    });
                  }, function(err) {
                    // Error
                    $ionicLoading.hide();

                    $ionicLoading.show({
                      template: "已取消",
                      noBackdrop: 'true',
                    });
                    $timeout(function() {
                      $ionicLoading.hide();

                    }, 2000);

                  }, function(progress) {
                    // constant progress updates


                  });

              }, function(error) {
                $ionicLoading.hide();

                $ionicLoading.show({
                  template: "已取消",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();

                }, 2000);
                // error getting photos
              });
          } else if (index == 0) {
            hideSheet();
            var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
              quality: 10,
              targetWidth: 400, //照片宽度
              targetHeight: 400
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
              $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner>'
              });
              $scope.imghead = imageURI;
              var url = "http://www.live-ctrl.com/aijukex/op/op_imgUpload";
              var targetPath = imageURI;
              var trustHosts = true;
              var options = {};
              $cordovaFileTransfer.upload(url, targetPath, options)
                .then(function(result) {
                  // Success!


                  var result = result.response.split(':');
                  var img = result[3].slice(1) + ':' + result[4].slice(0, -2);

                  ApiService.modifyHeadPicture({
                    customerId: localStorage.getItem('customerId'),
                    pciture: img
                  }).success(function(res) {

                    if (res.success) {
                      $ionicLoading.hide();
                      localStorage.setItem('imghead', img);
                      $ionicLoading.show({
                        template: "更换头像成功",
                        noBackdrop: 'true',
                      });
                      $timeout(function() {
                        $ionicLoading.hide();

                      }, 2000);
                    }else{
                      if (res.msg==='非法请求') {
          $ionicLoading.show({
            template: DuplicateLogin
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('login')
          },2000)
        }else {
          $ionicLoading.show({
            template: systemBusy
          });
          $timeout(function(){
            $ionicLoading.hide();
            $state.go('tab.home')
          },2000)
        }
                    }
                  });
                }, function(err) {
                  // Error

                }, function(progress) {
                  // constant progress updates

                });
            }, function(err) {
              // error
            });
          }
        }
      });


    };


    //退出当前账号
    $scope.logout = function() {
      $ionicPopup.show({
          template: "确定要退出吗?",
          buttons: [{
            text: '确定',
            onTap: function() {
              return 1;
            }
          }, {
            text: '取消'
          }],
          cssClass: 'ajk',

        })
        .then(function(res) {
          if (res) {
            localStorage.removeItem('customerId');
            localStorage.removeItem('imghead');
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            $state.go('tab.userCenter');
            $ionicViewSwitcher.nextDirection("back");
          } else {

          }
        });


    };
  });
