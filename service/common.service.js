app.service('commonService', ['$http', '$log', function($http, $log) {
    /* PARSE JSON DATA */
    this.getJSONData = function(callbackFunction, path) {
        $http.get(path)
        .then(function(response) {                                         
            callbackFunction(response);
        }, function(error) {
            $log.error('The request has failed: ' + error + 'for JSON: ' + path);     
        });
    };
    /* COUNTDOWN TIMER */
    this.getRemainingTime = function(currentDate, eventDate) {
        var timeObject = {};
        var currentDate = new Date(currentDate);
        var eventDate = new Date(eventDate);
        var timeDifference = Math.abs(eventDate.getTime() - currentDate.getTime());
        var seconds = Math.floor(timeDifference / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        
        timeObject = {
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
        return timeObject;
    };
    /* SMOOTH SCROLLING */
    this.gotoElement = function(elementId) {
        var startY, stopY, distance, speed, step, leapY, timer = 0;
        startY = _currentYPosition();
        stopY = _elementYPosition(elementId);
        distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        speed = Math.round(distance / 10);
        if (speed >= 20) speed = 50;
        step = Math.round(distance / 25);
        leapY = stopY > startY ? startY + step : startY - step;
        if (stopY > startY) {
            for (let i = startY; i < stopY; i += step) {
                setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for (let i = startY; i > stopY; i -= step ) {
            setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY; timer++;
        }
        function _currentYPosition() {
            if (self.pageYOffset) return self.pageYOffset;
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        function _elementYPosition(elementId) {
            var element, y, node; 
            element = document.getElementById(elementId);
            y = element.offsetTop;
            node = element;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    };
}]);
