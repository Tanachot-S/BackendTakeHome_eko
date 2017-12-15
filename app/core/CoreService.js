angular.module('main')
    .service('GlobalService', function ($interval) {
        var intervals = {};
        var userdata = {};
        var appdata = {};
        var currentState = "";
        var previousState = "";

        this.set = function (key, value) {
            userdata[key] = value;
            sessionStorage.setItem("userdata", JSON.stringify(userdata));
        }

        this.get = function (key) {
            if (!sessionStorage.getItem("userdata")) {
                return ""
            } else {
                var temp = JSON.parse(sessionStorage.getItem("userdata"));
                return temp[key]; 
            }
        }

        this.setApp = function (key, value) {
            appdata[key] = value;
        }

        this.getApp = function (key) {
            return appdata[key];
        }

        this.setCurrentState = function (_currentState) {
            currentState = _currentState;
        }

        this.getCurrentState = function () {
            return currentState;
        }

        this.setPreviousState = function (_previousState) {
            previousState = _previousState;
        }

        this.getPreviousState = function () {
            return previousState;
        }

        this.pushInterval = function (tag, time, intervalFunction) {
            intervals[tag] = $interval(intervalFunction, time);
        };

        this.removeInterval = function (tag) {
            if (intervals[tag]) {
                $interval.cancel(intervals[tag]);
            }
        }
        this.clearAllInterval = function () {
            for (var key in intervals) {
                if (intervals.hasOwnProperty(key)) {
                    var element = intervals[key];
                    $interval.cancel(element);
                }
            }
        };

        this.clearAllData = function () {
            userdata = {};
            currentState = "";
            previousState = "";
        }

        this.killAllData = function () {
            userdata = {};
            appdata = {};
            currentState = "";
            previousState = "";
        }
    });