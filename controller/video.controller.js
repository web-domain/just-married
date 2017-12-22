app.controller('videoController', ['$scope', '$rootScope', '$window', 'commonService', function($scope, $rootScope, $window, commonService){
    var pathToJSON = '../../data/video.json';
    var windowWidth = $window.innerWidth;
    var videoElement;
    commonService.getJSONData(function(response){
        if (windowWidth <= 767) {
            $rootScope.imageFolder = '../../images/sm-screen/';
        } else {
            $rootScope.imageFolder = '../../images/lg-screen/';
        }
        $scope.video = response.data.video;
    }, pathToJSON);
}]);

app.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);