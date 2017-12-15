angular.module('main')
    .factory('GlobalFunction', function (
        $http,
        $state,
        $templateCache,
        $q,
        GlobalService
    ) {

        var factory = {};
        var canceler = $q.defer();

        factory.httpPost = function (url, data, option, header, callback) {

            var handler = setTimeout(function () {
                canceler.resolve();
                canceler = $q.defer();
                console.info("Timeout");
            }, 60000);

            var _option = {
                method: 'POST',
                url: url,
                data: data,
                timeout: canceler.promise,
                headers: {
                    'uid': GlobalService.get("uid") || "",
                    'ucode': GlobalService.get("ucode") || "",
                    'sessionStorage': sessionStorage.getItem('userdata'),
                    'sessionStorageHash': sessionStorage.getItem('ssHash')
                }

            };
            console.info(_option);
            if (option) {
                for (var key in option) {
                    if (option.hasOwnProperty(key)) {
                        _option[key] = option[key];
                    }
                }
            }
            if (header) {
                for (var key in header) {
                    if (header.hasOwnProperty(key)) {
                        _option.headers[key] = header[key];
                    }
                }
            }
            $http(_option)
                .then(function (result) {
                    console.info(result);
                    if (result.data.status != 'error') {
                        clearTimeout(handler);
                        callback(null, result.data);
                    } else if (result.data.status == 'error' && (result.data.message == "SESSION FAILED" || result.data.message == "DUPLICATE LOGIN")) {
                        GlobalService.clearAllInterval();
                        GlobalService.killAllData();
                        sessionStorage.clear();
                        canceler.resolve();
                        canceler = $q.defer();
                        if (result.data.message == "DUPLICATE LOGIN") {
                            $state.go("duplicate_login")
                        } else if (result.data.message == "SESSION FAILED") {
                            $state.go("session_expire")
                        }
                    } else {
                        clearTimeout(handler);
                        callback("error", result.data.message);
                    }
                }).catch(function (e) {
                    console.log(e)
                    clearTimeout(handler);
                    callback(e, "Connection timeout");
                });
        };

        factory.getToken = function (idElement) {
            var tokenElement = document.getElementById(idElement);
            return angular.element(tokenElement).val();
        }

        factory.changePage = function (stateName) {
            $state.go(stateName);
        }

        factory.changePageWithData = function (stateName, data) {
            $state.go(stateName, data);
        }

        factory.getMasterFile = function (tablename, callback) {
            //return select option data
            var data = {
                tagname: tablename
            }

            var header = { 'permissioncode': 'GET_MASTER_FILE' };
            factory.httpPost('service/masterfile/get', data, {}, header, function (err, result) {
                if (err) {
                    callback(err, result);
                } else {
                    callback(null, result);
                }
            });
        }

        factory.sendLoadData = function (url, data, callback) {
            var url = url;
            var option = {};
            var header = {};
            factory.httpPost(url, data, option, header, function (err, result) {
                if (err) {
                    callback(err, result);
                } else {
                    callback(null, result)
                }
            });
        }

        factory.sendRemoveData = function (url, data, callback) {
            var url = url;
            var option = {};
            var header = {};
            factory.httpPost(url, data, option, header, function (err, result) {
                if (err) {
                    callback(err, result);
                } else {
                    callback(null, result)
                }
            });
        }

        factory.convert2Date = function (input, format, slash) {
            if (input == "" || input == undefined || input == null) {
                return null;
            } else {
                var date = new Date(input);
                var month = "";
                var day = "";
                if ((date.getMonth() + 1) > 9) {
                    month = (date.getMonth() + 1);
                } else {
                    month = "0" + (date.getMonth() + 1);
                }
                if (date.getDate() > 9) {
                    day = date.getDate();
                } else {
                    day = "0" + date.getDate();
                }
                if (format == "dmy") {
                    return day + slash + month + slash
                        + date.getFullYear();
                } else if (format == "ymd") {
                    return date.getFullYear() + slash + month
                        + slash + day;
                }
            }
        };

        factory.traverseObjectDateToString = function (data, dateKeyNameList) {
            return traverseDateToString(data, dateKeyNameList);
        }

        function traverseDateToString(object, dateKeyNameList) {
            for (var key in object) {
                if (typeof (object[key]) == "object") {
                    if (dateKeyNameList.indexOf(key) != -1) {
                        object[key] = factory.convert2Date(object[key], "ymd", "-");
                    } else {
                        object[key] = traverseDateToString(object[key], dateKeyNameList);
                    }
                } else if (Array.isArray(object[key])) {
                    object[key] = traverseArrayToString(object[key], dateKeyNameList);
                }
            }
            return object;
        }

        function traverseArrayToString(array, dateKeyNameList) {
            array.forEach(function (element) {
                if (typeof (element) == "object") {
                    element = traverseDateToString(element, dateKeyNameList);
                }
            });
            return array;
        }

        factory.traverseObjectStringToDate = function (data, dateKeyNameList) {
            return traverseStringToDate(data, dateKeyNameList);
        }

        function traverseStringToDate(object, dateKeyNameList) {
            for (var key in object) {
                if (typeof (object[key]) == "object") {
                    object[key] = traverseStringToDate(object[key], dateKeyNameList);
                } else if (Array.isArray(object[key])) {
                    object[key] = traverseArrayToDate(object[key], dateKeyNameList);
                } else {
                    if (dateKeyNameList.indexOf(key) != -1) {
                        object[key] = new Date(object[key]);
                    }
                }
            }
            return object;
        }

        function traverseArrayToDate(array, dateKeyNameList) {
            array.forEach(function (element) {
                if (typeof (element) == "object") {
                    element = traverseStringToDate(element, dateKeyNameList);
                }
            });
            return array;
        }

        factory.toThaiYear = function (date) {
            var temp = new Date(date);
            temp.setFullYear(temp.getFullYear() + 543);
            return temp;
        }

        /**
         * @name BAHTTEXT.js
         * @version 1.0.2
         * @author Earthchie http://www.earthchie.com/
         * @license WTFPL v.2 - http://www.wtfpl.net/
         *
        * Copyright (c) 2014, Earthchie (earthchie@gmail.com)
        */
        factory.generateThaiPrice = function (num, suffix) {
            num = num.toString().replace(/[, ]/g, ''); // remove commas, spaces
            if (isNaN(num) || parseFloat(num) == 0) {
                return 'ศูนย์บาทถ้วน';
            } else {
                var t = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
                var n = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];

                suffix = suffix ? suffix : 'บาทถ้วน';
                if (num.indexOf('.') > -1) { // have decimal

                    var parts = num.toString().split('.');

                    // precision-hack; more accurate than parseFloat the whole number
                    parts[1] = parseFloat('0.' + parts[1]).toFixed(2).toString().split('.')[1];

                    var text = parseInt(parts[0]) ? factory.generateThaiPrice(parts[0]) : '';

                    if (parseInt(parts[1]) > 0) {
                        text = text.replace('ถ้วน', '') + factory.generateThaiPrice(parts[1], 'สตางค์');
                    }

                    return text;

                } else {
                    if (num.length > 7) { // more than (or equal to) 10 millions

                        var overflow = num.substring(0, num.length - 6);
                        var remains = num.slice(-6);
                        return factory.generateThaiPrice(overflow).replace('บาทถ้วน', 'ล้าน') + factory.generateThaiPrice(remains).replace('ศูนย์', '');

                    } else {

                        var text = "";

                        for (var i = 0; i < num.length; i++) {
                            if (parseInt(num.charAt(i)) > 0) {
                                if (num.length > 2 && i == num.length - 1 && num.charAt(i) == 1 && suffix != 'สตางค์') {
                                    text += 'เอ็ด' + t[num.length - 1 - i];
                                } else {
                                    text += n[num.charAt(i)] + t[num.length - 1 - i];
                                }
                            }
                        }

                        // grammar correction
                        text = text.replace('หนึ่งสิบ', 'สิบ');
                        text = text.replace('สองสิบ', 'ยี่สิบ');
                        text = text.replace('สิบหนึ่ง', 'สิบเอ็ด');

                        return text + suffix;
                    }
                }
            }
        }

        factory.convertData2Filter = function (data, idkey, labelkey) {
            var transform = {};
            data.forEach(function (element) {
                if (element[idkey] && element[labelkey]) {
                    transform[element[idkey]] = element[labelkey];
                }
            });
            return transform;
        }
        return factory;


    });