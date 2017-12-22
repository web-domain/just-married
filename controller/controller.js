app.controller('wrapperController', ['$scope', 'commonService', function($scope, commonService){
    var pathToJSON = 'data/data.json';
    commonService.getJSONData(function(response){
        $scope.$broadcast('onload', response.data);
    }, pathToJSON);
}]);

app.controller('preloaderController', ['$scope', function($scope){
    window.onload = function() {
        $('#preloader-wrapper').fadeOut(1000);
    }
}]);

app.controller('guestTypeController', ['$scope', '$rootScope', '$window', function($scope, $rootScope, $window){
    $scope.$on('onload', function(event, data){
        var windowWidth = $window.innerWidth;
        $scope.guestTypeSelection = data.guestType;
        $rootScope.imageFolder = (windowWidth <= 767) ? 'images/sm-screen/' : 'images/lg-screen/';
        $scope.guestTypeIdentification = function(idIndex){
            $rootScope.guestType = (idIndex === 1) ? 'groom' : 'bride';
            $('body, html').css({'overflow-x':'hidden !important', 'overflow-y':'auto'});
            $(window).scrollTop(0);
            $('.guest-type-container').fadeOut(1000);
        }
    });
}]);

app.controller('navigationController', ['$scope', '$rootScope', '$location', 'commonService', function($scope, $rootScope, $location, commonService){
    $scope.$on('onload', function(event, data){
        $scope.navMenuItems = data.navMenuItems;
        $rootScope.isPreloadStarted = false;
        $scope.scrollTo = function(scrollLocation, event){
            $location.hash(scrollLocation);
            commonService.gotoElement(scrollLocation);
            $('.navbar-default .navbar-nav > li > a').removeClass('navbar-active');
            $('#' + event.target.id).addClass('navbar-active');
        }
        /* FOCUS CHANGE OF NAV ITEMS ON MOUSE SCROLLING */
        document.addEventListener('scroll', _onScrollActiveNavMenu);
        
        function _onScrollActiveNavMenu(event)
        {
            var scrollPosition = $(document).scrollTop();
            var navHeight = $('.navbar-fixed-top').outerHeight();

            $('.navbar-default .navbar-nav > li > a').each(function () {
                var currentLink = $(this);
                var refElement = $(currentLink.attr('href'));
                refElement.removeClass('navbar-active');
                
                if(refElement.position().top <= (scrollPosition + navHeight) && refElement.position().top + refElement.height() > (scrollPosition + navHeight)) {
                    $('.navbar-default .navbar-nav > li > a').removeClass('navbar-active');
                    currentLink.addClass('navbar-active');
                } else {
                    currentLink.removeClass('navbar-active');
                }
                
                if($(document).scrollTop() >= $('#invitation').outerHeight()) {
                    $rootScope.isPreloadStarted = true;
                }
            });
        }
    });
}]);

app.controller('iconTrayController', ['$scope', '$timeout', '$window', function($scope, $timeout, $window){
    $scope.$on('onload', function(event, data) {
        var isIconTrayOpened = false;
        var audioElement = document.getElementById('audio-element');
        audioElement.volume = 0.1;
        $scope.iconTray = data.tray;
        $scope.isDisableAudio = false;
        $scope.isDisableVideo = false;
        $scope.windowWidth = $window.innerWidth;
        $scope.onClickTrayIcon = function() {
            if (!isIconTrayOpened) {
                $('.tray-icon > div').fadeIn(500);
                isIconTrayOpened = true;
            } else {
                $('.tray-icon > div').fadeOut(500);
                isIconTrayOpened = false;
            }
        }
        $scope.onPageRefresh = function() {
            $(window).scrollTop(0);
            $window.location = $window.location.origin + $window.location.pathname;
        }
        $scope.checkEnableAudio = function() {
            $scope.isDisableAudio = !$scope.isDisableAudio;
            audioElement.muted = $scope.isDisableAudio;
        }
        $scope.checkEnableVideo = function() {
            $scope.isDisableVideo = !$scope.isDisableVideo;
        }
    });
    angular.element($window).bind('resize', function(){
        $scope.windowWidth = $window.innerWidth;
    });
}]);

app.controller('homeController', ['$scope', function($scope) {
    $scope.$on('onload', function(event, data) { 
        $scope.home = data.home;    
    });
}]);

