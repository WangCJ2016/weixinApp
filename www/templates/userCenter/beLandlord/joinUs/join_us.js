angular.module('joinUs-controller', [])
  .controller('joinUsCtrl', function($scope, $state, $cordovaFileTransfer, DuplicateLogin, systemBusy, $ionicLoading, $rootScope, $ionicActionSheet, $cordovaImagePicker, $timeout, $cordovaCamera, ApiService) {
    ApiService.getCustomerInfo({
      customerId: localStorage.getItem('customerId')
    }).success(function(res) {
      if (res.success) {
        if (res.dataObject.type === 1) {
          $scope.bindWhether = true;
          $scope.landlord = res.dataObject.landlord
        } else if (res.dataObject.type === 0) {
          if (res.dataObject.landlord.status === 0) {
            $state.go('waitCheck')
          }
          if (res.dataObject.landlord.status === 2) {
            $scope.bindWhether = false;
          }
        }
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
    })
    $scope.idCard = true;
    $scope.imgheads = [];
    $scope.name = '';
    $scope.data = {
      customerId: localStorage.getItem('customerId'),
      name: '',
      cardNo: '',
      cardPictureFront: '',
      cardPictureBack: '',
      address: '浙江省--西湖区',
      detailAddress: ''
    };

    //获取省份证
    $scope.getIdCard = function(type) {
      $scope.type = type;
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '拍照'
        }, {
          text: '从图库中获取'
        }, ],
        cancelText: '取消',

        buttonClicked: function(index) {
          $scope.idCard = false;
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
                //for (var i = 0; i < results.length; i++) {

                if ($scope.type == 'font') {
                  $scope.fontImg = results[0];
                  $scope.imgs = results[0];

                } else {
                  $scope.backImg = results[0];
                  $scope.imgs = results[0];

                }
                //  }

                subImgs();
              });
          } else if (index == 0) {
            var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
              quality: 40,
              targetWidth: 400, //照片宽度
              targetHeight: 400
            };

            $cordovaCamera.getPicture(options).then(function(imageURI) {
              if ($scope.type == 'font') {
                $scope.fontImg = imageURI;

                $scope.imgs = imageURI;
              } else {
                $scope.backImg = imageURI;
                $scope.imgs = imageURI;
              }

              subImgs();
            }, function(err) {
              // error
            });
          }





        }
      });
    };

    //上传照片
    function subImgs() {
      var url = "http://www.live-ctrl.com/aijukex/op/op_imgUpload";

      var trustHosts = true;
      var options = {};

      var targetPath = $scope.imgs;
      $cordovaFileTransfer.upload(url, targetPath, options)
        .then(function(result) {
          // Success

          var result = result.response.split(':');
          var img = result[3].slice(1) + ':' + result[4].slice(0, -2);


          //$scope.$apply();

          if ($scope.type == 'font') {
            $scope.data.cardPictureFront = img;
          } else {
            $scope.data.cardPictureBack = img;
          }
        }, function(err) {
          // Error

        }, function(progress) {
          // constant progress updates

        });


    }
    //android获取地址
    $scope.$on('PCTSELECT_SUCCESS', function() {
      var detail = JSON.parse(sessionStorage.getItem('detailAddress'));
      $scope.data.address = detail.province + '-' + detail.city + '-' + detail.town;
    });
    //ios获取地址
    $scope.$on('cityPickerChange', function() {
      //$scope.province = localStorage.getItem('cityPickerProvince')

      $scope.data.address = $scope.city_province + '-' + $scope.city_city + '-' + $scope.city_towns;
    });

    //提交
    $scope.submit = function() {


      if (ionic.Platform.isAndroid()) {
        if (sessionStorage.getItem('address')) {
          $scope.data.address = JSON.parse(sessionStorage.getItem('address'));
          $scope.data.address = $scope.data.address.province + '-' + $scope.data.address.city + '-' + $scope.data.address.town;
        } else {
          $scope.data.address = '浙江省-杭州市-西湖区';
        }
      }

      var re1 = /^[\u4E00-\u9FA5]{2,4}$/; //姓名
      var re2 = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/; //身份证
      if (re1.test($scope.data.name)) {
        if (re2.test($scope.data.cardNo)) {
          if ($scope.data.cardPictureFront && $scope.data.cardPictureBack) {
            if ($scope.data.detailAddress != '') {
              if (ionic.Platform.isAndroid()) {
                var data = {};
                for (attr in $scope.data) {
                  data[attr] = $scope.data[attr];
                }
                data.name = encodeURI(data.name);
                data.detailAddress = encodeURI(data.detailAddress);
                data.address = encodeURI(data.address);

                ApiService.customerBecomeLandlord(data).success(function(res) {
                  if (res.success) {
                    $ionicLoading.show({
                      template: '提交成功'
                    });
                    $timeout(function() {
                      $ionicLoading.hide();
                      $state.go('waitCheck');
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
              }
              if (ionic.Platform.isIOS()) {
                var data1 = {};
                for (attr in $scope.data) {
                  data1[attr] = $scope.data[attr];
                }
                data1.name = encodeURI(data1.name);
                data1.detailAddress = encodeURI(data1.detailAddress);
                data1.address = encodeURI(data1.address);
                
                ApiService.customerBecomeLandlord(data1).success(function(res) {
                  if (res.success) {
                    $ionicLoading.show({
                      template: '提交成功'
                    });
                    $timeout(function() {
                      $ionicLoading.hide();
                      $state.go('waitCheck');
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
              }

            } else {
              $ionicLoading.show({
                template: '请填写详细地址',
                noBackdrop: true
              });
              $timeout(function() {
                $ionicLoading.hide();

              }, 2000);
            }

          } else {
            $ionicLoading.show({
              template: '请上传身份证正反面照片',
              noBackdrop: true
            });
            $timeout(function() {
              $ionicLoading.hide();

            }, 2000);
          }
        } else {
          $ionicLoading.show({
            template: '请填写正确身份证号',
            noBackdrop: true
          });
          $timeout(function() {
            $ionicLoading.hide();

          }, 2000);
        }
      } else {
        $ionicLoading.show({
          template: '请填写正确姓名',
          noBackdrop: true
        });
        $timeout(function() {
          $ionicLoading.hide();

        }, 2000);
      }
    };
    //平台
    if (ionic.Platform.isIOS()) {
      $scope.platform = true;
    } else if (ionic.Platform.isAndroid()) {
      $scope.platform = false;
    }



  });
