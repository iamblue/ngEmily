/*! ngEmily - v0.0.0 - 2013-12-15 | Copyright (c) 2013 Po-Ju Chen <tonyone0902@gmail.com> */

(function() {
    var eMediaDirective, eMediaService;
    eMediaDirective = function(eMediaService) {
        return {
            restrict: "AE",
            replace: true,
            transclude: true,
            template: '<video class="camera" autoplay="" /><div ng-transclude></div>',
            link: function(scope, elem, attrs) {
                var _w, _h, success, error, userMedia, videoElement;
                _w = Number(attrs.width.replace("px"));
                _h = Number(attrs.height.replace("px"));
                success = function(stream) {
                    var vendorURL;
                    if (navigator.mozGetUserMedia) {
                        videoElement.mozSrcObject = stream;
                    } else {
                        vendorURL = window.URL || window.webkitURL;
                        videoElement.src = window.URL.createObjectURL(stream);
                    }
                    videoElement.play();
                };
                error = function(err) {
                    console.log(err);
                };
                if (!eMediaService.hasUserMedia) {
                    false;
                } else {
                    userMedia = eMediaService.getUserMedia();
                    videoElement = document.querySelector("video");
                    navigator.getUserMedia({
                        video: {
                            mandatory: {
                                maxHeight: _h,
                                maxWidth: _w
                            }
                        },
                        audio: true
                    }, success, error);
                }
            }
        };
    };
    eMediaService = [ "$window" ].concat(function($window) {
        var hasUserMedia, getUserMedia;
        hasUserMedia = function() {
            return !!getUserMedia();
        };
        getUserMedia = function() {
            return navigator.getUserMedia = $window.navigator.getUserMedia || $window.navigator.webkitGetUserMedia || $window.navigator.mozGetUserMedia || $window.navigator.msGetUserMedia;
        };
        return {
            hasUserMedia: hasUserMedia(),
            getUserMedia: getUserMedia
        };
    });
    angular.module("emily", []).factory("eMediaService", eMediaService).directive("eMedia", eMediaDirective);
}).call(this);