app.controller('coupleController', ['$scope', '$window', function($scope, $window){
    $scope.$on('onload', function(event, data) {
        $scope.couple = data.couple;
    });
    window.addEventListener('load', function(event) {
        _onResizeSetSnowfallHeight();
    });
    angular.element($window).bind('resize', function(){
        _onResizeSetSnowfallHeight();
    });
    function _onResizeSetSnowfallHeight() {
        var coupleSectionHeight = $('#couple').outerHeight();
        $('.snow-ball').css({'height': coupleSectionHeight})        
    }
}]);

app.controller('invitationController', ['$scope', '$rootScope', '$window', function($scope, $rootScope, $window){
    $scope.$on('onload', function(event, data) {
        var invitationType = '';
        $scope.windowWidth = $window.innerWidth;
        $scope.invitation = data.invitation;
        $scope.$watch('guestType', function(newValue, oldValue){
            if(newValue !== oldValue) {
                invitationType = $rootScope.guestType;
                $scope.tabIndex = (invitationType === 'groom') ? 0 : 1;
                $scope.selectInvitationCard(invitationType);
            }
        });
        $scope.selectInvitationCard = function(type) {
            if(type === 'groom') {
                $scope.invitationCard = $scope.invitation.tab_content[0].card;
            } else {
                $scope.invitationCard = $scope.invitation.tab_content[1].card;
            }
        }
    });
    angular.element($window).bind('resize', function() {
        $scope.windowWidth = $window.innerWidth;
    });
}]);

app.controller('eventsController', ['$scope', function($scope) {
    $scope.$on('onload', function(event, data) {
        $scope.events = data.events;
        $scope.showModal = function(content) {
            $scope.routeInfo = content;
        }
    });
}]);

app.controller('galleryController', ['$scope', '$window', function($scope, $window){
    $scope.$on('onload', function(event, data) {
        $scope.gallery = data.gallery;
        _onResizeGalleryWindow();
    });
    angular.element($window).bind('resize', function(){
        _onResizeGalleryWindow();
    });
    function _onResizeGalleryWindow() {
        var windowWidth = $window.innerWidth;
        var chunkLimit = 0, noOfIndicators = [];
        if (windowWidth <= 767) {
            chunkLimit = 1;
        } else if (windowWidth > 767 && windowWidth <= 991) {
            chunkLimit = 2;
        } else if (windowWidth > 991) {
            chunkLimit = 3;
        }
        $scope.photos = _.cloneDeep($scope.gallery.photos);
        $scope.photos = _.chunk($scope.photos, chunkLimit);
        for (let index = 0; index < $scope.photos.length; index++) {
            noOfIndicators.push(index);
        }
        $scope.indicators = noOfIndicators;
    }
}]);

app.controller('momentsController', ['$scope', function($scope){
    $scope.$on('onload', function(event, data) {
        $scope.moments = data.moments;
        $scope.buttons = $scope.moments.buttons;
        $scope.selectMomentsPhotoType = function (id) {
            var noOfIndicators = [];
            $('.moments-content .button-container button').removeClass('moments-active-btn');
            $('.moments-content .button-container button:nth-child(' + (id + 1) + ')').addClass('moments-active-btn');
            $scope.album = $scope.moments.photos[id];
        }
        $scope.selectMomentsPhotoType(0);
    });
}]);

app.controller('notesController', ['$scope', '$rootScope', '$interval', 'commonService', function($scope, $rootScope, $interval, commonService){
    $scope.$on('onload', function(event, data) {
        var eventDate, timer;
        $scope.notes = data.notes.post_event_message;
        $scope.$watch('guestType', function(newValue, oldValue){
            if(newValue !== oldValue) {
                eventDate = ($rootScope.guestType === 'groom') ? '12/08/2017' : '12/04/2017';
                timer = $interval(function () {
                    if ($scope.days !== 0) {
                        var timeObject = commonService.getRemainingTime(new Date(), eventDate);
                        $scope.days = timeObject.days;
                        $scope.hours = timeObject.hours;
                        $scope.minutes = timeObject.minutes;
                        $scope.seconds = timeObject.seconds;
                        $scope.stopwatch = [
                            ['days', $scope.days], 
                            ['hours', $scope.hours], 
                            ['minutes', $scope.minutes], 
                            ['seconds', $scope.seconds]
                        ];
                    } else {
                        $interval.cancel(timer);
                    }
                }, 1000);
                $scope.units = ['days', 'hours', 'minutes', 'seconds'];
            }
        });
    });
}]);
